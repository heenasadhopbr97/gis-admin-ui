import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  KEYANNA_PRODUCT_MANAGEMENT_BASE_URL,
  KEYANNA_PRODUCT_MANAGEMENT_BASE_URL_TEMPLATE_APIS,
  KEYANNA_LEAD_BASE_URL,
} from "../RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class FieldmappingService {
  constructor(private http: HttpClient) {}

  getMethod(url: string) {
    return this.http.get(KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url);
  }

  getleadMethod(url: string) {
    return this.http.get(KEYANNA_LEAD_BASE_URL + url);
  }

  getMethod2(url: string) {
    return this.http.get(KEYANNA_PRODUCT_MANAGEMENT_BASE_URL_TEMPLATE_APIS + url);
  }

  postMethod2(url: string, data: any) {
    return this.http.post(KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }
  postMethod(url: string, data: any) {
    return this.http.post(KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }
  postLeadMethod(url: string, data: any) {
    return this.http.post(KEYANNA_LEAD_BASE_URL + url, data);
  }

  saveMethod(url: string, data: any, type:any) {
    if (type == "customer") {
      return this.http.post(KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url, data);
    } else {
      return this.http.post(KEYANNA_LEAD_BASE_URL + url, data);
    }
  }
}
