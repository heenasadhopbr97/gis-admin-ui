import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class TaskManagementService {
  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };
  constructor(private http: HttpClient) {}

  getMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_TASK_MANAGEMENT + url);
  }

  postMethod(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_TASK_MANAGEMENT + url, data);
  }

  deleteMethod(url:any) {
    return this.http.delete(RadiusConstants.KEYANNA_TASK_MANAGEMENT + url);
  }

  updateMethod(url:any, data:any) {
    return this.http.put(RadiusConstants.KEYANNA_TASK_MANAGEMENT + url, data);
  }

  assignMethod(url:any, formData:any) {
    return this.http.post(RadiusConstants.KEYANNA_TASK_MANAGEMENT + url, formData);
  }
  downloadFile(url:any): Observable<any> {
    return this.http.get(RadiusConstants.KEYANNA_TASK_MANAGEMENT + url, {
      responseType: "blob",
      headers: this.httpOptions.headers
    });
  }
}
