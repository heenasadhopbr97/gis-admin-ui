import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { HttpParams } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError, last, map, tap } from "rxjs/operators";
import { KEYANNA_API_GATEWAY_COMMON_MANAGEMENT } from "../../RadiusUtils/RadiusConstants";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

const BASE_API_URL = KEYANNA_API_GATEWAY_COMMON_MANAGEMENT + "/";

@Injectable({
  providedIn: "root",
})
export class MvnoDocumentService {
  constructor(private http: HttpClient) {}

  getUrl() {
    return BASE_API_URL;
  }

  getMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_API_GATEWAY_COMMON_MANAGEMENT + url);
  }

  getCMSMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url);
  }

  downloadFile(docId:any, mvnoId:any): Observable<any> {
    const get_url = BASE_API_URL + "mvno/mvnoDoc/document/download/" + docId + "/" + mvnoId;
    return this.http.get(get_url, {
      responseType: "blob",
      headers: httpOptions.headers,
    });
  }

  getMvnoDocumentByMvnoId(mvnoId: any): Observable<any> {
    console.log(".......BASE_API_URL: ", BASE_API_URL);
    const get_url = BASE_API_URL + "mvno/mvnoDoc/getDocsByMvno/" + mvnoId;
    return this.http.get<any>(get_url, { headers: httpOptions.headers });
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

  saveMvnoDocument(data: any, mvnoId: any): Observable<any> {
    const post_url = BASE_API_URL + "mvno/mvnoDoc/uploadDoc?mvnoId=" + mvnoId;
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

  getDocTypeForMvnoList(name: any): Observable<any> {
    const get_url = BASE_API_URL + "commonList/generic/" + name;
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

  approvedMvnoDoc(docId: any, status: any): Observable<any> {
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
    return this.http.put(RadiusConstants.KEYANNA_API_GATEWAY_COMMON_MANAGEMENT + url, data);
  }
}
