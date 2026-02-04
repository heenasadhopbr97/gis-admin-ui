import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  baseUrl = RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + "/dashboard";
  inventoryBaseUrl = RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + "/dashboard";

  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");

  constructor(private http: HttpClient) {}

  // Customer details APIs
  getTypeWiseCustomerCount() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/customerDetails/typeWiseCount?mvnoId=${this.mvnoId}`);
  }

  getStatusWiseCount() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/customerDetails/getStatusWiseCount?mvnoId=${this.mvnoId}`
    );
  }

  getNewlyActivatedCustomer() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/customerDetails/getNewlyActivatedCustomer?mvnoId=${this.mvnoId}`
    );
  }

  getPlanWiseCustomer() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/customerDetails/getPlanWiseCustomer?mvnoId=${this.mvnoId}`
    );
  }

  // Payment details APIs

  getMonthWiseCollection(year: any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/paymentDetails/getMonthWiseCollection?mv0n0oId=${this.mvnoId}&year=${year}`
    );
  }

  pendingApprovalPayments() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/paymentDetails/pendingApprovalPayments?mvnoId=${this.mvnoId}`
    );
  }

  nextTenDaysReceivablePayment() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/paymentDetails/nextTenDaysReceivablePayment?mvnoId=${this.mvnoId}`
    );
  }

  // Ticket details APIs
  monthWiseTicketCount(year: any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/ticketDetails/monthWiseTicketCount?mvnoId=${this.mvnoId}&year=${year}`
    );
  }

  staffWiseTicketCount() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/ticketDetails/staffWiseTicketCount?mvnoId=${this.mvnoId}`
    );
  }

  teamWiseTicketCount() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/ticketDetails/teamWiseTicketCount?mvnoId=${this.mvnoId}`);
  }

  nextTenDaysRenewableCustomer() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/paymentDetails/nextTenDaysRenewableCustomer?mvnoId=${this.mvnoId}`
    );
  }

  partnerWisePayment() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/paymentDetails/partnerWisePayment?mvnoId=${this.mvnoId}`);
  }

  totalOpenTickets() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/ticketDetails/totalOpenTickets?mvnoId=${this.mvnoId}`);
  }

  connectedUser() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/radius/connectedUser?mvnoId=${this.mvnoId}`);
  }

  monthWiseTimeUsages(year:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/radius/monthWiseTimeUsages?mvnoId=${this.mvnoId}&year=${year}`
    );
  }

  monthWiseVolumeUsages(year:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/radius/monthWiseVolumeUsages?mvnoId=${this.mvnoId}&year=${year}`
    );
  }

  overDueTicketList() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/ticketDetails/overDueTicketList?mvnoId=${this.mvnoId}`);
  }

  monthWiseAGRPayable(year:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/commission/monthWiseAGRPayable?mvnoId=${this.mvnoId}&year=${year}`
    );
  }

  monthWiseTDSPayable(year:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/commission/monthWiseTDSPayable?mvnoId=${this.mvnoId}&year=${year}`
    );
  }

  partnerWiseTDSDetails(year:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/commission/partnerWiseTDSDetails?mvnoId=${this.mvnoId}&year=${year}`
    );
  }

  monthWiseTotalDetails(year:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/commission/monthWiseTotalDetails?mvnoId=${this.mvnoId}&year=${year}`
    );
  }

  topFivePartnerCommissionWise(year:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/commission/topFivePartnerCommissionWise?mvnoId=${this.mvnoId}&year=${year}`
    );
  }

  // Inventory Graph APIs

  getStaffAndProductWiseInventory() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/inventory/staffAndProductWiseInventories?mvnoId=${this.mvnoId}`
    );
  }

  getWareHouseAndProductWiseInventory() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/inventory/wareHouseAndProductWiseInventories?mvnoId=${this.mvnoId}`
    );
  }

  getInventoryAlert() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseUrl}/inventory/inventoryAlert?mvnoId=${this.mvnoId}`);
  }

  getAvailableInventoryProductWise() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseUrl}/inventory/availableInventoryProductWise?mvnoId=${this.mvnoId}`
    );
  }

  postMethod(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }
  getMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url);
  }
  updateMethod(url:any, data:any) {
    return this.http.put(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }
  getProductQtyByStaff(data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.post(
      `${this.inventoryBaseUrl}/inventory/getProductQtyByStaff?mvnoId=${this.mvnoId}`,
      data
    );
  }
  getProductQtyByWarehouse(data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.post(
      `${this.inventoryBaseUrl}/inventory/getProductQtyByWarehouse?mvnoId=${this.mvnoId}`,
      data
    );
  }
}
