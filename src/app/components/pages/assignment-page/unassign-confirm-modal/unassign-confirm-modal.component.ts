import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Device } from '../../../../models/device';
import { DeviceService } from '../../../../services/device.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
	selector: 'app-unassign-confirm-modal',
	standalone: true,
	imports: [],
	templateUrl: './unassign-confirm-modal.component.html',
	styleUrl: './unassign-confirm-modal.component.css'
})
export class UnassignConfirmModalComponent {
	@Input() isOpen = false;
	@Input() device: Device | null = null;

	@Output() close = new EventEmitter<void>();
	@Output() confirm = new EventEmitter<void>();

	constructor(private deviceService: DeviceService, private toastService: ToastService) { }

	onConfirm() {
		if (this.device) {
			this.deviceService.toggleDeviceAssignStatus(this.device.id).subscribe({
				next: (value: any) => {
					this.toastService.show(value.message);
					this.confirm.emit();
					this.close.emit();
				}
			})
		}
	}
}
