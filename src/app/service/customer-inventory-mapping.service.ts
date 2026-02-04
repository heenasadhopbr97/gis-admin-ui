import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { KEYANNA_PRODUCT_MANAGEMENT_BASE_URL } from "../RadiusUtils/RadiusConstants";
import * as RadiusConstants from "../RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class CustomerInventoryMappingService {
  baseUrl = RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL;

  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");
  constructor(private http: HttpClient) {}

  deleteMacForCustomer(mapping:any) {
    return this.http.post(`${this.baseUrl}/inoutWardMacMapping/save`, mapping);
  }
  getByCustomerId(data:any) {
    return this.http.post(`${this.baseUrl}/inwards/getByCustomerId`, data);
  }
  getMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url);
  }
  postMethod(url:any, data: any) {
    return this.http.post(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url, data);
  }
  getByPopCustomerId(data:any) {
    return this.http.post(`${this.baseUrl}/inwards/getAllInventoriesByOwner`, data);
  }
  updateMethod(url:any, data:any) {
    return this.http.put(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url, data);
  }
}
