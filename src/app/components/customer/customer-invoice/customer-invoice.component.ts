import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { ConfirmationService, MessageService } from "primeng/api";
import { InvoiceDetailsService } from "src/app/service/invoice-details.service";
import { BehaviorSubject, Observable, Observer } from "rxjs";
import { InvoicePaymentListService } from "src/app/service/invoice-payment-list.service";
// import * as FileSaver from "file-saver";
import { InvoiceMasterService } from "src/app/service/invoice-master.service";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { RecordPaymentService } from "src/app/service/record-payment.service";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";

declare var $: any;

@Component({
    selector: "app-customer-invoice",
    templateUrl: "./customer-invoice.component.html",
    styleUrls: ["./customer-invoice.component.scss"],
    standalone: false
})
export class CustomerInvoiceComponent implements OnInit {
    custType: any;
    loggedInStaffId = localStorage.getItem("userId");
    partnerId = Number(localStorage.getItem("partnerId"));
    customerId: number;
    searchInvoiceMasterFormGroup: FormGroup;
    currentPageinvoiceMasterSlab = 1;
    pageLimitOptions = RadiusConstants.pageLimitOptions;
    invoiceMasteritemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
    showItemPerPageInvoice = 1;
    pageITEM = RadiusConstants.ITEMS_PER_PAGE;
    invoiceMasterListData: any = [];
    invoicePaymentItemPerPage:any =[]
    customerLedgerDetailData: any;
    invoiceMastertotalRecords: any;
    searchInvoiceData: any;
    isInvoiceSearch = false;
    invoiceID = "";
    custID = 0;
    invoicePaymentData:any[] = [];
    invoicePaymenttotalRecords: number;
    totaladjustedAmount = 0;
    invoiceCancelRemarks:string = null;
    invoiceCancelRemarksType: string = null;
    ifInvoicePayment = false;
    ispaymentChecked = false;
    allIsChecked = false;
    isSinglepaymentChecked = false;
    allchakedPaymentData:any[] = [];
    showdata: any = [];
    planNotes = false;
    currentPageinvoicePaymentList = 1;
    AclClassConstants;
    AclConstants;

    InvoiceDATA = new BehaviorSubject({
        InvoiceDATA: "",
    });
    invoiceId = new BehaviorSubject({
        invoiceId: "",
    });
    isInvoiceDetail = false;
    currency: string;
    Remark: boolean = false;
    displayPaymentDetails: boolean = false;
    generateAccess: boolean = false;
    viewInvoiceAccess: boolean = false;
    invoicePaymentListAccess: boolean = false;
    voidInvoiceAcces: boolean = false;
    reprintInvoiceAccess: boolean = false;
    cancelAndRegenerateAccess: boolean = false;
    constructor(
        private spinner: NgxSpinnerService,
        public PaymentamountService: PaymentamountService,
        private customerManagementService: CustomermanagementService,
        private revenueManagementService: RevenueManagementService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private messageService: MessageService,
        private invoiceDetailsService: InvoiceDetailsService,
        public invoicePaymentListService: InvoicePaymentListService,
        private confirmationService: ConfirmationService,
        private invoiceMasterService: InvoiceMasterService,
        public loginService: LoginService,
        private recordPaymentService: RecordPaymentService,
        private systemService: SystemconfigService
    ) {
        this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
        this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
        this.generateAccess = loginService.hasPermission(
            this.custType == "Prepaid"
                ? PRE_CUST_CONSTANTS.PRE_CUST_INVOICES_GENERATE
                : POST_CUST_CONSTANTS.POST_CUST_INVOICES_GENERATE
        );
        this.invoicePaymentListAccess = loginService.hasPermission(
            this.custType == "Prepaid"
                ? PRE_CUST_CONSTANTS.PRE_CUST_INVOICES_LIST
                : POST_CUST_CONSTANTS.POST_CUST_INVOICES_PAYMENT_LIST
        );
        this.voidInvoiceAcces = loginService.hasPermission(
            this.custType == "Prepaid"
                ? PRE_CUST_CONSTANTS.PRE_CUST_INVOICES_VOID
                : POST_CUST_CONSTANTS.POST_CUST_INVOICES_VOID
        );
        this.reprintInvoiceAccess = loginService.hasPermission(
            this.custType == "Prepaid"
                ? PRE_CUST_CONSTANTS.PRE_CUST_INVOICES_REPRINT
                : POST_CUST_CONSTANTS.POST_CUST_INVOICES_REPRINT
        );
        this.cancelAndRegenerateAccess = loginService.hasPermission(
            this.custType == "Prepaid"
                ? PRE_CUST_CONSTANTS.PRE_CUST_INVOICES_CANCEL_REGENERATE
                : POST_CUST_CONSTANTS.POST_CUST_INVOICES_CANCEL_REGENERATE
        );
        this.viewInvoiceAccess = loginService.hasPermission(
            this.custType == "Prepaid"
                ? PRE_CUST_CONSTANTS.PRE_CUST_INVOICES_VIEW
                : POST_CUST_CONSTANTS.POST_CUST_INVOICES_VIEW
        );
        this.AclClassConstants = AclClassConstants;
        this.AclConstants = AclConstants;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    async ngOnInit() {
        // this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
        this.searchInvoiceMasterFormGroup = this.fb.group({
            billfromdate: [""],
            billrunid: [""],
            billtodate: [""],
            custMobile: [""],
            custname: [""],
            docnumber: [""],
            customerid: [""],
        });

        this.getCustomersDetail(this.customerId);
        this.searchinvoiceMaster(this.customerId, "");

        this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
            this.currency = res.data.value;
        });
    }

    getCustomersDetail(custId:any) {
        const url = "/customers/" + custId;
        this.customerManagementService.getMethod(url).subscribe((response: any) => {
            this.customerLedgerDetailData = response.customers;
        });
    }

    customerDetailOpen() {
        this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
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
            // if (this.showItemPerPageInvoice == 1) {
            this.invoiceMasteritemsPerPage = this.pageITEM;
            // } else {
            //     this.invoiceMasteritemsPerPage = this.showItemPerPageInvoice;
            // }
        }

        let url;
        const dtoData = {
            page: this.currentPageinvoiceMasterSlab,
            pageSize: this.invoiceMasteritemsPerPage,
        };

        this.searchInvoiceMasterFormGroup.value.custMobile = "";
        this.searchInvoiceMasterFormGroup.value.customerid = this.customerId;

        url =
            "/invoice/search?billrunid=" +
            this.searchInvoiceMasterFormGroup.value.billrunid +
            "&docnumber=" +
            this.searchInvoiceMasterFormGroup.value.docnumber.trim() +
            "&customerid=" +
            this.searchInvoiceMasterFormGroup.value.customerid +
            "&billfromdate=" +
            this.searchInvoiceMasterFormGroup.value.billfromdate +
            "&billtodate=" +
            this.searchInvoiceMasterFormGroup.value.billtodate +
            "&custmobile=" +
            this.searchInvoiceMasterFormGroup.value.custMobile.trim() +
            "&isInvoiceVoid=true";
        this.revenueManagementService.postMethod(url, dtoData).subscribe(
            (response: any) => {
                const invoiceMasterListData = response.invoicesearchlist.filter(
                    (invoice:any) => invoice.custType == this.custType
                );
                this.invoiceMasterListData = invoiceMasterListData;
                this.invoiceMastertotalRecords = response.pageDetails.totalRecords;
                // this.invoiceMasterListData = response.invoicesearchlist;

                this.isInvoiceSearch = true;
                // console.log("this.searchPaymentData", this.invoiceMasterListData);
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
        // this.searchInvoiceMasterFormGroup.controls.staffid.setValue("");
        this.invoiceMasterListData = [];
        this.searchinvoiceMaster("", "");
    }

    openInvoiceModal(id:any, invoice:any) {
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
                            icon: "far fa-times-circle",
                        });
                    } else {
                        response.responseCode == 417;
                    }
                    this.messageService.add({
                        severity: "info",
                        summary: "Info",
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

    invoicePaymentList(invoice:any) {
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
            this.displayPaymentDetails = true;
            const url = "/paymentmapping/" + this.invoiceID;
            this.revenueManagementService.getMethod(url).subscribe(
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

    invoiceRemarks(invoice:any, type:any) {
        this.invoiceID = invoice.id;
        this.invoiceCancelRemarksType = type;
        this.Remark = true;
    }

    addInvoiceRemarks() {
        if (this.invoiceCancelRemarksType === "void") {
            this.voidInvoice();
        } else if (this.invoiceCancelRemarksType === "cancelRegenerate") {
            this.cancelRegenrateInvoice();
        }
    }

    voidInvoice(): void {
        // if (invoice) {
        this.confirmationService.confirm({
            message: "Do you wish to VOID this invoice?",
            header: "VOID Invoice Confirmation",
            icon: "pi pi-info-circle",
            accept: () => {
                const url = `/voidInvoice?invoiceId=${this.invoiceID}&invoiceCancelRemarks=${this.invoiceCancelRemarks}`;
                this.revenueManagementService.getMethod(url).subscribe(
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
                        this.searchinvoiceMaster("", "");
                        this.Remark = false;
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
        // }
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
                this.searchinvoiceMaster("", "");
                this.Remark = false;

                if (response.responseCode == 417) {
                    this.messageService.add({
                        severity: "info",
                        summary: "Information",
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
    }

    InvoiceReprint(docnumber:any, custname:any) {
        const url = "/regeneratepdfsub/" + docnumber;
        this.invoiceMasterService.downloadPDF(url).subscribe(
            (response: any) => {
                const file = new Blob([response], { type: "application/pdf" });
                const fileURL = URL.createObjectURL(file);
                // FileSaver.saveAs(file, custname);

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

    viewInvoice(docnumber:any, custname:any) {
        const url = "/regeneratepdfsub/" + docnumber;
        this.invoiceMasterService.downloadPDF(url).subscribe(
            (response: any) => {
                const file = new Blob([response], { type: "application/pdf" });
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL, "_blank");
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

    displayNote(type:any) {
        if (type === "invoice") {
            this.planNotes = false;
            this.showdata = this.invoiceMasterListData.filter(
                (invoice:any) => invoice.billrunstatus === "Cancelled" || invoice.billrunstatus === "VOID"
            );
        }
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

    closeInvoiceCancelremark() {
        this.invoiceCancelRemarks = "";
        this.Remark = false;
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

    pageChangedInvoicePaymentList(pageNumber:any) {
        this.currentPageinvoicePaymentList = pageNumber;
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

                this.displayPaymentDetails = false;
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

    invoicePaymentCloseModal() {
        this.ifInvoicePayment = false;
        this.ispaymentChecked = false;
        this.allIsChecked = false;
        this.isSinglepaymentChecked = false;
        this.invoicePaymentData = [];
        this.allchakedPaymentData = [];

        this.displayPaymentDetails = false;
    }
}
