import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
@Injectable({
  providedIn: "root",
})
export class TemplateService {
  baseUrl = RadiusConstants.KEYANNA_COMMON_BASE_URL;
  constructor(private http: HttpClient) {}
  grtTemplate() {
    // return this.httpWithoutInterceptor.get(`${this.baseUrl}/Templates/all`);
    return this.http.get(
      RadiusConstants.KEYANNA_NOTIFICATION_BASE_URL + `/Template/allbyMvnoIdandBuid`
    );
  }
  getEventByName(eventName:any) {
    if (eventName) {
      return this.http.get(
        RadiusConstants.KEYANNA_NOTIFICATION_BASE_URL + "/Template/search?templateName=" + eventName
      );
    } else {
      return this.http.get(
        RadiusConstants.KEYANNA_NOTIFICATION_BASE_URL + "/Template/search?templateName="
      );
    }
  }
  addNewtemplate(data:any) {
    // return this.post('/Template/save', data);
  }
  updateTemplate(data:any) {
    console.log("Template data", data);
    return this.http.put(
      RadiusConstants.KEYANNA_NOTIFICATION_BASE_URL + "/Template/update/" + data.templateId,
      data
    );
  }
  getTemplates() {
    // return this.get('/Template/all');
  }
}
