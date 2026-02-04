import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { MessageService } from "primeng/api";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CustomerInventoryMappingService } from "src/app/service/customer-inventory-mapping.service";
import { StaffService } from "src/app/service/staff.service";
import { BehaviorSubject, Observable, Observer, interval } from "rxjs";

declare var $: any;

@Component({
    selector: "app-customer-change-status",
    templateUrl: "./customer-change-status.component.html",
    styleUrls: ["./customer-change-status.component.scss"],
    standalone: false
})
export class CustomerChangeStatusComponent implements OnInit {
  custType: any;
  loggedInStaffId = localStorage.getItem("userId");
  partnerId = Number(localStorage.getItem("partnerId"));
  customerId: number;

  custChangeStatusConfigitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  changeStatusShowItemPerPage = 1;
  AllcustApproveList: any = [];
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  AclClassConstants;
  AclConstants;
  ifApproveStatus = false;
  approveRejectRemark = "";
  apprRejectCustID = "";
  remark: string;
  assignTerminationForm: FormGroup;
  approved = false;
  staffDataList: any = [];
  approveId: any;
  statusListId: any;
  approveInventoryData:any[] = [];
  selectStaff: any;
  reject = false;
  rejectInventoryData:any[] = [];
  selectStaffReject: any;
  obs$ = interval(1000);
  currentPagecustChangeStatusConfig = 1;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  customerLedgerDetailData: any;
  cafRemainTimeSubscription: any;
  userName: "";
  staffUser: any;
  custChangeStatusConfigtotalRecords:any
  auditcustid = new BehaviorSubject({
    auditcustid: "",
    checkHierachy: "",
    planId: "",
  });
  ifModelIsShow: boolean = false;
  customerTermination: boolean = false;
  assignPlansubmitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public PaymentamountService: PaymentamountService,
    private customerManagementService: CustomermanagementService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    public loginService: LoginService,
    private customerInventoryMappingService: CustomerInventoryMappingService,
    private staffService: StaffService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    this.cafremaingTime();
  }

  async ngOnInit() {
    console.log(":::: CMs change status called: ");
    this.getCustomersDetail(this.customerId);
    this.getapproveStatusList("");
    this.getLoggedinUserData();
    this.assignTerminationForm = this.fb.group({
      remark: [""],
    });
  }

  customerDetailOpen(id:any) {
    this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
  }

  getCustomersDetail(custId:any) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.customerLedgerDetailData = response.customers;
      this.cafremaingTime();
    });
  }

  closeModal() {
    this.ifModelIsShow = false;
  }

  getLoggedinUserData() {
    const staffId = localStorage.getItem("userId");
    this.staffService.getById(staffId).subscribe(
      (response: any) => {
        this.staffUser = response.Staff;
        this.userName = this.staffUser.username;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  getapproveStatusList(size:any) {
    let page_list;
    if (size) {
      page_list = size;
      this.custChangeStatusConfigitemsPerPage = size;
    } else {
      if (this.changeStatusShowItemPerPage == 1) {
        this.custChangeStatusConfigitemsPerPage = this.pageITEM;
      } else {
        this.custChangeStatusConfigitemsPerPage = this.changeStatusShowItemPerPage;
      }
    }
    this.AllcustApproveList = [];
    const url = `/allCustApprove/${this.customerId}`;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 200 || response.status == 200) {
          const list = response.customer;
          for (let i = list.length; i > 0; i--) {
            this.AllcustApproveList.push(list[i - 1]);
          }
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
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

  custTerminationWorkflowAuditopen(id:any, auditcustid:any) {
    this.ifModelIsShow = true;
    this.PaymentamountService.show(id);
    this.auditcustid.next({
      auditcustid: auditcustid,
      checkHierachy: "TERMINATION",
      planId: "",
    });
  }

  pickModalOpen(data:any) {
    let name;
    let entityID;
    name = "TERMINATION";
    entityID = data.customerID;
    let url = "/workflow/pickupworkflow?eventName=" + name + "&entityId=" + entityID;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.getapproveStatusList("");
        this.getCustomersDetail(this.customerId);

        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
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

  approvestatusModalOpen(custId:any, id:any) {
    this.statusListId = id;
    this.ifApproveStatus = true;
    this.apprRejectCustID = custId;
    this.approveRejectRemark = "";
    $("#ApproveRejectModal").modal("show");
  }

  rejectstatusModalOpen(custId:any, id:any) {
    this.statusListId = id;
    this.ifApproveStatus = false;
    this.apprRejectCustID = custId;
    this.approveRejectRemark = "";
    $("#ApproveRejectModal").modal("show");
  }

  StaffReasignListForTermination(id:any) {
    this.remark = this.assignTerminationForm.value.remark;
    let url = `/teamHierarchy/reassignWorkflowGetStaffList?entityId=${id}&eventName=TERMINATION&remark=${this.remark}`;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        }
        if (response.dataList != null) {
          this.staffDataList = response.dataList;
          this.approved = true;
          this.customerTermination = true;
        } else {
          this.customerTermination = false;
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
  closeStaffReasignListForTermination() {
    this.customerTermination = false;
  }
  statusApporevedRejected() {
    this.approveId = this.apprRejectCustID;

    let custstatus = "";
    if (this.ifApproveStatus == true) {
      this.approved = false;
      this.approveInventoryData = [];
      this.selectStaff = null;
      custstatus = "Approved";
    } else {
      this.reject = false;
      this.selectStaffReject = null;
      this.rejectInventoryData = [];
      custstatus = "Rejected";
    }
    const data = {
      id: this.statusListId,
      status: custstatus,
      remarks: this.approveRejectRemark,
    };

    const url =
      "/changeStatusCustomerApprove/" +
      this.apprRejectCustID +
      "?status=" +
      custstatus +
      "&remarks=" +
      this.approveRejectRemark;
    this.customerManagementService.updateMethod(url, data).subscribe(
      (response: any) => {
        $("#ApproveRejectModal").modal("hide");
        if (this.ifApproveStatus == true) {
          if (response.result.dataList) {
            this.approved = true;
            this.approveInventoryData = response.result.dataList;
            $("#assignCustomerInventoryModal").modal("show");
          } else {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-times-circle",
            });
            this.getapproveStatusList("");
            this.getCustomersDetail(this.customerId);
          }
        } else {
          if (response.result.dataList) {
            this.reject = true;
            this.rejectInventoryData = response.result.dataList;
            $("#rejectCustomerInventoryModal").modal("show");
          } else {
            this.getapproveStatusList("");
            this.getCustomersDetail(this.customerId);
          }
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "info",
          summary: "Info",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  assignToStaff(flag:any) {
    let url: any;
    let name: string;
    name = "TERMINATION";
    if (!this.selectStaff && !this.selectStaffReject) {
      url = `/teamHierarchy/assignEveryStaff?entityId=${this.approveId}&eventName=${name}&isApproveRequest=${flag}`;
    } else {
      if (flag) {
        url = `/teamHierarchy/assignFromStaffList?entityId=${this.approveId}&eventName=${name}&nextAssignStaff=${this.selectStaff}&isApproveRequest=${flag}`;
      } else {
        url = `/teamHierarchy/assignFromStaffList?entityId=${this.approveId}&eventName=${name}&nextAssignStaff=${this.selectStaffReject}&isApproveRequest=${flag}`;
      }
    }

    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (flag) {
          if (response.responseCode == 417) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle",
            });
          } else {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Approved Successfully.",
              icon: "far fa-times-circle",
            });
          }
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Rejected Successfully.",
            icon: "far fa-times-circle",
          });
        }
        $("#assignCustomerInventoryModal").modal("hide");
        $("#rejectCustomerInventoryModal").modal("hide");
        this.getapproveStatusList("");
        this.getCustomersDetail(this.customerId);
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  reassignTerminationWorkflow() {
    this.remark = this.assignTerminationForm.value.remark;
    let url: any;
    url = `/teamHierarchy/reassignWorkflow?entityId=${this.customerId}&eventName=TERMINATION&assignToStaffId=${this.selectStaff}&remark=${this.remark}`;

    if (this.selectStaff == undefined) {
      this.messageService.add({
        severity: "info",
        summary: "info",
        detail: "Please select staff for reassign termination workflow",
        icon: "far fa-times-circle",
      });
    } else {
      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.customerTermination = false;
          this.getapproveStatusList("");
          this.getCustomersDetail(this.customerId);
          if (response.responseCode == 417) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle",
            });
          } else {
            // this.getCustomer;
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: "Assigned to the next staff successfully.",
              icon: "far fa-times-circle",
            });
          }
        },
        error => {
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

  pageChangeStatusConfig(currentPage:any) {
    this.currentPagecustChangeStatusConfig = currentPage;
    this.getapproveStatusList("");
  }

  TotalChangeStatusItemPerPage(event:any) {
    this.changeStatusShowItemPerPage = Number(event.value);
    if (this.currentPagecustChangeStatusConfig > 1) {
      this.currentPagecustChangeStatusConfig = 1;
    }
    this.getapproveStatusList(this.changeStatusShowItemPerPage);
  }

  cafremaingTime() {
    console.log(this.customerLedgerDetailData);
    this.cafRemainTimeSubscription = this.obs$.subscribe(e => {
      if (this.customerLedgerDetailData) {
        if (
          this.customerLedgerDetailData.status != "Rejected" &&
          this.customerLedgerDetailData.status != "Terminate" &&
          this.customerLedgerDetailData.status != "Approved"
        ) {
          if (
            this.customerLedgerDetailData.currentAssigneeId == null ||
            this.customerLedgerDetailData.currentAssigneeId !== null
          ) {
            const newYearsDate: any = new Date(
              this.customerLedgerDetailData.nextfollowupdate +
                " " +
                this.customerLedgerDetailData.nextfollowuptime
            );
            const currentDate: any = new Date();
            if (newYearsDate > currentDate) {
              const totalSeconds = (newYearsDate - currentDate) / 1000;
              const minutes = Math.floor(totalSeconds / 60) % 60;
              const hours = Math.floor(totalSeconds / 3600) % 24;
              const days = Math.floor(totalSeconds / 3600 / 24);
              const seconds = Math.floor(totalSeconds) % 60;
              const remainTime =
                ("0" + days).slice(-2) +
                ":" +
                ("0" + hours).slice(-2) +
                ":" +
                ("0" + minutes).slice(-2) +
                ":" +
                ("0" + seconds).slice(-2);

              this.customerLedgerDetailData.remainTime = remainTime;
            } else {
              this.customerLedgerDetailData.remainTime = "00:00:00:00";
            }
          }
        }
      }
    });
  }
}
