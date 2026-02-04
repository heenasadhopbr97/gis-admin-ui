import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { BehaviorSubject } from "rxjs";
import { SystemconfigService } from "src/app/service/systemconfig.service";
declare var $: any;
@Component({
    selector: "app-cust-credit-note",
    templateUrl: "./cust-credit-note.component.html",
    styleUrls: ["./cust-credit-note.component.css"],
    standalone: false
})
export class CustCreditNoteComponent implements OnInit {
openTaxModal(arg0: any) {
throw new Error('Method not implemented.');
}
  @Input() custData: any;
  @Output() backButton = new EventEmitter();
  paymentFormGroup: FormGroup;
  submitted = false;
  customerData: any;
  invoiceList: any = [];
  displayInvoiceDetails: boolean = false;
  createPaymentData: any;
  selectedInvoice: any = [];
  newFirst: number;
  currentPagePaymentSlab = 1;
  paymentitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  paymenttotalRecords = 0;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 0;
  searchPaymentData: any = [];
  totalPaymentListLength = 0;
  paymentId = new BehaviorSubject({
    paymentId: "",
  });
  CustomerId = "";
  currency: string;
  invoiceListModal: boolean = false;

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private customerManagementService: CustomermanagementService,
    public PaymentamountService: PaymentamountService,
    private systemService: SystemconfigService
  ) {}

  ngOnInit(): void {
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
    this.CustomerId = this.custData.id;
    this.searchPayment("");
    this.getCustomer();
    this.getInvoiceByCustomer();

    this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
      this.currency = res.data.value;
    });
  }

  addNewCreditNote() {
    this.paymentFormGroup.controls['paymentreferenceno'].disable();
    this.paymentFormGroup.controls['customerid'].disable();
    this.paymentFormGroup.patchValue({
      paymode: "Credit Note",
      type: "creditnote",
      paytype: "creditnote",
      customerid: this.custData.id,
    });
  }

  getCustomer() {
    const url = "/customers/list";
    const custerlist = {
      page: 1,
      pageSize: 10000,
    };
    this.customerManagementService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        this.customerData = response.customerList;
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

  closeParentCustt() {
    this.displayInvoiceDetails = false;
  }

  getInvoiceByCustomer() {
    const url = "/invoiceListForCreditNote/byCustomer/";
    this.invoiceList = [];

    this.customerManagementService.getMethod(url + this.custData.id).subscribe(
      (response: any) => {
        response.invoiceList.forEach((element:any) => {
          if (element.billrunstatus != "VOID") {
            this.invoiceList.push(element);
          }
        });
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
  addCreditNoteModal: boolean = false;
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
      this.customerManagementService.postMethod(url, formData).subscribe(
        (response: any) => {
          if (response.status == 200) {
            this.submitted = false;
            this.paymentFormGroup.reset();
            this.addCreditNoteModal = true;
            this.searchPayment("");
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

  modalOpenInvoiceList() {
    this.invoiceListModal = true;
    this.newFirst = 0;
    this.selectedInvoice = [];
  }

  modalCloseInvoiceList() {
    this.paymentFormGroup.patchValue({
      invoiceId: this.selectedInvoice.id,
      amount: this.selectedInvoice.refundAbleAmount,
    });
    this.invoiceListModal = false;
    this.newFirst = 0;
  }

  saveSelInvoice() {
    this.modalCloseInvoiceList();
  }

  searchPayment(size:any) {
    let page_list;

    if (size) {
      page_list = size;
      this.paymentitemsPerPage = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.paymentitemsPerPage = this.pageITEM;
      } else {
        this.paymentitemsPerPage = this.showItemPerPage;
      }
    }

    const url =
      "/paymentGateway/payment/search?type=CreditNote&page=" +
      this.currentPagePaymentSlab +
      "&pageSize=" +
      this.paymentitemsPerPage +
      "&customerid=" +
      this.custData.id +
      "&paystatus=&paytodate=&payfromdate=";
    console.log("URL", url);
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.searchPaymentData = response.creditDocumentPojoList;
        if (this.showItemPerPage > this.paymentitemsPerPage) {
          this.totalPaymentListLength = this.searchPaymentData.length % this.showItemPerPage;
        } else {
          this.totalPaymentListLength = this.searchPaymentData.length % this.paymentitemsPerPage;
        }
        this.paymenttotalRecords = response.pageDetails.totalRecords;

        console.log("this.searchPaymentData", this.searchPaymentData);
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

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPagePaymentSlab > 1) {
      this.currentPagePaymentSlab = 1;
    }
    this.searchPayment(this.showItemPerPage);
  }

  pageChangedPaymentList(pageNumber:any) {
    this.currentPagePaymentSlab = pageNumber;
    this.searchPayment("");
  }

  openPaymentInvoiceModal(id:any, paymentId:any) {
    this.PaymentamountService.show(id);
    this.paymentId.next({
      paymentId: paymentId,
    });
  }

  keypressId(event: any) {
    const pattern = /[0-9\.]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && event.keyCode != 9 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
