import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  KEYANNA_API_GATEWAY_COMMON_MANAGEMENT,
  KEYANNA_INVENTORY_MANAGEMENT_BASE_URL,
} from "../RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class OutwardService {
  baseUrl = KEYANNA_INVENTORY_MANAGEMENT_BASE_URL;
  baseCommonUrl = KEYANNA_API_GATEWAY_COMMON_MANAGEMENT;

  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");
  constructor(private http: HttpClient) {}

  getMethod(url:any) {
    console.log("Call api :::: ", url);

    return this.http.get(this.baseUrl + url);
  }
  postMethod(url:any, data:any) {
    return this.http.post(this.baseUrl + url, data);
  }
  getAll(plandata:any) {
    return this.http.post(this.baseUrl + "/outwards", plandata);
  }
  save(data:any) {
    return this.http.post(this.baseUrl + "/outwards/save", data);
  }
  saveAllInventoryRequest(data:any) {
    return this.http.post(this.baseUrl + "/outwards/saveAllInventoryRequest", data);
  }
  update(data:any) {
    return this.http.post(this.baseUrl + "/outwards/update", data);
  }
  delete(data:any) {
    return this.http.post(this.baseUrl + "/outwards/delete", data);
  }

  getAllProducts() {
    return this.http.get(this.baseUrl + "/product/getAllActiveProduct");
  }

  getItemss(productId:any) {
    return this.http.get(
      this.baseUrl + "/inventorySpecification/getAllInventorySpecByItemId?itemId=" + productId
    );
  }

  // getAllWareHouse() {
  //   return this.http.get(this.baseUrl + "/warehouseManagement/getAllWarehouseView");
  // }
  getAllStaff() {
    return this.http.get(this.baseUrl + "/staffuser/allActive");
  }
  getStaffUserByServiceArea() {
    return this.http.get(this.baseCommonUrl + "/serviceArea/viewStaffUserByServiceArea");
  }

  getAllCustomer() {
    return this.http.get(this.baseUrl + "/customers/getActiveCustomersList");
  }

  getAllInwardList(productId:any, destinationId:any, destinationType:any) {
    // `${this.baseUrl}/inwards/getInwardDetailsByProductAndWareHouseId?productId=` + productId + '&wareHouseId=' + wareHouseId
    return this.http.get(
      `${this.baseUrl}/inwards/getInwardDetailsByProductAndDestination?productId=` +
        productId +
        "&destinationId=" +
        destinationId +
        "&destinationType=" +
        destinationType
    );
  }

  getProductAvailableQTY(productId:any, destinationId:any, destinationType:any) {
    // `${this.baseUrl}/inwards/getInwardDetailsByProductAndWareHouseId?productId=` + productId + '&wareHouseId=' + wareHouseId
    return this.http.get(
      `${this.baseUrl}/outwards/getAvailableQtyDetailsByProductAndDestination?productId=` +
        productId +
        "&ownerId=" +
        destinationId +
        "&ownerType=" +
        destinationType
    );
  }

  getItems(productId:any, destinationId:any, destinationType:any) {
    // `${this.baseUrl}/inwards/getInwardDetailsByProductAndWareHouseId?productId=` + productId + '&wareHouseId=' + wareHouseId
    return this.http.get(
      `${this.baseUrl}/outwards/getItemForOutward?productId=` +
        productId +
        "&ownerId=" +
        destinationId +
        "&ownerType=" +
        destinationType
    );
  }

  getAllOutwardByProductAndStaff(productId:any, staffId:any) {
    return this.http.get(
      `${this.baseUrl}/outwards/getAllOutwardByProductAndStaff?productId=` +
        productId +
        "&staffId=" +
        staffId
    );
  }

  assignToCustomer(customerInventoryMapping:any) {
    return this.http.post(this.baseUrl + "/outwards/assignToCustomer", customerInventoryMapping);
  }
  getByStaffId(staffId:any) {
    return this.http.get(`${this.baseUrl}/outwards/getByStaffId?staffId=` + staffId);
  }
  updateMACMappingList(list:any) {
    return this.http.post(`${this.baseUrl}/inoutWardMacMapping/updateMACMappingList`, list);
  }
  getAllMACMappingByOutwardId(outwardId:any) {
    return this.http.get(
      `${this.baseUrl}/inoutWardMacMapping/getAllMACMappingByOutwardId?outwardId=` + outwardId
    );
  }

  saveCustomerMACMapping(list:any) {
    return this.http.post(`${this.baseUrl}/inoutWardMacMapping/saveMACMappingCustomer`, list);
  }
  deleteMacMapInCustomer(customerId:any, macAddress:any) {
    return this.http.get(
      `${this.baseUrl}/inoutWardMacMapping/deleteMacMapInCustomer?customerId=${customerId}&macAddress=${macAddress}`
    );
  }
  getMacMappingByCustomerIdAndOutwardId(customerId:any, outwardId:any, mappingId:any) {
    return this.http.get(
      `${this.baseUrl}/inoutWardMacMapping/getMacMappingByCustomerIdAndOutwardId?customerId=${customerId}&outwardId=${outwardId}&mappingId=${mappingId}`
    );
  }

  search(page:any, filter:any) {
    return this.http.post(
      `${this.baseUrl}/outwards/search?page=` +
        page.page +
        `&pageSize=` +
        page.pageSize +
        `&sortOrder=` +
        0 +
        `&sortBy=id`,
      filter
    );
  }

  searchAssignInventories(page:any, staffId:any, filter:any) {
    return this.http.post(
      `${this.baseUrl}/outwards/searchAssignInventories?page=` +
        page.page +
        `&pageSize=` +
        page.pageSize +
        `&sortOrder=` +
        0 +
        `&sortBy=id` +
        `&staffId=` +
        staffId,
      filter
    );
  }

  getAllAssignInventories(staffId:any, plandata:any) {
    return this.http.post(
      `${this.baseUrl}/outwards/getAllAssignInventories?staffId=` + staffId,
      plandata
    );
  }
  returnMethod(data:any) {
    return this.http.post(this.baseUrl + "/item/return", data);
  }
  changeItemCondition(itemId:any, condition:any) {
    return this.http.get(
      this.baseUrl + `/item/updateItemCondition?itemCondition=${condition}&itemId=${itemId}`
    );
  }
  changeItemItemWarranty(itemId:any, itemWarranty:any) {
    return this.http.get(
      this.baseUrl + `/item/updateItemWarranty?itemWarranty=${itemWarranty}&itemId=${itemId}`
    );
  }
  changeNewTypeMethod(data:any) {
    return this.http.post(this.baseUrl + "/item/updateItemTypeByList", data);
  }
  changeRefurbishedTypeMethod(itemId:any) {
    return this.http.get(
      this.baseUrl + "/item/updateItemCondition?itemCondition=Refurbished&itemId=" + itemId
    );
  }
  changeDamagedTypeMethod(itemId:any) {
    return this.http.get(
      this.baseUrl + "/item/updateItemCondition?itemCondition=Damaged&itemId=" + itemId
    );
  }
  changeWarrantyMethod(data:any) {
    return this.http.post(this.baseUrl + `/item/updateItemWarrantyByList`, data);
  }
  changeStatusMethod(data:any) {
    return this.http.post(this.baseUrl + "/item/updateItemStatusByList", data);
  }
  changeItemOwnershipStatusMethod(data:any) {
    return this.http.post(this.baseUrl + "/item/updateItemOwnerShipStatusByList", data);
  }

  showItems(outwardId:any, destinationId:any, destinationType:any, productId:any) {
    // `${this.baseUrl}/inwards/getInwardDetailsByProductAndWareHouseId?productId=` + productId + '&wareHouseId=' + wareHouseId
    return this.http.get(
      `${this.baseUrl}/outwards/getAssignOutwardItem?outwardId=` +
        outwardId +
        "&ownerId=" +
        destinationId +
        "&ownerType=" +
        destinationType +
        "&productId=" +
        productId
    );
  }
}
