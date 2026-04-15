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

	devices = signal<Device[] | null>(null);

	paginationMetadata = signal<PaginationMetadata>({
		currentPage: 1,
		totalCount: 10,
		totalPages: 1,
		pageSize: 10,
		hasNext: false,
		hasPrevious: false
	});

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
		this.devices.set(null);
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
		if((this.devices()?.length ?? 0) <= 1 && this.paginationParameters.pageNumber > 1) {
			this.paginationParameters.pageNumber--;
		}
		this.loadDevices();
		this.selectedDevice.set(null);
	}

	handleCloseEditModal(updatedDevice: Device) {
		this.selectedDevice.set(null);
		this.devices.update(list => 
			list ? list?.map(device => device.id === updatedDevice.id ? updatedDevice : device) : list
		)
	}

	editDevice(device: Device | null, event: Event) {
		event.stopPropagation();
		this.isEditDeviceModalOpen = true;
		this.selectedDevice.set(device);
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
