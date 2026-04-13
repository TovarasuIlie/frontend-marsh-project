import { Component, effect, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Device } from '../../../../models/device';
import { CommonModule } from '@angular/common';
import { DeviceService } from '../../../../services/device.service';
import { ToastService } from '../../../../services/toast.service';
import { AlertComponent } from '../../../ui/alert/alert.component';
import { finalize } from 'rxjs';

@Component({
	selector: 'app-add-new-device-modal',
	standalone: true,
	imports: [ReactiveFormsModule, CommonModule, AlertComponent],
	templateUrl: './add-new-device-modal.component.html',
	styleUrl: './add-new-device-modal.component.css'
})
export class AddNewDeviceModalComponent implements OnInit {
	deviceForm!: FormGroup
	errorMessage = signal<string | null>(null);
	loading = signal<boolean>(false);

	@Input() isOpen = false;

	@Output() close = new EventEmitter<void>();
	@Output() confirm = new EventEmitter<number>();


	constructor(private fb: FormBuilder, private deviceService: DeviceService, private toastService: ToastService) {
		effect(() => {
			if (this.loading()) {
				this.deviceForm.disable();
			} else {
				this.deviceForm.enable();
			}
		})
	}

	ngOnInit(): void {
		this.deviceForm = this.fb.group({
			name: ['', [Validators.required]],
			manufacturer: ['', [Validators.required]],
			type: [1, [Validators.required]],
			operatingSystem: ['', [Validators.required]],
			osVersion: ['', [Validators.required]],
			processor: ['', [Validators.required]],
			ramAmount: [8, [Validators.required, Validators.min(1)]],
			description: ['', [Validators.maxLength(200)]]
		});
	}

	submit() {
		if (this.deviceForm.invalid) {
			this.deviceForm.markAllAsTouched();
			return;
		}

		this.loading.set(true);

		this.deviceService.addNewDevice(this.deviceForm.value)
			.pipe(finalize(() => this.loading.set(false)))
			.subscribe({
				next: (value: Device) => {
					this.toastService.show('Device "' + value.manufacturer + ' ' + value.name + '" has been created successfully!', 'success');
					this.confirm.emit(value.id);
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
		this.deviceForm.reset({ type: 1, ramAmount: 8 });
		this.close.emit();
	}

	handleErrorClose() {
		this.errorMessage.set(null);
	}
}
