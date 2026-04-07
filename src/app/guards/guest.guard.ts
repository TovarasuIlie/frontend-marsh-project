import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const guestGuard: CanActivateFn = (route, state) => {
	const authService = inject(AuthService);
	const toastService = inject(ToastService);
	const router = inject(Router);

	if (!authService.isTokenValid()) {
		return true;
	} else {
		toastService.show("You can't access this page!", "error");
		return router.parseUrl('');
	}
};
