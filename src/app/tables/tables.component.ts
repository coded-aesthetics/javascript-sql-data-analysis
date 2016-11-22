import {Component, OnInit, Inject} from '@angular/core';
import {ToastyService, ToastyConfig} from 'ng2-toasty';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit {

  public tablesStr;

  constructor(@Inject('sql') private sql, private toastyService:ToastyService, private toastyConfig: ToastyConfig) {
    this.toastyConfig.theme = 'default';
  }

  tablesStringChanged(evt) {
    try {
      this.sql.setTables(evt);
    } catch (e) {
      this.toastyService.clearAll();
      this.toastyService.error(e);
      console.log("caught", e);
      return;
    }
    this.toastyService.clearAll();
    this.toastyService.success('Valid JSON!');
  }

  ngOnInit() {
    this.tablesStr = `{"countries":[{"country":"Fiji","population":892145,"gdp":4386}, {"country":"Suriname","population":542975,"gdp":4878},{"country":"UAE","population":9156963,"gdp":307293},{"country":"Angola","population":25021974,"gdp":102643},{"country":"Argentina","population":43416755,"gdp":529726},{"country":"Japan","population":126958000,"gdp":4123000},{"country":"Germany","population":81413145,"gdp":3356000},{"country":"USA","population":321418000,"gdp":16663000}]}`;
    this.tablesStringChanged(this.tablesStr);
  }

}
