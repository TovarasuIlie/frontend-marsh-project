import { Component, effect, EventEmitter, Input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DeviceService } from '../../../../services/device.service';
import { ToastService } from '../../../../services/toast.service';
import { Device } from '../../../../models/device';
import { CommonModule } from '@angular/common';
import { AlertComponent } from "../../../ui/alert/alert.component";
import { finalize } from 'rxjs';

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
	loading = signal<boolean>(false);

	@Input() isOpen = false;
	@Input() device: Device | null = null;

	@Output() close = new EventEmitter<void>();
	@Output() updatedDevice = new EventEmitter<Device>();


	constructor(private fb: FormBuilder, private deviceService: DeviceService, private toastService: ToastService) {
		this.editDeviceForm = this.fb.group({
			operatingSystem: ['', [Validators.required]],
			osVersion: ['', [Validators.required]],
			processor: ['', [Validators.required]],
			ramAmount: [0, [Validators.required, Validators.min(1)]],
			description: ['', [Validators.maxLength(200)]]
		});

		effect(() => {
			if (this.loading()) {
				this.editDeviceForm.disable();
			} else {
				this.editDeviceForm.enable();
			}
		})
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['device'] && this.device) {
			this.editDeviceForm.patchValue({
				operatingSystem: this.device.operatingSystem,
				osVersion: this.device.osVersion,
				processor: this.device.processor,
				ramAmount: this.device.ramAmount,
				description: this.device.description
			});
		}
	}

	submit() {
		if (this.editDeviceForm.invalid || !this.device) {
			this.editDeviceForm.markAllAsTouched();
			return;
		}

		this.loading.set(true);

		this.deviceService.editDevice(this.device.id, this.editDeviceForm.value)
			.pipe(finalize(() => this.loading.set(false)))
			.subscribe({
				next: (value: Device) => {
					this.updatedDevice.emit(value);
					this.toastService.show('Device "' + value.manufacturer + ' ' + value.name + '" has been edited successfully!', 'success');
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

	closeModal() {
		this.errorMessage.set(null);
		this.editDeviceForm.reset({ type: 1, ramAmount: 8 });
		this.close.emit();
	}

	handleErrorClose() {
		this.errorMessage.set(null);
	}
}
