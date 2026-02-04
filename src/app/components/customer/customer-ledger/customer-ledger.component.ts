import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { BehaviorSubject } from "rxjs";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { MessageService } from "primeng/api";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";

@Component({
    selector: "app-customer-ledger",
    templateUrl: "./customer-ledger.component.html",
    styleUrls: ["./customer-ledger.component.scss"],
    standalone: false
})
export class CustomerLedgerComponent implements OnInit {
  custType: any;
  loggedInStaffId = localStorage.getItem("userId");
  partnerId = Number(localStorage.getItem("partnerId"));
  customerId: number;

  custLedgerForm: FormGroup;
  customerLedgerSearchKey: string;
  currentPagecustLedgerList = 1;
  legershowItemPerPage = 1;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  custLedgerItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  custLedgerSubmitted = false;
  customerLedgerListData: any;
  customerLedgerDetailData: any;
  custLedgertotalRecords:any;
  postdata: any = {
    CREATE_DATE: "",
    END_DATE: "",
    id: "",
    amount: "",
    balAmount: "",
    custId: "",
    description: "",
    refNo: "",
    transcategory: "",
    transtype: "",
  };

  customerLedgerData: any = {
    title: "",
    firstname: "",
    lastname: "",
    plan: "",
    status: "",
    username: "",
    customerLedgerInfoPojo: {
      openingAmount: "",
      closingBalance: "",
    },
  };
  currency: string;
  constructor(
    private spinner: NgxSpinnerService,
    public PaymentamountService: PaymentamountService,
    private customerManagementService: CustomermanagementService,
    private revenueManagementService: RevenueManagementService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private systemService: SystemconfigService,
    private messageService: MessageService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
  }

  async ngOnInit() {
    this.custLedgerForm = this.fb.group({
      startDateCustLedger: ["", Validators.required],
      endDateCustLedger: ["", Validators.required],
    });
    this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
      this.currency = res.data.value;
    });
    this.getCustomersLedger(this.customerId, "");

    this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
      this.currency = res.data.value;
    });
    this.getCustomersDetail(this.customerId);
  }

  getCustomersDetail(custId:any) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.customerLedgerDetailData = response.customers;
    });
  }

  customerDetailOpen() {
    this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
  }

  searchCustomerLedger() {
    if (
      !this.customerLedgerSearchKey ||
      this.customerLedgerSearchKey !== this.custLedgerForm.value
    ) {
      this.currentPagecustLedgerList = 1;
    }
    this.customerLedgerSearchKey = this.custLedgerForm.value;

    if (this.legershowItemPerPage == 1) {
      this.custLedgerItemPerPage = this.pageITEM;
    } else {
      this.custLedgerItemPerPage = this.legershowItemPerPage;
    }

    this.custLedgerSubmitted = true;
    if (this.custLedgerForm.valid) {
      this.postdata.CREATE_DATE = this.custLedgerForm.controls['startDateCustLedger'].value;
      this.postdata.END_DATE = this.custLedgerForm.controls['endDateCustLedger'].value;
    }
    this.getCustomersLedger(this.customerId, "");
  }

  clearSearchCustomerLedger() {
    this.postdata.CREATE_DATE = "";
    this.postdata.END_DATE = "";
    this.custLedgerForm.controls['startDateCustLedger'].setValue("");
    this.custLedgerForm.controls['endDateCustLedger'].setValue("");
    this.custLedgerSubmitted = false;
    this.getCustomersLedger(this.customerId, "");
  }

  getCustomersLedger(custId:any, size:any) {
    let page_list;
    this.customerLedgerSearchKey = "";
    if (size) {
      page_list = size;
      this.custLedgerItemPerPage = size;
    } else {
      if (this.legershowItemPerPage == 1) {
        this.custLedgerItemPerPage = this.pageITEM;
      } else {
        this.custLedgerItemPerPage = this.legershowItemPerPage;
      }
    }
    const url = "/customerLedgers";
    this.postdata.custId = custId;
    this.revenueManagementService.postMethod(url, this.postdata).subscribe(
      (response: any) => {
        this.customerLedgerData = response.customerLedgerDtls;
        this.customerLedgerListData =
          response.customerLedgerDtls.customerLedgerInfoPojo.debitCreditDetail;
        // console.log("this.customerLedgerData", this.customerLedgerData);
        // this.customerLedgerOpen();
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  pageChangedcustledgerList(pageNumber:any) {
    this.currentPagecustLedgerList = pageNumber;
    this.getCustomersLedger(this.customerId, "");
  }

  TotalLedgerItemPerPage(event:any) {
    this.legershowItemPerPage = Number(event.value);
    if (this.currentPagecustLedgerList > 1) {
      this.currentPagecustLedgerList = 1;
    }
    if (!this.customerLedgerSearchKey) {
      this.getCustomersLedger(this.customerId, this.legershowItemPerPage);
    } else {
      this.searchCustomerLedger();
    }
  }
}
