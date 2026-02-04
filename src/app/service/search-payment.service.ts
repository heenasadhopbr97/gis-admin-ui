import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import * as RadiusConstants from 'src/app/RadiusUtils/RadiusConstants';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class SearchPaymentService {

  constructor(private http: HttpClient) { }

  getMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url);
  }

  postMethod(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }

  deleteMethod(url:any) {
    return this.http.delete(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url);
  }

  updateMethod(url:any, data:any) {
    return this.http.put(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }

  downloadMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_PAYMENT_RECEIPT_BASE_URL + url);
  }

  downloadPDF(type: any): any {
    const url = RadiusConstants.KEYANNA_PAYMENT_RECEIPT_BASE_URL + `${type}`;
    return this.http.get(url, { responseType: 'blob' }).pipe(map(
      (res: any) => {
        return new Blob([res], { type: 'application/pdf', });
      }))
  }
}
