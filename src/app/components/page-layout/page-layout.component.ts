import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../ui/sidebar/sidebar.component';
import { NavbarComponent } from '../ui/navbar/navbar.component';
import { ToastComponent } from '../ui/toast/toast.component';
import { SideBarService } from '../../services/side-bar.service';

@Component({
	selector: 'app-page-layout',
	standalone: true,
	imports: [RouterOutlet, SidebarComponent, NavbarComponent, ToastComponent],
	templateUrl: './page-layout.component.html',
	styleUrl: './page-layout.component.css'
})
export class PageLayoutComponent {
	constructor(public sidebarService: SideBarService) {}
}
