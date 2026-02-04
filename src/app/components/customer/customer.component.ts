import { Component, OnInit } from "@angular/core";
import {
  Router,
  RouterEvent,
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
  ActivatedRoute,
} from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LoginService } from "src/app/service/login.service";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
import {
  COUNTRY,
  CITY,
  STATE,
  PINCODE,
  AREA,
  MVNO,
  CUSTOMER_PREPAID,
  CUSTOMER_POSTPAID,
} from "src/app/RadiusUtils/RadiusConstants";

@Component({
    selector: "app-customer",
    templateUrl: "./customer.component.html",
    styleUrls: ["./customer.component.css"],
    standalone: false
})
export class CustomerComponent implements OnInit {
  custType;
  title = CUSTOMER_PREPAID;
  isShowMenu = true;
  isShowCreateView = true;
  isShowListView = true;
  createAccess: boolean = false;
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private route: ActivatedRoute,
    loginService: LoginService
  ) {
    this.custType = this.route.snapshot.firstChild.paramMap.get("custType")!;
    this.custType == "Prepaid" ? (this.title = CUSTOMER_PREPAID) : (this.title = CUSTOMER_POSTPAID);
    this.createAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.CREATE_PRE_CUST
        : POST_CUST_CONSTANTS.CREATE_POST_CUST_LIST
    );
    console.log("CUSTOMER_PREPAID :::", CUSTOMER_PREPAID);
    console.log("CUSTOMER_POSTPAID :::", CUSTOMER_POSTPAID);
  }
  ngOnInit(): void {
    const childUrlSegment = this.route.firstChild.snapshot.url[0].path;
    if (childUrlSegment === "list") {
      this.isShowMenu = true;
      this.isShowListView = true;
      this.isShowCreateView = false;
    } else if (childUrlSegment === "create" || childUrlSegment === "edit") {
      this.isShowMenu = true;
      this.isShowCreateView = true;
      this.isShowListView = false;
    } else {
      this.isShowMenu = false;
      this.isShowCreateView = false;
      this.isShowListView = false;
    }
  }
}
