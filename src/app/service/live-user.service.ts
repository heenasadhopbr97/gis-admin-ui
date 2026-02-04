import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class LiveUserService {
  constructor(private http: HttpClient) {}
  baseUrl = RadiusConstants.KEYANNA_RADIUS_BASE_URL;
  mvnoId = localStorage.getItem("mvnoId");

  getById(cdrId:any) {
    return this.http.get(`${this.baseUrl}/liveUser/${cdrId}?mvnoId=${this.mvnoId}`);
  }

  getByUserName(data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.post(`${this.baseUrl}/liveUser/getByUserName?mvnoId=${this.mvnoId}`, data);
  }

  getAll(page:any, size:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/liveUser/all?mvnoId=${this.mvnoId}&page=${page}&size=${size}`
    );
  }

  delete(cdrId: number) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.delete(`${this.baseUrl}/liveUser/${cdrId}?mvnoId=${this.mvnoId}`);
  }

  getLiveUserDetail(cdrId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/liveUser/liveUserDetail?mvnoId=${this.mvnoId}&cdrID=` + cdrId
    );
  }

  postLiveUserDetail(data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.put(`${this.baseUrl}/updateCustomerConcurrency`, data);
  }

  deleteMultipleUsers(mvnoId: string, userIds: number[]) {
    const options = {
      headers: {
        "Content-Type": "application/json"
      },
      body: userIds
    };

    return this.http.delete(`${this.baseUrl}/liveUser/deleteMultiple?mvnoId=${mvnoId}`, options);
  }

  disconnectMultipleUsers(mvnoId: string, userIds: number[]) {
    const options = {
      headers: {
        "Content-Type": "application/json"
      },
      body: userIds
    };

    return this.http.delete(
      `${this.baseUrl}/liveUser/disconnectMultiple?mvnoId=${mvnoId}`,
      options
    );
  }
  postMethod(url:any, data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.post(
      `${this.baseUrl}${url}`,
      // this.baseUrl + url,
      data
    );
  }
  terminateUser(data:any) {
    return this.http.post(`${this.baseUrl}/terminateUserSession`, data);
  }

  disconnect(cdrId: number) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.delete(`${this.baseUrl}/liveUser/disconnect/${cdrId}?mvnoId=${this.mvnoId}`);
  }
}
