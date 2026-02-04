import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MvnoManagementService {
  baseUrl = RadiusConstants.KEYANNA_API_GATEWAY_COMMON_MANAGEMENT + "/mvno";
  constructor(private http: HttpClient) {}

  getMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_API_GATEWAY_COMMON_MANAGEMENT + url);
  }

  postMethod(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_API_GATEWAY_COMMON_MANAGEMENT + url, data);
  }

  deleteMethod(url:any) {
    return this.http.delete(RadiusConstants.KEYANNA_API_GATEWAY_COMMON_MANAGEMENT + url);
  }

  updateMethod(url:any, data:any) {
    return this.http.put(RadiusConstants.KEYANNA_API_GATEWAY_COMMON_MANAGEMENT + url, data);
  }
  searchMVNO(page:any, filter:any) {
    return this.http.post(
      `${this.baseUrl}/search?page=` +
        page.page +
        `&pageSize=` +
        page.pageSize +
        `&sortOrder=` +
        0 +
        `&sortBy=id`,
      filter
    );
  }

  PostMvnoId(oldMvnoid:any, newMvnoid:any): Observable<any> {
    const url = `${this.baseUrl}/mvnoIspToIsp?oldMvnoid=${oldMvnoid}&newMvnoid=${newMvnoid}`;
    return this.http.post<any>(url, null);
  }
}
