import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class LeadManagementService {
  constructor(private http: HttpClient) {}

  getMethod(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_LEAD_BASE_URL + url);
  }

  getMethodCMS(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url);
  }
  postleadMethod(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_LEAD_BASE_URL + url, data);
  }
  getConnection(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_COMMON_BASE_URL + url);
  }

  getLinkTypes(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_COMMON_BASE_URL + url);
  }
  getCircuitAreas(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_COMMON_BASE_URL + url);
  }
  getBusinessVerticals(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_COMMON_BASE_URL + url);
  }
  getSubBusinessVerticals(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_COMMON_BASE_URL + url);
  }

  postMethod(url:any, data:any, mvnoid:any, staffid:any) {
    return this.http.post(RadiusConstants.KEYANNA_LEAD_BASE_URL + url, data, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        mvnoid: mvnoid,
        staffid: staffid,
      }),
    });
  }

  sendTOcustomer(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_LEAD_BASE_URL + url, data);
  }

  assignPO(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_LEAD_BASE_URL + url, data);
  }

  assignMethod(url:any, formData:any) {
    return this.http.put(RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL + url, formData);
  }

  deleteMethod(url:any) {
    return this.http.delete(RadiusConstants.KEYANNA_LEAD_BASE_URL + url);
  }

  updateMethod(url:any, data:any, mvnoid:any, staffid:any) {
    return this.http.put(RadiusConstants.KEYANNA_LEAD_BASE_URL + url, data, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        mvnoid: mvnoid,
        staffid: staffid,
      }),
    });
  }

  getMethodForKeyannaApi(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_COMMON_BASE_URL + url);
  }

  getMethodAPIGateway(url:any) {
    return this.http.get(RadiusConstants.KEYANNA_COMMON_BASE_URL + url);
  }

  convertCAFPostMethod(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_LEAD_BASE_URL + url, data);
  }

  downloadLeadPDF(type: any): any {
    const url = RadiusConstants.KEYANNA_LEAD_BASE_URL + `${type}`;
    return this.http.get(url, { responseType: "blob" }).pipe(
      map((res: any) => {
        return new Blob([res], { type: "application/pdf" });
      })
    );
  }

  planMappingList: any;
  findCPRForLeadToCAFConvertionForEnterpriseCustomer(leadId: any): any {
    const url =
      RadiusConstants.KEYANNA_LEAD_BASE_URL +
      `/leadMaster/findCPRForLeadToCAFConvertionForEnterpriseCustomer?leadId=` +
      leadId;
    return this.http.get(url);
    // return this.planMappingList;
  }
}
