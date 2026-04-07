import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Device } from '../models/device';
import { PagedResult } from '../models/paged-result';
import { EditDeviceForm } from '../models/edit-device-from';

@Injectable({
	providedIn: 'root'
})
export class DeviceService {

	constructor(private http: HttpClient) { }

	getAllDevices(pageNumber: number = 1, pageSize: number = 5) {
		return this.http.get<PagedResult<Device>>(environment.API_URL + "Devices?pageNumber=" + pageNumber + "&pageSize=" + pageSize);
	}

	getDeviceById(deviceId: number) {
		return this.http.get<Device>(environment.API_URL + "Devices/" + deviceId);
	}

	addNewDevice(device: Device) {
		return this.http.post<Device>(environment.API_URL + "Devices", device);
	}

	deleteDevice(deviceId: number) {
		return this.http.delete(environment.API_URL + "Devices/" + deviceId);
	}

	editDevice(deviceId: number, editedDevice: EditDeviceForm) {
		return this.http.put<Device>(environment.API_URL + "Devices/" + deviceId, editedDevice);
	}
}
