import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ThemeService } from '../../../services/theme.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { AlertComponent } from "../../ui/alert/alert.component";
import { ToastComponent } from "../../ui/toast/toast.component";

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
	errorMessage = signal<string | null>(null);

	constructor(private fb: FormBuilder, public themeService: ThemeService, private authService: AuthService, private toastService: ToastService, private router: Router) { }

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
		if (this.loginForm.valid) {
			this.authService.login(this.loginForm.value).subscribe({
				next: () => {
					this.toastService.show("You logged in successfully!", "success");
					this.router.navigateByUrl("");
				},
				error: (err) => {
					this.errorMessage.set(err.error.message);
				}
			})
		} else {
			this.loginForm.markAllAsTouched();
		}
	}

	handleErrorClose() {
		this.errorMessage.set(null);
	}
}
