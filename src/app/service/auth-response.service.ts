import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class AuthResponseService {
  constructor(private http: HttpClient) {}
  baseUrl = RadiusConstants.KEYANNA_RADIUS_BASE_URL;
  mvnoId = localStorage.getItem("mvnoId");

  getAuthResponseByUsername(userName:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/findAuthResponseByUserName?mvnoId=${this.mvnoId}&username=` +
        encodeURIComponent(userName)
    );
  }

  findAllAuthResponseData(page:any, size:any, query = "") {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/authResponses?mvnoId=${this.mvnoId}&page=${page}&size=${size}${query}`
    );
  }

  deleteAuthResponseById(cdrId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.delete(
      `${this.baseUrl}/deleteAuthResponse?mvnoId=${this.mvnoId}&authresid=` + cdrId
    );
  }

  searchByUserName(page:any, size:any, userName:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/findAuthResponseByUserName?mvnoId=${this.mvnoId}&page=${page}&size=${size}&username=${userName}`
    );
  }
}
