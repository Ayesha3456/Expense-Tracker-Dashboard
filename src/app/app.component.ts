import { Component } from '@angular/core';
import { ExpenseDashboardComponent } from './expense-dashboard/expense-dashboard.component';

@Component({
  selector: 'app-root',
  imports: [ExpenseDashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'expensetrackerapp';
}
