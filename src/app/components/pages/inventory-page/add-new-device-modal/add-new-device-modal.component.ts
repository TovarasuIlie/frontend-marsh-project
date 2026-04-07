import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Device } from '../../../../models/device';
import { CommonModule } from '@angular/common';
import { DeviceService } from '../../../../services/device.service';
import { ToastService } from '../../../../services/toast.service';
import { AlertComponent } from '../../../ui/alert/alert.component';

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

	@Input() isOpen = false;

	@Output() close = new EventEmitter<void>();
	@Output() confirm = new EventEmitter<number>();


	constructor(private fb: FormBuilder, private deviceService: DeviceService, private toastService: ToastService) {}

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
		if (this.deviceForm.valid) {
			this.deviceService.addNewDevice(this.deviceForm.value).subscribe({
				next: (value: Device) => {
					this.toastService.show('Device "' + value.manufacturer + ' ' + value.name + '" has been created successfully!', 'success');
					this.confirm.emit(value.id);
					this.closeModal();
				},
				error: (err) => {
					console.log(err);
					this.errorMessage.set(err.error.message);
				}
			})
		} else {
			this.deviceForm.markAllAsTouched();
		}
	}

	closeModal() {
		this.deviceForm.reset({ type: 1, ramAmount: 8 });
		this.close.emit();
	}

	handleErrorClose() {
		this.errorMessage.set(null);
	}
}
