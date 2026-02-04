import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Observable } from "rxjs";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { BillRunMasterService } from "src/app/service/bill-run-master.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";

@Component({
    selector: "app-payment-amount-model",
    templateUrl: "./payment-amount-model.component.html",
    styleUrls: ["./payment-amount-model.component.css"],
    standalone: false
})
export class PaymentAmountModelComponent implements OnInit {
  @Input() dialogId: string;
  @Input() paymentId: Observable<any>;
  @Output() closeParentCustt = new EventEmitter();
  viewPaymentListData: any;

  currentPageMasterSlab = 1;
  MasteritemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  MastertotalRecords: number;

  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 0;
  PaymentList: any = [];
  paymentID: any = "";
  totaladjustedAmount = 0;
  displayInvoiceDetails: boolean = false;

  constructor(
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private revenueManagementService: RevenueManagementService,
    private billRunMasterService: BillRunMasterService
  ) {}

  ngOnInit(): void {
    this.displayInvoiceDetails = true;
    this.paymentId.subscribe(value => {
      if (value.paymentId) {
        this.paymentID = value.paymentId;
        this.getpaymentDetail("");
      }
    });
  }

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageMasterSlab > 1) {
      this.currentPageMasterSlab = 1;
    }
    this.getpaymentDetail(this.showItemPerPage);
  }

  getpaymentDetail(size:any) {
    let page_list;
    if (size) {
      page_list = size;
      this.MasteritemsPerPage = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.MasteritemsPerPage = this.pageITEM;
      } else {
        this.MasteritemsPerPage = this.showItemPerPage;
      }
    }
    this.totaladjustedAmount = 0;
    this.PaymentList = [];

    console.log(" this.paymentID : ", this.paymentID);
    let url = "/invoicemapping/" + this.paymentID;
    this.revenueManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.PaymentList = response.Invoicelist;

        this.PaymentList.forEach((value:any, index:any) => {
          this.totaladjustedAmount =
            this.totaladjustedAmount + Number(this.PaymentList[index].adjustedAmount);
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

  pageChangedMasterList(pageNumber:any) {
    this.currentPageMasterSlab = pageNumber;
    this.getpaymentDetail("");
  }

  closeDisplayInvoiceDetails() {
    this.closeParentCustt.emit();
    this.displayInvoiceDetails = false;
  }
}
