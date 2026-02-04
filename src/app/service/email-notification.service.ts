import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { NotificationBaseService } from "./notification-base.service";

@Injectable({
  providedIn: "root",
})
export class EmailNotificationService extends NotificationBaseService {
  mvnoId = localStorage.getItem("mvnoId");

  constructor(http: HttpClient) {
    super(http);
  }

  getEmailDataBySourceName(sourceName:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get("/findEmailBySourceName?mvnoId=" + this.mvnoId + "&emailAddress=" + sourceName);
  }

  findAllEmailData(itemsPerPage:any, currentPage:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get(
      "/emails?&mvnoId=" + this.mvnoId + "&size=" + itemsPerPage + "&page=" + currentPage
    );
  }

  deleteEmailById(emailId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.delete("/deleteEmail?emailid=" + emailId + "&mvnoId=" + this.mvnoId);
  }

  addEmailDetails(data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.post("/addEmail?mvnoId=" + this.mvnoId, data);
  }

  updateEmailDetails(data:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.put("/updateEmail?mvnoId=" + this.mvnoId, data);
  }

  sendEmailById(emailId:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.post("/sendEmail?emailid=" + emailId + "&mvnoId=" + this.mvnoId, "");
  }
  getEvents() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get("/Event/all?mvnoId=" + this.mvnoId);
  }
  getEventById(id:any) {
    return this.get("/Event/findEventById?eventid=" + id);
  }

  getFindEmailById(id:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.get("/findEmailById?emailid=" + id + "&mvnoId=" + this.mvnoId);
  }
}
