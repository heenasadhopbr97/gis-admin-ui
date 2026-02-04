import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: "root",
})
export class CustspecialPlanMappingService {
  baseUrl = RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL;
  loggedInUser = localStorage.getItem("loggedInUser");
  customerAllList: any = [];
  constructor(private http: HttpClient, private spinner: NgxSpinnerService) {}

  postMethod(url:any, data:any) {
    return this.http.post(
      RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url,
      data
    );
  }

  getMethod(url:any) {
    return this.http.get(
      RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url
    );
  }

  deleteMethod(url:any) {
    return this.http.delete(
      RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url
    );
  }

  updateMethod(url:any, data:any) {
    return this.http.put(
      RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url,
      data
    );
  }
}
