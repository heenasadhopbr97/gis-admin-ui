// import { url } from "inspector";
import { Component, OnInit } from "@angular/core";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { ActivatedRoute, Router } from "@angular/router";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";
import { StatusCheckService } from "src/app/service/status-check-service.service";
import { CustomerService } from "src/app/service/customer.service";
// import { PartnerService } from "src/app/service/partner.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { DatePipe, formatDate } from "@angular/common";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { ConfirmationService, MessageService } from "primeng/api";
// import * as moment from "moment";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
// import * as FileSaver from "file-saver";

declare var $: any;
@Component({
    selector: "app-radius-customer-cdr-sessions",
    templateUrl: "./radius-customer-cdr-sessions.component.html",
    styleUrls: ["./radius-customer-cdr-sessions.component.scss"],
    standalone: false
})
export class RadiusCustomerCDRSessionsComponent implements OnInit {
  custType: any;
  loggedInStaffId = localStorage.getItem("userId");
  partnerId = Number(localStorage.getItem("partnerId"));
  showFieldset: boolean = true;
  customerLedgerDetailData: any = [];
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
    PlanData: "",
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
  planForConnection : any;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  planNameOpen = false;
  promiseToPayIds:any[] = [];
  custQuotaListtotalRecords: String;
  currentPagecustQuotaList = 1;
  custQuotaListItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custQuotaList: any = [];
  planMappingId: any;
  planData: any;
  custid: any;

  searchAcctCdrForm: FormGroup;
  currentPageCDR = 1;
  itemsPerPageCDR = RadiusConstants.ITEMS_PER_PAGE;
  searchCDRSubmitted = false;
  groupDataCDR: any[] = [];
  totalCDRRecords: number;
  showItemPerPageCDR = 1;
exportExcelAccess: any;

  constructor(
    private customerService: CustomerService,
    private messageService: MessageService,
    private customerManagementService: CustomermanagementService,
    public keyannaCommonBaseService: KeyannaCommonBaseService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    public statusCheckService: StatusCheckService,
    public commondropdownService: CommondropdownService,
    public PaymentamountService: PaymentamountService,
    private revenueManagementService: RevenueManagementService,
    private router: Router,
    private fb: FormBuilder,
    public datepipe: DatePipe
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("custId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  async ngOnInit() {
    this.searchAcctCdrForm = this.fb.group({
      userName: [this.customerLedgerDetailData.custname],
      framedIpAddress: [""],
      fromDate: [""],
      toDate: [""],
    });

    this.getCustomersDetail(this.customerId);
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
            this.customerManagementService.getMethod(planurl).subscribe((response: any) => {
              this.dataPlan.push(response.postPaidPlan.name);
            });
            plandatalength++;
          }
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

  async searchGroupByNameCDR(list:any) {
    let size;
    let page = this.currentPageCDR;
    if (list) {
      size = list;
      this.itemsPerPageCDR = list;
    } else {
      size = this.itemsPerPageCDR;
    }
    var f = "";
    var t = "";

    if (this.searchAcctCdrForm.value.fromDate) {
      f = this.datepipe.transform(this.searchAcctCdrForm.controls['fromDate'].value, "yyyy-MM-dd");
    }
    if (this.searchAcctCdrForm.value.toDate) {
      t = this.datepipe.transform(this.searchAcctCdrForm.controls['toDate'].value, "yyyy-MM-dd");
    }

    // this.currentPage = 1;
    this.searchCDRSubmitted = true;
    if (this.searchAcctCdrForm.valid) {
      let userNameForSearch = this.customerLedgerDetailData.custname;
      let framedIpAddress = this.searchAcctCdrForm.value.framedIpAddress
        ? this.searchAcctCdrForm.value.framedIpAddress.trim()
        : "";
      this.groupDataCDR = [];

      this.customerManagementService
        .getAcctCdrDataByUsername(
          userNameForSearch,
          framedIpAddress,
          f,
          t,
          this.currentPageCDR,
          this.itemsPerPageCDR
        )
        .subscribe(
          (response: any) => {
            // this.groupDataCDR = response.acctCdr.content;
            if (!response.infomsg) {
              let groupDataCDR = response.acctCdr.content.filter(
                (name:any) => name.userName == this.customerLedgerDetailData.custname
              );
              this.groupDataCDR = groupDataCDR;
              this.totalCDRRecords = response.acctCdr.totalElements;
            } else {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.infomsg,
                icon: "far fa-times-circle",
              });
            }
          },
          (error: any) => {
            this.totalCDRRecords = 0;
            if (error.error.status == 404) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: error.error.errorMessage,
                icon: "far fa-times-circle",
              });
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.ERROR,
                icon: "far fa-times-circle",
              });
            }
          }
        );
    }
  }

  clearSearchCDRForm() {
    this.searchCDRSubmitted = false;
    this.currentPageCDR = 1;
    this.searchAcctCdrForm.reset();
    this.searchGroupByNameCDR("");
  }

  async exportExcel(username:any) {
    this.groupDataCDR = [];
    let data = {
      userName: username,
      fromDate: this.searchAcctCdrForm.value.fromDate,
      toDate: this.searchAcctCdrForm.value.toDate,
    };
    this.customerManagementService.getAllCDRExport(data).subscribe((response: any) => {
      const file = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const fileURL = URL.createObjectURL(file);
      // FileSaver.saveAs(file, "Sheet");
    });
  }

  pageCDRChanged(pageNumber:any) {
    this.currentPageCDR = pageNumber;
    this.searchGroupByNameCDR("");
  }

  TotalItemPerCDRPage(event:any) {
    this.showItemPerPageCDR = Number(event.value);
    if (this.currentPageCDR > 1) {
      this.currentPageCDR = 1;
    }
    this.searchGroupByNameCDR(this.showItemPerPageCDR);
  }

  listCustomer() {
    this.router.navigate(["/home/radiuscustomer/list"]);
  }
}
