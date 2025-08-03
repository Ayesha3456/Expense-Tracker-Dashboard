import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnChanges {
  @Input() editData: any = null;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  formData = {
    type: '',
    name: '',
    amount: 0
  };

  ngOnChanges() {
    if (this.editData) {
      this.formData = { ...this.editData };
    }
  }

  onSave() {
    if (this.formData.type && this.formData.name && this.formData.amount > 0) {
      this.save.emit(this.formData);
    } else {
      alert('Please fill all fields correctly.');
    }
  }
}
