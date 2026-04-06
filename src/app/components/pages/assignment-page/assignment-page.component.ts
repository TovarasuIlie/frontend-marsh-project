import { Component, computed, signal } from '@angular/core';

@Component({
	selector: 'app-assignment-page',
	standalone: true,
	imports: [],
	templateUrl: './assignment-page.component.html',
	styleUrl: './assignment-page.component.css'
})
export class AssignmentPageComponent {
	searchQuery = signal('');

	// Data usually comes from your Shared Device Service
	devices = signal<any[]>([
		{ id: 1, name: 'iPhone 15 Pro', manufacturer: 'Apple', currentUser: 'John Doe', location: 'London Office', assignedDate: '2024-03-12' },
		{ id: 2, name: 'MacBook Pro 14', manufacturer: 'Apple', currentUser: 'Sarah Jenks', location: 'Remote', assignedDate: '2023-11-05' },
		{ id: 3, name: 'XPS 15', manufacturer: 'Dell', currentUser: 'Michael Chen', location: 'New York HQ', assignedDate: '2024-01-20' },
		{ id: 4, name: 'iPad Air', manufacturer: 'Apple', currentUser: null, location: 'Storage A', assignedDate: null },
	]);

	// Filter logic: Only show assigned devices, or filter by search
	filteredAssignments = computed(() => {
		const query = this.searchQuery().toLowerCase();
		return this.devices().filter(d =>
			d.currentUser && (
				d.currentUser.toLowerCase().includes(query) ||
				d.name.toLowerCase().includes(query)
			)
		);
	});

	unassignedCount = computed(() => this.devices().filter(d => !d.currentUser).length);
}
