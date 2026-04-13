import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ThemeService } from '../../../services/theme.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { AlertComponent } from "../../ui/alert/alert.component";
import { finalize } from 'rxjs';

@Component({
	selector: 'app-register-page',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, RouterModule, AlertComponent],
	templateUrl: './register-page.component.html',
	styleUrl: './register-page.component.css'
})
export class RegisterPageComponent implements OnInit {
	registerForm!: FormGroup;
	errorMessage = signal<string | null>(null);
	showPassword = signal<boolean>(false);
	showConfirmPassword = signal<boolean>(false);

	loading = signal<boolean>(false);

	constructor(private fb: FormBuilder, public themeService: ThemeService, private authService: AuthService, private toastService: ToastService, private router: Router) {
		effect(() => {
			if (this.loading()) {
				this.registerForm.disable();
			} else {
				this.registerForm.enable();
			}
		})
	}

	ngOnInit(): void {
		this.registerForm = this.fb.group({
			name: ['', [Validators.required, Validators.pattern(/^[A-Z][a-z]+(?:[ \-][A-Z][a-z]+)$/)]],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])/)]],
			confirmPassword: ['', [Validators.required]],
			location: ['', [Validators.required, Validators.pattern(/^[A-Z][a-z]+(?:[ \-][A-Z][a-z]+)*, [A-Z]{2}$/)]]
		},
			{
				validators: this.passwordMatchValidator
			});
	}

	isInvalid(controlName: string): boolean {
		const control = this.registerForm.get(controlName);
		return !!(control && control.invalid && (control.dirty || control.touched));
	}

	onSubmit() {
		if (this.registerForm.invalid) {
			this.registerForm.markAllAsTouched();
			return;
		}

		this.loading.set(true);

		this.authService.register(this.registerForm.value)
			.pipe(finalize(() => this.loading.set(false)))
			.subscribe({
				next: () => {
					this.toastService.show("You account created successfully!", "success");
					this.router.navigateByUrl("/login");
				},
				error: (err) => {
					if (err.status) {
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

	passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
		const password = control.get('password');
		const confirmPassword = control.get('confirmPassword');

		if (!confirmPassword?.value) return null;

		if (password && confirmPassword && password.value !== confirmPassword.value) {
			confirmPassword.setErrors({ mismatch: true });
			return { mismatch: true };
		} else {
			if (confirmPassword.hasError('mismatch')) {
				confirmPassword.setErrors(null);
			}
			return null;
		}
	}
}
