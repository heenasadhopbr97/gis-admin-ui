import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NotificationBaseService } from "./notification-base.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class NMSService {
  mvnoId = localStorage.getItem("mvnoId");

  constructor(private http: HttpClient) {}

  baseUrl = RadiusConstants.KEYANNA_INTEGRATION_SYSTEM_BASE_URL;

  getUpStreamProfileByType(profileType:any) {
    return this.http.get(`${this.baseUrl}/nmsMaster/getUpstreamProfile?profiletype=` + profileType);
  }

  getDownStreamProfileByType(profileType:any) {
    return this.http.get(
      `${this.baseUrl}/nmsMaster/getDownStreamProfile?profiletype=` + profileType
    );
  }
}
