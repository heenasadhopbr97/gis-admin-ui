import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable } from "rxjs";
import { Regex } from "src/app/constants/regex";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { PartnerService } from "src/app/service/partner.service";
import * as RadiusConstants from "../../RadiusUtils/RadiusConstants";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";

declare var $: any;
@Component({
    selector: "app-customer-withdrawalmodal",
    templateUrl: "./customer-withdrawalmodal.component.html",
    styleUrls: ["./customer-withdrawalmodal.component.css"],
    standalone: false
})
export class CustomerWithdrawalmodalComponent implements OnInit {
  @ViewChild("closebutton") closebutton: any;
  @Input() dialogId: string;
  @Input() wCustID: Observable<any>;
  @Output() walletCustomerID = new EventEmitter();
  @Output() closeSelectStaff = new EventEmitter();
  withdrawalcustID = "";

  manageBalanceGroupForm: FormGroup;
  submitted = false;
  ifwithdrawalCommision = false;
  ifWithdrawalOnlineMode = false;
  ifWithdrawalCash = false;
  partnerData:any[] = [];

  BalanceOpertation = [{ label: " Withdrawal Of Wallet ", value: "withdrawalOfCommission" }];

  paymentmode = [
    { label: "Cash", value: "cash" },
    { label: "Online", value: "online" },
  ];

  partnerName: any;
  ifRedirectManageBalance = false;

  walletAmount: any = "";
  bankDataList: any = [];
  mvnoId: string;
  displayDialogWithDraw: boolean = false;
  currentPagePaymentListdata = 1;
  paymentListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  paymentListdatatotalRecords: any;
  paymentListData: any = [];
  paymentListDataselector: any;
  pageLimitOptionsPayment = RadiusConstants.pageLimitOptions;
  pageITEMPayment = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPagePayment = 1;
  paymentListDatalength = 0;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  masterSelected: boolean;
  checklist: any;
  checkedList: any[] = [];
  selectedStaffCust: [];
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    public KeyannaCommonBaseService: KeyannaCommonBaseService,
    private messageService: MessageService,
    private partnerService: PartnerService,
    public revenueManagementService: RevenueManagementService
  ) {}

  ngOnInit(): void {
    this.displayDialogWithDraw = true;
    this.manageBalanceGroupForm = this.fb.group({
      operation: ["", Validators.required],
      mode: [""],
      currentBalance: [""],
      commission: [this.walletAmount],
      remarks: [""],
      transfer: [""],
      amount: ["", [Validators.pattern(Regex.numeric)]],
      newCommission: [""],
      newBalance: [""],
      withdrawalAmount: [""],
      ReamainingCommision: [""],
      referenceNo: [""],
      bank: [""],
      branch: [""],
      addcredit: [""],
      currentCredit: [""],
      NewCredit: [""],
    });

    this.wCustID.subscribe(value => {
      // this.closeSelectStafff();
      if (value.wCustID && value.WalletAmount) {
        this.withdrawalcustID = value.wCustID;
        this.walletAmount = value.WalletAmount;
        this.getPayments("");

        this.manageBalanceGroupForm.patchValue({
          commission: this.walletAmount,
          operation: "withdrawalOfCommission",
        });
      }
    });

    this.getOpetationType();
    this.getBankDetail();
    this.masterSelected = false;
    this.mvnoId = localStorage.getItem("mvnoId");
  }

  getBankDetail() {
    const url = "/bankManagement/searchByStatus";
    this.KeyannaCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.bankDataList = response.dataList;
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

  getOpetationType() {
    let operationType = "withdrawalOfCommission";
    if (operationType == "withdrawalOfCommission") {
      this.ifwithdrawalCommision = true;
      this.validationWithdrawalCommission();
    } else if (operationType == "") {
      this.ifwithdrawalCommision = false;
      this.clearWithdrawalCommission();
    }
  }

  onKey(e: any) {
    this.manageBalanceGroupForm.value.totalBalance =
      Number(this.manageBalanceGroupForm.value.currentBalance) +
      Number(this.manageBalanceGroupForm.value.addBalance);

    this.manageBalanceGroupForm.patchValue({
      totalBalance: this.manageBalanceGroupForm.value.totalBalance,
    });
  }

  getOpetationMode(event:any) {
    let modeType = event.value;
    if (modeType == "Cash") {
      this.ifWithdrawalOnlineMode = false;
      this.ifWithdrawalCash = true;
      this.OnlineFieldClear();
    } else if (modeType == "Online") {
      this.ifWithdrawalOnlineMode = true;
      this.ifWithdrawalCash = false;
      this.OnlineFieldValidation();
    } else {
      this.ifWithdrawalOnlineMode = false;
      this.ifWithdrawalCash = false;
      this.OnlineFieldClear();
    }
  }
  onKeyWithdrawalAmount() {
    let amount =
      Number(this.manageBalanceGroupForm.value.commission) -
      Number(this.manageBalanceGroupForm.value.withdrawalAmount);
    if (amount < 0) {
      this.messageService.add({
        severity: "info",
        summary: "Information",
        detail: "Withdrawal amount can not be greater than wallet amount..",
        icon: "far fa-check-circle",
      });
      this.manageBalanceGroupForm.controls['withdrawalAmount'].setValue(0);
    }

    this.manageBalanceGroupForm.patchValue({
      ReamainingCommision: parseFloat(amount.toString()).toFixed(2),
    });
  }

  submitBalance() {
    this.submitted = true;
    if (this.manageBalanceGroupForm.valid) {
      if (!this.getAllowWithDrawal(this.checkedList)) {
        this.messageService.add({
          severity: "info",
          summary: "Information",
          detail: "Please select payments more than withdrwal amount.",
          icon: "far fa-check-circle",
        });
        return;
      }
      let withDrawCreditdocId:any[] = [];
      this.checkedList.forEach(element => {
        withDrawCreditdocId.push(element.id);
      });

      if (this.manageBalanceGroupForm.value.mode == "Cash") {
        let data = {
          amount: Number(this.manageBalanceGroupForm.value.withdrawalAmount),
          bank: "",
          branch: "",
          bankManagement: "",
          customerid: this.withdrawalcustID,
          withDrawCreditdocId: withDrawCreditdocId,
          mvnoId: Number(this.mvnoId),
          paymentreferenceno: this.manageBalanceGroupForm.value.referenceNo,
          paymode: this.manageBalanceGroupForm.value.mode,
          paytype: "payment",
          referenceno: this.manageBalanceGroupForm.value.referenceNo,
          remark: this.manageBalanceGroupForm.value.remarks,
          type: "Payment",
        };
        this.withdrawalAmount(data);
      } else if (this.manageBalanceGroupForm.value.mode == "Online") {
        let data = {
          amount: Number(this.manageBalanceGroupForm.value.withdrawalAmount),
          bank: this.manageBalanceGroupForm.value.bank,
          branch: this.manageBalanceGroupForm.value.branch,
          bankManagement: "",
          customerid: this.withdrawalcustID,
          withDrawCreditdocId: withDrawCreditdocId,
          mvnoId: Number(this.mvnoId),
          paymentreferenceno: this.manageBalanceGroupForm.value.referenceNo,
          paymode: this.manageBalanceGroupForm.value.mode,
          paytype: "payment",
          referenceno: this.manageBalanceGroupForm.value.referenceNo,
          remark: this.manageBalanceGroupForm.value.remarks,
          type: "Payment",
        };
        this.withdrawalAmount(data);
      }
    }
  }

  withdrawalAmount(data:any) {
    if (data.withdrawAmount != 0) {
      let url = "/withdraw/payment";
      this.revenueManagementService.postMethod(url, data).subscribe(
        (response: any) => {
          this.walletCustomerID.emit(this.withdrawalcustID);
          this.ifRedirectManageBalance = false;

          // this.closeSelectStafff();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.msg,
            icon: "far fa-check-circle",
          });
          this.displayDialogWithDraw = false;
          this.closeSelectStaff.emit(this.selectedStaffCust);
        },
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle",
          });

          this.displayDialogWithDraw = false;
          this.closeSelectStaff.emit(this.selectedStaffCust);
        }
      );
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Rejected",
        detail: "You have rejected the transfer because the value of the Withdrawal Amount is Zero",
      });
    }
  }

  closeSelectStafff() {
    this.displayDialogWithDraw = false;
    this.closeSelectStaff.emit(this.selectedStaffCust);
    this.submitted = false;
    this.ifWithdrawalOnlineMode = false;
    this.ifWithdrawalCash = false;
    this.ifwithdrawalCommision = true;
    this.manageBalanceGroupForm.reset();
    this.manageBalanceGroupForm.controls['operation'].setValue("");
    this.manageBalanceGroupForm.controls['mode'].setValue("");
    this.clearWithdrawalCommission();
    this.OnlineFieldClear();
  }

  validationWithdrawalCommission() {
    this.manageBalanceGroupForm.get("mode").setValidators([Validators.required]);
    this.manageBalanceGroupForm.get("mode").updateValueAndValidity();
    this.manageBalanceGroupForm.get("remarks").setValidators([Validators.required]);
    this.manageBalanceGroupForm.get("remarks").updateValueAndValidity();
    this.manageBalanceGroupForm.get("referenceNo").setValidators([Validators.required]);
    this.manageBalanceGroupForm.get("referenceNo").updateValueAndValidity();

    this.manageBalanceGroupForm.get("withdrawalAmount").setValidators([Validators.required]);
    this.manageBalanceGroupForm.get("withdrawalAmount").updateValueAndValidity();
  }
  clearWithdrawalCommission() {
    this.manageBalanceGroupForm.get("mode").clearValidators();
    this.manageBalanceGroupForm.get("mode").updateValueAndValidity();
    this.manageBalanceGroupForm.get("withdrawalAmount").clearValidators();
    this.manageBalanceGroupForm.get("withdrawalAmount").updateValueAndValidity();
    this.manageBalanceGroupForm.get("referenceNo").clearValidators();
    this.manageBalanceGroupForm.get("referenceNo").updateValueAndValidity();
    this.manageBalanceGroupForm.get("remarks").clearValidators();
    this.manageBalanceGroupForm.get("remarks").updateValueAndValidity();
  }

  OnlineFieldValidation() {
    this.manageBalanceGroupForm.get("bank").setValidators([Validators.required]);
    this.manageBalanceGroupForm.get("bank").updateValueAndValidity();
    this.manageBalanceGroupForm.get("branch").setValidators([Validators.required]);
    this.manageBalanceGroupForm.get("branch").updateValueAndValidity();
  }

  OnlineFieldClear() {
    this.manageBalanceGroupForm.get("bank").clearValidators();
    this.manageBalanceGroupForm.get("bank").updateValueAndValidity();
    this.manageBalanceGroupForm.get("branch").clearValidators();
    this.manageBalanceGroupForm.get("branch").updateValueAndValidity();

    this.manageBalanceGroupForm.patchValue({
      commission: this.walletAmount,
      operation: "withdrawalOfCommission",
    });

    this.getOpetationType();
  }

  onKeyaddcredit(e:any) {
    this.manageBalanceGroupForm.value.NewCredit =
      Number(this.manageBalanceGroupForm.value.currentCredit) +
      Number(this.manageBalanceGroupForm.value.addcredit);

    this.manageBalanceGroupForm.patchValue({
      NewCredit: this.manageBalanceGroupForm.value.NewCredit,
    });
  }

  cancelMangeBalnce() {
    this.ifRedirectManageBalance = false;
    // this.closeSelectStafff();
  }

  getPayments(list:any): void {
    let size;
    const page = this.currentPagePaymentListdata;
    if (list) {
      size = list;
      this.paymentListdataitemsPerPage = list;
    } else {
      size = this.paymentListdataitemsPerPage;
    }

    const url = `/getWithdrawPayments/${this.withdrawalcustID}`;
    const paymentList = {
      page,
      pageSize: size,
    };
    this.revenueManagementService.postMethod(url, paymentList).subscribe(
      (response: any) => {
        this.paymentListData = response.dataList;
        this.paymentListDataselector = response.dataList;
        this.paymentListdatatotalRecords = response.totalRecords;
        if (this.showItemPerPagePayment > this.paymentListdataitemsPerPage) {
          this.paymentListDatalength = this.paymentListData.length % this.showItemPerPagePayment;
        } else {
          this.paymentListDatalength =
            this.paymentListData.length % this.paymentListdataitemsPerPage;
        }
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

  totalItemPerPageForPayments(event:any): void {
    this.showItemPerPagePayment = Number(event.value);
    if (this.currentPagePaymentListdata > 1) {
      this.currentPagePaymentListdata = 1;
    }
    this.getPayments(this.showItemPerPagePayment);
  }

  pageChangedForPayments(pageNumber:any): void {
    this.currentPagePaymentListdata = pageNumber;
    this.getPayments("");
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll() {
    for (let i = 0; i < this.paymentListData.length; i++) {
      this.paymentListData[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  // Check All Checkbox Checked
  isAllSelected() {
    this.masterSelected = this.paymentListData.every(function (item: any) {
      return item.isSelected == true;
    });
    this.getCheckedItemList();
  }

  // Get List of Checked Items
  getCheckedItemList() {
    this.checkedList = [];
    for (let i = 0; i < this.paymentListData.length; i++) {
      if (this.paymentListData[i].isSelected) {
        this.checkedList.push(this.paymentListData[i]);
      }
    }
  }

  getAllowWithDrawal(checkedList: any[]): boolean {
    if (checkedList.length == 0) {
      return false;
    } else {
      let allowedAmount = 0;
      let withdrawalAmount = Number(this.manageBalanceGroupForm.value.withdrawalAmount);
      this.checkedList.forEach(element => {
        allowedAmount = allowedAmount + element.remainingAmount;
      });
      if (allowedAmount - withdrawalAmount < 0) {
        return false;
      }
    }
    return true;
  }
}
