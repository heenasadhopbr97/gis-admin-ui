import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, NO_ERRORS_SCHEMA, OnInit, Output, ViewChild } from "@angular/core";
import { Table } from "primeng/table";
// import { PrimeNGConfig } from "primeng/api";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: "app-cust-change-plan",
    templateUrl: "./cust-change-plan.component.html",
    styleUrls: ["./cust-change-plan.component.css"],
    standalone: false,
})
export class CustChangePlanComponent implements OnInit {
closeParentCust() {
throw new Error('Method not implemented.');
}
paymentOwnerId: any;
customerLedgerDetailData: any;
removeSelParentCust(arg0: string) {
throw new Error('Method not implemented.');
}
  @Input() custData: any;
  @Input() currentPlanDetails: any;
  @Input() planList: any;
  @Output() backButton = new EventEmitter();
  @ViewChild("dt") table: Table;
  selectedPlan: any[];
  planDetailsCategory = [
    { label: "Individual", value: "individual" },
    { label: "Plan Group", value: "groupPlan" },
  ];
  planChangeForm: FormGroup;
  currentData = this.datepipe.transform(Date(), "yyyy-MM-dd");
  staffDataList:[] = [];
  parentCustomerDialogType: any = "";
  showParentCustomerModel = false;
  customerSelectType: any = "";
  selectedParentCust: any;
  changePlansubmitted: boolean = false;
  newPlanId: any = null;
  changePlanType:any = null;
billableCustList: any[];
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    public commondropdownService: CommondropdownService,
    // private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.currentPlanDetails.forEach((e:any) => {
        e.newPlanName = e.planId;
      });
      console.log(this.planList);
      console.log(this.currentPlanDetails);
    }, 2000);
    // this.primengConfig.ripple = true;
    this.commondropdownService.getPlanPurchaseType();
    this.planChangeForm = this.fb.group({
      // connectionNo: [null, Validators.required],
      // purchaseType: ["", Validators.required],
      // planId: ["", Validators.required],
      // planGroupId: ["", Validators.required],
      // planList: [""],
      paymentOwnerId: ["", Validators.required],
      // ChangePlanCategory: [""],
      // addonStartDate: [this.currentData],
      serviceName: [null],
      serviceNickName: [null],
      billableCustomerId: [""],
      isPaymentReceived: [false],
      externalRemark: [""],
      remarks: ["", Validators.required],
    });
  }
  changePlan() {
    this.changePlansubmitted = true;
  }

  //bill to
  modalOpenParentCustomer(type:any) {
    this.parentCustomerDialogType = type;
    this.showParentCustomerModel = true;
    this.customerSelectType = "Billable To";
    if (type === "parent") {
      this.customerSelectType = "Parent";
    }
    this.selectedParentCust = [];
  }

  //paymentFlagToggle
  paymentFlagToggle(e:any) {
    console.log(!e.target.checked);
    // this.planChangeForm.patchValue({ isPaymentReceived: !e.target.checked });
    console.log(this.planChangeForm.value);
  }

  // Table Settings
  onActivityChange(event:any) {
    const value = event.target.value;
    if (value && value.trim().length) {
      const activity = parseInt(value);

      if (!isNaN(activity)) {
        this.table.filter(activity, "activity", "gte");
      }
    }
  }
  onDateSelect(value:any) {
    this.table.filter(this.formatDate(value), "date", "equals");
  }
  formatDate(date:any) {
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) {
      month = "0" + month;
    }

    if (day < 10) {
      day = "0" + day;
    }

    return date.getFullYear() + "-" + month + "-" + day;
  }
  onRepresentativeChange(event:any) {
    this.table.filter(event.value, "representative", "in");
  }

  selectedStaff:any=[]
  selectStaffType =''
  staffSelectList:any=[]
  showSelectStaffModel = false;
  modalOpenSelectStaff(type:any) {
    this.parentCustomerDialogType = type;
    this.showSelectStaffModel = true;
    this.selectedStaff = [];
    this.selectStaffType = type
  }

  selectedStaffChange(event:any){
    this.showSelectStaffModel = false;
    let data = event
    this.staffSelectList = [
      {
        id: Number(data.id),
        name: data.firstname,
      },
    ];

    if(this.selectStaffType == 'paymentCharge'){ 
     
        this.planChangeForm.patchValue({
          paymentOwnerId: data.id
        })
    }  

  }

  removeSelectStaff(){
    this.staffSelectList = []
  }
  
  closeSelectStaff() {
    this.showParentCustomerModel = false;
  }
  
}
