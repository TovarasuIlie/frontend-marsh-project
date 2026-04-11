import { Component, EventEmitter, Input, OnChanges, Output, signal } from '@angular/core';
import { User } from '../../../../models/user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../services/user.service';
import { ToastService } from '../../../../services/toast.service';
import { AlertComponent } from "../../../ui/alert/alert.component";

@Component({
	selector: 'app-employee-edit-modal',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, AlertComponent],
	templateUrl: './employee-edit-modal.component.html',
	styleUrl: './employee-edit-modal.component.css'
})
export class EmployeeEditModalComponent implements OnChanges {

	errorMessage = signal<string | null>(null);

	@Input() employee!: User | null;
	@Input() isOpen = false;
	@Output() close = new EventEmitter<void>();
	@Output() updatedEmployee = new EventEmitter<User>();

	editForm!: FormGroup;

	constructor(private fb: FormBuilder, private userService: UserService, private toastService: ToastService) {
		this.editForm = this.fb.group({
			name: ['', [Validators.required]],
			role: [null, [Validators.required]],
			location: ['', [Validators.required]],
			email: [{ value: '', disabled: true }]
		});
	}

	ngOnChanges() {
		if (this.employee && this.isOpen) {
			this.editForm.patchValue(this.employee);
		}
	}

	onSubmit() {
		if (this.editForm.valid) {
			if (this.employee) {
				this.userService.editUser(this.employee.id, this.editForm.value).subscribe({
					next: (value) => {
						this.updatedEmployee.emit(value);
						this.toastService.show("Employee edited successfully!", 'success');
						this.closeModal();
					},
					error: (err) => {
						console.log(err);
						this.errorMessage.set(err.error.message);
					}
				})
			}
		}
	}

	closeModal() {
		this.editForm.reset();
		this.close.emit();
	}

	handleErrorClose() {
		throw new Error('Method not implemented.');
	}
}
