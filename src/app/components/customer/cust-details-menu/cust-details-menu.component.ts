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
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";
import { LoginService } from "src/app/service/login.service";
import {
  POST_CUST_CONSTANTS,
  PRE_CUST_CONSTANTS,
  CREDIT_NOTES,
} from "src/app/constants/aclConstants";
import { StatusCheckService } from "src/app/service/status-check-service.service";
import { CUSTOMER_POSTPAID, CUSTOMER_PREPAID } from "src/app/RadiusUtils/RadiusConstants";

@Component({
    selector: "app-cust-details-menu",
    templateUrl: "./cust-details-menu.component.html",
    styleUrls: ["./cust-details-menu.component.css"],
    standalone: false
})
export class CustDetailsMenuComponent implements OnInit {
  custType:any;
  custId:any;
  childUrlSegment = "";
  custData: any = {};
  childCustomerDataList: any = {};
  isCustomerDetailSubMenu = true;
  showChangePassword = false;
  isDetails = false;
  isPlan = false;
  isInvoice = false;
  isLedger = false;
  isPayment = false;
  isInventory = false;
  isChangePlan = false;
  isChangeDiscount = false;
  isChangeStatus = false;
  isWallet = false;
  isServiceManagement = false;
  isSessionHistory = false;
  isTicket = false;
  isChargeManagement = false;
  isCreditNote = false;
  isDBRReport = false;
  isWorkflowAudit = false;
  isAuditDetails = false;
  isDunningManagement = false;
  isNotification = false;
  isChildCustOpen = false;
  isShiftLocation = false;
  PRE_CUST_CONSTANTS = PRE_CUST_CONSTANTS;
  POST_CUST_CONSTANTS = POST_CUST_CONSTANTS;
  CREDIT_NOTES = CREDIT_NOTES;
  title = CUSTOMER_PREPAID;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private customerManagementService: CustomermanagementService,
    public KeyannaCommonBaseService: KeyannaCommonBaseService,
    public loginService: LoginService,
    public statusCheckService: StatusCheckService
  ) {}
  ngOnInit() {
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.custType == "Prepaid" ? (this.title = CUSTOMER_PREPAID) : (this.title = CUSTOMER_POSTPAID);

    this.custId = this.route.snapshot.firstChild.paramMap.get("customerId")!;
    this.childUrlSegment = this.route.firstChild.snapshot.url[0].path;
    this.checkOpenMenu(this.childUrlSegment);
    this.getCustomersDetail(this.custId);
    // this.getChildCustomers(this.custId);
  }

  checkOpenMenu(childUrl: any) {
    switch (childUrl) {
      case "x":
        this.isDetails = true;
        break;
      case "plans":
        this.isPlan = true;
        break;
      case "invoice":
        this.isInvoice = true;
        break;
      case "ledger":
        this.isLedger = true;
        break;
      case "payment":
        this.isPayment = true;
        break;
      case "inventoryManagement":
        this.isInventory = true;
        break;
      case "changePlan":
        this.isChangePlan = true;
        break;
      case "changeDiscount":
        this.isChangeDiscount = true;
        break;
      case "changeStatus":
        this.isChangeStatus = true;
        break;
      case "wallet":
        this.isWallet = true;
        break;
      case "serviceManagement":
        this.isServiceManagement = true;
        break;
      case "sessionHistory":
        this.isSessionHistory = true;
        break;
      case "tickets":
        this.isTicket = true;
        break;
      case "chargeManagement":
        this.isChargeManagement = true;
        break;
      case "creditNote":
        this.isCreditNote = true;
        break;
      case "revenueReport":
        this.isDBRReport = true;
        break;
      case "workflowAudit":
        this.isWorkflowAudit = true;
        break;
      case "auditDetails":
        this.isAuditDetails = true;
        break;
      case "dunningManagement":
        this.isDunningManagement = true;
        break;
      case "notification":
        this.isNotification = true;
        break;
      case "childCustomers":
        this.isChildCustOpen = true;
        break;
      case "shiftLocation":
        this.isShiftLocation = true;
        break;
    }
  }

  getCustomersDetail(custId:any) {
    console.log(":::::::::::::: getCustomersDetail :::::: ");
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.custData = response.customers;
    });
  }

  // This method is used to check that customer has any service/plan with invoice type Independent or not
  // returns 'true' if customer has any service/plan with invoice type Independent otherwise returns 'false'
  hasCustInvoiceTypeIndependent() {
    return (
      this.custData.planMappingList.filter((item:any) => item.invoiceType === "Independent").length > 0
    );
  }

  openSubMenu(url:any) {
    this.router.navigate([url]);
  }

  getBUFromCurrentStaff() {
    this.KeyannaCommonBaseService.get("/businessUnit/getBUFromCurrentStaff").subscribe((res: any) => {
      if (res.dataList?.length === 1) {
        if (res.dataList[0].planBindingType == "On-Demand") {
          // this.isPlanOnDemand = true;
          //TODO Change to cust add service
          this.router.navigate([
            "/home/customer/details/" +
              this.custType +
              "/serviceManagement/add-service/" +
              this.custId,
          ]);
        } else {
          this.router.navigate([
            "/home/customer/details/" + this.custType + "/serviceManagement/" + this.custId,
          ]);
        }
      } else if (res.dataList?.length == 0 || res.dataList == null) {
        this.router.navigate([
          "/home/customer/details/" + this.custType + "/serviceManagement/" + this.custId,
        ]);
      } else
        this.router.navigate([
          "/home/customer/details/" + this.custType + "/serviceManagement/" + this.custId,
        ]);
    });
  }

  getChildCustomers(id:any) {
    const url = `/getAllActualChildCustomer?customerId=${id}`;
    const data = {
      page: 1,
      pageSize: 5,
    };
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.childCustomerDataList = response;
      },
      (error: any) => {}
    );
  }
  openPassChange() {
    this.showChangePassword = true;
  }
  closePassChange() {
    this.showChangePassword = false;
  }
}
