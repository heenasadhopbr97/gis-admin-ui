// import { url } from "inspector";
import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { ActivatedRoute, Router } from "@angular/router";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";
import { StatusCheckService } from "src/app/service/status-check-service.service";
import { CustomerService } from "src/app/service/customer.service";
import { PartnerService } from "src/app/service/partner.service";
import { FormGroup } from "@angular/forms";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
// import { DatePipe, formatDate } from "@angular/common";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { ConfirmationService, MessageService } from "primeng/api";
// import * as moment from "moment";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
declare var $: any;
@Component({
    selector: "app-radius-customer-details",
    templateUrl: "./radius-customer-details.component.html",
    styleUrls: ["./radius-customer-details.component.scss"],
    standalone: false
})
export class RadiusCustomerDetailsComponent implements OnInit {
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
  planForConnection:any;
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

  constructor(
    private customerService: CustomerService,
    private partnerService: PartnerService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private customerManagementService: CustomermanagementService,
    public KeyannaCommonBaseService: KeyannaCommonBaseService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    public statusCheckService: StatusCheckService,
    public commondropdownService: CommondropdownService,
    public PaymentamountService: PaymentamountService,
    private revenueManagementService: RevenueManagementService,
    private router: Router
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("custId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  async ngOnInit() {
    this.getCustomersDetail(this.customerId);
    this.getCustomerNetworkLocationDetail(this.customerId);
    this.commondropdownService.getsystemconfigList();
  }

  listCustomer() {
    this.router.navigate(["/home/radiuscustomer/list"]);
  }

  getCustomerNetworkLocationDetail(custId:any) {
    if (this.statusCheckService.isActiveInventoryService) {
      const url = `/customer/getCustNetworkDetail?customerId=${custId}`;
      this.customerManagementService.getCustNetworkLocDetail(url).subscribe(
        (response: any) => {
          this.customerNetworkLocationDetailData = response.data;
        },
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle",
          });
        }
      );
    }
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
        console.log("this.customerLedgerDetailData ", this.customerLedgerDetailData);

        //partner Name
        if (this.customerLedgerDetailData.partner) {
          let partnerurl = "/partner/" + Number(this.customerLedgerDetailData.partner);
          this.partnerService.getMethodNew(partnerurl).subscribe((response: any) => {
            this.partnerDATA = response.partnerlist.name;
          });
        }

        //serviceArea Name
        if (this.customerLedgerDetailData.servicearea) {
          let serviceareaurl = "/serviceArea/" + Number(this.customerLedgerDetailData.servicearea);
          this.KeyannaCommonBaseService.get(serviceareaurl).subscribe((response: any) => {
            this.serviceAreaDATA = response.data.name;
            console.log("serviceData", response.data);

            // console.log("partnerDATA", this.serviceAreaDATA);
          });
        }

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
}
