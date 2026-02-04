import { Component, OnInit } from "@angular/core";
import {
  Router,
  RouterEvent,
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
  ActivatedRoute,
} from "@angular/router";
// import { NgxSpinnerService } from "ngx-spinner";
// import { HttpClient, HttpHeaders } from "@angular/common/http";
// import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";
import { LoginService } from "src/app/service/login.service";
// import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
import { StatusCheckService } from "src/app/service/status-check-service.service";

@Component({
    selector: "app-radius-customer-details-menu",
    templateUrl: "./radius-customer-details-menu.component.html",
    styleUrls: ["./radius-customer-details-menu.component.css"],
    standalone: false
})
export class RadiusCustomerDetailsMenuComponent implements OnInit {
  custId:any;
  childUrlSegment = "";
  childCustomerDataList: any = {};
  isDetails = false;
  isPlan = false;
  isCDR = false;
  constructor(
    private route: ActivatedRoute,
    public KeyannaCommonBaseService: KeyannaCommonBaseService,
    public loginService: LoginService,
    public statusCheckService: StatusCheckService
  ) {}
  ngOnInit() {
    this.custId = this.route.snapshot.firstChild.paramMap.get("custId")!;
    this.childUrlSegment = this.route.firstChild.snapshot.url[0].path;
    this.checkOpenMenu(this.childUrlSegment);
  }

  checkOpenMenu(childUrl:any) {
    switch (childUrl) {
      case "x":
        this.isDetails = true;
        break;
      case "plans":
        this.isPlan = true;
        break;
      case "cdr":
        this.isCDR = true;
        break;
    }
  }
}
