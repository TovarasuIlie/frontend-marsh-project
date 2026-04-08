import { Component, EventEmitter, Input, Output, signal, SimpleChanges } from '@angular/core';
import { DeviceService } from '../../../../services/device.service';
import { Device } from '../../../../models/device';
import { ToastService } from '../../../../services/toast.service';

@Component({
	selector: 'app-assignment-modal',
	standalone: true,
	imports: [],
	templateUrl: './assignment-modal.component.html',
	styleUrl: './assignment-modal.component.css'
})
export class AssignmentModalComponent {
	@Input() isOpen = false;
	@Input() device: Device | null = null;

	@Output() close = new EventEmitter<void>();
	@Output() confirm = new EventEmitter<void>();

	deviceDescription = signal<any>(undefined);

	constructor(private deviceService: DeviceService, private toastService: ToastService) { }

	ngOnChanges(changes: SimpleChanges): void {
		this.deviceDescription.set(null);
		if (changes['deviceId'] && this.device) {
			this.deviceService.getDeviceById(this.device.id).subscribe(value => {
				this.device = value;
			})
		}
	}

	generateDeviceDescription() {
		if (this.device) {
			this.deviceService.getDeviceDescriptionGenerated(this.device.id).subscribe({
				next: (value) => {
					this.deviceDescription.set(value);
				}
			})
		}
	}

	toggleAssignStatus(deviceId: number) {
		this.deviceService.toggleDeviceAssignStatus(deviceId).subscribe({
			next: (value: any) => {
				this.toastService.show(value.message);
				this.confirm.emit();
				this.closeModal();
			}
		})
	}

	closeModal() {
		this.close.emit();
	}
}
