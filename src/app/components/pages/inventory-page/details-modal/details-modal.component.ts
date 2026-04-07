import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Device } from '../../../../models/device';
import { DeviceService } from '../../../../services/device.service';

@Component({
	selector: 'app-details-modal',
	standalone: true,
	imports: [],
	templateUrl: './details-modal.component.html',
	styleUrl: './details-modal.component.css'
})
export class DetailsModalComponent implements OnChanges {

	@Input() isOpen = false;
	@Input() deviceId: number | null = null;

	@Output() close = new EventEmitter<void>();

	device!: Device;

	constructor(private deviceService: DeviceService) {}

	ngOnChanges(changes: SimpleChanges): void {
		if(changes['deviceId'] && this.deviceId) {
			this.deviceService.getDeviceById(this.deviceId).subscribe(value => {
        		this.device = value;
			})
		}
	}

	closeModal() {
		this.close.emit();
	}
}
