import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { KEYANNA_INVENTORY_MANAGEMENT_BASE_URL } from "../RadiusUtils/RadiusConstants";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class WarhouseManagementService {
  baseUrl = KEYANNA_INVENTORY_MANAGEMENT_BASE_URL;
  baseCommonUrl = RadiusConstants.KEYANNA_API_GATEWAY_COMMON_MANAGEMENT;

  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");
  constructor(private http: HttpClient) {}

  getPincode(id:any) {
    return this.http.get(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + "/pincode/" + id);
  }

  getAll(plandata:any) {
    return this.http.post(this.baseUrl + "/warehouseManagement", plandata);
  }
  save(data:any) {
    return this.http.post(this.baseUrl + "/warehouseManagement/save", data);
  }
  update(data:any) {
    return this.http.post(this.baseUrl + "/warehouseManagement/update", data);
  }
  delete(data:any) {
    return this.http.delete(this.baseUrl + "/warehouseManagement/delete/" + data);
  }
  searchLocation(searchLocationname: string) {
    return this.http.get(this.baseUrl + `/getPlaceId?query=${searchLocationname}`);
  }

  search(page:any, filter:any) {
    return this.http.post(
      `${this.baseUrl}/warehouseManagement/search?page=` +
        page.page +
        `&pageSize=` +
        page.pageSize +
        `&sortOrder=` +
        0 +
        `&sortBy=id`,
      filter
    );
  }

  getLatitudeAndLongitude(id:any) {
    return this.http.get(this.baseUrl + `/getLatitudeAndLongitude?placeId=${id}`);
  }
  getMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url);
  }
  postMethod(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url, data);
  }
  getNamesByIds(data:any) {
    return this.http.post(this.baseUrl + "/warehouseManagement/getAllByWarehouseIds", data);
  }
  getAllBranch() {
    return this.http.get(this.baseCommonUrl + "/branchManagement/getBranchByServiceArea");
  }
  getAllServiceAreaByBranchId(id:any) {
    return this.http.get(
      this.baseCommonUrl + `/branchManagement/getAllServiceAreaByBranchId/` + id
    );
  }
}
