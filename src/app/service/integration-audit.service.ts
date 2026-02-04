import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class IntegrationAuditService {
  mvnoId = localStorage.getItem("mvnoId");

  constructor(private http: HttpClient) {}

  baseUrl = RadiusConstants.KEYANNA_INTEGRATION_SYSTEM_BASE_URL;

  getIntegrationConfigurationById(requestData:any) {
    return this.http.post(`${this.baseUrl}/getAllApiAudits`, requestData);
  }
  postMethod(url:any, data:any) {
    return this.http.post(RadiusConstants.KEYANNA_INTEGRATION_SYSTEM_BASE_URL + url, data);
  }
  postMethodforCommon(url: string, data: any, options?: any) {
    const httpOptions = {
      responseType: options?.responseType || ("json" as "json" | "text"),
      observe: options?.observe || ("body" as "body")
    };

    return this.http.post(
      RadiusConstants.KEYANNA_API_GATEWAY_COMMON_MANAGEMENT + url,
      data,
      httpOptions
    );
  }
}
