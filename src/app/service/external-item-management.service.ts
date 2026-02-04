import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// import { type } from "os";
import { KEYANNA_INVENTORY_MANAGEMENT_BASE_URL } from "../RadiusUtils/RadiusConstants";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class ExternalItemManagementService {
  baseUrl = KEYANNA_INVENTORY_MANAGEMENT_BASE_URL;
  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");

  constructor(private http: HttpClient) {}
  getAll(plandata:any) {
    return this.http.post(this.baseUrl + "/externalitemmanagement", plandata);
  }
  save(data:any) {
    return this.http.post(this.baseUrl + "/externalitemmanagement/save", data);
  }
  update(data:any) {
    return this.http.post(this.baseUrl + "/externalitemmanagement/update", data);
  }
  delete(id:any) {
    return this.http.delete(this.baseUrl + `/externalitemmanagement/delete/${id}`);
  }

  getAllProducts() {
    return this.http.get(this.baseUrl + "/product/getAllCBProducts");
  }

  getAllWareHouse() {
    return this.http.get(this.baseUrl + "/warehouseManagement/getAllActiveWarehouse");
  }

  getExternalItemMacMapping(externalItemId:any) {
    return this.http.get(
      `${this.baseUrl}/externalitemmacserialmapping/getExternalItemGroupMacSerialMapping?externalItemId=${externalItemId}`
    );
  }

  saveExternalItemMACMapping(list:any) {
    return this.http.post(`${this.baseUrl}/externalitemmacserialmapping/save`, list);
  }
  deleteMacMapping(itemId:any) {
    return this.http.get(
      `${this.baseUrl}/externalitemmacserialmapping/deleteExternalItemMac?itemId=` + itemId
    );
  }

  search(page:any, filter:any) {
    return this.http.post(
      `${this.baseUrl}/externalitemmanagement/search?page=` +
        page.page +
        `&pageSize=` +
        page.pageSize +
        `&sortOrder=` +
        0 +
        `&sortBy=id`,
      filter
    );
  }

  postMethod(url:any, data:any) {
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  assignToCustomer(customerInventoryMapping:any) {
    return this.http.post(this.baseUrl + "/inwards/assignToCustomer", customerInventoryMapping);
  }
  getAllMACMappingByExternalItemId(externalItemId:any) {
    return this.http.get(
      `${this.baseUrl}/externalitemmanagement/getAllMACMappingByExternalItemId?externalItemId=` +
        externalItemId
    );
  }
  updateMACMappingList(list:any) {
    return this.http.post(`${this.baseUrl}/inoutWardMacMapping/updateMACMappingList`, list);
  }
  getById(externalItemId:any) {
    return this.http.get(`${this.baseUrl}/inwards/` + externalItemId);
  }
  getAllAssignInventories(staffId:any, plandata:any) {
    return this.http.post(
      `${this.baseUrl}/inwards/getAllAssignInventories?staffId=` + staffId,
      plandata
    );
  }
  getAllAssignInventoryMappingByStaffId(ownerId:any, type:any, data:any) {
    return this.http.post(
      `${this.baseUrl}/item/getAllItemsByOwner?ownerId=` + ownerId + "&ownerType=" + type,
      data
    );
  }
  getsearchAssignInventories(data:any, ownerId:any, type:any) {
    // return this.http.post(`${this.baseUrl}/inwards/getAllInventoriesByOwner?ownerId=1&ownerType=Partner`
    // + page.page + `&pageSize=` + page.pageSize + `&sortOrder=` + 0 + `&sortBy=id` + `&ownerId=` + ownerId, filter)

    return this.http.post(
      `${this.baseUrl}/item/getAllItemsByOwner?ownerId=` + ownerId + "&ownerType=" + type,
      data
    );
  }

  getMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url);
  }
  updateMethod(url:any, data:any) {
    return this.http.put(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url, data);
  }
}
