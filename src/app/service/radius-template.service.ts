import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RadiusBaseServiceService } from "./radius-base-service.service";

@Injectable({
  providedIn: "root",
})
export class RadiusTemplateService extends RadiusBaseServiceService {
  mvnoId = localStorage.getItem("mvnoId");
  loggedInUser = localStorage.getItem("loggedInUser");

  constructor(http: HttpClient) {
    super(http);
  }
  getEventAll() {
    return this.get(`/Event/all?mvnoId=${this.mvnoId}`);
  }
  getEventByName(eventName:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(
      `/Event/findByName?mvnoId=${this.mvnoId}&eventName=` + encodeURIComponent(eventName)
    );
  }
  addNewtemplate(data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.post(`/Template/save?mvnoId=${this.mvnoId}`, data);
  }

  updateTemplate(data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.put(`/Template/update?mvnoId=${this.mvnoId}`, data);
  }
  getTemplates() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(`/Template/all?mvnoId=${this.mvnoId}`);
  }
}
