// import { url } from "inspector";
import { Component, OnInit } from "@angular/core";
// import { NgxSpinnerService } from "ngx-spinner";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { ActivatedRoute, Router } from "@angular/router";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";
import { StatusCheckService } from "src/app/service/status-check-service.service";
import { CustomerService } from "src/app/service/customer.service";
// import { PartnerService } from "src/app/service/partner.service";
import { FormGroup } from "@angular/forms";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
// import { DatePipe, formatDate } from "@angular/common";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { ConfirmationService, MessageService } from "primeng/api";
// import * as moment from "moment";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import { AcctProfileService } from "src/app/service/radius-profile.service";
declare var $: any;
@Component({
    selector: "app-radius-customer-plans",
    templateUrl: "./radius-customer-plans.component.html",
    styleUrls: ["./radius-customer-plans.component.scss"],
    standalone: false
})
export class RadiusCustomerPlansComponent implements OnInit {
  custType: any;
  loggedInStaffId = localStorage.getItem("userId");
  partnerId = Number(localStorage.getItem("partnerId"));
  showFieldset: boolean = true;
  customerLedgerDetailData: any;
  customerNetworkLocationDetailData: any;
  customerId: number;
  customerBill: "";
  serviceAreaDATA: any;
  presentAdressDATA:any[] = [];
  permentAdressDATA:any[] = [];
  paymentAdressDATA:any[] = [];
  partnerDATA:any[] = [];
  chargeDATA:any[] = [];
  customerPopName: any = "";
  customerAddress: any;
  macList: string = "";
  locationList: string = "";
  isParentLocation: string = "NO";
  ifIndividualPlan = true;
  ifPlanGroup = false;
  planGroupName: any = [];
  dataPlan: any = [];
  extendValidityForm: FormGroup;
  extendValiditysubmitted: boolean = false;
  isPromiseToPayModelOpen: boolean = false;
  totalDays: any = 0;
  plane: boolean = false;
  trialDateData: any = [];
  tarialPlanData: any = [];
  selectScbscribeDate: any = "";
  showTrialPlan: any = " ";
  Subscriberform: FormGroup;
  changeTrialPlanRemark = " ";
  ExtendDays: any = "";
  trailbtnTypeSelect = "";
  PlanQuota = new BehaviorSubject({
    custid: "",
    PlanData: ""
  });
  visibleQuotaDetails: boolean = false;
  deleteTrailPlanAccess: boolean = false;
  extendTrailPlanAccess: boolean = false;
  subscribePlanAccess: boolean = false;
  promiseToPayPlanAccess: boolean = false;
  extendValidityPlanAccess: boolean = false;
  currentPagecustomerExpiryPlanListdata = 1;
  currentPagecustomerFuturePlanListdata = 1;
  currentPagecustomerCurrentPlanListdata = 1;
  customerCurrentPlanListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerFuturePlanListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerExpiryPlanListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custTrailPlanItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  currentTrailPlanListdata = 1;
  custShowTrailPlanShow = 1;
  TrailPlanList:any[] = [];
  showdata: any = [];
  promiseToPayBulkId:any[] = [];
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  istrialplan: boolean = false;
  custCurrentPlanList: any = [];
  futurePlanShowItemPerPage = 1;
  custFuturePlanList: any = [];
  expiredShowItemPerPage = 1;
  custExpiredPlanList: any = [];
  CurrentPlanShowItemPerPage = 1;
  badgeTypeForStatus: any;
  displayStatus: any;
  extendValidityBulkFlag: boolean = false;
  custPlanMappingStartDate: any;
  planGroupFlag = false;
  custPlanMappingStartDateArray:any[] = [];
  custPlanMappingEndDateArray:any[] = [];
  custPlanMappingEndDate: any;
  displayExtendValidity: boolean = false;
  custPlanMappingForValidity: any;
  extendValidityBulkId:any[] = [];
  remark: string;
  promiseToPayBulkFlag: boolean = false;
  extendPlangroupId: number = 0;
  promiseToPayData:any[] = [];
  planNotes = false;
  planForConnection:any;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  planNameOpen = false;
  promiseToPayIds:any[] = [];
  custQuotaListtotalRecords: any;
  currentPagecustQuotaList = 1;
  custQuotaListItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custQuotaList: any = [];
  planMappingId: any;
  planData: any;
  custid: any;
  mvnoId: string;
customerCurrentPlanListdatatotalRecords: string|number;
customerFuturePlanListdatatotalRecords: string|number;
customerExpiryPlanListdatatotalRecords: string|number;

  constructor(
    private customerService: CustomerService,
    private messageService: MessageService,
    private customerManagementService: CustomermanagementService,
    public KeyannaCommonBaseService: KeyannaCommonBaseService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    public statusCheckService: StatusCheckService,
    public commondropdownService: CommondropdownService,
    public PaymentamountService: PaymentamountService,
    private revenueManagementService: RevenueManagementService,
    private router: Router,
    private rediusprofileService: AcctProfileService
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("custId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  async ngOnInit() {
    this.getCustomersDetail(this.customerId);
    // this.getTrailPlanList(this.customerId, "");
    this.getcustCurrentPlan(this.customerId, "");
    this.getcustFuturePlan(this.customerId, "");
    this.getcustExpiredPlan(this.customerId, "");

    this.PlanQuota.subscribe(value => {
      this.custid = value.custid;
      this.planData = value.PlanData;
      if (this.custid) {
        this.getCustQuotaList(this.custid, "");
      }
    });
  }

  getTrailPlanList(custId:any, size:any) {
    let page_list;
    if (size) {
      page_list = size;
      this.custTrailPlanItemPerPage = size;
    } else {
      if (this.custShowTrailPlanShow == 1) {
        this.custTrailPlanItemPerPage = this.pageITEM;
      } else {
        this.custTrailPlanItemPerPage = this.custShowTrailPlanShow;
      }
    }
    const url = "/getTrialPlanList/" + custId;
    this.customerManagementService.getProtalMethod(url).subscribe(
      (response: any) => {
        this.TrailPlanList = response.dataList;

        if (this.TrailPlanList && this.TrailPlanList.length > 0) {
          this.istrialplan = true;
        }
        this.custTrailPlanItemPerPage = this.TrailPlanList?.length;
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  pageCustTrailPlanListData(pageNumber:any) {
    this.currentTrailPlanListdata = pageNumber;

    this.getTrailPlanList(this.customerLedgerDetailData.id, "");
  }

  TotalTrailPlanItemPerPage(event:any) {
    this.custShowTrailPlanShow = Number(event.value);
    if (this.currentTrailPlanListdata > 1) {
      this.currentTrailPlanListdata = 1;
    }
    this.getTrailPlanList(this.customerLedgerDetailData.id, this.custShowTrailPlanShow);
  }

  getcustCurrentPlan(custId:any, size:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    let page_list;

    if (size) {
      page_list = size;
      this.customerCurrentPlanListdataitemsPerPage = size;
    } else {
      if (this.CurrentPlanShowItemPerPage == 1) {
        this.customerCurrentPlanListdataitemsPerPage = this.pageITEM;
      } else {
        this.customerCurrentPlanListdataitemsPerPage = this.CurrentPlanShowItemPerPage;
      }
    }

    const url = "/getActivePlanList/" + custId + "?mvnoId=" + this.mvnoId;
    this.rediusprofileService.getMethodForRadius(url).subscribe(
      (response: any) => {
        console.log(response);
        if (response.dataList) {
          this.custCurrentPlanList = response.dataList.filter(
            (item:any) => item.custPlanStatus.toLowerCase() != "newactivation"
          );
        }
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  checkStatus(planStatus:any, workflowStatus:any) {
    let status = planStatus.toLowerCase();
    let statusWorkflow = workflowStatus ? workflowStatus.toLowerCase() : "";

    if (statusWorkflow == "newactivation" || statusWorkflow == "rejected") {
      if (statusWorkflow == "newactivation") this.badgeTypeForStatus = "green";
      else this.badgeTypeForStatus == "red";
      this.displayStatus = workflowStatus.toUpperCase();
    } else {
      this.displayStatus = planStatus.toUpperCase();
      switch (status) {
        case "active":
        case "ingrace":
          this.badgeTypeForStatus = "green";
          break;
        case "terminate":
        case "stop":
        case "inactive":
        case "expired":
          this.badgeTypeForStatus = "red";
          break;
        case "hold":
        case "disable":
          this.badgeTypeForStatus = "grey";
          break;
        default:
          break;
      }
    }
    return true;
  }

  promiseToPayDetailsClick(id:any, startDate:any, endDate:any, days:any) {
    this.promiseToPayData = [{ startDate: startDate, endDate: endDate, days: days }];
    this.isPromiseToPayModelOpen = true;
    this.PaymentamountService.show(id);
  }

  pageChangedcustomerCurrentPlanListData(pageNumber:any) {
    this.currentPagecustomerCurrentPlanListdata = pageNumber;
    this.getcustCurrentPlan(this.customerLedgerDetailData.id, "");
  }

  TotalCurrentPlanItemPerPage(event:any) {
    this.CurrentPlanShowItemPerPage = Number(event.value);
    if (this.currentPagecustomerCurrentPlanListdata > 1) {
      this.currentPagecustomerCurrentPlanListdata = 1;
    }
    this.getcustCurrentPlan(this.customerLedgerDetailData.id, this.CurrentPlanShowItemPerPage);
  }

  getcustFuturePlan(custId:any, size:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    console.log(this.customerLedgerDetailData);
    let page_list;
    if (size) {
      page_list = size;
      this.customerFuturePlanListdataitemsPerPage = size;
    } else {
      if (this.futurePlanShowItemPerPage == 1) {
        this.customerFuturePlanListdataitemsPerPage = this.pageITEM;
      } else {
        this.customerFuturePlanListdataitemsPerPage = this.futurePlanShowItemPerPage;
      }
    }

    const url = "/getFuturePlanList/" + custId + "?mvnoId=" + this.mvnoId;
    this.rediusprofileService.getMethodForRadius(url).subscribe(
      (response: any) => {
        this.custFuturePlanList = response.dataList;
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  openPlanConnectionModal(plan:any) {
    this.planForConnection = plan;
    this.planNameOpen = true;
  }

  getSerialNumber(plan:any) {
    return plan.customerInventorySerialnumberDtos.filter((item:any) => item.primary).length > 0
      ? plan.customerInventorySerialnumberDtos.filter((item:any) => item.primary)[0].serialNumber
      : "";
  }

  getCustQuotaList(custId:any, plan:any) {
    this.customerManagementService.getCustQuotaListFromRadius(custId).subscribe(
      (response: any) => {
        let data = response.custQuotaList;
        this.custQuotaList = data.filter((e:any) => e.cprId == plan.id);
        this.custQuotaList = this.custQuotaList.map((item:any) => ({
          ...item,
          planName: plan.planName
        }));
        this.visibleQuotaDetails = true;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  resetQuotaConfirm(custId:any, plan:any) {
    this.confirmationService.confirm({
      message: "Quota will be reset, Do you want to process ?",
      header: "Reload Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.resetQuota(custId, plan);
      },
      reject: () => {
        this.messageService.add({
          severity: "info",
          summary: "Rejected",
          detail: "You have rejected"
        });
      }
    });
  }

  resetQuota(custId:any, plan:any) {
    this.customerManagementService.resetQuota(custId, plan.planmapid).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Quota Reset successfully",
          icon: "far fa-times-circle"
        });
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  pageChangedcustFuturePlanListData(pageNumber:any) {
    this.currentPagecustomerFuturePlanListdata = pageNumber;
    this.getcustFuturePlan(this.customerLedgerDetailData.id, "");
  }

  TotalFuturePlanItemPerPage(event:any) {
    this.futurePlanShowItemPerPage = Number(event.value);
    if (this.currentPagecustomerFuturePlanListdata > 1) {
      this.currentPagecustomerFuturePlanListdata = 1;
    }
    this.getcustFuturePlan(this.customerLedgerDetailData.id, this.futurePlanShowItemPerPage);
  }

  getcustExpiredPlan(custId:any, size:any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    let page_list;
    if (size) {
      page_list = size;
      this.customerExpiryPlanListdataitemsPerPage = size;
    } else {
      if (this.expiredShowItemPerPage == 1) {
        this.customerExpiryPlanListdataitemsPerPage = this.pageITEM;
      } else {
        this.customerExpiryPlanListdataitemsPerPage = this.expiredShowItemPerPage;
      }
    }

    const url = "/getExpiredPlanList/" + custId;
    this.rediusprofileService.getMethodForRadius(url).subscribe(
      (response: any) => {
        this.custExpiredPlanList = response.dataList;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  pageChangedcustomerExpiryPlanListData(pageNumber:any) {
    this.currentPagecustomerExpiryPlanListdata = pageNumber;
    this.getcustExpiredPlan(this.customerId, "");
  }

  TotalExpiredPlanItemPerPage(event:any) {
    this.expiredShowItemPerPage = Number(event.value);
    if (this.currentPagecustomerExpiryPlanListdata > 1) {
      this.currentPagecustomerExpiryPlanListdata = 1;
    }
    this.getcustExpiredPlan(this.customerId, this.expiredShowItemPerPage);
  }

  getCustomersDetail(custId:any) {
    this.presentAdressDATA = [];
    this.permentAdressDATA = [];
    this.paymentAdressDATA = [];
    this.partnerDATA = [];
    this.chargeDATA = [];
    let plandatalength = 0;

    this.customerService.getCustomerById(custId).subscribe(
      (response: any) => {
        this.customerLedgerDetailData = response.customer;
        this.custType = this.customerLedgerDetailData.custtype;

        if (this.customerLedgerDetailData.plangroupid) {
          this.ifIndividualPlan = false;
          this.ifPlanGroup = true;
          //plan group
          let planGroupurl =
            "/findPlanGroupById?planGroupId=" + this.customerLedgerDetailData.plangroupid;

          this.customerManagementService.getMethod(planGroupurl).subscribe((response: any) => {
            this.planGroupName = response.planGroup.planGroupName;
          });
        } else {
          this.ifIndividualPlan = true;
          this.ifPlanGroup = false;
          //plan detials
          while (plandatalength < this.customerLedgerDetailData.planMappingList.length) {
            let planurl =
              "/postpaidplan/" +
              this.customerLedgerDetailData.planMappingList[plandatalength].planId;
            this.customerManagementService
              .getMethodForRadius(planurl)
              .subscribe((response: any) => {
                if (response.postPaidPlan) {
                  this.dataPlan.push(response.postPaidPlan.name);
                }
              });
            plandatalength++;
          }
        }

        console.log(this.customerLedgerDetailData);
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  closeModel() {
    this.visibleQuotaDetails = false;
    this.PlanQuota = new BehaviorSubject({
      custid: "",
      PlanData: ""
    });
  }

  pageChangedCustQuotaList(pageNumber:any) {
    this.currentPagecustQuotaList = pageNumber;
  }

  closeDialog() {
    this.planForConnection = null;
    this.planNameOpen = false;
    this.visibleQuotaDetails = false;
  }

  listCustomer() {
    this.router.navigate(["/home/radiuscustomer/list"]);
  }

  findDuration(expiryDate: Date) {
    // var datePipe = new DatePipe();
    var start = (new Date(new Date().setHours(0, 0, 0, 0)), "DD/MM/YYYY"); //todays date
    var end = (new Date(expiryDate), "DD/MM/YYYY"); // another date
    // var duration = moment.duration(end.diff(start));

    // var days = duration.asDays();
    // return Math.trunc(days);
  }
}
