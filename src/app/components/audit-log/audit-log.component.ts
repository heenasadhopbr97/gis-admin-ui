import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { AuditlogService } from "src/app/service/auditlog.service";
import { Regex } from "src/app/constants/regex";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import * as _ from "lodash";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { TicketManagementService } from "src/app/service/ticket-management.service";
import { CountryManagementService } from "src/app/service/country-management.service";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import { NotificationBaseService } from "src/app/service/notification-base.service";

@Component({
    selector: "app-audit-log",
    templateUrl: "./audit-log.component.html",
    styleUrls: ["./audit-log.component.css"],
    standalone: false
})
export class AuditLogComponent implements OnInit {
  AuditlogCategoryList: any;
  showDialogue: boolean = false;
  jsondata: any;
  snapshotdata: any;
  currentPageAuditlogListdata = 1;
  AuditlogListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  AuditlogListdatatotalRecords: any;
  AuditlogListData: any = [];
  viewAuditlogListData: any = [];
  searchAuditlogUrl: any;

  searchModuleName = "";
  searchUserName = "";
  searchDate = "";
  toDate = "";
  searchData: any;
  searchKey: string = "";
  AclClassConstants;
  AclConstants;

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey!: string;
  activeIndex: number = 0;
  searchOption: any;
  searchOptions = [{ label: "Profile Name", value: "profile" }];
  moduleList = [
    { label: "Common", value: "COMMON" },
    { label: "CMS", value: "CMS" },
    { label: "Ticket", value: "TICKET" },
    { label: "Inventory", value: "INVENTORY" },
    { label: "Revenue", value: "REVENUE" },
    { label: "Notification", value: "NOTIFICATION" },
  ];
  selectedModule: any = "COMMON";
  selectedModuleName: any = "Common";
  startDate!: string;
  endDate!: string;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    private messageService: MessageService,
    private AuditlogService: AuditlogService,
    private TicketManagementService: TicketManagementService,
    private CountryManagementService: CountryManagementService,
    public loginService: LoginService,
    public keyannaCommonBaseService: KeyannaCommonBaseService,
    public RevenueManagementService: RevenueManagementService,
    public NotificationBaseService: NotificationBaseService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }

  ngOnInit(): void {
    this.searchData = {
      filters: [
        {
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and",
        },
      ],
      module: "",
      fromDate: "",
      toDate: "",
      page: "",
      pageSize: "",
    };

    this.getAuditlogList("", this.selectedModule);
  }

  TotalItemPerPage(event:any, module:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageAuditlogListdata > 1) {
      this.currentPageAuditlogListdata = 1;
    }
    if (!this.searchKey && (!this.startDate || !this.endDate)) {
      this.getAuditlogList("", this.selectedModule);
    } else {
      this.searchAudit();
    }
  }

  getAuditlogList(list:any, module:any) {
    let size;
    this.searchkey = "";
    let pagelist = this.currentPageAuditlogListdata;
    if (list) {
      size = list;
      this.AuditlogListdataitemsPerPage = list;
    } else {
      size = this.AuditlogListdataitemsPerPage;
    }

    const url = "/auditTrail/all?pageIndex=" + (pagelist - 1) + "&pageSize=" + size;
    let data = {
      page: pagelist,
      pageSize: size,
    };
    if (module == "CMS") {
      this.selectedModuleName = "Customer";
      this.AuditlogService.getMethod(url).subscribe(
        (response: any) => {
          this.AuditlogListData = response.byObject;
          this.AuditlogListdatatotalRecords = response.totalRecords;

          this.searchKey = "";
          // console.log("AuditlogListData", this.AuditlogListData);
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
    } else if (module == "TICKET") {
      this.selectedModuleName = "Ticket";
      this.TicketManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.AuditlogListData = response.byObject;
          this.AuditlogListdatatotalRecords = response.totalRecords;

          this.searchKey = "";
          // console.log("AuditlogListData", this.AuditlogListData);
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
    // ......
    else if (module == "INVENTORY") {
      this.selectedModuleName = "Inventory";
      this.AuditlogService.getInventoryMethod(url).subscribe(
        (response: any) => {
          this.AuditlogListData = response.byObject;
          this.AuditlogListdatatotalRecords = response.totalRecords;

          this.searchKey = "";
          // console.log("AuditlogListData", this.AuditlogListData);
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
    } else if (module == "REVENUE") {
      this.selectedModuleName = "Revenue";
      this.RevenueManagementService.generateMethod(url).subscribe(
        (response: any) => {
          this.AuditlogListData = response.byObject;
          this.AuditlogListdatatotalRecords = response.totalRecords;

          this.searchKey = "";
          // console.log("AuditlogListData", this.AuditlogListData);
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
    } else if (module == "NOTIFICATION") {
      this.selectedModuleName = "Notification";
      this.NotificationBaseService.get(url).subscribe(
        (response: any) => {
          this.AuditlogListData = response.byObject;
          this.AuditlogListdatatotalRecords = response.totalRecords;

          this.searchKey = "";
          // console.log("AuditlogListData", this.AuditlogListData);
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
    } else {
      this.selectedModuleName = "Common";
      this.CountryManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.AuditlogListData = response.byObject;
          this.AuditlogListdatatotalRecords = response.totalRecords;

          this.searchKey = "";
          // console.log("AuditlogListData", this.AuditlogListData);
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
  }

  pageChangedAuditlogList(pageNumber:any) {
    this.currentPageAuditlogListdata = pageNumber;
    if (!this.searchKey && (!this.startDate || !this.endDate)) {
      this.getAuditlogList("", this.selectedModule);
    } else {
      this.searchAudit();
    }
  }

  clearSearchAuditlog() {
    this.getAuditlogList("", "");
    this.searchModuleName = "";
    this.searchUserName = "";
    this.searchDate = "";
    this.toDate = "";
  }

  handleChange(event: any) {
    this.currentPageAuditlogListdata = 1;
    this.AuditlogListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
    if (this.activeIndex == 0) {
      this.getAuditlogList("", "CMS");
    } else if (this.activeIndex == 1) {
      this.getAuditlogList("", "TICKET");
    } else if (this.activeIndex == 2) {
      this.getAuditlogList("", "INVENTORY");
    } else if (this.activeIndex == 3) {
      this.getAuditlogList("", "REVENUE");
    } else if (this.activeIndex == 4) {
      this.getAuditlogList("", "NOTIFICATION");
    } else {
      this.getAuditlogList("", "COMMON");
    }
  }
  snapShotOpen(snapshot:any) {
    this.spinner.show();
    this.showDialogue = true;
    this.snapshotdata = "";
    this.snapshotdata = snapshot;
    this.spinner.hide();
  }
  snapShotClose() {
    this.showDialogue = false;
  }

  moduleChange(event: any) {
    this.searchKey = "";
    this.startDate = "";
    this.endDate = "";
    this.currentPageAuditlogListdata = 1;
    this.AuditlogListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
    this.getAuditlogList("", this.selectedModule);
  }

  search() {
    this.currentPageAuditlogListdata = 1;
    this.AuditlogListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
    this.searchAudit();
  }

  clearSearch() {
    this.searchKey = "";
    this.startDate = "";
    this.endDate = "";
    this.currentPageAuditlogListdata = 1;
    this.AuditlogListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
    this.getAuditlogList("", this.selectedModule);
  }

  searchAudit() {
    let url = "/auditTrail/byModule";
    let request = {
      moduleName: "",
      entityName: this.searchKey,
      pageIndex: this.currentPageAuditlogListdata,
      pageSize: this.AuditlogListdataitemsPerPage,
      startDate: this.startDate ? this.startDate : null,
      endDate: this.endDate ? this.endDate : null,
    };
    if (this.selectedModule == "CMS") {
      request.moduleName = "CMS";
      this.AuditlogService.postMethod(url, request).subscribe(
        (response: any) => {
          if (response.responseCode == 404) {
            this.AuditlogListData = [];
            this.AuditlogListdatatotalRecords = response.totalRecords;
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.responseMessage,
              icon: "far fa-times-circle",
            });
          } else {
            this.AuditlogListData = response.data;
            this.AuditlogListdatatotalRecords = response.totalRecords;
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: response.responseMessage,
              icon: "far fa-times-circle",
            });
          }
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
    } else if (this.selectedModule == "TICKET") {
      request.moduleName = "Ticket Management";
      this.TicketManagementService.postMethod(url, request).subscribe(
        (response: any) => {
          if (response.responseCode == 404) {
            this.AuditlogListData = [];
            this.AuditlogListdatatotalRecords = response.totalRecords;
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.responseMessage,
              icon: "far fa-times-circle",
            });
          } else {
            this.AuditlogListData = response.data;
            this.AuditlogListdatatotalRecords = response.totalRecords;
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: response.responseMessage,
              icon: "far fa-times-circle",
            });
          }
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
    } else if (this.selectedModule == "INVENTORY") {
      request.moduleName = "Inventory Management";
      this.AuditlogService.postInventoryMethod(url, request).subscribe(
        (response: any) => {
          if (response.responseCode == 404) {
            this.AuditlogListData = [];
            this.AuditlogListdatatotalRecords = response.totalRecords;
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.responseMessage,
              icon: "far fa-times-circle",
            });
          } else {
            this.AuditlogListData = response.data;
            this.AuditlogListdatatotalRecords = response.totalRecords;
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: response.responseMessage,
              icon: "far fa-times-circle",
            });
          }
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
    } else if (this.selectedModule == "REVENUE") {
      request.moduleName = "Revenue Management";
      this.RevenueManagementService.postMethod(url, request).subscribe(
        (response: any) => {
          if (response.responseCode == 404) {
            this.AuditlogListData = [];
            this.AuditlogListdatatotalRecords = response.totalRecords;
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.responseMessage,
              icon: "far fa-times-circle",
            });
          } else {
            this.AuditlogListData = response.data;
            this.AuditlogListdatatotalRecords = response.totalRecords;
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: response.responseMessage,
              icon: "far fa-times-circle",
            });
          }
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
    } else if (this.selectedModule == "NOTIFICATION") {
      request.moduleName = "Notification Management";
      this.NotificationBaseService.post(url, request).subscribe(
        (response: any) => {
          if (response.responseCode == 404) {
            this.AuditlogListData = [];
            this.AuditlogListdatatotalRecords = response.totalRecords;
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.responseMessage,
              icon: "far fa-times-circle",
            });
          } else {
            this.AuditlogListData = response.data;
            this.AuditlogListdatatotalRecords = response.totalRecords;
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: response.responseMessage,
              icon: "far fa-times-circle",
            });
          }
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
    } else {
      request.moduleName = "Common GateWay";
      this.keyannaCommonBaseService.post(url, request).subscribe(
        (response: any) => {
          if (response.responseCode == 404) {
            this.AuditlogListData = [];
            this.AuditlogListdatatotalRecords = response.totalRecords;
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.responseMessage,
              icon: "far fa-times-circle",
            });
          } else {
            this.AuditlogListData = response.data;
            this.AuditlogListdatatotalRecords = response.totalRecords;
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: response.responseMessage,
              icon: "far fa-times-circle",
            });
          }
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

  preventManualInput(event: KeyboardEvent) {
    event.preventDefault();
  }
}
