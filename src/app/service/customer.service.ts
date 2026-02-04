import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  baseUrl = RadiusConstants.KEYANNA_RADIUS_BASE_URL;
  baseUrlForNetConf = RadiusConstants.KEYANNA_API_GATEWAY_NETCONF_CUSTOMER;
  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");
  userId = localStorage.getItem("userId");

  getCustomerById(customerId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/customerById?custid=` + customerId + `&mvnoId=${this.mvnoId}`
    );
  }

  getAll(page:any, size:any) {
    return this.http.get(
      `${this.baseUrl}/customers?mvnoId=${this.mvnoId}&staffId=${this.userId}&page=${page}&size=${size}`
    );
  }

  getNetConfCustomer(page:any, size:any) {
    return this.http.get(
      `${this.baseUrlForNetConf}/customer/customers?mvnoId=${this.mvnoId}&staffId=${this.userId}&page=${page}&size=${size}`
    );
  }

  getAllCDRsForExport(username:any, fromDate:any, toDate:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/exportExcel?mvnoId=${this.mvnoId}&userName=` +
        encodeURIComponent(username) +
        "&fromDate=" +
        fromDate +
        "&toDate=" +
        toDate
    );
  }

  getCustomerByName(page:any, size:any, customerName:any) {
    // return this.http.get(
    //   `${this.baseUrl}/customerByName?mvnoId=${this.mvnoId}&userName=` +
    //   encodeURIComponent(customerName)
    // );
    return this.http.get(
      `${this.baseUrl}/customerByName?mvnoId=${this.mvnoId}&name=` +
        encodeURIComponent(customerName) +
        "&page=" +
        page +
        "&size=" +
        size
    );
  }

  getMacAddressMappings(customerId:any, mvnoId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/findMacAddressMappingByCustomerId?customerId=${customerId}&mvnoId=${this.mvnoId}`
    );
  }

  getCustomerAttributes(customerId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/customerReplyByCustId?custId=${customerId}&mvnoId=${this.mvnoId}`
    );
  }
  postMethod(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }

  getMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url);
  }
  saveIps(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }
  getAllIps(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url);
  }
  deleteIps(url:any) {
    return this.http.delete(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url);
  }
  updateIps(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }
  saveMacs(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }
  getAllMacs(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url);
  }
  updateMacs(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }
  deleteMacs(url:any) {
    return this.http.delete(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url);
  }
}
