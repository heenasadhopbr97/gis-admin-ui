import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class AcctProfileService {
  baseUrl = RadiusConstants.KEYANNA_RADIUS_BASE_URL;
  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");

  constructor(private http: HttpClient) {}

  getProfileByName(name:any, page:any, size:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/all?mvnoId=${this.mvnoId}&page=${page}&size=${size}&name=` +
        encodeURIComponent(name)
    );
  }
  findByName(name:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/findByName?mvnoId=${this.mvnoId}&name=` + name);
  }
  getProfileById(acctProfileId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/findById?mvnoId=${this.mvnoId}&radiusProfileId=` + acctProfileId
    );
  }
  findAllAcctProfile(page:any, size:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/all?mvnoId=${this.mvnoId}&page=${page}&size=${size}`);
  }

  addNewAcctProfile(data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.post(`${this.baseUrl}/add?mvnoId=${data.mvnoName}`, data);
    else return this.http.post(`${this.baseUrl}/add?mvnoId=${this.mvnoId}`, data);
  }

  updateAcctProfile(data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.put(`${this.baseUrl}/update?mvnoId=${data.mvnoName}`, data);
    else return this.http.put(`${this.baseUrl}/update?mvnoId=${this.mvnoId}`, data);
  }

  deleteAcctProfileById(acctProfileId:any, selectedMvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.delete(
        `${this.baseUrl}/delete?mvnoId=${selectedMvnoId}&radiusProfileId=` + acctProfileId
      );
    else
      return this.http.delete(
        `${this.baseUrl}/delete?mvnoId=${this.mvnoId}&radiusProfileId=` + acctProfileId
      );
  }

  getAllProxyServer() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/proxyserver/findActiveProxyServer?mvnoId=${this.mvnoId}`);
  }

  getProxyServer() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/proxyserver/all?mvnoId=${this.mvnoId}`);
  }

  changeSatus(name:any, status:any, selectedMvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin")
      return this.http.get(
        `${this.baseUrl}/changeStatus?mvnoId=${selectedMvnoId}&name=${name}&status=${status}`
      );
    else
      return this.http.get(
        `${this.baseUrl}/changeStatus?mvnoId=${this.mvnoId}&name=${name}&status=${status}`
      );
  }
  getMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url);
  }
  getMethodForRadius(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_RADIUS_BASE_URL + url);
  }
}
