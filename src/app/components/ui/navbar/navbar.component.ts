import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { AuthService } from '../../../services/auth.service';
import { LoggedUser } from '../../../models/logged-user';

@Component({
	selector: 'app-navbar',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './navbar.component.html',
	styleUrl: './navbar.component.css'
})
export class NavbarComponent {

	constructor(public themeService: ThemeService, public authService: AuthService) { }
}
