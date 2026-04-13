import { Component, computed, signal } from '@angular/core';
import { Device } from '../../../models/device';
import { DeviceService } from '../../../services/device.service';
import { DetailsModalComponent } from "./details-modal/details-modal.component";
import { PagedResult, PaginationMetadata, PaginationParameters } from '../../../models/paged-result';
import { AddNewDeviceModalComponent } from "./add-new-device-modal/add-new-device-modal.component";
import { DeleteDeviceModalComponent } from "./delete-device-modal/delete-device-modal.component";
import { EditDeviceModalComponent } from "./edit-device-modal/edit-device-modal.component";
import { CommonModule } from '@angular/common';
import { PaginationComponent } from "../../ui/pagination/pagination.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilterFieldComponent } from "../../ui/filter-field/filter-field.component";

@Component({
	selector: 'app-inventory-page',
	standalone: true,
	imports: [CommonModule, DetailsModalComponent, AddNewDeviceModalComponent, DeleteDeviceModalComponent, EditDeviceModalComponent, PaginationComponent, FilterFieldComponent],
	templateUrl: './inventory-page.component.html',
	styleUrl: './inventory-page.component.css'
})
export class InventoryPageComponent {

	devices = signal<Device[]>([]);

	paginationMetadata = signal<PaginationMetadata | null>(null);
	pageSizeOptions = [10, 20, 50, 100];
	paginationParameters: PaginationParameters = {
		pageNumber: 1,
		pageSize: this.pageSizeOptions[0],
		filterQuery: ""
	}

	selectedDeviceId = signal<number | null>(null);
	selectedDevice = signal<Device | null>(null);

	isDetailsDeviceModalOpen = false;
	isRegisterDeviceModalOpen = false;
	isDeleteConfirmationModalOpen = false;
	isEditDeviceModalOpen = false;

	filterForm!: FormGroup;

	constructor(private deviceService: DeviceService, private fb: FormBuilder) {
		this.filterForm = this.fb.group({
			querySearch: ['', [Validators.minLength(3)]],
		})
	}

	ngOnInit() {
		this.loadDevices();
	}

	loadDevices() {
		this.deviceService.getAllDevices(this.paginationParameters.pageNumber, this.paginationParameters.pageSize, this.paginationParameters.filterQuery).subscribe({
			next: (value: PagedResult<Device>) => {
				this.devices.set(value.data);
				this.paginationMetadata.set(value.metadata);
			}
		})
	}

	handleCloseRegisterDeviceModal(deviceId: number) {
		this.loadDevices();
		this.openDetailsModal(deviceId);
	}

	openDetailsModal(deviceId: number) {
		this.selectedDeviceId.set(deviceId);
		this.isDetailsDeviceModalOpen = true;
	}

	handleCloseDetailModal() {
		this.isDetailsDeviceModalOpen = false
		this.selectedDeviceId.set(null);
	}

	deleteDevice(device: Device | null, event: Event) {
		event.stopPropagation();
		this.isDeleteConfirmationModalOpen = true;
		this.selectedDevice.set(device);
	}

	handleCloseDeleteModal() {
		this.loadDevices();
		this.selectedDevice.set(null);
	}

	editDevice(deviceId: number | null, event: Event) {
		event.stopPropagation();
		this.isEditDeviceModalOpen = true;
		this.selectedDeviceId.set(deviceId);
	}

	paginationChange(paginationParameters: PaginationParameters) {
		this.paginationParameters = paginationParameters;
		this.loadDevices();
	}

	onRamAmountChange(ramAmount: number) {
		this.filterForm.patchValue({
			ramAmount: ramAmount
		})
	}

	applyFilter(querySearch: string | null) {
		if (querySearch) {
			this.paginationParameters.filterQuery = querySearch;
		} else {
			this.paginationParameters.filterQuery = null;
		}
		this.loadDevices();
	}
}
