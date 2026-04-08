import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { Device } from '../../../models/device';
import { DeviceService } from '../../../services/device.service';
import { PagedResult, PaginationMetadata } from '../../../models/paged-result';
import { AssignmentModalComponent } from "./assignment-modal/assignment-modal.component";
import { ToastService } from '../../../services/toast.service';
import { UnassignConfirmModalComponent } from "./unassign-confirm-modal/unassign-confirm-modal.component";

@Component({
	selector: 'app-assignment-page',
	standalone: true,
	imports: [CommonModule, AssignmentModalComponent, UnassignConfirmModalComponent],
	templateUrl: './assignment-page.component.html',
	styleUrl: './assignment-page.component.css'
})
export class AssignmentPageComponent {
	searchQuery = signal('');
	filterStatus = signal<'all' | 'assigned' | 'available'>('all');
	devices = signal<Device[]>([]);

	selectedDevice = signal<Device | null>(null);
	isDetailsDeviceModalOpen = false;
	isConfirmationModalOpen = false;

	paginationMetadata = signal<PaginationMetadata | null>(null);
	currentPage: number = 1;
	pageSize: number = 8;
	pageSizeOptions = [8, 12, 24];


	constructor(private deviceService: DeviceService, private toastService: ToastService) {
		this.loadDevices()
	}

	loadDevices() {
		this.deviceService.getAllUnassignedDevices(this.currentPage, this.pageSize).subscribe({
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

	// filteredDevices = computed(() => {
	// 	const query = this.searchQuery().toLowerCase();
	// 	const status = this.filterStatus();

	// 	return this.devices().filter(d => {
	// 		const matchesSearch = d.name.toLowerCase().includes(query) ||
	// 			(d.currentUser?.toLowerCase().includes(query) ?? false);
	// 		const matchesStatus = status === 'all' || d.status === status;
	// 		return matchesSearch && matchesStatus;
	// 	});
	// });

	unassignedCount = computed(() => this.devices().filter(d => d.assignedToUser == null).length);

	toggleAssignStatus(deviceId: number) {
		this.deviceService.toggleDeviceAssignStatus(deviceId).subscribe({
			next: (value: any) => {
				this.toastService.show(value.message);
				this.loadDevices();
			}
		})
	}

	goToPage(page: number) {
		this.currentPage = page;
		this.loadDevices();
	}

	nextPage() {
		if (this.paginationMetadata()?.hasNext) {
			this.currentPage++;
		}
		this.loadDevices();
	}

	prevPage() {
		if (this.paginationMetadata()?.hasPrevious && this.currentPage > 1) {
			this.currentPage--;
		}
		this.loadDevices();
	}

	onPageSizeChange(pageSize: number) {
		this.pageSize = pageSize;
		this.currentPage = 1;
		this.loadDevices();
	}
}
