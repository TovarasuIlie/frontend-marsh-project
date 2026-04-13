import { Component, effect, EventEmitter, Input, OnChanges, Output, signal } from '@angular/core';
import { User } from '../../../../models/user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../services/user.service';
import { ToastService } from '../../../../services/toast.service';
import { AlertComponent } from "../../../ui/alert/alert.component";
import { finalize } from 'rxjs';

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

	loading = signal<boolean>(false);

	constructor(private fb: FormBuilder, private userService: UserService, private toastService: ToastService) {
		this.editForm = this.fb.group({
			name: ['', [Validators.required, Validators.pattern(/^[A-Z][a-z]+(?:[ \-][A-Z][a-z]+)$/)]],
			role: [null, [Validators.required]],
			location: ['', [Validators.required, Validators.pattern(/^[A-Z][a-z]+(?:[ \-][A-Z][a-z]+)*, [A-Z]{2}$/)]],
			email: [{ value: '', disabled: true }]
		});

		effect(() => {
			if (this.loading()) {
				this.editForm.disable();
			} else {
				this.editForm.enable();
			}
		})
	}

	ngOnChanges() {
		if (this.employee && this.isOpen) {
			this.editForm.patchValue(this.employee);
		}
	}

	onSubmit() {
		if (this.editForm.invalid) {
			this.editForm.markAllAsTouched();
			return;
		}

		if (this.employee) {
				this.loading.set(true);
				
				this.userService.editUser(this.employee.id, this.editForm.value)
					.pipe(finalize(() => this.loading.set(false)))
					.subscribe({
						next: (value) => {
							this.updatedEmployee.emit(value);
							this.toastService.show("Employee edited successfully!", 'success');
							this.closeModal();
						},
						error: (err) => {
							if (err.status) {
								this.errorMessage.set(err.error.message);
							} else {
								this.errorMessage.set("We couldn't establish a secure handshake with the server. Ensure you have an active internet connection and try again.");
							}
						}
					})
			}
	}

	closeModal() {
		this.editForm.reset();
		this.close.emit();
	}

	handleErrorClose() {
		this.errorMessage.set(null);
	}

	isInvalid(controlName: string): boolean {
		const control = this.editForm.get(controlName);
		return !!(control && control.invalid && (control.dirty || control.touched));
	}
}
