import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class NetworkdeviceService {
  constructor(private http: HttpClient) {}

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
  getAllInwardByProduct(productId:any) {
    return this.http.get(
      `${RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL}/NetworkDevice/getAllInwardByProduct?productId=` +
        productId
    );
  }
}
