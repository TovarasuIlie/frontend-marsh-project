import { Component } from '@angular/core';
import { ToastService } from '../../../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-toast',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './toast.component.html',
	styleUrl: './toast.component.css'
})
export class ToastComponent {
	constructor(protected toastService: ToastService) { }

	getClasses(type: string) {
		const base = "bg-white dark:bg-gray-900 ";
		const types = {
			success: "text-emerald-600 border-emerald-100 dark:border-emerald-900/30",
			error: "text-rose-600 border-rose-100 dark:border-rose-900/30",
			info: "text-blue-600 border-blue-100 dark:border-blue-900/30"
		};
		return base + (types[type as keyof typeof types] || types.info);
	}
}
