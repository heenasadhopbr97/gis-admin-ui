import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NotificationBaseService } from "./notification-base.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class EmailConfigService extends NotificationBaseService {
  mvnoId = localStorage.getItem("mvnoId");

  constructor(http: HttpClient) {
    super(http);
  }

  findAll(buid:any, serviceType:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(
      "/emailConfigs?mvnoId=" + this.mvnoId + "&buId=" + buid + "&serviceType=" + serviceType
    );
  }
  updateEmailConfig(data:any, buid:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.put("/updateEmailConfig?mvnoId=" + this.mvnoId + "&buId=" + buid, data);
  }
  addEmailConfig(data:any, buid:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.post("/addEmailConfig?mvnoId=" + this.mvnoId + "&buId=" + buid, data);
  }
  getMethodAPIGateway(url:any) {
    return this.getapigateway(url);
  }
}
