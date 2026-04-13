import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ThemeService } from '../../../services/theme.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { AlertComponent } from "../../ui/alert/alert.component";
import { ToastComponent } from "../../ui/toast/toast.component";
import { finalize } from 'rxjs';

@Component({
	selector: 'app-login-page',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, RouterModule, AlertComponent, ToastComponent],
	templateUrl: './login-page.component.html',
	styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit {
	loginForm!: FormGroup;
	showPassword = signal(false);
	errorMessage = signal<string | string[] | null>(null);

	loading = signal<boolean>(false);

	constructor(private fb: FormBuilder, public themeService: ThemeService, private authService: AuthService, private toastService: ToastService, private router: Router) {
		effect(() => {
			if (this.loading()) {
				this.loginForm.disable();
			} else {
				this.loginForm.enable();
			}
		})
	}

	ngOnInit(): void {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required]]
		});
	}

	isInvalid(controlName: string): boolean {
		const control = this.loginForm.get(controlName);
		return !!(control && control.invalid && (control.dirty || control.touched));
	}

	onSubmit() {
		if (this.loginForm.invalid) {
			this.loginForm.markAllAsTouched();
			return;
		}

		this.loading.set(true);

		this.authService.login(this.loginForm.value)
			.pipe(finalize(() => this.loading.set(false)))
			.subscribe({
				next: () => {
					this.toastService.show("You logged in successfully!", "success");
					this.router.navigateByUrl("/");
				},
				error: (err) => {
					if(err.status) {
						this.errorMessage.set(err.error.message);
					} else {
						this.errorMessage.set("We couldn't establish a secure handshake with the server. Ensure you have an active internet connection and try again.");
					}
				}
			})
	}

	handleErrorClose() {
		this.errorMessage.set(null);
	}
}
