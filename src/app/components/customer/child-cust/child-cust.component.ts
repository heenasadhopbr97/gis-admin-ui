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
import { LoginService } from "src/app/service/login.service";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
declare var $: any;
@Component({
    selector: "app-child-cust",
    templateUrl: "./child-cust.component.html",
    styleUrls: ["./child-cust.component.css"],
    standalone: false
})
export class ChildCustComponent implements OnInit {
  custData: any = {};
  customerId = 0;
  custType: string = "";
  checkedList: any = [];
  pageNumberForChildsPage = 1;
  pageSizeForChildsPage = RadiusConstants.ITEMS_PER_PAGE;
  childCustomerDataList: any = [];
  childCustomerDataTotalRecords: number;
  masterSelected: boolean;
  removeAccess: boolean = false;
  makeParentAccess: boolean = false;
  checklist: any;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
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
    private router: Router,
    loginService: LoginService
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.removeAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CHILD_CUSTS_REMOVE
        : POST_CUST_CONSTANTS.POST_CUST_CHILD_CUST_REMOVE
    );
    this.makeParentAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CHILD_CUSTS_MAKE_PARENT
        : POST_CUST_CONSTANTS.POST_CUST_CHILD_CUST_MAKE
    );
  }

  ngOnInit(): void {
    if (history.state.data) {
      this.custData = history.state.data;
      this.getChildCustomers();
    } else this.getCustomersDetail(this.customerId);
  }

  getCustomersDetail(custId:any) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.custData = response.customers;
      this.getChildCustomers();
    });
  }
  customerDetailOpen() {
    this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
  }

  getChildCustomers() {
    const url = `/getAllActualChildCustomer?customerId=${this.customerId}`;
    const data = {
      page: this.pageNumberForChildsPage,
      pageSize: this.pageSizeForChildsPage,
    };
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        // this.assignedInventoryList = res.dataList;
        this.childCustomerDataList = response.customerList;
        this.childCustomerDataTotalRecords = response.pageDetails.totalRecords;
        this.childCustomerDataList.forEach((element:any) => {
          element.isSelected = false;
        });
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

  pageChangeEventForChildCustomers(pageNumber: number) {
    this.pageNumberForChildsPage = pageNumber;
    this.getChildCustomers();
  }

  itemPerPageChangeEvent(event:any) {
    this.pageSizeForChildsPage = Number(event.value);
    this.getChildCustomers();
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll() {
    for (let i = 0; i < this.childCustomerDataList.length; i++) {
      this.childCustomerDataList[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  // Check All Checkbox Checked
  isAllSelected() {
    this.masterSelected = this.childCustomerDataList.every(function (item: any) {
      return item.isSelected == true;
    });
    this.getCheckedItemList();
  }

  // Get List of Checked Items
  getCheckedItemList() {
    this.checkedList = [];
    // this.childCustomerDataList = [];
    for (let i = 0; i < this.childCustomerDataList.length; i++) {
      if (this.childCustomerDataList[i].isSelected) {
        this.checkedList.push(this.childCustomerDataList[i].id);
      }
    }
    // this.childCustomerDataList = JSON.stringify(this.checkedList);
  }

  removeFromParent() {
    const url = `/removeParent`;
    // let data = {
    //   page: this.pageNumberForChildsPage,
    //   pageSize: this.pageSizeForChildsPage,
    // };
    this.customerManagementService.postMethod(url, this.checkedList).subscribe(
      (response: any) => {
        // this.assignedInventoryList = res.dataList;
        this.getChildCustomers();
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

  makeParent(oldParentId: number) {
    if (this.checkedList.length == 1) {
      const url = `/updateParent?newParentId=${this.checkedList[0]}&oldParentId=${oldParentId}`;
      // let data = {
      //   page: this.pageNumberForChildsPage,
      //   pageSize: this.pageSizeForChildsPage,
      // };
      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          // this.assignedInventoryList = res.dataList;
          // this.getChildCustomers();
          // this.listCustomer();
          this.router.navigate(["/home/customer/details/" + this.custType]);

          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Changed parent successfully.",
            icon: "far fa-check-circle",
          });
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
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please select only one customer to make parent.",
        icon: "far fa-times-circle",
      });
    }
  }
}
