import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class DeviceDriverService {
  baseUrl = RadiusConstants.KEYANNA_RADIUS_BASE_URL;

  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");

  constructor(private http: HttpClient) {}

  addNewDeviceDriver(data:any) {
    return this.http.post(`${this.baseUrl}/DeviceDriver/save?mvnoId=${this.mvnoId}`, data);
  }

  updateDeviceDriver(data:any) {
    return this.http.put(`${this.baseUrl}/DeviceDriver/update?mvnoId=${this.mvnoId}`, data);
  }

  findAllDeviceDrivers(page:any, size:any) {
    return this.http.get(`${this.baseUrl}/DeviceDriver/all?mvnoId=${this.mvnoId}`);
  }

  deleteDeviceDriverById(driverId:any) {
    return this.http.delete(
      `${this.baseUrl}/DeviceDriver/delete?deviceDriverId=${driverId}&mvnoId=${this.mvnoId}`
    );
  }

  findDeviceDriverById(driverId:any) {
    return this.http.get(
      `${this.baseUrl}/DeviceDriver/findById?deviceId=${driverId}&mvnoId=${this.mvnoId}`
    );
  }

  getDeviceDriverByName(data:any) {
    return this.http.post(`${this.baseUrl}/DeviceDriver/searchByName?mvnoId=${this.mvnoId}`, data);
  }

  testADConnection(data:any) {
    return this.http.post(
      `${this.baseUrl}/DeviceDriver/ldapAuthRequest?mvnoId=${this.mvnoId}`,
      data
    );
  }
}
