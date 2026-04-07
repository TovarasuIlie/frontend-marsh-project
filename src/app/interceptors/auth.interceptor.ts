import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const router = inject(Router);
	const token = localStorage.getItem("token");

	const authReq = req.clone({
		setHeaders: {
			Authentication: token ? `Bearer ${token}` : ""
		}
	})

	return next(authReq).pipe(
		catchError((error) => {
			if (error.status === 401) {
				localStorage.removeItem('token');
				router.navigate(['']);
			}
			return throwError(() => error);
		})
	);
};
