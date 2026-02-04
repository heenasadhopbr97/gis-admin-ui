import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { KEYANNA_INVENTORY_MANAGEMENT_BASE_URL } from "../RadiusUtils/RadiusConstants";
@Injectable({
  providedIn: "root",
})
export class InventoryRequestService {
  constructor(private http: HttpClient) {}
  baseUrl = KEYANNA_INVENTORY_MANAGEMENT_BASE_URL;
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
  forwardToWarehouse(forwardToReqId:any, remarks:any, reqId:any, plandata:any) {
    return this.http.post(
      `${this.baseUrl}/requestinventory/forwardReqInv?forwardToReqId=` +
        forwardToReqId +
        "&remarks=" +
        remarks +
        "&reqId=" +
        reqId,
      plandata
    );
  }
}
