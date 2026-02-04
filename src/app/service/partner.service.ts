import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: "root",
})
export class PartnerService {
  serviceAreaList: any = [];
  serviceAreaService: any;

  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) {}

  getMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url);
  }

  getMethodNew(url:any) {
    return this.http.get(RadiusConstants.PMS_URL + url);
  }

  postMethod(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }

  postMethodNew(url:any, data:any) {
    return this.http.post(RadiusConstants.PMS_URL + url, data);
  }

  deleteMethod(url:any) {
    return this.http.delete(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url);
  }

  deleteMethodNew(url:any) {
    return this.http.delete(RadiusConstants.PMS_URL + url);
  }

  updateMethod(url:any, data:any) {
    return this.http.put(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }

  updateMethodNew(url:any, data:any) {
    return this.http.put(RadiusConstants.PMS_URL + url, data);
  }

  searchTax(url:any, data:any) {
    return this.http.post(RadiusConstants.PMS_URL + url, data);
  }

  searchManagePartner(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }

  balanaceData(data:any) {
    return this.http.post(
      RadiusConstants.KEYANNA_REVENUE_MANAGEMENT_BASE_URL + "/partnerLedger",
      data
    );
  }

  addBalance(data:any) {
    return this.http.post(
      RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + "/partner/addBalanceInPartner",
      data
    );
  }

  transferBalance(data:any) {
    return this.http.post(
      RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + "/partner/transferBalance",
      data
    );
  }

  withdrawalCommission(data:any) {
    return this.http.post(
      RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + "/partner/withdrawCommission",
      data
    );
  }
  getActivePartner(url:any) {
    return this.http.get(RadiusConstants.PMS_URL + url);
  }
  getserviceAreaList() {
    const url = "/serviceArea/all";
    this.serviceAreaService.getMethod(url).subscribe(
      (response: any) => {
        this.serviceAreaList = response.dataList;
      },
      (error: any) => {}
    );
    return this.http.get(RadiusConstants.PMS_URL);
  }
}
