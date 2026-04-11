import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../../models/user';
import { UserService } from '../../../../services/user.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
	selector: 'app-employee-delete-modal',
	standalone: true,
	imports: [],
	templateUrl: './employee-delete-modal.component.html',
	styleUrl: './employee-delete-modal.component.css'
})
export class EmployeeDeleteModalComponent {

	@Input() employee!: User | null;
	@Input() isOpen = false;
	@Output() close = new EventEmitter<void>();

	constructor(private userService: UserService, private toastService: ToastService) {}

	onConfirm() {
		if(this.employee) {
			this.userService.deleteUser(this.employee.id).subscribe({
				next: () => {
					this.toastService.show("You deleted user successfully!", 'success');
					this.close.emit();
				},
				error: (err) => {
					this.toastService.show(err.error.message, 'error');
				}
			})
		}
	}
}
