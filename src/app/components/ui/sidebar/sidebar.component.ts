import { Component, signal } from '@angular/core';
import { SideBarService } from '../../../services/side-bar.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
	selector: 'app-sidebar',
	standalone: true,
	imports: [RouterModule, CommonModule],
	templateUrl: './sidebar.component.html',
	styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

	menuItems = [
		{ name: 'Dashboard', icon: 'dashboard', path: '' },
		{ name: 'Inventory', icon: 'devices', path: '/inventory' },
		{ name: 'Assignments', icon: 'person_search', path: '/assignments' },
	];

	secondaryItems = [
		{ name: 'Settings', icon: 'settings', path: '/settings' }
	];

	expandedMenu = signal<string | null>(null);

	constructor(public sidebarService: SideBarService, private router: Router, public authService: AuthService) {
		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd)
		).subscribe(() => {
			this.closeOnMobile();
		});
	}

	private closeOnMobile() {
		if (window.innerWidth < 768) {
			this.sidebarService.isCollapsed.set(true);
		}
	}

	toggleSidebar() {
		this.sidebarService.toggle();
	}

	isDesktop() {
		return window.innerWidth >= 768;
	}
}
