import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class VoucherBatchService {
  constructor(private http: HttpClient) {}
  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");
  baseUrl = RadiusConstants.KEYANNA_COMMON_BASE_URL;

  //   getAll() {
  //     return this.http.get(
  //       `${this.baseUrl}/voucherbatch/voucherBatches?mvnoId=${this.mvnoId}`
  //     );
  //   }

  getAll(page:any, size:any) {
    return this.http.get(
      `${this.baseUrl}/voucherbatch/getAllVoucherBatch?page=${page}&size=${size}`
    );
  }

  getAllVoucherBatchData() {
    return this.http.get(`${this.baseUrl}/voucherbatch/getAllVoucherBatch?`);
  }

  getByUserName(name: any, page:any, size:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${
        RadiusConstants.KEYANNA_COMMON_BASE_URL
      }/voucherbatch/getAllVoucherBatch?batchName=${name.trim()}&mvnoId=${
        this.mvnoId
      }&page=${page}&size=${size}`
    );
  }

  assignReseller(data: any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    return this.http.get(
      `${RadiusConstants.KEYANNA_COMMON_BASE_URL}/voucherbatch/assignReseller?mvnoId=${this.mvnoId}&resellerId=${data.resellerId}&voucherBatchId=${data.voucherBatchId}` +
        "&lastModifiedBy=" +
        this.loggedInUser +
        "&overwiteExpiry=" +
        data.overwiteExpiry
    );
  }

  getAllBatchWithoutReseller() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/voucherbatch/findVoucherBatchesWithoutReseller?mvnoId=${this.mvnoId}`
    );
  }

  findAllReseller() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/Reseller/getAllResellers?mvnoId=${this.mvnoId}`);
  }

  updateExpiryDate(date:any, id:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/voucherbatch/updateExpiryDate?expiryDate=${date}&voucherBatchId=${id}&lastModifiedBy=${this.loggedInUser}&mvnoId=${this.mvnoId}`
    );
  }
}
