import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class BillRunMasterService {
  baseUrl = RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL;

  constructor(private http: HttpClient) {}

  getMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url);
  }

  postMethod(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }

  deleteMethod(url:any) {
    return this.http.delete(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url);
  }

  updateMethod(url:any, data:any) {
    return this.http.put(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }

  generateMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_PAYMENT_RECEIPT_BASE_URL + url);
  }

  getAllBillRunList(type:any, data:any) {
    return this.http.post(
      `${RadiusConstants.KEYANNA_PAYMENT_RECEIPT_BASE_URL}/postPaid/billrun/list?type=` + type,
      data
    );
  }
}
