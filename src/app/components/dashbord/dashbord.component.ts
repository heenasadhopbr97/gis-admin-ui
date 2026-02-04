import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { DashboardService } from "src/app/service/dashboard.service";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import * as RadiusConstants from "../../RadiusUtils/RadiusConstants";
import { LoginService } from "../../service/login.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomerDocumentService } from "../customer-documents/customer-document.service";
import { DatePipe, formatDate } from "@angular/common";
import { LeadManagementService } from "src/app/service/lead-management-service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
// import * as moment from "moment";
import { DASHBOARDS } from "src/app/constants/aclConstants";
import { StatusCheckService } from "src/app/service/status-check-service.service";
import { TicketManagementService } from "src/app/service/ticket-management.service";
import { Router } from "@angular/router";

declare var $: any;

@Component({
    selector: "app-dashbord",
    templateUrl: "./dashbord.component.html",
    styleUrls: ["./dashbord.component.css"],
    standalone: false
})
export class DashbordComponent implements OnInit {
  //   public loginService: LoginService;
  dateTime = new Date();
  AclClassConstants;
  AclConstants;
  showCustomerGraphs: boolean;
  showPaymentGraphs: boolean;
  showTicketGraphs: boolean;
  radiusGraph: boolean;
  customerTypeWiseData: any;
  customerTypeWiseDataOptions: any;
  customerStatusWiseData: any;
  newCustomerTypeWiseData: any;
  newCustomerPlanWiseData: any;
  partnerwisePayment: any;
  paymentMonthWiseData: any;
  pendingData: any = {};
  nextReceiveable: any;
  monthwiseTicketCount: any;
  monthwiseTicketCountOptions: any;
  staffwiseTicketCount: any;
  teamwiseTicketCount: any;
  nextTenDaysRenewableCustomerArray:any[] = [];
  date10 = new Date().getFullYear();
  totalOpenTicket: string;
  connecteduser: string;
  monthWisevolumeUsages: any;
  monthWisetimeUsages: any;
  date101 = new Date().getFullYear();
  currency: string;
  showLoader: boolean = true;
  showTicketLoader: boolean = true;
  overDueticketList:any[] = [];
  commissionGraph: boolean;
  monthWiseAGRDetails: {
    labels: string[];
    datasets: {
      label: string;
      data: unknown[];
      backgroundColor: string;
      hoverBackgroundColor: string;
    }[];
  };
  monthWiseTDSDetails: any;
  partnerWiseTDS: any;
  stackedData: {
    labels: string[];
    datasets: { type: string; label: string; backgroundColor: string; data: number[] }[];
  };
  stackedOptions: {
    tooltips: { mode: string; intersect: boolean };
    responsive: boolean;
    scales: { xAxes: { stacked: boolean }[]; yAxes: { stacked: boolean }[] };
  };
  topFivePartnerCommissionWiseData: any;
  inventoryGraph: boolean;
  staffAndProductWiseInventoryList: any[];
  wareHouseAndProductWiseInventory: any[];
  inventoryAlertList: any[];
  availableInventoryProductWise: any[];
  showInventoryLoader: boolean;
  showApprovalData: boolean;
  showProductQtyData: boolean;
  currentPagecustomerListdata = 1;
  customerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerListdatatotalRecords: any;
  customerListData: any = [];
  customerListDataselector: any;
  currentPagespecialPlanMappingdata = 1;
  specialPlanMappingdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  specialPlanMappingdatatotalRecords: any;
  specialPlanMappingData: any = [];
  specialPlanMappingDataselector: any;
  specialPlanMappingListDatalength = 0;
  pageLimitOptionsForMapping = RadiusConstants.pageLimitOptions;

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPage = 1;
  customerListDatalength = 0;
  currentPagePlanListdata = 1;
  planListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  planListdatatotalRecords: any;
  planListData: any = [];
  planListDataselector: any;
  pageLimitOptionsForPlan = RadiusConstants.pageLimitOptions;
  pageITEMForPlan = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPageForPlan = 1;
  planDatalength = 0;
  currentPagePlanGroupListdata = 1;
  planGroupListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  planGroupListdatatotalRecords: any;
  planGroupListData: any = [];
  planGroupListDataselector: any;
  pageLimitOptionsForPlanGroup = RadiusConstants.pageLimitOptions;
  pageITEMForPlanGroup = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPageForPlanGroup = 1;
  planGroupDatalength = 0;
  currentPagePaymentListdata = 1;
  paymentListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  paymentListdatatotalRecords: any;
  paymentListData: any = [];
  paymentListDataselector: any;
  pageLimitOptionsForPayment = RadiusConstants.pageLimitOptions;
  pageITEMForPayment = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPageForPayment = 1;
  paymentDatalength = 0;
  currentPagecustomerTerminationListdata = 1;
  customerTerminationListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerTerminationListdatatotalRecords: any;
  customerTerminationListData: any = [];
  customerTerminationListDataselector: any;
  pageLimitOptionsTermination = RadiusConstants.pageLimitOptions;
  pageITEMTermination = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPageTermination = 1;
  customerTerminationListDatalength = 0;
  currentPageCaseListdata = 1;
  caseListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  caseListdatatotalRecords: any;
  caseListData: any = [];
  caseListDataselector: any;
  pageLimitOptionsCase = RadiusConstants.pageLimitOptions;
  pageITEMCase = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPageCase = 1;
  caseListDatalength = 0;
  currentPageChangeDiscountListdata = 1;
  changeDiscountListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  changeDiscountListdatatotalRecords: any;
  changeDiscountListData: any = [];
  changeDiscountListDataselector: any;
  pageLimitOptionsChangeDiscount = RadiusConstants.pageLimitOptions;
  pageITEMChangeDiscount = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPageChangeDiscount = 1;
  changeDiscountListDatalength = 0;
  currentPageInvoiceListdata = 1;
  currentPageProductQtyByStaffdata = 1;
  currentPageProductQtyByWarehousedata = 1;
  invoiceListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  productQtyListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  productQtyListdataitemsbywarehousePerPage = RadiusConstants.ITEMS_PER_PAGE;
  invoiceListdatatotalRecords: any;
  productQtytotalRecords: any;
  productQtyByWarehousetotalRecords: any;
  invoiceListData: any = [];
  productQTy: any = [];
  productQtyByWarehouse: any = [];
  invoiceListDataselector: any;
  pageLimitOptionsInvoice = RadiusConstants.pageLimitOptions;
  pageITEMInvoice = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPageInvoice = 1;
  showItemPerPageProductQty = 1;
  showItemPerPageProducyQtyByWarehouse = 1;
  invoiceListDatalength = 0;
  productListDatalength = 0;
  currentPagePartnerPaymentListdata = 1;
  partnerPaymentListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  partnerPaymentListdatatotalRecords: any;
  partnerPaymentListData: any = [];
  partnerPaymentListDataselector: any;
  pageLimitOptionsPartnerPayment = RadiusConstants.pageLimitOptions;
  pageITEMPartnerPayment = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPagePartnerPayment = 1;
  partnerPaymentListDatalength = 0;

  searchkey: string;

  assignCustomerCAFForm: FormGroup;
  rejectCustomerCAFForm: FormGroup;
  assignAppRejectDiscountForm: FormGroup;

  approveId: any;
  workflowID: number;
  reject = false;
  rejectCAF:any[] = [];
  selectStaffReject: any;
  approved = false;
  approveCAF:any[] = [];
  selectStaff: any;
  assignCustomerCAFsubmitted = false;
  rejectCustomerCAFsubmitted = false;
  assignCustomerCAFId: any;
  nextApproverId: any;

  approve = false;
  staffList: any = [];
  assignStaffForm: FormGroup;
  allIsChecked = false;

  currentPageCustomerDocListdata = 1;
  customerDocListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerDocListdatatotalRecords: any;
  customerDocListData: any = [];
  customerDocListDataselector: any;
  pageLimitOptionsCustomerDoc = RadiusConstants.pageLimitOptions;
  pageITEMCustomerDoc = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPageCustomerDoc = 1;
  customerDocListDatalength = 0;

  currentPageLeadListdata = 1;
  leadListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  leadListdatatotalRecords: any;
  leadListData: any = [];
  leadListDataselector: any;
  pageLimitOptionsLead = RadiusConstants.pageLimitOptions;
  pageITEMLead = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPageLead = 1;
  leadListDatalength = 0;
  viewAccess: any;
  staffid: any;
  loggedInUser: any;
  mvnoid: any;
  leadDashboardView: boolean = true;
  leadListFlag: boolean = true;
  leadFollowupFlag: boolean = false;
  leadListForUserAndTeamFlag: boolean = false;

  assignedLeadListPageData = RadiusConstants.ITEMS_PER_PAGE;
  currentPageAssignedLeadList = 1;
  assignedLeadListdatatotalRecords: any;
  leadApproveRejectDto: any = {
    approveRequest: true,
    buId: null,
    currentLoggedInStaffId: 0,
    firstname: "",
    id: 0,
    mvnoId: 0,
    remark: "",
    serviceareaid: null,
    flag: "",
    nextTeamMappingId: null,
    status: "",
    teamName: "",
    username: ""
  };

  leadApproveRejectForm: FormGroup;
  leadApproveRejectFormsubmitted: boolean = false;

  closeFollowupForm: FormGroup;
  closeFollowupFormsubmitted: boolean = false;

  remarkFollowupForm: FormGroup;
  remarkFollowupFormsubmitted: boolean = false;

  reFollowupScheduleForm: FormGroup;
  reFollowupFormsubmitted: boolean = false;
  inventoryAccess: boolean = false;
  salseCrmAccess: boolean = false;
showQtyError: any;
  constructor(
    private fb: FormBuilder,
    private dashboardService: DashboardService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private configService: SystemconfigService,
    private customerDocumentService: CustomerDocumentService,
    private leadManagementService: LeadManagementService,
    private customerManagementService: CustomermanagementService,
    private ticketManagementService: TicketManagementService,
    public loginService: LoginService,
    public statusCheckService: StatusCheckService,
    public datePipe: DatePipe,
    private router: Router
  ) {
    this.staffid = Number(localStorage.getItem("userId"));
    this.loggedInUser = localStorage.getItem("loggedInUser");
    this.mvnoid = Number(localStorage.getItem("mvnoId"));
    this.inventoryAccess = loginService.hasPermission(DASHBOARDS.DASHBOARD_INVENTORY);
    this.salseCrmAccess = loginService.hasPermission(DASHBOARDS.DASHBOARD_SALES_CRM);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    // console.log("inventoryAccess ::::::: ", this.inventoryAccess);

    this.configService.getConfigurationByName("CURRENCY_SYMBOL").subscribe((res: any) => {
      this.currency = res.data?.value;
    });
    this.customerTypeWiseDataOptions = {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    };
  }

  ngOnInit(): void {
    // this.getCustomeGraph();
    this.getApprovalData();
    this.inventoryAccess = this.loginService.hasPermission(DASHBOARDS.DASHBOARD_INVENTORY);
    this.salseCrmAccess = this.loginService.hasPermission(DASHBOARDS.DASHBOARD_SALES_CRM);
    this.assignCustomerCAFForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.rejectCustomerCAFForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.assignAppRejectDiscountForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.leadApproveRejectForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.reFollowupScheduleForm = this.fb.group({
      id: [""],
      followUpName: ["", Validators.required],
      followUpDatetime: ["", Validators.required],
      remarks: [""],
      isMissed: [true],
      leadMasterId: [],
      remarksTemp: ["", Validators.required]
    });
    this.closeFollowupForm = this.fb.group({
      followUpId: [""],
      remarks: ["", Validators.required]
    });
  }

  getCustomeGraph() {
    this.showCustomerGraphs = true;
    this.showPaymentGraphs = false;
    this.showTicketGraphs = false;
    this.radiusGraph = false;
    this.commissionGraph = false;
    this.inventoryGraph = false;
    this.showApprovalData = false;
    this.getTypeWiseUserCountData();
    this.getStatusWiseUserCount();
    this.getNewlyActivatedCustomer();
    this.getPlanWiseCustomer();
  }

  getPaymentGraph() {
    this.showCustomerGraphs = false;
    this.showTicketGraphs = false;
    this.radiusGraph = false;
    this.showPaymentGraphs = true;
    this.commissionGraph = false;
    this.inventoryGraph = false;
    this.showApprovalData = false;
    this.getMonthWiseCollection(new Date().getFullYear());
    this.pendingApprovalPayments();
    this.nextTenDaysReceivablePayment();
    this.partnerWisePayment();
    this.nextTenDaysRenewableCustomer();
  }

  getTicketsGraph() {
    this.showCustomerGraphs = false;
    this.showPaymentGraphs = false;
    this.radiusGraph = false;
    this.showTicketGraphs = true;
    this.commissionGraph = false;
    this.inventoryGraph = false;
    this.showApprovalData = false;
    this.totalOpenTickets();
    this.monthWiseTicketCount(new Date().getFullYear());
    this.staffWiseTicketCount();
    this.teamWiseTicketCount();
    this.overDueTicketList();
  }

  getRadiusGraph() {
    this.showCustomerGraphs = false;
    this.showPaymentGraphs = false;
    this.showTicketGraphs = false;
    this.radiusGraph = true;
    this.commissionGraph = false;
    this.inventoryGraph = false;
    this.showApprovalData = false;
    this.connectedUser();
    this.monthWiseVolumeUsages(new Date().getFullYear());
    this.monthWiseTimeUsages(new Date().getFullYear());
  }

  getTypeWiseUserCountData() {
    this.dashboardService.getTypeWiseCustomerCount().subscribe(
      (res: any) => {
        if (res.data != null) {
          this.customerTypeWiseData = {
            labels: Object.keys(res.data),
            datasets: [
              {
                label: "Number of customers",
                data: Object.values(res.data),
                backgroundColor: "#4ea364",
                hoverBackgroundColor: "#606060"
              }
            ]
          };
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getStatusWiseUserCount() {
    this.dashboardService.getStatusWiseCount().subscribe(
      (res: any) => {
        if (res.data != null) {
          this.customerStatusWiseData = {
            labels: Object.keys(res.data),
            datasets: [
              {
                label: "Number of customers",
                backgroundColor: "#4ea364",
                hoverBackgroundColor: "#606060",
                data: Object.values(res.data)
              }
            ]
          };
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getNewlyActivatedCustomer() {
    this.dashboardService.getNewlyActivatedCustomer().subscribe(
      (res: any) => {
        if (res.data != null) {
          this.newCustomerTypeWiseData = {
            labels: Object.keys(res.data),
            datasets: [
              {
                label: Object.keys(res.data),
                backgroundColor: ["#4ea365", "#b3760c", "#b3360c", "#a50cb3", "#b30c3b"],
                data: Object.values(res.data)
              }
            ]
          };
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getPlanWiseCustomer() {
    this.dashboardService.getPlanWiseCustomer().subscribe(
      (res: any) => {
        if (res.data != null) {
          this.newCustomerPlanWiseData = {
            labels: Object.keys(res.data),
            datasets: [
              {
                label: "Number of customers",
                backgroundColor: "#4ea364",
                hoverBackgroundColor: "#606060",
                data: Object.values(res.data)
              }
            ]
          };
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getMonthWiseCollection(year:any) {
    this.dashboardService.getMonthWiseCollection(year).subscribe(
      (res: any) => {
        this.paymentMonthWiseData = null;
        if (res.data != null) {
          this.paymentMonthWiseData = {
            labels: Object.keys(res.data),
            datasets: [
              {
                label: "Amount in " + this.currency,
                backgroundColor: "#4ea364",
                hoverBackgroundColor: "#606060",
                data: Object.values(res.data)
              }
            ]
          };
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  pendingApprovalPayments() {
    this.dashboardService.pendingApprovalPayments().subscribe(
      (res: any) => {
        if (res.data != null) {
          this.pendingData = res.data;
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  nextTenDaysReceivablePayment() {
    this.dashboardService.nextTenDaysReceivablePayment().subscribe(
      (res: any) => {
        this.nextReceiveable = res.data.data;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  monthWiseTicketCount(year:any) {
    this.dashboardService.monthWiseTicketCount(year).subscribe(
      (res: any) => {
        this.monthwiseTicketCount = null;
        let cerated;
        if (res.data != null) {
          if (res.data["Created"] != null) {
            cerated = res.data["Created"];
            this.monthwiseTicketCount = {
              labels: Object.keys(cerated),
              datasets: [
                {
                  type: "bar",
                  label: "Created",
                  backgroundColor: "#606060",
                  data: Object.values(cerated)
                }
              ]
            };
          }
          if (res.data["Resolved"] != null) {
            let resolved = res.data["Resolved"];
            if (cerated) {
              this.monthwiseTicketCount = {
                labels: Object.keys(cerated),
                datasets: [
                  {
                    type: "bar",
                    label: "Created",
                    backgroundColor: "#606060",
                    data: Object.values(cerated)
                  },
                  {
                    type: "bar",
                    label: "Resolved",
                    backgroundColor: "#4ea364",
                    data: Object.values(resolved)
                  }
                ]
              };
            } else {
              this.monthwiseTicketCount = {
                labels: Object.keys(resolved),
                datasets: [
                  {
                    type: "bar",
                    label: "Resolved",
                    backgroundColor: "#4ea364",
                    data: Object.values(resolved)
                  }
                ]
              };
            }
          }

          this.monthwiseTicketCountOptions = {
            tooltips: {
              mode: "index",
              intersect: false
            },
            responsive: true,
            scales: {
              xAxes: [
                {
                  stacked: true
                }
              ],
              yAxes: [
                {
                  stacked: true
                }
              ]
            }
          };
        }

        // this.nextReceiveable = res.data.data;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  staffWiseTicketCount() {
    this.dashboardService.staffWiseTicketCount().subscribe(
      (res: any) => {
        if (res.responseCode == 200) {
          let resolved = [];
          let assigned = [];
          this.staffwiseTicketCount = null;
          if (res.data["Resolved"] != null) {
            resolved = res.data["Resolved"];
            this.staffwiseTicketCount = {
              labels: Object.keys(resolved),
              datasets: [
                {
                  type: "bar",
                  label: "Resolved",
                  backgroundColor: "#4ea364",
                  data: Object.values(resolved)
                }
              ]
            };
          }
          if (res.data["Assigned"] != null) {
            assigned = res.data["Assigned"];
            if (resolved) {
              this.staffwiseTicketCount = {
                labels:
                  Object.keys(resolved).length > 0 ? Object.keys(resolved) : Object.keys(assigned),
                datasets: [
                  {
                    type: "bar",
                    label: "Assigned",
                    backgroundColor: "#606060",
                    data: Object.values(assigned)
                  },
                  {
                    type: "bar",
                    label: "Resolved",
                    backgroundColor: "#4ea364",
                    data: Object.values(resolved)
                  }
                ]
              };
            } else {
              this.staffwiseTicketCount = {
                labels: Object.keys(assigned),
                datasets: [
                  {
                    type: "bar",
                    label: "Assigned",
                    backgroundColor: "#606060",
                    data: Object.values(assigned)
                  }
                ]
              };
            }
          }
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  teamWiseTicketCount() {
    this.dashboardService.teamWiseTicketCount().subscribe(
      (res: any) => {
        if (res.responseCode == 200) {
          let resolved = [];
          let assigned = [];
          if (res.data["Resolved"] != null) {
            resolved = res.data["Resolved"];
            this.teamwiseTicketCount = {
              labels: Object.keys(resolved),
              datasets: [
                {
                  type: "bar",
                  label: "Resolved",
                  backgroundColor: "#4ea364",
                  data: Object.values(resolved)
                }
              ]
            };
          }
          if (res.data["Assigned"] != null) {
            assigned = res.data["Assigned"];
            if (resolved) {
              this.teamwiseTicketCount = {
                labels: Object.keys(assigned) ? Object.keys(assigned) : Object.keys(res),
                datasets: [
                  {
                    type: "bar",
                    label: "Resolved",
                    backgroundColor: "#4ea364",
                    data: Object.values(resolved) ? Object.values(resolved) : [0]
                  },
                  {
                    type: "bar",
                    label: "Assigned",
                    backgroundColor: "#606060",
                    data: Object.values(assigned) ? Object.values(assigned) : []
                  }
                ]
              };
            } else {
              this.teamwiseTicketCount = {
                labels: Object.keys(assigned),
                datasets: [
                  {
                    type: "bar",
                    label: "Assigned",
                    backgroundColor: "#606060",
                    data: Object.values(assigned) ? Object.values(assigned) : []
                  }
                ]
              };
            }
          }
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  nextTenDaysRenewableCustomer() {
    this.dashboardService.nextTenDaysRenewableCustomer().subscribe(
      (res: any) => {
        this.nextTenDaysRenewableCustomerArray = [];
        if (res.dataList != null) {
          this.nextTenDaysRenewableCustomerArray = res.dataList;
        }
        this.showLoader = false;
      },
      (error: any) => {
        this.showLoader = false;
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  partnerWisePayment() {
    this.partnerwisePayment = null;
    this.dashboardService.partnerWisePayment().subscribe(
      (res: any) => {
        this.partnerwisePayment = {
          labels: Object.keys(res.data),
          datasets: [
            {
              label: "Amount in " + this.currency,
              backgroundColor: "#4ea364",
              hoverBackgroundColor: "#606060",
              data: Object.values(res.data)
            }
          ]
        };
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getDataAccordingtoYear() {
    this.getMonthWiseCollection(this.date10);
  }

  getDataAccordingtoYearForTicket() {
    this.monthWiseTicketCount(this.date10);
  }

  totalOpenTickets() {
    this.dashboardService.totalOpenTickets().subscribe(
      (res: any) => {
        this.totalOpenTicket = res.data != null ? res.data.data : "0";
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  monthWiseVolumeUsages(year:any) {
    this.dashboardService.monthWiseVolumeUsages(year).subscribe(
      (res: any) => {
        this.monthWisevolumeUsages = null;
        if (res.data != null) {
          this.monthWisevolumeUsages = {
            labels: Object.keys(res.data),
            datasets: [
              {
                label: "Volumes in MB",
                data: Object.values(res.data),
                backgroundColor: "#4ea364",
                hoverBackgroundColor: "#606060"
              }
            ]
          };
        }
        // this.connecteduser = res.data != null ? res.data : "0";
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  monthWiseTimeUsages(year:any) {
    this.dashboardService.monthWiseTimeUsages(year).subscribe(
      (res: any) => {
        this.monthWisetimeUsages = null;
        if (res.data != null) {
          this.monthWisetimeUsages = {
            labels: Object.keys(res.data),
            datasets: [
              {
                label: "Time in Minute",
                data: Object.values(res.data),
                backgroundColor: "#4ea364",
                hoverBackgroundColor: "#606060"
              }
            ]
          };
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  connectedUser() {
    this.dashboardService.connectedUser().subscribe(
      (res: any) => {
        this.connecteduser = res.data != null ? res.data : "0";
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  overDueTicketList() {
    this.dashboardService.overDueTicketList().subscribe(
      (res: any) => {
        this.overDueticketList = [];
        if (res.dataList != null) {
          this.overDueticketList = res.dataList;
        }
        this.showTicketLoader = false;
      },
      (error: any) => {
        this.showTicketLoader = false;
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getCommissionGraph() {
    this.showCustomerGraphs = false;
    this.showPaymentGraphs = false;
    this.showTicketGraphs = false;
    this.radiusGraph = false;
    this.commissionGraph = true;
    this.inventoryGraph = false;
    this.showApprovalData = false;
    this.monthWiseAGRPayable(new Date().getFullYear());
    this.monthWiseTDSPayable(new Date().getFullYear());
    this.partnerWiseTDSDetails(new Date().getFullYear());
    this.monthWiseTotalDetails(new Date().getFullYear());
    this.topFivePartnerCommissionWise(new Date().getFullYear());
  }

  monthWiseAGRPayable(year:any) {
    this.dashboardService.monthWiseAGRPayable(year).subscribe(
      (res: any) => {
        this.monthWiseAGRDetails = null;
        if (res.data != null) {
          this.monthWiseAGRDetails = {
            labels: Object.keys(res.data),
            datasets: [
              {
                label: "Amount in " + this.currency,
                data: Object.values(res.data),
                backgroundColor: "#4ea364",
                hoverBackgroundColor: "#606060"
              }
            ]
          };
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  monthWiseTDSPayable(year:any) {
    this.dashboardService.monthWiseTDSPayable(year).subscribe(
      (res: any) => {
        this.monthWiseTDSDetails = null;
        if (res.data != null) {
          this.monthWiseTDSDetails = {
            labels: Object.keys(res.data),
            datasets: [
              {
                label: "Amount in " + this.currency,
                data: Object.values(res.data),
                backgroundColor: "#4ea364",
                hoverBackgroundColor: "#606060"
              }
            ]
          };
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  partnerWiseTDSDetails(year:any) {
    this.dashboardService.partnerWiseTDSDetails(year).subscribe(
      (res: any) => {
        this.partnerWiseTDS = null;
        if (res.data != null) {
          this.partnerWiseTDS = {
            labels: Object.keys(res.data),
            datasets: [
              {
                label: "Amount in " + this.currency,
                data: Object.values(res.data),
                backgroundColor: "#4ea364",
                hoverBackgroundColor: "#606060"
              }
            ]
          };
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  monthWiseTotalDetails(year:any) {
    this.dashboardService.monthWiseTotalDetails(year).subscribe(
      (res: any) => {
        this.stackedData = null;
        if (res.data != null) {
          let tds = res.data["TDS"];
          let agr = res.data["AGR"];
          let commission = res.data["COMMISSION"];
          this.stackedData = {
            labels: Object.keys(commission),
            datasets: [
              {
                type: "bar",
                label: "TDS amount in " + this.currency,
                backgroundColor: "#4ea364",
                data: Object.values(tds)
              },
              {
                type: "bar",
                label: "AGR amount in " + this.currency,
                backgroundColor: "#EFD30A",
                data: Object.values(agr)
              },
              {
                type: "bar",
                label: "Commission amount in " + this.currency,
                backgroundColor: "#606060",
                data: Object.values(commission)
              }
            ]
          };
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
    this.stackedOptions = {
      tooltips: {
        mode: "index",
        intersect: false
      },
      responsive: true,
      scales: {
        xAxes: [
          {
            stacked: true
          }
        ],
        yAxes: [
          {
            stacked: true
          }
        ]
      }
    };
  }

  topFivePartnerCommissionWise(year:any) {
    this.dashboardService.topFivePartnerCommissionWise(year).subscribe(
      (res: any) => {
        this.topFivePartnerCommissionWiseData = null;
        if (res.data != null) {
          this.topFivePartnerCommissionWiseData = {
            labels: Object.keys(res.data),
            datasets: [
              {
                label: "Amount in " + this.currency,
                data: Object.values(res.data),
                backgroundColor: "#4ea364",
                hoverBackgroundColor: "#606060"
              }
            ]
          };
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getInventoryGraph() {
    this.showInventoryLoader = true;
    this.showCustomerGraphs = false;
    this.showPaymentGraphs = false;
    this.showTicketGraphs = false;
    this.radiusGraph = false;
    this.commissionGraph = false;
    this.inventoryGraph = true;
    this.showApprovalData = false;
    this.getStaffAndProductWiseInventory();
    this.getWareHouseAndProductWiseInventory();
    this.getInventoryAlert();
    this.getAvailableInventoryProductWise();

    this.showInventoryLoader = false;
  }

  getStaffAndProductWiseInventory() {
    this.dashboardService.getStaffAndProductWiseInventory().subscribe(
      (res: any) => {
        this.staffAndProductWiseInventoryList = [];
        if (res.data != null) {
          this.staffAndProductWiseInventoryList = res.data;
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getWareHouseAndProductWiseInventory() {
    this.dashboardService.getWareHouseAndProductWiseInventory().subscribe(
      (res: any) => {
        this.wareHouseAndProductWiseInventory = [];
        if (res.data != null) {
          this.wareHouseAndProductWiseInventory = res.data;
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getInventoryAlert() {
    this.inventoryAlertList = [];
    this.dashboardService.getInventoryAlert().subscribe(
      (res: any) => {
        if (res.data != null) {
          this.inventoryAlertList = res.data;
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getAvailableInventoryProductWise() {
    this.dashboardService.getAvailableInventoryProductWise().subscribe(
      (res: any) => {
        this.availableInventoryProductWise = [];
        if (res.data != null) {
          this.availableInventoryProductWise = res.data;
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getApprovalData(): void {
    this.showCustomerGraphs = false;
    this.showPaymentGraphs = false;
    this.showTicketGraphs = false;
    this.radiusGraph = false;
    this.commissionGraph = false;
    this.inventoryGraph = false;
    this.showApprovalData = true;
    this.leadListFlag = false;
    this.leadFollowupFlag = false;
    this.leadDashboardView = false;
    this.leadListForUserAndTeamFlag = false;
    this.showProductQtyData = false;

    let url = "/serviceStatus";
    // this.dashboardService.getMethod(url).subscribe((response: any) => {
    //   this.getCustomerPendingApprovals("");
    //   this.getPlanPendingApprovals("");
    //   this.getPlanGroupPendingApprovals("");
    //   this.getPaymentPendingApprovals("");
    //   this.getCustomerTerminationPendingApprovals("");
    //   if (this.statusCheckService.isActiveTicketService) {
    //     this.getCasePendingApprovals("");
    //   }
    //   this.getChangeDiscountPendingApprovals("");
    //   this.getInvoicePendingApprovals("");
    //   this.getPartnerPaymentApprovals("");
    //   this.getCustomerDocPendingApprovals("");
    //   this.getLeadList("");
    //   this.getSpecialPlanMappingApprovals("");
    // });
  }

  getSpecialPlanMappingApprovals(list:any): void {
    let size;
    const page = this.currentPagespecialPlanMappingdata;
    if (list) {
      size = list;
      this.specialPlanMappingdataitemsPerPage = list;
    } else {
      size = this.specialPlanMappingdataitemsPerPage;
    }

    const url = `/dashboard/approval/getSpecialPlanMappingApprovals`;
    const custerlist = {
      page,
      pageSize: size
    };
    this.dashboardService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        this.specialPlanMappingData = response.dataList;
        console.log(this.specialPlanMappingData);
        this.specialPlanMappingDataselector = response.dataList;
        this.specialPlanMappingdatatotalRecords = response.totalRecords;
        if (this.showItemPerPage > this.specialPlanMappingdataitemsPerPage) {
          this.specialPlanMappingListDatalength =
            this.customerListData.length % this.showItemPerPage;
        } else {
          this.specialPlanMappingListDatalength =
            this.customerListData.length % this.specialPlanMappingdataitemsPerPage;
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
  totalItemPerPageForSpecialPlanMapping(event:any): void {
    this.showItemPerPageForPayment = Number(event.value);
    if (this.currentPagePaymentListdata > 1) {
      this.currentPagePaymentListdata = 1;
    }
    this.getSpecialPlanMappingApprovals(this.showItemPerPageForPayment);
  }

  pageChangedForSpecialPlanMapping(pageNumber:any): void {
    this.currentPagePaymentListdata = pageNumber;
    this.getSpecialPlanMappingApprovals("");
  }

  getCustomerPendingApprovals(list:any): void {
    let size;
    const page = this.currentPagecustomerListdata;
    if (list) {
      size = list;
      this.customerListdataitemsPerPage = list;
    } else {
      size = this.customerListdataitemsPerPage;
    }

    const url = `/dashboard/approval/getCustomersApprovals`;
    const custerlist = {
      page,
      pageSize: size
    };
    this.dashboardService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        this.customerListData = response.dataList;
        this.customerListDataselector = response.dataList;
        this.customerListdatatotalRecords = response.totalRecords;
        if (this.showItemPerPage > this.customerListdataitemsPerPage) {
          this.customerListDatalength = this.customerListData.length % this.showItemPerPage;
        } else {
          this.customerListDatalength =
            this.customerListData.length % this.customerListdataitemsPerPage;
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

  customerDocumentId: any;
  totalItemPerPageForCustomerApprovals(event:any): void {
    this.showItemPerPage = Number(event.value);
    if (this.currentPagecustomerListdata > 1) {
      this.currentPagecustomerListdata = 1;
    }
    this.getCustomerPendingApprovals(this.showItemPerPage);
  }

  pageChangedForCustomerApprovals(pageNumber:any): void {
    this.currentPagecustomerListdata = pageNumber;
    this.getCustomerPendingApprovals("");
  }

  getPlanPendingApprovals(list:any): void {
    let size;
    const page = this.currentPagePlanListdata;
    if (list) {
      size = list;
      this.planListdataitemsPerPage = list;
    } else {
      size = this.planListdataitemsPerPage;
    }

    const url = `/dashboard/approval/getPlanApprovalsList`;
    const planList = {
      page,
      pageSize: size
    };
    this.dashboardService.postMethod(url, planList).subscribe(
      (response: any) => {
        this.planListData = response.dataList;
        this.planListDataselector = response.dataList;
        this.planListdatatotalRecords = response.totalRecords;
        if (this.showItemPerPage > this.customerListdataitemsPerPage) {
          this.planDatalength = this.planListData.length % this.showItemPerPage;
        } else {
          this.planDatalength = this.planListData.length % this.planListdataitemsPerPage;
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

  totalItemPerPageForPlanApprovals(event:any): void {
    this.showItemPerPageForPlan = Number(event.value);
    if (this.currentPagePlanListdata > 1) {
      this.currentPagePlanListdata = 1;
    }
    this.getPlanPendingApprovals(this.showItemPerPageForPlan);
  }

  pageChangedForPlanApprovals(pageNumber:any): void {
    this.currentPagePlanListdata = pageNumber;
    this.getPlanPendingApprovals("");
  }

  getPlanGroupPendingApprovals(list:any): void {
    let size;
    const page = this.currentPagePlanGroupListdata;
    if (list) {
      size = list;
      this.planGroupListdataitemsPerPage = list;
    } else {
      size = this.planGroupListdataitemsPerPage;
    }

    const url = `/dashboard/approval/getPlanGroupApprovalsList`;
    const planList = {
      page,
      pageSize: size
    };
    this.dashboardService.postMethod(url, planList).subscribe(
      (response: any) => {
        this.planGroupListData = response.dataList;
        this.planGroupListDataselector = response.dataList;
        this.planGroupListdatatotalRecords = response.totalRecords;
        if (this.showItemPerPageForPlanGroup > this.planGroupListdataitemsPerPage) {
          this.planGroupDatalength =
            this.planGroupListData.length % this.showItemPerPageForPlanGroup;
        } else {
          this.planGroupDatalength =
            this.planGroupListData.length % this.planGroupListdataitemsPerPage;
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

  totalItemPerPageForPlanGroupApprovals(event:any): void {
    this.showItemPerPageForPlanGroup = Number(event.value);
    if (this.currentPagePlanGroupListdata > 1) {
      this.currentPagePlanGroupListdata = 1;
    }
    this.getPlanGroupPendingApprovals(this.showItemPerPageForPlanGroup);
  }

  pageChangedForPlanGroupApprovals(pageNumber:any): void {
    this.currentPagePlanGroupListdata = pageNumber;
    this.getPlanGroupPendingApprovals("");
  }
  getPaymentPendingApprovals(list:any): void {
    let size;
    const page = this.currentPagePaymentListdata;
    if (list) {
      size = list;
      this.paymentListdataitemsPerPage = list;
    } else {
      size = this.paymentListdataitemsPerPage;
    }

    const url = `/dashboard/approval/getPaymentApprovalsList`;
    const planList = {
      page,
      pageSize: size
    };
    this.dashboardService.postMethod(url, planList).subscribe(
      (response: any) => {
        this.paymentListData = response.dataList;
        this.paymentListDataselector = response.dataList;
        this.paymentListdatatotalRecords = response.totalRecords;
        if (this.showItemPerPageForPayment > this.paymentListdataitemsPerPage) {
          this.paymentDatalength = this.paymentListData.length % this.showItemPerPageForPayment;
        } else {
          this.paymentDatalength = this.paymentListData.length % this.paymentListdataitemsPerPage;
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

  totalItemPerPageForPaymentApprovals(event:any): void {
    this.showItemPerPageForPayment = Number(event.value);
    if (this.currentPagePaymentListdata > 1) {
      this.currentPagePaymentListdata = 1;
    }
    this.getPlanGroupPendingApprovals(this.showItemPerPageForPayment);
  }

  pageChangedForPaymentApprovals(pageNumber:any): void {
    this.currentPagePaymentListdata = pageNumber;
    this.getPaymentPendingApprovals("");
  }

  getCustomerTerminationPendingApprovals(list:any): void {
    let size;
    const page = this.currentPagecustomerTerminationListdata;
    if (list) {
      size = list;
      this.customerTerminationListdataitemsPerPage = list;
    } else {
      size = this.customerTerminationListdataitemsPerPage;
    }

    const url = `/dashboard/approval/getCustomersApprovalsForTermination`;
    const custerlist = {
      page,
      pageSize: size
    };
    this.dashboardService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        this.customerTerminationListData = response.dataList;
        this.customerTerminationListDataselector = response.dataList;
        this.customerTerminationListdatatotalRecords = response.totalRecords;
        if (this.showItemPerPageTermination > this.customerTerminationListdataitemsPerPage) {
          this.customerTerminationListDatalength =
            this.customerTerminationListData.length % this.showItemPerPageTermination;
        } else {
          this.customerTerminationListDatalength =
            this.customerTerminationListData.length % this.customerTerminationListdataitemsPerPage;
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

  totalItemPerPageForCustomerTerminationApprovals(event:any): void {
    this.showItemPerPageTermination = Number(event.value);
    if (this.currentPagecustomerTerminationListdata > 1) {
      this.currentPagecustomerTerminationListdata = 1;
    }
    this.getCustomerPendingApprovals(this.showItemPerPageTermination);
  }

  pageChangedForCustomerTerminationApprovals(pageNumber:any): void {
    this.currentPagecustomerTerminationListdata = pageNumber;
    this.getCustomerTerminationPendingApprovals("");
  }

  getCasePendingApprovals(list:any): void {
    let size;
    const page = this.currentPageCaseListdata;
    if (list) {
      size = list;
      this.caseListdataitemsPerPage = list;
    } else {
      size = this.caseListdataitemsPerPage;
    }

    const url = `/case/approval/getTicketApprovals`;
    const custerlist = {
      page,
      pageSize: size
    };
    this.ticketManagementService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        this.caseListData = response.dataList;
        this.caseListDataselector = response.dataList;
        this.caseListdatatotalRecords = response.totalRecords;
        if (this.showItemPerPageCase > this.caseListdataitemsPerPage) {
          this.caseListDatalength = this.caseListData.length % this.showItemPerPageCase;
        } else {
          this.caseListDatalength = this.caseListData.length % this.caseListdataitemsPerPage;
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

  totalItemPerPageForCaseApprovals(event:any): void {
    this.showItemPerPageCase = Number(event.value);
    if (this.currentPageCaseListdata > 1) {
      this.currentPageCaseListdata = 1;
    }

    this.getCasePendingApprovals(this.showItemPerPageCase);
  }

  pageChangedForCaseApprovals(pageNumber:any): void {
    this.currentPageCaseListdata = pageNumber;
    this.getCasePendingApprovals("");
  }

  getChangeDiscountPendingApprovals(list:any): void {
    let size;
    const page = this.currentPageChangeDiscountListdata;
    if (list) {
      size = list;
      this.changeDiscountListdataitemsPerPage = list;
    } else {
      size = this.changeDiscountListdataitemsPerPage;
    }

    const url = `/dashboard/approval/getChangeDiscountApprovals`;
    const custerlist = {
      page,
      pageSize: size
    };
    this.dashboardService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        this.changeDiscountListData = response.dataList;
        this.changeDiscountListDataselector = response.dataList;
        this.changeDiscountListdatatotalRecords = response.totalRecords;
        if (this.showItemPerPageChangeDiscount > this.changeDiscountListdataitemsPerPage) {
          this.changeDiscountListDatalength =
            this.changeDiscountListData.length % this.showItemPerPageChangeDiscount;
        } else {
          this.changeDiscountListDatalength =
            this.changeDiscountListData.length % this.changeDiscountListdataitemsPerPage;
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

  totalItemPerPageForChangeDiscountApprovals(event:any): void {
    this.showItemPerPageChangeDiscount = Number(event.value);
    if (this.currentPageChangeDiscountListdata > 1) {
      this.currentPageChangeDiscountListdata = 1;
    }
    this.getChangeDiscountPendingApprovals(this.showItemPerPageChangeDiscount);
  }

  pageChangedForChangeDiscountApprovals(pageNumber:any): void {
    this.currentPageChangeDiscountListdata = pageNumber;
    this.getChangeDiscountPendingApprovals("");
  }

  getInvoicePendingApprovals(list:any): void {
    let size;
    const page = this.currentPageInvoiceListdata;
    if (list) {
      size = list;
      this.invoiceListdataitemsPerPage = list;
    } else {
      size = this.invoiceListdataitemsPerPage;
    }

    const url = `/dashboard/approval/getBillToOrgApprovals`;
    const custerlist = {
      page,
      pageSize: size
    };
    this.dashboardService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        this.invoiceListData = response.dataList;
        this.invoiceListDataselector = response.dataList;
        this.invoiceListdatatotalRecords = response.totalRecords;
        if (this.showItemPerPageInvoice > this.invoiceListdataitemsPerPage) {
          this.invoiceListDatalength = this.invoiceListData.length % this.showItemPerPageInvoice;
        } else if (this.invoiceListData != null) {
          this.invoiceListDatalength =
            this.invoiceListData.length % this.invoiceListdataitemsPerPage;
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

  totalItemPerPageForInvoiceApprovals(event:any): void {
    this.showItemPerPageInvoice = Number(event.value);
    if (this.currentPageInvoiceListdata > 1) {
      this.currentPageInvoiceListdata = 1;
    }
    this.getInvoicePendingApprovals(this.showItemPerPageInvoice);
  }

  pageChangedForInvoiceApprovals(pageNumber:any): void {
    this.currentPageInvoiceListdata = pageNumber;
    this.getInvoicePendingApprovals("");
  }
  getPartnerPaymentApprovals(list:any): void {
    let size;
    const page = this.currentPagePartnerPaymentListdata;
    if (list) {
      size = list;
      this.partnerPaymentListdataitemsPerPage = list;
    } else {
      size = this.partnerPaymentListdataitemsPerPage;
    }

    const url = `/dashboard/approval/getPartnerPaymentApprovals`;
    const custerlist = {
      page,
      pageSize: size
    };
    this.dashboardService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        this.partnerPaymentListData = response.dataList;
        this.partnerPaymentListDataselector = response.dataList;
        this.partnerPaymentListdatatotalRecords = response.totalRecords;
        if (this.showItemPerPagePartnerPayment > this.partnerPaymentListdataitemsPerPage) {
          this.partnerPaymentListDatalength =
            this.partnerPaymentListData.length % this.showItemPerPagePartnerPayment;
        } else {
          this.partnerPaymentListDatalength =
            this.partnerPaymentListData.length % this.partnerPaymentListdataitemsPerPage;
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

  totalItemPerPageForPartnerPaymentApprovals(event:any): void {
    this.showItemPerPagePartnerPayment = Number(event.value);
    if (this.currentPagePartnerPaymentListdata > 1) {
      this.currentPagePartnerPaymentListdata = 1;
    }
    this.getPartnerPaymentApprovals(this.showItemPerPagePartnerPayment);
  }

  pageChangedForPartnerPaymentApprovals(pageNumber:any): void {
    this.currentPagePartnerPaymentListdata = pageNumber;
    this.getPartnerPaymentApprovals("");
  }
  //Customer Approve/Reject
  isCustDocPending(cafId:any, nextApproverId:any) {
    this.customerDocumentService.isCustDocPending(cafId).subscribe(
      (response: any) => {
        if (response.data) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Customer cannot activate. Document Verification Pending",
            icon: "far fa-times-circle"
          });
        } else {
          this.approved = false;
          this.selectStaff = null;
          $("#assignCustomerCAFModal").modal("show");
          this.assignCustomerCAFId = cafId;
          this.nextApproverId = nextApproverId;
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  rejectCustomerCAFOpen(cafId:any, nextApproverId:any) {
    this.reject = false;
    $("#rejectCustomerCAFModal").modal("show");
    this.assignCustomerCAFId = cafId;
    this.nextApproverId = nextApproverId;
  }

  assignToStaff(flag:any) {
    let url: any;
    let name: any;
    let id: any;
    if (this.planID) {
      id = this.planID;
      name = "PLAN";
    } else if (this.planGroupID) {
      id = this.planGroupID;
      name = "PLAN_GROUP";
    } else if (this.partnerID) {
      id = this.partnerID;
      name = "PARTNER_BALANCE";
    } else {
      id = this.assignCustomerCAFId;
      name = "CAF";
    }
    if (flag == true) {
      if (this.selectStaff) {
        url = `/teamHierarchy/assignFromStaffList?entityId=${id}&eventName=${name}&nextAssignStaff=${this.selectStaff}&isApproveRequest=${flag}`;
      } else {
        url = `/teamHierarchy/assignEveryStaff?entityId=${id}&eventName=${name}&isApproveRequest=${flag}`;
      }
    } else {
      if (this.selectStaffReject) {
        url = `/teamHierarchy/assignFromStaffList?entityId=${id}&eventName=${name}&nextAssignStaff=${this.selectStaffReject}&isApproveRequest=${flag}`;
      } else {
        url = `/teamHierarchy/assignEveryStaff?entityId=${id}&eventName=${name}&isApproveRequest=${flag}`;
      }
    }

    this.dashboardService.getMethod(url).subscribe(
      response => {
        $("#assignCustomerCAFModal").modal("hide");
        $("#rejectCustomerCAFModal").modal("hide");
        this.getApprovalData();
        console.log(response);
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  assignStaffListData:any[] = [];
  assignCustomerCAF() {
    this.assignCustomerCAFsubmitted = true;
    if (this.assignCustomerCAFForm.valid) {
      let url: any;
      let assignCAFData: any;
      if (this.planID) {
        url = "/approvePlan";
        assignCAFData = {
          planId: this.planID,
          nextStaffId: "",
          flag: "approved",
          remark: this.assignCustomerCAFForm.controls['remark'].value,
          staffId: localStorage.getItem("userId")
        };
      } else if (this.planGroupID) {
        url = "/approvePlanGroup";
        assignCAFData = {
          planGroupId: this.planGroupID,
          nextStaffId: "",
          flag: "approved",
          remark: this.assignCustomerCAFForm.controls['remark'].value,
          staffId: localStorage.getItem("userId")
        };
      } else if (this.partnerID) {
        url = "/approvePartnerBalance";
        assignCAFData = {
          partnerPaymentId: this.partnerID,
          nextStaffId: "",
          flag: "approved",
          remark: this.assignCustomerCAFForm.controls['remark'].value,
          staffId: localStorage.getItem("userId")
        };
      } else if (this.customerDocumentId) {
        console.log(" this.customerDocumentId", this.customerDocumentId);
        url =
          "/custDoc/approveUploadCustomerDoc?docId=" +
          this.customerDocumentId +
          "&remarks=" +
          this.assignCustomerCAFForm.controls['remark'].value +
          "&isApproveRequest=true";
        assignCAFData = {
          custcafId: this.customerDocumentId,
          nextStaffId: "",
          flag: "approved",
          remark: this.assignCustomerCAFForm.controls['remark'].value,
          staffId: localStorage.getItem("userId")
        };
      } else {
        url = "/approveCaf";
        assignCAFData = {
          custcafId: this.assignCustomerCAFId,
          nextStaffId: "",
          flag: "approved",
          remark: this.assignCustomerCAFForm.controls['remark'].value,
          staffId: localStorage.getItem("userId")
        };
      }
      this.dashboardService.updateMethod(url, assignCAFData).subscribe(
        (response: any) => {
          if (response.dataList != null && response.dataList.length > 0) {
            this.assignStaffListDataSPM = response.dataList;
            //  this.ApproveRejectModal = false;

            $("#assignCustomerDocumentForApproval").modal("show");
          } else {
            //   this.ApproveRejectModal = false;
            this.getCustomerDocPendingApprovals("");
          }

          this.getApprovalData();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });

          this.assignCustomerCAFForm.reset();
          this.assignCustomerCAFsubmitted = false;
          if (response.result != null && response.result.dataList != null) {
            this.approveCAF = response.result.dataList;
            this.approved = true;
          } else {
            $("#assignCustomerCAFModal").modal("hide");
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
  }

  rejectCustomerCAF() {
    this.rejectCustomerCAFsubmitted = true;
    if (this.rejectCustomerCAFForm.valid) {
      let url: any;
      let assignCAFData: any;
      if (this.planID) {
        url = "/approvePlan";
        assignCAFData = {
          planId: this.planID,
          nextStaffId: "",
          flag: "Rejected",
          remark: this.rejectCustomerCAFForm.controls['remark'].value,
          staffId: localStorage.getItem("userId")
        };
      } else if (this.planGroupID) {
        url = "/approvePlanGroup";
        assignCAFData = {
          planGroupId: this.planGroupID,
          nextStaffId: "",
          flag: "Rejected",
          remark: this.rejectCustomerCAFForm.controls['remark'].value,
          staffId: localStorage.getItem("userId")
        };
      } else if (this.partnerID) {
        url = "/approvePartnerBalance";
        assignCAFData = {
          partnerPaymentId: this.partnerID,
          nextStaffId: "",
          flag: "Rejected",
          remark: this.rejectCustomerCAFForm.controls['remark'].value,
          staffId: localStorage.getItem("userId")
        };
      } else {
        url = "/approveCaf";
        assignCAFData = {
          custcafId: this.assignCustomerCAFId,
          nextStaffId: "",
          flag: "rejected",
          remark: this.rejectCustomerCAFForm.controls['remark'].value,
          staffId: localStorage.getItem("userId")
        };
      }
      console.log("assignCAFData", assignCAFData);
      this.dashboardService.updateMethod(url, assignCAFData).subscribe(
        (response: any) => {
          this.getApprovalData();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });

          this.rejectCustomerCAFForm.reset();
          this.rejectCustomerCAFsubmitted = false;
          if (response.result.dataList != null) {
            this.rejectCAF = response.result.dataList;
            this.reject = true;
          } else {
            $("#rejectCustomerCAFModal").modal("hide");
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
  }
  //Customer Termination
  ifApproveStatus = false;
  approveRejectRemark = "";
  ifShowRemarkMoedl = "";
  apprRejectCustID = "";
  approveInventoryData: any;
  rejectInventoryData: any;

  approveCutomerstatusModalOpen(custId:any) {
    this.ifApproveStatus = true;
    this.apprRejectCustID = custId;
    this.approveRejectRemark = "";
    $("#ApproveRejectRemarkModal").modal("show");
    this.ifShowRemarkMoedl = "Customer";
    this.paymentID = "";
    this.approveId = "";
    this.caseId = "";
  }

  rejectCustomerstatusModalOpen(custId:any) {
    this.ifApproveStatus = false;
    this.apprRejectCustID = custId;
    this.approveRejectRemark = "";
    $("#ApproveRejectRemarkModal").modal("show");
    this.ifShowRemarkMoedl = "Customer";
    this.paymentID = "";
    this.approveId = "";
    this.caseId = "";
  }

  statusApporevedRejected() {
    this.approveId = this.apprRejectCustID;
    let custstatus = "";
    if (this.ifApproveStatus == true) {
      this.approved = false;
      this.approveInventoryData = [];
      this.selectStaff = null;
      custstatus = "Approved";
    } else {
      this.reject = false;
      this.selectStaffReject = null;
      this.rejectInventoryData = [];
      custstatus = "Rejected";
    }
    const data = {
      id: this.apprRejectCustID,
      status: custstatus,
      remarks: this.approveRejectRemark
    };

    const url =
      "/changeStatusCustomerApprove/" +
      this.apprRejectCustID +
      "?status=" +
      custstatus +
      "&remarks=" +
      this.approveRejectRemark;
    this.dashboardService.updateMethod(url, data).subscribe(
      (response: any) => {
        if (response.dataList != null && response.dataList.length > 0) {
          this.assignStaffListDataSPM = response.dataList;
          //  this.ApproveRejectModal = false;

          $("#assignCustomerDocumentForApproval").modal("show");
        } else {
          //   this.ApproveRejectModal = false;
          this.getCustomerTerminationPendingApprovals("");
        }
        $("#ApproveRejectRemarkModal").modal("hide");
        this.ifShowRemarkMoedl = "";
        if (this.ifApproveStatus == true) {
          if (response.result.dataList != null) {
            this.approved = true;
            this.approveInventoryData = response.result.dataList;
            $("#assignCustomerInventoryModal").modal("show");
          } else {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Approved Successfully.",
              icon: "far fa-times-circle"
            });
            this.getApprovalData();
          }
        } else {
          if (response.result.dataList) {
            this.reject = true;
            this.rejectInventoryData = response.result.dataList;
            $("#rejectCustomerInventoryModal").modal("show");
          } else {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Rejected Successfully.",
              icon: "far fa-times-circle"
            });
            this.getApprovalData();
          }
        }
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
  assignToStaffCAF(flag:any) {
    let url: any;
    let id: any;
    let name: any;
    if (this.paymentID) {
      id = this.paymentID;
      name = "PAYMENT";
    } else if (this.caseId) {
      id = this.caseId;
      name = "CASE";
    } else if (this.discountID) {
      id = this.discountID;
      name = "CUSTOMER_DISCOUNT";
    } else {
      id = this.approveId;
      name = "TERMINATION";
    }
    if (flag) {
      url = `/teamHierarchy/assignFromStaffList?entityId=${id}&eventName=${name}&nextAssignStaff=${this.selectStaff}&isApproveRequest=${flag}`;
    } else {
      url = `/teamHierarchy/assignFromStaffList?entityId=${id}&eventName=${name}&nextAssignStaff=${this.selectStaffReject}&isApproveRequest=${flag}`;
    }

    this.dashboardService.getMethod(url).subscribe(
      response => {
        if (flag) {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Approved Successfully.",
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Rejected Successfully.",
            icon: "far fa-times-circle"
          });
        }
        $("#assignCustomerInventoryModal").modal("hide");
        $("#rejectCustomerInventoryModal").modal("hide");
        this.getApprovalData();
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  //Plan
  planID: any;
  rejectPlanOpen(planId:any, nextApproverId:any) {
    this.reject = false;
    this.selectStaff = null;
    this.rejectCAF = [];
    $("#rejectCustomerCAFModal").modal("show");
    this.planID = planId;
    this.nextApproverId = nextApproverId;
    this.rejectCustomerCAFForm.reset();
    this.rejectCustomerCAFsubmitted = false;
  }

  approvePlanOpen(planId:any, nextApproverId:any) {
    this.approved = false;
    this.selectStaff = null;
    this.approveCAF = [];
    $("#assignCustomerCAFModal").modal("show");
    this.planID = planId;
    this.nextApproverId = nextApproverId;
    this.assignCustomerCAFForm.reset();
    this.assignCustomerCAFsubmitted = false;
  }

  //Plan Group
  planGroupID: any;
  rejectPlanGroupOpen(planGroupId:any, nextApproverId:any) {
    this.reject = false;
    this.selectStaff = null;
    this.approveCAF = [];
    $("#rejectCustomerCAFModal").modal("show");
    this.planGroupID = planGroupId;
    this.nextApproverId = nextApproverId;
    this.assignCustomerCAFForm.reset();
    this.assignCustomerCAFsubmitted = false;
  }

  approvePlanGroupOpen(planGroupId:any, nextApproverId:any) {
    this.approved = false;
    this.selectStaff = null;
    this.rejectCAF = [];
    $("#assignCustomerCAFModal").modal("show");
    this.planGroupID = planGroupId;
    this.nextApproverId = nextApproverId;
    this.assignCustomerCAFForm.reset();
    this.assignCustomerCAFsubmitted = false;
  }

  approveRejectInvoice(invoiceID:any, isApproveRequest:any) {
    // this.assignStaffForm.reset();
    const url = `/invoiceV2/approveDebitDoc?invoiceId=${invoiceID}&isApproveRequest=${isApproveRequest}&remark=${"approved"}`;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        // this.assignStaffForm.controls.invoiceId.setValue(invoiceID);
        if (isApproveRequest) {
          if (response.dataList != null) {
            this.approve = true;
            this.staffList = response.dataList;

            $("#assignApproveModal").modal("show");
          } else {
            this.approve = false;
            this.allIsChecked = false;
          }
        } else {
          if (response.dataList != null) {
            this.approve = false;
            this.staffList = response.dataList;

            $("#assignApproveModal").modal("show");
          } else {
            this.approve = true;
            this.allIsChecked = false;
          }
        }
        // this.closebutton.nativeElement.click();

        if (response.responseCode === 417) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
        }

        this.getApprovalData();
      },
      (error: any) => {
        // console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  //Partner Payment
  partnerID: any;
  rejectPartnerBalanceOpen(partnerBalanceId:any, nextApproverId:any) {
    this.reject = false;
    this.selectStaff = null;
    this.rejectCAF = [];
    $("#rejectCustomerCAFModal").modal("show");
    this.partnerID = partnerBalanceId;
    this.nextApproverId = nextApproverId;
  }

  approvePartnerBalanceOpen(partnerBalanceId:any, nextApproverId:any) {
    this.approved = false;
    this.selectStaff = null;
    this.approveCAF = [];
    $("#assignCustomerCAFModal").modal("show");
    this.partnerID = partnerBalanceId;
    this.nextApproverId = nextApproverId;
  }
  //Payment
  paymentID: any;
  ApprRejectData: any = [];

  approvePaymentModalOpen(data:any) {
    this.approveRejectRemark = "";
    this.ifApproveStatus = true;
    this.ApprRejectData = data;
    $("#ApproveRejectRemarkModal").modal("show");
    this.ifShowRemarkMoedl = "Payment";
    this.paymentID = "";
    this.approveId = "";
    this.caseId = "";
  }

  rejectPaymentModalOpen(data:any) {
    this.approveRejectRemark = "";
    this.ifApproveStatus = false;
    this.ApprRejectData = data;
    $("#ApproveRejectRemarkModal").modal("show");
    this.ifShowRemarkMoedl = "Payment";
    this.paymentID = "";
    this.approveId = "";
    this.caseId = "";
  }

  statusApporeved() {
    this.paymentID = this.ApprRejectData.id;
    this.approveId = this.ApprRejectData.id;
    this.approved = false;
    this.approveInventoryData = [];
    this.selectStaff = null;

    const format = "yyyy-MM-dd";
    const locale = "en-US";
    // const myDate = moment(this.ApprRejectData.paymentdate, "DD-MM-YYYY").toDate();
    // const formattedDate = formatDate(myDate, format, locale);

    let approvedData = {
      customerid: this.ApprRejectData.custId,
      idlist: Number(this.ApprRejectData.id),
      paymode: this.ApprRejectData.paymode,
      paystatus: this.ApprRejectData.status,
      // paytodate: formattedDate,
      referenceno: this.ApprRejectData.receiptNo,
      remarks: this.approveRejectRemark
    };
    const url = "/payment/approve";
    this.dashboardService.postMethod(url, approvedData).subscribe(
      (response: any) => {
        // this.recepit = response.data;
        $("#ApproveRejectRemarkModal").modal("hide");
        if (response.payment.dataList) {
          this.approved = true;
          $("#assignCustomerInventoryModal").modal("show");
          this.approveInventoryData = response.payment.dataList;
          console.log(this.approveCAF);
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Approved Successfully.",
            icon: "far fa-times-circle"
          });
          this.getApprovalData();
        }
        this.ifApproveStatus = false;
        this.ApprRejectData = [];
      },
      (error: any) => {
        console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  statusRejected() {
    this.paymentID = this.ApprRejectData.id;
    this.approveId = this.ApprRejectData.id;
    this.reject = false;
    this.selectStaffReject = null;
    this.rejectInventoryData = [];
    const format = "yyyy-MM-dd";
    const locale = "en-US";
    // const myDate = moment(this.ApprRejectData.paymentdate, "DD-MM-YYYY").toDate();
    // const formattedDate = formatDate(myDate, format, locale);

    let rejectdata = {
      customerid: this.ApprRejectData.custId,
      idlist: Number(this.ApprRejectData.id),
      paymode: this.ApprRejectData.paymode,
      paystatus: this.ApprRejectData.status,
      // paytodate: formattedDate,
      referenceno: this.ApprRejectData.receiptNo,
      remarks: this.approveRejectRemark
    };
    const url = "/payment/reject";
    this.dashboardService.postMethod(url, rejectdata).subscribe(
      (response: any) => {
        $("#ApproveRejectRemarkModal").modal("hide");
        if (response.payment.dataList) {
          this.reject = true;
          this.rejectInventoryData = response.payment.dataList;
          $("#rejectCustomerInventoryModal").modal("show");
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Rejected Successfully.",
            icon: "far fa-times-circle"
          });
          this.getApprovalData();
        }
        this.ifApproveStatus = false;
        this.ApprRejectData = [];
      },
      (error: any) => {
        console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  //Case
  caseId: any;

  approveTicket(data:any) {
    this.approveRejectRemark = "";
    this.ifApproveStatus = true;
    this.ApprRejectData = data;
    $("#ApproveRejectRemarkModal").modal("show");
    this.ifShowRemarkMoedl = "Ticket";
    this.paymentID = "";
    this.approveId = "";
    this.caseId = "";
  }

  rejectTicket(data:any) {
    this.approveRejectRemark = "";
    this.ifApproveStatus = false;
    this.ApprRejectData = data;
    $("#ApproveRejectRemarkModal").modal("show");
    this.ifShowRemarkMoedl = "Ticket";

    this.paymentID = "";
    this.approveId = "";
    this.caseId = "";
  }

  statusApporevedTicket() {
    this.caseId = this.ApprRejectData.caseId;
    this.approveId = this.ApprRejectData.caseId;
    this.approved = false;
    this.approveInventoryData = [];
    this.selectStaff = null;
    const url =
      "/case/approveTicket?caseId=" +
      this.caseId +
      "&isApproveRequest=true&remarks=" +
      this.approveRejectRemark;
    this.ticketManagementService.getMethod(url).subscribe(
      (response: any) => {
        $("#ApproveRejectRemarkModal").modal("hide");
        if (response.dataList) {
          this.approved = true;
          this.approveInventoryData = response.dataList;
          $("#assignCustomerInventoryModal").modal("show");
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Approved Successfully.",
            icon: "far fa-times-circle"
          });
          this.getApprovalData();
        }
        this.ifApproveStatus = false;
        this.ApprRejectData = [];
      },
      (error: any) => {
        console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  statusRejectedTicket() {
    this.caseId = this.ApprRejectData.caseId;
    this.approveId = this.ApprRejectData.caseId;
    this.reject = false;
    this.selectStaffReject = null;
    this.rejectInventoryData = [];
    const url =
      "/case/approveTicket?caseId=" +
      this.caseId +
      "&isApproveRequest=false&remarks=" +
      this.approveRejectRemark;
    this.ticketManagementService.getMethod(url).subscribe(
      (response: any) => {
        $("#ApproveRejectRemarkModal").modal("hide");
        if (response.dataList) {
          this.reject = true;
          this.rejectInventoryData = response.dataList;
          $("#rejectCustomerInventoryModal").modal("show");
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Rejected Successfully.",
            icon: "far fa-times-circle"
          });
          this.getApprovalData();
        }
        this.ifApproveStatus = false;
        this.ApprRejectData = [];
      },
      (error: any) => {
        console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  //Change Discount
  discountID: any;
  AppRjecHeader: string;
  discountFlageType: string;
  assignDiscountData: any;
  assignDiscounsubmitted: boolean = false;
  discountRejected(data:any) {
    this.discountID = data.id;
    $("#rejectApproveDiscountModal").modal("show");
    this.assignDiscountData = data;
    this.discountFlageType = "Rejected";
    this.AppRjecHeader = "Reject";
    this.assignAppRejectDiscountForm.reset();
  }

  discountApporeved(data:any) {
    this.discountID = data.id;
    $("#rejectApproveDiscountModal").modal("show");
    this.assignDiscountData = data;
    this.discountFlageType = "approved";
    this.AppRjecHeader = "Apporve ";
    this.assignAppRejectDiscountForm.reset();
  }
  assignDiscountApprove() {
    this.assignDiscounsubmitted = true;
    if (this.assignAppRejectDiscountForm.valid) {
      let url = "/approveChangeDiscount";
      let assignCAFData = {
        custPackageId: this.assignDiscountData.id,
        flag: this.discountFlageType,
        nextStaffId: 0,
        planId: this.assignDiscountData.planId,
        remark: this.assignAppRejectDiscountForm.controls['remark'].value,
        staffId: localStorage.getItem("userId")
      };

      this.dashboardService.updateMethod(url, assignCAFData).subscribe(
        (response: any) => {
          $("#rejectApproveDiscountModal").modal("hide");
          if (response.dataList) {
            if (this.discountFlageType == "approved") {
              this.approved = true;
              this.approveInventoryData = response.dataList;
              $("#assignCustomerInventoryModal").modal("show");
            } else {
              this.reject = true;
              this.rejectInventoryData = response.dataList;
              $("#rejectCustomerInventoryModal").modal("show");
            }
          } else {
            if (this.discountFlageType == "approved") {
              this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: "Approved Successfully.",
                icon: "far fa-times-circle"
              });
            } else {
              this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: "Rejected Successfully.",
                icon: "far fa-times-circle"
              });
            }
            this.getApprovalData();
          }
          this.assignAppRejectDiscountForm.reset();
          this.assignDiscounsubmitted = false;
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
  }

  pageChangedLeadList(pageNumber:any) {
    this.currentPageLeadListdata = pageNumber;
    if (this.searchkey) {
    } else {
      this.getLeadList("");
    }
  }

  TotalItemPerPage(event:any) {
    this.currentPageLeadListdata = 1;
    this.showItemPerPage = Number(event.value);
    // if (this.currentPageLeadListdata > 1) {
    //   this.currentPageLeadListdata = 1;
    // }
    if (!this.searchkey) {
      this.getLeadList(this.showItemPerPage);
    } else {
    }
  }

  myStaffs: any;
  getLeadList(list:any) {
    if (this.statusCheckService.isActiveSalesCrm) {
      let size;
      this.searchkey = "";
      let page = this.currentPageLeadListdata;
      if (list) {
        size = list;
        this.leadListdataitemsPerPage = list;
      } else {
        size = this.leadListdataitemsPerPage;
      }

      const url = "/leadMaster/findAllByCurrentUserTeamLead?page=" + page + "&pageSize=" + size;

      this.leadManagementService.getMethod(url).subscribe(
        async (response: any) => {
          // await response?.leadMasterList?.content.forEach((leadItem: any) =>
          //   Number(leadItem.createdBy)
          // );
          console.log("My Lead List Response => ", response?.leadMasterList?.content);

          this.leadListData = await response?.leadMasterList?.content;

          this.leadListdatatotalRecords = await response?.leadMasterList?.totalElements;

          if (this.showItemPerPage > this.leadListdataitemsPerPage) {
            this.leadListDatalength = this.leadListData?.length % this.showItemPerPage;
          } else {
            this.leadListDatalength = this.leadListData?.length % this.leadListdataitemsPerPage;
          }
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
  }

  totalItemPerPageForProductQtyByStaff(event:any): void {
    this.showItemPerPageProductQty = Number(event.value);
    if (this.currentPageProductQtyByStaffdata > 1) {
      this.currentPageProductQtyByStaffdata = 1;
    }
    this.getProductQtyByStaff(this.showItemPerPageProductQty);
  }

  pageChangedForProductQtyByStaff(pageNumber:any): void {
    this.currentPageProductQtyByStaffdata = pageNumber;
    this.getProductQtyByStaff("");
  }

  totalItemPerPageForProductQtyByWarehouse(event:any): void {
    this.showItemPerPageProducyQtyByWarehouse = Number(event.value);
    if (this.currentPageProductQtyByWarehousedata > 1) {
      this.currentPageProductQtyByWarehousedata = 1;
    }
    this.getProductQtyByWarehouse(this.showItemPerPageProducyQtyByWarehouse);
  }

  pageChangedForProductQtyByWarehouse(pageNumber:any): void {
    this.currentPageProductQtyByWarehousedata = pageNumber;
    this.getProductQtyByWarehouse("");
  }

  getProductQtyByStaff(list:any): void {
    let size;
    const page = this.currentPageProductQtyByStaffdata;
    if (list) {
      size = list;
      this.productQtyListdataitemsPerPage = list;
    } else {
      size = this.productQtyListdataitemsPerPage;
    }

    const custerlist = {
      page,
      pageSize: size
    };
    this.dashboardService.getProductQtyByStaff(custerlist).subscribe(
      (response: any) => {
        this.productQTy = response.dataList;
        this.productQtytotalRecords = response.totalRecords;
        if (this.showItemPerPageProductQty > this.productQtyListdataitemsPerPage) {
          this.productListDatalength = this.productQTy.length % this.showItemPerPageProductQty;
        } else {
          this.productListDatalength = this.productQTy.length % this.productQtyListdataitemsPerPage;
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

  getProductQtyByWarehouse(list:any): void {
    let size;
    const page = this.currentPageProductQtyByWarehousedata;
    if (list) {
      size = list;
      this.productQtyListdataitemsbywarehousePerPage = list;
    } else {
      size = this.productQtyListdataitemsbywarehousePerPage;
    }

    const custerlist = {
      page,
      pageSize: size
    };
    this.dashboardService.getProductQtyByWarehouse(custerlist).subscribe(
      (response: any) => {
        this.productQtyByWarehouse = response.dataList;
        this.productQtyByWarehousetotalRecords = response.totalRecords;
        if (
          this.showItemPerPageProducyQtyByWarehouse > this.productQtyListdataitemsbywarehousePerPage
        ) {
          this.productListDatalength =
            this.productQtyByWarehouse.length % this.showItemPerPageProducyQtyByWarehouse;
        } else {
          this.productListDatalength =
            this.productQtyByWarehouse.length % this.productQtyListdataitemsbywarehousePerPage;
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

  getCustomerDocPendingApprovals(list:any): void {
    let size;
    const page = this.currentPageCustomerDocListdata;
    if (list) {
      size = list;
      this.customerDocListdataitemsPerPage = list;
    } else {
      size = this.customerDocListdataitemsPerPage;
    }

    const url = `/dashboard/approval/getCustomerDocForApprovals`;
    const custerlist = {
      page,
      pageSize: size
    };
    this.dashboardService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        this.customerDocListData = response.dataList;
        this.customerDocListDataselector = response.dataList;
        this.customerDocListdatatotalRecords = response.totalRecords;
        if (this.showItemPerPageCustomerDoc > this.customerDocListdataitemsPerPage) {
          this.customerDocListDatalength =
            this.customerDocListData.length % this.showItemPerPageCustomerDoc;
        } else {
          this.customerDocListDatalength =
            this.customerDocListData.length % this.customerDocListdataitemsPerPage;
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

  totalItemPerPageForCustomerDocApprovals(event:any): void {
    this.showItemPerPageCustomerDoc = Number(event.value);
    if (this.currentPageCustomerDocListdata > 1) {
      this.currentPageCustomerDocListdata = 1;
    }
    this.getCustomerDocPendingApprovals(this.showItemPerPageCustomerDoc);
  }

  pageChangedForCustomerDocApprovals(pageNumber:any): void {
    this.currentPageCustomerDocListdata = pageNumber;
    this.getCustomerDocPendingApprovals("");
  }
  viewLeadDashboard() {
    console.log("Clicked on view lead List function()...");

    this.leadDashboardView = true;
    this.showApprovalData = false;
    this.leadListFlag = true;
    this.leadFollowupFlag = true;
    this.leadListForUserAndTeamFlag = true;
    this.showProductQtyData = false;
    if (this.statusCheckService.isActiveSalesCrm) {
      this.getAssignedLeadList("");
      this.getFollowupLeadList("");
      this.getAllLeadsByCurrentUserTeamLead("");
      this.getAllfollowupsByCurrentUserTeamfollowup("");
    }
  }
  viewInventoryDashboard() {
    this.showCustomerGraphs = false;
    this.showPaymentGraphs = false;
    this.showTicketGraphs = false;
    this.radiusGraph = false;
    this.commissionGraph = false;
    this.inventoryGraph = false;
    this.showApprovalData = false;
    this.leadListFlag = false;
    this.leadFollowupFlag = false;
    this.leadDashboardView = false;
    this.leadListForUserAndTeamFlag = false;
    this.showProductQtyData = true;
    if (this.statusCheckService.isActiveInventoryService) {
      this.getProductQtyByStaff("");
      this.getProductQtyByWarehouse("");
    }
  }
  //   CentralDairyDashboard() {
  //     this.showCustomerGraphs = false;
  //     this.showPaymentGraphs = false;
  //     this.showTicketGraphs = false;
  //     this.radiusGraph = false;
  //     this.commissionGraph = false;
  //     this.inventoryGraph = false;
  //     this.showApprovalData = false;
  //     this.leadListFlag = false;
  //     this.leadFollowupFlag = false;
  //     this.leadDashboardView = false;
  //     this.leadListForUserAndTeamFlag = false;
  //     this.showProductQtyData = true;
  //     if (this.statusCheckService.isActiveInventoryService) {
  //       this.getProductQtyByStaff("");
  //       this.getProductQtyByWarehouse("");
  //     }
  //   }
  CentralDairyDashboard() {
    this.router.navigate(["/home/taskCalendar"]);
  }
  assignedLeadListData: any;
  getAssignedLeadList(list:any) {
    let size;
    let page = this.currentPageAssignedLeadList;
    if (list) {
      size = list;
      this.assignedLeadListPageData = list;
    } else {
      size = this.assignedLeadListPageData;
    }
    const url = "/leadMaster/findAllByCurrentUser?page=" + page + "&pageSize=" + size;

    this.leadManagementService.getMethod(url).subscribe(
      async (response: any) => {
        console.log("My Lead List Response => ", response?.leadMasterList?.content);

        this.assignedLeadListData = await response?.leadMasterList?.content;

        this.assignedLeadListdatatotalRecords = await response?.leadMasterList?.totalElements;

        if (this.showItemPerPage > this.assignedLeadListPageData) {
          this.leadListDatalength = this.assignedLeadListData?.length % this.showItemPerPage;
        } else {
          this.leadListDatalength =
            this.assignedLeadListData?.length % this.assignedLeadListPageData;
        }
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

  pageChanged(pageNumber:any): void {
    this.currentPageAssignedLeadList = pageNumber;
    this.getAssignedLeadList("");
  }

  TotalItems(event:any): void {
    this.showItemPerPage = Number(event.value);
    // if (this.currentPageAssignedLeadList > 1) {
    //   this.currentPageAssignedLeadList = 1;
    // }
    this.getAssignedLeadList(this.showItemPerPage);
  }

  labelFlag: any;
  leadObj: any;
  approveOrRejectLeadPopup(lead:any, flag:any) {
    if (lead.finalApproved) {
      if (flag === "Reject") {
        setTimeout(() => {
          this.getAssignedLeadList("");
        }, 1000);

        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: "Assigned to the next staff",
          icon: "far fa-check-circle"
        });
      } else {
        // this.editLead(lead.id, lead.finalApproved);
        this.messageService.add({
          severity: "info",
          summary: "Last stage of workflow",
          detail:
            "Lead has been already prepared for 'Convert To CAF' operation. Go to 'Lead Management' screen for this.",
          icon: "far fa-check-circle"
        });
      }
    } else {
      this.approvedForLead = false;
      console.log(lead, flag);
      this.labelFlag = flag;
      this.leadObj = lead;
      if (flag === "Approve") this.leadApproveRejectDto.approveRequest = true;
      if (flag === "Reject") this.leadApproveRejectDto.approveRequest = false;

      if (this.staffid) this.leadApproveRejectDto.currentLoggedInStaffId = Number(this.staffid);
      this.leadApproveRejectDto.firstname = lead.firstname;
      this.leadApproveRejectDto.username = lead.username;
      this.leadApproveRejectDto.flag = flag;
      this.leadApproveRejectDto.status = lead.leadStatus;
      if (this.mvnoid) this.leadApproveRejectDto.mvnoId = Number(this.mvnoid);
      if (lead.serviceareaid) this.leadApproveRejectDto.serviceareaid = Number(lead.serviceareaid);
      if (lead.id) this.leadApproveRejectDto.id = Number(lead.id);
      if (lead.buId) this.leadApproveRejectDto.buId = Number(lead.buId);
      if (lead.nextTeamMappingId)
        this.leadApproveRejectDto.nextTeamMappingId = Number(lead.nextTeamMappingId);
      this.leadApproveRejectFormsubmitted = false;
      $("#approveOrRejectLeadPopup").modal("show");
    }
  }

  closeApproveOrRejectLeadPopup() {
    this.leadApproveRejectForm.reset();
    this.leadApproveRejectFormsubmitted = false;
    $("#approveOrRejectLeadPopup").modal("hide");
  }

  isFinalApproved: boolean = false;
  approveOrRejectLead(leadObject: any) {
    if (leadObject?.finalApproved) this.isFinalApproved = true;

    this.leadApproveRejectFormsubmitted = true;
    let url = "/teamHierarchy/approveLead";

    if (this.leadApproveRejectForm.valid) {
      this.leadApproveRejectDto.remark = this.leadApproveRejectForm.controls['remark'].value;

      this.customerManagementService.updateMethod(url, this.leadApproveRejectDto).subscribe(
        async (response: any) => {
          this.leadApproveRejectFormsubmitted = false;
          this.leadApproveRejectForm.reset();

          if ((await response.dataList) && (await response.dataList.length) > 0) {
            this.approveLeadList = await response.dataList;
            this.approvedForLead = true;
          } else {
            $("#approveOrRejectLeadPopup").modal("hide");

            if (this.leadApproveRejectDto.approveRequest) {
              if (response.data === "FINAL_APPROVED") {
                // this.editLead(this.leadApproveRejectDto.id, true);
                this.messageService.add({
                  severity: "info",
                  summary: "Last stage of workflow",
                  detail:
                    "Lead has been already prepared for 'Convert To CAF' operation. Go to 'Lead Management' screen for this.",
                  icon: "far fa-check-circle"
                });
              } else {
                if (response.responseMessage === "Assigned to next staff") {
                  this.getAssignedLeadList("");
                  this.messageService.add({
                    severity: "success",
                    summary: "Successfully",
                    detail: response.message,
                    icon: "far fa-check-circle"
                  });
                }
              }
            } else {
              this.getAssignedLeadList("");

              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.responseMessage,
                icon: "far fa-check-circle"
              });
            }
          }
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
  }

  approvedForLead = false;
  approveLeadList:any[] = [];
  selectStaffForLead: any = null;
  selectStaffRejectForLead: any = null;
  assignToStaffForLead(flag:any) {
    let url: any;

    if (flag == "Approve") {
      url = `/teamHierarchy/assignFromStaffListForLead?eventName=${"LEAD"}&nextAssignStaff=${
        this.selectStaffForLead
      }`;
    } else {
      url = `/teamHierarchy/assignFromStaffListForLead?eventName=${"LEAD"}&nextAssignStaff=${
        this.selectStaffRejectForLead
      }`;
    }

    this.customerManagementService.postMethod(url, this.leadApproveRejectDto).subscribe(
      async (response: any) => {
        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          console.log(await response);
          $("#approveOrRejectLeadPopup").modal("hide");
          this.getAssignedLeadList("");
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Assigned to the next staff successfully.",
            icon: "far fa-times-circle"
          });
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
        $("#approveOrRejectLeadPopup").modal("hide");
        this.getAssignedLeadList("");
      }
    );
  }

  followupCurrentPageLeadListdata = 1;
  followupLeadListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  followupLeadListdatatotalRecords: any;
  followupLeadListData: any;

  getFollowupLeadList(list:any) {
    let size;
    let page = this.followupCurrentPageLeadListdata;
    if (list) {
      size = list;
      this.followupLeadListdataitemsPerPage = list;
    } else {
      size = this.followupLeadListdataitemsPerPage;
    }

    const url = "/followUp/findAllByCurruntUser?page=" + page + "&pageSize=" + size;

    this.leadManagementService.getMethod(url).subscribe(
      async (response: any) => {
        console.log("My followup List Response => ", response?.followUpList?.content);

        this.followupLeadListData = await response?.followUpList?.content;

        this.followupLeadListdatatotalRecords = await response?.followUpList?.totalElements;

        if (this.showItemPerPage > this.followupLeadListdataitemsPerPage) {
          this.leadListDatalength = this.followupLeadListData?.length % this.showItemPerPage;
        } else {
          this.leadListDatalength =
            this.followupLeadListData?.length % this.followupLeadListdataitemsPerPage;
        }
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

  pageFollowupChanged(pageNumber:any): void {
    this.followupCurrentPageLeadListdata = pageNumber;
    this.getFollowupLeadList("");
  }

  TotalFollowupItems(event:any): void {
    this.showItemPerPage = Number(event.value);
    if (this.followupCurrentPageLeadListdata > 1) {
      this.followupCurrentPageLeadListdata = 1;
    }
    this.getFollowupLeadList(this.showItemPerPage);
  }

  followupData: any;
  requiredFollowupInfo: any;
  tempLeadId: any;
  followUpId: any;
  rescheduleRemarks: any = [];
  rescheduleFollowUp(followUpDetails:any) {
    this.followupData = followUpDetails;
    this.getReScheduleFollowUpRemarksList();
    this.generateNameOfTheReFollowUp(followUpDetails.leadMasterId);
    this.tempLeadId = followUpDetails.leadMasterId;
    this.followUpId = followUpDetails.id;
    this.reFollowupFormsubmitted = false;
    this.requiredFollowupInfo = {
      mvnoId: this.mvnoid,
      staffId: this.staffid,
      leadId: followUpDetails.leadMasterId
    };
    $("#reScheduleFollowup").modal("show");
  }

  saveReFollowup() {
    this.followupData = {};
    this.reFollowupFormsubmitted = true;
    if (this.reFollowupScheduleForm.valid) {
      this.followupData.leadMasterId = this.tempLeadId;

      this.followupData = this.reFollowupScheduleForm.value;
      this.followupData.leadMasterId = this.tempLeadId;
      const myFormattedDate = this.datePipe.transform(
        this.followupData.followUpDatetime,
        "yyyy-MM-dd HH:mm:ss"
      );
      this.followupData.followUpDatetime = myFormattedDate;
      const url =
        "/followUp/reSchedulefollowup?followUpId=" +
        this.followUpId +
        "&remarks=" +
        this.followupData.remarksTemp;
      this.leadManagementService
        .postMethod(url, this.followupData, this.mvnoid, this.staffid)
        .subscribe(
          (response: any) => {
            this.reFollowupFormsubmitted = false;
            this.reFollowupScheduleForm.reset();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            $("#reScheduleFollowup").modal("hide");
            this.reFollowupFormsubmitted = false;
            this.getFollowupLeadList("");
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
      this.reFollowupFormsubmitted = false;
    }
  }

  closeReFolloupPopup() {
    this.reFollowupFormsubmitted = false;
    $("#reScheduleFollowup").modal("hide");
    this.reFollowupScheduleForm.reset();
  }

  generatedNameOfTheReFollowUp: any;
  generateNameOfTheReFollowUp(leadId:any) {
    const url = "/followUp/generateNameOfTheFollowUp/" + leadId;

    this.leadManagementService.getMethod(url).subscribe(
      async (response: any) => {
        console.log("Generated followup name response => ", await response);
        this.generatedNameOfTheReFollowUp = await response.generatedNameOfTheFollowUp;
        console.log(this.generatedNameOfTheReFollowUp);
        this.generatedNameOfTheReFollowUp
          ? this.reFollowupScheduleForm.controls["followUpName"].setValue(
              this.generatedNameOfTheReFollowUp
            )
          : "";
      },
      async (error: any) => {
        console.log("Generated followup name error => ", await error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong with 'followup name.' Generation",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  makeACall() {
    this.messageService.add({
      severity: "info",
      summary: "Call configure",
      detail: "Sorry! Please configure call client first..",
      icon: ""
    });
  }

  closeFollowUp(followUpDetails:any) {
    this.closeFollowupFormsubmitted = false;
    this.followUpId = followUpDetails.id;
    $("#closeFollowup").modal("show");
  }

  closeActionFolloupPopup() {
    $("#closeFollowup").modal("hide");
  }

  saveCloseFollowUp() {
    this.closeFollowupFormsubmitted = true;
    if (this.closeFollowupForm.valid) {
      var closeData = this.closeFollowupForm.value;

      const url =
        "/followUp/closefollowup?followUpId=" +
        this.followUpId +
        "&remarks=" +
        this.closeFollowupForm.get("remarks").value;
      this.leadManagementService.getMethod(url).subscribe(
        (response: any) => {
          $("#closeFollowup").modal("hide");
          this.closeFollowupForm.reset();

          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          this.getFollowupLeadList("");
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
      this.closeFollowupFormsubmitted = false;
    }
  }

  getReScheduleFollowUpRemarksList() {
    const url = "/findAll/reScheduleFollowUpRemarks";
    this.leadManagementService.getMethodCMS(url).subscribe(
      async (response: any) => {
        this.rescheduleRemarks = await response.rescheduleFollowupRemarkList[0].split(",");
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

  leadListPageForUserAndTeam = 1;
  leadListItemsPerPageForUserAndTeam = RadiusConstants.ITEMS_PER_PAGE;
  leadListTotalRecordsForUserAndTeam: any;
  leadListForUserAndTeam: any;

  getAllLeadsByCurrentUserTeamLead(list:any) {
    let size;
    let page = this.leadListPageForUserAndTeam;
    if (list) {
      size = list;
      this.leadListItemsPerPageForUserAndTeam = list;
    } else {
      size = this.leadListItemsPerPageForUserAndTeam;
    }

    const url = "/leadMaster/findAllByCurrentUserTeamLead?page=" + page + "&pageSize=" + size;

    this.leadManagementService.getMethod(url).subscribe(
      async (response: any) => {
        console.log("My leadMaster List Response => ", response?.followUpList?.content);

        this.leadListForUserAndTeam = await response?.leadMasterList?.content;

        this.leadListTotalRecordsForUserAndTeam = await response?.leadMasterList?.totalElements;

        if (this.showItemPerPage > this.leadListItemsPerPageForUserAndTeam) {
          this.leadListDatalength = this.leadListForUserAndTeam?.length % this.showItemPerPage;
        } else {
          this.leadListDatalength =
            this.leadListForUserAndTeam?.length % this.leadListItemsPerPageForUserAndTeam;
        }
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

  pageChangedLeadListForUserAndTeam(pageNumber:any): void {
    this.leadListPageForUserAndTeam = pageNumber;
    this.getAllLeadsByCurrentUserTeamLead("");
  }

  totalLeadListForUserAndTeamItems(event:any): void {
    this.showItemPerPage = Number(event.value);
    if (this.leadListPageForUserAndTeam > 1) {
      this.leadListPageForUserAndTeam = 1;
    }
    this.getAllLeadsByCurrentUserTeamLead(this.showItemPerPage);
  }

  followupListPageForUserAndTeam = 1;
  followupListItemsPerPageForUserAndTeam = RadiusConstants.ITEMS_PER_PAGE;
  followupListTotalRecordsForUserAndTeam: any;
  followupListForUserAndTeam: any;

  getAllfollowupsByCurrentUserTeamfollowup(list:any) {
    let size;
    let page = this.followupListPageForUserAndTeam;
    if (list) {
      size = list;
      this.followupListItemsPerPageForUserAndTeam = list;
    } else {
      size = this.followupListItemsPerPageForUserAndTeam;
    }

    const url = "/followUp/findAllByCurruntUserAndTeam?page=" + page + "&pageSize=" + size;

    this.leadManagementService.getMethod(url).subscribe(
      async (response: any) => {
        console.log("My followup List Response => ", response?.followUpList?.content);

        this.followupListForUserAndTeam = await response?.followUpList?.content;

        this.followupListTotalRecordsForUserAndTeam = await response?.followUpList?.totalElements;

        if (this.showItemPerPage > this.followupListItemsPerPageForUserAndTeam) {
          this.leadListDatalength = this.followupListForUserAndTeam?.length % this.showItemPerPage;
        } else {
          this.leadListDatalength =
            this.followupListForUserAndTeam?.length % this.followupListItemsPerPageForUserAndTeam;
        }
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

  pageChangedfollowupListForUserAndTeam(pageNumber:any): void {
    this.followupListPageForUserAndTeam = pageNumber;
    this.getAllfollowupsByCurrentUserTeamfollowup("");
  }

  totalfollowupListForUserAndTeamItems(event:any): void {
    this.showItemPerPage = Number(event.value);
    if (this.followupListPageForUserAndTeam > 1) {
      this.followupListPageForUserAndTeam = 1;
    }
    this.getAllfollowupsByCurrentUserTeamfollowup(this.showItemPerPage);
  }

  rejectCustomerDocumentOpen(partnerBalanceId:any, nextApproverId:any) {
    this.reject = false;
    this.selectStaff = null;
    this.rejectCAF = [];
    $("#rejectCustomerCAFModal").modal("show");
    this.customerDocumentId = partnerBalanceId;
    this.nextApproverId = nextApproverId;
  }

  approveCustomerDocumentOpen(partnerBalanceId:any, nextApproverId:any) {
    this.approved = false;
    this.selectStaff = null;
    this.approveCAF = [];
    $("#assignCustomerCAFModal").modal("show");
    this.customerDocumentId = partnerBalanceId;
    this.nextApproverId = nextApproverId;
  }
  ifApproveSPMStatus = false;
  approveRejectSPMRemark = "";
  apprRejectSPMData: any = [];
  assignStaffListDataSPM:any[] = [];
  assignedStaffSPM: any;
  staffIDSPM: number;
  mvnoIdSPM: number;
  viewPlanMappingData: any;
  approvestatusSPMModalOpen(data:any) {
    this.ifApproveSPMStatus = true;
    this.apprRejectSPMData = data;
    this.approveRejectSPMRemark = "";
    $("#ApproveRejectModal").modal("show");
  }

  rejectstatusSPMModalOpen(data:any) {
    this.ifApproveSPMStatus = false;
    this.apprRejectSPMData = data;
    this.approveRejectSPMRemark = "";
    $("#ApproveRejectModal").modal("show");
  }
  statusApporevedRejectedSPM() {
    const url1 = "/custspecialplanrelmapping/" + this.apprRejectSPMData.id;
    this.dashboardService.getMethod(url1).subscribe((response: any) => {
      this.viewPlanMappingData = response.mapping;
    });
    setTimeout(() => {
      let mappingData;
      if (this.viewPlanMappingData.planGroupMapping) {
        this.viewPlanMappingData.planGroupMapping.map((e:any) => {
          e.nextStaff = this.apprRejectSPMData.nextStaff;
        });
        mappingData = {
          id: this.apprRejectSPMData.id,
          name: this.apprRejectSPMData.name,
          mvnoIdSPM: this.mvnoIdSPM,
          planGroupMapping: this.viewPlanMappingData.planGroupMapping,
          status: this.apprRejectSPMData.status,
          flag: this.ifApproveSPMStatus ? "approved" : "rejected",
          remarks: this.approveRejectSPMRemark,
          nextStaff: this.apprRejectSPMData.nextStaff
        };
      } else {
        this.viewPlanMappingData.planMapping.map((e:any) => {
          e.nextStaff = this.apprRejectSPMData.nextStaff;
        });
        mappingData = {
          id: this.apprRejectSPMData.id,
          name: this.apprRejectSPMData.name,
          mvnoIdSPM: this.mvnoIdSPM,
          planMapping: this.viewPlanMappingData.planMapping,
          status: this.apprRejectSPMData.status,
          flag: this.ifApproveSPMStatus ? "approved" : "rejected",
          remarks: this.approveRejectSPMRemark,
          nextStaff: this.apprRejectSPMData.nextStaff
        };
      }
      const url = `/approveSpecialPlan`;
      this.dashboardService.updateMethod(url, mappingData).subscribe(
        (response: any) => {
          if (response.dataList != null && response.dataList.length > 0) {
            this.assignStaffListDataSPM = response.dataList;
            $("#ApproveRejectModal").modal("hide");
            $("#assignCustomerDocumentForApproval").modal("show");
          } else {
            $("#ApproveRejectModal").modal("hide");
            this.getSpecialPlanMappingApprovals("");
          }
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
    }, 1000);
  }
  assignToStaffSPMapping() {
    let url = "";
    if (this.assignedStaffSPM) {
      url = `/teamHierarchy/assignFromStaffList?entityId=${this.apprRejectSPMData.id}&eventName=SPACIAL_PLAN_MAPPING&nextAssignStaff=${this.assignedStaffSPM}&isApproveRequest=${this.ifApproveSPMStatus}`;
    } else {
      url = `/teamHierarchy/assignEveryStaff?entityId=${
        this.apprRejectSPMData.id
      }&eventName=${"SPACIAL_PLAN_MAPPING"}&isApproveRequest=${this.ifApproveSPMStatus}`;
    }
    this.dashboardService.getMethod(url).subscribe(
      response => {
        $("#assignCustomerDocumentForApproval").modal("hide");
        if (this.ifApproveSPMStatus) {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Approved Successfully.",
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Rejected Successfully.",
            icon: "far fa-times-circle"
          });
        }
        this.getSpecialPlanMappingApprovals("");
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }
}
