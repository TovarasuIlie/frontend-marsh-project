import { Component, computed, signal } from '@angular/core';
import { Device } from '../../../models/device';
import { DeviceService } from '../../../services/device.service';
import { DetailsModalComponent } from "./details-modal/details-modal.component";
import { PagedResult, PaginationMetadata } from '../../../models/paged-result';
import { AddNewDeviceModalComponent } from "./add-new-device-modal/add-new-device-modal.component";
import { DeleteDeviceModalComponent } from "./delete-device-modal/delete-device-modal.component";
import { EditDeviceModalComponent } from "./edit-device-modal/edit-device-modal.component";

@Component({
	selector: 'app-inventory-page',
	standalone: true,
	imports: [DetailsModalComponent, AddNewDeviceModalComponent, DeleteDeviceModalComponent, EditDeviceModalComponent],
	templateUrl: './inventory-page.component.html',
	styleUrl: './inventory-page.component.css'
})
export class InventoryPageComponent {

	devices = signal<Device[]>([]);

	paginationMetadata = signal<PaginationMetadata | null>(null);
	currentPage: number = 1;
	pageSize: number = 5;

	selectedDeviceId = signal<number | null>(null);
	selectedDevice = signal<Device | null>(null);

	isDetailsDeviceModalOpen = false;
	isRegisterDeviceModalOpen = false;
	isDeleteConfirmationModalOpen = false;
	isEditDeviceModalOpen = false;

	constructor(private deviceService: DeviceService) {}

	ngOnInit() {
		this.loadDevices();
	}

	loadDevices() {
		this.deviceService.getAllDevices(this.currentPage, this.pageSize).subscribe({
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

	goToPage(page: number) {
		this.currentPage = page;
		this.loadDevices();
	}

	nextPage() {
		if(this.paginationMetadata()?.hasNext) {
			this.currentPage ++;
		}
		this.loadDevices();
	}

	prevPage() {
		if(this.paginationMetadata()?.hasPrevious && this.currentPage > 1) {
			this.currentPage --;
		}
		this.loadDevices();
	}

	onPageSizeChange(event: Event) {
		this.pageSize = +(event.target as HTMLSelectElement).value;
		this.currentPage = 1;
		this.loadDevices();
	}
}
