import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { BillRunMasterService } from "src/app/service/bill-run-master.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";

@Component({
    selector: "app-invoice-payment-details-modal",
    templateUrl: "./invoice-payment-details-modal.component.html",
    styleUrls: ["./invoice-payment-details-modal.component.css"],
    standalone: false
})
export class InvoicePaymentDetailsModalComponent implements OnInit {
  @Input() dialogId: string;
  @Input() invoiceId: Observable<any>;
  viewInvoicePaymentListData: any;

  currentPageinvoiceMasterSlab = 1;
  invoiceMasteritemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  invoiceMastertotalRecords: String;

  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 0;
  InvoicePaymentList: any = [];
  iNVOICEID: any = "";
  totaladjustedAmount = 0;

  constructor(
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private revenuemanagementservice: RevenueManagementService,
    private billRunMasterService: BillRunMasterService
  ) {}

  ngOnInit(): void {
    this.invoiceId.subscribe(value => {
      if (value.invoiceId) {
        this.iNVOICEID = value.invoiceId;
        this.getpaymentDetail("");
      }
    });
  }

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageinvoiceMasterSlab > 1) {
      this.currentPageinvoiceMasterSlab = 1;
    }
    this.getpaymentDetail(this.showItemPerPage);
  }

  getpaymentDetail(size:any) {
    let page_list;
    if (size) {
      page_list = size;
      this.invoiceMasteritemsPerPage = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.invoiceMasteritemsPerPage = this.pageITEM;
      } else {
        this.invoiceMasteritemsPerPage = this.showItemPerPage;
      }
    }
    this.totaladjustedAmount = 0;
    this.InvoicePaymentList = [];

    // /api/v1/AdjustedPaymentAgainstInvoice/{invoiceId}

    let url = "/AdjustedPaymentAgainstInvoice/" + this.iNVOICEID;
    this.revenuemanagementservice.getMethod(url).subscribe(
      (response: any) => {
        this.InvoicePaymentList = response.Paymentlist;

        this.InvoicePaymentList.forEach((value:any, index:any) => {
          this.totaladjustedAmount =
            this.totaladjustedAmount + Number(this.InvoicePaymentList[index].adjustedAmount);
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

  pageChangedinvoiceMasterList(pageNumber:any) {
    this.currentPageinvoiceMasterSlab = pageNumber;
    this.getpaymentDetail("");
  }
}
