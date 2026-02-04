import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { KEYANNA_PRODUCT_MANAGEMENT_BASE_URL } from "../RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class OtpService {
  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");
  basePath: string = "/otpmanagment";

  baseUrl = KEYANNA_PRODUCT_MANAGEMENT_BASE_URL;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get(`${this.baseUrl + this.basePath}/getAll`);
  }

  getByName(profileName: string) {
    return this.http.get(
      `${this.baseUrl + this.basePath}/profile/` + encodeURIComponent(profileName)
    );
  }

  getById(otpId:any) {
    return this.http.get(`${this.baseUrl + this.basePath}/` + otpId);
  }

  deleteById(profileId:any) {
    return this.http.delete(`${this.baseUrl + this.basePath}/${profileId}`);
  }

  add(data:any) {
    return this.http.post(`${this.baseUrl + this.basePath}`, data);
  }

  update(profileId:any, data:any) {
    return this.http.put(`${this.baseUrl + this.basePath}/${profileId}`, data);
  }
}
