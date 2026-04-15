import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { AuthService } from '../../../services/auth.service';
import { LoggedUser } from '../../../models/logged-user';
import { USER_ROLE_DETAILS } from '../../../mappers/user-role.mapper';
import { UserRole } from '../../../enums/user-role';

@Component({
	selector: 'app-navbar',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './navbar.component.html',
	styleUrl: './navbar.component.css'
})
export class NavbarComponent {

	loggedUser!: LoggedUser;

	constructor(public themeService: ThemeService, public authService: AuthService) {
		this.authService.user$.subscribe(value => {
			if (value) {
				this.loggedUser = value;
			}
		})
	}

	roleInfo = computed(() => {
		const roleId = this.loggedUser.role as UserRole;
		return USER_ROLE_DETAILS[roleId] || USER_ROLE_DETAILS[UserRole.Employee];
	});
}
