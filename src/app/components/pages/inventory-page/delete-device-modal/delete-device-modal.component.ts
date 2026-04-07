import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Device } from '../../../../models/device';
import { DeviceService } from '../../../../services/device.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
	selector: 'app-delete-device-modal',
	standalone: true,
	imports: [],
	templateUrl: './delete-device-modal.component.html',
	styleUrl: './delete-device-modal.component.css'
})
export class DeleteDeviceModalComponent {
	@Input() isOpen = false;
	@Input() device: Device | null = null;

	@Output() close = new EventEmitter<void>();

	constructor(private deviceService: DeviceService, private toastService: ToastService) {}

	onConfirm() {
		if (this.device) {
			this.deviceService.deleteDevice(this.device.id).subscribe({
				next: () => {
					this.toastService.show('Device "' + this.device?.manufacturer + ' ' + this.device?.name + '" has been deleted successfully!', 'success');
					this.close.emit();
				}
			})
		}
	}
}
