import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class TacacsDeviceGroupService {
  constructor(private http: HttpClient) {}

  getMethod(url:any, data:any) {
    return this.http.get(RadiusConstants.KEYANNA_TACACS_MANAGEMENT_SYSTEM_BASE_URL + url, data);
  }
  getCustomer(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_TACACS_MANAGEMENT_SYSTEM_BASE_URL + url);
  }

  postMethod(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_TACACS_MANAGEMENT_SYSTEM_BASE_URL + url, data);
  }

  deleteMethod(url:any) {
    return this.http.delete(RadiusConstants.KEYANNA_TACACS_MANAGEMENT_SYSTEM_BASE_URL + url);
  }

  updateMethod(url:any, data:any) {
    return this.http.put(RadiusConstants.KEYANNA_TACACS_MANAGEMENT_SYSTEM_BASE_URL + url, data);
  }

  postMethodDeamon(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_TACACS_MANAGEMENT_SYSTEM_BASE_URL + url, data);
  }

  searchTax(url:any , data:any) {
    return this.http.post(RadiusConstants.KEYANNA_TACACS_MANAGEMENT_SYSTEM_BASE_URL + url, data);
  }
}
