import {Component, OnInit, Inject} from '@angular/core';
import {ToastyService, ToastyConfig} from 'ng2-toasty';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent implements OnInit {

  public queryStr:string;

  constructor(@Inject('sql') private sql, private toastyService:ToastyService) { }

  onQueryChange(evt) {
    try {
      this.sql.query(evt);
    } catch (e) {
      console.log(e);
      this.toastyService.clearAll();
      this.toastyService.error(e.message);
      return;
    }
    this.toastyService.clearAll();
  }

  ngOnInit() {
    this.queryStr = "select avg(gdp) from countries where population < 1000000";
    this.onQueryChange(this.queryStr);
  }

}
