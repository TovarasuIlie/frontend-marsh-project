import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Device } from '../../../../models/device';
import { DeviceService } from '../../../../services/device.service';
import { ToastService } from '../../../../services/toast.service';
import { finalize } from 'rxjs';
import { AlertComponent } from "../../../ui/alert/alert.component";

@Component({
	selector: 'app-unassign-confirm-modal',
	standalone: true,
	imports: [AlertComponent],
	templateUrl: './unassign-confirm-modal.component.html',
	styleUrl: './unassign-confirm-modal.component.css'
})
export class UnassignConfirmModalComponent {

	@Input() isOpen = false;
	@Input() device: Device | null = null;

	@Output() close = new EventEmitter<void>();
	@Output() confirm = new EventEmitter<Device>();

	loading = signal<boolean>(false);
	errorMessage = signal<string | null>(null);

	constructor(private deviceService: DeviceService, private toastService: ToastService) { }

	onConfirm() {
		if (this.device) {
			this.loading.set(true);
			this.deviceService.toggleDeviceAssignStatus(this.device.id)
				.pipe(finalize(() => this.loading.set(false)))
				.subscribe({
					next: (value: any) => {
						this.toastService.show(value.message, "success");
						this.confirm.emit();
						this.close.emit();
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
