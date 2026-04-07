import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginForm } from '../models/login-form';
import { environment } from '../../environments/environment.development';
import { map, ReplaySubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { LoggedUser } from '../models/logged-user';
import { Router } from '@angular/router';
import { RegisterForm } from '../models/register-form';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	private userSource = new ReplaySubject<LoggedUser | null>(1);
	user$ = this.userSource.asObservable();

	constructor(private http: HttpClient, private router: Router) {
		this.loadUserFromLocalStorage();
	}

	login(loginForm: LoginForm) {
		return this.http.post<LoggedUser>(environment.API_URL + "Auth/login-user", loginForm).pipe(
			map((user: LoggedUser) => {
				if (user) {
					this.setUser(user);
				}
			})
		)
	}

	register(registerForm: RegisterForm) {
		return this.http.post<LoggedUser>(environment.API_URL + "Auth/register-user", registerForm);
	}

	logout() {
		localStorage.removeItem(environment.USER_KEY);
		this.userSource.next(null);
		this.router.navigateByUrl('/login');
	}

	private loadUserFromLocalStorage() {
		const userString = localStorage.getItem(environment.USER_KEY);

		if(userString) {
			try {
				const user: LoggedUser = JSON.parse(userString);
				
				if (this.isTokenValid()) {
					this.userSource.next(user);
				} else {
					this.logout();
				}
			} catch (e) {
				this.logout();
			}
		} else {
			this.userSource.next(null);
		}
	}

	private setUser(user: LoggedUser) {
		localStorage.setItem(environment.USER_KEY, JSON.stringify(user));
		this.userSource.next(user);
	}

	getToken() {
		const storedData = localStorage.getItem(environment.USER_KEY);
		const user: LoggedUser | null = storedData ? JSON.parse(storedData) : null;

		if (!user) return null;

		return user.token;
	}

	isTokenValid() {
		const token = this.getToken();

		if (!token) return false;

		try {
			const decoded: any = jwtDecode(token);
			const isTokenExpired = Date.now() >= decoded.exp * 1000;
			return !isTokenExpired;
		} catch (e) {
			return false;
		}
	}
}
