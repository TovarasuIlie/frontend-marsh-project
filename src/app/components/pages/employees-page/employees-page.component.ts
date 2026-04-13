import { Component, computed, signal } from '@angular/core';
import { PaginationMetadata, PaginationParameters } from '../../../models/paged-result';
import { UserRole } from '../../../enums/user-role';
import { USER_ROLE_DETAILS } from '../../../mappers/user-role.mapper';
import { User } from '../../../models/user';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from "../../ui/pagination/pagination.component";
import { UserService } from '../../../services/user.service';
import { EmployeeDetailsModalComponent } from "./employee-details-modal/employee-details-modal.component";
import { EditDeviceModalComponent } from "../inventory-page/edit-device-modal/edit-device-modal.component";
import { EmployeeEditModalComponent } from "./employee-edit-modal/employee-edit-modal.component";
import { EmployeeDeleteModalComponent } from "./employee-delete-modal/employee-delete-modal.component";
import { literal } from '@angular/compiler';

@Component({
	selector: 'app-employees-page',
	standalone: true,
	imports: [CommonModule, PaginationComponent, EmployeeDetailsModalComponent, EmployeeEditModalComponent, EmployeeDeleteModalComponent],
	templateUrl: './employees-page.component.html',
	styleUrl: './employees-page.component.css'
})
export class EmployeesPageComponent {

	employees = signal<User[]>([]);

	paginationMetadata = signal<PaginationMetadata | null>(null);
	pageSizeOptions = [8, 12, 24, 36];
	paginationParameters: PaginationParameters = {
		pageNumber: 1,
		pageSize: this.pageSizeOptions[0],
		filterQuery: ""
	}

	viewState = signal<string>("grid_view");

	isDetailModalOpen = false;
	employeeSelectedId = signal<number | null>(null);

	isEditModalOpen = false;
	isDeleteModalOpen = false;
	employeeSelected = signal<User | null>(null);

	constructor(private userService: UserService) {
		this.loadEmployees();
	}

	loadEmployees() {
		this.userService.getUsers(this.paginationParameters).subscribe({
			next: (value) => {
				this.employees.set(value.data);
				this.paginationMetadata.set(value.metadata);
			}
		})
	}

	getRoleInfo(id: number) {
		return computed(() => {
			const employee = this.employees()?.find(e => e.id === id);
			const roleId = employee?.role as UserRole;
			return USER_ROLE_DETAILS[roleId] || USER_ROLE_DETAILS[UserRole.Employee];
		});
	}

	paginationChange(paginationParameters: PaginationParameters) {
		this.paginationParameters = paginationParameters;
		this.loadEmployees();
	}

	openDetailModal(id: number) {
		this.isDetailModalOpen = true;
		this.employeeSelectedId.set(id);
	}

	openEditModal(employee: User) {
		this.isEditModalOpen = true;
		this.employeeSelected.set(employee);
	}

	openDeleteModal(employee: User) {
		this.isDeleteModalOpen = true;
		this.employeeSelected.set(employee);
	}

	handleEditModalClose(updatedEmployee: User) {
		this.isEditModalOpen = false
		this.employeeSelected.set(null);
		this.employees.update(list => 
			list.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp)
		);
	}

	handleDeleteModalClose() {
		this.isDeleteModalOpen = false
		this.employeeSelected.set(null);
		this.loadEmployees();
	}
}
