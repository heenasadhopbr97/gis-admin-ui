import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { BehaviorSubject } from "rxjs";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { MessageService } from "primeng/api";
import { DatePipe } from "@angular/common";
// import * as FileSaver from "file-saver";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
import { LoginService } from "src/app/service/login.service";

@Component({
    selector: "app-cust-session-history",
    templateUrl: "./cust-session-history.component.html",
    styleUrls: ["./cust-session-history.component.scss"],
    standalone: false
})
export class CustSessionHistoryComponent implements OnInit {
  
getCdrDetail(arg0: any,arg1: any) {
throw new Error('Method not implemented.');
}
  custType: any;
  // loggedInStaffId = localStorage.getItem("userId");
  // partnerId = Number(localStorage.getItem("partnerId"));
  customerId: number;
  custData: any = {};

  searchAcctCdrForm: FormGroup;

  groupDataCDR: any[] = [];

  totalCDRRecords: number;
  currentPageCDR = 1;
  itemsPerPageCDR = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPageCDR = 1;
  searchCDRSubmitted: boolean = false;
  exportToExcelAccess: boolean = false;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  constructor(
    private spinner: NgxSpinnerService,
    public PaymentamountService: PaymentamountService,
    private customerManagementService: CustomermanagementService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private datePipe: DatePipe,
    loginService: LoginService
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.exportToExcelAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_SESSION_HISTORY_EXPORT
        : POST_CUST_CONSTANTS.POST_CUST_SESSION_HISTORY_EXPORT
    );
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  async ngOnInit() {
    this.getCustomersDetail(this.customerId);
    this.searchAcctCdrForm = this.fb.group({
      userName: [this.custData.custname],
      framedIpAddress: [""],
      fromDate: [""],
      toDate: [""]
    });
  }

  getCustomersDetail(custId:any) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.custData = response.customers;
      this.searchGroupByNameCDR("");
    });
  }

  customerDetailOpen() {
    this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
  }

  async searchGroupByNameCDR(list:any) {
    let size;
    // this.searchkey = "";
    // this.searchkey2 = "";
    const page = this.currentPageCDR;
    if (list) {
      size = list;
      this.itemsPerPageCDR = list;
    } else {
      size = this.itemsPerPageCDR;
    }
    let f = "";
    let t = "";

    if (this.searchAcctCdrForm.value.fromDate) {
      f = this.datePipe.transform(this.searchAcctCdrForm.controls['fromDate'].value, "yyyy-MM-dd");
    }
    if (this.searchAcctCdrForm.value.toDate) {
      t = this.datePipe.transform(this.searchAcctCdrForm.controls['toDate'].value, "yyyy-MM-dd");
    }

    // this.currentPage = 1;
    this.searchCDRSubmitted = true;
    if (this.searchAcctCdrForm.valid) {
      const userNameForSearch = this.custData.username;
      const framedIpAddress = this.searchAcctCdrForm.value.framedIpAddress
        ? this.searchAcctCdrForm.value.framedIpAddress.trim()
        : "";
      this.groupDataCDR = [];

      this.customerManagementService
        .getAcctCdrDataByUsernameAndcustId(
          userNameForSearch,
          framedIpAddress,
          this.custData.id,
          f,
          t,
          this.currentPageCDR,
          this.itemsPerPageCDR
        )
        .subscribe(
          (response: any) => {
            // this.groupDataCDR = response.acctCdr.content;
            if (!response.infomsg) {
              const groupDataCDR = response.acctCdr.content.filter(
                (name:any) => name.userName == this.custData.username
              );
              this.groupDataCDR = groupDataCDR;
              this.totalCDRRecords = response.acctCdr.totalElements;
            } else {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.infomsg,
                icon: "far fa-times-circle"
              });
            }
          },
          (error: any) => {
            this.totalCDRRecords = 0;
            if (error.error.status == 404) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: error.error.errorMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.ERROR,
                icon: "far fa-times-circle"
              });
            }
          }
        );
    }
  }

  async exportExcel() {
    this.groupDataCDR = [];
    let data = {
      userName: this.custData.username,
      fromDate: this.searchAcctCdrForm.value.fromDate,
      custId: this.custData.id,
      toDate: this.searchAcctCdrForm.value.toDate,
      page: this.currentPageCDR,
      size: this.itemsPerPageCDR
    };
    this.customerManagementService.getAllCDRExportWithCustId(data).subscribe((response: any) => {
      const file = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const fileURL = URL.createObjectURL(file);
      // FileSaver.saveAs(file, "Sheet");
      // if (response.acctCdrList.length > 0) {
      //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.groupDataCDR);
      //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
      //   XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      //   XLSX.writeFile(wb, this.fileNameCDR);

      // } else {
      //
      //   this.messageService.add({
      //     severity: "info",
      //     summary: "Info",
      //     detail: "No record found for export.",
      //     icon: "far fa-times-circle",
      //   });
      // }
    });
  }

  pageCDRChanged(pageNumber:any) {
    this.currentPageCDR = pageNumber;
    this.searchGroupByNameCDR("");
  }

  TotalItemPerCDRPage(event:any) {
    this.showItemPerPageCDR = Number(event.value);
    if (this.currentPageCDR > 1) {
      this.currentPageCDR = 1;
    }
    this.searchGroupByNameCDR(this.showItemPerPageCDR);
  }

  clearSearchCDRForm() {
    this.searchCDRSubmitted = false;
    this.currentPageCDR = 1;
    this.searchAcctCdrForm.reset();
    this.searchGroupByNameCDR("");
  }
}
