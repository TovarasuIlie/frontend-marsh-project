import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment.development';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const router = inject(Router);
	const authService = inject(AuthService);
	const token = authService.getToken();

	const authReq = req.clone({
		setHeaders: {
			Authorization: token ? `Bearer ${token}` : ""
		}
	})

	return next(authReq).pipe(
		catchError((error) => {
			if (error.status === 401) {
				localStorage.removeItem(environment.USER_KEY);
				router.navigate(['']);
			}
			return throwError(() => error);
		})
	);
};
