import { Component, EventEmitter, Input, Output, signal, SimpleChanges } from '@angular/core';
import { DeviceService } from '../../../../services/device.service';
import { Device } from '../../../../models/device';
import { ToastService } from '../../../../services/toast.service';
import { finalize } from 'rxjs';
import { AlertComponent } from "../../../ui/alert/alert.component";

@Component({
	selector: 'app-assignment-modal',
	standalone: true,
	imports: [AlertComponent],
	templateUrl: './assignment-modal.component.html',
	styleUrl: './assignment-modal.component.css'
})
export class AssignmentModalComponent {

	@Input() isOpen = false;
	@Input() device: Device | null = null;

	@Output() close = new EventEmitter<void>();
	@Output() confirm = new EventEmitter<Device>();

	showDescription = signal<boolean>(false);
	deviceDescription = signal<any>(undefined);
	loading = signal<boolean>(false);
	errorMessage = signal<string | null>(null);

	constructor(private deviceService: DeviceService, private toastService: ToastService) { }

	ngOnChanges(changes: SimpleChanges): void {
		this.deviceDescription.set(null);
		if (changes['device'] && this.device) {
			this.loading.set(false);
		}
	}

	generateDeviceDescription() {
		if (this.device) {
			this.showDescription.set(true);
			this.deviceService.getDeviceDescriptionGenerated(this.device.id).subscribe({
				next: (value) => {
					this.deviceDescription.set(value);
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

	toggleAssignStatus(deviceId: number) {
		this.loading.set(true);

		this.deviceService.toggleDeviceAssignStatus(deviceId)
			.pipe(finalize(() => this.loading.set(false)))
			.subscribe({
				next: (value: any) => {
					this.toastService.show(value.message, 'success');
					this.confirm.emit();
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

	handleErrorClose() {
		this.errorMessage.set(null);
	}

	closeModal() {
		this.close.emit();
	}
}
