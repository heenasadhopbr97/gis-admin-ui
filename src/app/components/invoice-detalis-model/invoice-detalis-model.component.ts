import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { BillRunMasterService } from "src/app/service/bill-run-master.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { InvoiceDetailsService } from "src/app/service/invoice-details.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";

declare var $: any;

@Component({
    selector: "app-invoice-detalis-model",
    templateUrl: "./invoice-detalis-model.component.html",
    styleUrls: ["./invoice-detalis-model.component.css"],
    standalone: false
})
export class InvoiceDetalisModelComponent implements OnInit {
  @Input() dialogId: string;
  @Input() invoiceID: any;
  @Input() custID: any;
  @Input() InvoiceDATA: Observable<any>;
  @Output() closeInvoiceDetails = new EventEmitter();
  viewbillInvoiceListData: any = {};
  documentDetailId: any = [];
  viewbillInvoiceInventoryListData: any = [];
  debitDocDetails: any = [];
  debitDocumentTAXRels: any = [];
  debitDocumentTAXRelDtos: any = [];
  taxData: any = [];
  taxtype: string = "";
  showInventory: boolean;
  promiseToPay: boolean = false;
  displayInvoiceMasterDetails: boolean = false;
  displayTaxDetails: boolean = false;
  constructor(
    private customerManagementService: CustomermanagementService,
    private invoiceDetailsService: InvoiceDetailsService,
    private revenueManagementService: RevenueManagementService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private billRunMasterService: BillRunMasterService
  ) {}

  ngOnInit(): void {
    this.invoiceDetailsService.show("InvoiceDetailModal");
    this.displayInvoiceMasterDetails = true;
    console.log("url:::::::InvoiceId:" + this.invoiceID + "custid" + this.custID);
    const url = "/invoiceDetails/" + this.invoiceID + "/" + this.custID;
    this.revenueManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.viewbillInvoiceListData = response.invoiceDetails;
        this.debitDocDetails = response.debitDocDetails;
        this.debitDocumentTAXRels = response.debitDocumentTAXRels;
        this.documentDetailId = this.debitDocumentTAXRels.map((item:any) => item.documentDetailId);
        this.debitDocumentTAXRelDtos = response.debitDocumentTAXRelDtos;
        this.viewbillInvoiceInventoryListData =
          this.viewbillInvoiceListData.debitDocumentInventoryRels;
        if (this.viewbillInvoiceInventoryListData != null) this.showInventory = true;
        else this.showInventory = false;
        if (this.viewbillInvoiceListData.ispromiseToPayInOldCPR) this.promiseToPay = true;
        else this.promiseToPay = false;
      },
      error => {}
    );
  }

  openTaxModal(documentDetailId: number, type: string): void {
    this.taxtype = type;
    this.taxData = [];

    const specificDetail = this.debitDocumentTAXRels.filter(
      (detail:any) => detail.documentDetailId === documentDetailId
    );
    if (this.taxtype === "charge") {
      this.taxData = specificDetail;
    } else {
      this.taxData = this.debitDocumentTAXRels;
    }
    if (this.taxData.length > 0) {
      this.displayTaxDetails = true;
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Tax Data Not Found!",
        icon: "far fa-times-circle",
      });
    }
  }

  closeDisplayTaxDetails() {
    this.displayTaxDetails = false;
  }

  openTotalTaxModal(id:any, type:any): void {
    this.taxtype = type;

    this.taxData = this.debitDocumentTAXRelDtos;

    console.log("this.taxData ::::: ", this.taxData);
    if (this.taxData.length > 0) {
      this.displayTaxDetails = true;
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Tax Data Not Found!",
        icon: "far fa-times-circle",
      });
    }
  }

  close() {
    this.closeInvoiceDetails.emit();
    this.displayInvoiceMasterDetails = false;
  }
}
