import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
@Injectable({
  providedIn: "root",
})
export class BulkConsumptionService {
  constructor(private http: HttpClient) {}

  getAll(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url);
  }

  getMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url);
  }

  postMethod(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url, data);
  }
  updateMethod(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url, data);
  }

  deleteMethod(url:any, productEditData:any) {
    return this.http.post(
      RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url,
      productEditData
    );
  }

  // updateMethod(url, data) {
  //   return this.http.put(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url, data);
  // }
  searchProduct(page:any, filter:any) {
    // return this.http.post(`${this.baseUrl}/searchProduct`, pageDto);
    return this.http.post(
      `${RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL}/search?page=` +
        page.page +
        `&pageSize=` +
        page.pageSize +
        `&sortOrder=` +
        0 +
        `&sortBy=id`,
      filter
    );
  }
}
