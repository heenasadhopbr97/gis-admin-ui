import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NotificationBaseService } from "./notification-base.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class IntegrationConfigurationService {
  mvnoId = localStorage.getItem("mvnoId");

  constructor(private http: HttpClient) {}

  baseUrl = RadiusConstants.KEYANNA_INTEGRATION_SYSTEM_BASE_URL;

  addIntegrationConfiguration(requestData: any) {
    return this.http.post(`${this.baseUrl}/config/create`, requestData);
  }

  updateIntegrationConfiguration(requestData: any) {
    return this.http.put(`${this.baseUrl}/config/update`, requestData);
  }

  deleteIntegrationConfiguration(configId:any) {
    return this.http.delete(`${this.baseUrl}/config/deleteConfig?id=` + configId);
  }

  getAllIntegrationConfiguration(requestData:any) {
    return this.http.post(`${this.baseUrl}/config/list`, requestData);
  }

  getIntegrationConfigurationById(configId:any) {
    return this.http.get(`${this.baseUrl}/config/findById?id=` + configId);
  }
}
