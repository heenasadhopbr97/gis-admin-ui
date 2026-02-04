import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { ConfirmationService, MessageService } from "primeng/api";
// import * as moment from "moment";
import { BehaviorSubject, Observable, Observer } from "rxjs";
import { LoginService } from "src/app/service/login.service";
import { DatePipe, formatDate } from "@angular/common";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";

declare var $: any;

@Component({
    selector: "app-customer-plans",
    templateUrl: "./customer-plans.component.html",
    styleUrls: ["./customer-plans.component.scss"],
    standalone: false
})
export class CustomerPlansComponent implements OnInit {
  custType: any;
  loggedInStaffId = localStorage.getItem("userId");
  partnerId = Number(localStorage.getItem("partnerId"));
  customerId: number;
  displayExtendValidity: boolean = false;
  AclClassConstants;
  AclConstants;
  customerLedgerDetailData: any = {};
  custPlanMappingStartDate: any;
  promiseToPayData:any[] = [];
  custPlanMappingEndDate: any;
  custPlanMappingStartDateArray:any[] = [];
  custPlanMappingEndDateArray:any[] = [];
  planGroupFlag = false;
  extendValidityForm: FormGroup;
  extendValiditysubmitted: boolean = false;
  isPromiseToPayModelOpen: boolean = false;
  totalDays: any = 0;
  custPlanMappingForValidity: any;
  extendValidityBulkFlag: boolean = false;
  promiseToPayBulkFlag: boolean = false;
  extendValidityBulkId:any[] = [];
  promiseToPayBulkId:any[] = [];
  extendPlangroupId: number = 0;
  remark: string;
  planNameOpen = false;
  istrialplan: boolean = false;
  planForConnection:any;
  badgeTypeForStatus: any;
  displayStatus: any;
  changePlanTypeSelection: any;
  newPlanSelection: any;
  newPlanData: any = [];
  promiseToPayIds:any[] = [];
  CurrentPlanShowItemPerPage = 1;
  custCurrentPlanList: any = [];
  futurePlanShowItemPerPage = 1;
  custFuturePlanList: any = [];
  expiredShowItemPerPage = 1;
  custExpiredPlanList: any = [];
  currentPagecustomerExpiryPlanListdata = 1;
  currentPagecustomerFuturePlanListdata = 1;
  currentPagecustomerCurrentPlanListdata = 1;
  customerCurrentPlanListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerFuturePlanListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerExpiryPlanListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custTrailPlanItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  custTrailPlantotalRecords: any;
  currentTrailPlanListdata = 1;
  TrailPlanList:any[] = [];
  custShowTrailPlanShow = 1;
  showdata: any = [];
  planNotes = false;
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
    PlanData: "",
  });

  customerCurrentPlanListdatatotalRecords:any;
  customerFuturePlanListdatatotalRecords:any;
  customerExpiryPlanListdatatotalRecords:any;
  visibleQuotaDetails: boolean = false;
  deleteTrailPlanAccess: boolean = false;
  extendTrailPlanAccess: boolean = false;
  subscribePlanAccess: boolean = false;
  promiseToPayPlanAccess: boolean = false;
  extendValidityPlanAccess: boolean = false;
  remarkModel: boolean = false;
  constructor(
    private spinner: NgxSpinnerService,
    public PaymentamountService: PaymentamountService,
    private customerManagementService: CustomermanagementService,
    private revenueManagementService: RevenueManagementService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public loginService: LoginService,
    public commondropdownService: CommondropdownService
  ) {
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.extendTrailPlanAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_PLANS_EXTEND_TRIAL
        : POST_CUST_CONSTANTS.POST_CUST_PLANS_EXTEND_TRIAL
    );
    this.subscribePlanAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_PLANS_SUBSCRIBE_TRIAL
        : POST_CUST_CONSTANTS.POST_CUST_PLANS_SUBSCRIBE_TRIAL
    );
    this.deleteTrailPlanAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_PLANS_DELETE_TRIAL
        : POST_CUST_CONSTANTS.POST_CUST_PLANS_DELETE_TRIAL
    );
    this.promiseToPayPlanAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_PLANS_PTP
        : POST_CUST_CONSTANTS.POST_CUST_PLANS_PTP
    );
    this.extendValidityPlanAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_PLANS_EXTEND_VALIDITY
        : POST_CUST_CONSTANTS.POST_CUST_PLANS_EXTEND_VALIDITY
    );
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }

  async ngOnInit() {
    let staffID = localStorage.getItem("userId");
    let loggedInUser = localStorage.getItem("loggedInUser");
    this.partnerId = Number(localStorage.getItem("partnerId"));

    this.extendValidityForm = this.fb.group({
      downStartDate: ["", Validators.required],
      downEndDate: ["", Validators.required],
      extend_validity_remarks: ["", Validators.required],
    });

    this.Subscriberform = this.fb.group({
      billinng: [""],
      remarks: [""],
    });
    this.commondropdownService.getsystemconfigList();
    this.getcustFuturePlan(this.customerId, "");
    this.getcustExpiredPlan(this.customerId, "");
    this.getcustCurrentPlan(this.customerId, "");
    this.getTrailPlanList(this.customerId, "");
    this.getCustomersDetail(this.customerId);
  }

  customerDetailOpen() {
    this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
  }

  getCustomersDetail(custId:any) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.customerLedgerDetailData = response.customers;
    });
  }

  extendValidityForBulk() {
    //min date
    this.custPlanMappingStartDate = this.custPlanMappingStartDateArray.reduce(function (a, b) {
      return a < b ? a : b;
    });
    //min date
    this.custPlanMappingEndDate = this.custPlanMappingEndDateArray.reduce(function (a, b) {
      return a > b ? a : b;
    });

    this.confirmationService.confirm({
      message: "Do you want to Extend all services ?",
      header: "Extend Service Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.displayExtendValidity = true;
      },
      reject: () => {
        this.planGroupFlag = false;
        this.messageService.add({
          severity: "info",
          summary: "Rejected",
          detail: "You have rejected",
        });
      },
    });
  }

  getTotalDays() {
    console.log(this.extendValidityForm.value);
    var date1 = new Date(this.extendValidityForm.value.downStartDate);
    var date2 = new Date(this.extendValidityForm.value.downEndDate);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    console.log(Difference_In_Days);
    this.totalDays = Difference_In_Days + 1;
  }

  extendValidityConfirmation() {
    this.extendValiditysubmitted = true;
    if (this.extendValidityForm.valid) {
      if (
        this.custPlanMappingForValidity.isChildExists &&
        this.custPlanMappingForValidity.isChildExists === true
      ) {
        this.confirmationService.confirm({
          message: "Do you want to extend validity for child customer?",
          header: "Extend Validity Confirmation",
          icon: "pi pi-info-circle",
          accept: () => {
            this.extendValidity(true);
          },
          reject: () => {
            this.extendValidity(false);
          },
        });
      } else {
        this.extendValidity(false);
      }
    }
  }

  extendValidity(isExtentionForChild:any) {
    let url;
    let extendValidity;
    if (this.extendValidityForm.valid) {
      if (this.extendValidityBulkFlag) {
        let extendData:any[] = [];
        let extendValidityData: any;
        let idList = this.extendValidityBulkId;
        idList.forEach(element => {
          extendValidityData = {
            custPlanMapppingId: element,
            extentionforChild: isExtentionForChild,
          };
          Object.assign(extendValidityData, this.extendValidityForm.value);
          if (this.planGroupFlag) {
            Object.assign(extendValidityData, {
              planGroup: this.planGroupFlag,
              planGroupId: this.extendPlangroupId,
            });
          }
          extendData.push(extendValidityData);
          extendValidity = { extendPlanValidity: extendData };
        });
      } else {
        let extendPlanValidity = [];
        let extendValidityData: any;
        extendValidityData = {
          custPlanMapppingId: this.custPlanMappingForValidity.custPlanMapppingId,
          extentionforChild: isExtentionForChild,
        };
        Object.assign(extendValidityData, this.extendValidityForm.value);
        if (this.planGroupFlag) {
          Object.assign(extendValidityData, {
            planGroup: this.planGroupFlag,
            planGroupId: this.extendPlangroupId,
          });
        }
        extendPlanValidity.push(extendValidityData);
        extendValidity = {
          extendPlanValidity: extendPlanValidity,
        };
      }
      url = `/subscriber/extendPlanValidityInBulk`;
      console.log(extendValidity);

      this.customerManagementService.postMethod(url, extendValidity).subscribe(
        (res: any) => {
          if (res.responseCode == 417) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: res.responseMessage,
              icon: "far fa-times-circle",
            });
          } else {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: res.message,
              icon: "far fa-check-circle",
            });
          }
          // $("#IdRemark").modal("hide");
          this.getcustCurrentPlan(this.customerId, "");
          this.getcustFuturePlan(this.customerId, "");
          this.getcustExpiredPlan(this.customerId, "");
          this.remark = "";
          this.onCloseValidity();
          this.extendValidityBulkFlag = false;
          this.promiseToPayBulkFlag = false;
          this.extendValidityBulkId = [];
          this.promiseToPayBulkId = [];
        },
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
        }
      );
    }
  }

  getcustCurrentPlan(custId:any, size:any) {
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

    const url = "/subscriber/getActivePlanList/" + custId + "?isNotChangePlan=true";
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        // this.custCurrentPlanList = response.dataList;
        this.custCurrentPlanList = response.dataList.filter(
          (item:any) => item.custPlanStatus.toLowerCase() != "newactivation"
        );
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  getcustFuturePlan(custId:any, size:any) {
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

    const url = "/subscriber/getFuturePlanList/" + custId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.custFuturePlanList = response.dataList;
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  getcustExpiredPlan(custId:any, size:any) {
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

    const url = "/subscriber/getExpiredPlanList/" + custId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.custExpiredPlanList = response.dataList;
        // console.log(" this.custExpiredPlanList", this.custExpiredPlanList);
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  onCloseValidity() {
    this.extendValidityForm.reset();
    this.custPlanMappingForValidity = null;
    this.displayExtendValidity = false;
  }

  extendValidityBulk(plan:any, e:any) {
    if (e.checked) {
      this.extendValidityBulkFlag = true;
      this.extendValidityBulkId.push(plan.custPlanMapppingId);
      this.planGroupFlag = plan.plangroupid != null;
      this.custPlanMappingForValidity = plan;
      this.extendPlangroupId = plan.plangroupid ? plan.plangroupid : 0;
      // this.custPlanMappingEndDate = moment(plan.endDate, "DD/MM/YYYY").toDate();
      // this.custPlanMappingStartDate = moment(plan.startDate, "DD/MM/YYYY").toDate();
      // this.custPlanMappingEndDateArray.push(moment(plan.endDate, "DD/MM/YYYY").toDate());
      // this.custPlanMappingStartDateArray.push(moment(plan.startDate, "DD/MM/YYYY").toDate());
    } else {
      const index = this.extendValidityBulkId.indexOf(plan.custPlanMapppingId);
      if (index > -1) this.extendValidityBulkId.splice(index, 1);
      if (this.extendValidityBulkId.length <= 0) this.extendValidityBulkFlag = false;
    }
  }

  promiseToPayBulk(id:any, e:any) {
    if (e.checked) {
      this.promiseToPayBulkFlag = true;
      this.promiseToPayBulkId.push(id);
    } else {
      this.promiseToPayBulkFlag = false;
      const index = this.promiseToPayBulkId.indexOf(id);
      if (index > -1) this.promiseToPayBulkId.splice(index, 1);
    }
  }

  openPlanConnectionModal(plan:any) {
    this.planForConnection = plan;
    this.planNameOpen = true;
  }

  closeDialog() {
    this.planForConnection = null;
    this.planNameOpen = false;
    this.visibleQuotaDetails = false;
  }

  closeModel() {
    this.visibleQuotaDetails = false;
    this.PlanQuota = new BehaviorSubject({
      custid: "",
      PlanData: "",
    });
  }

  getSerialNumber(plan:any) {
    return plan.customerInventorySerialnumberDtos.filter((item:any) => item.primary).length > 0
      ? plan.customerInventorySerialnumberDtos.filter((item:any) => item.primary)[0].serialNumber
      : "";
  }

  quotaPlanDetailsModel(modelID:any, custid:any, PlanData:any) {
    this.visibleQuotaDetails = true;
    this.PaymentamountService.show(modelID);
    this.PlanQuota.next({
      custid,
      PlanData,
    });
  }

  quotaModalOpen() {
    this.visibleQuotaDetails = false;
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

  onPromiseToPay(planmapid:any) {
    this.remarkModel = true;
    this.promiseToPayIds = [];
    this.promiseToPayIds.push(planmapid);
  }

  onPromiseToPayClick() {
    this.remarkModel = true;
  }

  isExtendInExpiredPlan(custPlanMapppingId:any, planExpiryDate:any) {
    if (this.custCurrentPlanList != null && this.custCurrentPlanList.length > 0) {
      if (this.custExpiredPlanList.length == 1) {
        return (
          this.custCurrentPlanList.filter((item:any) => item.custPlanMapppingId == custPlanMapppingId)
            .length == 0 &&
          this.custFuturePlanList.filter((item:any) => item.custPlanMapppingId == custPlanMapppingId)
            .length == 0
        );
      }
      return (
        this.custCurrentPlanList.filter((item:any) => item.custPlanMapppingId == custPlanMapppingId)
          .length == 0 &&
        this.custFuturePlanList.filter((item:any) => item.custPlanMapppingId == custPlanMapppingId)
          .length == 0 &&
        this.custExpiredPlanList.filter(
          // (item:any) =>
          //   item.custPlanMapppingId == custPlanMapppingId &&
          //   moment(item.expiryDate, "DD/MM/YYYY").toDate() >
          //     moment(planExpiryDate, "DD/MM/YYYY").toDate()
        ).length == 0
      );
    }
    return (
      this.custExpiredPlanList.filter(
        // (item:any) =>
        //   item.custPlanMapppingId == custPlanMapppingId &&
        //   moment(item.expiryDate, "DD/MM/YYYY").toDate() >
        //     moment(planExpiryDate, "DD/MM/YYYY").toDate()
      ).length == 0 &&
      this.custFuturePlanList.filter((item:any) => item.custPlanMapppingId == custPlanMapppingId)
        .length == 0
    );
    return false;
  }

  chekcPlanGroup(plan:any, planList:any) {
    if (plan.plangroupid !== null) {
      let groupPlanList = planList.filter(
        (item:any) => item.plangroupid == plan.plangroupid && item.renewalId == plan.renewalId
      );
      return groupPlanList[0] === plan;
    }
    return true;
  }

  checkIfChildCustomer(plan:any) {
    return this.customerLedgerDetailData.parentCustomerId !== null && plan.invoiceType == "Group";
  }

  extendValidityForPlanBundle(plan:any) {
    this.custPlanMappingForValidity = plan;
    this.totalDays = 0;
    // this.custPlanMappingEndDate = moment(plan.endDate, "DD/MM/YYYY").toDate();
    // this.custPlanMappingStartDate = moment(plan.startDate, "DD/MM/YYYY").toDate();
    if (plan.plangroupid === null) {
      this.displayExtendValidity = true;
    } else {
      this.confirmationService.confirm({
        message: "Do you want to Extend all services ?",
        header: "Extend Service Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.planGroupFlag = true;
          this.extendPlangroupId = plan.plangroupid ? plan.plangroupid : 0;
          this.displayExtendValidity = true;
        },
        reject: () => {
          this.planGroupFlag = false;
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected",
          });
        },
      });
    }
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

  isExtendInCurrentPlan(custPlanMapppingId:any, planExpiryDate:any):any {
    if (this.custFuturePlanList != null && this.custFuturePlanList.length > 0) {
      if (this.custCurrentPlanList.length == 1) {
        return (
          this.custFuturePlanList.filter((item:any) => item.custPlanMapppingId == custPlanMapppingId)
            .length == 0
        );
      }
      // return (
      //   this.custFuturePlanList.filter((item:any) => item.custPlanMapppingId == custPlanMapppingId)
      //     .length == 0 &&
      //   this.custCurrentPlanList.filter(
      //     (item:any) =>
      //       item.custPlanMapppingId == custPlanMapppingId &&
      //       moment(item.expiryDate, "DD/MM/YYYY").toDate() >
      //         moment(planExpiryDate, "DD/MM/YYYY").toDate()
      //   ).length == 0
      // );
    }
    // return (
    //   this.custCurrentPlanList.filter((item:any) => {
    //     item.custPlanMapppingId == custPlanMapppingId &&
    //       moment(item.expiryDate, "DD/MM/YYYY").toDate() >
    //         moment(planExpiryDate, "DD/MM/YYYY").toDate();
    //   }).length == 0
    // );
  }

  findDuration(expiryDate: Date) {
    // var datePipe = new DatePipe();
    var start = (new Date(new Date().setHours(0, 0, 0, 0)), "DD/MM/YYYY"); //todays date
    var end = (new Date(expiryDate), "DD/MM/YYYY"); // another date
    // var duration = moment.duration(end.diff(start));

    // var days = duration.asDays();
    // return Math.trunc(days);
  }

  promiseToPayDetailsClick(id:any, startDate:any, endDate:any, days:any) {
    this.promiseToPayData = [{ startDate: startDate, endDate: endDate, days: days }];
    this.isPromiseToPayModelOpen = true;
    this.PaymentamountService.show(id);
  }

  displayNote(type:any) {
    if (type === "plan") {
      this.planNotes = true;
      this.showdata = this.custCurrentPlanList;
    }
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

  isLatestFuturePlan(custPlanMapppingId:any, planExpiryDate:any) {
    // if (this.custFuturePlanList != null && this.custFuturePlanList.length > 0) {
    //   return (
    //     this.custFuturePlanList.filter(
    //       (item:any) =>
    //         item.custPlanMapppingId == custPlanMapppingId &&
    //         moment(item.expiryDate, "DD/MM/YYYY").toDate() >
    //           moment(planExpiryDate, "DD/MM/YYYY").toDate()
    //     ).length == 0
    //   );
    // }
    return false;
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

        if (this.TrailPlanList.length > 0) {
          this.istrialplan = true;
        }
        this.custTrailPlanItemPerPage = this.TrailPlanList.length;
        if (this.TrailPlanList.length > 0) {
          this.istrialplan = true;
        }
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  subscribeTrailPlanModel(plan:any) {
    this.plane = false;
    let data1: { date: string; label: string; show: boolean; }[] = [];
    let data2 = [];
    this.trialDateData = [];
    this.selectScbscribeDate = "";
    this.showTrialPlan = data1;
    this.tarialPlanData = plan;
    let currentDate = new Date();
    const format = "dd-MM-yyyy hh:mm a";
    const locale = "en-US";
    const myDate = currentDate;
    const formattedDate = formatDate(myDate, format, locale);

    data1.push({
      date: "CURRENTDATE",
      label: "From Today",
      show: true,
    });
    this.trialDateData.push(...data1);
    data2 = [
      {
        date: "INCLUDINGTRIALPERIOD",
        label: "Including Trial period",
        show: false,
      },
    ];
    this.trialDateData.push(...data2);
    $("#subscribetrailPlanModel").modal("show");
  }

  showRemark(data: any, data1:any) {
    const findResult = data1.find((element:any) => element.date == data.value);
    if (findResult.label == "From Today") {
      this.plane = true;
    } else {
      if (findResult.label == "Including Trial period") {
        this.plane = false;
        this.Subscriberform.controls["remarks"].reset();
      } else {
        this.plane = false;
        this.Subscriberform.controls["remarks"].reset();
      }
    }
  }

  subscribeTrailPlan() {
    let remark = this.Subscriberform.get("remarks").value;
    // console.log("remark", remark);
    let data = {
      billingStartFrom: this.selectScbscribeDate,
      cprId: this.tarialPlanData.planmapid,
      custId: this.tarialPlanData.custId,
      extendDays: "",
      planGroupId: this.tarialPlanData.plangroupid,
      planId: this.tarialPlanData.planId,
      remarks: remark,
    };
    const url = "/subscriber/trailToNormalPlan";
    this.customerManagementService.postMethodPasssHeader(url, data).subscribe(
      (response: any) => {
        $("#subscribetrailPlanModel").modal("hide");
        this.getTrailPlanList(this.customerLedgerDetailData.id, "");
        // this.getcustomerList("");
        if (this.TrailPlanList.length > 0) this.istrialplan = true;
        else this.istrialplan = false;
        this.getcustCurrentPlan(this.customerLedgerDetailData.id, "");
        this.trialDateData = [];
        this.selectScbscribeDate = "";
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: response.responseMessage,
          icon: "far fa-times-circle",
        });
      },
      (error: any) => {
        console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  closesubscribeTrailPlan() {
    this.Subscriberform.reset();
  }

  extanTrailPlanModel(plan:any, trailTyep:any) {
    this.ExtendDays = "";
    this.tarialPlanData = plan;
    $("#trailPlanModel").modal("show");
    this.trailbtnTypeSelect = trailTyep;
  }

  keypressId(event: any) {
    const pattern = /[0-9\.]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && event.keyCode != 9 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
    if (this.trailbtnTypeSelect == "extend") {
      if (Number(this.ExtendDays) > Number(this.commondropdownService.trialPLanMaxLength)) {
        this.ExtendDays = 0;
        this.messageService.add({
          severity: "info",
          summary: "Info",
          detail: "Maximmum value is " + this.commondropdownService.trialPLanMaxLength,
          icon: "far fa-times-circle",
        });
      }
    }
  }

  extendTrailPlan() {
    const url = "/subscriber/extendTrailPlan";
    let data = {
      billingStartFrom: this.tarialPlanData.startDate,
      cprId: this.tarialPlanData.planmapid,
      custId: this.tarialPlanData.custId,
      extendDays: this.ExtendDays,
      planGroupId: this.tarialPlanData.plangroupid,
      planId: this.tarialPlanData.planId,
    };
    this.customerManagementService.postMethodPasssHeader(url, data).subscribe(
      (response: any) => {
        this.getTrailPlanList(this.customerLedgerDetailData.id, "");
        this.getcustCurrentPlan(this.customerLedgerDetailData.id, "");
        this.tarialPlanData = [];
        this.trailbtnTypeSelect = "";
        $("#trailPlanModel").modal("hide");
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: response.responseMessage,
          icon: "far fa-times-circle",
        });
      },
      (error: any) => {
        console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  cancelTrailPlan() {
    let data = {
      billingStartFrom: this.tarialPlanData.startDate,
      cprId: this.tarialPlanData.planmapid,
      custId: this.tarialPlanData.custId,
      extendDays: this.ExtendDays,
      planGroupId: this.tarialPlanData.plangroupid,
      planId: this.tarialPlanData.planId,
    };
    const url = "/subscriber/cancel/trailplan";
    this.customerManagementService.postMethodPasssHeader(url, data).subscribe(
      (response: any) => {
        this.getTrailPlanList(this.customerLedgerDetailData.id, "");
        this.getcustCurrentPlan(this.customerLedgerDetailData.id, "");
        this.tarialPlanData = [];
        this.trailbtnTypeSelect = "";
        $("#trailPlanModel").modal("hide");
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: response.responseMessage,
          icon: "far fa-times-circle",
        });
      },
      (error: any) => {
        console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  cancelConfirmonTrialmode(plan:any) {
    this.confirmationService.confirm({
      message: "Do you want to Cancel this Trial Plan?",
      header: "Cancel Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.tarialPlanData = plan;
        this.cancelTrailPlan();
      },
      reject: () => {
        this.messageService.add({
          severity: "info",
          summary: "Rejected",
          detail: "You have rejected",
        });
      },
    });
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

  isPromiseToPayInExpired(custPlanMapppingId:any) {
    if (
      (this.custFuturePlanList != null && this.custFuturePlanList.length > 0) ||
      (this.custCurrentPlanList != null && this.custCurrentPlanList.length > 0)
    ) {
      return (
        this.custFuturePlanList.filter((item:any) => item.custPlanMapppingId == custPlanMapppingId)
          .length == 0 &&
        this.custCurrentPlanList.filter((item:any) => item.custPlanMapppingId == custPlanMapppingId)
          .length == 0
      );
    }
    return false;
  }

  saveRemark() {
    let custPlanMappingIdList: { custPlanMapping: any; }[] = [];
    if (this.promiseToPayBulkFlag) {
      this.promiseToPayBulkId.forEach(element => {
        custPlanMappingIdList.push({ custPlanMapping: element });
      });
    } else {
      this.promiseToPayIds.forEach(element => {
        custPlanMappingIdList.push({ custPlanMapping: element });
      });
    }

    let promiseToPayData: any = {
      custId: this.customerLedgerDetailData.id,
      promiseToPay: custPlanMappingIdList,
      promise_to_pay_remarks: this.remark,
    };
    const url = `/promiseToPayInBulk`;

    this.revenueManagementService.postMethod(url, promiseToPayData).subscribe(
      (res: any) => {
        this.closeRemarkModel();
        if (res.responseCode == 200) {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: res.message,
            icon: "far fa-check-circle",
          });
          // $("#IdRemark").modal("hide");
          this.getcustCurrentPlan(this.customerLedgerDetailData.id, "");
          this.getcustFuturePlan(this.customerLedgerDetailData.id, "");
          this.getcustExpiredPlan(this.customerLedgerDetailData.id, "");
          this.remark = "";
          this.onCloseValidity();
          this.extendValidityBulkFlag = false;
          this.promiseToPayBulkFlag = false;
          this.extendValidityBulkId = [];
          this.promiseToPayBulkId = [];

          this.remark = "";
        } else if (res.responseCode == 226) {
          this.messageService.add({
            severity: "info",
            summary: "info",
            detail: res.responseMessage,
            icon: "far fa-times-circle",
          });
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.msg,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  closeRemarkModel() {
    this.remark = " ";
    this.remarkModel = false;
  }
}
