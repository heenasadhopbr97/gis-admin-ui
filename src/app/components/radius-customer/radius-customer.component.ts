import { Component, OnInit } from "@angular/core";
import { DatePipe, formatDate } from "@angular/common";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { countries } from "src/app/components/model/country";
import { ICustomer } from "src/app/components/model/radius-customer";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { ConcurrentPolicyService } from "src/app/service/concurrent-policy.service";
import { CustomerService } from "src/app/service/customer.service";
import { DictionaryService } from "src/app/service/dictionary.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import * as XLSX from "xlsx";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";
import { PartnerService } from "src/app/service/partner.service";
import { RADIUS_CONSTANTS } from "src/app/constants/aclConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { ActivatedRoute } from "@angular/router";
import { LiveUserService } from "src/app/service/live-user.service";
import { RadiusClientService } from "src/app/service/radius-client.service";
import * as FileSaver from "file-saver";

@Component({
    selector: "app-radius-customer",
    templateUrl: "./radius-customer.component.html",
    styleUrls: ["./radius-customer.component.css"],
    standalone: false
})
export class RadiusCustomerComponent implements OnInit {
  searchCustomerForm: FormGroup;
  searchSubmitted = false;
  customerSearchData: any = [];
  currentPage: number = 1;
  itemsPerPage: number = RadiusConstants.ITEMS_PER_PAGE;
  totalRecords: number;
  searchOptionSelect = this.commondropdownService.radiusSearchOptionBill;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any = 5;
  searchkey: string;
  searchkey2: string;
  currentPagecustomerListdata = 1;
  searchData:any;
  customerListData: any = [];
  customerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custType: any;
  customerListdatatotalRecords: any;
  searchCustomerValue = "";
  searchOption = "";
  searchDeatil = "";
  mvnoData: any;
  loggedInUser: any;
  mvnoId: any;
  accessData: any = JSON.parse(localStorage.getItem("accessData"));
  customerLedgerDetailData: any;
  presentAdressDATA:any[] = [];
  permentAdressDATA:any[] = [];
  paymentAdressDATA:any[] = [];
  partnerDATA:any[] = [];
  chargeDATA:any[] = [];
  dataPlan: any = [];
  planGroupName: any = [];
  serviceAreaDATA: any = [];
  custQuotaList: any[];
  custQuotaListItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custQuotaListtotalRecords: String;
  currentPagecustQuotaList = 1;
  ifIndividualPlan = true;
  ifPlanGroup = false;
  listView = true;
  isCustomerDetailOpen = false;
  isCustomerDetailSubMenu = false;
  customerPlanView = false;
  ifCDR = false;
  totalCDRRecords: number;
  currentPageCDR = 1;
  fileNameCDR = "CDR.xlsx";
  itemsPerPageCDR = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPageCDR = 1;
  searchAcctCdrForm: FormGroup;
  searchCDRSubmitted = false;
  groupDataCDR: any[] = [];
  custMacAddItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custMacAddtotalRecords: String;
  currentPagecustMacAddList = 1;
  custPlanDeatilItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custPlanDeatiltotalRecords: String;
  currentPagecustPlanDeatilList = 1;
  customerFuturePlanListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerFuturePlanListdatatotalRecords: String;
  currentPagecustomerFuturePlanListdata = 1;
  customerExpiryPlanListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerExpiryPlanListdatatotalRecords: String;
  currentPagecustomerExpiryPlanListdata = 1;
  customerCurrentPlanListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerCurrentPlanListdatatotalRecords: String;
  currentPagecustomerCurrentPlanListdata = 1;
  custFuturePlanList: any = [];
  custExpiredPlanList: any = [];
  custCurrentPlanList: any = [];
  CurrentPlanShowItemPerPage = 1;
  futurePlanShowItemPerPage = 1;
  expiredShowItemPerPage = 1;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  public loginService: LoginService;
  viewAccess: any;
  radiusCustPlansAccess: any;
  radiusCDRSessionAccess: any;
  exportExcelAccess: any;
  customer_create: any;
  independentAAA: boolean = RadiusConstants.INDPENDENT_AAA === "false" ? false : true;

  isShowMenu = true;
  isShowCreateView = true;
  isShowListView = true;

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
    this.loginService = loginService;
    this.radiusCustPlansAccess = loginService.hasPermission(
      RADIUS_CONSTANTS.RADIUS_CUST_DETAILS_CUST_PLAN
    );
    this.radiusCDRSessionAccess = loginService.hasPermission(
      RADIUS_CONSTANTS.RADIUS_CUST_DETAILS_CDR_SESSION
    );
    this.exportExcelAccess = loginService.hasPermission(
      RADIUS_CONSTANTS.RADIUS_CUST_DETAILS_EXPORT_EXCEL
    );

    this.customer_create = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_CUST_CREATE);
  }

  ngOnInit(): void {
    this.mvnoData = JSON.parse(localStorage.getItem("mvnoData"));
    this.loggedInUser = localStorage.getItem("loggedInUser");
    this.mvnoId = localStorage.getItem("mvnoId");

    const childUrlSegment = this.route.firstChild.snapshot.url[0].path;
    if (childUrlSegment === "list") {
      this.isShowMenu = true;
      this.isShowListView = true;
      this.isShowCreateView = false;
    } else if (childUrlSegment === "radiuscreatecustomer") {
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
