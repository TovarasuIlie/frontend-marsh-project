import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
	providedIn: 'root'
})
export class DeviceService {

	constructor(private http: HttpClient) { }

	getAllDevices() {
		return this.http.get(environment.API_URL + "Devices");
	}
}
