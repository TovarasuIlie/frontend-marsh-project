import { Component, computed, signal } from '@angular/core';
import { UserRole } from '../../../enums/user-role';
import { USER_ROLE_DETAILS } from '../../../mappers/user-role.mapper';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user';
import { AuthService } from '../../../services/auth.service';

@Component({
	selector: 'app-index-page',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './index-page.component.html',
	styleUrl: './index-page.component.css'
})
export class IndexPageComponent {
	userData = signal<User | null>(null);

	constructor(private authService: AuthService) {
		this.authService.getUserOverview().subscribe(value => {
			this.userData.set(value);
		})
	}

	uniqueManufacturers = computed(() => {
		const devices = this.userData()?.devices || [];
		const distinct = [...new Set(devices.map((d: any) => d.manufacturer))];

		return distinct;
	});

	getBrandPercent(brand: string): number {
		const total = this.userData()?.devices?.length;
		if (total === 0 || total === undefined) return 0;
		const count = this.userData()?.devices?.filter((d: any) => d.manufacturer === brand).length || 0;
		return Math.round((count / total) * 100);
	}

	roleInfo = computed(() => {
		const roleId = this.userData()?.role as UserRole;
		return USER_ROLE_DETAILS[roleId] || USER_ROLE_DETAILS[UserRole.Employee];
	});

	getDeviceIcon(type: number): string {
		if (type === 2) return 'smartphone';
		if (type === 3) return 'laptop_mac';
		return 'devices';
	}
}
