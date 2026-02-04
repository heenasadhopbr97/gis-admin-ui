import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as RadiusConstants from "../../RadiusUtils/RadiusConstants";
import { KEYANNA_INTEGRATION_SYSTEM_BASE_URL } from "../../RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class NavMasterService {
  constructor(private http: HttpClient) {}

  getMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_INTEGRATION_SYSTEM_BASE_URL + url);
  }

  postMethod(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_INTEGRATION_SYSTEM_BASE_URL + url, data);
  }

  deleteMethod(url:any) {
    return this.http.delete(RadiusConstants.KEYANNA_INTEGRATION_SYSTEM_BASE_URL + url);
  }

  updateMethod(url:any, data:any) {
    return this.http.put(RadiusConstants.KEYANNA_INTEGRATION_SYSTEM_BASE_URL + url, data);
  }

  getMethodForApiGateway(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url);
  }
}
