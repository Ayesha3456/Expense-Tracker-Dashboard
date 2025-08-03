import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expense',
  standalone: true, // ✅ Important!
  imports: [CommonModule, FormsModule],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent {
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  formData = {
    type: '',
    name: '',
    amount: 0
  };

  onSave() {
    if (this.formData.type && this.formData.name && this.formData.amount > 0) {
      this.save.emit(this.formData);
    } else {
      alert('Please fill all fields correctly.');
    }
  }
}
