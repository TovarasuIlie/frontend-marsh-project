import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ThemeService } from '../../../services/theme.service';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-register-page',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, RouterModule],
	templateUrl: './register-page.component.html',
	styleUrl: './register-page.component.css'
})
export class RegisterPageComponent implements OnInit {
	registerForm!: FormGroup;

	constructor(private fb: FormBuilder, public themeService: ThemeService) {}

	ngOnInit(): void {
		this.registerForm = this.fb.group({
			name: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]],
			location: ['', [Validators.required]]
		});	
	}

	// Helper to check validation
	isInvalid(controlName: string): boolean {
		const control = this.registerForm.get(controlName);
		return !!(control && control.invalid && (control.dirty || control.touched));
	}

	onSubmit() {
		if (this.registerForm.valid) {
			console.log('Form Data:', this.registerForm.value);
			// Here you would call your Auth Service to hit the Phase 1 API
			// this.authService.register(this.registerForm.value).subscribe(...)
		} else {
			this.registerForm.markAllAsTouched();
		}
	}
}
