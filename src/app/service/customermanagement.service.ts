import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class CustomermanagementService {
  baseUrl = RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL;
  baseradiusUrl = RadiusConstants.KEYANNA_RADIUS_BASE_URL;
  billingEngineUrl = RadiusConstants.KEYANNA_PAYMENT_RECEIPT_BASE_URL;
  protalUrl = RadiusConstants.KEYANNA_SUBSCRIBER_BASE_URL;
  notificationUrl = RadiusConstants.KEYANNA_NOTIFICATION_BASE_URL;
  loggedInUser = localStorage.getItem("loggedInUser");
  mvnoId = localStorage.getItem("mvnoId");
  constructor(private http: HttpClient) {}

  getMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url);
  }

  getMethodForRadius(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_RADIUS_BASE_URL + url);
  }

  getByIdMethodForNetConf(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_API_GATEWAY_NETCONF_CUSTOMER + url);
  }

  getMethodForLeadApproveStaff(url:any, data:any) {
    return this.http.get(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }

  postMethod(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }

  postMethodRadius(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_RADIUS_BASE_URL + url, data);
  }

  postMethodForNetConf(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_API_GATEWAY_NETCONF_CUSTOMER + url, data);
  }
  postMethodInventory(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url, data);
  }

  notidicationpostMethod(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_NOTIFICATION_BASE_URL + url, data);
  }

  deleteMethod(url:any) {
    return this.http.delete(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url);
  }

  updateMethod(url:any, data:any) {
    return this.http.put(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }

  updateRadiusMethod(url:any, data:any) {
    return this.http.put(RadiusConstants.KEYANNA_RADIUS_BASE_URL + url, data);
  }
  updateNetConf(url:any, data:any) {
    return this.http.put(RadiusConstants.KEYANNA_API_GATEWAY_NETCONF_CUSTOMER + url, data);
  }

  updateInventoryMethod(url:any, data:any) {
    return this.http.put(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url, data);
  }

  PostSubMethod(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_SUBSCRIBER_BASE_URL + url, data);
  }

  paymentData(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_SUBSCRIBER_BASE_URL + url);
  }

  getCutomerTicketData(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_SUBSCRIBER_BASE_URL + url);
  }

  getCustQuotaList(custid: any) {
    return this.http.get(RadiusConstants.KEYANNA_COMMON_BASE_URL + "/customer/custQuota/" + custid);
  }
  getRetunItemList(custid: any) {
    return this.http.get(
      RadiusConstants.KEYANNA_COMMON_BASE_URL + "/getReturnforCustomer?id=" + custid
    );
  }

  getPaytmLink(custid:any) {
    return this.http.post(`${this.baseUrl}/generatePaytmLinkAndSend?custId=` + custid, "");
  }

  // https://bss.5net.in:30080/KeyannaRadius/findAcctCdrByUserName?mvnoId=1&page=1&size=5&userName=surya123&framedIpAddress=&fromDate=&toDate=

  getAcctCdrDataByUsername(userName:any, framedIpAddress:any, fromDate:any, toDate:any, page:any, size:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseradiusUrl}/findAcctCdrByUserName?mvnoId=${this.mvnoId}&page=${page}&size=${size}&userName=` +
        encodeURIComponent(userName) +
        "&framedIpAddress=" +
        encodeURIComponent(framedIpAddress) +
        "&fromDate=" +
        fromDate +
        "&toDate=" +
        toDate
    );
  }

  getAcctCdrDataByUsernameAndcustId(
    userName:any,
    framedIpAddress:any,
    custId:any,
    fromDate:any,
    toDate:any,
    page:any,
    size:any
  ) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseradiusUrl}/findAcctCdrByUserName?mvnoId=${this.mvnoId}&page=${page}&size=${size}&userName=` +
        encodeURIComponent(userName) +
        "&framedIpAddress=" +
        encodeURIComponent(framedIpAddress) +
        "&custId=" +
        encodeURIComponent(custId) +
        "&fromDate=" +
        fromDate +
        "&toDate=" +
        toDate
    );
  }
  getAllCDRsForExport() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseradiusUrl}/getAllCDRSForExport?mvnoId=${this.mvnoId}`);
  }

  exportExcel(data: any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    if (data.username && data.framedIpAddress == null) {
      return this.http.get(
        `${this.baseradiusUrl}/exportExcel?mvnoId=${this.mvnoId}&userName=radiustest` +
          data.username
      );
    } else if (data.username == null && data.framedIpAddress) {
      return this.http.get(
        `${this.baseradiusUrl}/exportExcel?mvnoId=${this.mvnoId}&framedId=` + data.framedIpAddress
      );
    } else {
      return this.http.get(
        `${this.baseradiusUrl}/exportExcel?mvnoId=${this.mvnoId}&framedId=` +
          data.framedIpAddress +
          `&userName=` +
          data.username
      );
    }
  }
  AllAcctCdrData(page:any, size:any) {
    return this.http.get(
      `${this.baseradiusUrl}/acctCdrs?mvnoId=${this.mvnoId}&page=${page}&size=${size}`
    );
  }

  getAllCDRExport(data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    const url =
      `${this.baseradiusUrl}/exportExcel?mvnoId=${this.mvnoId}&userName=` +
      data.userName +
      "&fromDate" +
      data.fromDate +
      "&toDate" +
      data.toDate;
    return this.http.get(url, { responseType: "blob" }).pipe(
      map((res: any) => {
        return new Blob([res], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
      })
    );
  }

  getAllCDRExportWithCustId(data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    const url =
      `${this.baseradiusUrl}/exportExcel?mvnoId=${this.mvnoId}&page=${data.page}&size=${data.size}&userName=` +
      data.userName +
      "&custId=" +
      encodeURIComponent(data.custId) +
      "&fromDate" +
      data.fromDate +
      "&toDate" +
      data.toDate;
    return this.http.get(url, { responseType: "blob" }).pipe(
      map((res: any) => {
        return new Blob([res], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
      })
    );
  }
  downloadPDFInvoice(type: any): any {
    const url = RadiusConstants.KEYANNA_PAYMENT_RECEIPT_BASE_URL + `${type}`;
    return this.http.get(url, { responseType: "blob" }).pipe(
      map((res: any) => {
        return new Blob([res], { type: "application/pdf" });
      })
    );
  }

  generateMethodInvoice(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_PAYMENT_RECEIPT_BASE_URL + url);
  }

  getofferPriceWithTax(planId: any, discount:any, planGroupId: any = "") {
    let plangroup = "";
    if (planGroupId !== "planGroupId") {
      plangroup = "&planGroupId=" + planGroupId;
    }
    return this.http.get(
      `${this.billingEngineUrl}/getOfferPriceWithTax/plan?planIds=` +
        planId +
        "&discount=" +
        discount +
        plangroup
    );
  }

  downloadInvoice(type: any): any {
    const url = RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + `${type}`;
    return this.http.get(url, { responseType: "blob" }).pipe(
      map((res: any) => {
        return new Blob([res], { type: "application/pdf" });
      })
    );
  }

  postMethodPasssHeader(url:any, data:any) {
    const headers = { rf: "bss" };
    return this.http.post(`${this.baseUrl}` + url, data, {
      headers
    });
  }

  getProtalMethod(url:any) {
    return this.http.get(this.protalUrl + url);
  }
  KeyannaRadius(url:any) {
    return this.http.get(this.baseradiusUrl + url);
  }

  getPlansByTypeServiceModeStatusAndServiceArea(
    url:any,
    type:any,
    serviceId:any,
    serviceAreaId:any,
    mode:any,
    status:any,
    planGroup:any,
    validty:any,
    unitV:any
  ) {
    if (status == null) status = "ACTIVE";
    return this.http.get(
      `${RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL}${url}?serviceAreaId=${serviceAreaId}&serviceId=${serviceId}&type=${type}&mode=${mode}&status=${status}&planGroup=${planGroup}&unitsOfValidity=${unitV}&validity=${validty}`
    );
  }

  getPlansByTypeServiceModeStatusAndServiceAreaWithoutService(
    url:any,
    type:any,
    serviceId:any,
    serviceAreaId:any,
    mode:any,
    status:any,
    planGroup:any
  ) {
    if (status == null) status = "ACTIVE";
    return this.http.get(
      `${RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL}${url}?serviceAreaId=${serviceAreaId}&serviceId=${serviceId}&type=${type}&mode=${mode}&status=${status}&planGroup=${planGroup}`
    );
  }
  getCustNetworkLocDetail(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL + url);
  }
  searchLocation(searchLocationname: string) {
    return this.http.get(this.baseUrl + `/getPlaceId?query=${searchLocationname}`);
  }

  addNewReceipt(data:any) {
    return this.http.post(`${RadiusConstants.KEYANNA_COMMON_BASE_URL}/staff/Reciept`, data);
  }
  getStaffReceiptDataByStaffId(id:any) {
    return this.http.get(`${RadiusConstants.KEYANNA_COMMON_BASE_URL}/staffReceipt/` + id);
  }

  getCustQuotaListFromRadius(custid: any) {
    return this.http.get(RadiusConstants.KEYANNA_RADIUS_BASE_URL + "/customer/custQuota/" + custid);
  }

  resetQuota(custid: any, cprid: any) {
    return this.http.get(
      RadiusConstants.KEYANNA_RADIUS_BASE_URL +
        "/updateCustQuotaDetails?custId=" +
        custid +
        "&cprId=" +
        cprid
    );
  }

  getDownloadMethod(url:any) {
    return this.http
      .get(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url, { responseType: "blob" })
      .pipe(
        map((res: any) => {
          return new Blob([res], { type: "application/pdf" });
        })
      );
  }
  getDownloadServiceArea(url:any) {
    return this.http
      .get(RadiusConstants.KEYANNA_API_GATEWAY_COMMON_MANAGEMENT + url, { responseType: "blob" })
      .pipe(
        map((res: any) => {
          return new Blob([res], { type: "application/pdf" });
        })
      );
  }
}
