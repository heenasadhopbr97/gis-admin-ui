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
// import * as FileSaver from "file-saver";

@Component({
    selector: "app-net-conf",
    templateUrl: "./net-conf.component.html",
    styleUrls: ["./net-conf.component.css"],
    standalone: false
})
export class NetConfComponent implements OnInit {
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
  customerLedgerDetailData: any = [];
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
  independentAAA: boolean = RadiusConstants.INDPENDENT_AAA === "false" ? false : true;
isShowCreateView: any;
isShowListView: any;
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
  }

  ngOnInit(): void {
    console.log("oninit called :::::");
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
    this.searchCustomerForm = this.fb.group({
      userName: ["", Validators.required],
    });

    this.searchAcctCdrForm = this.fb.group({
      userName: [this.customerLedgerDetailData.custname],
      framedIpAddress: [""],
      fromDate: [""],
      toDate: [""],
    });
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

    this.customerService.getNetConfCustomer(page, size).subscribe(
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

  searchCustomer() {
    let search: { [key: string]: any } = {};
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
 // Allow dynamic string keys
    search[this.searchOption] = this.searchDeatil;

    this.searchData.page = this.currentPage;
    this.itemsPerPage = this.showItemPerPage;
    this.searchData.pageSize = this.itemsPerPage;
    console.log("search :::::::::: ", search);

    // console.log("this.searchData", this.searchData)
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

  clearSearchcustomer() {
    this.currentPagecustomerListdata = 1;
    this.currentPage = 1;
    this.getAll("");
    this.searchDeatil = "";
    this.searchOption = "";
  }

  async searchCustomerByName() {
    // this.currentPage = 1;
    if (this.showItemPerPage) {
      this.itemsPerPage = this.showItemPerPage;
    }
    if (!this.searchkey || this.searchkey !== this.searchCustomerValue.trim()) {
      this.currentPage = 1;
    }

    this.searchkey = this.searchCustomerValue.trim();
    let name = this.searchCustomerValue.trim() ? this.searchCustomerValue.trim() : "";
    this.searchSubmitted = true;
    // this.currentPage = 1;

    this.customerService.getCustomerByName(this.currentPage, this.itemsPerPage, name).subscribe(
      (response: any) => {
        this.customerSearchData = response.customerList.content;
        this.totalRecords = response.customerList.totalElements;
      },
      (error: any) => {
        if (error.error.status == 404) {
          this.customerSearchData = [];
          this.totalRecords = 0;
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
            detail: error.error.errorMessage,
            icon: "far fa-times-circle",
          });
        }
      }
    );
  }

  clearSearchForm() {
    this.searchSubmitted = false;
    this.currentPage = 1;
    this.searchCustomerForm.reset();
    this.searchCustomerValue = "";
    this.getAll("");
  }

  pageChanged(pageNumber:any) {
    this.currentPage = pageNumber;
    if (!this.searchkey) {
      this.getAll("");
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

  customerDetailOpen(custId:any) {
    this.listView = false;
    this.isCustomerDetailOpen = true;
    this.isCustomerDetailSubMenu = true;
    this.customerPlanView = false;
    this.ifCDR = false;
    this.getCustomersDetail(custId);
    this.getCustQuotaList(custId);
  }
  openCustomersPlan(id:any) {
    this.listView = false;
    this.isCustomerDetailOpen = false;
    this.customerPlanView = true;
    this.isCustomerDetailSubMenu = true;
    this.ifCDR = false;
    this.getcustFuturePlan(id, "");
    this.getcustExpiredPlan(id, "");
    this.getcustCurrentPlan(id, "");
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

  pageChangedCustQuotaList(pageNumber:any) {
    this.currentPagecustQuotaList = pageNumber;
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

  openMyCDR(id:any) {
    this.listView = false;
    this.isCustomerDetailOpen = false;
    this.customerPlanView = false;
    this.isCustomerDetailSubMenu = true;
    this.ifCDR = true;
    this.searchGroupByNameCDR("");
  }

  TotalItemPerCDRPage(event:any) {
    this.showItemPerPageCDR = Number(event.value);
    if (this.currentPageCDR > 1) {
      this.currentPageCDR = 1;
    }
    this.searchGroupByNameCDR(this.showItemPerPageCDR);
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
  pageCDRChanged(pageNumber:any) {
    this.currentPageCDR = pageNumber;
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
      // if (response.acctCdrList.length > 0) {
      //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.groupDataCDR);
      //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
      //   XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      //   XLSX.writeFile(wb, this.fileNameCDR);

      // } else {
      //
      //   this.messageService.add({
      //     severity: "info",
      //     summary: "Info",
      //     detail: "No record found for export.",
      //     icon: "far fa-times-circle",
      //   });
      // }
    });
  }

  TotalCurrentPlanItemPerPage(event:any) {
    this.CurrentPlanShowItemPerPage = Number(event.value);
    if (this.currentPagecustomerCurrentPlanListdata > 1) {
      this.currentPagecustomerCurrentPlanListdata = 1;
    }
    this.getcustCurrentPlan(this.customerLedgerDetailData.id, this.CurrentPlanShowItemPerPage);
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

    const url = "/getActivePlanList/" + custId;
    this.customerManagementService.KeyannaRadius(url).subscribe(
      (response: any) => {
        this.custCurrentPlanList = response.customer;
        console.log(" this.custCurrentPlanList", this.custCurrentPlanList);
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
  TotalFuturePlanItemPerPage(event:any) {
    this.futurePlanShowItemPerPage = Number(event.value);
    if (this.currentPagecustomerFuturePlanListdata > 1) {
      this.currentPagecustomerFuturePlanListdata = 1;
    }
    this.getcustFuturePlan(this.customerLedgerDetailData.id, this.futurePlanShowItemPerPage);
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

    const url = "/getFuturePlanList/" + custId;
    this.customerManagementService.KeyannaRadius(url).subscribe(
      (response: any) => {
        this.custFuturePlanList = response.customer;
        console.log(" this.custFuturePlanList", this.custFuturePlanList);
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
  TotalExpiredPlanItemPerPage(event:any) {
    this.expiredShowItemPerPage = Number(event.value);
    if (this.currentPagecustomerExpiryPlanListdata > 1) {
      this.currentPagecustomerExpiryPlanListdata = 1;
    }
    this.getcustExpiredPlan(this.customerLedgerDetailData.id, this.expiredShowItemPerPage);
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

    const url = "/getExpiredPlanList/" + custId;
    this.customerManagementService.KeyannaRadius(url).subscribe(
      (response: any) => {
        this.custExpiredPlanList = response.customer;
        console.log(" this.custExpiredPlanList", this.custExpiredPlanList);
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
