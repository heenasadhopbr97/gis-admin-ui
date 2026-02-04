import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class PrepaidRejectedReasonService {
  constructor(private http: HttpClient) {}

  getMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_PREPAID_REJECT_REASON_BASE_URL + url);
  }

  postMethod(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_PREPAID_REJECT_REASON_BASE_URL + url, data);
  }

  deleteMethod(url:any) {
    return this.http.delete(RadiusConstants.KEYANNA_PREPAID_REJECT_REASON_BASE_URL + url);
  }

  updateMethod(url:any, data:any) {
    return this.http.put(RadiusConstants.KEYANNA_PREPAID_REJECT_REASON_BASE_URL + url, data);
  }

  getAllRejectedReasonsList() {
    return this.http.get(
      RadiusConstants.KEYANNA_PREPAID_REJECT_REASON_BASE_URL + "/rejectReason/allRejectedReasonsList"
    );
  }
}
