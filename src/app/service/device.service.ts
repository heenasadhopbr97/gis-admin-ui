import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RadiusBaseServiceService } from "./radius-base-service.service";

@Injectable({
  providedIn: "root",
})
export class DeviceService extends RadiusBaseServiceService {
  constructor(http: HttpClient) {
    super(http);
  }

  basePath: string = "/Device";
  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");

  getAll(page:any, size:any, deviceProfileName:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(
      `${this.basePath}/all?mvnoId=${this.mvnoId}&page=${page}&size=${size}&name=${deviceProfileName}`
    );
  }

  getByName(devieProfileName: string) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(
      `${this.basePath}/findByName?deviceProfileName=` +
        encodeURIComponent(devieProfileName) +
        "&mvnoId=" +
        `${this.mvnoId}`
    );
  }

  getById(deviceId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(
      `${this.basePath}/findById?deviceId=` + deviceId + "&mvnoId=" + `${this.mvnoId}`
    );
  }

  add(data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.post(`${this.basePath}/save?mvnoId=${data.mvnoName}`, data);
    else return this.post(`${this.basePath}/save?mvnoId=${this.mvnoId}`, data);
  }

  update(data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.put(`${this.basePath}/update?mvnoId=${data.mvnoName}`, data);
    else return this.put(`${this.basePath}/update?mvnoId=${this.mvnoId}`, data);
  }

  deleteByName(deviceProfileName:any, selectedMvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.delete(
        `${this.basePath}/delete?deviceProfileName=` +
          deviceProfileName +
          "&mvnoId=" +
          `${selectedMvnoId}`
      );
    else
      return this.delete(
        `${this.basePath}/delete?deviceProfileName=` +
          deviceProfileName +
          "&mvnoId=" +
          `${this.mvnoId}`
      );
  }

  changeStatus(deviceProfileName:any, status:any, selectedMvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.get(
        `${this.basePath}/changeStatus?deviceProfileName=` +
          deviceProfileName +
          "&mvnoId=" +
          `${selectedMvnoId}` +
          "&status=" +
          status
      );
    else
      return this.get(
        `${this.basePath}/changeStatus?deviceProfileName=` +
          deviceProfileName +
          "&mvnoId=" +
          `${this.mvnoId}` +
          "&status=" +
          status
      );
  }

  getCoaProfiles() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(`/coaProfiles?mvnoId=${this.mvnoId}`);
  }
}
