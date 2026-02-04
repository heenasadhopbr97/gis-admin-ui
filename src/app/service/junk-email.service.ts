import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class JunkEmailService {
  constructor(private http: HttpClient) {}

  EMAIL_BASE_URL = RadiusConstants.KEYANNA_TICKET_MANAGEMENT + "/mailservice";

  getMethod(url:any) {
    return this.http.get(this.EMAIL_BASE_URL + url);
  }

  postMethod(url:any, data:any) {
    return this.http.post(this.EMAIL_BASE_URL + url, data);
  }

  deleteMethod(url:any) {
    return this.http.delete(this.EMAIL_BASE_URL + url);
  }

  updateMethod(url:any, data:any) {
    return this.http.put(this.EMAIL_BASE_URL + url, data);
  }
}
