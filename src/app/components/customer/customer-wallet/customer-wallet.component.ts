import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { BehaviorSubject } from "rxjs";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import { LoginService } from "src/app/service/login.service";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";

@Component({
    selector: "app-customer-wallet",
    templateUrl: "./customer-wallet.component.html",
    styleUrls: ["./customer-wallet.component.scss"],
    standalone: false
})
export class CustomerWalletComponent implements OnInit {
  custType: any;
  loggedInStaffId = localStorage.getItem("userId");
  partnerId = Number(localStorage.getItem("partnerId"));
  displayDialogWithDraw: boolean = false;
  withdrawalAmountAccess: boolean = false;
  customerId: number;
  getWallatData: any = [];
  WalletAmount: any = "";
  currency: string;
  customerLedgerDetailData: any;
  wCustID = new BehaviorSubject({
    wCustID: "",
    WalletAmount: "",
  });

  constructor(
    private spinner: NgxSpinnerService,
    public PaymentamountService: PaymentamountService,
    private customerManagementService: CustomermanagementService,
    private revenueManagementService: RevenueManagementService,
    private route: ActivatedRoute,
    private systemService: SystemconfigService,
    private router: Router,
    loginService: LoginService
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.withdrawalAmountAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_WALLET
        : POST_CUST_CONSTANTS.POST_CUST_WALLET
    );
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  async ngOnInit() {
    this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
      this.currency = res.data.value;
    });
    this.addWalletIncustomer(event);
    this.getCustomersDetail(this.customerId);
  }

  getCustomersDetail(custId:any) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.customerLedgerDetailData = response.customers;
      console.log(this.customerLedgerDetailData);
    });
  }

  customerDetailOpen() {
    this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
  }

  addWalletIncustomer(event:any) {
    const data = {
      CREATE_DATE: "",
      END_DATE: "",
      amount: "",
      balAmount: "",
      custId: this.customerId,
      description: "",
      id: "",
      refNo: "",
      transcategory: "",
      transtype: "",
    };
    const url = "/wallet";
    this.revenueManagementService.postMethod(url, data).subscribe((response: any) => {
      this.getWallatData = response;
      this.WalletAmount = response.customerWalletDetails;
    });
  }

  closeSelectStaff() {
    this.displayDialogWithDraw = false;
  }

  selectedStaffChange(event:any) {
    this.displayDialogWithDraw = false;
  }

  withdrawalAmountModel(modelID:any, wCustID:any, WalletAmount:any) {
    this.displayDialogWithDraw = true;
    // this.PaymentamountService.show(modelID);
    this.wCustID.next({
      wCustID,
      WalletAmount,
    });
  }
}
