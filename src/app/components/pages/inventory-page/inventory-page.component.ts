import { Component, computed, signal } from '@angular/core';
import { Device } from '../../../models/device';

@Component({
	selector: 'app-inventory-page',
	standalone: true,
	imports: [],
	templateUrl: './inventory-page.component.html',
	styleUrl: './inventory-page.component.css'
})
export class InventoryPageComponent {

	devices = signal<Device[]>([]);
	isModalOpen = signal(false);
	selectedDevice = signal<Device | null>(null);
	currentPage = signal(1);
	pageSize = signal(5);

	ngOnInit() {
		this.loadDevices();
	}

	loadDevices() {
		// Phase 1 API Call would go here. Mocking for now:
		this.devices.set([
			{
				id: 1,
				name: 'iPhone 15 Pro',
				manufacturer: 'Apple',
				type: 1, // Assuming 1 = Smartphone
				operatingSystem: 'iOS',
				osVersion: '17.4',
				processor: 'A17 Pro',
				ramAmount: 8,
				description: 'Titanium blue finish, company-issued for mobile dev team.'
			},
			{
				id: 2,
				name: 'Galaxy S24 Ultra',
				manufacturer: 'Samsung',
				type: 1,
				operatingSystem: 'Android',
				osVersion: '14.0',
				processor: 'Snapdragon 8 Gen 3',
				ramAmount: 12,
				description: 'High-end testing device for Android performance benchmarks.'
			},
			{
				id: 3,
				name: 'Pixel Tablet',
				manufacturer: 'Google',
				type: 2, // Assuming 2 = Tablet
				operatingSystem: 'Android',
				osVersion: '14.0',
				processor: 'Google Tensor G2',
				ramAmount: 8,
				description: 'Used for front-desk check-ins and kiosk mode testing.'
			},
			{
				id: 4,
				name: 'MacBook Pro 14',
				manufacturer: 'Apple',
				type: 3, // Assuming 3 = Laptop
				operatingSystem: 'macOS',
				osVersion: '14.2 (Sonoma)',
				processor: 'M3 Pro',
				ramAmount: 18,
				description: 'Standard issue workstation for senior software engineers.'
			},
			{
				id: 5,
				name: 'Surface Pro 9',
				manufacturer: 'Microsoft',
				type: 2,
				operatingSystem: 'Windows',
				osVersion: '11 Pro',
				processor: 'Intel Core i7-1255U',
				ramAmount: 16,
				description: 'Versatile 2-in-1 for project managers and on-site visits.'
			},
			{
				id: 6,
				name: 'XPS 15',
				manufacturer: 'Dell',
				type: 3,
				operatingSystem: 'Windows',
				osVersion: '11 Pro',
				processor: 'Intel Core i9-13900H',
				ramAmount: 32,
				description: 'Heavy-duty machine used for video processing and CAD design.'
			},
			{
				id: 7,
				name: 'iPad Air',
				manufacturer: 'Apple',
				type: 2,
				operatingSystem: 'iPadOS',
				osVersion: '17.1',
				processor: 'M1',
				ramAmount: 8,
				description: 'Assigned to the UX/UI team for mobile wireframing.'
			}
		]);
	}

	openDetailsModal(device: Device) {
		this.selectedDevice.set(device);
		this.isModalOpen.set(true);
	}

	closeModal() {
		this.isModalOpen.set(false);
		setTimeout(() => this.selectedDevice.set(null), 300);
	}

	deleteDevice(id: number | undefined, event: Event) {
		event.stopPropagation();
		if (confirm('Are you sure you want to delete this device permanently?')) {
			this.devices.update(prev => prev.filter(d => d.id !== id));
			console.log(`Device ${id} deleted.`);
		}
	}

	displayRange = computed(() => {
		const start = (this.currentPage() - 1) * this.pageSize() + 1;
		const end = Math.min(this.currentPage() * this.pageSize(), this.devices().length);
		return { start, end };
	});

	paginatedDevices = computed(() => {
		const start = (this.currentPage() - 1) * this.pageSize();
		const end = start + this.pageSize();
		return this.devices().slice(start, end);
	});

	totalPages = computed(() => Math.ceil(this.devices().length / this.pageSize()));

	goToPage(page: number) {
		if (page >= 1 && page <= this.totalPages()) {
			this.currentPage.set(page);
		}
	}

	nextPage() {
		if (this.currentPage() < this.totalPages()) {
			this.currentPage.update(p => p + 1);
		}
	}

	prevPage() {
		if (this.currentPage() > 1) {
			this.currentPage.update(p => p - 1);
		}
	}

	onPageSizeChange(event: Event) {
		const newSize = +(event.target as HTMLSelectElement).value;
		this.pageSize.set(newSize);
		this.currentPage.set(1);
	}
}
