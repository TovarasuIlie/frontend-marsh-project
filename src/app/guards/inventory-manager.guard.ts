import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { UserRole } from '../enums/user-role';

export const inventoryManagerGuard: CanActivateFn = (route, state) => {
	const authService = inject(AuthService);
	const toastService = inject(ToastService);
	const router = inject(Router);

	if (authService.hasUserRole(UserRole.InventoryManager) || authService.hasUserRole(UserRole.Admin)) {
		return true;
	} else {
		toastService.show("You do not have the required permissions.", "error");
		router.navigate(['/'])
		return false;
	}
};
