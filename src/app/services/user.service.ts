import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { User } from '../models/user';
import { PagedResult, PaginationParameters } from '../models/paged-result';
import { EditUserForm } from '../models/edit-user-form';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	constructor(private http: HttpClient) { }

	getUsers(paginationParameters: PaginationParameters) {
		return this.http.get<PagedResult<User>>(environment.API_URL + "User/get-users?pageNumber=" + paginationParameters.pageNumber + "&pageSize=" + paginationParameters.pageSize);
	}

	getUser(id: number) {
		return this.http.get<User>(environment.API_URL + "User/get-user/" + id);
	}

	editUser(id: number, editUser: EditUserForm) {
		return this.http.patch<User>(environment.API_URL + "User/edit-user/" + id, editUser);
	}

	getUserOverview() {
		return this.http.get<User>(environment.API_URL + "User/user-overview");
	}

	deleteUser(id: number) {
		return this.http.delete(environment.API_URL + "User/delete-user/" + id);
	}
}
