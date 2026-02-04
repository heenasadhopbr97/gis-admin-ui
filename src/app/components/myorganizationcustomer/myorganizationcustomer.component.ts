import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomermanagementService } from "src/app/service/customermanagement.service";

// import * as FileSaver from "file-saver";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { BehaviorSubject } from "rxjs";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { InvoiceDetailsService } from "src/app/service/invoice-details.service";
import { InvoicePaymentListService } from "src/app/service/invoice-payment-list.service";
import { RecordPaymentService } from "src/app/service/record-payment.service";

import { LiveUserService } from "src/app/service/live-user.service";
import { InvoiceDetalisModelComponent } from "../invoice-detalis-model/invoice-detalis-model.component";
import { InvoicePaymentDetailsModalComponent } from "../invoice-payment-details-modal/invoice-payment-details-modal.component";

import { CustomerplanGroupDetailsModalComponent } from "src/app/components/customerplan-group-details-modal/customerplan-group-details-modal.component";
import { AREA, CITY, COUNTRY, PINCODE, STATE } from "src/app/RadiusUtils/RadiusConstants";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { WorkflowAuditDetailsModalComponent } from "../workflow-audit-details-modal/workflow-audit-details-modal.component";
import { SystemconfigService } from "../../service/systemconfig.service";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";
import { PartnerService } from "src/app/service/partner.service";
import { SETTINGS } from "src/app/constants/aclConstants";
declare var $: any;

@Component({
    selector: "app-myorganizationcustomer",
    templateUrl: "./myorganizationcustomer.component.html",
    styleUrls: ["./myorganizationcustomer.component.css"],
    standalone: false
})
export class MyorganizationcustomerComponent implements OnInit {
  public loginService: LoginService;
  AclClassConstants:any;
  AclConstants:any;
  remark: any;
  walletAccess: boolean = false;
  ledgerAccess: boolean = false;
  invoiceAccess: boolean = false;
assignPLANsubmitted: any;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private customerManagementService: CustomermanagementService,
    public partnerService: PartnerService,
    public KeyannaCommonBaseService: KeyannaCommonBaseService,
    private revenueManagementService: RevenueManagementService,
    public datepipe: DatePipe,
    private recordPaymentService: RecordPaymentService,
    private invoiceDetailsService: InvoiceDetailsService,
    private liveUserService: LiveUserService,
    public PaymentamountService: PaymentamountService,
    public invoicePaymentListService: InvoicePaymentListService,
    public systemService: SystemconfigService,
    loginService: LoginService,
    public commondropdownService: CommondropdownService
  ) {
    let staffID = localStorage.getItem("userId");
    this.staffID = Number(staffID);
    this.invoiceAccess = loginService.hasPermission(SETTINGS.ORGANIZATION__INVOICES);
    this.ledgerAccess = loginService.hasPermission(SETTINGS.ORGANIZATION__LEDGER);
    this.walletAccess = loginService.hasPermission(SETTINGS.ORGANIZATION__WALLET);
    this.loginService = loginService;
    this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
      this.currency = res.data.value;
    });
  }
  countryTitle = COUNTRY;
  cityTitle = CITY;
  stateTitle = STATE;
  pincodeTitle = PINCODE;
  areaTitle = AREA;
  auditcustid = new BehaviorSubject({
    auditcustid: "",
    checkHierachy: "",
    planId: "",
  });
  assignPLANForm: FormGroup;
  @ViewChild(InvoiceDetalisModelComponent)
  InvoiceDetailModal: InvoiceDetalisModelComponent;

  @ViewChild(InvoicePaymentDetailsModalComponent)
  invoicePaymentDetailModal: InvoicePaymentDetailsModalComponent;

  @ViewChild(CustomerplanGroupDetailsModalComponent)
  custPlanGroupDataModal: CustomerplanGroupDetailsModalComponent;
  @ViewChild(WorkflowAuditDetailsModalComponent)
  workFlowAuditModal: WorkflowAuditDetailsModalComponent;

  paymappingItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  payMappinftotalRecords: String;
  currentPagePayMapping = 1;

  overChargeListItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  overChargeListtotalRecords: String;
  currentPageoverChargeList = 1;

  uploadDocumentListItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  uploadDocumentListtotalRecords: String;
  currentPageoverUploadDocumentList = 1;

  custMacMapppingListtemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custMacMapppingListtotalRecords: String;
  currentPagecustMacMapppingList = 1;

  custLedgerItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custLedgertotalRecords: any;
  currentPagecustLedgerList = 1;

  custChargeDeatilItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custChargeDeatiltotalRecords: String;
  currentPagecustChargeDeatilList = 1;

  custPlanDeatilItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custPlanDeatiltotalRecords: any;
  currentPagecustPlanDeatilList = 1;

  custMacAddItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custMacAddtotalRecords: String;
  currentPagecustMacAddList = 1;

  customerLedgerDetailData: any = [];
  customertotalRecords = 1;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPage = 1;
  searchkey: string;
  searchData: any = [];
  listView = true;
  isInvoiceDetail = false;
  custID: number;

  custLedgerForm: FormGroup;
  custLedgerSubmitted = false;
  // fieldEnable = false;

  ifMyInvoice = false;
  searchInvoiceMasterFormGroup: FormGroup;
  currentPageinvoiceMasterSlab = 1;
  invoiceMasteritemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  invoiceMastertotalRecords: number;
  searchInvoiceData: any;
  invoiceMasterListData: any = [];
  isInvoiceSearch = false;

  showItemPerPageInvoice = 1;
  InvoiceDATA = new BehaviorSubject({
    InvoiceDATA: "",
  });

  invoiceId = new BehaviorSubject({
    invoiceId: "",
  });

  planGroupcustid = new BehaviorSubject({
    planGroupcustid: "",
  });

  partnerDATA: any = [];
  presentAdressDATA: any = [];
  permentAdressDATA: any = [];
  paymentAdressDATA: any = [];
  chargeDATA:any[] = [];
  dataPlan:any[] = [];
  postpaidplanData: any;
  serviceAreaDATA: any;
  paymentData: any;
  paymentDataamount: any;
  paymentDatareferenceno: any;
  paymentDatapaymentdate: any;
  paymentDatapaymentMode: any;
  FinalAmountList: any = [];
  paymentAddressData: any = [];
  permanentAddressData: any = [];

  customerBill: "";
  planGroupName: "";
  isInvoiceToOrg: any = false;
  ifIndividualPlan: boolean = false;
  ifModelIsShow: boolean = false;
  ifPlanGroup: boolean = false;
  dataChargePlan:any[] = [];
  custInvoiceToOrg: boolean;

  startDateCustLedger: any = "";
  endDateCustLedger: any = "";
  customerLedgerData: any = [];
  customerLedgerListData: any = [];
  legershowItemPerPage = 1;

  postdata: any = {
    CREATE_DATE: "",
    END_DATE: "",
    id: "",
    amount: "",
    balAmount: "",
    custId: "",
    description: "",
    refNo: "",
    transcategory: "",
    transtype: "",
  };
  customerLedgerSearchKey: string;
  isCustomerLedgerOpen = false;
  ifWalletMenu = false;
  getWallatData: any = [];
  isCustomerDetailOpen = false;
  isCustomerDetailSubMenu = false;

  searchDeatil = "";
  searchOption: "";
  customerListDataselector: any = [];

  currentPagecustomerListdata = 1;
  customerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerListdatatotalRecords: any;
  customerListData: any = [];
  viewcustomerListData: any = [];
  searchkey2 = "";
  searchOptionSelect: any = [];
  staffList: any = [];
  approve = false;
  // reject = false;
  selectedStaff: number;
  assignStaffForm: FormGroup;
  currentPageAudit: any;
  itemsPerPageAudit: any;
  workflowAuditData: any[];
  MastertotalRecords: any;
  currency: string;
  customerData:any[] = [];
  custQuotaList: any = [];
  custQuotaListItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custQuotaListtotalRecords: String;
  currentPagecustQuotaList = 1;
  custFullAddress = "";

  invoicePaymentData:any[] = [];
  invoiceID = "";
  invoicePaymentItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  currentPageinvoicePaymentList = 1;
  invoicePaymenttotalRecords: number;
  ifInvoicePayment = false;

  totaladjustedAmount = 0;
  allchakedPaymentData:any[] = [];
  ispaymentChecked = false;
  allIsChecked = false;
  isSinglepaymentChecked = false;

  //// ..........////
  isInvoiceChecked = false;
  allInvoiceChecked = false;
  chakedInvoiceData:any[] = [];
  isSingleInChecked = false;
  staffID: any;
  ngOnInit(): void {
    this.assignStaffForm = this.fb.group({
      staffId: [""],
      remark: ["", Validators.required],
      invoiceId: [""],
    });
    this.custLedgerForm = this.fb.group({
      startDateCustLedger: ["", Validators.required],
      endDateCustLedger: ["", Validators.required],
    });

    this.searchInvoiceMasterFormGroup = this.fb.group({
      billfromdate: [""],
      billrunid: [""],
      billtodate: [""],
      custMobile: ["", Validators.minLength(3)],
      custname: [""],
      docnumber: [""],
      customerid: [""],
      staffId: [""],
      branchId: [""],
      businessunit: [""],
      planId: [""],
      serviceId: [""],
    });
    this.assignPLANForm = this.fb.group({
      remark: [""],
    });

    this.paymentFormGroup = this.fb.group({
      amount: ["", [Validators.required, Validators.min(1)]],
      customerid: ["", Validators.required],
      // paymentdate: [""],
      paymentreferenceno: [""],
      paymode: ["Credit Note"],
      referenceno: ["", Validators.required],
      remark: ["", Validators.required],
      invoiceId: ["", Validators.required],
      type: ["creditnote"],
      paytype: ["creditnote"],
    });
    // customer get data
    this.getcustomerList("");
    this.getCustomer();
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
  }

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPagecustomerListdata > 1) {
      this.currentPagecustomerListdata = 1;
    }
    if (!this.searchkey) {
      this.getcustomerList(this.showItemPerPage);
    } else {
      this.searchcustomer();
    }
  }

  pageChangedcustomerList(pageNumber:any) {
    this.currentPagecustomerListdata = pageNumber;
    if (this.searchkey) {
      this.searchcustomer();
    } else {
      this.getcustomerList("");
    }
  }

  searchcustomer() {
    if (
      (!this.searchkey && !this.searchkey2) ||
      this.searchkey !== this.searchDeatil.trim() ||
      this.searchkey2 !== this.searchOption.trim()
    ) {
      this.currentPagecustomerListdata = 1;
    }
    this.searchkey = this.searchDeatil.trim();
    this.searchkey2 = this.searchOption.trim();

    if (this.showItemPerPage !== 1) {
      this.customerListdataitemsPerPage = this.showItemPerPage;
    }

    this.searchData.filters[0].filterValue = this.searchDeatil.trim();
    this.searchData.filters[0].filterColumn = this.searchOption.trim();
    this.searchData.page = this.currentPagecustomerListdata;
    this.searchData.pageSize = this.customerListdataitemsPerPage;
    const url = "/customers/search/" + RadiusConstants.CUSTOMER_TYPE.PREPAID;
    // console.log("this.searchData", this.searchData)
    this.customerManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.customerListData = response.customerList;
        const usernameList: string[] = [];
        this.customerListData.forEach((element:any) => {
          usernameList.push(element.username);
        });

        this.liveUserService
          .postMethod("/liveUser/isCustomersOnlineOrOffline", {
            users: usernameList,
          })
          .subscribe((res: any) => {
            const liveUsers: string[] = res.liveusers;
            this.customerListData.forEach((element:any) => {
              if (liveUsers.findIndex(e => e == element.username) < 0) {
                element.connectionMode = "Offline";
              } else {
                element.connectionMode = "Online";
              }
            });
          });
        this.customerListdatatotalRecords = response.pageDetails.totalRecords;
      },
      (error: any) => {
        this.customerListdatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
          this.customerListData = [];
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

  closeParentCustt() {
    this.ifModelIsShow = false;
  }

  clearSearchcustomer() {
    this.getcustomerList("");
    this.searchDeatil = "";
    this.searchOption = "";
    // this.fieldEnable = false;
    this.currentPagecustomerListdata = 1;
  }

  getcustomerList(list:any) {
    let size;
    this.searchkey = "";
    this.searchkey2 = "";
    const page = this.currentPagecustomerListdata;
    if (list) {
      size = list;
      this.customerListdataitemsPerPage = list;
    } else {
      size = this.customerListdataitemsPerPage;
    }

    let data1 = [];
    let data2 = [];

    const url = `/customers/list/` + RadiusConstants.CUSTOMER_TYPE.POSTPAID + "?orgcusttype=true";

    const custerlist = {};
    this.customerManagementService.postMethod(url, custerlist).subscribe((response: any) => {
      data2 = response.customerList;
      this.customerListData.push(...data2);

      const url2 = `/customers/list/` + RadiusConstants.CUSTOMER_TYPE.PREPAID + "?orgcusttype=true";
      const data = {};
      this.customerManagementService.postMethod(url2, data).subscribe((response: any) => {
        data1 = response.customerList;
        // .filter((cust) => cust.id == 2);
        this.customerListData.push(...data1);

        if (this.customerListData.length > 1) {
          const usernameList: string[] = [];
          this.customerListData.forEach((element:any) => {
            usernameList.push(element.username);
          });

          this.liveUserService
            .postMethod("/liveUser/isCustomersOnlineOrOffline", {
              users: usernameList,
            })
            .subscribe((res: any) => {
              const liveUsers: string[] = res.liveusers;
              this.customerListData.forEach((element:any) => {
                if (liveUsers.findIndex(e => e == element.username) < 0) {
                  element.connectionMode = "Offline";
                } else {
                  element.connectionMode = "Online";
                }
              });
            });

          this.customerListDataselector = this.customerListData;
          this.customerListdatatotalRecords = this.customerListData.length;
        }
      });
    });
  }
  TotalLedgerItemPerPage(event:any) {
    this.legershowItemPerPage = Number(event.value);
    if (this.currentPagecustLedgerList > 1) {
      this.currentPagecustLedgerList = 1;
    }
    if (!this.customerLedgerSearchKey) {
      this.getCustomersLedger(this.customerLedgerDetailData.id, this.legershowItemPerPage);
    } else {
      this.searchCustomerLedger();
    }
  }

  pageChangedcustledgerList(pageNumber:any) {
    this.currentPagecustLedgerList = pageNumber;
    this.getCustomersLedger(this.customerLedgerDetailData.id, "");
  }

  listCustomer() {
    this.listView = true;
    this.isCustomerDetailOpen = false;
    this.isCustomerDetailSubMenu = false;
    this.isCustomerLedgerOpen = false;
    this.ifMyInvoice = false;
    this.ifWalletMenu = false;
  }

  customerDetailOpen(custId:any) {
    this.isCustomerDetailOpen = true;
    this.isCustomerDetailSubMenu = true;
    this.isCustomerLedgerOpen = false;
    this.getCustomersDetail(custId);
    this.ifMyInvoice = false;
    this.ifWalletMenu = false;
    this.listView = false;
    // this.getCustQuotaList(custId)
  }
  getCustomer() {
    const url = "/customers/list";
    const custerlist = {};
    this.recordPaymentService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        this.customerData = response.customerList;
        // this.paymentFormGroup.patchValue({
        //   customerid: this.customerLedgerDetailData.id,
        // });
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

  customerLedgerOpen() {
    this.isCustomerDetailOpen = false;
    this.isCustomerDetailSubMenu = true;
    this.isCustomerLedgerOpen = true;
    this.ifWalletMenu = false;
    this.listView = false;
    this.ifMyInvoice = false;
  }

  getCustomersLedger(custId:any, size:any) {
    let page_list;
    this.customerLedgerSearchKey = "";
    if (size) {
      page_list = size;
      this.custLedgerItemPerPage = size;
    } else {
      if (this.legershowItemPerPage == 1) {
        this.custLedgerItemPerPage = this.pageITEM;
      } else {
        this.custLedgerItemPerPage = this.legershowItemPerPage;
      }
    }
    const url = "/customerLedgers";
    this.postdata.custId = custId;
    this.revenueManagementService.postMethod(url, this.postdata).subscribe(
      (response: any) => {
        this.customerLedgerData = response.customerLedgerDtls;
        this.customerLedgerListData =
          response.customerLedgerDtls.customerLedgerInfoPojo.debitCreditDetail;
        // console.log("this.customerLedgerData", this.customerLedgerData);
        this.customerLedgerOpen();
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

  pageChangedcustChargeDetailList(pageNumber:any) {
    this.currentPagecustChargeDeatilList = pageNumber;
  }

  pageChangedcustPlanDetailList(pageNumber:any) {
    this.currentPagecustPlanDeatilList = pageNumber;
  }

  pageChangedcustMacAddDetailList(pageNumber:any) {
    this.currentPagecustMacAddList = pageNumber;
  }

  getCustomersDetail(custId:any) {
    this.presentAdressDATA = [];
    this.permentAdressDATA = [];
    this.paymentAdressDATA = [];
    this.partnerDATA = [];
    this.chargeDATA = [];
    let plandatalength = 0;
    const chargeLength = 0;
    this.paymentDataamount = "";
    this.paymentDatareferenceno = "";
    this.paymentDatapaymentdate = "";
    this.paymentDatapaymentMode = "";
    this.FinalAmountList = [];

    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.customerLedgerDetailData = response.customers;

        if (response.customers.creditDocuments.length !== 0) {
          this.paymentDataamount = response.customers.creditDocuments[0].amount;
          this.paymentDatareferenceno = response.customers.creditDocuments[0].referenceno;
          this.paymentDatapaymentdate = response.customers.creditDocuments[0].paymentdate;
          this.paymentDatapaymentMode = response.customers.creditDocuments[0].paymode;
        }
        if (response.customers.addressList.length > 1) {
          const paymentaddressType = response.customers.addressList.filter(
            (key:any) => key.addressType === "Payment"
          );
          if (paymentaddressType) {
            this.paymentAddressData = paymentaddressType;
          } else {
            this.paymentAddressData = {
              fullAddress: "",
            };
          }
          const permanentaddressType = response.customers.addressList.filter(
            (key:any) => key.addressType === "Permanent"
          );
          if (permanentaddressType) {
            this.permanentAddressData = permanentaddressType;
          } else {
            this.permanentAddressData = {
              fullAddress: "",
            };
          }
        }

        // partner Name
        if (this.customerLedgerDetailData.partnerid) {
          const partnerurl = "/partner/" + this.customerLedgerDetailData.partnerid;
          this.partnerService.getMethodNew(partnerurl).subscribe((response: any) => {
            this.partnerDATA = response.partnerlist.name;
          });
        }

        // serviceArea Name
        if (this.customerLedgerDetailData.serviceareaid) {
          const serviceareaurl = "/serviceArea/" + this.customerLedgerDetailData.serviceareaid;
          this.KeyannaCommonBaseService.get(serviceareaurl).subscribe((response: any) => {
            this.serviceAreaDATA = response.data.name;
          });
        }

        // Address
        if (this.customerLedgerDetailData.addressList) {
          this.custFullAddress = this.customerLedgerDetailData.addressList[0].fullAddress;
          if (this.customerLedgerDetailData.addressList[0].addressType) {
            const areaurl = "/area/" + this.customerLedgerDetailData.addressList[0].areaId;

            this.KeyannaCommonBaseService.get(areaurl).subscribe((response: any) => {
              this.presentAdressDATA = response.data;
            });
          }
        }
        if (this.customerLedgerDetailData.addressList.length > 1) {
          let j = 0;
          while (j < this.customerLedgerDetailData.addressList.length) {
            const addres1 = this.customerLedgerDetailData.addressList[j].addressType;
            if (addres1) {
              if ("Payment" == addres1) {
                const areaurl = "/area/" + this.customerLedgerDetailData.addressList[j].areaId;
                this.KeyannaCommonBaseService.get(areaurl).subscribe((response: any) => {
                  this.paymentAdressDATA = response.data;
                });
              } else {
                const areaurl = "/area/" + this.customerLedgerDetailData.addressList[j].areaId;
                this.KeyannaCommonBaseService.get(areaurl).subscribe((response: any) => {
                  this.permentAdressDATA = response.data;
                });
              }
            }
            j++;
          }
        }

        if (this.customerLedgerDetailData.planMappingList.length > 0) {
          this.customerLedgerDetailData.planMappingList.reverse();
          this.customerBill = this.customerLedgerDetailData.planMappingList[0].billTo;
          this.custInvoiceToOrg = this.customerLedgerDetailData.planMappingList[0].isInvoiceToOrg;
        }
        if (this.customerLedgerDetailData.plangroupid) {
          this.ifIndividualPlan = false;
          this.ifPlanGroup = true;
          const planGroupurl =
            "/findPlanGroupById?planGroupId=" + this.customerLedgerDetailData.plangroupid;

          this.customerManagementService.getMethod(planGroupurl).subscribe((response: any) => {
            this.planGroupName = response.planGroup.planGroupName;
          });
        } else {
          this.ifIndividualPlan = true;
          this.ifPlanGroup = false;
          // this.planMappingList = this.customerLedgerDetailData.planMappingList;
          while (plandatalength < this.customerLedgerDetailData.planMappingList.length) {
            const planId = this.customerLedgerDetailData.planMappingList[plandatalength].planId;
            let discount;
            if (
              this.customerLedgerDetailData.planMappingList[plandatalength].discount == null ||
              this.customerLedgerDetailData.planMappingList[plandatalength].discount == ""
            ) {
              discount = 0;
            } else {
              discount = this.customerLedgerDetailData.planMappingList[plandatalength].discount;
            }

            const planurl = "/postpaidplan/" + planId;
            this.customerManagementService.getMethod(planurl).subscribe((response: any) => {
              this.dataPlan.push(response.postPaidPlan);
              // console.log("dataPlan", this.dataPlan);
            });

            this.customerManagementService
              .getofferPriceWithTax(planId, discount)
              .subscribe((response: any) => {
                if (response.result.finalAmount) {
                  this.FinalAmountList.push(response.result.finalAmount);
                } else {
                  this.FinalAmountList.push(0);
                }
              });
            plandatalength++;
          }
        }

        // charger Data
        if (this.customerLedgerDetailData.indiChargeList.length > 0) {
          this.customerLedgerDetailData.indiChargeList.forEach((element:any, k:any) => {
            if (element.planid) {
              const url = "/postpaidplan/" + element.planid;
              this.customerManagementService.getMethod(url).subscribe((response: any) => {
                this.dataChargePlan.push(response.postPaidPlan);
              });
            }
          });
        }

        this.customerManagementService
          .getCustQuotaList(this.customerLedgerDetailData.id)
          .subscribe((response: any) => {
            this.custQuotaList = response.custQuotaList;
          });

        // console.log("this.paymentAddressData", this.paymentAddressData);
        // console.log("this.permanentAddressData", this.permanentAddressData);
        // console.log("this.customerLedgerDetailData", this.customerLedgerDetailData);
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

  getCustPlanGroupDataopen(id:any, planGroupcustid:any) {
    this.PaymentamountService.show(id);
    this.planGroupcustid.next({
      planGroupcustid,
    });
  }

  searchCustomerLedger() {
    if (
      !this.customerLedgerSearchKey ||
      this.customerLedgerSearchKey !== this.custLedgerForm.value
    ) {
      this.currentPagecustLedgerList = 1;
    }
    this.customerLedgerSearchKey = this.custLedgerForm.value;

    if (this.legershowItemPerPage == 1) {
      this.custLedgerItemPerPage = this.pageITEM;
    } else {
      this.custLedgerItemPerPage = this.legershowItemPerPage;
    }

    this.custLedgerSubmitted = true;
    if (this.custLedgerForm.valid) {
      this.postdata.CREATE_DATE = this.custLedgerForm.controls['startDateCustLedger'].value;
      this.postdata.END_DATE = this.custLedgerForm.controls['endDateCustLedger'].value;
    }
    this.getCustomersLedger(this.customerLedgerData.custId, "");
  }

  clearSearchCustomerLedger() {
    this.postdata.CREATE_DATE = "";
    this.postdata.END_DATE = "";
    this.custLedgerForm.controls['startDateCustLedger'].setValue("");
    this.custLedgerForm.controls['endDateCustLedger'].setValue("");
    this.custLedgerSubmitted = false;
    this.getCustomersLedger(this.customerLedgerData.custId, "");
  }

  selSearchOption(event:any) {
    this.searchDeatil = "";
    // console.log("value", event.value);
    // if (event.value) {
    //   this.fieldEnable = true;
    // } else {
    //   this.fieldEnable = false;
    // }
  }

  openMyInvoice(id:any) {
    this.isCustomerDetailOpen = false;
    this.isCustomerLedgerOpen = false;
    this.isCustomerDetailSubMenu = true;
    this.ifMyInvoice = true;
    this.searchinvoiceMaster(id, "");
    this.commondropdownService.getAllActiveBranch();
    this.commondropdownService.getAllActiveStaff();
    this.commondropdownService.getplanservice();
    this.commondropdownService.getPostpaidplanData();
    this.commondropdownService.getBusinessUnitList();
    this.ifWalletMenu = false;
    this.listView = false;
  }

  openInvoiceModal(id:any, invoice:any) {
    // this.invoiceDetailsService.show(id);
    this.isInvoiceDetail = true;
    this.invoiceID = invoice.id;
    this.custID = invoice.custid;
  }
  closeInvoiceDetails() {
    this.isInvoiceDetail = false;
    this.invoiceID = "";
    this.custID = 0;
  }
  openInvoicePaymentModal(id:any, invoiceId:any) {
    this.invoicePaymentListService.show(id);
    this.invoiceId.next({
      invoiceId,
    });
  }
  pageChangedinvoiceMasterList(pageNumber:any) {
    this.currentPageinvoiceMasterSlab = pageNumber;
    this.searchinvoiceMaster("", "");
  }
  TotalItemPerPageInvoice(event:any) {
    this.showItemPerPageInvoice = Number(event.value);
    if (this.currentPageinvoiceMasterSlab > 1) {
      this.currentPageinvoiceMasterSlab = 1;
    }
    this.searchinvoiceMaster("", this.showItemPerPageInvoice);
  }

  searchInvoices() {
    this.currentPageinvoiceMasterSlab = 1;
    this.searchinvoiceMaster("", "");
  }

  searchinvoiceMaster(id:any, size:any) {
    let page_list;
    if (size) {
      page_list = size;
      this.invoiceMasteritemsPerPage = size;
    } else {
      if (this.showItemPerPageInvoice == 1) {
        this.invoiceMasteritemsPerPage = this.pageITEM;
      } else {
        this.invoiceMasteritemsPerPage = this.showItemPerPageInvoice;
      }
    }

    let url;

    // if (id) {
    //   this.searchInvoiceMasterFormGroup.value.billrunid = id
    //   this.searchInvoiceMasterFormGroup.patchValue({
    //     billrunid: Number(id),
    //   })
    // }

    const dtoData = {
      page: this.currentPageinvoiceMasterSlab,
      pageSize: this.invoiceMasteritemsPerPage,
    };

    this.searchInvoiceMasterFormGroup.value.custMobile = "";
    this.searchInvoiceMasterFormGroup.value.customerid = this.customerLedgerDetailData.id;
    this.searchkey = "";
    Object.keys(this.searchInvoiceMasterFormGroup.value).forEach(key => {
      if (
        this.searchInvoiceMasterFormGroup.value[key] !== null ||
        this.searchInvoiceMasterFormGroup.value[key] !== ""
      ) {
        console.log("value:::" + this.searchInvoiceMasterFormGroup.value[key]);
        console.log("key::::" + key);
        this.searchkey += `&${key}=${this.searchInvoiceMasterFormGroup.value[key]}`;
      }
    });

    url = "/invoice/search?isInvoiceVoid=true" + this.searchkey;
    this.customerManagementService.postMethod(url, dtoData).subscribe(
      (response: any) => {
        const invoiceMasterListData = response.invoicesearchlist;
        this.invoiceMasterListData = invoiceMasterListData;
        // this.invoiceMasterListData = response.invoicesearchlist;
        this.invoiceMastertotalRecords = response.pageDetails.totalRecords;
        this.isInvoiceChecked = false;
        this.allInvoiceChecked = false;
        this.isSingleInChecked = false;
        this.chakedInvoiceData = [];

        this.isInvoiceSearch = true;
        console.log("this.searchPaymentData", this.invoiceMasterListData);
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
  clearSearchinvoiceMaster() {
    this.isInvoiceSearch = false;
    this.searchInvoiceMasterFormGroup.reset();
    this.searchInvoiceMasterFormGroup.controls['billrunid'].setValue("");
    this.searchInvoiceMasterFormGroup.controls['docnumber'].setValue("");
    this.searchInvoiceMasterFormGroup.controls['custname'].setValue("");
    this.searchInvoiceMasterFormGroup.controls['billfromdate'].setValue("");
    this.searchInvoiceMasterFormGroup.controls['billtodate'].setValue("");
    this.searchInvoiceMasterFormGroup.controls['customerid'].setValue("");
    this.searchInvoiceMasterFormGroup.controls['staffId'].setValue("");
    this.searchInvoiceMasterFormGroup.controls['branchId'].setValue("");
    this.searchInvoiceMasterFormGroup.controls['businessunit'].setValue("");
    this.searchInvoiceMasterFormGroup.controls['planId'].setValue("");
    this.searchInvoiceMasterFormGroup.controls['serviceId'].setValue("");

    this.invoiceMasterListData = [];
  }

  addWalletIncustomer(custID:any) {
    this.isCustomerDetailOpen = false;
    this.isCustomerLedgerOpen = false;
    this.isCustomerDetailSubMenu = true;
    this.ifMyInvoice = false;
    this.ifWalletMenu = true;
    this.listView = false;
    const data = {
      CREATE_DATE: "",
      END_DATE: "",
      amount: "",
      balAmount: "",
      custId: custID,
      description: "",
      id: "",
      refNo: "",
      transcategory: "",
      transtype: "",
    };
    const url = "/wallet";
    this.revenueManagementService.postMethod(url, data).subscribe((response: any) => {
      this.getWallatData = response;
    });
  }
  pageChangedInvoicePaymentList(pageNumber:any) {
    this.currentPageinvoicePaymentList = pageNumber;
  }
  invoicePaymentCloseModal() {
    this.ifInvoicePayment = false;
    this.ispaymentChecked = false;
    this.allIsChecked = false;
    this.isSinglepaymentChecked = false;
    this.invoicePaymentData = [];
    this.allchakedPaymentData = [];
  }

  invicePaymentList(invoice:any) {
    this.invoiceID = invoice.id;

    this.invoicePaymentData = [];
    if (invoice.adjustedAmount >= invoice.totalamount) {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Total payment is already adjusted",
        icon: "far fa-times-circle",
      });
    } else {
      $("#invoicePayment").modal("show");
      const url = "/paymentmapping/" + this.invoiceID;
      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.invoicePaymentData = response.Paymentlist;
          this.invoicePaymenttotalRecords = this.invoicePaymentData.length;

          this.invoicePaymentData.forEach((value, index) => {
            this.invoicePaymentData[index].isSinglepaymentChecked = false;
            this.totaladjustedAmount =
              this.totaladjustedAmount + this.invoicePaymentData[index].adjustedAmount;
          });
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

  checkInvoicePaymentAll(event:any) {
    if (event.checked == true) {
      this.allchakedPaymentData = [];
      const checkedData = this.invoicePaymentData;
      for (let i = 0; i < checkedData.length; i++) {
        this.allchakedPaymentData.push({
          id: this.invoicePaymentData[i].id,
          amount: this.invoicePaymentData[i].amount,
        });
      }
      this.allchakedPaymentData.forEach((value, index) => {
        checkedData.forEach(element => {
          if (element.id == value.id) {
            element.isSinglepaymentChecked = true;
          }
        });
      });
      this.ispaymentChecked = true;
      // console.log(this.allchakedPaymentData);
    }
    if (event.checked == false) {
      const checkedData = this.invoicePaymentData;
      this.allchakedPaymentData.forEach((value, index) => {
        checkedData.forEach(element => {
          if (element.id == value.id) {
            element.isSinglepaymentChecked = false;
          }
        });
      });
      this.allchakedPaymentData = [];
      // console.log(this.allchakedPaymentData);
      this.ispaymentChecked = false;
      this.allIsChecked = false;
    }
  }

  addInvoicePaymentChecked(id:any, event:any) {
    if (event.checked) {
      this.invoicePaymentData.forEach((value, i) => {
        if (value.id == id) {
          this.allchakedPaymentData.push({
            id: value.id,
            amount: value.amount,
          });
        }
      });

      if (this.invoicePaymentData.length === this.allchakedPaymentData.length) {
        this.ispaymentChecked = true;
        this.allIsChecked = true;
      }
      // console.log(this.allchakedPaymentData);
    } else {
      const checkedData = this.invoicePaymentData;
      checkedData.forEach(element => {
        if (element.id == id) {
          element.isSinglepaymentChecked = false;
        }
      });
      this.allchakedPaymentData.forEach((value, index) => {
        if (value.id == id) {
          this.allchakedPaymentData.splice(index, 1);
          // console.log(this.allchakedPaymentData);
        }
      });

      if (
        this.allchakedPaymentData.length == 0 ||
        this.allchakedPaymentData.length !== this.invoicePaymentData.length
      ) {
        this.ispaymentChecked = false;
      }
    }
  }

  invoicePaymentAdjsment() {
    const data = {
      invoiceId: this.invoiceID,
      creditDocumentList: this.allchakedPaymentData,
    };

    const url = "/invoicePaymentAdjust";
    this.revenueManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        // this.closebutton.nativeElement.click();
        this.ifInvoicePayment = false;
        this.ispaymentChecked = false;
        this.allIsChecked = false;
        this.isSinglepaymentChecked = false;
        this.invoicePaymentData = [];
        this.allchakedPaymentData = [];
        this.searchinvoiceMaster(this.customerLedgerDetailData.id, "");

        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle",
        });
      },
      (error: any) => {
        // console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  downloadPDFINvoice(docNo:any, customerName:any) {
    if (docNo) {
      const downloadUrl = "/invoicePdf/download/" + docNo;
      this.customerManagementService.downloadPDFInvoice(downloadUrl).subscribe(
        (response: any) => {
          const file = new Blob([response], { type: "application/pdf" });
          // var fileURL = URL.createObjectURL(file,customerName + docNo);
          // FileSaver.saveAs(file);
          const fileURL = URL.createObjectURL(file);
          // FileSaver.saveAs(file, customerName + docNo);
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

  voidInvoice(invoice:any): void {
    if (invoice) {
      this.confirmationService.confirm({
        message: "Do you wish to VOID this invoice?",
        header: "VOID Invoice Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          const url = `/invoiceV2/voidInvoice?invoiceId=${invoice.id}`;
          this.customerManagementService.getMethod(url).subscribe(
            (response: any) => {
              // this.closebutton.nativeElement.click();
              this.ifInvoicePayment = false;
              this.ispaymentChecked = false;
              this.allIsChecked = false;
              this.isSinglepaymentChecked = false;
              this.invoicePaymentData = [];
              this.allchakedPaymentData = [];
              this.searchinvoiceMaster("", "");
              if (response.responseCode == 417) {
                this.messageService.add({
                  severity: "info",
                  summary: "Info",
                  detail: response.responseMessage,
                  icon: "far fa-check-circle",
                });
              } else {
                this.messageService.add({
                  severity: "success",
                  summary: "Successfully",
                  detail: response.message,
                  icon: "far fa-check-circle",
                });
              }
            },
            (error: any) => {
              // console.log(error, "error");
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.error.ERROR,
                icon: "far fa-times-circle",
              });
            }
          );
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
  }
  allSelectInvoice(event:any) {
    if (event.checked == true) {
      this.chakedInvoiceData = [];
      const checkedData = this.invoiceMasterListData;
      for (let i = 0; i < checkedData.length; i++) {
        // if (
        //   this.invoiceMasterListData[i].status !== "approved" &&
        //   this.invoiceMasterListData[i].status !== "rejected"
        // ) {
        this.chakedInvoiceData.push({
          id: this.invoiceMasterListData[i].id,
        });
        // }
      }
      this.chakedInvoiceData.forEach((value, index) => {
        checkedData.forEach((element:any) => {
          if (element.id == value.id) {
            element.isSingleInChecked = true;
          }
        });
      });

      this.isInvoiceChecked = true;
      // console.log(this.chakedInvoiceData);
    }
    if (event.checked == false) {
      const checkedData = this.invoiceMasterListData;
      this.chakedInvoiceData.forEach((value, index) => {
        checkedData.forEach((element:any) => {
          if (element.id == value.id) {
            element.isSingleInChecked = false;
          }
        });
      });
      this.chakedInvoiceData = [];
      // console.log(this.chakedInvoiceData);
      this.isInvoiceChecked = false;
      this.allInvoiceChecked = false;
    }
  }

  addInvoiceChecked(id:any, event:any) {
    if (event.checked) {
      this.invoiceMasterListData.forEach((value:any, i:any) => {
        if (value.id == id) {
          this.chakedInvoiceData.push({
            id: value.id,
          });
        }
      });

      if (this.invoiceMasterListData.length === this.chakedInvoiceData.length) {
        this.isInvoiceChecked = true;
        this.allInvoiceChecked = true;
      }
      // console.log(this.chakedInvoiceData);
    } else {
      const checkedData = this.invoiceMasterListData;
      checkedData.forEach((element:any) => {
        if (element.id == id) {
          element.isSingleInChecked = false;
        }
      });
      this.chakedInvoiceData.forEach((value, index) => {
        if (value.id == id) {
          this.chakedInvoiceData.splice(index, 1);
          // console.log(this.chakedInvoiceData);
        }
      });

      if (
        this.chakedInvoiceData.length == 0 ||
        this.chakedInvoiceData.length !== this.invoiceMasterListData.length
      ) {
        this.isInvoiceChecked = false;
      }
    }
  }

  approveRejectInvoice(invoiceID:any, isApproveRequest:any) {
    this.assignStaffForm.reset();
    const url = `/invoiceV2/approveDebitDoc?invoiceId=${invoiceID}&isApproveRequest=${isApproveRequest}&remark=${"approved"}`;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.assignStaffForm.controls['invoiceId'].setValue(invoiceID);
        if (isApproveRequest) {
          if (response.dataList != null) {
            this.approve = true;
            this.staffList = response.dataList;

            $("#assignApproveModal").modal("show");
          } else {
            this.approve = false;
            this.ifInvoicePayment = false;
            this.ispaymentChecked = false;
            this.allIsChecked = false;
            this.isSinglepaymentChecked = false;
            this.invoicePaymentData = [];
            this.allchakedPaymentData = [];
            this.searchinvoiceMaster("", "");
          }
        } else {
          if (response.dataList != null) {
            // this.reject = true;
            this.approve = false;
            this.staffList = response.dataList;

            $("#assignApproveModal").modal("show");
          } else {
            // this.reject = false;
            this.ifInvoicePayment = false;
            this.ispaymentChecked = false;
            this.allIsChecked = false;
            this.isSinglepaymentChecked = false;
            this.invoicePaymentData = [];
            this.allchakedPaymentData = [];
            this.searchinvoiceMaster("", "");
          }
        }
        // this.closebutton.nativeElement.click();

        if (response.responseCode === 417) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle",
          });
        }
      },
      (error: any) => {
        // console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  assignToStaff() {
    const entityId = this.assignStaffForm.controls['invoiceId'].value;
    const nextAssignStaff = this.assignStaffForm.controls['staffId'].value;
    let url;
    if (nextAssignStaff) {
      url = `/teamHierarchy/assignFromStaffList?entityId=${entityId}&eventName=BILL_TO_ORGANIZATION&isApproveRequest=${this.approve}&nextAssignStaff=${nextAssignStaff}`;
    } else {
      url = `/teamHierarchy/assignEveryStaff?entityId=${entityId}&eventName=${"BILL_TO_ORGANIZATION"}&isApproveRequest=${this.approve}`;
    }
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        $("#assignApproveModal").modal("hide");
        this.searchinvoiceMaster("", "");

        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle",
        });
      },
      (error: any) => {
        // console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  getworkflowAuditDetails(size:any, id:any, name:any) {
    const page = this.currentPageAudit;
    let page_list;
    if (size) {
      page_list = size;
      this.itemsPerPageAudit = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.itemsPerPageAudit = 5;
      } else {
        this.itemsPerPageAudit = 5;
      }
    }

    this.workflowAuditData = [];

    const data = {
      page,
      pageSize: this.itemsPerPageAudit,
    };

    const url = "/workflowaudit/list?entityId=" + id + "&eventName=" + name;

    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.workflowAuditData = response.dataList;
        this.MastertotalRecords = response.totalRecords;
      },
      (error: any) => {
        if (error.status == 200) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.ERROR,
            icon: "far fa-times-circle",
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle",
          });
        }
        console.log(error, "error");
      }
    );
  }
  pageChangedMasterList(pageNumber:any) {
    this.currentPageAudit = pageNumber;
    this.getworkflowAuditDetails("", this.workflowID, "PLAN");
  }
  workflowID(arg0: string, workflowID: any, arg2: string) {
    throw new Error("Method not implemented.");
  }
  TotalItemPerPageWorkFlow(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageAudit > 1) {
      this.currentPageAudit = 1;
    }
    this.getworkflowAuditDetails(this.showItemPerPage, this.workflowID, "PLAN");
  }

  openAuditWorkflow(id:any, modalId:any) {
    this.ifModelIsShow = true;
    this.PaymentamountService.show(modalId);
    this.auditcustid.next({
      auditcustid: id,
      checkHierachy: "BILL_TO_ORGANIZATION",
      planId: "",
    });
  }

  generatePDFInvoice(custId:any) {
    if (custId) {
      const url = "/generatePdfByInvoiceId/" + custId;
      this.customerManagementService.generateMethodInvoice(url).subscribe(
        (response: any) => {
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
  }
  pickModalOpen(data:any) {
    let url = "/workflow/pickupworkflow?eventName=BILL_TO_ORGANIZATION&entityId=" + data.id;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.searchinvoiceMaster("", "");

        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        }
      },
      (error: any) => {
        // console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }
  approvableStaff: any = [];
  assignedBillToOrganizationid: any;
  StaffReasignList1(data:any) {
    this.assignPLANForm.reset();
    let url = `/teamHierarchy/reassignWorkflowGetStaffList?entityId=${data.id}&eventName=BILL_TO_ORGANIZATION`;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.assignedBillToOrganizationid = data.id;
        this.approvableStaff = [];
        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Please Approve before assign",
            icon: "far fa-times-circle",
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        }
        if (response.dataList != null) {
          this.approvableStaff = response.dataList;
          this.approve = true;
          $("#reAssignPLANModal").modal("show");
        } else {
          $("#reAssignPLANModal").modal("hide");
        }
        console.log(response);
      },
      (error: any) => {
        // console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }
  selectStaff: any;
  reassignWorkflow() {
    let url: any;
    this.remark = this.assignPLANForm.value.remark;
    url = `/teamHierarchy/reassignWorkflow?entityId=${this.assignedBillToOrganizationid}&eventName=BILL_TO_ORGANIZATION&assignToStaffId=${this.selectStaff}&remark=${this.remark}`;
    if (this.assignedBillToOrganizationid === null) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please Approve before assign",
        icon: "far fa-times-circle",
      });
    } else {
      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          $("#reAssignPLANModal").modal("hide");
          this.getCustomer();
          this.searchinvoiceMaster("", "");
          if (response.responseCode == 417) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle",
            });
          } else {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: "Assigned to the next staff successfully.",
              icon: "far fa-times-circle",
            });
          }
        },
        error => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle",
          });
        }
      );
    }
    this.getcustomerList("");
  }

  createCreditNote(invoice:any) {
    console.log("invoice ::::::: ", invoice);

    this.custDropdownData = [
      {
        id: invoice.custid,
        name: invoice.customerName,
      },
    ];

    this.invoiceDropdownData = [
      {
        id: invoice.id,
        docnumber: invoice.docnumber,
      },
    ];

    this.paymentFormGroup.controls['paymentreferenceno'].disable();
    this.paymentFormGroup.controls['customerid'].disable();
    let creditNoteAmount = 0;
    if (invoice.creditDocumentList && invoice.creditDocumentList.length > 0) {
      let creditNoteinvoice = invoice.creditDocumentList.filter((inv:any) => inv.type === "creditnote");
      creditNoteAmount = creditNoteinvoice
        .map((item:any) => +item.amount)
        .reduce((sum:any, current:any) => sum + current);
    }
    this.paymentFormGroup.patchValue({
      paymode: "Credit Note",
      type: "creditnote",
      paytype: "creditnote",
      invoiceId: invoice.id,
      customerid: invoice.custid,
      amount: invoice.totalamount - creditNoteAmount,
    });
    $("#addCreditNoteModal").modal("show");
  }

  createPaymentData: any;
  submitted = false;
  paymentFormGroup: FormGroup;
  custDropdownData:any[] = [];
  invoiceDropdownData:any[] = [];

  addPayment(paymentId:any): void {
    this.submitted = true;
    if (this.paymentFormGroup.valid) {
      this.createPaymentData = this.paymentFormGroup.getRawValue();
      this.paymentFormGroup.value.type = "creditnote";
      this.paymentFormGroup.value.paymode = "Credit Note";
      this.paymentFormGroup.value.paytype = "creditnote";
      // this.createPaymentData.paymentdate = new Date();
      let invoiceId = [];
      invoiceId.push(this.paymentFormGroup.controls['invoiceId'].value);
      this.createPaymentData.invoiceId = invoiceId;
      delete this.createPaymentData.paymentreferenceno;

      const formData = new FormData();
      formData.append("spojo", JSON.stringify(this.createPaymentData));
      const url = "/record/payment";
      this.revenueManagementService.postMethod(url, formData).subscribe(
        (response: any) => {
          if (response.status == 200) {
            this.submitted = false;
            this.paymentFormGroup.reset();
            this.submitted = false;
            this.custDropdownData = [];
            this.invoiceDropdownData = [];
            $("#addCreditNoteModal").modal("hide");
            this.searchinvoiceMaster("", "");
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle",
            });
          } else {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.paymentdate,
              icon: "far fa-times-circle",
            });
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

  keypressId(event: any) {
    const pattern = /[0-9\.]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && event.keyCode != 9 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
