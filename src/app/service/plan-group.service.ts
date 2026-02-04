import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class PlanGroupService {
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

  getPlanGroupList(data:any) {
    return this.http.post(`${this.baseUrl}/planGroupMappings/list`, data);
  }

  searchPlanGroup(data:any) {
    return this.http.post(`${this.baseUrl}/planGroupMappings/search`, data);
  }

  getPlansByTypeServiceModeStatusAndServiceArea(
    url: string,
    type: any,
    serviceId: number,
    serviceAreaId: string,
    mode: any,
    status: string,
    planGroup: any,
    validty: string,
    unitV: string
  ) {
    if (status == null) status = "ACTIVE";
    return this.http.get(
      `${RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL}${url}?serviceId=${serviceId}${serviceAreaId}&type=${type}&mode=${mode}&status=${status}&planGroup=${planGroup}&unitsOfValidity=${unitV}&validity=${validty}`
    );
  }
}
