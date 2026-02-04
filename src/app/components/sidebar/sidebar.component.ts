import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoginService } from "src/app/service/login.service";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { MenuItems } from "src/app/constants/menuItems";
import { SidebarService } from "src/app/service/sidebar.service";
import { TooltipPosition } from "@angular/material/tooltip";
import { FormControl } from "@angular/forms";
import {
  COUNTRY,
  CITY,
  STATE,
  PINCODE,
  AREA,
  MVNO,
  CUSTOMER_PREPAID,
  CUSTOMER_POSTPAID
} from "src/app/RadiusUtils/RadiusConstants";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import {
  AUDITS,
  CREDIT_NOTES,
  DASHBOARDS,
  DTVS,
  DUNNINGS,
  INTEGRATION_SYSTEMS,
  INVENTORYS,
  INVOICE_SYSTEMS,
  MASTERS,
  NETWORKS,
  NOTIFICATIONS,
  PARTNERS,
  PAYMENT_SYSTEMS,
  POST_CUST_CONSTANTS,
  PRE_CUST_CONSTANTS,
  PRODUCTS,
  RADIUS_CONSTANTS,
  SALES_CRMS,
  SALES_FULFILLMENTS,
  SETTINGS,
  TACACS,
  TICKETING_SYSTEMS,
  WORKFLOWS,
  TASK_SYSTEMS
} from "src/app/constants/aclConstants";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { StaffService } from "src/app/service/staff.service";
import { StatusCheckService } from "src/app/service/status-check-service.service";

@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.component.css"],
    standalone: false
})
export class SidebarComponent implements OnInit {
  AclClassConstants;
  AclConstants;
  DASHBOARDS;
  MASTERS;
  PRODUCTS;
  PARTNERS;
  DTVS;
  SALES_CRMS;
  SALES_FULFILLMENTS;
  PRE_CUST_CONSTANTS;
  POST_CUST_CONSTANTS;
  INVOICE_SYSTEMS;
  PAYMENT_SYSTEMS;
  CREDIT_NOTES;
  TICKETING_SYSTEMS;
  TASK_SYSTEMS;
  DUNNINGS;
  RADIUS_CONSTANTS;
  TACACS;
  NETWORKS;
  INVENTORYS;
  NOTIFICATIONS;
  WORKFLOWS;
  INTEGRATION_SYSTEMS;
  SETTINGS;
  AUDITS;
  countryTitle = COUNTRY;
  cityTitle = CITY;
  stateTitle = STATE;
  pincodeTitle = PINCODE;
  areaTitle = AREA;
  mvnoTitle = MVNO;
  preCustTitle = CUSTOMER_PREPAID;
  postCustTitle = CUSTOMER_POSTPAID;
  isActiveRadius: boolean = false;
  isActiveWifi: boolean = false;
  isActiveNotification: boolean = false;
  isActiveTacacs: boolean = false;
  //   isActiveSalesCrm: boolean = false;
  loggedInUser: string = "";
  isActiveController: boolean = false;
  mvnoId: any;
  showMvno: boolean;
  MenuItems;
  userRole: any;
  menuItemService: any;
  public loginService: LoginService;
  positionOptions: TooltipPosition[] = ["after", "before", "above", "below", "left", "right"];
  position = new FormControl(this.positionOptions[0]);
  username: string;
  profileImg: any;
  staffImg: any;
  loginPartner: any;
  isBuTypeOnDemand: boolean = false;
  isBuTypePredefined: boolean = false;
  userId:any;
 
  constructor(
    private router: Router,
    loginService: LoginService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    public sidebarService: SidebarService,
    private sanitizer: DomSanitizer,
    public staffService: StaffService,
    public statusCheckService: StatusCheckService,
    menuConstants: MenuItems
  ) {
    this.MenuItems = menuConstants.menuItems;
    this.menuItemService = menuConstants;
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.MASTERS = MASTERS;
    this.DASHBOARDS = DASHBOARDS;
    this.PRODUCTS = PRODUCTS;
    this.PARTNERS = PARTNERS;
    this.DTVS = DTVS;
    this.SALES_CRMS = SALES_CRMS;
    this.SALES_FULFILLMENTS = SALES_FULFILLMENTS;
    this.PRE_CUST_CONSTANTS = PRE_CUST_CONSTANTS;
    this.POST_CUST_CONSTANTS = POST_CUST_CONSTANTS;
    this.INVOICE_SYSTEMS = INVOICE_SYSTEMS;
    this.PAYMENT_SYSTEMS = PAYMENT_SYSTEMS;
    this.CREDIT_NOTES = CREDIT_NOTES;
    this.TICKETING_SYSTEMS = TICKETING_SYSTEMS;
    this.TASK_SYSTEMS = TASK_SYSTEMS;
    this.DUNNINGS = DUNNINGS;
    this.RADIUS_CONSTANTS = RADIUS_CONSTANTS;
    this.TACACS = TACACS;
    this.NETWORKS = NETWORKS;
    this.INVENTORYS = INVENTORYS;
    this.NOTIFICATIONS = NOTIFICATIONS;
    this.WORKFLOWS = WORKFLOWS;
    this.INTEGRATION_SYSTEMS = INTEGRATION_SYSTEMS;
    this.SETTINGS = SETTINGS;
    this.AUDITS = AUDITS;
    this.AclConstants = AclConstants;
  }

  ngOnInit(): void {
    // Subscribe to ACL entry updates
    // this.loginService.aclEntry$.subscribe(aclEntry => {
    //   // Perform any necessary updates to the sidebar content here
    // });

    this.username = localStorage.getItem("loginUserName");

    this.userId = localStorage.getItem("userId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    this.loginPartner = localStorage.getItem("partnerId");
    this.userRole = localStorage.getItem("userRoles");
    this.mvnoId = localStorage.getItem("mvnoId");
    const roles = localStorage.getItem("userRoles").split(",");
    this.showMvno = this.mvnoId == 1 ? true : false; //roles.includes('1') ? true : false
    // console.log("this.showMvno", this.showMvno);
    this.staffService.getStaffUserData(this.userId).subscribe((response: any) => {
      console.log();
       let roleName = response.Staff.roleName.pop()
      localStorage.setItem("roleName", roleName);
      this.profileImg = response.Staff.profileImage;
      this.staffService.staffImg = this.sanitizer.bypassSecurityTrustResourceUrl(
        `data:image/png;base64, ${response.Staff.profileImage}`
      );
    });
    this.getCurrentStaffBUType();
  }
  // checkfiunction() {}

  login() {
    this.router.navigate(["/login"]);
  }

  // logout() {
  //   sessionStorage.removeItem('username');
  //   sessionStorage.removeItem('password');
  //   this.router.navigate(['/login']);
  // }

  logout() {
    //It will remove token from local storage
    this.statusCheckService.isActiveCMS = false;
    this.statusCheckService.isActiveIntegrationService = false;
    this.statusCheckService.isActiveInventoryService = false;
    this.statusCheckService.isActiveKPIService = false;
    this.statusCheckService.isActiveNotificationService = false;
    this.statusCheckService.isActivePMS = false;
    this.statusCheckService.isActiveRadiusService = false;
    this.statusCheckService.isActiveRevenueService = false;
    this.statusCheckService.isActiveSalesCrm = false;
    this.statusCheckService.isActiveTacacs = false;
    this.statusCheckService.isActiveTaskManagementService = false;
    this.statusCheckService.isActiveTicketService = false;
    this.loginService.logout();
    this.router.navigate(["/login"]);
    //It will reload the context.
    // location.reload();
  }

  getCurrentStaffBUType() {
    this.loginService
      .getCurrentBUStaff("/businessUnit/getBUFromCurrentStaff")
      .subscribe((res: any) => {
        if (res.dataList?.length === 1) {
          if (res.dataList[0].planBindingType == "On-Demand") {
            this.isBuTypeOnDemand = true;
            this.isBuTypePredefined = false;
          } else {
            this.isBuTypeOnDemand = false;
            this.isBuTypePredefined = true;
          }
        } else if (res.dataList?.length == 0 || res.dataList == null) {
          this.isBuTypeOnDemand = true;
          this.isBuTypePredefined = true;
        } else if (res.dataList?.length > 1) {
          res.dataList.forEach((element:any) => {
            if (element.planBindingType == "On-Demand") {
              this.isBuTypeOnDemand = true;
            }
            if (element.planBindingType == "Predefined") {
              this.isBuTypePredefined = true;
            }
          });
        } else {
          this.isBuTypeOnDemand = true;
          this.isBuTypePredefined = true;
        }
      });
  }
}
