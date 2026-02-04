import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { MessageService } from "primeng/api";
// import * as moment from "moment";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { LoginService } from "src/app/service/login.service";
import { BehaviorSubject, Observable, Observer } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomerInventoryMappingService } from "src/app/service/customer-inventory-mapping.service";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";

declare var $: any;

@Component({
    selector: "app-customer-change-discount",
    templateUrl: "./customer-change-discount.component.html",
    styleUrls: ["./customer-change-discount.component.scss"],
    standalone: false
})
export class CustomerChangeDiscountComponent implements OnInit {
  custType: any;
  loggedInStaffId = localStorage.getItem("userId");
  partnerId = Number(localStorage.getItem("partnerId"));
  userId = Number(localStorage.getItem("userId"));
  customerId: number;

  customerCustDiscountListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  OlddiscountData:any[] = [];
  CustDiscountShowItemPerPage = 1;
  custCustDiscountList: any = [];
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  customerLedgerDetailData: any;
  AclClassConstants;
  AclConstants;
  maxDiscountValue = 99;
  chargeType = [{ label: "One-time" }, { label: "Recurring" }];
  isnewDiscount: boolean = true;
  approveId: any;
  assignDiscountData: any = [];
  discountFlageType = "";
  AppRjecHeader = "";
  assignAppRejectDiscountForm: FormGroup;
  assignDiscounsubmitted = false;
  approved = false;
  reject = false;
  dateTime:Date;
  rejectInventoryData:any[] = [];
  approveInventoryData:any[] = [];
  selectStaff: any;
  discountId: any;
  selectStaffReject: any;
  newCustomerAddressDataForCustometr: any;
  oldDiscValue: number;
  newDiscValue: number;
  auditcustid = new BehaviorSubject({
    auditcustid: "",
    checkHierachy: "",
    planId: ""
  });
  ifModelIsShow: boolean = false;
  rejectApproveDiscountModal: boolean = false;
  assignCustomerInventoryModal: boolean = false;
  rejectCustomerInventoryModal: boolean = false;
  auditAccess: boolean = false;
  constructor(
    private spinner: NgxSpinnerService,
    public PaymentamountService: PaymentamountService,
    private customerManagementService: CustomermanagementService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    public loginService: LoginService,
    private fb: FormBuilder,
    private customerInventoryMappingService: CustomerInventoryMappingService
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.auditAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CHANGE_DISCOUNT_AUDIT
        : POST_CUST_CONSTANTS.POST_CUST_CHANGE_DISCOUNT
    );
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }

  async ngOnInit() {
    this.assignAppRejectDiscountForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.getCustomersDetail(this.customerId);
    this.getcustDiscountDetails(this.customerId, "", "changeDiscount");
  }

  customerDetailOpen(id:any) {
    this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
  }

  getCustomersDetail(custId:any) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.customerLedgerDetailData = response.customers;
    });
  }

  getcustDiscountDetails(custId:any, size:any, cust360Type = "") {
    let page_list;
    this.OlddiscountData = [];
    if (size) {
      page_list = size;
      this.customerCustDiscountListdataitemsPerPage = size;
    } else {
      if (this.CustDiscountShowItemPerPage == 1) {
        this.customerCustDiscountListdataitemsPerPage = this.pageITEM;
      } else {
        this.customerCustDiscountListdataitemsPerPage = this.CustDiscountShowItemPerPage;
      }
    }

    let custDiscountdatalength = 0;
    let url =
      "/subscriber/fetchCustomerDiscountDetailServiceLevel/" +
      custId +
      "?isExpiredRequired=" +
      (cust360Type === "changeDiscount");
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.custCustDiscountList = response.discountDetails;

        while (custDiscountdatalength < this.custCustDiscountList.length) {
          if (
            this.custCustDiscountList[custDiscountdatalength].discount === null ||
            this.custCustDiscountList[custDiscountdatalength].discount === ""
          ) {
            this.custCustDiscountList[custDiscountdatalength].discount = 0;
          }
          this.custCustDiscountList[custDiscountdatalength].discount = parseFloat(
            this.custCustDiscountList[custDiscountdatalength].discount
          ).toFixed(2);

          if (
            this.custCustDiscountList[custDiscountdatalength].newDiscount === null ||
            this.custCustDiscountList[custDiscountdatalength].newDiscount === ""
          ) {
            this.custCustDiscountList[custDiscountdatalength].newDiscount = 0;
          }
          this.custCustDiscountList[custDiscountdatalength].newDiscount = parseFloat(
            this.custCustDiscountList[custDiscountdatalength].newDiscount
          ).toFixed(2);

          if (
            this.custCustDiscountList[custDiscountdatalength].discountType === null ||
            this.custCustDiscountList[custDiscountdatalength].discountType === ""
          ) {
            this.custCustDiscountList[custDiscountdatalength].discountType = "One-time";
          }
          if (
            this.custCustDiscountList[custDiscountdatalength].newDiscountType === null ||
            this.custCustDiscountList[custDiscountdatalength].newDiscountType === ""
          ) {
            this.custCustDiscountList[custDiscountdatalength].newDiscountType = "One-time";
          }

          if (
            this.custCustDiscountList[custDiscountdatalength].discountExpiryDate !== null &&
            this.custCustDiscountList[custDiscountdatalength].discountExpiryDate !== ""
          ) {
            this.custCustDiscountList[custDiscountdatalength].discountExpiryDate = (
              this.custCustDiscountList[custDiscountdatalength].discountExpiryDate
            )
              .utc(true)
              .toDate();
          }

          if (
            this.custCustDiscountList[custDiscountdatalength].newDiscountExpiryDate !== null &&
            this.custCustDiscountList[custDiscountdatalength].newDiscountExpiryDate !== ""
          ) {
            this.custCustDiscountList[custDiscountdatalength].newDiscountExpiryDate = (
              this.custCustDiscountList[custDiscountdatalength].newDiscountExpiryDate
            )
              .utc(true)
              .toDate();
          }
          custDiscountdatalength++;
        }
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

  changeValue(value:any) {
    if (!value.dirty) {
      this.isnewDiscount = false;
      let msg = "value required";
    }
  }

  custDiscountWorkflowAuditopen(id:any, auditcustid:any, planId:any) {
    this.ifModelIsShow = true;
    this.PaymentamountService.show(id);
    this.auditcustid.next({
      auditcustid,
      checkHierachy: "CUSTOMER_DISCOUNT",
      planId
    });
  }

  closeParentCustt() {
    this.ifModelIsShow = false;
  }

  assignDiscountApprove() {
    this.assignDiscounsubmitted = true;
    if (this.assignAppRejectDiscountForm.valid) {
      let url = "/approveChangeDiscountServiceLevel";

      let assignCAFData = {
        custPackageId: this.assignDiscountData.id,
        flag: this.discountFlageType,
        nextStaffId: 0,
        planId: this.assignDiscountData.planId,
        remark: this.assignAppRejectDiscountForm.controls['remark'].value,
        staffId: localStorage.getItem("userId")
      };

      this.customerManagementService.updateMethod(url, assignCAFData).subscribe(
        (response: any) => {
          this.rejectApproveDiscountModal = false;
          if (response.dataList) {
            if (this.discountFlageType == "approved") {
              this.approved = true;
              this.approveInventoryData = response.dataList;
              this.assignCustomerInventoryModal = true;
            } else {
              this.reject = true;
              this.rejectInventoryData = response.dataList;
              this.rejectCustomerInventoryModal = true;
            }
          } else {
            this.getcustDiscountDetails(this.customerId, "", "changeDiscount");
          }
          this.assignAppRejectDiscountForm.reset();
          this.assignDiscounsubmitted = false;
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
  }

  closeRejectCustomerInventoryModal() {
    this.rejectCustomerInventoryModal = false;
  }

  closeRejectApproveDiscountModal() {
    this.rejectApproveDiscountModal = false;
  }
  closeAssignDiscountModal() {
    this.assignCustomerInventoryModal = false;
  }

  assignToStaff(flag:any) {
    let url: any;
    let name = "CUSTOMER_DISCOUNT";
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
              icon: "far fa-times-circle"
            });
          } else {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Approved Successfully.",
              icon: "far fa-times-circle"
            });
          }
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Rejected Successfully.",
            icon: "far fa-times-circle"
          });
        }
        this.assignCustomerInventoryModal = false;
        this.rejectCustomerInventoryModal = false;

        this.getcustDiscountDetails(this.customerId, "", "changeDiscount");
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  pickModalOpen(data:any) {
    let name;
    let entityID;

    name = "CUSTOMER_DISCOUNT";
    entityID = data.id;

    let url = "/workflow/pickupworkflow?eventName=" + name + "&entityId=" + entityID;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        console.log(this.newCustomerAddressDataForCustometr);
        this.getcustDiscountDetails(this.customerId, "", "changeDiscount");

        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        }
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

  discountApporeved(data:any) {
    this.approveId = data.id;
    this.rejectApproveDiscountModal = true;
    this.assignDiscountData = data;
    this.discountFlageType = "approved";
    this.AppRjecHeader = "Approve ";
    this.assignAppRejectDiscountForm.reset();
  }

  discountRejected(data:any) {
    this.approveId = data.id;
    this.rejectApproveDiscountModal = true;
    this.assignDiscountData = data;
    this.discountFlageType = "Rejected";
    this.AppRjecHeader = "Reject";
    this.assignAppRejectDiscountForm.reset();
  }

  async updateDiscount() {
    const data = [];

    for (let index = 0; index < this.custCustDiscountList.length; index++) {
      if (
        this.custCustDiscountList[index].discount !==
          this.custCustDiscountList[index].newDiscount ||
        this.custCustDiscountList[index].discountType !==
          this.custCustDiscountList[index].newDiscountType ||
        this.custCustDiscountList[index].discountExpiryDate !==
          this.custCustDiscountList[index].newDiscountExpiryDate
      ) {
        data.push({
          id: this.custCustDiscountList[index].id,
          custId: this.custCustDiscountList[index].custId,
          connectionNo: this.custCustDiscountList[index].connectionNo,
          serviceName: this.custCustDiscountList[index].serviceName,
          serviceId: this.custCustDiscountList[index].serviceId,
          invoiceType: this.custCustDiscountList[index].invoiceType,
          discount: this.custCustDiscountList[index].discount,
          newDiscount: this.custCustDiscountList[index].newDiscount,
          remarks: this.custCustDiscountList[index].remarks,
          status: this.custCustDiscountList[index].status,
          discountType:
            this.custCustDiscountList[index].discountType === null
              ? "One-time"
              : this.custCustDiscountList[index].discountType,
          newDiscountType:
            this.custCustDiscountList[index].newDiscountType === null
              ? "One-time"
              : this.custCustDiscountList[index].newDiscountType,
          // discountExpiryDate: moment(
          //   this.custCustDiscountList[index].discountExpiryDate,
          //   "DD/MM/YYYY"
          // )
          //   .utc(true)
          //   .toDate(),
          // newDiscountExpiryDate:
          //   this.custCustDiscountList[index].newDiscountType === null ||
          //   this.custCustDiscountList[index].newDiscountType === "One-time"
          //     ? null
          //     : moment(this.custCustDiscountList[index].newDiscountExpiryDate, "DD/MM/YYYY")
          //         .utc(true)
          //         .toDate()
        });
      }
    }

    this.oldDiscValue = 0;
    this.newDiscValue = 0;

    const url =
      "/subscriber/changeCustomerDiscountServiceLevel/" + this.customerLedgerDetailData.id;
    if (data.length != 0) {
      this.customerManagementService.postMethod(url, data).subscribe(
        (response: any) => {
          this.getcustDiscountDetails(this.customerLedgerDetailData.id, "", "changeDiscount");
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
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
  }

  discountReasignListShiftLocation(data:any) {
    this.approveId = data.id;
    let url = `/teamHierarchy/reassignWorkflowGetStaffList?entityId=${data.id}&eventName=CUSTOMER_DISCOUNT`;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.discountId = data.id;
        this.approveInventoryData = [];
        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        }
        if (response.dataList != null) {
          // this.getCustomer();
          this.approveInventoryData = response.dataList;
          this.approved = true;
          this.assignCustomerInventoryModal = true;
        } else {
          this.assignCustomerInventoryModal = false;
        }

        console.log(response);
      },
      (error: any) => {
        // console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  reassignWorkflowShiftLocation() {
    let url: any;
    url = `/teamHierarchy/reassignWorkflow?entityId=${this.discountId}&eventName=CUSTOMER_DISCOUNT&assignToStaffId=${this.selectStaff}&remark=${this.assignAppRejectDiscountForm.controls['remark'].value}`;

    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.rejectApproveDiscountModal = true;
        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Assigned to the next staff successfully.",
            icon: "far fa-times-circle"
          });
        }
      },
      error => {
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
