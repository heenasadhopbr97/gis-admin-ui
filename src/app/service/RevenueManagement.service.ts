import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: "root"
})
export class RevenueManagementService {
    baseUrl = RadiusConstants.KEYANNA_REVENUE_MANAGEMENT_BASE_URL;
    baseradiusUrl = RadiusConstants.KEYANNA_RADIUS_BASE_URL;
    billingEngineUrl = RadiusConstants.KEYANNA_PAYMENT_RECEIPT_BASE_URL;
    protalUrl = RadiusConstants.KEYANNA_SUBSCRIBER_BASE_URL;
    notificationUrl = RadiusConstants.KEYANNA_NOTIFICATION_BASE_URL;
    loggedInUser = localStorage.getItem("loggedInUser");
    mvnoId = localStorage.getItem("mvnoId");
    constructor(private http: HttpClient) { }

    getMethod(url:any) {
        return this.http.get(RadiusConstants.KEYANNA_REVENUE_MANAGEMENT_BASE_URL + url);
    }

    postMethod(url:any, data:any) {
        return this.http.post(RadiusConstants.KEYANNA_REVENUE_MANAGEMENT_BASE_URL + url, data);
    }

    deleteMethod(url:any) {
        return this.http.delete(RadiusConstants.KEYANNA_REVENUE_MANAGEMENT_BASE_URL + url);
    }

    updateMethod(url:any, data:any) {
        return this.http.put(RadiusConstants.KEYANNA_REVENUE_MANAGEMENT_BASE_URL + url, data);
    }
    downloadPDF(type: any): any {
        const url = RadiusConstants.KEYANNA_PAYMENT_RECEIPT_BASE_URL + `${type}`;
        return this.http.get(url, { responseType: "blob" }).pipe(
            map((res: any) => {
                return new Blob([res], { type: "application/pdf" });
            })
        );
    }
    generateMethod(url:any) {
        return this.http.get(RadiusConstants.KEYANNA_PAYMENT_RECEIPT_BASE_URL + url);
    }
    getAllInvoiceByCustomer(url:any) {
        return this.http.get(RadiusConstants.KEYANNA_REVENUE_MANAGEMENT_BASE_URL + url);
    }

    postMethodPasssHeader(url:any, data:any) {
        const headers = { rf: "bss" };
        return this.http.post(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url, data, {
            headers
        });
    }

    postMethodPasssHeader1(url:any, data:any) {
        const headers = { rf: "bss" };
        return this.http.post(RadiusConstants.KEYANNA_REVENUE_MANAGEMENT_BASE_URL + url, data, {
            headers
        });
    }

    downloadPDFInvoice(type: any): any {
        const url = RadiusConstants.KEYANNA_PAYMENT_RECEIPT_BASE_URL + `${type}`;
        return this.http.get(url, { responseType: "blob" }).pipe(
            map((res: any) => {
                return new Blob([res], { type: "application/pdf" });
            })
        );
    }

    paymentData(url:any) {
        return this.http.get(RadiusConstants.KEYANNA_PAYMENT_RECEIPT_BASE_URL + url);
    }

    downloadInvoice(type: any): any {
        const url = RadiusConstants.KEYANNA_PAYMENT_RECEIPT_BASE_URL + `${type}`;
        return this.http.get(url, { responseType: "blob" }).pipe(
            map((res: any) => {
                return new Blob([res], { type: "application/pdf" });
            })
        );
    }

    getInvoiceDataById(id:any) {
        return this.http.get(`${this.baseUrl}/partnerInvoiceDetails/` + id);
    }

    postMethodWithData(url:any) {
        return this.http.post(RadiusConstants.KEYANNA_REVENUE_MANAGEMENT_BASE_URL + url, null);
    }

    getIspPayload(url:any) {
        return this.http.get(RadiusConstants.KEYANNA_REVENUE_MANAGEMENT_BASE_URL + url);
    }
}
