import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NotificationBaseService } from "./notification-base.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class SmsConfigService extends NotificationBaseService {
  mvnoId = localStorage.getItem("mvnoId");
  loggedInuser = localStorage.getItem("loginUserName");
  constructor(http: HttpClient) {
    super(http);
  }

  findAll(data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get("/smsConfigs?mvnoId=" + this.mvnoId + "&buId=" + data);
  }
  updateSmsConfig(data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.put("/updateSmsConfig?mvnoId=" + this.mvnoId, data);
  }
  getSmsConfigMappings(emailConfigId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(
      "/findSmsConfigMappingBySmsConfigId?smsConfigId=" + emailConfigId + "&mvnoId=" + this.mvnoId
    );
  }
  deleteSmsConfigByAttributeId(smsConfigMappingId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.delete(
      `/deleteSmsConfigMapping?smsConfigMappingId=` + smsConfigMappingId + "&mvnoId=" + this.mvnoId
    );
  }
  updateSmsConfigMapping(data:any, selectedSmsConfigId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.put(
      "/updateSmsConfigMapping?mvnoId=" + this.mvnoId + "&smsConfigId=" + selectedSmsConfigId,
      data
    );
  }
  addSmsConfig(data:any, buid:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.post(
      "/addSmsConfig?mvnoId=" +
        this.mvnoId +
        "&smsUrl=" +
        data.smsUrl +
        "&configStatus=" +
        data.configStatus +
        "&buId=" +
        buid +
        "&createdBy=" +
        this.loggedInuser,
      data
    );
  }
  addSmsConfigMapping(data:any, selectedSmsConfigId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    // data = data.map(val =>{
    //   val.smsConfigId = selectedSmsConfigId
    // });
    console.log("data----", typeof data);
    data.forEach((item:any) => {
      item.smsConfigId = selectedSmsConfigId;
    });
    console.log("data :::::", data);
    return this.post("/addSmsConfigMapping?mvnoId=" + this.mvnoId, data);
  }
  getMethodAPIGateway(url:any) {
    return this.getapigateway(url);
  }
}
