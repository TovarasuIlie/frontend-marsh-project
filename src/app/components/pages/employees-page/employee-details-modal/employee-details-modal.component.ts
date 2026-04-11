import { Component, computed, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user';
import { USER_ROLE_DETAILS } from '../../../../mappers/user-role.mapper';
import { UserRole } from '../../../../enums/user-role';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-employee-details-modal',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './employee-details-modal.component.html',
	styleUrl: './employee-details-modal.component.css'
})
export class EmployeeDetailsModalComponent implements OnChanges {

	employee!: User;

	@Input() isOpen = false;
	@Input() employeeId!: number | null;

	@Output() close = new EventEmitter<void>();

	constructor(private userService: UserService) { }

	ngOnChanges(changes: SimpleChanges): void {
		if (this.employeeId && changes["employeeId"]) {
			this.userService.getUser(this.employeeId).subscribe({
				next: (value) => {
					this.employee = value;
				}
			})
		}
	}

	getRoleInfo(roleId: UserRole) {
		return computed(() => {;
			return USER_ROLE_DETAILS[roleId] || USER_ROLE_DETAILS[UserRole.Employee];
		});
	}

	closeModal() {
		this.close.emit();
	}
}
