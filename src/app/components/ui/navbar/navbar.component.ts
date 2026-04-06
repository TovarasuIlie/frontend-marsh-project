import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';

@Component({
	selector: 'app-navbar',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './navbar.component.html',
	styleUrl: './navbar.component.css'
})
export class NavbarComponent {

	loggedUser = {
		fullname: "Test",
		email: "test@test.com"
	}

	constructor(public themeService: ThemeService) {}
}
