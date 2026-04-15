import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Device } from '../../../../models/device';
import { DeviceService } from '../../../../services/device.service';
import { ToastService } from '../../../../services/toast.service';
import { finalize } from 'rxjs';
import { AlertComponent } from "../../../ui/alert/alert.component";

@Component({
	selector: 'app-delete-device-modal',
	standalone: true,
	imports: [AlertComponent],
	templateUrl: './delete-device-modal.component.html',
	styleUrl: './delete-device-modal.component.css'
})
export class DeleteDeviceModalComponent {

	errorMessage = signal<string | null>(null);
	loading = signal<boolean>(false);

	@Input() isOpen = false;
	@Input() device: Device | null = null;

	@Output() close = new EventEmitter<void>();
	@Output() confirmDelete = new EventEmitter<void>();

	constructor(private deviceService: DeviceService, private toastService: ToastService) { }

	onConfirm() {
		if (!this.device) {
			return;
		}

		this.loading.set(true);

		this.deviceService.deleteDevice(this.device.id)
			.pipe(finalize(() => this.loading.set(false)))
			.subscribe({
				next: () => {
					this.toastService.show('Device "' + this.device?.manufacturer + ' ' + this.device?.name + '" has been deleted successfully!', 'success');
					this.confirmDelete.emit();
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


	handleErrorClose() {
		this.errorMessage.set(null);
	}
}
