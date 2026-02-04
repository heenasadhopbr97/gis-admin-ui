import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { HttpParams } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError, last, map, tap } from "rxjs/operators";
import { KEYANNA_COMMON_BASE_URL } from "../RadiusUtils/RadiusConstants";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

const BASE_API_URL = KEYANNA_COMMON_BASE_URL + "/";

const BASE_API_URL1 = RadiusConstants.PMS_URL + "/";

@Injectable({
  providedIn: "root",
})
export class PartnerdocumenetService {
  constructor(private http: HttpClient) {}

  getUrl() {
    return BASE_API_URL;
  }

  getMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url);
  }

  downloadFile(docId:any, partnerID:any): Observable<any> {
    const get_url = BASE_API_URL + "subscriber/document/download/" + docId + "/" + partnerID;
    return this.http.get(get_url, {
      responseType: "blob",
      headers: httpOptions.headers,
    });
  }

  getPartnerDocumentByCustId(partnerID: any): Observable<any> {
    const get_url = BASE_API_URL + "partnerDoc/getDocsByPartner/" + partnerID;
    return this.http.get<any>(get_url, { headers: httpOptions.headers });
  }

  getPartnerDocumentById(Id: any): Observable<any> {
    const get_url = BASE_API_URL + "partnerDoc/" + Id;
    return this.http.get<any>(get_url, { headers: httpOptions.headers }).pipe(
      map(res => res),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getPartnerDocumentPDF(): Observable<any> {
    const get_url = BASE_API_URL + "partnerDoc/pdf";
    return this.http.get<any>(get_url, { headers: httpOptions.headers }).pipe(
      map(res => res),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getPartnerDocumentExcel(): Observable<any> {
    const get_url = BASE_API_URL + "partnerDoc/excel";
    return this.http.get<any>(get_url, { headers: httpOptions.headers }).pipe(
      map(res => res),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  insertPartnerDocument(data: any): Observable<any> {
    const post_url = BASE_API_URL + "partnerDoc/save";
    return this.http.post<any>(post_url, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  updatePartnerDocument(data: any): Observable<any> {
    const post_url = BASE_API_URL + "partnerDoc/update";
    return this.http.post<any>(post_url, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  deletePartnerDocument(data: any): Observable<any> {
    const post_url = BASE_API_URL + "partnerDoc/delete";
    return this.http.post<any>(post_url, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  savePartnerDocument(data: any): Observable<any> {
    const post_url = BASE_API_URL + "partnerDoc/uploadDocPartner";
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

  getDocTypeForPartnerList(): Observable<any> {
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

  // ispartnerDocPending(custId: any): Observable<any> {
  //   const get_url = BASE_API_URL + 'partnerDoc/ispartnerDocPending/' + custId
  //   return this.http.get<any>(get_url, { headers: httpOptions.headers })
  // }

  // approvedpartnerDoc(docId: any, status: any): Observable<any> {
  //   const get_url =
  //     BASE_API_URL + 'partnerDoc/approvedpartnerDoc/' + docId + '/' + status
  //   return this.http.get<any>(get_url, { headers: httpOptions.headers })
  // }

  PartnergetMethod(url:any) {
    return this.http.get(BASE_API_URL + url);
  }

  DocumentVerify(data:any) {
    return this.http.post(BASE_API_URL + "verifyDocument", data);
  }

  // savePartnerOnlineDocument(data) {
  //   return this.http.post(
  //     BASE_API_URL + 'partnerDoc/uploadDocOnline?isUpdate=false ',
  //     data,
  //   )
  // }
  // updatePartnerOnlineDocument(data) {
  //   return this.http.post(
  //     BASE_API_URL + 'partnerDoc/uploadDocOnline?isUpdate=true ',
  //     data,
  //   )
  // }
  partnerdownloadFile(docId:any, partnerID:any): Observable<any> {
    const get_url = BASE_API_URL + "partnerDoc/document/download/" + docId + "/" + partnerID;
    return this.http.get(get_url, {
      responseType: "blob",
      headers: httpOptions.headers,
    });
  }
}
