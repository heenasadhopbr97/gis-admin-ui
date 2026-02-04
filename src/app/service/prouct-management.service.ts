import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { KEYANNA_INVENTORY_MANAGEMENT_BASE_URL } from "../RadiusUtils/RadiusConstants";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class ProuctManagementService {
  baseUrl = KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + "/product";

  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");
  constructor(private http: HttpClient) {}

  getAll(plandata:any) {
    return this.http.post(this.baseUrl, plandata);
  }
  save(data:any) {
    return this.http.post(this.baseUrl + "/save", data);
  }
  update(data:any) {
    return this.http.post(this.baseUrl + "/update", data);
  }
  delete(data:any) {
    return this.http.post(this.baseUrl + "/delete", data);
  }

  searchProduct(page:any, filter:any) {
    // return this.http.post(`${this.baseUrl}/searchProduct`, pageDto);
    return this.http.post(
      `${this.baseUrl}/search?page=` +
        page.page +
        `&pageSize=` +
        page.pageSize +
        `&sortOrder=` +
        0 +
        `&sortBy=id`,
      filter
    );
  }
  getAllActiveProduct() {
    return this.http.get(this.baseUrl + "/getAllActiveProduct");
  }
  // getAllProductByProductCategory() {
  //   return this.http.get(this.baseUrl + "/getAllProductByServiceId");
  // }

  getAllNBAndNAProducts() {
    return this.http.get(this.baseUrl + "/getAllNetworkandNaBindProduct");
  }

  getMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url);
  }

  postMethod(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url, data);
  }

  deleteMethod(url:any) {
    return this.http.delete(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url);
  }

  updateMethod(url:any, data:any) {
    return this.http.put(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url, data);
  }
}
