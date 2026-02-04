import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { TimeBasePolicy } from "../components/model/time-base-policy";

@Injectable({
  providedIn: "root",
})
export class TimebasepolicyService {
  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");
  baseUrl = RadiusConstants.KEYANNA_COMMON_BASE_URL.concat("/timebasepolicy");

  constructor(private http: HttpClient) {}
  searchbasepolicy(page:any, pagesize:any, data:any) {
    return this.http.post(
      `${this.baseUrl}/search?page=` +
        page +
        "&pageSize=" +
        pagesize +
        "&sortBy=createdate&sortOrder=0",
      data
    );
  }

  getAlltimebasepolicy(data:any) {
    // return this.http.post(`${this.baseUrl}`,data);

    return this.http.get(`${this.baseUrl}/all`);
  }

  getAlltimebasepolicywithpagination(data:any) {
    // return this.http.post(`${this.baseUrl}`,data);

    return this.http.post(`${this.baseUrl}`, data);
  }

  getPolicyById(policyId:any) {
    return this.http.get(`${this.baseUrl}/` + policyId);
  }

  addNewPolicyDetails(policyData:any) {
    return this.http.post(`${this.baseUrl}/save`, policyData);
  }

  updatePolicyDetails(policyData:any) {
    return this.http.post(`${this.baseUrl}/update`, policyData);
  }

  deletePolicy(data:any) {
    return this.http.post(`${this.baseUrl}/delete`, data);
  }

  getMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_COMMON_BASE_URL + url);
  }
}
