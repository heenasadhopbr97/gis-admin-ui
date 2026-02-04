import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class LeadFollowupService {
  constructor(private http: HttpClient) {}

  getMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_LEAD_BASE_URL + url);
  }

  getMethodCMS(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url);
  }

  postMethod(url:any, data:any, mvnoid:any, staffid:any) {
    return this.http.post(RadiusConstants.KEYANNA_LEAD_BASE_URL + url, data, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        mvnoid: mvnoid,
        staffid: staffid,
      }),
    });
  }

  deleteMethod(url:any) {
    return this.http.delete(RadiusConstants.KEYANNA_LEAD_BASE_URL + url);
  }

  updateMethod(url:any, data:any, mvnoid:any, staffid:any) {
    return this.http.put(RadiusConstants.KEYANNA_LEAD_BASE_URL + url, data, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        mvnoid: mvnoid,
        staffid: staffid,
      }),
    });
  }
}
