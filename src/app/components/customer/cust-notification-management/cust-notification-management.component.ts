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
    selector: "app-cust-notification-management",
    templateUrl: "./cust-notification-management.component.html",
    styleUrls: ["./cust-notification-management.component.css"],
    standalone: false
})
export class CustNotificationManagementComponent implements OnInit {
  custData: any = {};
  customerId = 0;
  custType: string = "";

  notificationusername: string;

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 1;
  NotificationData: any = [];
  currentPageNotificationSlab1 = 1;
  NotificationitemsPerPage1 = RadiusConstants.ITEMS_PER_PAGE;
  NotificationtotalRecords1: any;
  notificationList: any = [];
  notificationData: any;
  notificationManagementAccess: boolean = false;
  changeStatus: string;

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
    this.notificationManagementAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_NOTIFICATION_STATUS
        : POST_CUST_CONSTANTS.POST_CUST_NOTIFICATION_STATUS
    );
  }

  ngOnInit(): void {
    if (history.state.data) {
      this.custData = history.state.data;
      this.getNotificationData(this.custData.username, "");
    } else this.getCustomersDetail(this.customerId);
  }

  getCustomersDetail(custId:any) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.custData = response.customers;
      this.getNotificationData(this.custData.username, "");
    });
  }
  customerDetailOpen() {
    this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
  }

  getNotificationData(notificationusername:any, size:any) {
    let page = this.currentPageNotificationSlab1;
    this.notificationusername = notificationusername;
    let page_list;
    if (size) {
      page_list = size;
      this.NotificationitemsPerPage1 = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.NotificationitemsPerPage1 = 5;
      } else {
        this.NotificationitemsPerPage1 = 5;
      }
    }
    this.NotificationData = [];

    let data = {
      filters: [
        {
          filterColumn: "customer",
          filterValue: notificationusername,
        },
      ],

      page: page,
      pageSize: this.NotificationitemsPerPage1,
    };
    const url = "/findByCustomerUsername";
    this.customerManagementService.notidicationpostMethod(url, data).subscribe(
      (response: any) => {
        this.NotificationData = response.customerNotificationHistory.content;
        this.NotificationtotalRecords1 = response.customerNotificationHistory.totalElements;
        console.log("dunningHistoryTotal", this.NotificationtotalRecords1);
        console.log("dunnigTotalRecord", this.NotificationtotalRecords1);
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

  async getNotificationDisableEnable(id:any, status:any, e:any) {
    e.preventDefault();
    if (status == null) {
      this.changeStatus == "true";
    }
    if (status == true) {
      this.changeStatus = "false";
    }
    if (status == false) {
      this.changeStatus = "true";
    }
    const url =
      "/customer/changenotificationenabalestatus?custId=" +
      id +
      "&notificationStatus=" +
      this.changeStatus;
    this.changeStatus = "";
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.msg,
          icon: "far fa-times-circle",
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
    setTimeout(async () => {
      await this.getCustomersDetail(id);
    }, 1000);
  }
  pageChangedMasterNotificationList(pageNumber:any) {
    this.currentPageNotificationSlab1 = pageNumber;
    this.getNotificationData(this.notificationusername, "");
  }

  TotalItemPerPageNotificationHistory(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageNotificationSlab1 > 1) {
      this.currentPageNotificationSlab1 = 1;
    }
    this.getNotificationData(this.notificationusername, this.showItemPerPage);
  }
}
