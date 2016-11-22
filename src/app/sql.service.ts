import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import sqliteParser from 'sqlite-parser';

declare var sqliteParser:any;

@Injectable()
export class SqlService {

  public tables:Object;
  public parseError:string;

  private _resultsAvailable = new BehaviorSubject<any>(0);
  private results = this._resultsAvailable.asObservable();

  constructor() {
    this.tables = {};
  }

  setTables(tablesStr: string) {
     try {
       this.tables = JSON.parse(tablesStr);
     } catch (e) {
       throw "Invalid JSON!";
     }
  }

  doQuery(ast):any {
    var statement = ast.statement[0];
    if (statement.variant !== "select") {
      throw new Error("only selects supported");
    }
    /***** **** *** **      *        *            *                      *
     * gather query information
     *         *     *   *  ** *** ***** ***********/
    let selectField, selectFields, functionName;
    let result = statement.result;
    let selectType = statement.result[0].type;
    if (selectType === "function") {
      functionName = result[0].name.name;
      selectField = result[0].args.expression ? result[0].args.expression[0].name : result[0].args.name;
    } else {
      if (result.length === 1) {
        selectField = result[0].name;
      } else {
        selectFields = result.map((cur) => {return cur.name});
      }
    }
    let from = statement.from.name;
    /*console.log("from", from);
    console.log("selectType", selectType);
    console.log("selectField", selectField);*/
    if (!this.tables[from]) {
      throw new Error(`Table ${from} could not be found.`);
    }

    let out = this.tables[from];

    /***** **** *** **      *        *            *                      *
     *   WHERE <--> Filter Phase
     *         *     *   *  ** *** ***** ***********/
    if (statement.where) {
      var operation = statement.where[0].operation;
      var left = statement.where[0].left.name;
      var right = statement.where[0].right.value;
      if (operation === "=") {
        operation = "==";
      }

      //console.log(`cur['${left}'] ${operation} ${right}`);
      if (operation !== "like") {
        out = out.filter((cur) => {
          if (typeof cur[left] === "string") {
            return eval(`cur['${left}'] ${operation} "${right}"`);
          }
          return eval(`cur['${left}'] ${operation} ${right}`);
        });
      } else {
        right = "" + right;
        let search = right.split("%").join("");
        let begin = right.startsWith("%");
        let end = right.endsWith("%");
        out = out.filter((cur) => {
          if (!cur[left]) return false;
          let field = cur[left] + "";
          if (begin) {
            return field.endsWith(search);
          }
          if (end) {
            return field.startsWith(search);
          }
          return field.includes(search);
        });
      }
      console.log("Filter Phase: ", JSON.stringify(out));
    }
    /***** **** *** **      *        *            *                      *
     *   ORDER BY <--> Sort Phase
     *         *     *   *  ** *** ***** ***********/
    if (statement.order) {
      let order = statement.order[0];
      if (order.variant == "order") {
        let orderColumn = order.expression.name;
        let orderDir = order.direction;
        out = out.sort((o1, o2) => {
          let a = o1[orderColumn];
          let b = o2[orderColumn];
          if (a == null) { return -1; }
          if (b == null) { return 1; }
          if (typeof a === 'number') {
            if (orderDir == 'asc') {
              return a - b;
            } else {
              return b - a;
            }
          }
          if (typeof a === 'string') {
            if (orderDir == 'asc') {
              return a.localeCompare(b);
            } else {
              return b.localeCompare(a);
            }
          }
        });
        console.log("Sort Phase: ", JSON.stringify(out));
      }
    }
    /***** **** *** **      *        *            *                      *
     *   SELECT <--> Map Phase
     *         *     *   *  ** *** ***** ***********/
    if (selectField !== "*") {
      if (selectType === "function") {
        out = out.map((cur) => {return cur[selectField]});
      } else {
        out = out.map((cur) => {
          if (selectField) {
            console.log(cur, selectField);
            return {[selectField]: cur[selectField]};
          }
          if (selectFields) {
            return selectFields.reduce((red, one) => {
              red[one] = cur[one];
              console.log(cur);
              return red;
            }, {});
          }
        });
      }
      console.log("Map Phase: ", JSON.stringify(out));
    }

    /***** **** *** **      *        *            *                      *
     *   Implemented aggregation functions
     *         *     *   *  ** *** ***** ***********/
    const funcs = {
      sum: (arr) => {
        return arr.reduce((red, cur) => {
          return cur + red;
        }, 0);
      },
      avg: (arr) => {
        let a = arr.reduce((red, cur) => {
          return cur + red;
        }, 0);
        return a / arr.length;
      },
      min: (arr) => {
        return arr.reduce((red, cur) => {
          return Math.min(red, cur);
        }, Number.POSITIVE_INFINITY);
      },
      max: (arr) => {
        return arr.reduce((red, cur) => {
          return Math.max(red, cur);
        }, Number.NEGATIVE_INFINITY);
      },
      count: (arr) => {
        return arr.length;
      }
    };

    /***** **** *** **      *        *            *                      *
     *   AGGREGATE <--> Reduce Phase
     *         *     *   *  ** *** ***** ***********/
    if (selectType === "function" && funcs[functionName]) {
      let func = funcs[functionName];
      let out2 = func(out);
      console.log("Reduce Phase: ", JSON.stringify(out2));
      return out2;
    }
    if (selectType === "function" && !funcs[functionName]) {
      throw new Error(`function ${functionName} is not supported (or does not exist)`);
    }
    return out;
  }

  query(queryStr: string) {
    let ast;
    let result;
    try {
      ast = sqliteParser(queryStr);
    } catch (e) {
      this.parseError = e.message;
      throw e;
    }
    try {
      result = this.doQuery(ast);
    } catch (e) {
      throw e;
    }
    this._resultsAvailable.next(result);
    return result;
  }

}
