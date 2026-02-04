import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class VoucherService {
  constructor(private http: HttpClient) {}

  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");
  baseUrl = RadiusConstants.KEYANNA_COMMON_BASE_URL;

  getAllVoucherConfgiuration() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/voucher-management/all` + "?mvnoId=" + this.mvnoId);
  }

  getAllVouchers(page:any, size:any) {
    return this.http.get(`${this.baseUrl}/voucher/all` + "?page=" + page + "&size=" + size);
  }

  findVouchers(batchName:any, status:any) {
    console.log("status-------", status), console.log("batchName-------", batchName);
    return this.http.get(
      `${this.baseUrl}/voucher/findVouchers?batchName=` +
        encodeURIComponent(batchName.trim()) +
        "&status=" +
        status
      // '&page=' +
      // page +
      // '&size=' +
      // size +
      // '&fromDate=' +
      // fromDate +
      // '&toDate=' +
      // toDate
    );
  }

  addVoucherId(id:any) {
    return this.http.get(`${this.baseUrl}/voucher/addVoucherId?id=` + id);
  }

  changeStatusToActive(totalvoucherIdList:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    return this.http.get(
      `${this.baseUrl}/voucher/changeStatusToActive?voucherIdList=` +
        totalvoucherIdList +
        "&mvnoId=" +
        this.mvnoId +
        "&lastModifiedBy=" +
        this.loggedInUser
    );
  }

  changeStatusToBlock(totalvoucherIdList:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    return this.http.get(
      `${this.baseUrl}/voucher/changeStatusToBlock?voucherIdList=` +
        totalvoucherIdList +
        "&mvnoId=" +
        this.mvnoId +
        "&lastModifiedBy=" +
        this.loggedInUser
    );
  }
  changeStatusToUnblock(totalvoucherIdList:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    return this.http.get(
      `${this.baseUrl}/voucher/changeStatusToUnblock?voucherIdList=` +
        totalvoucherIdList +
        "&mvnoId=" +
        this.mvnoId +
        "&lastModifiedBy=" +
        this.loggedInUser
    );
  }
  changeStatusToScrap(totalvoucherIdList:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    return this.http.get(
      `${this.baseUrl}/voucher/changeStatusToScrap?voucherIdList=` +
        totalvoucherIdList +
        "&mvnoId=" +
        this.mvnoId +
        "&lastModifiedBy=" +
        this.loggedInUser
    );
  }
  sendSms(countryCode:any, mobileNo:any, voucherIdSms:any, voucherCodeSms:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.post(
      `${this.baseUrl}/voucher/sendSms?id=` +
        voucherIdSms +
        "&mobileNo=" +
        mobileNo +
        "&countryCode=" +
        countryCode +
        "&mvnoId=" +
        this.mvnoId +
        "&code=" +
        encodeURIComponent(voucherCodeSms),
      voucherIdSms
    );
  }
  findByBatchId(batchId: any, page:any, size:any) {
    return this.http.get(
      `${this.baseUrl}/voucher/findVouchersByBatchId?batchId=${batchId}&page=${page}&size=${size}`
    );
  }
  getDataTOExport(batchName:any, status:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/voucher/exportToCSV?batchName=` +
        encodeURIComponent(batchName) +
        "&status=" +
        status +
        "&mvnoId=" +
        this.mvnoId
    );
  }
}
