import { DatePipe, formatDate } from "@angular/common";
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import * as FileSaver from "file-saver";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { BehaviorSubject, Observable, Observer } from "rxjs";
import { countries } from "src/app/components/model/country";
import { CustomerManagements } from "src/app/components/model/customer";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Regex } from "src/app/constants/regex";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { AREA, CITY, COUNTRY, PINCODE, STATE } from "src/app/RadiusUtils/RadiusConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomerInventoryMappingService } from "src/app/service/customer-inventory-mapping.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { InvoiceDetailsService } from "src/app/service/invoice-details.service";
import { InvoicePaymentListService } from "src/app/service/invoice-payment-list.service";
import { LiveUserService } from "src/app/service/live-user.service";
import { LoginService } from "src/app/service/login.service";
import { OutwardService } from "src/app/service/outward.service";
import { ProuctManagementService } from "src/app/service/prouct-management.service";
import { RecordPaymentService } from "src/app/service/record-payment.service";
import { StaffService } from "src/app/service/staff.service";
import { ExternalItemManagementService } from "src/app/service/external-item-management.service";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { PaymentAmountModelComponent } from "src/app/components/payment-amount-model/payment-amount-model.component";
import { WorkflowAuditDetailsModalComponent } from "src/app/components/workflow-audit-details-modal/workflow-audit-details-modal.component";
import { CustomerplanGroupDetailsModalComponent } from "src/app/components/customerplan-group-details-modal/customerplan-group-details-modal.component";
import { InwardService } from "src/app/service/inward.service";
import { InvoiceMasterService } from "src/app/service/invoice-master.service";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { isEmpty, isEqual } from "lodash";
import { Subscription } from "rxjs";
// import { log } from "console";
// import * as moment from "moment";

declare var $: any;

@Component({
    selector: "app-child-cust-change-plan",
    templateUrl: "./child-cust-change-plan.component.html",
    styleUrls: ["./child-cust-change-plan.component.scss"],
    standalone: false,
})
export class ChildCustChangePlanComponent implements OnInit {
closeSelectStaff() {
throw new Error('Method not implemented.');
}
  @Input() childCustomer: any = null;
  @Input() staffDataList: any = null;
  @Input() planMappingList: any = null;
  @Input() childChargeRecurringCustList: any = null;
  @Input() customerChargeDataShowChangePlan: any = null;
  @Input() parentPurchaseType: any = null;
  @Input() isParentSelected: any = null;
  @Input() changePlanClickEvent!: Observable<any>;
  @Input() resetFormEvent!: Observable<any>;
  @Input() billableCusList: any = [];
  @Input() paymentOwnerId: any = null;
  @Output() changePlanChildData = new EventEmitter();
  @Output() changePlanTypeData = new EventEmitter();
  @Output() changePlanChildValidData = new EventEmitter();
  @Output() UpdateCustPlansData = new EventEmitter();

  private eventsSubscription!: Subscription;
  private resetSubscription!: Subscription;

  dialogId = "selectPlanGroupChangeChild_";
  customertotalRecords = 1;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPage = 1;
  custPlanForms: FormGroup = this.fb.group({
    connectionNo: [null, Validators.required],
    serviceName: [null],
    serviceNickName: [null],
    purchaseType: ["", Validators.required],
    planId: ["", Validators.required],
    planGroupId: ["", Validators.required],
    planList: [""],
    isPaymentReceived: ["false"],
    remarks: ["", Validators.required],
    paymentOwner: [""],
    addonStartDate: [""],
    changePlanCategory: [""],
    discount: [0],
    paymentOwnerId: ["", Validators.required],
    billableCustomerId: [""],
  });
  addChargeForm!: FormGroup;
  chargeGroupForm!: FormGroup;
  planDetailsCategory = [
    { label: "Individual", value: "individual" },
    { label: "Plan Group", value: "groupPlan" },
  ];
  chargeType = [{ label: "One-time" }, { label: "Recurring" }];
  overChargeListFromArray: FormArray<FormGroup> = this.fb.array<FormGroup>([]);
  planDropdownInChageData: any[] = [];

  childActivePlans: any = [];
  planGroupList: any = [];
  filterSelectedPlanGroupListCust: any = [];
  planListCust: any = [];
  // custServiceData: any;
  planListByType: any = [];
  groupPlanListByType: any = [];
  custServiceData: any = [];
  planByService: any = [];
  newSubisuPrice: { [key: string]: any } = {};
  planSelected: any;
  changePlanRemark: string | null = null;
  custPlanMapppingId: any;
  planList: any;
  lastRenewalChildPlanGroupId = "";
  customerCurrentPlanListdatatotalRecords:any;

  selectedCustService: any;
  selPlanData: any = {
    id: null,
    quotatype: "",
    quotatime: "",
    quota: "",
    quotaUnit: "",
    quotaunittime: "",
    validity: "",
    offerprice: "",
    taxamount: "",
    activationDate: "",
    expiryDate: "",
    finalAmount: "",
  };
  finalOfferPrice: any;
  planDiscount: any = 0.0;
  changePlanData: any = {};
  plansArray: FormArray = this.fb.array([]);
  changePlanDate: any = [];
  changePlanBindigNewPlan: any = [];
  selectPlanListIDs: any = [];
  newAdddiscountdata: any = [];
  billingCycle: { label: number }[] = [];

  planGroupSelected: any;

  UpdateCustPlans = false;
  changePlansubmitted = false;
  isDisableServicePlanChange: boolean = false;
  isPlanGroup = false;
  changeplanGroupFlag = false;
  subisuChange = false;
  chargesubmitted = false;
  selectchargeValueShow = false;

  currentData = this.datePipe.transform(Date(), "yyyy-MM-dd");

  currentPagecustomerCurrentPlanListdata = 1;
  CurrentPlanShowItemPerPage = 1;
  customerCurrentPlanListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;

  overChargeListItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  overChargeListtotalRecords: any;
  currentPageoverChargeList = 1;

  planChangeListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  planChangeListdatatotalRecords: any;
  newFirst = 0;

  currentDate = new Date();
  plansByServiceArr: any[][] = [];
  enableChangePlanGroup: boolean = false;
  custCustDiscountList: any = [];
  planIds:any[] = [];
  searchOptionSelect = this.commondropdownService.customerSearchOption;
  searchParentCustOption = "";
  parentFieldEnable = false;
  searchParentCustValue = "";
  selectedParentCust: any = [];
  selectedParentCustId: any;
  currentPageParentCustomerListdata = 1;
  parentCustomerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  parentCustomerListdatatotalRecords: any;
  prepaidParentCustomerList: any;

  changePlanBindigChildNewPlan: any = [];
  isConnectionSelected = false;
  offerPrice = 0;
  groupOfferPrices: { [key: string]: number } = {};
  isShowConnection = true;
  serviceSerialNumbers: { serialNumber: any; custPlanMapppingId: any }[] = [];

  showPlanConnectionNo = false;
  planForConnection:any;
  dateTime!: Date;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private customerManagementService: CustomermanagementService,
    public commondropdownService: CommondropdownService,
    public datepipe: DatePipe,
    private datePipe: DatePipe,
    private paymentamountService: PaymentamountService
  ) {}

  getControl(row: AbstractControl, controlName: string): FormControl {
    if (row instanceof FormGroup) {
      const ctrl = row.get(controlName);
      if (ctrl instanceof FormControl) {
        return ctrl;
      }
    }
    return new FormControl('');
  }

  ngOnInit() {
    this.initData();
    this.eventsSubscription = this.changePlanClickEvent.subscribe({
      next: data => {
        this.changePlanDataObj();
      },
      error: msg => console.log("Called event change plan erro :::: ", msg),
    });

    this.resetSubscription = this.resetFormEvent.subscribe({
      next: data => {
        this.custPlanForms.reset();
        this.newSubisuPrice = {};
        this.UpdateCustPlans = false;
        this.initData();
      },
      error: msg => console.log("Called event change plan erro :::: ", msg),
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log("Changes :::: ", changes);
    // console.log("UpdateCustPlans :::: ", this.UpdateCustPlans);
    if (this.UpdateCustPlans) {
      if (changes["billableCusList"]) {
        if (this.billableCusList != null && this.billableCusList.length > 0) {
          this.getParentCustomerData();
          // this.billableCusList = changes["billableCusList"].currentValue;
          this.custPlanForms.patchValue({
            billableCustomerId: this.billableCusList[0].id,
          });
        }
      } else if (changes["paymentOwnerId"]) {
        if (this.paymentOwnerId != null) {
          this.custPlanForms.patchValue({
            paymentOwnerId: this.paymentOwnerId,
          });
        }
      } else {
        this.setParentData();
      }
    }
  }

  setParentData() {
    if (
      this.parentPurchaseType != null &&
      this.parentPurchaseType != undefined &&
      this.parentPurchaseType != ""
    ) {
      this.initData();
      this.custPlanForms.reset();
      this.custPlanForms.patchValue({
        purchaseType: this.parentPurchaseType,
      });
      if (this.billableCusList != null && this.billableCusList.length > 0) {
        this.getParentCustomerData();
        // this.billableCusList = changes["billableCusList"].currentValue;
        this.custPlanForms.patchValue({
          billableCustomerId: this.billableCusList[0].id,
        });
      }
      if (this.paymentOwnerId != null) {
        this.custPlanForms.patchValue({
          paymentOwnerId: this.paymentOwnerId,
        });
      }
      // this.changePlanType({ value: this.custPlanForms.value.purchaseType });
    } else {
      this.custPlanForms.patchValue({
        purchaseType: this.custPlanForms.value.purchaseType,
      });
    }
  }

  async initData() {
    this.dialogId = this.dialogId + this.childCustomer.id;
    this.commondropdownService.getCustomerStatus();
    this.commondropdownService.getserviceAreaList();
    await this.commondropdownService.getPostpaidplanData();
    this.changePlansubmitted = false;

    this.getCustCurrentPlan();
    this.getChildCustPlans();
    this.billingSequence();
    this.getserviceData("", false);
    this.lastRenewalChildPlanGroup(this.childCustomer.id);
    this.getcustDiscountDetails(this.childCustomer.id);
    this.getplanChangeforplanGroup();
    this.addChargeForm = this.fb.group({
      chargeAdd: [""],
    });
    this.chargeGroupForm = this.fb.group({
      chargeid: ["", Validators.required],
      validity: ["", Validators.required],
      price: ["", Validators.required],
      actualprice: ["", Validators.required],
      charge_date: ["", Validators.required],
      type: ["Recurring", Validators.required],
      staticIPAdrress: [""],
      planid: ["", Validators.required],
      unitsOfValidity: ["", Validators.required],
      discount: [""],
      billingCycle: [""],
      expiry: ["", Validators.required],
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  billingSequence() {
    for (let i = 0; i < 12; i++) {
      this.billingCycle.push({ label: i + 1 });
      // console.log(this.billingCycle)
    }
  }

  isEmptyObject() {
    var isEmpty = this.custPlanForms === null || Object.keys(this.custPlanForms).length === 0;
    return isEmpty;
  }

  TotalCurrentPlanItemPerPage(event:any) {
    this.CurrentPlanShowItemPerPage = Number(event.value);
    if (this.currentPagecustomerCurrentPlanListdata > 1) {
      this.currentPagecustomerCurrentPlanListdata = 1;
    }
    this.getCustCurrentPlan();
  }

  pageChangedcustomerCurrentPlanListData(pageNumber:any) {
    this.currentPagecustomerCurrentPlanListdata = pageNumber;
    this.getCustCurrentPlan();
  }

  pageChangedOverChargeList(pageNumber:any) {
    this.currentPageoverChargeList = pageNumber;
  }

  getCustCurrentPlan() {
    //
    let chargeAvailable: Boolean = false;
    if (this.childCustomer.indiChargeList.length == 0) {
      chargeAvailable = false;
    } else {
      chargeAvailable = true;
    }
    const url = "/subscriber/getActivePlanList/" + this.childCustomer.id + "?isNotChangePlan=false";
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.childActivePlans = response.dataList.filter(
        (item:any) =>
          item.invoiceType == "Group" &&
          item.plangroup !== "Volume Booster" &&
          item.plangroup !== "Bandwidthbooster" &&
          item.plangroup !== "DTV Addon"
      );
      // console.log("this.childActivePlans ::: ", this.childActivePlans);
    });
  }

  // getPlanListByGroupId(groupId) {
  //
  //   const url = `/plansByPlanGroupId?planGroupId=` + groupId;
  //   this.customerManagementService.getMethod(url).subscribe(
  //     (response: any) => {
  //       this.planListByType = response.planList;
  //       console.log("this.planListByType ::::::: ", this.planListByType);

  //       // if (this.lastRenewalPlanGroupID != this.planGroupSelected) {
  //       //   this.planList.forEach(element => {
  //       //     this.onNewBindingPlanMapping();
  //       //   });
  //       // }
  //       // console.log(this.planList);
  //       // this.planChangeListdatatotalRecords = this.planList.length;
  //
  //     },
  //     (error: any) => {
  //       this.messageService.add({
  //         severity: "error",
  //         summary: "Error",
  //         detail: error.error.ERROR,
  //         icon: "far fa-times-circle",
  //       });
  //
  //     }
  //   );
  // }

  getplanChangeforplanGroup() {
    const url = "/findPlanGroupMappingByCustId?custId=" + this.childCustomer.id;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        // console.log("response >>>>>>>>>>>>  ", response);

        this.planGroupList = response.planGroupMappingList;
        // console.log("API this.planGroupList >>>>>>>>>>>>  ", this.planGroupList);
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

  modalOpenPlanChange(e:any) {
    this.planIds = [];
    this.planGroupSelected =
      this.custPlanForms.value.planGroupId !== undefined &&
      this.custPlanForms.value.planGroupId !== "" &&
      this.custPlanForms.value.planGroupId !== 0
        ? this.custPlanForms.value.planGroupId
        : e.value;
    this.getPlangroupByPlan(this.planGroupSelected);

    if (
      this.childCustomer.planMappingList[0].billTo == "ORGANIZATION" ||
      this.childCustomer.planMappingList[0].billTo == "Organization"
    ) {
      this.confirmationService.confirm({
        message: "The customer is bill_to organization, do you want to continue?",
        header: "Change Plan Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.subisuChange = true;
          // this.planGroupSelectSubisu(this.planGroupSelected);
          this.getserviceData(e.value, true);
        },
        reject: () => {
          this.subisuChange = false;
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected",
          });
          // this.getserviceData(e.value);
          this.getPlanListByGroupId();
        },
      });
    } else {
      this.getserviceData(e.value, true);
      this.getPlanListByGroupId();
    }
  }

  getPlangroupByPlan(planGroupId:any) {
    this.planDropdownInChageData = [];
    const MappURL = "/findPlanGroupMappingByPlanGroupId?planGroupId=" + planGroupId;
    this.customerManagementService.getMethod(MappURL).subscribe((response: any) => {
      const attributeList = response.planGroupMappingList;
      attributeList.forEach((element: any) => {
        this.planDropdownInChageData.push(element.plan);
      });

      if (this.isPlanGroup) {
        let newAmount = 0;
        let totalAmount = 0;
        attributeList.forEach((element:any, i:any) => {
          let n = i + 1;
          newAmount =
            element.plan.newOfferPrice != null
              ? element.plan.newOfferPrice
              : element.plan.offerprice;
          totalAmount = Number(totalAmount) + Number(newAmount);
          if (attributeList.length == n) {
            this.custPlanForms.patchValue({
              offerPrice: totalAmount,
            });

            let price = Number(this.custPlanForms.value.offerPrice);
            let discount = Number(this.custPlanForms.value.discount);
            let DiscountV = (price * discount) / 100;
            let discountValueNUmber = DiscountV.toFixed(2);
            let discountfV =
              Number(this.custPlanForms.value.offerPrice) - Number(discountValueNUmber);
            this.custPlanForms.patchValue({
              discountPrice: discountfV.toFixed(2),
            });
          }
        });
      }
    });
  }

  onUpdateChange(e:any) {
    this.custPlanForms.reset();
    if (e.checked == true) {
      this.UpdateCustPlans = true;
      this.setParentData();
    } else {
      this.UpdateCustPlans = false;
    }
  }

  changeService(event:any) {
    let i: number;
    if (event != null) {
      this.isConnectionSelected = true;
      this.custPlanForms.patchValue({
        connectionNo: event.value,
        serviceName: event.value,
        serviceNickName: event.value,
        purchaseType: this.custPlanForms.value.purchaseType,
        planGroupId: "",
        planList: "",
        changePlanCategory: "",
      });
    } else {
      this.isConnectionSelected = false;
    }
    this.custServiceData.forEach((element:any) => {
      if (element.custPlanMapppingId == event.value) {
        i = element.serviceId;
        this.selectedCustService = element;
      }
    });
    this.planByService = [];
    this.planListByType.forEach((element:any) => {
      if (element.serviceId == i && element.isDelete == false) {
        this.planByService.push(element);
      }
    });
    if (this.isParentSelected) {
      this.changePlanType({ value: this.custPlanForms.value.purchaseType });
    }
    this.getplanChangeforplanGroup();
  }
 filterPlan(i: number) {
  this.planByService = [];
  this.planListByType.forEach((element: any) => {
    if (element.serviceId == i && element.isDelete == false) {
      this.planByService.push(element);
    }
  });
}

  changePlanType($event:any) {
    if (this.selectedCustService != null) {
      switch ($event.value) {
        case "Renew": {
          if (
            this.selectedCustService.custPlanStatus == "STOP" &&
            this.selectedCustService.stopServiceDate != null
          ) {
            this.isDisableServicePlanChange = true;
          }
          break;
        }
        case "Changeplan": {
          if (
            this.selectedCustService.custPlanStatus == "STOP" &&
            this.selectedCustService.stopServiceDate != null
          ) {
            this.isDisableServicePlanChange = true;
          }
          break;
        }
        default: {
          this.isDisableServicePlanChange = false;
        }
      }
    }

    // if (this.childCustomer.plangroupid && this.custPlanForms.value.purchaseType !== "Addon") {
    //   this.planListCust = [];
    //   this.planGroupList.forEach(planGroup => {
    //     planGroup.planMappingList.forEach(planMapping => {
    //       this.planListCust.push(planMapping.plan);
    //     });
    //   });
    // } else {
    //   this.getChildCustPlans();
    // }
    // this.custPlanForms.reset(this.custPlanForms.value);
    this.custPlanForms.controls['changePlanCategory'].reset();
    // this.selPlanData = [];
    // this.finalOfferPrice = 0;
    this.custPlanForms.patchValue({
      purchaseType: $event.value,
      planGroupId: "",
      isPaymentReceived: "false",
      planId: "",
      changePlanCategory: "",
    });
    // this.isPlanTypeAddon = false;
    if (!this.childCustomer.plangroupid) {
      this.planByService = [];
    }
    if ($event.value != null && $event.value != undefined) {
      if ($event.value === "Addon") {
        // this.isPlanTypeAddon = true;
        // this.changeisPlanGroup = false;
        this.changeplanGroupFlag = false;
        if (!this.childCustomer.plangroupid) {
          this.planByService = this.planListCust.filter(
            (plan:any) =>
              plan.serviceId == this.selectedCustService.serviceId &&
              (plan.planGroup === "Volume Booster" ||
                plan.planGroup === "Bandwidthbooster" ||
                plan.planGroup === "DTV Addon")
          );
          // this.filterPlan();
        } else {
          this.planByService = this.planListByType.filter(
            (plan:any) =>
              plan.serviceId == this.selectedCustService.serviceId &&
              (plan.planGroup === "Volume Booster" ||
                plan.planGroup === "Bandwidthbooster" ||
                plan.planGroup === "DTV Addon")
          );
        }
        this.custPlanForms.get("planGroupId")?.disable();
        this.custPlanForms.get("planList")?.disable();
        this.custPlanForms.get("planId")?.enable();
        this.isPlanGroup = false;
        if (!this.childCustomer.plangroupid) {
          this.getserviceData("", false);
        } else {
          this.getserviceData(this.childCustomer.planGroupId, false);
        }
        // this.planByService = this.planListByType;
      } else if ($event.value === "Changeplan") {
        if (this.childCustomer.plangroupid) {
          this.planByService = this.planListCust.filter(
            (plan:any) =>
              plan.serviceId == this.selectedCustService.serviceId &&
              (plan.planGroup === "Registration" || plan.planGroup === "Registration and Renewal")
          );
          // this.planByService = this.planListByType;
          this.custPlanForms.get("planGroupId")?.enable();
          this.custPlanForms.get("planList")?.enable();
          this.custPlanForms.get("planId")?.disable();
          this.isPlanGroup = true;
          if (this.childActivePlans.length > 1) {
            this.changeplanGroupFlag = true;
          } else {
            this.changeplanGroupFlag = false;
          }
          this.getPlangroupByPlan(this.childCustomer.plangroupid);
        }
        if (!this.childCustomer.plangroupid) {
          this.custPlanForms.get("planGroupId")?.disable();
          this.custPlanForms.get("planList")?.enable();
          this.custPlanForms.get("planId")?.disable();
          this.planByService = this.planListCust.filter(
            (plan:any) =>
              plan.serviceId == this.selectedCustService.serviceId &&
              (plan.planGroup === "Registration" || plan.planGroup === "Registration and Renewal")
          );
          // this.planByService = this.planListByType;
          this.isPlanGroup = false;
          if (this.childActivePlans.length > 1) {
            this.changeplanGroupFlag = true;
          } else {
            this.changeplanGroupFlag = false;
          }
          // this.filterplan();
        } else {
          this.filterSelectedPlanGroupListCust = this.planGroupList.filter(
            (plan:any) =>
              plan.planGroupType === "Registration" ||
              plan.planGroupType === "Registration and Renewal"
          );
        }
        // this.isPlanTypeAddon = false;
      } else if ($event.value === "Renew") {
        if (this.childCustomer.plangroupid) {
          this.planByService = this.planListCust.filter(
            (plan:any) =>
              plan.serviceId == this.selectedCustService.serviceId &&
              (plan.planGroup === "Renew" || plan.planGroup === "Registration and Renewal")
          );
          this.custPlanForms.get("planGroupId")?.enable();
          this.custPlanForms.get("planList")?.disable();
          this.custPlanForms.get("planId")?.disable();
          this.isPlanGroup = true;
          this.getPlangroupByPlan(this.childCustomer.plangroupid);
          this.filterSelectedPlanGroupListCust = this.planGroupList.filter(
            (plan:any) =>
              plan.planGroupType === "Renew" || plan.planGroupType === "Registration and Renewal"
          );
          if (this.childActivePlans.length > 1) {
            this.changeplanGroupFlag = true;
          } else {
            this.changeplanGroupFlag = false;
          }
        } else {
          this.custPlanForms.get("planGroupId")?.disable();
          this.custPlanForms.get("planList")?.disable();
          this.custPlanForms.get("planId")?.enable();
          this.planByService = this.planListCust.filter(
            (plan:any) =>
              plan.serviceId == this.selectedCustService.serviceId &&
              (plan.planGroup === "Renew" || plan.planGroup === "Registration and Renewal")
          );
          this.changeplanGroupFlag = false;
          this.isPlanGroup = false;
          // this.filterplan();
        }
        // this.isPlanTypeAddon = false;
      }
    }

    this.planByService.forEach((e:any) => {
      if (e.quotatype == "Data") {
        e.label =
          e.name +
          ` (${this.selectedCustService.is_qosv ? e.quota + " " + e.quotaUnit : ""}
          ${e.quotaResetInterval == "Total" ? "" : "/" + e.quotaResetInterval + " - "}${
            e.validity
          } ${e.unitsOfValidity} ${e.qospolicyName ? "-" + e.qospolicyName : ""})`;
      } else if (e.quotatype == "Time") {
        e.label =
          e.name +
          ` (${e.quotatime} ${e.quotaunittime}${
            e.quotaResetInterval == "Total" ? "" : "/" + e.quotaResetInterval + " - "
          }${e.validity} ${e.unitsOfValidity} ${e.qospolicyName ? "-" + e.qospolicyName : ""})`;
      } else if (e.quotatype == "Both") {
        e.label =
          e.name +
          ` (${this.selectedCustService.is_qosv ? e.quota + " " + e.quotaUnit : ""}${
            e.quotaResetInterval == "Total" ? "" : "/" + e.quotaResetInterval + " and "
          }${e.quotatime} ${e.quotaunittime}${
            e.quotaResetInterval == "Total" ? "" : "/" + e.quotaResetInterval
          }  - ${e.validity} ${e.unitsOfValidity} ${e.qospolicyName ? "-" + e.qospolicyName : ""})`;
      } else {
        e.label = e.name;
      }
    });
  }

  lastRenewalChildPlanGroup(id:any) {
    const url = "/subscriber/lastrenewalplangroupid/" + id;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.lastRenewalChildPlanGroupId = response.lastRenewalPlanGroupId;
    });
  }

  getChildCustPlans() {
    const checkCustTypeurl = `/isCustomerPrimeOrNot?custId=${this.childCustomer.id}`;
    this.customerManagementService.getMethod(checkCustTypeurl).subscribe((responsePrime: any) => {
      // plan deatils
      let specialPlanURL: any;
      let planurl: any;
      let planGroupurl: any;
      let planCategory;
      let PlanGroupCatogry;
      let plandata1: any = [];
      let plandata2: any = [];
      if (responsePrime.isCustomerPrime) {
        planurl = `/premierePlan/all?custId=${this.childCustomer.id}&isPremiere=true&serviceAreaId=${this.childCustomer.serviceareaid}`;
        planGroupurl = `/planGroupMappings?mode=""`;
        specialPlanURL = `/plansByServiceAreaCustId?custId=${this.childCustomer.id}&planmode=SPECIAL&serviceAreaId=${this.childCustomer.serviceareaid}`;
      }
      if (this.childCustomer.plangroupid != null) {
        let url = "/findPlanGroupById?planGroupId=" + this.childCustomer.plangroupid;

        this.customerManagementService.getMethod(url).subscribe((response: any) => {
          PlanGroupCatogry = response.planGroup.category;

          if (!responsePrime.isCustomerPrime) {
            planGroupurl =
              `/planGroupMappings?mode=NORMAL` +
              "&planCategory=" +
              PlanGroupCatogry +
              "&custId=" +
              this.childCustomer.id;
            planurl =
              "/plans/serviceArea?planCategory=" +
              "NORMAL" +
              "&serviceAreaId=" +
              this.childCustomer.serviceareaid +
              "&planmode=NORMAL";
          }
          this.customerManagementService.getMethod(planGroupurl).subscribe((response: any) => {
            this.planGroupList = response.planGroupList.filter(
              (plan:any) => plan.plantype === this.childCustomer.custtype
            );
            let data1:any;
            // let data2;
            if (this.planGroupList) {
              data1 = this.planGroupList.filter(
                (plan:any) => plan.servicearea[0] == this.childCustomer.serviceareaid
              );
              // data2 = this.filterNormalPlanGroup.filter(plan =>
              //   plan.servicearea.forEach(e => e == this.childCustomer.serviceareaid)
              // );
            }
            setTimeout(() => {
              this.planGroupList = data1;
              // this.planGroupList = [...data1, ...data2];
            }, 1000);
            this.planGroupList.forEach((element:any, index:any) => {
              // if (
              //   element.planGroupId == this.childCustomer.plangroupid
              // ) {
              //   this.planGroupList.splice(index, 1)
              // }

              if (element.planMode == "SPECIAL") {
                element.planGroupName = element.planGroupName + " - (SP)";
              }
            });
            // this.newPlanGroupData = this.planGroupList;
          });
          this.customerManagementService.getMethod(planurl).subscribe((response: any) => {
            this.planListByType = response.postpaidplanList.filter(
              (plan:any) => plan.plantype === this.childCustomer.custtype
            );

            this.planListByType.forEach((element:any) => {
              if (element.mode == "SPECIAL") {
                element.name = element.name + " - (SP)";
              }
            });
          });
        });
      } else {
        if (this.childCustomer.planMappingList.length > 0 && !responsePrime.isCustomerPrime) {
          const url = "/postpaidplan/" + this.childCustomer.planMappingList[0].planId;
          this.customerManagementService.getMethod(url).subscribe((response: any) => {
            planCategory = response.postPaidPlan.category;

            if (!responsePrime.isCustomerPrime) {
              planurl =
                "/plans/serviceArea?planCategory=" +
                planCategory +
                "&serviceAreaId=" +
                this.childCustomer.serviceareaid +
                "&planmode=NORMAL" +
                "&custId=" +
                this.childCustomer.id;
            }
            this.customerManagementService.getMethod(planurl).subscribe((response: any) => {
              this.planListCust = response.postpaidplanList.filter(
                (plan:any) => plan.plantype === this.childCustomer.custtype
              );
              this.planListCust.forEach((element:any) => {
                if (element.mode == "SPECIAL") {
                  element.name = element.name + " - (SP)";
                }
              });
            });
          });
        } else {
          if (!responsePrime.isCustomerPrime) {
            planurl =
              "/plans/serviceArea?planCategory=" +
              "Normal" +
              "&serviceAreaId=" +
              this.childCustomer.serviceareaid +
              "&planmode=NORMAL" +
              "&custId=" +
              this.childCustomer.id;
          }
          this.customerManagementService.getMethod(planurl).subscribe((response: any) => {
            plandata1 = response.postpaidplanList.filter(
              (plan:any) => plan.plantype === this.childCustomer.custtype
            );

            if (plandata1.length > 0) {
              plandata1.forEach((element:any, i:any) => {
                let n = i + 1;
                if (element.mode == "SPECIAL") {
                  element.name = element.name + " - (SP)";
                }
              });
            }

            if (responsePrime.isCustomerPrime) {
              this.customerManagementService
                .getMethod(specialPlanURL)
                .subscribe((response: any) => {
                  plandata2 = response.postpaidplanList.filter(
                    (plan:any) => plan.plantype === this.childCustomer.custtype
                  );

                  if (plandata2.length > 0) {
                    plandata2.forEach((element1:any, j:any) => {
                      let m = j + 1;
                      if (element1.mode == "SPECIAL") {
                        element1.name = element1.name + " - (SP)";
                      }
                      if (plandata2.length == m) {
                        plandata2.forEach((e1:any, i:any) => {
                          plandata1.forEach((e2:any, j:any) => {
                            if (e1.id == e2.id) {
                              plandata2.splice(i, 1);
                            }
                            let k = i + 1;
                          });
                        });
                        this.planListCust = plandata1.concat(plandata2);
                      }
                    });
                  } else if (plandata2.length == 0) {
                    this.planListCust = plandata1;
                  }
                });
            } else {
              this.planListCust = plandata1;
            }
            // console.log(this.planListCust, "DataList plan");
          });
        }
      }
    });
  }

  getSelectCustomerPlanType(e:any, plan:any) {
    // this.changePlanStartEndDate()
    // this.selectPlan0Rplangroup = plan;
    // this.changePlanStartEndDate()
    if (plan == "PlanGroup") {
      this.getserviceData(e.value, true);
      // this.custPlanForms.get("planGroupId").disable();
      // this.custPlanForms.get("planList").disable();
      // this.custPlanForms.get("planId").disable();
    } else {
      // this.custPlanForms.get("planGroupId").disable();
      // this.custPlanForms.get("planList").disable();
      // this.custPlanForms.get("planId").disable();
      let data = {
        value: e.value,
        index: "",
      };
      this.getPlanDetailById(data);
    }
  }

  getserviceData(groupId:any, isPopup:any) {
    let services = [];
    const url =
      "/subscriber/getPlanByCustService/" + this.childCustomer.id + "?isNotChangePlan=false";

    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.custServiceData = [];
        response.dataList.forEach((service:any) => {
          if (!this.custServiceData.find((srv:any) => srv.connection_no === service.connection_no)) {
            this.custServiceData.push(service);
          }
        });
        var keepGping = false;
        if (this.custServiceData.length > 0) {
          this.serviceSerialNumbers = [];
          this.custServiceData.forEach((item: { customerInventorySerialnumberDtos: any[]; custPlanMapppingId: any; }) => {
            if (!keepGping) {
              var filteredItem = item.customerInventorySerialnumberDtos.filter(
                item => item.primary
              );
              if (filteredItem.length > 0) {
                this.isShowConnection = false;
                this.serviceSerialNumbers.push({
                  serialNumber: filteredItem[0].serialNumber,
                  custPlanMapppingId: item.custPlanMapppingId,
                });
              } else {
                this.isShowConnection = true;
                this.serviceSerialNumbers = [];
                keepGping = true;
              }
            }
          });
        }
        // services = [...new Set(services)];
        //Need to update conditions when we have more than one current plan or have one group plan then need to open selectPlanGroupChangeService modal open
        if (
          isPopup &&
          ((groupId != null && groupId != "") ||
            (this.custServiceData.length > 1 &&
              this.custPlanForms.value.ChangePlanCategory == "groupPlan") ||
            this.custPlanForms.value.purchaseType === "Renew")
        ) {
          // this.planSelected = null;
          // this.changePlanRemark = null;
          this.planGroupSelected = groupId;
          this.getPlanListByGroupId();
          this.paymentamountService.show(this.dialogId);
          // $("#selectPlanGroupChangeChild").modal("show");
          this.enableChangePlanGroup = false;
        } else {
          this.planSelected = null;
          this.changePlanRemark = null;
          this.custPlanMapppingId = this.custServiceData[0].custPlanMapppingId;
          // $("#selectPlanChangeService").modal("show");
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

  getPlanListByGroupId() {
    // this.newPlanSelectArray.reset();
    // this.newPlanSelectArray = this.fb.array([]);

    const url = `/plansByPlanGroupId?planGroupId=` + this.planGroupSelected;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.planList = response.planList;
        if (this.custServiceData) {
          if (
            this.custPlanForms.value.changePlanCategory == "groupPlan" ||
            this.custPlanForms.value.purchaseType === "Renew"
          )
            this.groupPlanListByType = this.planList;
        }
        if (this.lastRenewalChildPlanGroupId != this.planGroupSelected) {
          // this.planList.forEach(element => {
          // this.onNewBindingPlanMapping();
          // });
        }
        this.planChangeListdatatotalRecords = this.planList.length;
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

  selectedPlan(e:any, i:any, custPlanMapppingId:any) {
    let data = {
      value: e.value,
      index: i,
    };
    this.getPlanDetailById(data);

    this.custServiceData[i].newplan = e.value;
    this.enableChangePlanGroup = true;
    this.custServiceData.forEach((element:any) => {
      if (!(element.newplan && element.newplan !== null && element.newplan !== "")) {
        this.enableChangePlanGroup = false;
      }
    });
  }

  filterplanGroup(id:any, custPlanMapppingId:any, index:any) {
    console.log(id);
    this.custPlanMapppingId = custPlanMapppingId;
    this.planByService = [];
    if (
      this.custPlanForms.value.changePlanCategory === "groupPlan" ||
      this.custPlanForms.value.purchaseType === "Renew"
    ) {
      this.planByService = this.groupPlanListByType;
      this.planByService.forEach((element:any) => {
        element.disabled = true;
      });
      this.planByService.forEach((element:any, i:any) => {
        if (element.serviceId == id) {
          // this.planByService.push(element);
          this.planByService[i].disabled = false;
        }
      });
    } else {
      this.changePlanTypeForChangePlan(id);
      // this.planByService = this.planListByType;
      // this.planByService = this.planByService.filter(item => item.serviceId == id);

      var uniqueItems = [];
      for (const item of this.planByService) {
        const found = uniqueItems.some(value => isEqual(value, item));
        if (!found) {
          uniqueItems.push(item);
        }
      }
      this.plansByServiceArr[index] = uniqueItems;
    }
  }

  changePlanTypeForChangePlan(serviceId:any) {
    // this.childPlanType = $event.value;
    // this.isPlanTypeAddon = false;
    // this.planListByType = [];
    var purchaseType = this.custPlanForms.value.purchaseType;
    if (purchaseType != null && purchaseType != undefined) {
      if (purchaseType === "Addon") {
        // this.isPlanTypeAddon = true;
        this.planByService = this.planListByType.filter(
          (plan:any) =>
            plan.serviceId == serviceId &&
            (plan.planGroup === "Volume Booster" || plan.planGroup === "Bandwidthbooster")
        );
      } else if (purchaseType === "Renew") {
        // this.isPlanTypeAddon = false;
        this.planByService = this.planListByType.filter(
          (plan:any) =>
            (plan.serviceId == serviceId && plan.planGroup === "Renew") ||
            plan.planGroup === "Registration and Renewal"
        );
      } else if (purchaseType === "Changeplan") {
        this.planByService = this.planListByType.filter(
          (plan:any) =>
            plan.serviceId == serviceId &&
            (plan.planGroup === "Registration" || plan.planGroup === "Registration and Renewal")
        );
        // this.planListByType = this.filterPlanListCust.filter(plan => plan.planGroup === "Renew");
      }
    }
  }

  getChangePlan($event:any) {
    if (
      this.custPlanForms.value.changePlanCategory == "groupPlan" &&
      this.custPlanForms.value.purchaseType === "Changeplan"
    ) {
      this.custPlanForms.get("planGroupId")?.setValidators([Validators.required]);
      this.custPlanForms.get("planGroupId")?.updateValueAndValidity();
      this.confirmationService.confirm({
        message: "Do you want Change Plan to continue?",
        header: "Change Plan Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          // this.subisuChange = true;
          this.isPlanGroup = true;
          // this.childCustomer.plangroupid = 0;
          this.getplanChangeforplanGroup();
        },
        reject: () => {
          // this.subisuChange = false;
          this.isPlanGroup = false;
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected",
          });
          // $("#selectPlanChange").modal("show");
        },
      });
    } else if (
      this.custPlanForms.value.changePlanCategory !== "groupPlan" &&
      this.childCustomer.plangroupid !== null
    ) {
      // this.isPlanGroup = false;
      this.custPlanForms.get("planGroupId")?.setValue(null);
      this.custPlanForms.get("planGroupId")?.clearValidators();
      this.custPlanForms.get("planGroupId")?.updateValueAndValidity();
      this.getplanChangeforplanGroup();
      this.modalOpenPlanChange({ value: this.childCustomer.plangroupid });
    } else if (this.custPlanForms.value.changePlanCategory !== "groupPlan") {
      this.isPlanGroup = false;
    }
  }

  getPlanDetailById($event:any) {
    this.planDiscount = 0;
    this.planDropdownInChageData = [];
    this.plansArray = this.fb.array([]);
    this.planSelected = $event.value;
    const url = "/postpaidplan/" + this.planSelected;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.selPlanData = response.postPaidPlan;
        this.planDropdownInChageData.push(response.postPaidPlan);

        // console.log("this.selPlanData", this.selPlanData);
        const date = new Date();
        this.selPlanData.activationDate = this.datepipe.transform(date, "dd-MM-yyyy");
        this.selPlanData.expiryDate = date.setDate(date.getDate() + this.selPlanData.validity);
        this.selPlanData.expiryDate = this.datepipe.transform(
          this.selPlanData.expiryDate,
          "dd-MM-yyyy"
        );
        this.selPlanData.finalAmount = this.selPlanData.offerprice + this.selPlanData.taxamount;
        this.changePlanStartEndDate();
        let discountData = this.custCustDiscountList.find(
          (element:any) => element.id === this.custPlanMapppingId
        );
        if (
          discountData &&
          discountData.discountType === "Recurring" &&
          (discountData.discountExpiryDate).isSameOrAfter("day") &&
          discountData.discount > 0
        ) {
          this.confirmationService.confirm({
            message: "Do you want to apply " + discountData.discount + " % of  Discount?",
            header: "Change Discount Confirmation",
            icon: "pi pi-info-circle",
            accept: () => {
              this.planDiscount = discountData.discount;
              this.updateDiscountFromService($event.value, $event.index);
            },
            reject: () => {
              this.messageService.add({
                severity: "info",
                summary: "Rejected",
                detail: "You have rejected",
              });
              this.planDiscount = 0;
              this.updateDiscountFromService($event.value, $event.index);
            },
          });
        } else if (
          discountData &&
          discountData.discountType === "Recurring" &&
          (discountData.discountExpiryDate).isSameOrAfter("day") &&
          discountData.discount < 0
        ) {
          this.confirmationService.confirm({
            message: "Do you want to over charge customer " + discountData.discount + " % ?",
            header: "Change Discount Confirmation",
            icon: "pi pi-info-circle",
            accept: () => {
              this.planDiscount = discountData.discount;
              this.updateDiscountFromService($event.value, $event.index);
            },
            reject: () => {
              this.messageService.add({
                severity: "info",
                summary: "Rejected",
                detail: "You have rejected",
              });
              this.planDiscount = 0;
              this.updateDiscountFromService($event.value, $event.index);
            },
          });
        } else {
          this.planDiscount = 0;
          this.updateDiscountFromService($event.value, $event.index);
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

  updateDiscountFromService(id:any, index:any) {
    if (
      (this.isPlanGroup || this.custPlanForms.value.ChangePlanCategory === "groupPlan") &&
      this.custPlanForms.value.purchaseType !== "Addon"
    ) {
      this.custServiceData.find((serviceData:any) => serviceData.newplan === id).discount =
        this.planDiscount;
      this.finalOfferPrice = 0;
      this.custServiceData.forEach((custChild:any) => {
        if (index !== "") {
          this.groupOfferPrices[index] = Number(this.selPlanData.offerprice);
        }
        if (custChild.newplan) {
          this.customerManagementService
            .getofferPriceWithTax(
              custChild.newplan,
              custChild.discount,
              this.custPlanForms.value.ChangePlanCategory === "groupPlan"
                ? this.planGroupSelected
                : ""
            )
            .subscribe((response: any) => {
              if (response.result.finalAmount) {
                this.finalOfferPrice += Number(response.result.finalAmount.toFixed(3));
              } else {
                this.finalOfferPrice = 0;
              }
            });
        }
      });
      this.offerPrice = 0;
      for (let obj of Object.keys(this.groupOfferPrices)) {
        this.offerPrice += Number(this.groupOfferPrices[obj]);
      }
    } else {
      this.custPlanForms.value.discount = this.planDiscount;
      this.finalOfferPrice = 0;
      this.offerPrice = 0;
      this.offerPrice += Number(this.selPlanData.offerprice);
      this.customerManagementService
        .getofferPriceWithTax(this.custPlanForms.value.planId, this.planDiscount)
        .subscribe((response: any) => {
          if (response.result.finalAmount) {
            this.finalOfferPrice = Number(response.result.finalAmount.toFixed(3));
          } else {
            this.finalOfferPrice = 0;
          }
        });
    }
  }

  changePlanStartEndDate() {
    const newPlan: any[] = [];
    if (this.subisuChange) {
      this.custPlanForms.patchValue({
        planMappingList: this.plansArray.value,
      });
      this.plansArray.value.forEach((element:any, i:any) => {
        newPlan.push(element.planId);
      });
    } else {
      this.custPlanForms.patchValue({
        newPlanList: this.selectPlanListIDs,
        planMappingList: null,
      });
    }

    this.changePlanData = this.custPlanForms.value;
    this.changePlanData.isAdvRenewal = false;
    this.changePlanData.custId = this.childCustomer.id;
    if (!this.changePlanData.recordPaymentDTO) {
      this.changePlanData.recordPaymentDTO = {};
    } else {
      this.changePlanData.recordPaymentDTO.isTdsDeducted = false;
      this.changePlanData.recordPaymentDTO.custId = this.childCustomer.id;
    }
    this.changePlanData.isRefund = false;

    if (this.changePlanBindigChildNewPlan.length == 0) {
      this.changePlanData.planBindWithOldPlans = null;
    } else {
      this.changePlanData.planBindWithOldPlans = this.changePlanBindigChildNewPlan;
    }
    // this.changePlanData.planList = null;

    if (this.selectPlanListIDs.length !== 0 && !this.subisuChange) {
      this.changePlanData.newPlanList = this.selectPlanListIDs;
    } else if (this.selectPlanListIDs.length !== 0 && this.subisuChange) {
      this.changePlanData.newPlanList = newPlan;
      this.changePlanData.planMappingList = this.plansArray.value;
    } else {
      this.changePlanData.newPlanList = null;
      this.changePlanData.planMappingList = null;
    }

    if (this.custPlanForms.value.planList) {
      this.changePlanData.planId = this.custPlanForms.value.planList;
    }
    if (this.custPlanForms.value.purchaseType == "Addon") {
      this.changePlanData.addonStartDate = this.currentData;
    }
    this.changePlanData.discount = this.planDiscount;
    // this.changePlanData.newPlanList= this.selectPlanListIDs
    delete this.changePlanData.connectionNo;
    delete this.changePlanData.serviceName;
    delete this.changePlanData.serviceNickName;
    delete this.changePlanData.planList;
    this.changePlanData.custServiceMappingId = this.custPlanMapppingId;
    const CustChangePlan = {
      changePlanRequestDTOList: [this.changePlanData],
    };

    const url = "/subscriber/getStartAndEndDate";
    this.customerManagementService.postMethod(url, CustChangePlan).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.changePlanDate = response.data;
        } else {
          this.custPlanForms.get("isPaymentReceived")?.setValue("false");
        }
      },
      (error: any) => {
        this.custPlanForms.get("isPaymentReceived")?.setValue("false");
      }
    );
  }

  selectcharge(_event: any) {
    const chargeId = _event.value;
    let viewChargeData;
    let date;

    date = this.currentDate.toISOString();
    const format = "yyyy-MM-dd";
    const locale = "en-US";
    const myDate = date;
    const formattedDate = formatDate(myDate, format, locale);
    //
    const url = "/charge/" + chargeId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      viewChargeData = response.chargebyid;
      this.selectchargeValueShow = true;
      this.chargeGroupForm.patchValue({
        actualprice: Number(viewChargeData.actualprice),
        charge_date: formattedDate,
        type: "One-time",
      });
    });
  }

  onAddoverChargeListField() {
    this.chargesubmitted = true;
    if (this.chargeGroupForm.valid) {
      if (this.chargeGroupForm.value.price >= this.chargeGroupForm.value.actualprice) {
        this.overChargeListFromArray.push(this.createoverChargeListFormGroup());
        this.chargeGroupForm.reset();
        this.chargesubmitted = false;
        this.selectchargeValueShow = false;
      }
    } else {
      // console.log("I am not valid");
    }
  }

  createoverChargeListFormGroup(): FormGroup {
    // this.chargeGroupForm.get("billingCycle").clearValidators();
    // this.chargeGroupForm.get("billingCycle").updateValueAndValidity();
    let billingCycle = this.chargeGroupForm.value.type === "Recurring" ? 1 : "";
    let planName = this.planDropdownInChageData.find(
      plan => plan.id == this.chargeGroupForm.value.planid
    ).planName;
    return this.fb.group({
      // chargeid: [''],
      type: [this.chargeGroupForm.value.type ? this.chargeGroupForm.value.type : "Recurring"],
      chargeid: [this.chargeGroupForm.value.chargeid],
      validity: [this.chargeGroupForm.value.validity],
      price: [this.chargeGroupForm.value.price],
      actualprice: [this.chargeGroupForm.value.actualprice],
      charge_date: [this.chargeGroupForm.value.charge_date],
      planid: [this.chargeGroupForm.value.planid],
      planName: [planName],
      unitsOfValidity: [this.chargeGroupForm.value.unitsOfValidity],
      billingCycle: [billingCycle],
      discount: [this.chargeGroupForm.value.discount],
      staticIPAdrress: [this.chargeGroupForm.value.staticIPAdrress],
      expiry: [(this.chargeGroupForm.value.expiry).format("DD-MM-YYYY HH:mm").toString()],
    });
  }

  selectTypecharge(e:any) {
    this.chargeGroupForm.get("connection_no")?.reset();
    this.chargeGroupForm.get("planid")?.reset();
    this.chargeGroupForm.get("expiry")?.reset();
    if (e.value == "Recurring") {
      // this.chargeGroupForm.get("billingCycle").setValidators([Validators.required]);
      // this.chargeGroupForm.get("billingCycle").updateValueAndValidity();
    } else {
      this.chargeGroupForm.value.billingCycle = 0;
      // this.chargeGroupForm.get("billingCycle").clearValidators();
      // this.chargeGroupForm.get("billingCycle").updateValueAndValidity();
    }
  }

  getPlanValidityForChagre(event:any) {
    const planId = event.value;
    const url = "/postpaidplan/" + planId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      const planDetailData = response.postPaidPlan;
      this.chargeGroupForm.patchValue({
        validity: Number(planDetailData.validity),
        unitsOfValidity: planDetailData.unitsOfValidity,
        expiry: planDetailData.expiryDate,
      });
    });
  }

  isStaticIPAdrress(chargeid:any) {
    if (chargeid !== null && chargeid !== undefined && chargeid !== "") {
      return (
        this.commondropdownService.chargeByTypeData.filter(
          (charge:any) => charge.id === chargeid && charge.chargecategory === "IP"
        ).length > 0
      );
    } else {
      return false;
    }
  }

  deleteConfirmonChargeField(chargeFieldIndex: number, name: string) {
    if (chargeFieldIndex || chargeFieldIndex == 0) {
      const msgTxt: string = "";
      if (name == "paymapping") {
        msgTxt == "Do you want to delete this Payment ?";
      } else if (name == "chargelist") {
        msgTxt == "Do you want to delete this Charge ?";
      } else if (name == "MAC") {
        msgTxt == "Do you want to delete this MAC Address ?";
      } else if (name == "uploadDocument") {
        msgTxt == "Do you want to delete this Document ?";
      }
      this.confirmationService.confirm({
        message: "Do you want to delete this " + name + "?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          // console.log(name);
          switch (name) {
            case "Charge":
              this.onRemoveChargelist(chargeFieldIndex);
              break;
            // case 'uploadDocument':
            //   this.onRemoveUploadDocument(chargeFieldIndex);
            //   break;
          }
        },
        reject: () => {
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected",
          });
        },
      });
    }
  }

  async onRemoveChargelist(index: number) {
    let Data: any;
    //
    this.overChargeListFromArray.removeAt(index);
  }

  addRemark() {
    this.changePlanRemark = null;
    this.paymentamountService.hide(this.dialogId);
    // $("#selectPlanGroupChangeChild").modal("hide");
  }
  planTotalOffetPrice = 0;
  planListSubisu: any;
  planGroupSelectedSubisu: any;

  modalClosePlanChangeSubisu() {
    $("#selectPlanGroup").modal("hide");
    this.changePlanStartEndDate();
  }

  subisuPrice(e:any, planId:any) {
    this.newSubisuPrice[planId] = e.target.value;
  }

  changePlanDataObj() {
    let planData: any = {};
    const pareChildPojo: any = [];
    console.log(
      "<<<<<<<<<<<<<<<<<<<<<<< changePlanDataObj >>>>>>>>>>>>>>>>>>>>>>>>>>>>",
      this.UpdateCustPlans
    );
    this.changePlanChildValidData.emit(this.custPlanForms.valid);
    this.UpdateCustPlansData.emit(this.UpdateCustPlans);

    if (this.UpdateCustPlans == true) {
      this.changePlansubmitted = true;
      if (this.custPlanForms.valid) {
        let newChangePlan = [];
        let planList: any = {};
        if (this.custPlanForms.value.purchaseType == "Changeplan") {
          if (this.childCustomer.plangroupid != null || this.isPlanGroup) {
            let updatedData: ({
              billToOrg: boolean; newPlanGroupId: any; planGroupId: any; newPlanId: any; newAmount: any;
              // newAmount: 0,
              custServiceMappingId: any;
              // discount: planGroupdiscount,
              discount: any;
            } | { billToOrg: boolean; newPlanGroupId: any; planGroupId: any; newPlanId: any; custServiceMappingId: any; discount: any; newAmount?: undefined; })[] = [];
            this.custServiceData.forEach((e:any) => {
              let data;
              if (e.newplan) {
                if (this.subisuChange) {
                  data = {
                    billToOrg: true,
                    newPlanGroupId:
                      this.custPlanForms.value.changePlanCategory !== "groupPlan" &&
                      this.childCustomer.plangroupid !== null
                        ? ""
                        : this.planGroupSelected,
                    planGroupId: this.planGroupSelected,
                    newPlanId: e.newplan,
                    newAmount: this.newSubisuPrice[e.newplan],
                    // newAmount: 0,
                    custServiceMappingId: e.custPlanMapppingId,
                    // discount: planGroupdiscount,
                    discount: e.discount,
                  };
                } else {
                  data = {
                    billToOrg: false,
                    newPlanGroupId:
                      this.custPlanForms.value.changePlanCategory !== "groupPlan" &&
                      this.childCustomer.plangroupid !== null
                        ? ""
                        : this.planGroupSelected,
                    planGroupId: this.planGroupSelected,
                    newPlanId: e.newplan,
                    custServiceMappingId: e.custPlanMapppingId,
                    discount: e.discount,
                    // discount: planGroupdiscount,
                  };
                }
                updatedData.push(data);
              }
            });
            const deactivatePlanReqModels = updatedData;
            if (
              this.custPlanForms.value.changePlanCategory !== "groupPlan" &&
              this.childCustomer.plangroupid !== null
            ) {
              deactivatePlanReqModels.forEach(models => {
                planList = {
                  custId: this.childCustomer.id,
                  deactivatePlanReqModels: [models],
                  planGroupChange: false,
                  planGroupFullyChanged: false,
                  isParent: false,
                };
                newChangePlan.push(planList);
              });
            } else {
              planList = {
                custId: this.childCustomer.id,
                deactivatePlanReqModels: updatedData,
                planGroupChange: true,
                planGroupFullyChanged: true,
                isParent: false,
              };

              newChangePlan.push(planList);
            }
          } else {
            // let changePlanObj: any = {};
            // if()
            planList.custId = this.childCustomer.id;
            planList.planGroupChange = false;
            planList.planGroupFullyChanged = false;
            planList.paymentOwner =
              this.custPlanForms.value.paymentOwnerId != null &&
              this.custPlanForms.value.paymentOwnerId != ""
                ? this.staffDataList.find(
                    (staff:any) => staff.id === this.custPlanForms.value.paymentOwnerId
                  ).fullName
                : "";
            (planList.paymentOwnerId = this.custPlanForms.value.paymentOwnerId),
              (planList.deactivatePlanReqModels = []);

            let deactivatePlanReqObj: any = {};
            deactivatePlanReqObj.newPlanGroupId = "";
            if (this.subisuChange) {
              deactivatePlanReqObj.newAmount =
                this.newSubisuPrice[this.custPlanForms.value.planList];
              deactivatePlanReqObj.billToOrg = true;
            }
            deactivatePlanReqObj.newPlanId = this.custPlanForms.value.planList;
            deactivatePlanReqObj.planGroupId = "";
            deactivatePlanReqObj.planId = this.selectedCustService.planId;
            deactivatePlanReqObj.custServiceMappingId = this.selectedCustService.custPlanMapppingId;
            deactivatePlanReqObj.discount = this.planDiscount;
            planList.isParent = false;
            planList.deactivatePlanReqModels.push(deactivatePlanReqObj);
            newChangePlan.push(planList);
          }
          // this.changePlanApi(newChangePlan);
          // this.groupOfferPrices = {};
          // this.offerPrice = 0;
          // this.finalOfferPrice = 0;
          this.changePlanTypeData.emit(this.custPlanForms.value.purchaseType);
          this.changePlanChildData.emit({ changePlanRequestDTOList: newChangePlan });
        } else {
          planData.addonStartDate =
            this.custPlanForms.value.purchaseType == "Addon" ? this.currentData : null;
          planData.custId = this.childCustomer.id;
          planData.discount = this.changePlanData.discount;
          planData.isAdvRenewal = false;
          planData.isPaymentReceived = this.changePlanData.isPaymentReceived;
          planData.isRefund = false;

          // if (this.changePlanBindigChildNewPlan.length == 0) {
          //   this.changePlanData.planBindWithOldPlans = null;
          // } else {
          //   this.changePlanData.planBindWithOldPlans = this.changePlanBindigChildNewPlan;
          // }
          let updatedData: { newPlanId: any; custServiceMappingId: any; discount: any; }[] = [];
          this.custServiceData.forEach((e:any) => {
            if (e.newplan) {
              let data = {
                newPlanId: e.newplan,
                custServiceMappingId: e.custPlanMapppingId,
                discount: e.discount,
              };
              updatedData.push(data);
            }
          });
          console.log("Parent updatedData ::: ", updatedData);
          planData.planBindWithOldPlans = updatedData;

          if (!this.isPlanGroup) {
            planData.planId = this.custPlanForms.value.planId;
          } else {
            planData.planId = null;
            planData.planGroupId = this.custPlanForms.value.planGroupId;
          }

          if (this.selectPlanListIDs != null && this.selectPlanListIDs.length !== 0) {
            planData.newPlanList = this.selectPlanListIDs;
          } else {
            planData.newPlanList = null;
          }
          // planData.newPlanList = this.selectPlanChildListIDs;

          planData.purchaseType = this.custPlanForms.value.purchaseType;

          if (!planData.recordPaymentDTO) {
            planData.recordPaymentDTO = {};
          } else {
            planData.recordPaymentDTO.isTdsDeducted = false;
            planData.recordPaymentDTO.custId = this.childCustomer.id;
          }
          planData.remarks = this.changePlanData.remarks;
          // planData.updatedate =null
          // planData.walletBalUsed =null
          planData.custServiceMappingId = this.selectedCustService.custPlanMapppingId;
          planData.isParent = false;
          pareChildPojo.push(planData);

          // this.renewOrAddOnApi(changePlanData);
          // this.groupOfferPrices = {};
          // this.offerPrice = 0;
          // this.finalOfferPrice = 0;
          this.changePlanTypeData.emit(this.custPlanForms.value.purchaseType);
          this.changePlanChildData.emit({ changePlanRequestDTOList: pareChildPojo });
        }
      }
    } else {
      this.changePlanTypeData.emit(this.custPlanForms.value.purchaseType);
      this.changePlanChildData.emit({ changePlanRequestDTOList: [] });
    }
  }

  createNewChargeData(customerid:any) {
    let chargeData = [];
    let pojo: any[] = [];
    chargeData = this.overChargeListFromArray.value;
    if (this.customerChargeDataShowChangePlan.length == 0) {
      pojo = this.overChargeListFromArray.value;
    } else {
      chargeData.forEach((element, index) => {
        if (index > this.childChargeRecurringCustList) {
          pojo.push(element);
        }
      });
    }

    const url = "/createCustChargeOverride";
    const chargeDta = {
      custChargeDetailsPojoList: pojo,
      custid: customerid,
    };
    this.customerManagementService.postMethod(url, chargeDta).subscribe(
      (response: any) => {
        this.addChargeForm.reset();
        this.chargeGroupForm.reset();
        this.overChargeListFromArray = this.fb.array<FormGroup>([]);
      },
      (error: any) => {}
    );
  }

  getcustDiscountDetails(custId:any) {
    let custDiscountdatalength = 0;
    const url = "/subscriber/fetchCustomerDiscountDetailServiceLevel/" + custId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.custCustDiscountList = response.discountDetails;

        while (custDiscountdatalength < this.custCustDiscountList.length) {
          // const planurl =
          //   "/postpaidplan/" +
          //   this.custCustDiscountList[custDiscountdatalength].planId;
          // this.customerManagementService
          //   .getMethod(planurl)
          //   .subscribe((response: any) => {
          //     this.dataDiscountPlan.push(response.postPaidPlan);
          //     // console.log("dataPlan", this.dataPlan);
          //   });

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
          icon: "far fa-times-circle",
        });
      }
    );
  }

  // newDiscValueEdit(id) {
  //   this.newDiscValue = id;
  //   this.oldDiscValue = 0;
  // }

  modalOpenParentCustomer(type:any) {
    $("#selectParentCustomerForChild").modal("show");
    this.newFirst = 0;
    this.getParentCustomerData();
    this.selectedParentCust = [];
  }

  selParentSearchOption(event:any) {
    // console.log("value", event.value);
    if (event.value) {
      this.parentFieldEnable = true;
    } else {
      this.parentFieldEnable = false;
    }
  }

  removeSelParentCust(type:any) {
    this.selectedParentCust = [];
    this.billableCusList = [];
    this.custPlanForms.patchValue({
      billableCustomerId: null,
    });
  }

  getParentCustomerData() {
    let currentPage;
    // if (pageData) {
    //   currentPage = pageData + 1;
    // } else {
    currentPage = this.currentPageParentCustomerListdata;
    // }

    const data = {
      page: currentPage,
      pageSize: this.parentCustomerListdataitemsPerPage,
    };
    const url = "/parentCustomers/list/" + RadiusConstants.CUSTOMER_TYPE.PREPAID;
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.prepaidParentCustomerList = response.parentCustomerList;
        const list = this.prepaidParentCustomerList;

        this.prepaidParentCustomerList = list;
        // console.log("list", list);

        this.parentCustomerListdatatotalRecords = response.pageDetails.totalRecords;
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

  paginate(event:any) {
    // console.log("page event", this.selectedParentCust);
    this.currentPageParentCustomerListdata = event.page + 1;
    // this.first = event.first;
    if (this.searchParentCustValue) {
      this.searchParentCustomer();
    } else {
      this.getParentCustomerData();
    }
  }

  searchParentCustomer() {
    const searchParentData = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and",
        },
      ],
      page: this.currentPageParentCustomerListdata,
      pageSize: this.parentCustomerListdataitemsPerPage,
    };

    searchParentData.filters[0].filterValue = this.searchParentCustValue;
    searchParentData.filters[0].filterColumn = this.searchParentCustOption.trim();

    const url = "/parentCustomers/search/" + RadiusConstants.CUSTOMER_TYPE.PREPAID;
    // console.log("this.searchData", this.searchData)
    this.customerManagementService.postMethod(url, searchParentData).subscribe(
      (response: any) => {
        this.prepaidParentCustomerList = response.parentCustomerList;
        const list = this.prepaidParentCustomerList;
        this.prepaidParentCustomerList = list;
        // console.log("list", list);
        this.parentCustomerListdatatotalRecords = response.pageDetails.totalRecords;
      },
      (error: any) => {
        this.parentCustomerListdatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle",
          });
        }
      }
    );
  }

  clearSearchParentCustomer() {
    this.currentPageParentCustomerListdata = 1;
    this.getParentCustomerData();
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
  }

  modalCloseParentCustomer() {
    $("#selectParentCustomerForChild").modal("hide");
    this.currentPageParentCustomerListdata = 1;
    this.newFirst = 0;
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
  }

  async saveSelCustomer() {
    // console.log("page event", this.selectedParentCust);

    this.billableCusList = [
      {
        id: this.selectedParentCust.id,
        name: this.selectedParentCust.name,
      },
    ];
    this.custPlanForms.patchValue({
      billableCustomerId: this.selectedParentCust.id,
    });

    this.modalCloseParentCustomer();
  }

  getSerialNumber(plan:any) {
    return plan.customerInventorySerialnumberDtos.filter((item:any) => item.primary).length > 0
      ? plan.customerInventorySerialnumberDtos.filter((item:any) => item.primary)[0].serialNumber
      : "";
  }

  openPlanConnectionModal(plan:any) {
    this.planForConnection = plan;
    this.showPlanConnectionNo = true;
  }
  closeDialog() {
    this.planForConnection = null;
    this.showPlanConnectionNo = false;
  }

  selectedStaff: any = [];
  selectStaffType = "";
  staffSelectList: any = [];
  showSelectStaffModel = false;
  parentCustomerDialogType = "";
  modalOpenSelectStaff(type:any) {
    this.parentCustomerDialogType = type;
    this.showSelectStaffModel = true;
    this.selectedStaff = [];
    this.selectStaffType = type;
  }

  selectedStaffChange(event:any) {
    this.showSelectStaffModel = false;
    let data = event;
    this.staffSelectList = [
      {
        id: Number(data.id),
        name: data.firstname,
      },
    ];

    if (this.selectStaffType == "paymentCharge") {
      this.custPlanForms.patchValue({
        paymentOwnerId: data.id,
      });
    }
  }

  removeSelectStaff() {
    this.staffSelectList = [];
  }
}
