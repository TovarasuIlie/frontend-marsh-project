import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-alert',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './alert.component.html',
	styleUrl: './alert.component.css'
})
export class AlertComponent {

	@Input() message: string | string[] | null = null;
	@Input() type: 'error' | 'success' | 'warning' = 'error';

	@Output() closed = new EventEmitter<void>();

	onClose() {
		this.closed.emit();
	}

	isMessageArray(msg: any): msg is string[] {
		return Array.isArray(msg);
	}
}
