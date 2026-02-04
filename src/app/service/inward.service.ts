import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// import { type } from "os";
import { KEYANNA_INVENTORY_MANAGEMENT_BASE_URL } from "../RadiusUtils/RadiusConstants";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { map } from "rxjs/operators";
// import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class InwardService {
  baseUrl = KEYANNA_INVENTORY_MANAGEMENT_BASE_URL;

  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");
  constructor(private http: HttpClient) {}

  // private baseUrll = 'http://localhost:30083/api/v1/KeyannaInventoryManagement/specificationParameters/getSpecificParametersByid?product_id=1000';

  // getSpecificParametersById(productId: number): Observable<any> {
  //   const url = `${this.baseUrll}/getSpecificParametersByid?product_id=${productId}`;
  //   return this.http.get(url);
  // }

  getAll(plandata:any) {
    return this.http.post(this.baseUrl + "/inwards", plandata);
  }
  save(data:any) {
    return this.http.post(this.baseUrl + "/inwards/save", data);
  }
  update(data:any) {
    return this.http.post(this.baseUrl + "/inwards/update", data);
  }
  delete(data:any) {
    return this.http.post(this.baseUrl + "/inwards/delete", data);
  }

  getAllProducts() {
    return this.http.get(this.baseUrl + "/product/getAllActiveProduct");
  }

  getAllWareHouse() {
    return this.http.get(this.baseUrl + "/warehouseManagement/getAllActiveWarehouse");
  }

  getInwardMacMapping(inwardId:any) {
    return this.http.get(`${this.baseUrl}/inoutWardMacMapping/getbyinwardid?id=${inwardId}`);
  }

  getOutwardMacMapping(inwardId:any) {
    return this.http.get(`${this.baseUrl}/inoutWardMacMapping/getbyoutwardid?id=${inwardId}`);
  }

  saveInwardMACMapping(list:any) {
    return this.http.post(`${this.baseUrl}/inoutWardMacMapping/save`, list);
  }
  deleteMacMapping(mappingObject:any) {
    return this.http.get(`${this.baseUrl}/inoutWardMacMapping/deletemac?itemId=${mappingObject}`);
  }

  search(page:any, filter:any) {
    return this.http.post(
      `${this.baseUrl}/inwards/search?page=` +
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

  getAllParameter(url:any) {
    return this.http.get(`${this.baseUrl}${url}`);
  }

  getAllInwardByProductAndStaff(productId:any, staffId:any) {
    return this.http.get(
      `${this.baseUrl}/inwards/getAllInwardByProductAndStaff?productId=` +
        productId +
        "&staffId=" +
        staffId
    );
  }

  getAllItemBasedOnProduct(productId:any, ownerId:any, ownerType:any) {
    return this.http.get(
      `${this.baseUrl}/outwards/getItemHistoryByProduct?productId=` +
        productId +
        "&ownerId=" +
        ownerId +
        "&ownerType=" +
        ownerType
    );
  }

  getAllInwardByProductAndStaffforpopandserivearea(productId:any, staffId:any) {
    return this.http.get(
      `${this.baseUrl}/inwards/getAllInwardByProductAndStaffforpopandserivearea?productId=` +
        productId +
        "&staffId=" +
        staffId
    );
  }

  getAllInwardByProductAndStaffforPopandSeriveareaandCustomer(productId:any, staffId:any) {
    return this.http.get(
      `${this.baseUrl}/inwards/getAllInwardByProductAndStaffforPopandSeriveareaandCustomer?productId=` +
        productId +
        "&staffId=" +
        staffId
    );
  }
  assignToCustomer(customerInventoryMapping:any) {
    return this.http.post(this.baseUrl + "/inwards/assignToCustomer", customerInventoryMapping);
  }
  // getAllMACMappingByExternalItemId(inwardId) {
  //   return this.http.get(
  //     `${this.baseUrl}/externalitemmacserialmapping/getExternalItemGroupMacSerialMapping?externalItemId=` +
  //       inwardId
  //   );
  // }
  getAllMACMappingByExternalItemId(inwardId:any) {
    return this.http.get(
      `${this.baseUrl}/inoutWardMacMapping/getAllMACMappingByExternalId?external_id=` + inwardId
    );
  }
  getAllMACMappingByInwardId(inwardId:any) {
    return this.http.get(
      `${this.baseUrl}/inoutWardMacMapping/getAllMACMappingByInwardId?inward_id=` + inwardId
    );
  }
  getAllMACMappingByInwardd(inward_id:any, inOutMappingId:any, inventoryType:any) {
    return this.http.get(
      `${this.baseUrl}/inoutWardMacMapping/getAllMACByExstingMacType?inOutMappingId=` +
        inOutMappingId +
        "&inventoryType=" +
        inventoryType +
        "&inward_id=" +
        inward_id
    );
  }

  updateMACMappingList(list:any) {
    return this.http.post(`${this.baseUrl}/inoutWardMacMapping/updateMACMappingList`, list);
  }
  getById(inwardId:any) {
    return this.http.get(`${this.baseUrl}/inwards/` + inwardId);
  }
  getByExternalItemId(inwardId:any) {
    return this.http.get(`${this.baseUrl}/externalitemmanagement/` + inwardId);
  }
  getAllAssignInventories(staffId:any, plandata:any) {
    return this.http.post(
      `${this.baseUrl}/inwards/getAllAssignInventories?staffId=` + staffId,
      plandata
    );
  }
  getSerializedItemCustomerInventoryMappingByStaffId(staffId:any, data:any) {
    return this.http.post(
      `${this.baseUrl}/inwards/getCustomerInventoryMappingByStaffId?isGetSerializedItem=true&staffId=` +
        staffId,
      data
    );
  }
  getNonSerializedItemCustomerInventoryMappingByStaffId(staffId:any, data:any) {
    return this.http.post(
      `${this.baseUrl}/inwards/getCustomerInventoryMappingByStaffId?isGetSerializedItem=false&staffId=` +
        staffId,
      data
    );
  }
  getSerializedItemServiceAreaByInventoryMappingByStaffId(staffId:any, data:any) {
    return this.http.post(
      `${this.baseUrl}/inwards/getServiceAreaByInventoryMappingByStaffId?isGetSerializedItem=true&staffId=` +
        staffId,
      data
    );
  }
  getNonSerializedItemServiceAreaByInventoryMappingByStaffId(staffId:any, data:any) {
    return this.http.post(
      `${this.baseUrl}/inwards/getServiceAreaByInventoryMappingByStaffId?isGetSerializedItem=false&staffId=` +
        staffId,
      data
    );
  }
  getSerializedItemPopByInventoryMappingByStaffId(staffId:any, data:any) {
    return this.http.post(
      `${this.baseUrl}/inwards/getPopByInventoryMappingByStaffId?isGetSerializedItem=true&staffId=` +
        staffId,
      data
    );
  }
  getNonSerializedItemPopByInventoryMappingByStaffId(staffId:any, data:any) {
    return this.http.post(
      `${this.baseUrl}/inwards/getPopByInventoryMappingByStaffId?isGetSerializedItem=false&staffId=` +
        staffId,
      data
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
  assignToPop(customerInventoryMapping:any) {
    return this.http.post(this.baseUrl + "/inwards/assignToEndOwner", customerInventoryMapping);
  }

  updateMethod(url:any, data:any) {
    return this.http.put(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url, data);
  }

  getByOwnerId(data:any) {
    return this.http.post(`${this.baseUrl}/inwards/getByOwnerIdAndType`, data);
  }

  downloadInvoice(type: any): any {
    const url = RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + `${type}`;
    return this.http.get(url, { responseType: "blob" }).pipe(
      map((res: any) => {
        return new Blob([res], { type: "application/pdf" });
      })
    );
  }

  getItems(inwardId:any, productId:any, destinationId:any, destinationType:any) {
    // `${this.baseUrl}/inwards/getInwardDetailsByProductAndWareHouseId?productId=` + productId + '&wareHouseId=' + wareHouseId
    return this.http.get(
      `${this.baseUrl}/inwards/getItemForInward?inwardId=` +
        inwardId +
        "&productId=" +
        productId +
        "&ownerId=" +
        destinationId +
        "&ownerType=" +
        destinationType
    );
  }

  getAllParameterHistory(inwardId:any, paramId:any) {
    return this.http.get(
      `${this.baseUrl}/inventorySpecification/getAllParameterHistoryByParamId/${inwardId}/${paramId}`
    );
  }

  getByItemId(itemId:any) {
    return this.http.get(
      `${this.baseUrl}/inventorySpecification/getAllInventorySpecByItemId?itemId=` + itemId
    );
  }

  updateCustomerInventoryParams(custId:any, data:any) {
    return this.http.put(`${this.baseUrl}/inwards/cust/params/${custId}`, data);
  }

  getInventoryParamsByMappingID(custServiceId:any) {
    return this.http.get(
      `${this.baseUrl}/inventorySpecification/custParamByMappingId?custInvId=${custServiceId}`
    );
  }
}
