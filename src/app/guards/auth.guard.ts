import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const authGuard: CanActivateChildFn = (childRoute, state) => {
	const authService = inject(AuthService);
	const toastService = inject(ToastService);
	const router = inject(Router);

	if (authService.isTokenValid()) {
		return true;
	} else {
		toastService.show("You must to be logged in!", "error");
		localStorage.removeItem('token');
		return router.parseUrl('/login');
	}
};
