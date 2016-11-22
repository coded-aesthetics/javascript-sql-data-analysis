import {Component, OnInit, Inject} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  subscription:Subscription;
  results:any;
  constructor(@Inject('sql') private sql) { }

  ngOnInit() {
    this.subscription = this.sql.results.subscribe((res) => {
      this.results = "Query Result: \n" + JSON.stringify(res);
    });
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.subscription.unsubscribe();
  }

}
