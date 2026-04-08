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
		return this.http.get<PagedResult<Device>>(environment.API_URL + "Device/get-devices?pageNumber=" + pageNumber + "&pageSize=" + pageSize);
	}

	getAllUnassignedDevices(pageNumber: number = 1, pageSize: number = 5) {
		return this.http.get<PagedResult<Device>>(environment.API_URL + "Device/get-devices-overview?pageNumber=" + pageNumber + "&pageSize=" + pageSize);
	}

	getDeviceById(deviceId: number) {
		return this.http.get<Device>(environment.API_URL + "Device/get-device/" + deviceId);
	}

	addNewDevice(device: Device) {
		return this.http.post<Device>(environment.API_URL + "Device/add-device", device);
	}

	deleteDevice(deviceId: number) {
		return this.http.delete(environment.API_URL + "Device/delete-device/" + deviceId);
	}

	editDevice(deviceId: number, editedDevice: EditDeviceForm) {
		return this.http.patch<Device>(environment.API_URL + "Device/edit-device/" + deviceId, editedDevice);
	}

	getDeviceDescriptionGenerated(deviceId: number) {
		return this.http.get<any>(environment.API_URL + "Device/generate-response/" + deviceId);
	}

	toggleDeviceAssignStatus(deviceId: number) {
		return this.http.patch(environment.API_URL + "Device/toggle-device-assign-status/" + deviceId, {});
	}
}
