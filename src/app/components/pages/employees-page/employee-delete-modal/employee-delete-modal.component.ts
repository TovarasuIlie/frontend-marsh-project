import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { User } from '../../../../models/user';
import { UserService } from '../../../../services/user.service';
import { ToastService } from '../../../../services/toast.service';
import { AlertComponent } from "../../../ui/alert/alert.component";
import { finalize } from 'rxjs';

@Component({
	selector: 'app-employee-delete-modal',
	standalone: true,
	imports: [AlertComponent],
	templateUrl: './employee-delete-modal.component.html',
	styleUrl: './employee-delete-modal.component.css'
})
export class EmployeeDeleteModalComponent {

	@Input() employee!: User | null;
	@Input() isOpen = false;
	@Output() close = new EventEmitter<void>();
	@Output() confirm = new EventEmitter<void>();

	errorMessage = signal<string | null>(null);
	loading = signal<boolean>(false);

	constructor(private userService: UserService, private toastService: ToastService) { }

	onConfirm() {
		if (this.employee) {
			this.loading.set(true)
			this.userService.deleteUser(this.employee.id)
				.pipe(finalize(() => this.loading.set(false)))
				.subscribe({
					next: () => {
						this.toastService.show("You deleted user successfully!", 'success');
						this.confirm.emit();
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

	handleErrorClose() {
		this.errorMessage.set(null);
	}
}
