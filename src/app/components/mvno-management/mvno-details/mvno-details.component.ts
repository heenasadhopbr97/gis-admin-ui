import { Component, OnInit, PipeTransform, Pipe } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { ActivatedRoute, Router } from "@angular/router";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";
import { StatusCheckService } from "src/app/service/status-check-service.service";
import { MvnoManagementService } from "src/app/service/mvno-management.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
// import * as moment from "moment";
// import * as FileSaver from "file-saver";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Regex } from "src/app/constants/regex";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { SearchPaymentService } from "src/app/service/search-payment.service";
import { LoginService } from "src/app/service/login.service";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { formatDate, DatePipe } from "@angular/common";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
    selector: "app-mvno-details",
    templateUrl: "./mvno-details.component.html",
    styleUrls: ["./mvno-details.component.scss"],
    standalone: false
})
// @Pipe({
//     name: "addDays"
// })
export class MvnoDetailsComponent implements OnInit, PipeTransform {
openTotalTaxModal(arg0: any,arg1: string) {
throw new Error('Method not implemented.');
}
onSelectedInvoice($event: any,_t816: any,arg2: any,arg3: any) {
throw new Error('Method not implemented.');
}
custLedgertotalRecords: string|number;
downloadInvoice(arg0: any,arg1: any,arg2: any) {
throw new Error('Method not implemented.');
}
paymappingItemPerPage: string|number;
currentPagePayMapping: string|number;
payMappinftotalRecords: string|number;
customerPaymentdatatotalRecords: string|number;
openInvoicePaymentModal(arg0: string,arg1: any) {
throw new Error('Method not implemented.');
}
    mvnoTitle = RadiusConstants.MVNO;
    custType: any;
    searchInvoiceChargeForm: FormGroup;
    mvnoId: number;
    mvnoData: any;
    customerInvoiceList: any;
    mvnoCurrentPageInvoiceListdata = 1;
    mvnoInvoiceListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
    mvnoInvoiceListdatatotalRecords: any;
    pageLimitOptions = RadiusConstants.pageLimitOptions;
    customerInvoiceTotalAmount: number;
    debitDocDetailIds: any[] = [];
    debitDocDetailIdList: any[] = [];
    commission: number;
    commissionAmount: number = 0;
    tax: number;
    totalAmount: number = 0;
    addedChargeInvoiceTotalAmount: number = 0;
    mvnoInvoiceList: any;
    chargeId: number;
    viewcustomerPaymentData: any;
    customerLedgerDetailData: any;
    recordPaymentAccess: boolean = false;
    isRecordPaymentClicked: boolean = false;
    invoicedropdownValue = [{ docnumber: "Advance", id: 0 }];
    displayRecordPaymentDialog: boolean = false;
    displaySelectInvoiceDialog: boolean = false;
    isInvoiceDetailsModel: boolean = false;
    viewInvoiceData: any = {};
    chargeTypes: any[] = [];
    masterChargeTypes: any[] = [];
    masterChargeTypeList: any[] = [];
    selectedChargeType: any = "";
    selectedChargeTypeObject: any = "";
    mvnoChagesListFormmArray: FormArray;
    customerPaymentdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
    promiseToPay!:boolean;
    customerData: any;
    invoiceList:any[] = [];
    paymentMode:any = [];
    newFirst = 0;
    masterSelected: boolean;
    selectedInvoice: any = [];
    tdsPercent: number;
    abbsPercent: number;
    paymentFormGroup: any;
    isTdsFlag: boolean = false;
    isAbbsFlag: boolean = false;
    isShowInvoiceList: boolean = false;
    destinationbank: boolean = false;
    Amount: any = 0;
    fileName: any;
    file: any = "";
    firstTimePaymentTabClicked: boolean = false;
    viewcustomerInvoiceData: any;
    displayInvoiceListDialog: boolean = false;
    currentPageinvoiceListdata = 1;
    invoiceListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
    invoiceListDatatotalRecords: any;
    searchSenderKey: any = "";
    searchOption: any = "";
    customerInvoiceId: any;
    currentPageSize:any;
    customerLedgerSearchKey: string;
    custLedgerForm: FormGroup;
    currentPagecustLedgerList = 1;
    legershowItemPerPage = 1;
    custLedgerItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
    custLedgerSubmitted = false;
    customerLedgerListData: any;
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
        transtype: ""
    };
    customerLedgerData: any = {
        title: "",
        firstname: "",
        lastname: "",
        plan: "",
        status: "",
        username: "",
        customerLedgerInfoPojo: {
            openingAmount: "",
            closingBalance: ""
        }
    };
    isDisable: boolean = false;
    chequeDateName = "Cheque Date";
    submitted = false;
    createPaymentData: any;
    currentPagecustomerPaymentdata = 1;
    paymentShowItemPerPage = 1;
    searchData: any = {};
    pageITEM = RadiusConstants.ITEMS_PER_PAGE;
    customerId: number;
    showChequeDetails: boolean = false;
    chequeDetail:any[] = [];
    displayInvoiceDetails: boolean = false;
    paymentId = new BehaviorSubject({
        paymentId: ""
    });
    approveCAF: any[];
    workflowApproveId: any;
    approved: boolean;
    selectStaff: null;
    showItemPerPage = 1;
    DunningData: any = [];
    currentPageDunningSlab1 = 1;
    DunningitemsPerPage1 = RadiusConstants.ITEMS_PER_PAGE;
    DunningtotalRecords1: any;
    dunningList: any = [];
    dunningData: any;
    dunningStatusAccess: boolean = false;
    changeStatus: string;
    currency: string;
    chargeTypeList: any;
    isChargeDropdownDisable: boolean = true;
    invoiceID: any;
    invoiceCancelRemarksType:null = null;
    invoicePaymentData:any[] = [];
    Remark: boolean = false;
    ifInvoicePayment = false;
    ispaymentChecked = false;
    allIsChecked = false;
    isSinglepaymentChecked = false;
    invoiceCancelRemarks:any = null;
    allchakedPaymentData:any[] = [];
    isExportDialog: boolean = false;
    cols = [
        {
            field: "username",
            header: "Customer",
            customExportHeader: "Customer"
        },
        {
            field: "debitdocumentnumber",
            header: "Invoice No.",
            customExportHeader: "Invoice No."
        },
        {
            field: "startdate",
            header: "Start Date",
            customExportHeader: "Start Date"
        },
        {
            field: "enddate",
            header: "End Date",
            customExportHeader: "End Date"
        },
        {
            field: "totalamount",
            header: "Total Amount",
            customExportHeader: "Total Amount"
        }
    ];
    customerName: any;
    constructor(
        private fb: FormBuilder,
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private messageService: MessageService,
        private customerManagementService: CustomermanagementService,
        public KeyannaCommonBaseService: KeyannaCommonBaseService,
        private route: ActivatedRoute,
        public statusCheckService: StatusCheckService,
        private router: Router,
        private mvnoManagementService: MvnoManagementService,
        private revenueManagementService: RevenueManagementService,
        private searchPaymentService: SearchPaymentService,
        public loginService: LoginService,
        public commondropdownService: CommondropdownService,
        private systemService: SystemconfigService
    ) {
        this.mvnoId = Number(this.route.snapshot.paramMap.get("mvnoId")!);
        this.recordPaymentAccess = loginService.hasPermission(
            this.custType == "Prepaid"
                ? PRE_CUST_CONSTANTS.PRE_CUST_PAYMENT_RECORD
                : POST_CUST_CONSTANTS.POST_CUST_PAYMENT_RECORD
        );
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    getControl(row: AbstractControl, controlName: string): FormControl {
        if (row instanceof FormGroup) {
          const ctrl = row.get(controlName);
          if (ctrl instanceof FormControl) {
            return ctrl;
          }
        }
        return new FormControl('');
      }

    async ngOnInit() {
        this.getPaymentMode();
        this.getMvnoById(this.mvnoId);
        this.getChargeType();
        this.mvnoChagesListFormmArray = this.fb.array([]);
        this.custLedgerForm = this.fb.group({
            startDateCustLedger: ["", Validators.required],
            endDateCustLedger: ["", Validators.required]
        });
        this.paymentFormGroup = this.fb.group({
            amount: [0, [Validators.required, Validators.min(1)]],
            bank: [""],
            branch: [""],
            chequedate: ["", Validators.required],
            chequeno: ["", [Validators.required, Validators.pattern(Regex.numeric)]],
            customerid: ["", Validators.required],
            paymode: ["", Validators.required],
            referenceno: ["", Validators.required],
            remark: ["", Validators.required],
            bankManagement: ["", Validators.required],
            destinationBank: ["", Validators.required],
            reciptNo: [""],
            type: ["Payment"],
            paytype: [""],
            file: [""],
            tdsAmount: [0],
            abbsAmount: [0],
            invoiceId: ["", Validators.required],
            onlinesource: [""]
        });

        this.searchInvoiceChargeForm = this.fb.group({
            isInvoiceVoid: [false],
            fromDate: [""],
            toDate: [""]
        });
    }

    listMvno() {
        this.router.navigate(["/home/mvnoManagement/list/"]);
    }

    getMvnoById(id:any) {
        if (id) {
            const url = "/mvno/" + id;
            this.mvnoManagementService.getMethod(url).subscribe(
                (response: any) => {
                    this.mvnoData = response.data;
                    //   this.getCustomersDetail();
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

    handleChange(event: any) {
        this.mvnoCurrentPageInvoiceListdata = 1;
        this.mvnoInvoiceListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
        this.commission = 0;
        this.commissionAmount = 0;
        this.tax = 0;
        this.totalAmount = 0;
        if (event.index == 1) {
            //this.getCustomerInvoices();
            this.getChargeList();
            this.getMvnoInvoiceList();
        } else if (event.index == 2) {
            this.getCustomersDetail();
            this.openCustomersPaymentData("");
        } else if (event.index == 3) {
            this.getDunningData(this.mvnoInvoiceListdataitemsPerPage);
        } else if (event.index == 4) {
            this.custLedgerForm = this.fb.group({
                startDateCustLedger: ["", Validators.required],
                endDateCustLedger: ["", Validators.required]
            });
            this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
                this.currency = res.data.value;
            });

            this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
                this.currency = res.data.value;
            });
            this.getCustomersLedger(this.mvnoData.custInvoiceRefId, "");
        }
        this.mvnoChagesListFormmArray = this.fb.array([]);
        this.clearSearchForm();
    }
    getChargeType() {
        let url = "/commonList/generic/chargetype";
        this.commondropdownService.getMethodWithCache(url).subscribe((response: any) => {
            this.chargeTypeList = response.dataList;
            console.log("chargeTypeList  in common::::", this.chargeTypeList);
        });
    }

    getCustomerInvoices() {
        this.chargeTypes = [];
        this.masterChargeTypes = [];
        this.customerInvoiceTotalAmount = 0;

        var request = { ...this.searchInvoiceChargeForm.value };
        request.fromDate = (request.fromDate).utc(true).startOf("day").toDate();
        request.toDate = (request.toDate).utc(true).endOf("day").toDate();

        let url = `/invoiceByMvnoId/${this.mvnoId}`;
        this.revenueManagementService.postMethod(url, request).subscribe(
            (response: any) => {
                if (response.debitDocDetails.length > 0) {
                    this.chargeTypes = response.debitDocDetails.filter(
                        (charge:any) => charge.chargeType != null && charge.totalAmount > 0
                    );
                    this.isChargeDropdownDisable = false;
                    let filterchargeTypes = this.chargeTypes.map(charge => charge.chargeType);
                    this.chargeTypeList = this.chargeTypeList.filter(
                        (chargeType:any) =>
                            filterchargeTypes.includes(chargeType.text) ||
                            filterchargeTypes.includes(chargeType.value)
                    );
                    console.log("chargeTypeList ::::", this.chargeTypeList);
                    this.masterChargeTypes = [...this.chargeTypes];
                    this.masterChargeTypeList = [...this.chargeTypeList];
                } else {
                    this.messageService.add({
                        severity: "info",
                        summary: "Info",
                        detail: "No invoice found for given date",
                        icon: "far fa-times-circle"
                    });
                    this.isChargeDropdownDisable = true;
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

    mvnoInvoiceListPageChange(pageNumber:any) {
        this.mvnoCurrentPageInvoiceListdata = pageNumber;
        this.getMvnoInvoiceList();
    }

    TotalItemPerPage(event:any) {
        this.getMvnoInvoiceList();
    }

    handleKeyDown(event: KeyboardEvent) {
        let maxValue: number = Number(100);

        const inputElement = event.target as HTMLInputElement;
        if (
            event.keyCode === 8 ||
            (event.key >= "0" && event.key <= "9") ||
            (event.key === "." && inputElement.value.indexOf(".") === -1) // Allow only one decimal point
        ) {
            if (parseFloat(inputElement.value + event.key) <= maxValue) {
                return true; // Allow the input
            } else {
                return false; // Prevent the input
            }
        } else {
            return false; // Prevent the input for other keys
        }
    }

    generateInvoice() {
        // let dateWithTime = moment(new Date()).format("DD-MM-YYYY HH:mm").toString();
        // let date = moment(new Date()).format("YYYY-MM-DD").toString();
        var formReq = { ...this.searchInvoiceChargeForm.value };
        let request = {
            custid: this.mvnoData.custInvoiceRefId,
            billableCustomerId: null as number | null,
            paymentOwnerId: 1,
            isMvnoCharge: true,
            debitDocDetailIds: this.debitDocDetailIdList,
            // ispFromDate: moment(formReq.fromDate).utc(true).startOf("day").toDate(),
            // ispToDate: moment(formReq.toDate).utc(true).endOf("day").toDate(),
            custChargeDetailsPojoList: [
                {
                    type: "one-time",
                    chargeid: this.chargeId,
                    validity: 30,
                    price: this.totalAmount,
                    actualprice: this.addedChargeInvoiceTotalAmount,
                    // charge_date: date,
                    unitsOfValidity: "Days",
                    billingCycle: 1,
                    paymentOwnerId: 1,
                    discount: null as string | null,
                    staticIPAdrress: null as string | null,
                    // expiry: date,
                    // expiryDate: dateWithTime
                }
            ]
        };

        let url = `/createCustChargeOverride`;
        this.customerManagementService.postMethod(url, request).subscribe(
            (response: any) => {
                this.spinner.show();
                setTimeout(() => {
                    //  this.getCustomerInvoices();
                    this.getChargeList();
                    this.getMvnoInvoiceList();
                    this.commission = 0;
                    this.commissionAmount = 0;
                    this.tax = 0;
                    this.totalAmount = 0;
                    this.messageService.add({
                        severity: "success",
                        summary: "Successfully",
                        detail: response.message,
                        icon: "far fa-check-circle"
                    });
                }, 1000);
                this.spinner.hide();
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
        this.mvnoChagesListFormmArray = this.fb.array([]);
        this.debitDocDetailIdList = [];
        this.clearSearchForm();
    }

    commissionKeyUp() {
        this.commissionAmount = Number(
            ((this.customerInvoiceTotalAmount * this.commission) / 100).toFixed(2)
        );
        if (this.tax > 0) {
            this.taxKeyUp();
        }
    }

    taxKeyUp() {
        if (this.commissionAmount > 0) {
            this.totalAmount = Number(((this.commissionAmount * this.tax) / 100).toFixed(2));
            this.totalAmount = Number((this.totalAmount + this.commissionAmount).toFixed(2));
        }
    }

    openCustomersPaymentData(size:any) {
        this.firstTimePaymentTabClicked = false;
        if (
            this.customerLedgerDetailData?.parentCustomerId == "null" ||
            this.customerLedgerDetailData?.invoiceType == "Group"
        ) {
            this.isDisable = true;
        }
        let page_list;

        if (size) {
            page_list = size;
            this.customerPaymentdataitemsPerPage = size;
        } else {
            if (this.paymentShowItemPerPage == 1) {
                this.customerPaymentdataitemsPerPage = this.pageITEM;
            } else {
                this.customerPaymentdataitemsPerPage = this.paymentShowItemPerPage;
            }
        }
        const url = "/paymentHistory/" + this.mvnoData.custInvoiceRefId;
        this.revenueManagementService.paymentData(url).subscribe((response: any) => {
            this.viewcustomerPaymentData = response.dataList;
            this.InvoiceListByCustomer();
            console.log("Customer list :::::::", this.viewcustomerPaymentData);
        });
    }
    recordPaymentClicked() {
        this.displayRecordPaymentDialog = true;
    }
    //   getFullName(customerLedgerDetailData: any): string {
    //     if (!customerLedgerDetailData) return "";
    //     return `${customerLedgerDetailData.title ? customerLedgerDetailData.title + " " : ""}${
    //       customerLedgerDetailData.firstname
    //     }${customerLedgerDetailData.lastname ? " " + customerLedgerDetailData.lastname : ""}`;
    //   }

    getCustomersDetail() {
        const url = "/customers/" + this.mvnoData.custInvoiceRefId;
        this.customerManagementService.getMethod(url).subscribe(
            (response: any) => {
                this.customerLedgerDetailData = response.customers;
                console.log("this.customerLedgerDetailData::::", this.customerLedgerDetailData);
                this.paymentFormGroup.patchValue({
                    customerid: this.customerLedgerDetailData.id
                });
                if (this.customerLedgerDetailData === null || this.customerLedgerDetailData === undefined) {
                    this.paymentFormGroup.patchValue({
                        customerid: this.mvnoData.custInvoiceRefId
                    });
                }
            },
            (error: any) => {
                if (this.customerLedgerDetailData === null || this.customerLedgerDetailData === undefined) {
                    this.paymentFormGroup.patchValue({
                        customerid: this.mvnoData.custInvoiceRefId
                    });
                }
                // this.messageService.add({
                //   severity: "error",
                //   summary: "Error",
                //   detail: error.error.ERROR,
                //   icon: "far fa-times-circle",
                // });
            }
        );

        console.log("customer data:::::::::", this.customerLedgerDetailData);
    }

    checkUncheckAllInvoice() {
        for (let i = 0; i < this.invoiceList.length; i++) {
            this.invoiceList[i].isSelected = this.masterSelected;
        }
        this.getCheckedItemListInvoice();
    }

    getCheckedItemListInvoice() {
        this.selectedInvoice = [];
        for (let i = 0; i < this.invoiceList.length; i++) {
            if (this.invoiceList[i].isSelected) {
                this.selectedInvoice.push(this.invoiceList[i]);
            }
        }
    }
    modalOpenInvoice() {
        this.displaySelectInvoiceDialog = true;
        this.InvoiceListByCustomer();
        this.newFirst = 0;
    }
    getPaymentMode() {
        const url = "/commonList/paymentMode";
        this.commondropdownService.getMethodWithCache(url).subscribe(
            (response: any) => {
                this.paymentMode = response.dataList;
                console.log("Paymnet mode list --------------", this.paymentMode);
            },
            (error: any) => { }
        );
    }
    InvoiceListByCustomer() {
        const url = "/invoiceList/byCustomer/" + this.mvnoData.custInvoiceRefId;

        this.invoiceList = [];
        const Data = [];
        this.masterSelected = false;

        this.revenueManagementService.getAllInvoiceByCustomer(url).subscribe(
            (response: any) => {
                const invoicedata = [];
                if (response.invoiceList != null && response.invoiceList.length != 0) {
                    this.invoiceList.push(...response.invoiceList);
                } else {
                    this.invoiceList.push(...this.invoicedropdownValue);
                }
                // this.invoiceList = Data;
                this.invoiceList.forEach(item => {
                    item.tdsCheck = 0;
                    item.abbsCheck = 0;
                    item.tds = 0;
                    item.abbs = 0;
                    item.includeTds = false;
                    item.includeAbbs = false;
                    item.testamount = this.getPendingAmount(item);
                    if (this.selectedInvoice.length > 0) {
                        let isItemExist = this.selectedInvoice.some((invoice:any) => invoice.id == item.id);
                        if (isItemExist) {
                            item.isSelected = true;
                        }
                    }
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
    openPaymentModal(id:any) {
        if (this.searchData.filters) {
            this.searchData.filters[0].filterValue = "";
            this.searchData.filters[0].filterColumn = "";
            this.searchData.page = "";
            this.searchData.pageSize = "";
        }

        let url = "/getChequeDetail/" + id;
        this.searchPaymentService.postMethod(url, this.searchData).subscribe(
            (response: any) => {
                this.chequeDetail = response.dataList;
                this.showChequeDetails = true;
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
    pageChangedcustomerPaymentList(pageNumber:any) {
        this.currentPagecustomerPaymentdata = pageNumber;
        this.openCustomersPaymentData("");
    }

    TotalPaymentItemPerPage(event:any) {
        this.paymentShowItemPerPage = Number(event.value);
        if (this.currentPagecustomerPaymentdata > 1) {
            this.currentPagecustomerPaymentdata = 1;
        }
        this.openCustomersPaymentData(this.paymentShowItemPerPage);
    }

    getPendingAmount(item:any) {
        var amount = 0;
        if (item.adjustedAmount) {
            amount = item.totalamount - item.adjustedAmount;
        } else if (item.pendingAmt) {
            amount = item.totalamount - item.pendingAmt;
        } else if (item.adjustedAmount) {
            amount = item.totalamount - item.adjustedAmount;
        } else {
            amount = item.totalamount;
        }
        if (amount) return amount.toFixed(2);
        else return 0;
    }

    isAllSelectedInvoice() {
        this.masterSelected = this.invoiceList.every(function (item: any) {
            return item.isSelected == true;
        });
        this.getCheckedItemListInvoice();
    }

    onChangeOFTDSTest(event:any, data:any) {
        console.log("Event :::::::: ", event);
        console.log("data :::::::: ", data);

        if (event.checked && data.totalamount) {
            data.includeTds = true;
            data.tdsCheck = ((data.testamount * this.tdsPercent) / 100).toFixed(2);
            data.tds = ((data.testamount * this.tdsPercent) / 100).toFixed(2);
        } else {
            data.includeTds = false;
            data.tdsCheck = 0;
            data.tds = 0;
        }
    }

    onChangeOFABBSTest(event:any, data:any) {
        if (event.checked && data.totalamount) {
            data.includeAbbs = true;
            data.abbsCheck = ((data.testamount * this.abbsPercent) / 100).toFixed(2);
            data.abbs = ((data.testamount * this.abbsPercent) / 100).toFixed(2);
        } else {
            data.includeAbbs = false;
            data.abbsCheck = 0;
            data.abbs = 0;
        }
    }

    modalCloseInvoiceList() {
        this.getCustomersDetail();
        this.paymentFormGroup.patchValue({
            invoiceId: this.selectedInvoice.id,
            amount: this.selectedInvoice.refundAbleAmount
        });
        this.isShowInvoiceList = true;
        this.displaySelectInvoiceDialog = false;
        this.newFirst = 0;
    }

    bindInvoice() {
        this.getCustomersDetail();
        if (this.selectedInvoice.length >= 1) {
            this.isShowInvoiceList = true;
            this.Amount = 0;
            this.selectedInvoice.forEach((element:any) => {
                if (element.testamount !== null) {
                    this.Amount += parseFloat(element.testamount);
                }
            });
            this.paymentFormGroup.patchValue({
                invoiceId: this.selectedInvoice.map((item:any) => item.id),
                amount: this.Amount.toFixed(2)
            });
            this.onChangeOFAmountTest(this.selectedInvoice);
            this.destinationbank = true;
        } else {
            this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Please select at least one invoice or advance mode.",
                icon: "far fa-check-circle"
            });
        }
        if (this.selectedInvoice.length == 2) {
            this.selectedInvoice.forEach((element:any) => {
                if (element.docnumber == "Advance") {
                    this.selectedInvoice = [];
                    this.invoiceList.forEach(element => {
                        element.isSelected = false;
                    });
                    this.masterSelected = false;
                    this.messageService.add({
                        severity: "error",
                        summary: "Error",
                        detail: "Please select advance mode value only.",
                        icon: "far fa-check-circle"
                    });
                }
            });
        }
        this.displaySelectInvoiceDialog = false;
    }

    onChangeOFAmountTest(event:any) {
        if (this.selectedInvoice.length >= 1) {
            let isAbbsTdsMode: boolean = false;
            if (this.paymentFormGroup.controls.paymode.value) {
                let formPayModeValue = this.paymentFormGroup.controls.paymode.value.toLowerCase();
                isAbbsTdsMode = this.checkPaymentMode(formPayModeValue);
            }
            let totaltdsAmount = 0;
            let totalabbsAmount = 0;
            this.selectedInvoice.forEach((element:any) => {
                let tds = 0;
                let abbs = 0;
                if (element.includeTds) {
                    if (element.includeTds === true) {
                        tds = Number(element.tdsCheck);
                        totaltdsAmount = Number(element.tdsCheck) + Number(totaltdsAmount);
                        this.isTdsFlag = true;
                    }
                }
                if (element.includeAbbs) {
                    if (element.includeAbbs === true) {
                        abbs = Number(element.abbsCheck);
                        totalabbsAmount = Number(element.abbsCheck) + Number(totalabbsAmount);
                        this.isAbbsFlag = true;
                    }
                }
                if (isAbbsTdsMode) {
                    element.tds = 0;
                    element.abbs = 0;
                } else {
                    element.tds = tds;
                    element.abbs = abbs;
                }
            });
            const tdsAmount = totaltdsAmount;
            const abbsAmount = totalabbsAmount;

            if (isAbbsTdsMode) {
                this.paymentFormGroup.controls.abbsAmount.setValue(0);
                this.paymentFormGroup.controls.tdsAmount.setValue(0);
            } else {
                // if (this.isAbbsFlag) {
                this.paymentFormGroup.controls.abbsAmount.setValue(abbsAmount);
                // }
                // if (this.isTdsFlag) {
                this.paymentFormGroup.controls.tdsAmount.setValue(tdsAmount);
                // }
            }
        }
    }
    checkPaymentMode(formPayModeValue:any) {
        if (
            formPayModeValue &&
            (formPayModeValue == "vatreceiveable" ||
                formPayModeValue == "tds" ||
                formPayModeValue == "abbs")
        ) {
            return true;
        } else {
            return false;
        }
    }
    resetPayMode() {
        this.paymentFormGroup.controls.chequeno.disable();
        this.paymentFormGroup.controls.chequedate.disable();
        this.paymentFormGroup.controls.bankManagement.disable();
        this.paymentFormGroup.controls.branch.disable();
        this.paymentFormGroup.controls.destinationBank.disable();
        this.paymentFormGroup.controls.reciptNo.enable();
        this.chequeDateName = "Cheque Date";
        this.paymentFormGroup.controls.referenceno.clearValidators();
        this.paymentFormGroup.controls.referenceno.updateValueAndValidity();
        this.paymentFormGroup.controls.chequedate.setValidators([]);
        this.paymentFormGroup.controls.destinationBank.setValidators([]);
        this.paymentFormGroup.controls.bankManagement.setValidators([]);
        this.paymentFormGroup.controls.chequeno.setValidators([]);
        this.paymentFormGroup.controls.onlinesource.setValidators([]);
        this.paymentFormGroup.updateValueAndValidity();
    }
    onlineSourceData:any[] = [];
    async selPayModeRecord(event:any) {
        this.resetPayMode();
        const payMode = event.value.toLowerCase();
        if (payMode == "POS".toLowerCase() || payMode == "VatReceiveable".toLowerCase()) {
            this.paymentFormGroup.controls.chequedate.enable();
            this.paymentFormGroup.controls.chequedate.setValidators([Validators.required]);
            this.paymentFormGroup.controls.referenceno.clearValidators();
            this.paymentFormGroup.controls.reciptNo.enable();
            this.paymentFormGroup.controls.chequedate.updateValueAndValidity();
            this.paymentFormGroup.controls.referenceno.updateValueAndValidity();
            this.paymentFormGroup.updateValueAndValidity();
            this.chequeDateName = "Transaction date";
        } else if (payMode == "Online".toLowerCase()) {
            this.paymentFormGroup.controls.chequedate.enable();
            this.paymentFormGroup.controls.chequedate.setValidators([Validators.required]);
            this.paymentFormGroup.controls.chequedate.updateValueAndValidity();
            this.paymentFormGroup.controls.referenceno.setValidators([Validators.required]);
            this.paymentFormGroup.controls.reciptNo.enable();
            this.paymentFormGroup.controls.referenceno.updateValueAndValidity();
            this.chequeDateName = "Transaction date";
        } else if (payMode == "Direct Deposit".toLowerCase()) {
            this.paymentFormGroup.controls.branch.enable();
            this.paymentFormGroup.controls.chequedate.enable();
            this.paymentFormGroup.controls.chequedate.setValidators([Validators.required]);
            this.paymentFormGroup.controls.chequedate.updateValueAndValidity();
            this.paymentFormGroup.controls.destinationBank.enable();
            this.paymentFormGroup.controls.destinationBank.setValidators([Validators.required]);
            this.paymentFormGroup.controls.referenceno.clearValidators();
            this.paymentFormGroup.controls.referenceno.updateValueAndValidity();
            this.paymentFormGroup.controls.reciptNo.disable();
            this.paymentFormGroup.controls.destinationBank.updateValueAndValidity();
            this.chequeDateName = "Transaction date";
        } else if (payMode == "NEFT_RTGS".toLowerCase()) {
            this.paymentFormGroup.controls.bankManagement.enable();
            this.paymentFormGroup.controls.bankManagement.setValidators([Validators.required]);
            this.paymentFormGroup.controls.bankManagement.updateValueAndValidity();
            this.paymentFormGroup.controls.destinationBank.enable();
            this.paymentFormGroup.controls.destinationBank.setValidators([Validators.required]);
            this.paymentFormGroup.controls.referenceno.clearValidators();
            this.paymentFormGroup.controls.referenceno.updateValueAndValidity();
            this.paymentFormGroup.controls.reciptNo.enable();
            this.paymentFormGroup.controls.destinationBank.updateValueAndValidity();
        } else if (payMode == "Cheque".toLowerCase()) {
            this.paymentFormGroup.controls.chequedate.enable();
            this.paymentFormGroup.controls.chequedate.setValidators([Validators.required]);
            this.paymentFormGroup.controls.chequedate.updateValueAndValidity();
            this.paymentFormGroup.controls.bankManagement.enable();
            this.paymentFormGroup.controls.bankManagement.setValidators([Validators.required]);
            this.paymentFormGroup.controls.bankManagement.updateValueAndValidity();
            this.paymentFormGroup.controls.chequeno.enable();
            this.paymentFormGroup.controls.chequeno.setValidators([Validators.required]);
            this.paymentFormGroup.controls.referenceno.clearValidators();
            this.paymentFormGroup.controls.referenceno.updateValueAndValidity();
            this.paymentFormGroup.controls.reciptNo.enable();
            this.paymentFormGroup.controls.branch.enable();
            this.paymentFormGroup.controls.chequeno.updateValueAndValidity();
        }
        // await this.commondropdownService.getOnlineSourceData(payMode.toLowerCase());

        const url = "/commonList/generic/" + payMode;
        this.commondropdownService.getMethodWithCache(url).subscribe(
            (response: any) => {
                this.onlineSourceData = response.dataList;
                this.paymentFormGroup.patchValue({
                    onlinesource: ""
                });
                if (this.onlineSourceData.length > 0) {
                    this.paymentFormGroup.controls.onlinesource.setValidators([Validators.required]);
                    this.paymentFormGroup.controls.onlinesource.updateValueAndValidity();
                } else {
                    this.paymentFormGroup.controls.onlinesource.clearValidators();
                    this.paymentFormGroup.controls.onlinesource.updateValueAndValidity();
                }
                this.paymentFormGroup.updateValueAndValidity();
            },
            (error: any) => {
                this.onlineSourceData = [];
                console.log(error, "error");
            }
        );
        this.paymentFormGroup.updateValueAndValidity();
        let isAbbsTdsMode = this.checkPaymentMode(payMode);
        if (isAbbsTdsMode) {
            this.paymentFormGroup.patchValue({
                tdsAmount: 0,
                abbsAmount: 0
            });
            if (this.selectedInvoice.length > 0) {
                this.selectedInvoice.map((element:any) => {
                    element.tds = 0;
                    element.abbs = 0;
                });
            }
        }
        this.getBankDetail();
    }

    selPaySourceRecord(event:any) {
        const paySource = event.value.toLowerCase();
        console.log("paySource :::: ", paySource);

        switch (paySource) {
            case "cash_via_bank":
                this.paymentFormGroup.controls.destinationBank.enable();
                this.paymentFormGroup.controls.destinationBank.setValidators([Validators.required]);
                this.paymentFormGroup.controls.destinationBank.updateValueAndValidity();
                this.paymentFormGroup.controls.branch.enable();
                break;
            case "cash_in_hand":
                this.paymentFormGroup.controls.destinationBank.disable();
                this.paymentFormGroup.controls.destinationBank.clearValidators();
                this.paymentFormGroup.controls.destinationBank.updateValueAndValidity();
                this.paymentFormGroup.controls.branch.disable();
                break;
        }
    }

    keypressId(event: any) {
        const pattern = /[0-9\.]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && event.keyCode != 9 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }
    onFileChange(event:any) {
        if (event.target.files.length > 0) {
            this.file = "";
            this.fileName = event.target.files[0].name;
            this.file = event.target.files[0];
        }
    }
    // Assuming customerData is your object with title, firstname, and lastname properties

    closePaymentForm() {
        this.clearSearchForm();
        this.getCustomersDetail();
        this.paymentFormGroup.reset();
        this.displayRecordPaymentDialog = false;
        this.submitted = false;
        this.isShowInvoiceList = false;
        this.selectedInvoice = [];
        this.file = "";
        this.fileName = null;
    }

    openPaymentInvoiceModal(id:any, paymentId:any) {
        console.log(">>>>method call>>>>");
        console.log(id);
        // this.PaymentamountService.show(id);
        this.displayInvoiceDetails = true;
        this.paymentId.next({
            paymentId
        });
    }
    addPayment(paymentId:any) {
        this.submitted = true;
        if (this.paymentFormGroup.valid) {
            if (this.paymentFormGroup.value.invoiceId == 0) {
                this.paymentFormGroup.value.paytype = "advance";
            } else {
                this.paymentFormGroup.value.paytype = "invoice";
            }

            if (this.selectedInvoice.length == 0) {
                this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail: "Please select atleat one invoice or advance mode.",
                    icon: "far fa-check-circle"
                });
                return;
            } else {
                console.log("Customer Id::::", this.mvnoData.custInvoiceRefId);
                const url = "/record/payment";
                if (this.customerLedgerDetailData === null || this.customerLedgerDetailData === undefined) {
                    this.paymentFormGroup.value.customerid = this.paymentFormGroup.value.customerid;
                }
                console.log(this.paymentFormGroup.value.customerid);
                this.paymentFormGroup.value.type = "Payment";
                this.createPaymentData = this.paymentFormGroup.value;
                this.createPaymentData.onlinesource = this.paymentFormGroup.controls.onlinesource.value;
                this.createPaymentData.filename = this.fileName;
                let invoiceId:any[] = [];
                this.selectedInvoice.forEach((element:any) => {
                    invoiceId.push(element.id);
                });
                this.createPaymentData.invoiceId = invoiceId;
                // this.createPaymentData.invoices = invoices;
                delete this.createPaymentData.file;
                const formData = new FormData();
                var paymentListPojos:any[] = [];
                this.selectedInvoice.forEach((element:any) => {
                    let data = {
                        tdsAmountAgainstInvoice: element.tds,
                        abbsAmountAgainstInvoice: element.abbs,
                        amountAgainstInvoice: element.testamount,
                        invoiceId: element.id
                    };
                    paymentListPojos.push(data);
                });
                this.createPaymentData.paymentListPojos = paymentListPojos;
                formData.append("file", this.file);
                formData.append("spojo", JSON.stringify(this.createPaymentData));
                this.revenueManagementService.postMethod(url, formData).subscribe(
                    (response: any) => {
                        this.submitted = false;
                        this.destinationbank = false;
                        this.paymentFormGroup.reset();
                        this.openCustomersPaymentData("");
                        this.currentPagecustomerPaymentdata = 1;
                        this.invoiceList = [];
                        this.file = "";
                        this.fileName = null;
                        this.isShowInvoiceList = false;
                        this.messageService.add({
                            severity: "success",
                            summary: "Payment Created Successfully",
                            detail: response.message,
                            icon: "far fa-check-circle"
                        });
                        this.displayRecordPaymentDialog = false;
                        this.selectedInvoice = [];
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
        this.displayRecordPaymentDialog = false;
    }

    getMvnoInvoiceList() {
        let url = `/invoice/search?billrunid=&docnumber=&customerid=${this.mvnoData.custInvoiceRefId}&billfromdate=&billtodate=&custmobile=&isInvoiceVoid=true`;
        let request = {
            page: this.mvnoCurrentPageInvoiceListdata,
            pageSize: this.mvnoInvoiceListdataitemsPerPage
        };
        this.revenueManagementService.postMethod(url, request).subscribe(
            (response: any) => {
                this.mvnoInvoiceList = response.invoicesearchlist;
                this.mvnoInvoiceListdatatotalRecords = response.pageDetails.totalRecords;
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

    getChargeList() {
        let url = `/charge/0/equal?isDeleted=true`;
        this.customerManagementService.getMethod(url).subscribe(
            (response: any) => {
                if (response.charges.length > 0) {
                    this.chargeId = response.charges[0].id;
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

    openInvoiceModal(id:any, invoice:any) {
        this.isInvoiceDetailsModel = true;
        this.getInvoiceDetails(invoice.id, invoice.custid);
    }

    getInvoiceDetails(invoiceId:any, custId:any) {
        const url = "/invoiceDetails/" + invoiceId + "/" + custId;
        this.revenueManagementService.getMethod(url).subscribe(
            (response: any) => {
                this.viewInvoiceData = response.invoiceDetails;
            },
            error => {
                (error: any) => {
                    this.messageService.add({
                        severity: "error",
                        summary: "Error",
                        detail: error.error.ERROR,
                        icon: "far fa-times-circle"
                    });
                };
            }
        );
    }

    invoiceModelClose() {
        this.isInvoiceDetailsModel = false;
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
                        icon: "far fa-times-circle"
                    });
                }
            );
        }
    }

    generatePDFInvoice(custId:any) {
        if (custId) {
            const url = "/generatePdfByInvoiceId/" + custId;
            this.customerManagementService.generateMethodInvoice(url).subscribe(
                (response: any) => {
                    if (response.responseCode == 200) {
                        this.messageService.add({
                            severity: "success",
                            summary: "Success",
                            detail: response.responseMessage,
                            icon: "far fa-times-circle"
                        });
                    } else {
                        this.getMvnoInvoiceList();
                        response.responseCode == 417;
                    }
                    this.messageService.add({
                        severity: "info",
                        summary: "Info",
                        detail: response.responseMessage,
                        icon: "far fa-times-circle"
                    });
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
    }

    chageTypeChange(event: any, dd: any) {
        console.log("dd.selectedOption", dd.selectedOption);
        this.selectedChargeTypeObject = dd.selectedOption;
        let selectedCharge = this.chargeTypes.filter(
            charge =>
                charge.chargeType == dd.selectedOption.text || charge.chargeType == dd.selectedOption.value
        );
        console.log("selected charge LLL", selectedCharge);
        this.customerInvoiceTotalAmount = selectedCharge[0].totalAmount;
        this.debitDocDetailIds = selectedCharge[0].debitDocDetailIds;
    }

    async onFromDateSelect() {
        // this.searchInvoiceChargeForm.controls.fromDate.setValue(
        //   moment(this.searchInvoiceChargeForm.controls.fromDate.value).utc(true).toDate()
        // );
    }

    async onEndDateSelect() {
        // this.searchInvoiceChargeForm.controls.toDate.setValue(
        //   moment(this.searchInvoiceChargeForm.controls.toDate.value).endOf("day").utc(true).toDate()
        // );
    }

    clearSearchForm() {
        console.log("clear :::::::::::");
        this.searchInvoiceChargeForm.controls['fromDate'].setValue("");
        this.searchInvoiceChargeForm.controls['toDate'].setValue("");
        this.isChargeDropdownDisable = true;
        // this.searchInvoiceChargeForm.controls.isInvoiceVoid.setValue(false);
        // this.getCustomerInvoices();
        this.selectedChargeType = "";
        this.selectedChargeTypeObject = "";
        this.customerInvoiceTotalAmount = 0;
    }

    onAddCharge() {
        this.mvnoChagesListFormmArray.push(
            this.fb.group({
                chargeType: this.selectedChargeTypeObject.value,
                chargeTypeText: this.selectedChargeTypeObject.text,
                invoiceAmount: this.customerInvoiceTotalAmount,
                commission: this.commission,
                commissionAmount: this.commissionAmount,
                debitDocDetailIds: [this.debitDocDetailIds]
            })
        );
        this.selectedChargeType = "";
        this.selectedChargeTypeObject = "";
        this.customerInvoiceTotalAmount = 0;
        this.commission = 0;
        this.commissionAmount = 0;
        this.debitDocDetailIds.forEach(s => {
            this.debitDocDetailIdList.push(s);
        });
        this.debitDocDetailIds = [];
        let addedChargeTypes = this.mvnoChagesListFormmArray.value.map((charge:any) => charge.chargeType);

        const filteredChargeTypes = [
            ...this.chargeTypes.filter(chargeType => {
                return !addedChargeTypes.includes(chargeType.chargeType);
            })
        ];
        const filteredCharges = [
            ...this.masterChargeTypeList.filter(chargeType => {
                return !addedChargeTypes.includes(chargeType.value);
            })
        ];
        this.chargeTypes = [...filteredChargeTypes];
        this.chargeTypeList = [...filteredCharges];

        this.totalAmount = this.calculateInvoiceTotalAmount();
        this.addedChargeInvoiceTotalAmount = this.calculateAddedChargeInvoiceTotalAmount();
    }

    deleteAddedCharge(index:any, row:any) {
        let removeCharge = row.value.chargeType;
        this.chargeTypes.push(this.masterChargeTypes.find(charge => charge.chargeType == removeCharge));
        this.chargeTypeList.push(
            this.masterChargeTypeList.find(charge => charge.value == removeCharge)
        );
        this.debitDocDetailIdList = this.debitDocDetailIdList.filter(
            item => !row.value.debitDocDetailIds.includes(item)
        );

        this.mvnoChagesListFormmArray.removeAt(index);
        this.totalAmount = this.calculateInvoiceTotalAmount();
        this.addedChargeInvoiceTotalAmount = this.calculateAddedChargeInvoiceTotalAmount();
    }

    calculateInvoiceTotalAmount(): number {
        return parseFloat(
            this.mvnoChagesListFormmArray.controls
                .reduce((total, control) => {
                    return total + Number(control.get("commissionAmount").value);
                }, 0)
                .toFixed(2)
        );
    }
    

    calculateAddedChargeInvoiceTotalAmount(): number {
        return parseFloat(
            this.mvnoChagesListFormmArray.controls
                .reduce((total, control) => {
                    return total + Number(control.get("invoiceAmount").value);
                }, 0)
                .toFixed(2) // Ensures two decimal places
        );
    }
    

    statusApporeved(invoicedata:any) {
        this.workflowApproveId = invoicedata.id;
        this.approved = true;
        this.approveCAF = [];
        this.selectStaff = null;
        const format = "yyyy-MM-dd";
        const locale = "en-US";

        // const formattedDate = formatDate(invoicedata.paymentdate, format, locale);
        let formattedDate: any = "";
        const regexPattern = /(\d{2})-(\d{2})-(\d{4})/;

        // Use regex to capture day, month, and year components
        const match = regexPattern.exec(invoicedata.paymentdate);

        if (match) {
            // Rearrange the components to form the desired format "yyyy-MM-dd"
            formattedDate = `${match[3]}-${match[2]}-${match[1]}`;
            console.log(formattedDate); // Output: "2024-05-13"
        } else {
            console.log("Invalid date format");
        }
        console.log("Full  date :::", formattedDate);
        let approvedData = {
            customerid: invoicedata.custId,
            // emailreceipt: this.ticketApprRejectData.,
            idlist: Number(invoicedata.id),
            invoiceNumber: invoicedata.invoiceNumber,
            // partnerid: this.ticketApprRejectData,
            // payfromdate: this.ticketApprRejectData.,
            paymode: invoicedata.paymode,
            paystatus: invoicedata.status,
            paytodate: formattedDate,

            // recordfromdate: this.ticketApprRejectData.,
            // recordtodate: this.ticketApprRejectData.,
            referenceno: invoicedata.referenceno,
            remarks: invoicedata.remarks
        };
        const url = "/payment/approve";
        this.searchPaymentService.postMethod(url, approvedData).subscribe(
            (response: any) => {
                response.data;
                this.openCustomersPaymentData(5);
                // this.ApproveRejectModal = false;
                // if (response.payment.dataList) {
                //   this.approved = true;
                //   this.approveCAF = response.payment.dataList;
                //   this.assignCustomerCAFModal = true;
                // } else {
                //   this.searchPayment("");
                // }
                // this.ifApproveStatus = false;
                // this.ticketApprRejectData = [];
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
    bankDataList: any;
    bankDestination: any;

    getBankDetail() {
        const url = "/bankManagement/searchByStatus?banktype=other";
        this.KeyannaCommonBaseService.get(url).subscribe(
            (response: any) => {
                this.bankDataList = response.dataList;
                // this.bankDestination = response.dataList.banktype
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

    async getDunningDisableEnable(id:any, status:any) {
        if (status == true) {
            this.changeStatus = "false";
        }
        if (status == false) {
            this.changeStatus = "true";
        }
        const url =
            "/customer/changedunningenabalestatus?custId=" +
            this.mvnoData.custInvoiceRefId +
            "&dunningStatus=" +
            this.changeStatus;
        this.changeStatus = "";
        this.customerManagementService.getMethod(url).subscribe(
            (response: any) => {
                this.messageService.add({
                    severity: "success",
                    summary: "Successfully",
                    detail: response.msg,
                    icon: "far fa-times-circle"
                });
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
        // setTimeout(async () => {
        //   await this.getCustomersDetail(id);
        // }, 1000);
    }
    pageChangedMasterDunnningList(pageNumber:any) {
        this.currentPageDunningSlab1 = pageNumber;
        this.getDunningData("");
    }

    TotalItemPerPageDunningHistory(event:any) {
        this.showItemPerPage = Number(event.value);
        if (this.currentPageDunningSlab1 > 1) {
            this.currentPageDunningSlab1 = 1;
        }
        this.getDunningData(this.showItemPerPage);
    }
    getDunningData(size:any) {
        console.log(this.mvnoData.custInvoiceRefId);
        let page = this.currentPageDunningSlab1;
        let page_list;
        if (size) {
            page_list = size;
            this.DunningitemsPerPage1 = size;
        } else {
            if (this.showItemPerPage == 0) {
                this.DunningitemsPerPage1 = 5;
            } else {
                this.DunningitemsPerPage1 = 5;
            }
        }
        this.DunningData = [];

        let data = {
            filters: [
                {
                    filterColumn: "customer",
                    filterValue: this.mvnoData.custInvoiceRefId
                }
            ],

            page: page,
            pageSize: this.DunningitemsPerPage1
        };
        const url = "/dunnninghistory/findByPartnerOrCustomerId";
        this.customerManagementService.postMethod(url, data).subscribe(
            (response: any) => {
                this.DunningData = response.customerDunningHistory.content;
                this.DunningtotalRecords1 = response.customerDunningHistory.totalElements;
                console.log("dunningHistoryTotal", this.DunningtotalRecords1);
                console.log("dunnigTotalRecord", this.DunningtotalRecords1);
                //this.auditList = response.dataList;
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
    getCustomerInvoiceList(invoiceId:any, name:any) {
        this.customerInvoiceId = invoiceId;
        this.customerName = name;
        let request = {
            page: this.currentPageinvoiceListdata,
            pageSize: this.invoiceListdataitemsPerPage
        };
        console.log("page;;;;", this.currentPageinvoiceListdata);
        console.log("pageSize;;;;", this.invoiceListdataitemsPerPage);
        const url = `/mvnoInvoice/list/${this.customerInvoiceId}`;
        this.revenueManagementService.postMethod(url, request).subscribe(
            (response: any) => {
                this.viewcustomerInvoiceData = response.mvnoDebitDocDetailsPojos;
                if (this.viewcustomerInvoiceData.length !== 0) {
                    this.displayInvoiceListDialog = true;
                    this.invoiceListDatatotalRecords = response.pageDetails.totalRecords;
                    //   this.invoiceListdataitemsPerPage = response.pageDetails.totalRecordsPerPage;
                    //   this.currentPageinvoiceListdata = response.pageDetails.currentPageNumber;
                } else {
                    this.messageService.add({
                        severity: "info",
                        summary: "Info",
                        detail: "No Customers Found !! ",
                        icon: "far fa-times-circle"
                    });
                }
                console.log("this.viewcustomerFailedPaymentData:::", this.viewcustomerInvoiceData);
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
    closeCustomerInvoiceList() {
        this.displayInvoiceListDialog = false;
        this.currentPageinvoiceListdata = 1;
        this.invoiceListdataitemsPerPage = 5;
    }

    TotalItemPerPageInvoice(event:any) {
        this.showItemPerPage = Number(event.value);
        this.currentPageinvoiceListdata = 1;
        this.invoiceListdataitemsPerPage = this.showItemPerPage;

        this.getCustomerInvoiceList(this.customerInvoiceId, this.customerName);
    }

    pageChangedTrcList(pageNumber:any) {
        console.log("pageNumbe::::r", pageNumber);
        this.currentPageinvoiceListdata = pageNumber;
        console.log("this.invoiceListdataitemsPerPage:::", this.invoiceListdataitemsPerPage);
        this.getCustomerInvoiceList(this.customerInvoiceId, this.customerName);
    }

    customerDetailOpen() {
        this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
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
        console.log("this.custLedgerForm.valid::", this.custLedgerForm);
        if (this.custLedgerForm.valid) {
            this.postdata.CREATE_DATE = this.custLedgerForm.controls['startDateCustLedger'].value;
            this.postdata.END_DATE = this.custLedgerForm.controls['endDateCustLedger'].value;
        }
        this.getCustomersLedger(this.mvnoData.custInvoiceRefId, "");
    }

    clearSearchCustomerLedger() {
        this.postdata.CREATE_DATE = "";
        this.postdata.END_DATE = "";
        this.custLedgerForm.controls['startDateCustLedger'].setValue("");
        this.custLedgerForm.controls['endDateCustLedger'].setValue("");
        this.custLedgerSubmitted = false;
        this.getCustomersLedger(this.mvnoData.custInvoiceRefId, "");
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
                // this.customerLedgerOpen();
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

    pageChangedcustledgerList(pageNumber:any) {
        this.currentPagecustLedgerList = pageNumber;
        this.getCustomersLedger(this.mvnoData.custInvoiceRefId, "");
    }

    TotalLedgerItemPerPage(event:any) {
        this.legershowItemPerPage = Number(event.value);
        if (this.currentPagecustLedgerList > 1) {
            this.currentPagecustLedgerList = 1;
        }
        if (!this.customerLedgerSearchKey) {
            this.getCustomersLedger(this.mvnoData.custInvoiceRefId, this.legershowItemPerPage);
        } else {
            this.searchCustomerLedger();
        }
    }

    transform(value: Date | string, days: number, format: string = "dd-MM-yyyy"): string {
        let date = new Date(value);
        date.setDate(date.getDate() + days);

        return formatDate(date, format, "en-US");
    }

    invoiceRemarks(invoice:any, type:any) {
        this.invoiceID = invoice.id;
        this.invoiceCancelRemarksType = type;
        this.Remark = true;
    }

    cancelRegenrateInvoice() {
        const data = {};

        const url =
            "/cancelAndRegenerate/" +
            this.invoiceID +
            "?isCaf=false&invoiceCancelRemarks=" +
            this.invoiceCancelRemarks;
        this.revenueManagementService.postMethod(url, data).subscribe(
            (response: any) => {
                // this.closebutton.nativeElement.click();
                this.ifInvoicePayment = false;
                this.ispaymentChecked = false;
                this.allIsChecked = false;
                this.isSinglepaymentChecked = false;
                this.invoiceCancelRemarks = null;
                this.invoiceCancelRemarksType = null;
                this.invoicePaymentData = [];
                this.allchakedPaymentData = [];
                this.Remark = false;
                this.getMvnoInvoiceList();

                if (response.responseCode == 417) {
                    this.messageService.add({
                        severity: "info",
                        summary: "Information",
                        detail: response.responseMessage,
                        icon: "far fa-check-circle"
                    });
                } else {
                    this.messageService.add({
                        severity: "success",
                        summary: "Successfully",
                        detail: response.message,
                        icon: "far fa-check-circle"
                    });
                }
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

    closeInvoiceCancelremark() {
        this.Remark = false;
    }

    exportCustomer() {
        this.isExportDialog = true;
        const url = `/mvnoInvoice/exportList/${this.customerInvoiceId}`;
        this.revenueManagementService.postMethodWithData(url).subscribe(
            (response: any) => {
                if (response.dataList.length !== 0) {
                    this.viewcustomerInvoiceData = response.dataList;
                } else {
                    this.messageService.add({
                        severity: "info",
                        summary: "Info",
                        detail: "No Customers Found !! ",
                        icon: "far fa-times-circle"
                    });
                }
                console.log("this.viewcustomerFailedPaymentData:::", this.viewcustomerInvoiceData);
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

    exportCSV() {
        const csvData = this.convertToCSV(this.viewcustomerInvoiceData);
        this.downloadFile(csvData, this.customerName + ".csv");
    }

    convertToCSV(data: any[]): string {
        const headers = this.cols.map(h => h.customExportHeader);
        let csv = headers.join(",") + "\n";
        data.forEach(row => {
            const values = this.cols.map(h => row[h.field]);
            csv += values.join(",") + "\n";
        });

        return csv;
    }

    downloadFile(data: string, filename: string) {
        const file = new Blob([data], { type: "text/csv" });
        // FileSaver.saveAs(file, filename);
    }

    exportPdf() {
        // const file = new Blob([this.viewcustomerInvoiceData], { type: "application/pdf" });
        // const fileURL = URL.createObjectURL(file);
        // FileSaver.saveAs(file, "Customer");

        let z = this.viewcustomerInvoiceData.map((ele: any) => {
            let x = {};
            this.cols.forEach((d: any) => {
                x = { ...x, [d.field]: ele?.[d.field] };
            });
            return x;
        });

        const doc = new jsPDF("l", "mm", "a4");
        let newData = z.map((ele: any) => Object.values(ele));
        autoTable(doc, {
            head: [this.cols.map((e: any) => e.header)],
            body: newData
        });
        doc.save(this.customerName);
    }

    exportExcel() {
        import("xlsx").then(xlsx => {
            let z = this.viewcustomerInvoiceData.map((ele: any) => {
                let x = {};
                this.cols.forEach((d: any) => {
                    x = { ...x, [d.customExportHeader]: ele?.[d.field] };
                });
                return x;
            });
            const worksheet = xlsx.utils.json_to_sheet(z);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
            const excelBuffer: any = xlsx.write(workbook, {
                bookType: "xlsx",
                type: "array"
            });
            this.saveAsExcelFile(excelBuffer, this.customerName);
        });
    }

    saveAsExcelFile(buffer: any, fileName: string) {
        let EXCEL_TYPE =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        // FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    }

    closeExportDialog() {
        this.isExportDialog = false;
    }

    newData(invoice:any) {
        // console.log(invoice.ispPayloadStatusCode, invoice.id);
        const url = `/invoice/reSendPayload/${invoice.id}`;
        this.revenueManagementService.getIspPayload(url).subscribe(
            (response: any) => {
                // if (response.dataList.length !== 0) {
                //     this.viewcustomerInvoiceData = response.dataList;
                // } else {
                //     this.messageService.add({
                //         severity: "info",
                //         summary: "Info",
                //         detail: "No Customers Found !! ",
                //         icon: "far fa-times-circle"
                //     });
                // }
                this.messageService.add({
                    severity: "success",
                    summary: "Successfully",
                    detail: response.msg,
                    icon: "far fa-check-circle"
                });
                this.getMvnoInvoiceList();
                console.log("this.ispPayloadData:::", response);
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
