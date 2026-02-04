import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { BehaviorSubject } from "rxjs";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { RecordPaymentService } from "src/app/service/record-payment.service";
import { MessageService } from "primeng/api";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Regex } from "src/app/constants/regex";
import { SearchPaymentService } from "src/app/service/search-payment.service";
// import * as FileSaver from "file-saver";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";

declare var $: any;

@Component({
    selector: "app-customer-payment",
    templateUrl: "./customer-payment.component.html",
    styleUrls: ["./customer-payment.component.scss"],
    standalone: false
})
export class CustomerPaymentComponent implements OnInit {
    custType: any;
    loggedInStaffId = localStorage.getItem("userId");
    partnerId = Number(localStorage.getItem("partnerId"));
    customerId: number;
    showError: boolean = false;
    customerLedgerDetailData: any;
    isDisable: boolean = false;
    customerPaymentdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
    paymentShowItemPerPage = 1;
    viewcustomerPaymentData: any;
    pageITEM = RadiusConstants.ITEMS_PER_PAGE;
    invoiceList:any[] = [];
    masterSelected: boolean;
    invoicedropdownValue = [{ docnumber: "Advance", id: 0 }];
    customerData: any;
    paymentFormGroup: FormGroup;
    searchData: any = {};
    chequeDetail:any[] = [];
    showChequeDetails: boolean = false;
    AclClassConstants;
    AclConstants;
    currentPagecustomerPaymentdata = 1;
    newFirst = 0;
    selectedInvoice: any = [];
    isSelectedInvoice = true;
    tdsPercent: number;
    abbsPercent: number;
    isShowInvoiceList: boolean = false;
    destinationbank: boolean = false;
    Amount: any = 0;
    isTdsFlag: boolean = false;
    isAbbsFlag: boolean = false;
    chequeDateName = "Cheque Date";
    paymentMode:any[] = [];
    test: any = "true";
    fileName: any;
    file: any = "";
    submitted = false;
    createPaymentData: any;
    pageLimitOptions = RadiusConstants.pageLimitOptions;
    paymentId = new BehaviorSubject({
        paymentId: ""
    });
    displayInvoiceDetails: boolean = false;
    currency: string;
    displayRecordPaymentDialog: boolean = false;
    displayFailedPaymentDialog: boolean = false;
    displaySelectInvoiceDialog: boolean = false;
    recordPaymentAccess: boolean = false;
    selectedCheckboxStates: boolean[] = [];
    viewcustomerFailedPaymentData: any = [];
    customerPaymentdatatotalRecords:any;
    bankDataList: any;
    bankDestination: any;

    constructor(
        private spinner: NgxSpinnerService,
        public PaymentamountService: PaymentamountService,
        private customerManagementService: CustomermanagementService,
        private revenueManagementService: RevenueManagementService,
        private route: ActivatedRoute,
        private router: Router,
        private recordPaymentService: RecordPaymentService,
        private messageService: MessageService,
        private fb: FormBuilder,
        private searchPaymentService: SearchPaymentService,
        public loginService: LoginService,
        public commondropdownService: CommondropdownService,
        public KeyannaCommonBaseService: KeyannaCommonBaseService,
        private systemService: SystemconfigService
    ) {
        this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
        this.custType = this.route.snapshot.parent.paramMap.get("custType")!;

        this.recordPaymentAccess = loginService.hasPermission(
            this.custType == "Prepaid"
                ? PRE_CUST_CONSTANTS.PRE_CUST_PAYMENT_RECORD
                : POST_CUST_CONSTANTS.POST_CUST_PAYMENT_RECORD
        );
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;

        this.AclClassConstants = AclClassConstants;
        this.AclConstants = AclConstants;
        this.systemService.getConfigurationByName("TDS").subscribe((res: any) => {
            this.tdsPercent = res.data.value;
        });
        this.systemService.getConfigurationByName("ABBS").subscribe((res: any) => {
            this.abbsPercent = res.data.value;
        });
    }

    async ngOnInit() {
        this.selectedCheckboxStates = this.invoiceList.map(invoice => invoice.isSelected);
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

        this.getCustomersDetail(this.customerId);
        this.getPaymentMode();
        this.resetPayMode();
        this.getBankDetail();
        this.getBankDestinationDetail();

        this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
            this.currency = res.data.value;
        });
    }

    customerDetailOpen() {
        this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
    }

    getCustomersDetail(custId:any) {
        const url = "/customers/" + custId;
        this.customerManagementService.getMethod(url).subscribe((response: any) => {
            this.customerLedgerDetailData = response.customers;
            this.openCustomersPaymentData(this.customerId, "");
        });
    }

    openCustomersPaymentData(id:any, size:any) {
        if (
            this.customerLedgerDetailData.parentCustomerId == "null" ||
            this.customerLedgerDetailData.invoiceType == "Group"
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

        const url = "/paymentHistory/" + id;
        this.revenueManagementService.paymentData(url).subscribe((response: any) => {
            this.viewcustomerPaymentData = response.dataList;
            this.InvoiceListByCustomer(id);
        });
    }

    InvoiceListByCustomer(id:any) {
        const url = "/invoiceList/byCustomer/" + id;
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

    getCustomer() {
        this.displayRecordPaymentDialog = true;

        const url = "/customers/list";
        const custerlist = {};
        this.recordPaymentService.postMethod(url, custerlist).subscribe(
            (response: any) => {
                this.customerData = response.customerList;
                this.paymentFormGroup.patchValue({
                    customerid: this.customerLedgerDetailData.id
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

    openPaymentInvoiceModal(id:any, paymentId:any) {
        console.log(">>>>method call>>>>");
        console.log(id);
        // this.PaymentamountService.show(id);
        this.displayInvoiceDetails = true;
        this.paymentId.next({
            paymentId
        });
    }

    downloadInvoice(docId:any, custId:any, fileName:any) {
        const url = "/documentForInvoice/download/" + docId + "/" + custId;
        this.revenueManagementService.downloadInvoice(url).subscribe(
            (response: any) => {
                var fileType = "";
                var file = new Blob([response], { type: "application/pdf" });
                var fileURL = URL.createObjectURL(file);
                // FileSaver.saveAs(file, fileName);
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
        this.openCustomersPaymentData(this.customerId, "");
    }

    TotalPaymentItemPerPage(event:any) {
        this.paymentShowItemPerPage = Number(event.value);
        if (this.currentPagecustomerPaymentdata > 1) {
            this.currentPagecustomerPaymentdata = 1;
        }
        this.openCustomersPaymentData(this.customerLedgerDetailData.id, this.paymentShowItemPerPage);
    }

    modalOpenInvoice(id:any) {
        this.displaySelectInvoiceDialog = true;
        if (id) {
            this.InvoiceListByCustomer(id);
        }
        this.newFirst = 0;
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

    isAllSelectedInvoice() {
        this.masterSelected = this.invoiceList.every(function (item: any) {
            return item.isSelected == true;
        });
        this.getCheckedItemListInvoice();
    }

    keypressId(event: any) {
        const pattern = /[0-9\.]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && event.keyCode != 9 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    onSelectedInvoice(event:any, data:any, isTDS:any, isABBS:any) {
        if (event > 0) {
            this.isSelectedInvoice = false;
            if (isTDS) {
                data.tdsCheck = ((data.testamount * this.tdsPercent) / 100).toFixed(2);
            }
            if (isABBS) {
                data.abbsCheck = ((data.testamount * this.abbsPercent) / 100).toFixed(2);
            }
        } else {
            //   data.includeTds = false;
            //   data.includeAbbs = false;
            data.tdsCheck = 0;
            data.abbsCheck = 0;
        }
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
        this.paymentFormGroup.patchValue({
            invoiceId: this.selectedInvoice.id,
            amount: this.selectedInvoice.refundAbleAmount
        });
        this.isShowInvoiceList = true;
        this.displaySelectInvoiceDialog = false;
        this.newFirst = 0;
    }

    saveSelInvoice() {
        this.modalCloseInvoiceList();
    }

    bindInvoice() {
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
            if (this.paymentFormGroup.controls['paymode'].value) {
                let formPayModeValue = this.paymentFormGroup.controls['paymode'].value.toLowerCase();
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
                this.paymentFormGroup.controls['abbsAmount'].setValue(0);
                this.paymentFormGroup.controls['tdsAmount'].setValue(0);
            } else {
                // if (this.isAbbsFlag) {
                this.paymentFormGroup.controls['abbsAmount'].setValue(abbsAmount);
                // }
                // if (this.isTdsFlag) {
                this.paymentFormGroup.controls['tdsAmount'].setValue(tdsAmount);
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

    closeInvoiceModel() {
        this.invoiceList = [];
        this.masterSelected = false;
        this.displaySelectInvoiceDialog = false;
    }

    onlineSourceData:any[] = [];
    async selPayModeRecord(event:any) {
        this.resetPayMode();
        const payMode = event.value.toLowerCase();
        if (payMode == "POS".toLowerCase() || payMode == "VatReceiveable".toLowerCase()) {
            this.paymentFormGroup.controls['chequedate'].enable();
            this.paymentFormGroup.controls['chequedate'].setValidators([Validators.required]);
            //   this.paymentFormGroup.controls.referenceno.clearValidators();
            this.paymentFormGroup.controls['reciptNo'].enable();
            this.paymentFormGroup.controls['chequedate'].updateValueAndValidity();
            //   this.paymentFormGroup.controls.referenceno.updateValueAndValidity();
            this.paymentFormGroup.updateValueAndValidity();
            this.chequeDateName = "Transaction date";
        } else if (payMode == "Online".toLowerCase()) {
            this.paymentFormGroup.controls['chequedate'].enable();
            this.paymentFormGroup.controls['chequedate'].setValidators([Validators.required]);
            this.paymentFormGroup.controls['chequedate'].updateValueAndValidity();
            //   this.paymentFormGroup.controls.referenceno.setValidators([Validators.required]);
            this.paymentFormGroup.controls['reciptNo'].enable();
            //   this.paymentFormGroup.controls.referenceno.updateValueAndValidity();
            this.chequeDateName = "Transaction date";
        } else if (payMode == "Direct Deposit".toLowerCase()) {
            this.paymentFormGroup.controls['branch'].enable();
            this.paymentFormGroup.controls['chequedate'].enable();
            this.paymentFormGroup.controls['chequedate'].setValidators([Validators.required]);
            this.paymentFormGroup.controls['chequedate'].updateValueAndValidity();
            this.paymentFormGroup.controls['destinationBank'].enable();
            this.paymentFormGroup.controls['destinationBank'].setValidators([Validators.required]);
            //   this.paymentFormGroup.controls.referenceno.clearValidators();
            //   this.paymentFormGroup.controls.referenceno.updateValueAndValidity();
            this.paymentFormGroup.controls['reciptNo'].disable();
            this.paymentFormGroup.controls['destinationBank'].updateValueAndValidity();
            this.chequeDateName = "Transaction date";
        } else if (payMode == "NEFT_RTGS".toLowerCase()) {
            this.paymentFormGroup.controls['bankManagement'].enable();
            this.paymentFormGroup.controls['bankManagement'].setValidators([Validators.required]);
            this.paymentFormGroup.controls['bankManagement'].updateValueAndValidity();
            this.paymentFormGroup.controls['destinationBank'].enable();
            this.paymentFormGroup.controls['destinationBank'].setValidators([Validators.required]);
            //   this.paymentFormGroup.controls.referenceno.clearValidators();
            //   this.paymentFormGroup.controls.referenceno.updateValueAndValidity();
            this.paymentFormGroup.controls['reciptNo'].enable();
            this.paymentFormGroup.controls['destinationBank'].updateValueAndValidity();
        } else if (payMode == "Cheque".toLowerCase()) {
            console.log(this.paymentFormGroup.value.chequedate);
            this.paymentFormGroup.controls['chequedate'].enable();
            this.paymentFormGroup.controls['chequedate'].setValidators([Validators.required]);
            this.paymentFormGroup.controls['chequedate'].updateValueAndValidity();
            this.paymentFormGroup.controls['bankManagement'].enable();
            this.paymentFormGroup.controls['bankManagement'].setValidators([Validators.required]);
            this.paymentFormGroup.controls['bankManagement'].updateValueAndValidity();
            this.paymentFormGroup.controls['chequeno'].enable();
            this.paymentFormGroup.controls['chequeno'].setValidators([Validators.required]);
            //   this.paymentFormGroup.controls.referenceno.clearValidators();
            //   this.paymentFormGroup.controls.referenceno.updateValueAndValidity();
            this.paymentFormGroup.controls['reciptNo'].enable();
            this.paymentFormGroup.controls['branch'].enable();
            this.paymentFormGroup.controls['chequeno'].updateValueAndValidity();
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
                    this.paymentFormGroup.controls['onlinesource'].setValidators([Validators.required]);
                    this.paymentFormGroup.controls['onlinesource'].updateValueAndValidity();
                } else {
                    this.paymentFormGroup.controls['onlinesource'].clearValidators();
                    this.paymentFormGroup.controls['onlinesource'].updateValueAndValidity();
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
    }

    resetPayMode() {
        this.paymentFormGroup.controls['chequeno'].disable();
        this.paymentFormGroup.controls['chequedate'].disable();
        this.paymentFormGroup.controls['bankManagement'].disable();
        this.paymentFormGroup.controls['branch'].disable();
        this.paymentFormGroup.controls['destinationBank'].disable();
        this.paymentFormGroup.controls['reciptNo'].enable();
        this.chequeDateName = "Cheque Date";
        // this.paymentFormGroup.controls.referenceno.clearValidators();
        // this.paymentFormGroup.controls.referenceno.updateValueAndValidity();
        this.paymentFormGroup.controls['chequedate'].setValidators([]);
        this.paymentFormGroup.controls['destinationBank'].setValidators([]);
        this.paymentFormGroup.controls['bankManagement'].setValidators([]);
        this.paymentFormGroup.controls['chequeno'].setValidators([]);
        this.paymentFormGroup.controls['onlinesource'].setValidators([]);
        this.paymentFormGroup.updateValueAndValidity();
    }

    getBankDetail() {
        const url = "/bankManagement/searchByStatus?banktype=other";
        this.KeyannaCommonBaseService.get(url).subscribe(
            (response: any) => {
                this.bankDataList = response.dataList;
                // this.bankDestination = response.dataList.banktype
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

    getBankDestinationDetail() {
        const url = "/bankManagement/searchByStatus?banktype=operator";
        this.KeyannaCommonBaseService.get(url).subscribe(
            (response: any) => {
                // this.bankDataList = response.dataList.banktype;
                this.bankDestination = response.dataList;
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

    getPaymentMode() {
        const url = "/commonList/paymentMode";
        this.commondropdownService.getMethodWithCache(url).subscribe(
            (response: any) => {
                this.paymentMode = response.dataList;
            },
            (error: any) => { }
        );
    }

    selPaySourceRecord(event:any) {
        const paySource = event.value.toLowerCase();
        console.log("paySource :::: ", paySource);

        switch (paySource) {
            case "cash_via_bank":
                this.paymentFormGroup.controls['destinationBank'].enable();
                this.paymentFormGroup.controls['destinationBank'].setValidators([Validators.required]);
                this.paymentFormGroup.controls['destinationBank'].updateValueAndValidity();
                this.paymentFormGroup.controls['branch'].enable();
                break;
            case "cash_in_hand":
                this.paymentFormGroup.controls['destinationBank'].disable();
                this.paymentFormGroup.controls['destinationBank'].clearValidators();
                this.paymentFormGroup.controls['destinationBank'].updateValueAndValidity();
                this.paymentFormGroup.controls['branch'].disable();
                break;
            case "cheque_in_hand":
                this.paymentFormGroup.controls['chequedate'].enable();
                this.paymentFormGroup.controls['chequedate'].setValidators([Validators.required]);
                this.paymentFormGroup.controls['chequedate'].updateValueAndValidity();
                this.paymentFormGroup.controls['bankManagement'].enable();
                this.paymentFormGroup.controls['bankManagement'].setValidators([Validators.required]);
                this.paymentFormGroup.controls['bankManagement'].updateValueAndValidity();
                this.paymentFormGroup.controls['chequeno'].enable();
                this.paymentFormGroup.controls['chequeno'].setValidators([Validators.required]);
                // this.paymentFormGroup.controls.referenceno.clearValidators();
                // this.paymentFormGroup.controls.referenceno.updateValueAndValidity();
                this.paymentFormGroup.controls['reciptNo'].enable();
                this.paymentFormGroup.controls['branch'].enable();
                this.paymentFormGroup.controls['chequeno'].updateValueAndValidity();
                break;
        }
    }

    onFileChange(event:any) {
        if (event.target.files.length > 0) {
            this.file = "";
            this.fileName = event.target.files[0].name;
            this.file = event.target.files[0];
        }
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
            }
            const maxSize = 1048576; // 1MB
            if (this.file && this.file.size > maxSize) {
                this.messageService.add({
                    severity: "info",
                    summary: "Info",
                    detail: "File size cannot exceed 1MB.",
                    icon: "far fa-info-circle"
                });
                return;
            } else {
                const url = "/record/payment";
                this.paymentFormGroup.value.customerid = this.customerLedgerDetailData.id;
                console.log(this.paymentFormGroup.value);
                this.paymentFormGroup.value.type = "Payment";
                this.createPaymentData = this.paymentFormGroup.value;
                this.createPaymentData.onlinesource = this.paymentFormGroup.controls['onlinesource'].value;
                if (this.paymentFormGroup.controls['chequedate'].value) {
                    this.createPaymentData.chequedate = this.paymentFormGroup.controls['chequedate'].value;
                    this.createPaymentData.chequedatestr = this.paymentFormGroup.controls['chequedate'].value;
                }
                this.createPaymentData.filename = this.fileName;
                let invoiceId:any = [];
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
                        this.openCustomersPaymentData(this.customerId, "");
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

    closePaymentForm() {
        this.paymentFormGroup.reset();
        this.displayRecordPaymentDialog = false;
        this.submitted = false;
        this.isShowInvoiceList = false;
        this.selectedInvoice = [];
        this.file = "";
        this.fileName = null;
    }

    getFailedPayments() {
        this.viewcustomerFailedPaymentData = [];
        const url = "/onlinePayAudit/allByCustId?custId=" + this.customerId;
        this.customerManagementService.getMethod(url).subscribe(
            (response: any) => {
                this.viewcustomerFailedPaymentData = response.onlineAuditData;
                if (this.viewcustomerFailedPaymentData.length !== 0) {
                    this.displayFailedPaymentDialog = true;
                } else {
                    this.messageService.add({
                        severity: "info",
                        summary: "Info",
                        detail: "No Payment Found !! ",
                        icon: "far fa-times-circle"
                    });
                }
                console.log("this.viewcustomerFailedPaymentData:::", this.viewcustomerFailedPaymentData);
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
    closeFailedPaymentForm() {
        this.displayFailedPaymentDialog = false;
    }
}
