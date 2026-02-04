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
    selector: "app-cust-workflow-audit",
    templateUrl: "./cust-workflow-audit.component.html",
    styleUrls: ["./cust-workflow-audit.component.css"],
    standalone: false
})
export class CustWorkflowAuditComponent implements OnInit {
  custData: any = {};
  customerId = 0;
  custType: string = "";

  customerStatusDetail: any;
  workflowAuditData: any = [];

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  currentPageMasterSlab = 1;
  MasteritemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  MastertotalRecords: any;
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
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
  }

  ngOnInit(): void {
    if (history.state.data) this.custData = history.state.data;
    else this.getCustomersDetail(this.customerId);
    this.getCustomerTeamHierarchy(this.customerId);
    this.getworkflowAuditDetails("", "CAF");
  }

  getCustomersDetail(custId:any) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.custData = response.customers;
    });
  }
  customerDetailOpen() {
    this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
  }

  getCustomerTeamHierarchy(custId:any) {
    const url = `/teamHierarchy/getApprovalProgress?entityId=${custId}&eventName=CAF`;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.customerStatusDetail = response.dataList;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.msg,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  getworkflowAuditDetails(size:any, name:any) {
    let page = this.currentPageMasterSlab;
    let page_list;
    if (size) {
      page_list = size;
      this.MasteritemsPerPage = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.MasteritemsPerPage = 5;
      } else {
        this.MasteritemsPerPage = 5;
      }
    }

    this.workflowAuditData = [];

    let data = {
      page: page,
      pageSize: this.MasteritemsPerPage,
    };

    let url = "/workflowaudit/list?entityId=" + this.customerId + "&eventName=" + name;

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
    this.currentPageMasterSlab = pageNumber;
    this.getworkflowAuditDetails("", "CAF");
  }

  TotalItemPerPageWorkFlow(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageMasterSlab > 1) {
      this.currentPageMasterSlab = 1;
    }
    this.getworkflowAuditDetails(this.showItemPerPage, "CAF");
  }
}
