import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { Device } from '../../../models/device';
import { DeviceService } from '../../../services/device.service';
import { PagedResult, PaginationMetadata, PaginationParameters } from '../../../models/paged-result';
import { AssignmentModalComponent } from "./assignment-modal/assignment-modal.component";
import { ToastService } from '../../../services/toast.service';
import { UnassignConfirmModalComponent } from "./unassign-confirm-modal/unassign-confirm-modal.component";
import { PaginationComponent } from "../../ui/pagination/pagination.component";
import { FilterFieldComponent } from "../../ui/filter-field/filter-field.component";

@Component({
	selector: 'app-assignment-page',
	standalone: true,
	imports: [CommonModule, AssignmentModalComponent, UnassignConfirmModalComponent, PaginationComponent, FilterFieldComponent],
	templateUrl: './assignment-page.component.html',
	styleUrl: './assignment-page.component.css'
})
export class AssignmentPageComponent {
	devices = signal<Device[] | null>(null);

	selectedDevice = signal<Device | null>(null);
	isDetailsDeviceModalOpen = false;
	isConfirmationModalOpen = false;

	paginationMetadata = signal<PaginationMetadata>({
		currentPage: 1,
		totalCount: 8,
		totalPages: 1,
		pageSize: 8,
		hasNext: false,
		hasPrevious: false
	});
	pageSizeOptions = [8, 12, 24, 36];
	paginationParameters: PaginationParameters = {
		pageNumber: 1,
		pageSize: this.pageSizeOptions[0],
		filterQuery: null
	}


	constructor(private deviceService: DeviceService, private toastService: ToastService) {
		this.loadDevices()
	}

	loadDevices() {
		this.devices.set(null);
		this.deviceService.getAllUnassignedDevices(this.paginationParameters.pageNumber, this.paginationParameters.pageSize, this.paginationParameters.filterQuery).subscribe({
			next: (value: PagedResult<Device>) => {
				this.devices.set(value.data);
				this.paginationMetadata.set(value.metadata);
			}
		})
	}

	openDetailsModal(device: Device) {
		this.selectedDevice.set(device);
		this.isDetailsDeviceModalOpen = true;
	}

	openUnassignedModal(device: Device) {
		this.selectedDevice.set(device);
		this.isConfirmationModalOpen = true;
	}

	handleCloseDetailModal() {
		this.isDetailsDeviceModalOpen = false
		this.selectedDevice.set(null);
	}

	handleConfirmAssign() {
		this.loadDevices();
	}

	paginationChange(paginationParameters: PaginationParameters) {
		this.paginationParameters = paginationParameters;
		this.loadDevices();
	}

	applyFilter(querySearch: string | null) {
		console.log(querySearch);
		if (querySearch) {
			this.paginationParameters.filterQuery = querySearch;
		} else {
			this.paginationParameters.filterQuery = null;
		}
		this.loadDevices();
	}
}
