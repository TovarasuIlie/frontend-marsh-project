import { Component, computed, HostListener, signal } from '@angular/core';
import { SideBarService } from '../../../services/side-bar.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../enums/user-role';

@Component({
	selector: 'app-sidebar',
	standalone: true,
	imports: [RouterModule, CommonModule],
	templateUrl: './sidebar.component.html',
	styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

	menuItems = [
		{ name: 'Dashboard', icon: 'grid_view', path: '' },
		{ name: 'Inventory', icon: 'inventory_2', path: '/inventory' },
		{ name: 'Assignments', icon: 'assignment_ind', path: '/assignments' },
		{ name: 'Employees', icon: 'groups_3', path: '/employees', role: UserRole.Admin },
	];

	expandedMenu = signal<string | null>(null);

	constructor(public sidebarService: SideBarService, public authService: AuthService) { }

	toggleSidebar() {
		this.sidebarService.toggle();
	}

	isDesktop() {
		return window.innerWidth >= 768;
	}

	filteredMenuItems = computed(() => {
		return this.menuItems.filter(item => {
			if (!item.role) return true;

			return this.authService.hasUserRole(item.role);
		});
	});

	@HostListener('window:resize')
	onResize() {
		if (window.innerWidth < 768) {
			this.sidebarService.isCollapsed.set(true);
		} else {
			this.sidebarService.isCollapsed.set(false);
		}
	}
}
