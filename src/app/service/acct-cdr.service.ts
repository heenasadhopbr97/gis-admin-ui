import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class AcctCdrService {
  constructor(private http: HttpClient) {}
  baseUrl = RadiusConstants.KEYANNA_RADIUS_BASE_URL;

  loggedInUser = localStorage.getItem("loggedInUser");
  mvnoId = localStorage.getItem("mvnoId");

  findAllAcctCdrData(page:any, size:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/acctCdrs?mvnoId=${this.mvnoId}&page=${page}&size=${size}`
    );
  }
  getAcctCdrDataByUsername(data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.post(`${this.baseUrl}/findAcctCdrByUserName?mvnoId=${this.mvnoId}`, data);
  }
  deleteAcctCdrById(cdrId:any, selectedMvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin") {
      return this.http.delete(
        `${this.baseUrl}/deleteAcctCdr?mvnoId=${selectedMvnoId}&cdrid=` + cdrId
      );
    } else {
      return this.http.delete(`${this.baseUrl}/deleteAcctCdr?mvnoId=${this.mvnoId}&cdrid=` + cdrId);
    }
  }

  getCdrDetail(cdrId:any, selectedMvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    if (this.loggedInUser == "superadmin") {
      return this.http.get(`${this.baseUrl}/cdrDetail?mvnoId=${selectedMvnoId}&cdrId=` + cdrId);
    } else {
      return this.http.get(`${this.baseUrl}/cdrDetail?mvnoId=${this.mvnoId}&cdrId=` + cdrId);
    }
  }

  exportExcel(data: any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    if (data.username && data.framedIpAddress == null) {
      return this.http.get(
        `${this.baseUrl}/exportExcel?mvnoId=${this.mvnoId}&userName=radiustest` + data.username
      );
    } else if (data.username == null && data.framedIpAddress) {
      return this.http.get(
        `${this.baseUrl}/exportExcel?mvnoId=${this.mvnoId}&framedId=` + data.framedIpAddress
      );
    } else {
      return this.http.get(
        `${this.baseUrl}/exportExcel?mvnoId=${this.mvnoId}&framedId=` +
          data.framedIpAddress +
          `&userName=` +
          data.username
      );
    }
  }

  getAllCDRsForExport() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/getAllCDRSForExport?mvnoId=${this.mvnoId}`);
  }
}
