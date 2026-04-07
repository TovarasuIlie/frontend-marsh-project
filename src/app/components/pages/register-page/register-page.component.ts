import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ThemeService } from '../../../services/theme.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { AlertComponent } from "../../ui/alert/alert.component";

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

	constructor(private fb: FormBuilder, public themeService: ThemeService, private authService: AuthService, private toastService: ToastService, private router: Router) { }

	ngOnInit(): void {
		this.registerForm = this.fb.group({
			name: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]],
			location: ['', [Validators.required]]
		});
	}

	isInvalid(controlName: string): boolean {
		const control = this.registerForm.get(controlName);
		return !!(control && control.invalid && (control.dirty || control.touched));
	}

	onSubmit() {
		if (this.registerForm.valid) {
			this.authService.register(this.registerForm.value).subscribe({
				next: () => {
					this.toastService.show("You account created successfully!", "success");
					this.router.navigateByUrl("/login");
				},
				error: (err) => {
					this.errorMessage.set(err.error.message);
					console.log(err);
				}
			})
		} else {
			this.registerForm.markAllAsTouched();
		}
	}

	handleErrorClose() {
		this.errorMessage.set(null);
	}
}
