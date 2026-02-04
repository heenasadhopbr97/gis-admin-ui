import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { HttpParams } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError, last, map, tap } from "rxjs/operators";
import { KEYANNA_COMMON_BASE_URL } from "../../RadiusUtils/RadiusConstants";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

const BASE_API_URL = KEYANNA_COMMON_BASE_URL + "/";

@Injectable({
  providedIn: "root",
})
export class CustomerDocumentService {
  constructor(private http: HttpClient) {}

  getUrl() {
    return BASE_API_URL;
  }

  getMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url);
  }

  customerDocumentService:any;
  downloadFile(docId:any, custId:any): Observable<any> {
    const get_url = BASE_API_URL + "subscriber/document/download/" + docId + "/" + custId;
    return this.http.get(get_url, {
      responseType: "blob",
      headers: httpOptions.headers,
    });
  }

  getCustomerDocumentByCustId(custId: any): Observable<any> {
    const get_url = BASE_API_URL + "custDoc/getDocsByCustomer/" + custId;
    return this.http.get<any>(get_url, { headers: httpOptions.headers });
  }

  getCustomerDocumentById(Id: any): Observable<any> {
    const get_url = BASE_API_URL + "custDoc/" + Id;
    return this.http.get<any>(get_url, { headers: httpOptions.headers }).pipe(
      map(res => res),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getCustomerDocumentPDF(): Observable<any> {
    const get_url = BASE_API_URL + "custDoc/pdf";
    return this.http.get<any>(get_url, { headers: httpOptions.headers }).pipe(
      map(res => res),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getCustomerDocumentExcel(): Observable<any> {
    const get_url = BASE_API_URL + "custDoc/excel";
    return this.http.get<any>(get_url, { headers: httpOptions.headers }).pipe(
      map(res => res),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  insertCustomerDocument(data: any): Observable<any> {
    const post_url = BASE_API_URL + "custDoc/save";
    return this.http.post<any>(post_url, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  updateCustomerDocument(data: any): Observable<any> {
    const post_url = BASE_API_URL + "custDoc/update";
    return this.http.post<any>(post_url, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  deleteCustomerDocument(data: any): Observable<any> {
    const post_url = BASE_API_URL + "custDoc/delete";
    return this.http.post<any>(post_url, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  saveCustomerDocument(data: any): Observable<any> {
    const post_url = BASE_API_URL + "custDoc/uploadDoc";
    return this.http.post<any>(post_url, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getDocStatusList(): Observable<any> {
    const get_url = BASE_API_URL + "commonList/generic/docStatus";
    return this.http.get<any>(get_url, { headers: httpOptions.headers }).pipe(
      map(data => data),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getDocTypeForCustomerList(): Observable<any> {
    const get_url = BASE_API_URL + "subscriber/getDocTypeForCustomer";
    return this.http.get<any>(get_url, { headers: httpOptions.headers }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  isCustDocPending(custId: any): Observable<any> {
    const get_url = BASE_API_URL + "custDoc/isCustDocPending/" + custId;
    return this.http.get<any>(get_url, { headers: httpOptions.headers });
  }

  approvedCustDoc(docId: any, status: any): Observable<any> {
    const get_url = BASE_API_URL + "custDoc/approvedCustDoc/" + docId + "/" + status;
    return this.http.get<any>(get_url, { headers: httpOptions.headers });
  }

  CustomergetMethod(url:any) {
    return this.http.get(BASE_API_URL + url);
  }

  DocumentVerify(data:any) {
    return this.http.post(BASE_API_URL + "verifyDocument", data);
  }

  saveCustomerOnlineDocument(data:any) {
    return this.http.post(BASE_API_URL + "custDoc/uploadDocOnline?isUpdate=false ", data);
  }
  updateCustomerOnlineDocument(data:any) {
    return this.http.post(BASE_API_URL + "custDoc/uploadDocOnline?isUpdate=true ", data);
  }

  updateMethod(url:any, data:any) {
    return this.http.put(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }
}
