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
    this.queryStr = `select first_name, last_name from people where "friends.every((fr) => {return fr.funny && fr.spontaneous})" == 'true'`;
    this.onQueryChange(this.queryStr);
  }

}
