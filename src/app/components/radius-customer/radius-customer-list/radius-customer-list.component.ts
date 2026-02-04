import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { AREA, CITY, COUNTRY, PINCODE, STATE } from "src/app/RadiusUtils/RadiusConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { InvoicePaymentListService } from "src/app/service/invoice-payment-list.service";
import { LiveUserService } from "src/app/service/live-user.service";
import { LoginService } from "src/app/service/login.service";
import { ActivatedRoute, Router } from "@angular/router";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";
import { CustomerService } from "src/app/service/customer.service";
import { RadiusClientService } from "src/app/service/radius-client.service";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { FormBuilder } from "@angular/forms";
import { ConcurrentPolicyService } from "src/app/service/concurrent-policy.service";
import { DictionaryService } from "src/app/service/dictionary.service";
import { PartnerService } from "src/app/service/partner.service";
import { RADIUS_CONSTANTS } from "src/app/constants/aclConstants";

declare var $: any;

@Component({
    selector: "app-radius-customer-list",
    templateUrl: "./radius-customer-list.component.html",
    styleUrls: ["./radius-customer-list.component.scss"],
    standalone: false
})
export class RadiusCustomerListComponent implements OnInit {
  mvnoData: any;
  loggedInUser: any;
  mvnoId: any;
  custType: any;
  loggedInStaffId = localStorage.getItem("userId");
  partnerId = Number(localStorage.getItem("partnerId"));
  customerSearchData: any = [];
  currentPage: number = 1;
  itemsPerPage: number = RadiusConstants.ITEMS_PER_PAGE;
  totalRecords: number;
  showItemPerPage: any = 5;
  countryTitle = COUNTRY;
  cityTitle = CITY;
  stateTitle = STATE;
  pincodeTitle = PINCODE;
  areaTitle = AREA;
  currentPagecustomerListdata = 1;
  customerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  customerListdatatotalRecords: any;
  customerListData: any = [];
  viewcustomerListData: any = [];
  searchOption = "";
  searchDeatil = "";
  searchData:any;
  AclClassConstants:any;
  AclConstants:any;
  searchkey2: string;
  searchkey: string;
  searchOptionSelect = this.commondropdownService.customerSearchOption;
  isPlanOnDemand = false;
  showNearLocationModal = false;
  showChangeStatusModal = false;
  uploadAccess: boolean = false;
  editAccess: boolean = false;
  nearByDeviceAccess: boolean = false;
  sendPaymentLinkAccess: boolean = false;
  changeStatusAccess: boolean = false;
  selectedCustId = 0;
  custStatus = "";
  listView = true;
  isCustomerDetailOpen = false;
  isCustomerDetailSubMenu = false;
  customerPlanView = false;
  ifCDR = false;
  accessData: any = JSON.parse(localStorage.getItem("accessData"));
  customerLedgerDetailData: any = [];
  presentAdressDATA:any[] = [];
  permentAdressDATA:any[] = [];
  paymentAdressDATA:any[] = [];
  partnerDATA:any[] = [];
  chargeDATA:any[] = [];
  serviceAreaDATA: any = [];
  custQuotaList: any[];
  custQuotaListItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custQuotaListtotalRecords: String;
  currentPagecustQuotaList = 1;
  ifIndividualPlan = true;
  ifPlanGroup = false;
  planGroupName: any = [];
  dataPlan: any = [];
  independentAAA: boolean = RadiusConstants.INDPENDENT_AAA === "false" ? false : true;
  customer_update: any;
  customer_change_status: any;

  constructor(
    private customerService: CustomerService,
    private radiusUtility: RadiusUtility,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private concurrentPolicyService: ConcurrentPolicyService,
    private dictionaryService: DictionaryService,
    private customerManagementService: CustomermanagementService,
    public partnerService: PartnerService,
    public KeyannaCommonBaseService: KeyannaCommonBaseService,
    public datepipe: DatePipe,
    public commondropdownService: CommondropdownService,
    loginService: LoginService,
    private liveUserService: LiveUserService,
    private route: ActivatedRoute,
    private radiusService: RadiusClientService
  ) {
    this.custType = this.route.snapshot.paramMap.get("custType")!;
    let staffID = localStorage.getItem("userId");
    let loggedInUser = localStorage.getItem("loggedInUser");
    this.partnerId = Number(localStorage.getItem("partnerId"));
    this.customer_update = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_CUST_EDIT);
    this.customer_change_status = loginService.hasPermission(
      RADIUS_CONSTANTS.RADIUS_CUST_CHANGE_STATUS
    );
  }

  async ngOnInit() {
    this.isCustomerDetailOpen = false;
    this.mvnoData = JSON.parse(localStorage.getItem("mvnoData"));
    this.loggedInUser = localStorage.getItem("loggedInUser");
    this.mvnoId = localStorage.getItem("mvnoId");
    this.getAll("");
    this.searchData = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and",
        },
      ],
      page: "",
      pageSize: "",
    };
    this.commondropdownService.getCustomerStatus();
  }

  async getAll(list:any) {
    let size;
    this.searchkey = "";
    let page = this.currentPage;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      size = this.itemsPerPage;
    }

    this.customerService.getAll(page, size).subscribe(
      (response: any) => {
        this.customerSearchData = response.customerList.content;
        this.totalRecords = response.customerList.totalElements;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  clearSearchcustomer() {
    this.currentPagecustomerListdata = 1;
    this.currentPage = 1;
    this.getAll("");
    this.searchDeatil = "";
    this.searchOption = "";
  }

  customerDetailOpen(custId:any) {
    this.listView = false;
    this.isCustomerDetailOpen = true;
    this.isCustomerDetailSubMenu = true;
    this.customerPlanView = false;
    this.ifCDR = false;
    this.getCustomersDetail(custId);
    this.getCustQuotaList(custId);
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

            // console.log("partnerDATA", this.partnerDATA);
          });
        }

        //serviceArea Name
        if (this.customerLedgerDetailData.servicearea) {
          let serviceareaurl = "/serviceArea/" + Number(this.customerLedgerDetailData.servicearea);
          this.KeyannaCommonBaseService.get(serviceareaurl).subscribe((response: any) => {
            this.serviceAreaDATA = response.data.name;

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

  pageChanged(pageNumber:any) {
    this.currentPage = pageNumber;
    if (!this.searchkey) {
      this.getAll("");
    } else {
      this.searchCustomer();
    }
  }

  getCustQuotaList(custId:any) {
    this.customerManagementService.getCustQuotaList(custId).subscribe(
      (response: any) => {
        this.custQuotaList = response.custQuotaList;
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

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.getAll(this.showItemPerPage);
    } else {
      this.searchCustomer();
    }
  }

  listCustomer() {
    this.listView = true;
    this.isCustomerDetailOpen = false;
    this.isCustomerDetailSubMenu = false;
    this.customerPlanView = false;
    this.ifCDR = false;
  }

  searchCustomer() {
    var search : { [key: string]: any } = {};
    if (
      !this.searchkey ||
      this.searchkey !== this.searchDeatil.trim() ||
      !this.searchkey2 ||
      this.searchkey2 !== this.searchOption.trim()
    ) {
      this.currentPage = 1;
    }
    this.searchkey = this.searchDeatil.trim();
    this.searchkey2 = this.searchOption.trim();

    this.searchData.filters[0].filterValue = this.searchDeatil.trim();
    this.searchData.filters[0].filterColumn = this.searchOption.trim();
    search[this.searchOption] = this.searchDeatil;

    this.searchData.page = this.currentPage;
    this.itemsPerPage = this.showItemPerPage;
    this.searchData.pageSize = this.itemsPerPage;

    this.radiusService.getAllCustomerr(this.currentPage, this.itemsPerPage, search).subscribe(
      (response: any) => {
        this.customerSearchData = response.customerList.data;
        const usernameList: string[] = [];
        this.customerListData.forEach((element:any) => {
          usernameList.push(element.username);
        });
        this.totalRecords = response.customerList.totalRecords;
      },
      (error: any) => {
        this.totalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
          this.customerSearchData = [];
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle",
          });
        }
      }
    );
  }

  openChangeStatus(id:any, status:any) {
    this.selectedCustId = id;
    this.custStatus = status;
    this.showChangeStatusModal = true;
  }

  closeChangeStatusEvent(isStatusChanged:any) {
    this.selectedCustId = 0;
    this.custStatus = "";
    this.showChangeStatusModal = false;
  }
}
