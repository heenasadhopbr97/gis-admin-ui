import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { BillRunMasterService } from "src/app/service/bill-run-master.service";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { CommondropdownService } from "src/app/service/commondropdown.service";

@Component({
    selector: "app-workflow-audit-details-modal",
    templateUrl: "./workflow-audit-details-modal.component.html",
    styleUrls: ["./workflow-audit-details-modal.component.css"],
    standalone: false
})
export class WorkflowAuditDetailsModalComponent implements OnInit {
  @Input() dialogId: string;
  @Input() auditcustid: Observable<any>;
  @Output() closeParentCustt = new EventEmitter();
  @Input() custName = "";
  viewworkflowAuditDataData: any;

  currentPageMasterSlab = 1;
  MasteritemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  MastertotalRecords: any;

  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 0;
  workflowAuditData:any[] = [];
  discountDetailsData:any[] = [];
  ID: any = "";
  CutomerEventID: any;
  check_Hierachy = "";
  ifAuditStatusDetialShow = false;
  ifDiscountStatusDetialShow = false;
  planStatusDetail: any = [];
  ifStatusDetialhide: boolean;
  modalId: string;
  ifModelIsShow: boolean = false;
  nameTitile = " Partner";
  DiscountPlanID: any;
modalHeaderTitle: any;
  constructor(
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private billRunMasterService: BillRunMasterService,
    private paymentamountService: PaymentamountService,
    public commondropdownService: CommondropdownService
  ) {}

  ngOnInit(): void {
    this.ifModelIsShow = true;
    this.auditcustid.subscribe(value => {
      if (value.auditcustid) {
        this.ID = value.auditcustid;
        this.check_Hierachy = value.checkHierachy;
        this.DiscountPlanID = value.planId;

        this.getAllEvent(this.check_Hierachy);
      }
    });
    this.getworkflowAuditDetails("");
    this.getAllEvent("");
  }

  getAllEvent(check_Hierachy:any) {
    let hierachyValue = check_Hierachy;
    if (this.check_Hierachy == "TerminationCAF") {
      hierachyValue = "TERMINATION";
    }

    const url = "/commonList/hierarchy_event";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        let eventData = response.dataList;
        eventData = response.dataList.filter((element:any) => element.value == hierachyValue);
        if (eventData[0]) {
          this.CutomerEventID = eventData[0].id;
        }
        switch (check_Hierachy) {
          case "TerminationCAF":
            this.ifAuditStatusDetialShow = true;
            this.nameTitile = "Customer Name";
            if (this.CutomerEventID) {
              this.getworkflowAuditDetails("");
            }
            break;
          case "CUSTOMER_SERVICE_ADD":
            this.ifAuditStatusDetialShow = false;
            this.nameTitile = "Customer Service Add";
            if (this.CutomerEventID) {
              this.getHierarchyStatus();
            }
            break;
          // case "CUSTOMER_SERVICE_TERMINATION":
          //   this.ifAuditStatusDetialShow = false;
          //   this.nameTitile = "Customer Service";
          //   if (this.CutomerEventID) {
          //     this.getHierarchyStatus();
          //   }
          //   break;
          case "TERMINATION":
            this.ifAuditStatusDetialShow = false;
            this.nameTitile = "Customer Name";
            this.getHierarchyStatus();
            break;
          case "PAYMENT":
            this.ifAuditStatusDetialShow = false;
            this.nameTitile = "Customer Name";
            this.getHierarchyStatus();
            break;
          case "PLAN":
            this.ifAuditStatusDetialShow = false;
            this.nameTitile = "Plan Name";
            this.getHierarchyStatus();
            break;
          case "PLAN_GROUP":
            this.ifAuditStatusDetialShow = false;
            this.nameTitile = "Plan Name";
            this.getHierarchyStatus();
            break;
          case "CUSTOMER_DISCOUNT":
            this.ifAuditStatusDetialShow = false;
            this.ifDiscountStatusDetialShow = false;
            this.nameTitile = "Customer Name";
            this.getHierarchyStatus();
            break;
          case "BILL_TO_ORGANIZATION":
            this.ifAuditStatusDetialShow = false;
            this.nameTitile = "Workflow Audit";
            this.getHierarchyStatus();
            break;
          case "DOCUMENT_VERIFICATION":
            this.ifAuditStatusDetialShow = false;
            this.nameTitile = "Customer Name";
            this.getHierarchyStatus();
            break;
          case "SHIFT_LOCATION":
            this.ifAuditStatusDetialShow = false;
            this.nameTitile = "Customer Name";
            this.getHierarchyStatus();
            break;
          case "SPECIAL_PLAN_MAPPING":
            this.ifAuditStatusDetialShow = false;
            this.nameTitile = "Customer Name";
            this.getHierarchyStatus();
            break;
          case "CREDIT_NOTE":
            this.ifAuditStatusDetialShow = false;
            this.nameTitile = "Credit Document No";
            this.getHierarchyStatus();
            break;
          case "CUSTOMER_SERVICE_TERMINATION":
            this.ifAuditStatusDetialShow = false;
            this.nameTitile = "Customer Service Terminate";
            if (this.CutomerEventID) {
              this.getworkflowAuditDetails("");
            }
            break;
          case "LEAD":
            this.ifAuditStatusDetialShow = false;
            this.nameTitile = "Lead Name";
            this.getHierarchyStatus();
            break;
          case "PARTNER_BALANCE":
            this.ifAuditStatusDetialShow = false;
            this.nameTitile = "Partner Name";
            this.getHierarchyStatus();
            break;
        }
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

  BackshowAuditData(data:any) {
    this.ifAuditStatusDetialShow = false;
  }

  show_AuditData() {
    this.ifAuditStatusDetialShow = true;
    // if(this.check_Hierachy == 'TerminationCAF'){
    //   this.check_Hierachy = 'CAF'
    //   this.getAllEvent(this.check_Hierachy)
    // }
    // else{
    this.getworkflowAuditDetails("");
    // }
  }

  show_DiscountData() {
    this.ifDiscountStatusDetialShow = true;
    this.getDiscountDetails("");
  }

  ststusData() {
    this.ifAuditStatusDetialShow = false;
    this.ifDiscountStatusDetialShow = false;
  }

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageMasterSlab > 1) {
      this.currentPageMasterSlab = 1;
    }
    this.getworkflowAuditDetails(this.showItemPerPage);
  }

  getworkflowAuditDetails(size:any) {
    let page_list;
    let page = this.currentPageMasterSlab;
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
    this.workflowAuditData = [];

    let data = {
      page: page,
      pageSize: this.MasteritemsPerPage,
    };
    let url = "/workflowaudit/list?entityId=" + this.ID + "&eventName=" + this.check_Hierachy;
    // if (
    //   this.check_Hierachy === "CAF" ||
    //   this.check_Hierachy === "TerminationCAF" ||
    //   this.check_Hierachy === "Termination"
    // ) {
    //   url = "/workflowaudit/list?entityId=" + this.ID + "&eventName=" + this.check_Hierachy;
    // } else if (this.check_Hierachy === "PAYMENT") {
    //   url = "/workflowaudit/list?entityId=" + this.ID + "&eventName=" + this.check_Hierachy;
    // } else if (this.check_Hierachy === "PLAN") {
    //   url = "/workflowaudit/list?entityId=" + this.ID + "&eventName=" + this.check_Hierachy;
    // } else if (this.check_Hierachy === "CUSTOMER_DISCOUNT") {
    //   url = "/workflowaudit/list?entityId=" + this.ID + "&eventName=" + this.check_Hierachy;
    // } else if (this.check_Hierachy === "BILL_TO_ORGANIZATION") {
    //   url = "/workflowaudit/list?entityId=" + this.ID + "&eventName=" + this.check_Hierachy;
    // } else {
    //   url = "/workflowaudit/list?entityId=" + this.ID + "&eventName=" + this.check_Hierachy;
    // }

    this.billRunMasterService.postMethod(url, data).subscribe(
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

  getDiscountDetails(size:any) {
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
    this.discountDetailsData = [];

    let url = "/subscriber/changediscountaudit/" + this.ID;
    this.billRunMasterService.getMethod(url).subscribe(
      (response: any) => {
        this.discountDetailsData = response.dataList;
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
    this.getworkflowAuditDetails("");
  }

  getHierarchyStatus() {
    let url = `/teamHierarchy/getApprovalProgress?entityId=${this.ID}&eventName=${this.check_Hierachy}`;
    // if (this.check_Hierachy == "Termination" || this.check_Hierachy == "TerminationCAF") {
    //   url = `/teamHierarchy/getApprovalProgress?entityId=${this.ID}&eventName=TERMINATION`;
    //   this.nameTitile = "Customer";
    // } else if (this.check_Hierachy == "PAYMENT") {
    //   url = `/teamHierarchy/getApprovalProgress?entityId=${this.ID}&eventName=PAYMENT`;
    //   this.nameTitile = "Customer";
    // } else if (this.check_Hierachy == "PLAN") {
    //   url = `/teamHierarchy/getApprovalProgress?entityId=${this.ID}&eventName=PLAN`;
    //   this.nameTitile = "Plan";
    // } else if (this.check_Hierachy == "CUSTOMER_DISCOUNT") {
    //   url = `/teamHierarchy/getApprovalProgress?entityId=${this.ID}&eventName=CUSTOMER_DISCOUNT`;
    //   this.nameTitile = "Discount";
    // } else if (this.check_Hierachy == "BILL_TO_ORGANIZATION") {
    //   url = `/teamHierarchy/getApprovalProgress?entityId=${this.ID}&eventName=BILL_TO_ORGANIZATION`;
    //   this.nameTitile = "Workflow Audit";
    // }

    this.billRunMasterService.getMethod(url).subscribe(
      (response: any) => {
        this.planStatusDetail = response.dataList;
      },
      (error: any) => {
        if (error.error.status == 417) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle",
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
        }
      }
    );
  }

  closeModal() {
    this.closeParentCustt.emit();
    this.ifAuditStatusDetialShow = false;
    this.ifDiscountStatusDetialShow = false;
    this.paymentamountService.hide(this.dialogId);
    this.ifModelIsShow = false;
  }

  // saveSelstaff() {
  //   this.ifModelIsShow=false;
  // }

  // modalCloseStaff() {
  //   this.ifModelIsShow=false;
  // }

  closeSelectStaff() {
    // this.closeParentCustt.emit();
    this.ifModelIsShow = false;
  }
}
