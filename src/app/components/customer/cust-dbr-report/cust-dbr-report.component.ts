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
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
declare var $: any;
@Component({
    selector: "app-cust-dbr-report",
    templateUrl: "./cust-dbr-report.component.html",
    styleUrls: ["./cust-dbr-report.component.css"],
    standalone: false
})
export class CustDBRReportComponent implements OnInit {
  custData: any = {};
  customerId = 0;
  custType: string = "";

  searchDBRFormDate: any = "";
  searchDBREndDate: any = "";
  dbrListData: any = [];
  multiServiceData: any = [];
  outStandingData: any;

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  currentPageDBRListdata = 1;
  DBRListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  showItemDBRPerPage = 0;
  DBRListdatatotalRecords: any;

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    public datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private customerManagementService: CustomermanagementService,
    private revenueManagementService: RevenueManagementService,
    public PaymentamountService: PaymentamountService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;

    const now = new Date();
    this.searchDBRFormDate = this.datePipe.transform(now, "yyyy-MM-dd");
    this.searchDBREndDate = this.datePipe.transform(
      new Date(now.setDate(now.getDate() + 30)),
      "yyyy-MM-dd"
    );
    if (history.state.data) this.custData = history.state.data;
    else this.getCustomersDetail(this.customerId);
    this.searchDBR();
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

  searchDBR() {
    let page_list;
    let size = this.showItemDBRPerPage;
    if (size != 0) {
      page_list = size;
      this.DBRListdataitemsPerPage = size;
    } else {
      if (this.showItemDBRPerPage == 0) {
        this.DBRListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
      } else {
        this.DBRListdataitemsPerPage = this.showItemDBRPerPage;
      }
    }

    // this.currentPageDBRListdata = 1;
    let firstDay;
    let lastDay;
    firstDay = this.searchDBRFormDate;
    lastDay = this.searchDBREndDate;
    const url =
      "/getCustomer?custid=" + this.customerId + "&startdate=" + firstDay + "&endate=" + lastDay;
    this.revenueManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.dbrListData = response.customerDBRPojos;
        this.outStandingData = response;
        this.DBRListdatatotalRecords = this.dbrListData.length;
        //this.searchDBRFormDate = ''
        // this.searchDBREndDate = ''
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

  searchClearDBR() {
    this.searchDBRFormDate = "";
    this.searchDBREndDate = "";

    const now = new Date();
    this.searchDBRFormDate = this.datePipe.transform(now, "yyyy-MM-dd");
    this.searchDBREndDate = this.datePipe.transform(
      new Date(now.setDate(now.getDate() + 30)),
      "yyyy-MM-dd"
    );
    this.searchDBR();
  }

  pageChangedDbrList(pageNumber:any) {
    this.currentPageDBRListdata = pageNumber;
  }

  multiService(date: any) {
    let parts_of_date = date.split("-");

    let output =
      parts_of_date[2] +
      "-" +
      (parts_of_date[1].length <= 1 ? "0" + parts_of_date[1] : parts_of_date[1]) +
      "-" +
      (parts_of_date[0].length <= 1 ? "0" + parts_of_date[0] : parts_of_date[0]);

    console.log(output.toString());
    let url = `/getDbrByCustomerIdAndDate?custid=${this.customerId}&startdate=${output}`;
    this.revenueManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.multiServiceData = response;
        $("#multiService").modal("show");
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

  TotalItemDBRPerPage(event:any) {
    this.showItemDBRPerPage = Number(event.value);
    if (this.currentPageDBRListdata > 1) {
      this.currentPageDBRListdata = 1;
    }
    this.searchDBR();
  }
}
