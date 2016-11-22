import { Component } from '@angular/core';
import { SqlService } from './sql.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [{provide: 'sql', useClass:SqlService}]
})
export class AppComponent {
  title = 'app works!!!!';
}
