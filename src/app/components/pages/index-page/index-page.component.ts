import { Component, computed, signal } from '@angular/core';

@Component({
	selector: 'app-index-page',
	standalone: true,
	imports: [],
	templateUrl: './index-page.component.html',
	styleUrl: './index-page.component.css'
})
export class IndexPageComponent {
	devices = signal<any[]>([
		{ id: 1, type: 1, manufacturer: 'Apple', status: 'Available' },
		{ id: 2, type: 3, manufacturer: 'Dell', status: 'In Use' },
		{ id: 3, type: 2, manufacturer: 'Apple', status: 'In Use' },
		{ id: 4, type: 1, manufacturer: 'Samsung', status: 'Maintenance' },
		{ id: 5, type: 3, manufacturer: 'Apple', status: 'Available' },
	]);

	// Derived Stats
	totalAssets = computed(() => this.devices().length);

	inUseCount = computed(() =>
		this.devices().filter(d => d.status === 'In Use').length
	);

	maintenanceCount = computed(() =>
		this.devices().filter(d => d.status === 'Maintenance').length
	);

	availabilityRate = computed(() => {
		const available = this.devices().filter(d => d.status === 'Available').length;
		return Math.round((available / this.totalAssets()) * 100);
	});
}
