import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DatePipe, formatDate } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { BehaviorSubject } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
declare var $: any;
@Component({
    selector: "app-cust-audit-details",
    templateUrl: "./cust-audit-details.component.html",
    styleUrls: ["./cust-audit-details.component.css"],
    standalone: false
})
export class CustAuditDetailsComponent implements OnInit {
  custData: any = {};
  customerId = 0;
  custType: string = "";

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  auditData: any = [];
  currentPageAuditSlab1 = 1;
  AudititemsPerPage1 = RadiusConstants.ITEMS_PER_PAGE;
  AudittotalRecords1: any;
  auditList: any = [];
  sortOrder = 0;
  showItemPerPage = 1;

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    public datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private customerManagementService: CustomermanagementService,
    public PaymentamountService: PaymentamountService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;

    if (history.state.data) this.custData = history.state.data;
    else this.getCustomersDetail(this.customerId);
    this.getAuditData("");
  }

  getCustomersDetail(custId: any) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.custData = response.customers;
    });
  }
  customerDetailOpen() {
    this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
  }

  getAuditData(size:any) {
    let page = this.currentPageAuditSlab1;
    let page_list;
    if (size) {
      page_list = size;
      this.AudititemsPerPage1 = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.AudititemsPerPage1 = 5;
      } else {
        this.AudititemsPerPage1 = 5;
      }
    }
    this.auditData = [];

    let data = {
      page: page,
      pageSize: this.AudititemsPerPage1,
      sortBy: "id",
      sortOrder: 0,
    };
    const url = "/auditLog/getAuditList/" + this.customerId;
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.auditData = response.dataList;
        this.AudittotalRecords1 = response.totalRecords;
        //this.auditList = response.dataList;
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

  pageChangedAuditList(pageNumber:any) {
    this.currentPageAuditSlab1 = pageNumber;
    this.getAuditData("");
  }

  TotalItemPerPageAudit(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageAuditSlab1 > 1) {
      this.currentPageAuditSlab1 = 1;
    }
    this.getAuditData(event.value);
  }
}
