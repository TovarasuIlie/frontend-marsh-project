import { Component, EventEmitter, Input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DeviceService } from '../../../../services/device.service';
import { ToastService } from '../../../../services/toast.service';
import { Device } from '../../../../models/device';
import { CommonModule } from '@angular/common';
import { AlertComponent } from "../../../ui/alert/alert.component";
import { tick } from '@angular/core/testing';

@Component({
	selector: 'app-edit-device-modal',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, AlertComponent],
	templateUrl: './edit-device-modal.component.html',
	styleUrl: './edit-device-modal.component.css'
})
export class EditDeviceModalComponent implements OnChanges {
	editDeviceForm!: FormGroup
	errorMessage = signal<string | null>(null);

	@Input() isOpen = false;
	@Input() deviceId: number | null = null;

	@Output() close = new EventEmitter<void>();


	constructor(private fb: FormBuilder, private deviceService: DeviceService, private toastService: ToastService) {
		this.editDeviceForm = this.fb.group({
			operatingSystem: ['', [Validators.required]],
			osVersion: ['', [Validators.required]],
			processor: ['', [Validators.required]],
			ramAmount: [0, [Validators.required, Validators.min(1)]],
			description: ['', [Validators.maxLength(200)]]
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['deviceId'] && this.deviceId) {
			this.deviceService.getDeviceById(this.deviceId).subscribe(value => {
				this.editDeviceForm.patchValue({
					operatingSystem: value.operatingSystem,
					osVersion: value.osVersion,
					processor: value.processor,
					ramAmount: value.ramAmount,
					description: value.description
				});
			});
		}
	}

	submit() {
		if (this.editDeviceForm.valid && this.deviceId) {
			this.deviceService.editDevice(this.deviceId, this.editDeviceForm.value).subscribe({
				next: (value: Device) => {
					this.toastService.show('Device "' + value.manufacturer + ' ' + value.name + '" has been edited successfully!', 'success');
					this.closeModal();
				},
				error: (err) => {
					console.log(err);
					this.errorMessage.set(err.error.message);
				}
			})
		} else {
			this.editDeviceForm.markAllAsTouched();
		}
	}

	closeModal() {
		this.editDeviceForm.reset({ type: 1, ramAmount: 8 });
		this.close.emit();
	}

	handleErrorClose() {
		this.errorMessage.set(null);
	}
}
