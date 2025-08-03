
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseComponent } from '../expense/expense.component';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { PieChartComponent } from '../pie-chart/pie-chart.component';

@Component({
  selector: 'app-expense-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ExpenseComponent, BarChartComponent, PieChartComponent],
  templateUrl: './expense-dashboard.component.html',
  styleUrls: ['./expense-dashboard.component.scss']
})
export class ExpenseDashboardComponent implements OnInit {
  showModal = false;
  isEditMode = false;
  editIndex = -1;

  tableData: { type: string; name: string; amount: number; date: string }[] = [];
  filteredData: { type: string; name: string; amount: number; date: string }[] = [];

  totalIncome = 0;
  totalExpense = 0;

  incomeColor: string = '#4caf50';
  expenseColor: string = '#f44336';

  selectedYear: string = 'All';
  selectedMonth: string = 'All';
  availableYears: string[] = [];
  availableMonths: string[] = ['All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  ngOnInit() {
    const savedData = localStorage.getItem('expenseTableData');
    if (savedData) {
      this.tableData = JSON.parse(savedData);
    }

    this.updateYearFilter();
    this.filterByYearAndMonth();
  }

  openModal(index: number = -1) {
    this.editIndex = index;
    this.isEditMode = index > -1;
    this.showModal = true;
  }

  handleSave(data: { type: string; name: string; amount: number }) {
    const currentDate = new Date().toISOString();

    if (this.isEditMode && this.editIndex > -1) {
      this.tableData[this.editIndex] = { ...data, date: currentDate };
    } else {
      this.tableData.push({ ...data, date: currentDate });
    }

    localStorage.setItem('expenseTableData', JSON.stringify(this.tableData));
    this.updateYearFilter();
    this.filterByYearAndMonth();
    this.showModal = false;
    this.editIndex = -1;
    this.isEditMode = false;
  }

  deleteItem(index: number) {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.tableData.splice(index, 1);
      localStorage.setItem('expenseTableData', JSON.stringify(this.tableData));
      this.updateYearFilter();
      this.filterByYearAndMonth();
    }
  }

  updateYearFilter() {
    const years = this.tableData.map(item => new Date(item.date).getFullYear().toString());
    this.availableYears = Array.from(new Set(years)).sort((a, b) => +b - +a);
    this.availableYears.unshift('All');
  }

  filterByYearAndMonth() {
    this.filteredData = this.tableData.filter(item => {
      const itemDate = new Date(item.date);
      const yearMatches = this.selectedYear === 'All' || itemDate.getFullYear().toString() === this.selectedYear;
      const monthMatches = this.selectedMonth === 'All' || itemDate.getMonth() === this.availableMonths.indexOf(this.selectedMonth) - 1;
      return yearMatches && monthMatches;
    });

    this.calculateTotals();
  }

  calculateTotals() {
    this.totalIncome = this.filteredData.filter(item => item.type === 'Income')
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    this.totalExpense = this.filteredData.filter(item => item.type === 'Expense')
      .reduce((acc, curr) => acc + Number(curr.amount), 0);
  }

  exportCSV() {
    const headers = ['Type', 'Name', 'Amount', 'Date'];
    const rows = this.filteredData.map(row => [row.type, row.name, row.amount.toString(), row.date]);
    const csv = [headers, ...rows].map(e => e.join(",")).join("\n");

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'expense_data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}