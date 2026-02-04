import { Component, EventEmitter, OnInit, Output, ViewChild, Input } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl,
} from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { BehaviorSubject, Observable, Observer } from "rxjs";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { WorkflowAuditDetailsModalComponent } from "src/app/components/workflow-audit-details-modal/workflow-audit-details-modal.component";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Regex } from "src/app/constants/regex";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { LoginService } from "src/app/service/login.service";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { PlanManagementService } from "src/app/service/plan-management.service";
import { ProductCategoryManagementService } from "src/app/service/product-category-management.service";
// Removed unused import of 'protractor'
import { FieldmappingService } from "src/app/service/fieldmapping.service";
import { DatePipe } from "@angular/common";
import { ProuctManagementService } from "src/app/service/prouct-management.service";
import { QosPolicyService } from "src/app/service/qos-policy.service";
declare var $: any;

@Component({
    selector: "app-common-plan",
    templateUrl: "./common-plan.component.html",
    styleUrls: ["./common-plan.component.css"],
    standalone: false
})
export class CommonPlanComponent implements OnInit {
isChargeEdit: boolean;
onAddCasMappingField(arg0: any) {
throw new Error('Method not implemented.');
}
revicedChargeValidation($event: KeyboardEvent) {
throw new Error('Method not implemented.');
}
deleteConfirmonQosPolicy(_t577: number) {
throw new Error('Method not implemented.');
}
onAddQosPolicy() {
throw new Error('Method not implemented.');
}
setToValidation() {
throw new Error('Method not implemented.');
}
selPlanMode($event: any) {
throw new Error('Method not implemented.');
}
  @ViewChild(WorkflowAuditDetailsModalComponent)
  custauditWorkflowModal: WorkflowAuditDetailsModalComponent;
  @Output() planFormDTO = new EventEmitter();
  @Input() selServiceData: any;
  @Input() isServiceEdit: any;
  @Input() isServiceEditData: any;
  @Input() planServiceId: any;
  @Input() leadCustomerType: any;
  @Input() generateCircuitName: any;
  @Input() ifLeadQuickInput: any;
  @Input() quickplanID: any;
  auditcustid = new BehaviorSubject({
    auditcustid: "",
    checkHierachy: "",
    planId: "",
  });
  ifplanGroup_BWB = false;
  ifplanGroup_VB = false;
  chargeTaxAmountArray:[] = [];
  casPackegeAllData: any = [];
  currentPagePlanProductMapping = 1;
  planProductMappingTotalRecords: number;
  planProductMappingItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  planGroupForm: FormGroup;
  chargeGroupFormArray: FormArray;
  chargeGroupForm: FormGroup;
  chargeSubmitted: boolean = false;
  createPlanData: any = {};
  chargeFromArray: FormArray;
  qospolicyformArray: FormArray;
  qosPolicyGatewayMappingListFormArray: FormArray;
  submitted: boolean = false;
  planGroupData: any;
  planCategoryData: any;
  planTypeData: any;
  serviceData: any;
  qosPolicyData: any;
  data: any;
  timeBasePolicyData: any;
  quotaData: any;
  quotaTypeData: any;
  currentPageCharge = 1;
  chargeitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  chargetotalRecords: String;
  currentPageqospolicye = 1;
  qospolicyitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  qospolicytotalRecords: any;
  currentPagePostPaidPlan = 1;
  postPaidPlanitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  postPaidPlantotalRecords: any;
  chargeCategoryList: any;
  taxListData: any;
  chargeListData: any;
  postPaidPlanList: any;
  isPlanEdit: boolean = false;
  viewPlanListData: any;
  searchPlanName: any = "";
  searchPlanType: any = "";
  searchData: any;
  viewChargeListData: any;
  charge: any = {};
  createView: boolean = false;
  planDetailData: any = {
    name: "",
    displayName: "",
    code: "",
    plantype: "",
    category: "",
    serviceId: "",
    planGroup: "",
    offerprice: "",
    startDate: "",
    endDate: "",
    validity: "",
    allowOverUsage: "",
    maxconcurrentsession: "",
    status: "",
    quotatype: "",
    desc: "",
    saccode: "",
    qospolicyid: "",
    qospolicyName: "",
    timebasepolicyId: "",
    timebasepolicyName: "",
    quotaResetInterval: "",
    radiusPolicy: "",
    param1: "",
    param2: "",
    param3: "",
    chargeList: [],
    productplanmappingList: [],
  };
  // chargefromgroup: FormGroup;
  qospolicyformgroup: FormGroup;
  qospolicySubmitted: boolean = false;
  planProductMappingFromArray: FormArray;
  planProductfromgroup: FormGroup;
  planProductSubmitted: boolean = false;
  prepaidListView: boolean = false;
  postpaidListView: boolean = false;
  detailView: boolean = false;
  listView: boolean = true;
  chargeArray: any = [];
  advanceListData: any = [];
  qtyErroMsg = "";
  showQtyError: boolean;
  chargeDeatilItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  chargeDeatiltotalRecords: String;
  currentPageChargeDeatilList = 1;
  qosPolicyDeatilItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  qosPolicyDeatiltotalRecords: String;
  currentPagecustQosPolicyDeatilList = 1;
  productDeatilItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  productDeatiltotalRecords: String;
  productPageChargeDeatilList = 1;
  searchKey: string;
  AclClassConstants;
  AclConstants;
  max:any;
  prepaidType: boolean = false;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: string;

  public loginService: LoginService;
  disbleDate: any;
  maxDisbleDate: any;
  searchKeyType: any;

  planDiscount = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  qutaUnitTime = [
    { label: "Minute", value: "MIN" },
    { label: "Hour", value: "HOUR" },
    { label: "Day", value: "DAY" },
  ];
  planCategory = [
    { label: "True", value: true },
    { label: "False", value: false },
  ];
  quotaResetIntervalData = [
    { label: "Daily" },
    { label: "Weekly" },
    { label: "Monthly" },
    { label: "Total" },
  ];
  inventoryType = [{ label: "New" }, { label: "Refurbished" }];

  validityUnit = [{ label: "Hours" }, { label: "Days" }, { label: "Months" }, { label: "Years" }];
  planStatus = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
  ];
  productType = [
    { label: "New", value: "New" },
    { label: "Refurbished", value: "Refurbished" },
  ];
  ownershipType = [
    { label: "Sold", value: "Sold" },
    { label: "Organization Owned", value: "Organization Owned" },
  ];
  statusOptions = RadiusConstants.status;
  billingCycle: any = [];
  viewQosPolicyListData: any = [];
  viewTimeBasePolicyListData: any = [];
  type = [{ label: "NORMAL" }, { label: "SPECIAL" }];
  pricePerTax: any = 0;
  totalPriceData:[] = [];
  countTotalOfferPrice = 0;
  isServiceHideField: boolean = false;
  isQuotaEnabled: boolean = true;
  isQuotaTimeEnabled: boolean = true;
  planProductMappingShowFlag: boolean = false;
  assignPlanForm: FormGroup;
  rejectPlanForm: FormGroup;
  assignPlansubmitted: boolean = false;
  rejectPlanSubmitted: boolean = false;
  productChargeFlag: boolean = false;
  revisedChargeFlag: boolean = false;
  assignPlanID: any;
  nextApproverId: any;
  remarks: any;

  currentPageMasterSlab = 1;
  MasteritemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  MastertotalRecords: String;

  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  workflowAuditData: any = [];
  EventID: any;
  planStatusDetail:[] = [];
  inventoryCat:[] = [];
  staffID: number;
  currentStatus: any;
  planStatusField: boolean = false;

  ifPlanEditInput = false;
  ifServiceParam = false;
  chargeTypeGetDataData: any = [];
  chargeType: any = [];
  ProductsType: any = [];
  productList: any = [];
  allActiveProduct: any = [];
  isServiceArea_PlanType: boolean = true;
  serviceList: any;

  casmasterData: any;
  casPackageData: any;
  planCasMappingFromGroup: FormGroup;
  planCasMappingFromArray: FormArray;
  planCasMappingSubmitted = false;

  serviceParamFromGroup: FormGroup;
  serviceParamFromArray: FormArray;
  serviceParamSubmitted = false;

  taxDetails: any = [];

  isPlanPriceChanged = false;

  basicLeadArr: any = [];
  fieldsArr: any = [];
  planArr: any = [];
  customerGroupForm!: FormGroup;
  getProductDetailsById: any = [];
  chargeAmount: any;
  revicedAmount: any;
  productFlag: boolean = false;
  productTypeFlag: boolean = false;
  ownershipTypeFlag: boolean = false;
  cities: any = [];
  exampleGroupForm!: FormGroup;
  showDependantDropdown: boolean = false;
  dependantOptionList: any = [];
  allFieldsArr: any = [];
  form: any = {};
  optionList: any = [];
  multiOptionList: any = [];
  customerSave: any = [];
  childOptionList: any = [];
  templateSubmitted: boolean = false;
  filteredArray: any = [];
  presentAddressArr: any[] = [];
  testAddressArr: any[] = [];
  permanentAddressArr: any = [];
  paymentAddressArr: any = [];
  addressList: FormArray[] = [];
  minfrompercentage = 101;
  mintopercentage = 101;
  totalCharges: any = [];
  selectedServiceId: any;
  taxAmount: any;

  currentPageChargeData = 1;
  chargeIemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  chargeDatatotalRecords: any;
  taxUpRange = "";
  chargeValueSentence = "";
  finalChargeType: any;
  mainChargeList: any;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private planManagementService: PlanManagementService,
    public commondropdownService: CommondropdownService,
    private qosPolicyService: QosPolicyService,
    public PaymentamountService: PaymentamountService,
    public productCategoryManagementService: ProductCategoryManagementService,
    private productManagementService: ProuctManagementService,
    loginService: LoginService,
    private custService: FieldmappingService,
    private tempservice: FieldmappingService,
    private DatePipe: DatePipe
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;

    let createAccess = loginService.hasOperationPermission(
      AclClassConstants.ACL_POSTPAID_PLAN,
      AclConstants.OPERATION_POSTPAID_PLAN_ADD,
      AclConstants.OPERATION_POSTPAID_PLAN_ALL
    );

    let editAccess = loginService.hasOperationPermission(
      AclClassConstants.ACL_POSTPAID_PLAN,
      AclConstants.OPERATION_POSTPAID_PLAN_EDIT,
      AclConstants.OPERATION_POSTPAID_PLAN_ALL
    );

    this.isPlanEdit = !createAccess && editAccess ? true : false;
    // let plandata = [];
    // this.productCategoryManagementService.getAll(plandata).subscribe((res:any)=>{
    //   this.inventoryCat = res.dataList;
    // })
  }
  timeStamp = new Date().toISOString();
  selServiceId: any = "";
  endDateVal: any;
  date: Date = new Date();


  getControl(row: AbstractControl, controlName: string): FormControl {
    if (row instanceof FormGroup) {
      const ctrl = row.get(controlName);
      if (ctrl instanceof FormControl) {
        return ctrl;
      }
    }
    return new FormControl('');
  }

  //timeStamp = 123;
  ngOnInit(): void {
    this.date.setDate(this.date.getDate() + 5000);
    this.endDateVal = this.DatePipe.transform(this.date, "yyyy-MM-dd");
    this.commondropdownService.planserviceData.filter((item:any) => {
      if (item.name == this.selServiceData) {
        this.selServiceId = {
          value: item.id,
        };
      }
    });
    // console.log("selServiceData", this.selServiceData, this.selServiceId);
    this.selService(this.selServiceId);
    let staffID = localStorage.getItem("userId");
    this.staffID = Number(staffID);

    this.planGroupForm = this.fb.group({
      // name: ["ePlan" + this.timeStamp],
      name: [this.generateCircuitName],
      displayName: [this.generateCircuitName],
      code: [this.generateCircuitName],
      saccode: [""],
      plantype: [this.leadCustomerType, Validators.required],
      category: ["Normal"],
      serviceId: [this.selServiceId.value],
      serviceAreaIds: ["", Validators.required],
      planGroup: ["Registration and Renewal"],
      // offerprice: [""],
      // newOfferPrice: [""],
      qospolicyid: [""],
      timebasepolicyId: [""],
      //radiusprofileIds: [""],
      startDate: [this.DatePipe.transform(new Date(), "yyyy-MM-dd")],
      endDate: [this.endDateVal],
      validity: ["", [Validators.required, Validators.pattern(Regex.numeric)]],
      unitsOfValidity: ["Days", Validators.required],
      param1: [""],
      param2: [""],
      param3: [""],
      accessibility: ["Both"],
      quotaUnit: ["", [Validators.required]],
      allowdiscount: ["false"],
      quotatype: ["", [Validators.required]],
      allowOverUsage: ["false"],
      maxconcurrentsession: ["1"],
      status: ["INACTIVE"],
      // product_category: [""],
      //product_type: [""],
      quotaunittime: ["", Validators.required],
      quotatime: ["", [Validators.required, Validators.pattern(Regex.numeric)]],
      quota: ["", [Validators.required, Validators.pattern(Regex.numeric)]],
      quotaResetInterval: ["", Validators.required],
      desc: ["", [Validators.required, Validators.pattern(Regex.characterlength255)]],
      mode: ["NORMAL"],
      //ProductsType: [""],
      //requiredApproval: [""],
      //invoiceToOrg: [""],
    });
    // console.log("this.leadCustomerType", this.leadCustomerType);
    if (this.leadCustomerType == null) {
      this.planGroupForm.patchValue({
        plantype: "Prepaid",
      });
    } else {
      this.planGroupForm.patchValue({
        plantype: this.leadCustomerType,
      });
    }
    this.planGroupForm.controls['name'].disable();
    this.planGroupForm.controls['displayName'].disable();
    this.planGroupForm.controls['code'].disable();
    this.planGroupForm.controls['category'].disable();
    this.planGroupForm.controls['planGroup'].disable();
    this.planGroupForm.controls['accessibility'].disable();
    this.planGroupForm.controls['allowdiscount'].disable();
    this.planGroupForm.controls['status'].disable();
    this.planGroupForm.controls['mode'].disable();
    this.planGroupForm.controls['startDate'].disable();
    this.planGroupForm.controls['endDate'].disable();
    this.planGroupForm.controls['allowOverUsage'].disable();
    this.planGroupForm.controls['maxconcurrentsession'].disable();
    this.planGroupForm.controls['serviceId'].disable();
    this.planGroupForm.controls['param1'].disable();
    this.planGroupForm.controls['param2'].disable();
    this.planGroupForm.controls['param3'].disable();
    this.planGroupForm.controls['saccode'].disable();

    this.chargeGroupForm = this.fb.group({
      actualprice: ["", Validators.required],
      chargecategory: ["", Validators.required],
      chargetype: ["", Validators.required],
      desc: ["", [Validators.required, Validators.pattern(Regex.characterlength225)]],
      name: ["", Validators.required],
      saccode: [""],
      taxid: ["", Validators.required],
      serviceid: [this.selServiceId.value],
      status: ["Active"],
      ledgerId: [""],
      serviceNameList: [null],
      royalty_payable: [false],
      billingCycle: [1, Validators.required],
    });

    this.chargeGroupForm.controls['serviceid'].disable();
    this.chargeGroupForm.controls['status'].disable();
    this.chargeGroupForm.controls['serviceNameList'].disable();
    this.chargeGroupForm.controls['royalty_payable'].disable();
    this.chargeGroupFormArray = this.fb.array([]);
    this.charge = {
      id: "",
      taxamount: "",
      actualprice: "",
    };

    this.assignPlanForm = this.fb.group({
      remark: ["", Validators.required],
    });
    this.rejectPlanForm = this.fb.group({
      remark: ["", Validators.required],
    });

    this.planProductfromgroup = this.fb.group({
      revisedCharge: [""],
      ownershipType: ["", Validators.required],
      productCategoryId: ["", Validators.required],
      productId: ["", Validators.required],
      product_type: ["", Validators.required],
      productQuantity: [1, [Validators.required, Validators.min(1)]],
      name: [""],
      id: [""],
    });

    this.planProductMappingFromArray = this.fb.array([]);
    this.planGroupForm.controls['quotaUnit'].disable();
    this.planGroupForm.controls['quota'].disable();
    this.planGroupForm.controls['quotaunittime'].disable();
    this.planGroupForm.controls['quotatime'].disable();

    this.searchData = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and",
        },
      ],
      page: "",
      pageSize: "",
    };
    // this.chargefromgroup = this.fb.group({
    //   id: ["", Validators.required],
    //   billingCycle: ["", Validators.required],
    //   actualprice: [""],
    //   taxamount: [""],
    //   chargeprice: [""],
    // });

    this.qospolicyformgroup = this.fb.group({
      qosid: ["", Validators.required],
      frompercentage: [101, [Validators.required, Validators.min(this.minfrompercentage)]],
      topercentage: [101, [Validators.required, Validators.min(this.mintopercentage)]],
    });

    this.planCasMappingFromGroup = this.fb.group({
      id: [""],
      casId: ["", Validators.required],
      packageId: ["", Validators.required],
      planId: [""],
    });

    this.planCasMappingFromArray = this.fb.array([]);
    this.chargeFromArray = this.fb.array([]);
    this.qospolicyformArray = this.fb.array([]);
    this.getPlanGroup();
    this.getPlanCaegory();
    this.getPlanType();
    this.getService();
    this.getQosPolicy();
    this.getTimeBasePolicy();
    this.getQoutaData();
    this.getInventoryCat();
    this.getQoutaType();
    this.getTaxDataList();
    this.getPostoaidPlan("");
    this.getAccessibilityData();
    this.getChargeType();
    this.getProductsType();
    this.getChargeCategory();
    this.billingSequence();
    this.commondropdownService.getchargeAll();
    this.commondropdownService.getActiveProductCategoryList();
    this.commondropdownService.getAllActiveProduct();
    this.getAllProduct();
    const serviceArea = localStorage.getItem("serviceArea");
    let serviceAreaArray = JSON.parse(serviceArea);
    if (serviceAreaArray.length !== 0) {
      this.commondropdownService.filterserviceAreaList();
    } else {
      this.commondropdownService.getserviceAreaList();
    }
    // this.chargefromgroup.controls.billingCycle.setValue("");
    //this.chargefromgroup.controls.billingCycle.enable();
    this.getAllCAS();
    this.getFields();
    setTimeout(() => {
      if (this.isServiceEdit) {
        // console.log("Edit", this.isServiceEdit);
        if (this.isServiceEditData.planMappingList[0].postpaidPlanPojo.plantype == "Postpaid") {
          this.chargeGroupForm.controls['billingCycle'].enable();
        } else {
          this.chargeGroupForm.controls['billingCycle'].disable();
        }
        this.planGroupForm.patchValue(this.isServiceEditData.planMappingList[0].postpaidPlanPojo);
        if (this.isServiceEditData.planMappingList[0].postpaidPlanPojo.quotatype == "Time") {
          this.planGroupForm.controls['quotaUnit'].disable();
          this.planGroupForm.controls['quota'].disable();
          this.planGroupForm.controls['quotaunittime'].enable();
          this.planGroupForm.controls['quotatime'].enable();
          this.isQuotaEnabled = false;
          this.isQuotaTimeEnabled = true;
          this.planGroupForm.patchValue({
            quotaunittime: this.isServiceEditData.planMappingList[0].postpaidPlanPojo.quotaunittime,
            quotatime: this.isServiceEditData.planMappingList[0].postpaidPlanPojo.quotatime,
          });
        } else if (this.isServiceEditData.planMappingList[0].postpaidPlanPojo.quotatype == "Data") {
          this.planGroupForm.controls['quotaUnit'].enable();
          this.planGroupForm.controls['quota'].enable();
          this.planGroupForm.controls['quotaunittime'].disable();
          this.planGroupForm.controls['quotatime'].disable();
          this.isQuotaEnabled = true;
          this.isQuotaTimeEnabled = false;
          this.planGroupForm.patchValue({
            quotaUnit: this.isServiceEditData.planMappingList[0].postpaidPlanPojo.quotaUnit,
            quota: this.isServiceEditData.planMappingList[0].postpaidPlanPojo.quota,
          });
        } else if (this.isServiceEditData.planMappingList[0].postpaidPlanPojo.quotatype == "Both") {
          this.planGroupForm.controls['quotaUnit'].enable();
          this.planGroupForm.controls['quota'].enable();
          this.planGroupForm.controls['quotaunittime'].enable();
          this.planGroupForm.controls['quotatime'].enable();
          this.isQuotaEnabled = true;
          this.isQuotaTimeEnabled = true;
          this.planGroupForm.patchValue({
            quotaunittime: this.isServiceEditData.planMappingList[0].postpaidPlanPojo.quotaunittime,
            quotatime: this.isServiceEditData.planMappingList[0].postpaidPlanPojo.quotatime,
            quotaUnit: this.isServiceEditData.planMappingList[0].postpaidPlanPojo.quotaUnit,
            quota: this.isServiceEditData.planMappingList[0].postpaidPlanPojo.quota,
          });
        }
        this.chargeGroupFormArray = this.fb.array([]);
        this.isServiceEditData.planMappingList[0].postpaidPlanPojo.chargeList.forEach(
          (element:any, i:any) => {
            this.chargeGroupFormArray.push(
              this.fb.group({
                id: [element.charge.id],
                billingCycle: [element.billingCycle],
                actualprice: [element.charge.actualprice],
                //chargeprice: [element.chargeprice],
                serviceNameList: [null],
                royalty_payable: [false],
                ledgerId: [element.charge.ledgerId],
                //  serviceid: [element.charge.serviceid],
                taxid: [element.charge.taxid],
                // saccode:[element.charge.saccode],
                name: [element.charge.name],
                desc: [element.charge.desc],
                chargetype: [element.charge.chargetype],
                chargecategory: [element.charge.chargecategory],
              })
            );
            //  this.chargeFromArray.push(this.fb.group(element.charge));
            //this.chargeFromArray.patchValue(this.isServiceEditData.planMappingList[0].postpaidPlanPojo.chargeList[i].charge);
          }
        );

        this.planProductMappingFromArray = this.fb.array([]);
        this.isServiceEditData.planMappingList[0].postpaidPlanPojo.productplanmappingList.forEach(
          (element:any) => {
            this.planProductMappingFromArray.push(this.fb.group(element));
          }
        );
        this.planProductMappingFromArray.patchValue(
          this.isServiceEditData.planMappingList[0].postpaidPlanPojo.productplanmappingList
        );
      } else {
        this.plantypeEvntData(this.leadCustomerType);
      }
    }, 1000);

    if (!this.isServiceEdit && this.ifLeadQuickInput) {
      this.postpaidPlanData();
    }
  }

  postpaidPlanData() {
    let PlanData: any = [];
    const urlPlan = "/postpaidplan/" + this.quickplanID;
    this.planManagementService.getMethod(urlPlan).subscribe((response: any) => {
      PlanData = response.postPaidPlan;
      if (PlanData.plantype == "Postpaid") {
        this.chargeGroupForm.controls['billingCycle'].enable();
      } else {
        this.chargeGroupForm.controls['billingCycle'].disable();
      }
      this.planGroupForm.patchValue(PlanData);
      if (PlanData.quotatype == "Time") {
        this.planGroupForm.controls['quotaUnit'].disable();
        this.planGroupForm.controls['quota'].disable();
        this.planGroupForm.controls['quotaunittime'].enable();
        this.planGroupForm.controls['quotatime'].enable();
        this.isQuotaEnabled = false;
        this.isQuotaTimeEnabled = true;
        this.planGroupForm.patchValue({
          quotaunittime: PlanData.quotaunittime,
          quotatime: PlanData.quotatime,
        });
      } else if (PlanData.quotatype == "Data") {
        this.planGroupForm.controls['quotaUnit'].enable();
        this.planGroupForm.controls['quota'].enable();
        this.planGroupForm.controls['quotaunittime'].disable();
        this.planGroupForm.controls['quotatime'].disable();
        this.isQuotaEnabled = true;
        this.isQuotaTimeEnabled = false;
        this.planGroupForm.patchValue({
          quotaUnit: PlanData.quotaUnit,
          quota: PlanData.quota,
        });
      } else if (PlanData.quotatype == "Both") {
        this.planGroupForm.controls['quotaUnit'].enable();
        this.planGroupForm.controls['quota'].enable();
        this.planGroupForm.controls['quotaunittime'].enable();
        this.planGroupForm.controls['quotatime'].enable();
        this.isQuotaEnabled = true;
        this.isQuotaTimeEnabled = true;
        this.planGroupForm.patchValue({
          quotaunittime: PlanData.quotaunittime,
          quotatime: PlanData.quotatime,
          quotaUnit: PlanData.quotaUnit,
          quota: PlanData.quota,
        });
      }
      this.chargeGroupFormArray = this.fb.array([]);
      PlanData.chargeList.forEach((element:any, i:any) => {
        this.chargeGroupFormArray.push(
          this.fb.group({
            id: [element.charge.id],
            billingCycle: [element.billingCycle],
            actualprice: [element.charge.actualprice],
            //chargeprice: [element.chargeprice],
            serviceNameList: [null],
            royalty_payable: [false],
            ledgerId: [element.charge.ledgerId],
            //  serviceid: [element.charge.serviceid],
            taxid: [element.charge.taxid],
            // saccode:[element.charge.saccode],
            name: [element.charge.name],
            desc: [element.charge.desc],
            chargetype: [element.charge.chargetype],
            chargecategory: [element.charge.chargecategory],
          })
        );
        //  this.chargeFromArray.push(this.fb.group(element.charge));
        //this.chargeFromArray.patchValue(PlanData.chargeList[i].charge);
      });

      this.planProductMappingFromArray = this.fb.array([]);
      PlanData.productplanmappingList.forEach((element:any) => {
        this.planProductMappingFromArray.push(this.fb.group(element));
      });
      this.planProductMappingFromArray.patchValue(PlanData.productplanmappingList);

      let servicAreaId = [];
      for (let k = 0; k < PlanData.serviceAreaNameList.length; k++) {
        servicAreaId.push(PlanData.serviceAreaNameList[k].id);
      }

      this.planGroupForm.patchValue({
        serviceAreaIds: servicAreaId,
      });
    });
  }
  ifCasMapping = false;

  createChargeFormGroup(): FormGroup {
    return this.fb.group({
      actualprice: [this.chargeGroupForm.value.actualprice, Validators.required],
      chargecategory: [this.chargeGroupForm.value.chargecategory, Validators.required],
      chargetype: [this.chargeGroupForm.controls['chargetype'].value, Validators.required],
      desc: [
        this.chargeGroupForm.value.desc,
        [Validators.required, Validators.pattern(Regex.characterlength225)],
      ],
      name: [this.chargeGroupForm.value.name, Validators.required],
      saccode: [this.chargeGroupForm.value.saccode],
      taxid: [this.chargeGroupForm.value.taxid, Validators.required],
      serviceid: [this.chargeGroupForm.value.serviceid, Validators.required],
      status: ["Active"],
      ledgerId: [this.chargeGroupForm.value.ledgerId],
      billingCycle: [this.chargeGroupForm.controls['billingCycle'].value, Validators.required],
      serviceNameList: [null],
      royalty_payable: [false],
    });
  }
  onAddChargeArray() {
    this.chargeSubmitted = true;
    if (this.chargeGroupForm.valid) {
      this.chargeGroupFormArray.push(this.createChargeFormGroup());
      this.chargeGroupForm.reset();
      this.chargeSubmitted = false;
      this.chargeGroupForm.controls['billingCycle'].setValue(1);
    } else {
      // console.log("I am not valid");
    }
  }

  selService(event:any) {
    // console.log("event", event);
    this.getFields();
    this.advanceListData = [];
    const url = "/planservice/" + event.value;
    this.selectedServiceId = event.value;
    this.planManagementService.getMethod(url).subscribe((response: any) => {
      let viewServiceListData = response.servicebyId;
      // console.log("viewServiceListData", viewServiceListData);

      if (viewServiceListData.is_dtv == true) {
        this.ifCasMapping = true;
      } else {
        this.ifCasMapping = false;
      }

      let found = viewServiceListData.serviceParamMappingList.find(
        (param: any) => param.serviceParamId == 1
      );
      // console.log("found variable", found);
      if (found) {
        this.isServiceHideField = false;

        if (this.planGroupForm.value.planGroup == "Bandwidthbooster") {
          this.planGroupForm.get("qospolicyid").setValidators([Validators.required]);
          this.planGroupForm.get("qospolicyid").updateValueAndValidity();
        } else {
          this.planGroupForm.get("qospolicyid").clearValidators();
          this.planGroupForm.get("qospolicyid").updateValueAndValidity();
        }
        // this.planGroupForm.controls.quotaUnit.disable();
        // this.planGroupForm.controls.quota.enable();
        // this.planGroupForm.controls.quotaunittime.disable();
        // this.planGroupForm.controls.quotatime.enable();
        if (
          this.planGroupForm.value.planGroup == "Bandwidthbooster" ||
          this.planGroupForm.value.planGroup == "Volume Booster"
        ) {
          this.planGroupForm.patchValue({
            maxconcurrentsession: 1,
            allowOverUsage: false,
            quotaResetInterval: "Total",
            quota: 0,
            quotatype: "Data",
            quotaUnit: "GB",
          });

          let type = {
            value: "Data",
          };
          this.getSelQoutaType(type);
        } else if (
          !this.isPlanEdit &&
          (this.planGroupForm.value.planGroup !== "Bandwidthbooster" ||
            this.planGroupForm.value.planGroup !== "Volume Booster")
        ) {
          this.planGroupForm.patchValue({
            maxconcurrentsession: 1,
            allowOverUsage: false,
            quotaResetInterval: "",
            quota: "",
            quotatype: "",
            quotaUnit: "",
          });
          let type = {
            value: "Data",
          };
          this.getSelQoutaType(type);
        }
      } else {
        this.isServiceHideField = true;

        this.planGroupForm.get("qospolicyid").clearValidators();
        this.planGroupForm.get("qospolicyid").updateValueAndValidity();

        if (!this.isPlanEdit) {
          this.planGroupForm.patchValue({
            maxconcurrentsession: 1,
            allowOverUsage: false,
            quotaResetInterval: "Total",
            quota: 1,
            quotatype: "Data",
            quotaUnit: "GB",
          });
          let type = {
            value: "Data",
          };
          this.getSelQoutaType(type);
        }
      }
      //   viewServiceListData.serviceParamMappingList.forEach(mapping => {

      //   if (mapping.serviceParamId != 1)  {
      //     this.isServiceHideField = true;

      //     this.planGroupForm.get("qospolicyid").clearValidators();
      //     this.planGroupForm.get("qospolicyid").updateValueAndValidity();

      //     if (!this.isPlanEdit) {
      //       this.planGroupForm.patchValue({
      //         maxconcurrentsession: 1,
      //         allowOverUsage: false,
      //         quotaResetInterval: "Total",
      //         quota: 1,
      //         quotatype: "Data",
      //         quotaUnit: "GB",
      //       });
      //       let type = {
      //         value: "Data",
      //       };
      //       this.getSelQoutaType(type);
      //     }
      //   } else if (mapping.serviceParamId == 1)  {
      //     this.isServiceHideField = false;

      //     if (this.planGroupForm.value.planGroup == "Bandwidthbooster") {
      //       this.planGroupForm.get("qospolicyid").setValidators([Validators.required]);
      //       this.planGroupForm.get("qospolicyid").updateValueAndValidity();
      //     } else {
      //       this.planGroupForm.get("qospolicyid").clearValidators();
      //       this.planGroupForm.get("qospolicyid").updateValueAndValidity();
      //     }
      //     // this.planGroupForm.controls.quotaUnit.disable();
      //     // this.planGroupForm.controls.quota.enable();
      //     // this.planGroupForm.controls.quotaunittime.disable();
      //     // this.planGroupForm.controls.quotatime.enable();
      //     if (
      //       this.planGroupForm.value.planGroup == "Bandwidthbooster" ||
      //       this.planGroupForm.value.planGroup == "Volume Booster"
      //     ) {
      //       this.planGroupForm.patchValue({
      //         maxconcurrentsession: 1,
      //         allowOverUsage: false,
      //         quotaResetInterval: "Total",
      //         quota: 0,
      //         quotatype: "Data",
      //         quotaUnit: "GB",
      //       });

      //       let type = {
      //         value: "Data",
      //       };
      //       this.getSelQoutaType(type);
      //     } else if (
      //       !this.isPlanEdit &&
      //       (this.planGroupForm.value.planGroup !== "Bandwidthbooster" ||
      //         this.planGroupForm.value.planGroup !== "Volume Booster")
      //     ) {
      //       this.planGroupForm.patchValue({
      //         maxconcurrentsession: 1,
      //         allowOverUsage: false,
      //         quotaResetInterval: "",
      //         quota: "",
      //         quotatype: "",
      //         quotaUnit: "",
      //       });
      //       let type = {
      //         value: "Data",
      //       };
      //       this.getSelQoutaType(type);
      //     }
      //   }
      // });
      // this.advanceListData = response;
    });
    if (!this.isPlanEdit) {
      //this.chargeFilterData(event.value);
    }
    if (this.viewPlanListData?.serviceId !== event.value) {
      this.chargeFromArray = this.fb.array([]);
      //this.chargefromgroup.reset();
      // this.planGroupForm.controls.offerprice.setValue("");
      // this.planGroupForm.controls.newOfferPrice.setValue("");
    }
  }

  // changeActualPrice(price, id, index) {
  //   console.log(
  //     "changeActualPrice :::::: " + price + " ::: id ::: " + id + " ::: index ::: " + index
  //   );

  //   let taxData: any = [];
  //   let slabList: any = [];
  //   let tireList: any = [];
  //   let slabPrice: any = [];
  //   let amount = 0;
  //   let totalslebPrice = 0;
  //   let noTaxPrice = 0;
  //   const url1 = "/charge/" + id;
  //   this.planManagementService.getMethod(url1).subscribe((res: any) => {
  //     let url = "/taxes/" + res.chargebyid.taxid;
  //     this.planManagementService.getMethod(url).subscribe((response: any) => {
  //       taxData = response.taxData;
  //       if (taxData.taxtype == "SLAB") {
  //         slabList = taxData.slabList;
  //         if (slabList.length > 0) {
  //           for (let i = 0; i < slabList.length; i++) {
  //             if (price >= slabList[i].rangeUpTo) {
  //               if (i == 0) {
  //                 amount = slabList[i].rangeUpTo + (slabList[i].rangeUpTo * slabList[i].rate) / 100;
  //                 price = price - slabList[i].rangeUpTo;
  //               } else {
  //                 let NewAmount = slabList[i].rangeUpTo - slabList[i - 1].rangeUpTo;
  //                 amount = NewAmount + (NewAmount * slabList[i].rate) / 100;
  //                 price = price - NewAmount;
  //               }
  //               slabPrice.push(amount);

  //               if (slabList.length == i + 1) {
  //                 slabPrice.forEach(element => {
  //                   totalslebPrice = totalslebPrice + Number(element);
  //                 });
  //                 this.pricePerTax = totalslebPrice.toFixed(2);
  //
  //               }
  //             } else {
  //               amount = price + (price * slabList[i].rate) / 100;
  //               slabPrice.push(amount);
  //               slabPrice.forEach(element => {
  //                 totalslebPrice = totalslebPrice + Number(element);
  //               });
  //               this.pricePerTax = totalslebPrice.toFixed(2);
  //               slabList.length = 0;
  //
  //             }
  //           }
  //         }
  //       } else if (taxData.taxtype == "TIER") {
  //         let ifsameTire = false;
  //         if (taxData.tieredList.length > 0) {
  //           tireList = taxData.tieredList;
  //           if (tireList.length > 0) {
  //             let newAmount = 0;
  //             let totalAmountTire = 0;
  //             let totalPricetire = 0;
  //             let tireAmountList = [];

  //             amount = price + (price * tireList[0].rate) / 100;
  //             newAmount = (price * tireList[0].rate) / 100;
  //             totalAmountTire = amount;
  //             if (tireList.length == 1) {
  //               this.taxAmountCal(price, tireList[0].rate);
  //               this.pricePerTax = amount.toFixed(2);
  //               console.log((price * tireList[0].rate) / 100);
  //               this.totalPriceData.forEach((element, j) => {
  //                 if (j == index) {
  //                   this.totalPriceData[j] = this.pricePerTax;
  //                   let count: number = 0;
  //                   for (let j = 0; j < this.totalPriceData.length; j++) {
  //                     let n = this.totalPriceData[j];
  //                     count = Number(count) + Number(n);
  //                     this.countTotalOfferPrice = Number(count.toFixed(2));
  //                   }
  //                   this.chargeFromArray.value.forEach((elem, indexCharge) => {
  //                     let nn = indexCharge + 1;
  //                     if (indexCharge == index) {
  //                       elem.taxamount = this.taxAmount;
  //                     }
  //                     if (this.chargeFromArray.value.length == nn) {
  //                       this.chargeFromArray.patchValue(this.chargeFromArray.value);
  //                     }
  //                   });
  //                   this.planGroupForm.patchValue({
  //                     offerprice: count.toFixed(2),
  //                     newOfferPrice: count.toFixed(2),
  //                   });
  //                 }
  //               });
  //
  //             } else {
  //               for (let i = 1; i < tireList.length; i++) {
  //                 let AcTiNo = i;
  //                 while (AcTiNo > 0) {
  //                   let TI_NO = AcTiNo - 1;
  //                   if (tireList[i].taxGroup == tireList[TI_NO].taxGroup) {
  //                     ifsameTire = true;
  //                     AcTiNo = 0;
  //                   } else {
  //                     amount = newAmount;
  //                     ifsameTire = false;
  //                   }
  //                   AcTiNo--;
  //                 }

  //                 if (ifsameTire) {
  //                   amount = amount + (amount * tireList[i].rate) / 100;
  //                   if (tireList.length == i + 1 || amount < 0) {
  //                     tireAmountList.forEach(element => {
  //                       totalPricetire = totalPricetire + Number(element);
  //                     });

  //                     totalAmountTire = amount;
  //                     this.pricePerTax = totalAmountTire.toFixed(2);
  //                     this.totalPriceData.forEach((element, j) => {
  //                       if (j == index) {
  //                         this.totalPriceData[j] = this.pricePerTax;
  //                         let count = 0;
  //                         for (let j = 0; j < this.totalPriceData.length; j++) {
  //                           let n = this.totalPriceData[j];
  //                           count = Number(count) + Number(n);
  //                           this.countTotalOfferPrice = Number(count.toFixed(2));
  //                         }

  //                         this.chargeFromArray.value.forEach((elem, indexCharge) => {
  //                           let nn = indexCharge + 1;
  //                           if (indexCharge == index) {
  //                             elem.taxamount = Number(this.pricePerTax) - Number(price);
  //                           }
  //                           if (this.chargeFromArray.value.length == nn) {
  //                             this.chargeFromArray.patchValue(this.chargeFromArray.value);
  //                           }
  //                         });
  //                         this.planGroupForm.patchValue({
  //                           offerprice: count.toFixed(2),
  //                           newOfferPrice: count.toFixed(2),
  //                         });
  //                       }
  //                     });
  //                     tireList.length = 0;
  //
  //                   }
  //                 } else {
  //                   amount = (amount * tireList[i].rate) / 100;
  //                   tireAmountList.push(amount.toFixed(2));

  //                   if (tireList.length == i + 1 || amount < 0) {
  //                     console.log(tireAmountList);

  //                     tireAmountList.forEach(element => {
  //                       totalPricetire = totalPricetire + Number(element);
  //                     });

  //                     totalAmountTire = totalAmountTire + totalPricetire;
  //                     this.pricePerTax = totalAmountTire.toFixed(2);

  //                     this.totalPriceData.forEach((element, j) => {
  //                       if (j == index) {
  //                         this.totalPriceData[j] = this.pricePerTax;
  //                         let count = 0;
  //                         for (let j = 0; j < this.totalPriceData.length; j++) {
  //                           let n = this.totalPriceData[j];
  //                           count = Number(count) + Number(n);
  //                           this.countTotalOfferPrice = Number(count.toFixed(2));
  //                         }

  //                         this.chargeFromArray.value.forEach((elem, indexCharge) => {
  //                           let nn = indexCharge + 1;
  //                           if (indexCharge == index) {
  //                             elem.taxamount = Number(this.pricePerTax) - Number(price);
  //                             elem.taxamount = elem.taxamount.toFixed(2);
  //                           }
  //                           if (this.chargeFromArray.value.length == nn) {
  //                             this.chargeFromArray.patchValue(this.chargeFromArray.value);
  //                           }
  //                         });
  //                         this.planGroupForm.patchValue({
  //                           offerprice: count.toFixed(2),
  //                           newOfferPrice: count.toFixed(2),
  //                         });
  //                       }
  //                     });
  //                     tireList.length = 0;
  //
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //       this.isPlanPriceChanged = true;
  //
  //     });
  //   });
  // }

  // getplanDetailById(planId) {
  //
  //   let datacharge: any = [];
  //   let dataproductplanmappingList: any = [];
  //   this.chargeTaxAmountArray = [];
  //   const url = "/postpaidplan/" + planId;
  //   this.planManagementService.getMethod(url).subscribe(
  //     (response: any) => {
  //       this.planDetailData = response.postPaidPlan;

  //       if (this.planDetailData.planGroup == "Volume Booster") {
  //         this.ifplanGroup_VB = true;
  //         this.ifplanGroup_BWB = false;
  //       } else if (this.planDetailData.planGroup == "Bandwidthbooster") {
  //         this.ifplanGroup_BWB = true;
  //         this.ifplanGroup_VB = false;
  //       } else {
  //         this.ifplanGroup_BWB = false;
  //         this.ifplanGroup_VB = false;
  //       }

  //       datacharge = this.planDetailData.chargeList;

  //       datacharge.forEach((element, index) => {
  //         this.chargeType.forEach((data, j) => {
  //           if (element.charge.chargetype == data.value) {
  //             const url = "/charge/" + element.charge.id;
  //             this.planManagementService.getMethod(url).subscribe((response: any) => {
  //               this.chargeTypeGetDataData.push({
  //                 type: data.text,
  //                 // taxAmount: response.chargebyid.taxamount,
  //               });
  //               console.log(this.chargeTypeGetDataData);
  //             });
  //           }
  //         });
  //       });

  //       // if (this.planDetailData.serviceId) {
  //       //   let data = {
  //       //     value: this.planDetailData.serviceId,
  //       //   };
  //       //   this.selService(data);
  //       // }

  //       for (var index = 0; index < this.planDetailData.chargeList.length; index++) {
  //         let taxData: any = [];
  //         let slabList: any = [];
  //         let tireList: any = [];
  //         let slabPrice: any = [];
  //         let amount = 0;
  //         let totalslebPrice = 0;
  //         let price = this.planDetailData.chargeList[index].chargeprice
  //           ? this.planDetailData.chargeList[index].chargeprice
  //           : this.planDetailData.chargeList[index].charge.price;
  //         let url = "/taxes/" + Number(this.planDetailData.chargeList[index].charge.taxid);
  //         this.planManagementService.getMethod(url).subscribe((response: any) => {
  //           taxData = response.taxData;
  //           if (taxData.taxtype == "SLAB") {
  //             slabList = taxData.slabList;
  //             if (slabList.length > 0) {
  //               for (let i = 0; i < slabList.length; i++) {
  //                 if (price >= slabList[i].rangeUpTo) {
  //                   if (i == 0) {
  //                     amount =
  //                       slabList[i].rangeUpTo + (slabList[i].rangeUpTo * slabList[i].rate) / 100;
  //                     price = price - slabList[i].rangeUpTo;
  //                   } else {
  //                     let NewAmount = slabList[i].rangeUpTo - slabList[i - 1].rangeUpTo;
  //                     amount = NewAmount + (NewAmount * slabList[i].rate) / 100;
  //                     price = price - NewAmount;
  //                   }
  //                   slabPrice.push(amount);
  //                   if (slabList.length == i + 1) {
  //                     slabPrice.forEach(element => {
  //                       totalslebPrice = totalslebPrice + Number(element);
  //                     });
  //                     this.pricePerTax = totalslebPrice.toFixed(2);

  //                     this.totalPriceData.push(Number(this.pricePerTax));
  //                     this.countTotalOfferPrice =
  //                       Number(this.countTotalOfferPrice) + Number(this.pricePerTax);
  //                     this.planGroupForm.patchValue({
  //                       offerprice: this.countTotalOfferPrice.toFixed(2),
  //                     });
  //
  //                   }
  //                 } else {
  //                   amount = price + (price * slabList[i].rate) / 100;
  //                   slabPrice.push(amount);
  //                   slabPrice.forEach(element => {
  //                     totalslebPrice = totalslebPrice + Number(element);
  //                   });
  //                   this.pricePerTax = totalslebPrice.toFixed(2);
  //                   this.totalPriceData.push(Number(this.pricePerTax));
  //                   this.countTotalOfferPrice =
  //                     Number(this.countTotalOfferPrice) + Number(this.pricePerTax);
  //                   this.planGroupForm.patchValue({
  //                     offerprice: this.countTotalOfferPrice.toFixed(2),
  //                   });

  //                   slabList.length = 0;
  //
  //                 }
  //               }
  //             }
  //           } else if (taxData.taxtype == "TIER") {
  //             let ifsameTire = false;
  //             if (taxData.tieredList.length > 0) {
  //               tireList = taxData.tieredList;
  //               if (tireList.length > 0) {
  //                 let newAmount = 0;
  //                 let totalAmountTire = 0;
  //                 let totalPricetire = 0;
  //                 let tireAmountList = [];

  //                 amount = price + (price * tireList[0].rate) / 100;
  //                 newAmount = (price * tireList[0].rate) / 100;
  //                 totalAmountTire = amount;
  //                 if (tireList.length == 1) {
  //                   this.taxAmountCal(price, tireList[0].rate);
  //                   this.pricePerTax = amount.toFixed(2);

  //                   this.countTotalOfferPrice =
  //                     Number(this.countTotalOfferPrice) + Number(this.pricePerTax);

  //                   this.totalPriceData.push(Number(this.pricePerTax));
  //                   this.chargeTaxAmountArray.push(Number(this.taxAmount));
  //
  //                 } else {
  //                   // amount = newAmount
  //                   for (let i = 1; i < tireList.length; i++) {
  //                     let AcTiNo = i;
  //                     while (AcTiNo > 0) {
  //                       let TI_NO = AcTiNo - 1;
  //                       if (tireList[i].taxGroup == tireList[TI_NO].taxGroup) {
  //                         ifsameTire = true;
  //                         AcTiNo = 0;
  //                       } else {
  //                         amount = newAmount;
  //                         ifsameTire = false;
  //                       }
  //                       AcTiNo--;
  //                     }

  //                     if (ifsameTire) {
  //                       amount = amount + (amount * tireList[i].rate) / 100;

  //                       if (tireList.length == i + 1 || amount < 0) {
  //                         totalAmountTire = amount;
  //                         this.pricePerTax = totalAmountTire.toFixed(2);
  //                         tireList.length = 0;

  //                         this.countTotalOfferPrice =
  //                           Number(this.countTotalOfferPrice) + Number(this.pricePerTax);
  //                         this.totalPriceData.push(Number(this.pricePerTax));
  //                         let NewTaxAmountCount = Number(this.pricePerTax) - Number(price);
  //                         this.chargeTaxAmountArray.push(Number(NewTaxAmountCount));

  //
  //                       }
  //                     } else {
  //                       amount = (amount * tireList[i].rate) / 100;
  //                       tireAmountList.push(amount);
  //                       if (tireList.length == i + 1 || amount < 0) {
  //                         tireAmountList.forEach(element => {
  //                           totalPricetire = totalPricetire + Number(element);
  //                         });
  //                         totalAmountTire = Number(totalAmountTire) + Number(totalPricetire);
  //                         this.pricePerTax = totalAmountTire.toFixed(2);
  //                         tireList.length = 0;

  //                         this.countTotalOfferPrice =
  //                           Number(this.countTotalOfferPrice) + Number(this.pricePerTax);
  //                         this.totalPriceData.push(Number(this.pricePerTax));

  //                         let NewTaxAmountCount = Number(this.pricePerTax) - Number(price);
  //                         this.chargeTaxAmountArray.push(Number(NewTaxAmountCount));
  //
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         });
  //       }
  //       dataproductplanmappingList = this.planDetailData.productplanmappingList;
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

  // getofferPrice(event) {
  //   let chargeId = event.value;
  //   let price = "";
  //
  //   const url = "/charge/" + chargeId;
  //   this.planManagementService.getMethod(url).subscribe(
  //     (response: any) => {
  //       price = response.chargebyid.price;
  //       this.chargefromgroup.patchValue({
  //         actualprice: response.chargebyid.actualprice,
  //         taxamount: response.chargebyid.taxamount,
  //         chargeprice: response.chargebyid.actualprice,
  //       });
  //       if (response.chargebyid.taxid) {
  //         this.getamountPerTaxCount(response.chargebyid.taxid, price);
  //       }
  //     },
  //     (error: any) => {
  //       // console.log(error, 'error')
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

  getamountPerTaxCount(id:any, price:any) {
    let taxData: any = [];
    let slabList: any = [];
    let tireList: any = [];
    let slabPrice: any = [];
    let amount = 0;
    let totalslebPrice = 0;
    let noTaxPrice = 0;

    let url = "/taxes/" + id;
    this.planManagementService.getMethod(url).subscribe(
      (response: any) => {
        taxData = response.taxData;
        if (taxData.taxtype == "SLAB") {
          slabList = taxData.slabList;
          if (slabList.length > 0) {
            for (let i = 0; i < slabList.length; i++) {
              if (price >= slabList[i].rangeUpTo) {
                if (i == 0) {
                  amount = slabList[i].rangeUpTo + (slabList[i].rangeUpTo * slabList[i].rate) / 100;
                  price = price - slabList[i].rangeUpTo;
                } else {
                  let NewAmount = slabList[i].rangeUpTo - slabList[i - 1].rangeUpTo;
                  amount = NewAmount + (NewAmount * slabList[i].rate) / 100;
                  price = price - NewAmount;
                }
                slabPrice.push(amount);

                if (slabList.length == i + 1) {
                  slabPrice.forEach((element:any) => {
                    totalslebPrice = totalslebPrice + Number(element);
                  });
                  this.pricePerTax = totalslebPrice.toFixed(2);
                }
              } else {
                amount = price + (price * slabList[i].rate) / 100;
                slabPrice.push(amount);
                slabPrice.forEach((element:any) => {
                  totalslebPrice = totalslebPrice + Number(element);
                });
                this.pricePerTax = totalslebPrice.toFixed(2);
                slabList.length = 0;
              }
            }
          }
        } else if (taxData.taxtype == "TIER") {
          let ifsameTire = false;
          if (taxData.tieredList.length > 0) {
            tireList = taxData.tieredList;
            if (tireList.length > 0) {
              let newAmount = 0;
              let totalAmountTire = 0;
              let totalPricetire = 0;
              let tireAmountList = [];

              amount = price + (price * tireList[0].rate) / 100;
              newAmount = (price * tireList[0].rate) / 100;
              totalAmountTire = amount;
              if (tireList.length == 1) {
                this.pricePerTax = amount.toFixed(2);
              } else {
                for (let i = 1; i < tireList.length; i++) {
                  let AcTiNo = i;
                  while (AcTiNo > 0) {
                    let TI_NO = AcTiNo - 1;
                    if (tireList[i].taxGroup == tireList[TI_NO].taxGroup) {
                      ifsameTire = true;
                      AcTiNo = 0;
                    } else {
                      amount = newAmount;
                      ifsameTire = false;
                    }
                    AcTiNo--;
                  }

                  if (ifsameTire) {
                    amount = amount + (amount * tireList[i].rate) / 100;
                    if (tireList.length == i + 1 || amount < 0) {
                      tireAmountList.forEach(element => {
                        totalPricetire = totalPricetire + Number(element);
                      });

                      totalAmountTire = amount;
                      this.pricePerTax = totalAmountTire.toFixed(2);
                      tireList.length = 0;
                    }
                  } else {
                    amount = (amount * tireList[i].rate) / 100;
                    tireAmountList.push(amount.toFixed(2));

                    if (tireList.length == i + 1 || amount < 0) {
                      console.log(tireAmountList);

                      tireAmountList.forEach(element => {
                        totalPricetire = totalPricetire + Number(element);
                      });

                      totalAmountTire = totalAmountTire + totalPricetire;
                      this.pricePerTax = totalAmountTire.toFixed(2);
                      tireList.length = 0;
                    }
                  }
                }
              }
            }
          }
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
  // onAddChargeField() {
  //   if (this.planGroupForm.value.serviceId) {
  //     this.chargeSubmitted = true;
  //     if (this.chargefromgroup.valid) {
  //       this.countTotalOfferPrice = 0;
  //       this.totalPriceData.push(Number(this.pricePerTax));
  //       for (let j = 0; j < this.totalPriceData.length; j++) {
  //         this.countTotalOfferPrice = this.countTotalOfferPrice + Number(this.totalPriceData[j]);
  //       }
  //       this.planGroupForm.patchValue({
  //         offerprice: this.countTotalOfferPrice,
  //         newOfferPrice: this.countTotalOfferPrice,
  //       });

  //       this.chargeFromArray.push(this.createChargeFormGroup());
  //       this.chargefromgroup.reset();
  //       if (this.planGroupForm.controls.plantype.value == "Prepaid") {
  //         this.chargefromgroup.controls.billingCycle.setValue("1");
  //         this.chargefromgroup.controls.billingCycle.disable();
  //       }
  //       this.chargeSubmitted = false;
  //     } else {
  //     }
  //   } else {
  //     this.messageService.add({
  //       severity: "error",
  //       summary: "Required ",
  //       detail: "Service Field Required",
  //       icon: "far fa-times-circle",
  //     });
  //   }
  // }

  // createChargeFormGroup(): FormGroup {
  //   for (const prop in this.chargefromgroup.controls) {
  //     this.chargefromgroup.value[prop] = this.chargefromgroup.controls[prop].value;
  //   }

  //   if (this.chargefromgroup.value.billingCycle == null) {
  //     this.chargefromgroup.value.billingCycle = 1;
  //   }

  //   return this.fb.group({
  //     billingCycle: [this.chargefromgroup.value.billingCycle],
  //     id: [this.chargefromgroup.value.id],
  //     actualprice: [this.chargefromgroup.value.actualprice],
  //     taxamount: [this.chargefromgroup.value.taxamount],
  //     chargeprice: [this.chargefromgroup.value.chargeprice],
  //   });
  // }

  searchPlan() {
    if (
      (!this.searchkey && !this.searchKeyType) ||
      this.searchkey !== this.searchPlanName.trim() ||
      this.searchPlanType !== this.searchKeyType
    ) {
      this.currentPagePostPaidPlan = 1;
    }
    this.searchkey = this.searchPlanName.trim();
    this.searchKeyType = this.searchPlanType;
    if (this.showItemPerPage) {
      this.postPaidPlanitemsPerPage = this.showItemPerPage;
    }
    this.searchData.filters[0].filterValue = this.searchPlanName.trim();
    this.searchData.filters[0].filterDataType = this.searchPlanType;

    this.searchData.page = this.currentPagePostPaidPlan;
    this.searchData.pageSize = this.postPaidPlanitemsPerPage;
    const url = "/postpaidplan/search";
    this.planManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.postPaidPlanList = response.postpaidplanList;
        this.postPaidPlantotalRecords = response.pageDetails.totalRecords;
      },
      (error: any) => {
        this.postPaidPlantotalRecords = 0;
        this.postPaidPlanList = [];
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

  listPlan() {
    this.isPlanEdit = false;
    this.planGroupForm.reset();
    this.chargeFromArray.reset();
    this.planProductfromgroup.reset();
    this.listView = true;
    this.ifPlanEditInput = false;
    this.createView = false;
    this.detailView = false;
    this.submitted = false;
    this.templateSubmitted = false;
    this.ifServiceParam = false;
    this.customerGroupForm.reset();
    this.chargeFromArray.controls = [];
    this.planProductMappingFromArray = this.fb.array([]);
    this.countTotalOfferPrice = 0;
    this.totalPriceData = [];
    if (this.searchKey || this.searchKeyType) {
      this.getPostoaidPlan("");
      this.searchKey = "";
      this.searchKeyType = "";
      this.searchPlanName = "";
      this.searchPlanType = "";
    }
  }

  selPlanCategory(event:any) {
    // if (event.value == "Business Promotion") {
    //   this.planGroupForm.get("newOfferPrice").setValidators([Validators.required]);
    //   this.planGroupForm.get("newOfferPrice").updateValueAndValidity();
    //   this.planGroupForm.patchValue({
    //     requiredApproval: true,
    //     invoiceToOrg: true,
    //   });
    // } else {
    //   this.planGroupForm.get("newOfferPrice").clearValidators();
    //   this.planGroupForm.get("newOfferPrice").updateValueAndValidity();
    //   this.planGroupForm.patchValue({
    //     requiredApproval: false,
    //     invoiceToOrg: false,
    //   });
    // }
  }

  savePlanDto() {
    this.submitted = true;
    this.templateSubmitted = true;
    console.log("this.chargeGroupFormArray.value", this.chargeGroupFormArray.value);
    if (this.planGroupForm.valid) {
      if (this.chargeGroupFormArray.value.length > 0) {
        if (this.planGroupForm.value.category !== "Business Promotion") {
          this.planGroupForm.value.newOfferPrice = 0;
        }

        if (
          this.planGroupForm.value.unitsOfValidity == "" ||
          this.planGroupForm.value.unitsOfValidity == null
        ) {
          this.planGroupForm.value.unitsOfValidity = "Days";
        }
        if (this.planGroupForm.value.mode == "" || this.planGroupForm.value.mode == null) {
          this.planGroupForm.value.mode = "NORMAL";
        }
        this.createPlanData.maxconcurrentsession = this.planGroupForm.value.maxconcurrentsession;
        this.createPlanData = this.planGroupForm.getRawValue();
        this.createPlanData.chargeList = this.chargeGroupFormArray.value;
        this.createPlanData.requiredApproval = true;
        this.createPlanData.code = "";
        for (let [index] of this.chargeGroupFormArray.value.entries()) {
          if (this.chargeGroupFormArray.value[index].id) {
            let Ids = this.chargeGroupFormArray.value[index].id;
            this.charge = {
              id: "",
            };
            this.createPlanData.chargeList[index].charge = this.charge;
            this.createPlanData.chargeList[index].charge.id = Ids;
            this.createPlanData.chargeList[index].charge.actualprice =
              this.chargeGroupFormArray.value[index].actualprice;
            this.createPlanData.chargeList[index].charge.taxamount =
              this.chargeGroupFormArray.value[index].taxamount;
            delete this.createPlanData.chargeList[index].id;
            // delete this.createPlanData.chargeList[index].actualprice;
            delete this.createPlanData.chargeList[index].taxamount;
          }
        }
        delete this.createPlanData.radiusprofileIds;
        this.createPlanData.productplanmappingList = [];
        this.createPlanData.productplanmappingList = this.planProductMappingFromArray.value;
        this.createPlanData.planCasMappingList = this.planCasMappingFromArray.value;
        this.createPlanData.planQosMappingEntityList = this.qospolicyformArray.value;

        console.log("this.createPlanData", this.createPlanData);

        this.planFormDTO.emit(this.createPlanData);

        // setTimeout(() => {
        //   this.chargeGroupFormArray.controls = [];
        //   this.chargeGroupFormArray = this.fb.array([]);
        //   this.planProductMappingFromArray.controls = [];
        //   this.planProductMappingFromArray = this.fb.array([]);
        //   this.submitted = false;
        //   this.planProductSubmitted = false;
        //   this.chargeSubmitted = false;
        //   this.planGroupForm.reset();
        // }, 1000);
      } else {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Please add atleat one charge details",
          icon: "far fa-times-circle",
        });
      }
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Something Wrong!!",
        icon: "far fa-times-circle",
      });
    }
  }
  quotaUnitChange(event:any) {
    const val = event.value;
    // if (val == "MIN") {
    //   this.max = 60
    //   this.planGroupForm.controls["quotatime"].setValidators([Validators.required, Validators.pattern(Regex.numeric), Validators.max(this.max)]);
    // } else if (val == "HOUR") {
    //   this.max = 24
    //   this.planGroupForm.controls["quotatime"].setValidators([Validators.required, Validators.pattern(Regex.numeric), Validators.max(this.max)]);
    // } else if (val == "DAY") {
    //   this.max = 365
    //   this.planGroupForm.controls["quotatime"].setValidators([Validators.required, Validators.pattern(Regex.numeric), Validators.max(this.max)]);
    // }
    // this.planGroupForm.controls["quotatime"].updateValueAndValidity();
  }

  // addEditPostPaidPlan(postPaidPlanId) {
  //   this.submitted = true;
  //   this.templateSubmitted = true;
  //   console.log("planGroupForm", this.planGroupForm);
  //   if (this.planGroupForm.valid && this.customerGroupForm.valid) {
  //     if (postPaidPlanId) {
  //
  //       if (
  //         this.planGroupForm.value.unitsOfValidity == "" ||
  //         this.planGroupForm.value.unitsOfValidity == null
  //       ) {
  //         this.planGroupForm.value.unitsOfValidity = "Days";
  //       }
  //       if (this.planGroupForm.value.mode == "" || this.planGroupForm.value.mode == null) {
  //         this.planGroupForm.value.mode = "NORMAL";
  //       }

  //       this.planGroupForm.value.maxconcurrentsession =
  //         this.planGroupForm.value.maxconcurrentsession;
  //       this.createPlanData = this.planGroupForm.value;
  //       this.createPlanData.chargeList = this.chargeFromArray.value;
  //       for (let [index] of this.chargeFromArray.value.entries()) {
  //         if (this.chargeFromArray.value[index].id) {
  //           let Ids = this.chargeFromArray.value[index].id;
  //           this.charge = {
  //             id: "",
  //             actualprice: "",
  //             taxamount: "",
  //           };
  //           this.createPlanData.chargeList[index].charge = this.charge;
  //           this.createPlanData.chargeList[index].charge.id = Ids;
  //           this.createPlanData.chargeList[index].charge.actualprice =
  //             this.chargeFromArray.value[index].actualprice;
  //           this.createPlanData.chargeList[index].charge.taxamount =
  //             this.chargeFromArray.value[index].taxamount;
  //           delete this.createPlanData.chargeList[index].id;
  //           delete this.createPlanData.chargeList[index].actualprice;
  //           delete this.createPlanData.chargeList[index].taxamount;
  //         }
  //       }
  //       this.createPlanData.nextApprover = this.viewPlanListData.nextApprover;
  //       this.createPlanData.nextStaff = this.viewPlanListData.nextStaff;
  //       delete this.createPlanData.radiusprofileIds;

  //       if (this.copyEditPlanData !== this.createPlanData) {
  //         this.createPlanData.status = "NewActivation";
  //       }
  //       this.createPlanData.productplanmappingList = [];
  //       this.createPlanData.productplanmappingList = this.planProductMappingFromArray.value;

  //       this.createPlanData.planCasMappingList = this.planCasMappingFromArray.value;
  //       this.createPlanData.planQosMappingEntityList = [];
  //       this.createPlanData = { ...this.createPlanData, ...this.customerGroupForm.value };
  //       const url = "/postpaidplan/" + postPaidPlanId;

  //       if (this.planGroupForm.value.chargeList.length > 0) {
  //         this.planManagementService.updateMethod(url, this.createPlanData).subscribe(
  //           (response: any) => {
  //             this.submitted = false;
  //             this.templateSubmitted = false;
  //             this.ifServiceParam = false;
  //             this.planGroupForm.reset();
  //             this.customerGroupForm.reset();
  //             this.fieldsArr = [];
  //             if (!this.searchkey && !this.searchKeyType) {
  //               this.getPostoaidPlan("");
  //             } else {
  //               this.searchPlan();
  //             }

  //             this.totalPriceData = [];
  //             this.chargeFromArray.controls = [];
  //             this.planProductMappingFromArray = this.fb.array([]);
  //             this.isServiceHideField = false;
  //             this.chargefromgroup.reset();
  //             this.planProductfromgroup.reset();
  //             this.planProductMappingFromArray = this.fb.array([]);
  //             this.planProductfromgroup.reset();
  //             this.planGroupForm.get("qospolicyid").clearValidators();
  //             this.planGroupForm.get("qospolicyid").updateValueAndValidity();
  //             this.planGroupForm.get("newOfferPrice").clearValidators();
  //             this.planGroupForm.get("newOfferPrice").updateValueAndValidity();
  //             this.productChargeFlag = false;
  //             this.disbleDate = "";
  //             this.maxDisbleDate = "";
  //             this.messageService.add({
  //               severity: "success",
  //               summary: "Successfully",
  //               detail: response.message,
  //               icon: "far fa-check-circle",
  //             });
  //
  //             this.listPlan();
  //           },
  //           (error: any) => {
  //
  //             // if(error.error.status == 400){
  //             //   this.messageService.add({
  //             //     severity: 'info',
  //             //     summary: "info",
  //             //     detail: "Profile already added under same Profile",
  //             //     icon: "far fa-times-circle",
  //             //   });
  //             // }
  //             // else
  //             {
  //               this.messageService.add({
  //                 severity: "error",
  //                 summary: "Error",
  //                 detail: error.error.ERROR,
  //                 icon: "far fa-times-circle",
  //               });
  //             }
  //           }
  //         );
  //       } else {
  //
  //         this.messageService.add({
  //           severity: "error",
  //           summary: "Required ",
  //           detail: "Minimum one Charge Details need to add",
  //           icon: "far fa-times-circle",
  //         });
  //       }
  //     } else {
  //

  //       if (this.planGroupForm.value.category !== "Business Promotion") {
  //         this.planGroupForm.value.newOfferPrice = 0;
  //       }

  //       if (
  //         this.planGroupForm.value.unitsOfValidity == "" ||
  //         this.planGroupForm.value.unitsOfValidity == null
  //       ) {
  //         this.planGroupForm.value.unitsOfValidity = "Days";
  //       }
  //       if (this.planGroupForm.value.mode == "" || this.planGroupForm.value.mode == null) {
  //         this.planGroupForm.value.mode = "NORMAL";
  //       }
  //       this.createPlanData.maxconcurrentsession = this.planGroupForm.value.maxconcurrentsession;
  //       this.createPlanData = this.planGroupForm.value;
  //       this.createPlanData.chargeList = this.chargeFromArray.value;
  //       this.createPlanData.code = "";
  //       for (let [index] of this.chargeFromArray.value.entries()) {
  //         if (this.chargeFromArray.value[index].id) {
  //           let Ids = this.chargeFromArray.value[index].id;
  //           this.charge = {
  //             id: "",
  //           };
  //           this.createPlanData.chargeList[index].charge = this.charge;
  //           this.createPlanData.chargeList[index].charge.id = Ids;
  //           this.createPlanData.chargeList[index].charge.actualprice =
  //             this.chargeFromArray.value[index].actualprice;
  //           this.createPlanData.chargeList[index].charge.taxamount =
  //             this.chargeFromArray.value[index].taxamount;
  //           delete this.createPlanData.chargeList[index].id;
  //           delete this.createPlanData.chargeList[index].actualprice;
  //           delete this.createPlanData.chargeList[index].taxamount;
  //         }
  //       }
  //       this.createPlanData.status = "NewActivation";
  //       delete this.createPlanData.radiusprofileIds;
  //       this.createPlanData.productplanmappingList = [];
  //       this.createPlanData.productplanmappingList = this.planProductMappingFromArray.value;
  //       this.createPlanData.planCasMappingList = this.planCasMappingFromArray.value;
  //       this.createPlanData.planQosMappingEntityList = this.qospolicyformArray.value;

  //       const url = "/postpaidplan";

  //       // this.createPlanData['serviceParam'] = this.customerGroupForm.value;
  //       // this.createPlanData['serviceParam2'] = '8';
  //       // this.onSubmit();
  //       this.createPlanData = { ...this.createPlanData, ...this.customerGroupForm.value };
  //       console.log("createPlanData", this.createPlanData);

  //       if (this.planGroupForm.value.chargeList.length > 0) {
  //         this.planManagementService.postMethod(url, this.createPlanData).subscribe(
  //           (response: any) => {
  //             this.submitted = false;
  //             this.templateSubmitted = false;
  //             this.ifServiceParam = false;
  //             this.planGroupForm.reset();
  //             this.customerGroupForm.reset();
  //             if (!this.searchkey && !this.searchKeyType) {
  //               this.getPostoaidPlan("");
  //             } else {
  //               this.searchPlan();
  //             }
  //             this.totalPriceData = [];
  //             this.chargeFromArray.controls = [];
  //             this.planProductMappingFromArray = this.fb.array([]);
  //             this.chargefromgroup.reset();
  //             this.planProductfromgroup.reset();
  //             this.planGroupForm.get("qospolicyid").clearValidators();
  //             this.planGroupForm.get("qospolicyid").updateValueAndValidity();
  //             this.planGroupForm.get("newOfferPrice").clearValidators();
  //             this.planGroupForm.get("newOfferPrice").updateValueAndValidity();
  //             this.disbleDate = "";
  //             this.maxDisbleDate = "";
  //             this.isServiceHideField = false;
  //             this.productChargeFlag = false;
  //             this.messageService.add({
  //               severity: "success",
  //               summary: "Successfully",
  //               detail: response.message,
  //               icon: "far fa-check-circle",
  //             });
  //
  //             this.listPlan();
  //           },
  //           (error: any) => {
  //
  //             this.messageService.add({
  //               severity: "error",
  //               summary: "Error",
  //               detail: error.error.ERROR,
  //               icon: "far fa-times-circle",
  //             });
  //           }
  //         );
  //       } else {
  //
  //         this.messageService.add({
  //           severity: "error",
  //           summary: "Required ",
  //           detail: "Minimum one Charge Details need to add",
  //           icon: "far fa-times-circle",
  //         });
  //       }
  //     }
  //   }
  // }

  // chargeFilterData(id) {
  //   this.advanceListData = [];
  //   let ListData: any = [];
  //   const url1 = "/charge2/{service}?service=" + id;
  //   this.planManagementService.getMethod(url1).subscribe((response: any) => {
  //     ListData = response.dataList;
  //     this.totalCharges = ListData;
  //     ListData.forEach(element => {
  //       if (this.planGroupForm.value.plantype == "Prepaid") {
  //         if (
  //           element.charge.chargetype == "ADVANCE" ||
  //           element.charge.chargetype == "NON_RECURRING"
  //         ) {
  //           this.advanceListData.push(element.charge);
  //         }
  //       } else if (this.planGroupForm.value.plantype == "Postpaid") {
  //         if (
  //           element.charge.chargetype == "RECURRING" ||
  //           element.charge.chargetype == "NON_RECURRING"
  //         ) {
  //           this.advanceListData.push(element.charge);
  //         }
  //       }
  //     });
  //   });
  // }

  billingSequence() {
    for (let i = 0; i < 12; i++) {
      this.billingCycle.push({ label: i + 1 });
      // console.log(this.billingCycle)
    }
  }

  checkPlanCustomerBinding(planId:any) {
    const url = "/customer/checkPlanCustomerBinding/" + planId;
    this.planManagementService.getMethod(url).subscribe((response: any) => {
      let checkPlanCustomerBinding = response.isAlreadyExists;
      if (checkPlanCustomerBinding == true) {
        this.ifPlanEditInput = true;
        console.log(this.ifPlanEditInput);
      } else {
        this.ifPlanEditInput = false;
        console.log(this.ifPlanEditInput);
      }
      //  "isAlreadyExists": false,
    });
  }

  // planData1(id) {
  //   const url = "/getproductfromplan?id=" + id;
  //   this.planManagementService.getMethod(url).subscribe((response: any) => {
  //     let data = response;
  //     if (data.length > 0) {
  //       this.planGroupForm.patchValue({
  //         product_category: data[0].product_category,
  //         product_type: data[0].product_type,
  //       });
  //     }
  //   });
  // }
  isEditPlan = false;
  // editPostPaidPlan(planId) {
  //   this.isEditPlan = true;
  //   // this.getFields();
  //
  //   this.countTotalOfferPrice = 0;
  //   this.isServiceHideField = false;
  //   this.totalPriceData = [];
  //   this.advanceListData = [];
  //   this.ifplanGroup_BWB = false;
  //   this.ifplanGroup_VB = false;
  //   this.planProductMappingFromArray = this.fb.array([]);
  //   this.planCasMappingFromArray = this.fb.array([]);
  //   this.chargeFromArray = this.fb.array([]);
  //   let taxAmountAray = [];
  //   this.planProductfromgroup.reset();
  //   this.chargefromgroup.reset();
  //   this.planCasMappingFromGroup.reset();
  //   this.isServiceArea_PlanType = false;
  //   let taxAmount: any = [];
  //   this.planGroupForm.controls.status.disable();
  //   if (planId) {
  //     this.listView = false;
  //     this.createView = true;
  //     this.ifPlanEditInput = false;
  //     this.detailView = false;
  //     this.submitted = false;
  //     this.templateSubmitted = false;
  //     this.ifServiceParam = false;
  //     this.chargeSubmitted = false;
  //     this.qospolicySubmitted = false;
  //     this.planProductSubmitted = false;
  //     this.ifplanGroup_BWB = false;
  //     this.ifplanGroup_VB = false;

  //     this.billingSequence();
  //     const url = "/postpaidplan/" + planId;
  //     this.planManagementService.getMethod(url).subscribe(
  //       (response: any) => {
  //         this.isPlanEdit = true;

  //         // this.createPlan()
  //         // this.planGroupForm.controls.maxconcurrentsession.disable();
  //         // this.planGroupForm.controls.validity.disable();
  //         // this.planGroupForm.controls.quota.disable();
  //         // this.planGroupForm.controls.quotatime.disable();
  //         this.viewPlanListData = response.postPaidPlan;
  //         console.log("viewPlanListData", this.viewPlanListData);
  //         if (response.postPaidPlan.casId) {
  //           this.getAllCASPackage(response.postPaidPlan.casId);
  //         }

  //         // if (this.viewPlanListData.status == "NewActivation") {
  //         //   this.ifPlanEditInput = false;
  //         //   this.planStatusField = true;
  //         //   this.planStatus = [{ label: "New Activation", value: "NewActivation" }];
  //         // } else {
  //         //   this.checkPlanCustomerBinding(planId);
  //         //   this.planStatus = [
  //         //     { label: "Active", value: "ACTIVE" },
  //         //     { label: "Inactive", value: "INACTIVE" },
  //         //   ];
  //         //   this.planStatusField = false;
  //         //   let status = this.viewPlanListData.status;
  //         //   this.viewPlanListData.status = status.toUpperCase();
  //         // }

  //         this.planGroupForm.patchValue(this.viewPlanListData);
  //         this.chargeFilterData(this.viewPlanListData.serviceId);
  //         if (this.viewPlanListData.serviceId) {
  //           let serviceID = {
  //             value: this.viewPlanListData.serviceId,
  //           };
  //           this.selService(serviceID);
  //         }

  //         this.planData1(planId);
  //         if (this.viewPlanListData.quotatype == "Time") {
  //           this.planGroupForm.controls.quotaUnit.disable();
  //           this.planGroupForm.controls.quota.disable();
  //           this.planGroupForm.controls.quotaunittime.enable();
  //           this.planGroupForm.controls.quotatime.enable();
  //           this.isQuotaEnabled = false;
  //           this.isQuotaTimeEnabled = true;
  //           this.planGroupForm.patchValue({
  //             quotaunittime: this.viewPlanListData.quotaunittime,
  //             quotatime: this.viewPlanListData.quotatime,
  //           });
  //         } else if (this.viewPlanListData.quotatype == "Data") {
  //           this.planGroupForm.controls.quotaUnit.enable();
  //           this.planGroupForm.controls.quota.enable();
  //           this.planGroupForm.controls.quotaunittime.disable();
  //           this.planGroupForm.controls.quotatime.disable();
  //           this.isQuotaEnabled = true;
  //           this.isQuotaTimeEnabled = false;
  //           this.planGroupForm.patchValue({
  //             quotaUnit: this.viewPlanListData.quotaUnit,
  //             quota: this.viewPlanListData.quota,
  //           });
  //         } else if (this.viewPlanListData.quotatype == "Both") {
  //           this.planGroupForm.controls.quotaUnit.enable();
  //           this.planGroupForm.controls.quota.enable();
  //           this.planGroupForm.controls.quotaunittime.enable();
  //           this.planGroupForm.controls.quotatime.enable();
  //           this.isQuotaEnabled = true;
  //           this.isQuotaTimeEnabled = true;
  //           this.planGroupForm.patchValue({
  //             quotaunittime: this.viewPlanListData.quotaunittime,
  //             quotatime: this.viewPlanListData.quotatime,
  //             quotaUnit: this.viewPlanListData.quotaUnit,
  //             quota: this.viewPlanListData.quota,
  //           });
  //         }

  //         if (this.viewPlanListData.plantype == "Prepaid") {
  //           this.chargefromgroup.controls.billingCycle.setValue("1");
  //           this.chargefromgroup.controls.billingCycle.disable();
  //         } else {
  //           this.chargefromgroup.controls.billingCycle.enable();
  //         }
  //

  //         if (this.viewPlanListData.planGroup == "Registration") {
  //           this.type = [{ label: "NORMAL" }];
  //           this.ifplanGroup_BWB = false;
  //           this.ifplanGroup_VB = false;
  //         } else if (this.viewPlanListData.planGroup == "Volume Booster") {
  //           this.ifplanGroup_VB = true;
  //           this.ifplanGroup_BWB = false;
  //         } else if (this.viewPlanListData.planGroup == "Bandwidthbooster") {
  //           this.ifplanGroup_BWB = true;
  //           this.ifplanGroup_VB = false;
  //         } else {
  //           this.ifplanGroup_BWB = false;
  //           this.ifplanGroup_VB = false;
  //           this.type = [{ label: "NORMAL" }, { label: "SPECIAL" }];
  //         }
  //         if (this.viewPlanListData.planGroup == "Registration") {
  //           this.planProductMappingShowFlag = true;
  //         } else if (this.viewPlanListData.planGroup == "Registration and Renewal") {
  //           this.planProductMappingShowFlag = true;
  //         } else {
  //           this.planProductMappingShowFlag = false;
  //           this.planProductMappingFromArray = this.fb.array([]);
  //           this.planProductfromgroup.reset();
  //         }
  //         let servicAreaId = [];
  //         for (let k = 0; k < this.viewPlanListData.serviceAreaNameList.length; k++) {
  //           servicAreaId.push(this.viewPlanListData.serviceAreaNameList[k].id);
  //         }

  //         this.planGroupForm.patchValue({
  //           maxconcurrentsession: this.viewPlanListData.maxconcurrentsession,
  //           serviceAreaIds: servicAreaId,
  //           newOfferPrice: this.viewPlanListData.newOfferPrice,
  //         });

  //         if (this.planGroupForm.value.serviceAreaIds) {
  //           let url = "/serviceArea/getAllServicesByServiceAreaId";
  //           this.planManagementService.postMethod(url, servicAreaId).subscribe((response: any) => {
  //             this.serviceList = response.dataList;
  //           });
  //         }
  //         this.chargeFromArray = this.fb.array([]);

  //         this.viewPlanListData.chargeList.forEach(element => {
  //           // const url = "/charge/" + element.charge.id;
  //           // this.planManagementService.getMethod(url).subscribe((res: any) => {
  //           this.chargeFromArray.push(
  //             this.fb.group({
  //               id: [element.charge.id],
  //               billingCycle: [element.billingCycle],
  //               taxamount: [element.taxamount],
  //               actualprice: [element.chargeprice],
  //               chargeprice: [element.chargeprice],
  //             })
  //           );
  //           // });
  //         });

  //         this.viewPlanListData.planCasMappingList.forEach(element => {
  //           this.planCasMappingFromArray.push(
  //             this.fb.group({
  //               id: [element.id],
  //               casId: [element.casId],
  //               packageId: [element.packageId],
  //               planId: [element.planId],
  //             })
  //           );
  //           this.casmasterData.forEach(ele1 => {
  //             if (ele1.id == element.casId) {
  //               this.casPackegeAllData = [...ele1.casPackageMappings];
  //             }
  //           });
  //         });

  //         this.viewPlanListData.productplanmappingList?.forEach(e => {
  //           this.planProductMappingFromArray.push(this.fb.group(e));
  //         });

  //         this.planProductMappingFromArray.patchValue(this.viewPlanListData.productplanmappingList);
  //         this.taxDetails = [];
  //         for (var index = 0; index < this.viewPlanListData.chargeList.length; index++) {
  //           let taxData: any = [];
  //           let slabList: any = [];
  //           let tireList: any = [];
  //           let slabPrice: any = [];
  //           let amount = 0;
  //           let totalslebPrice = 0;
  //           let price = this.viewPlanListData.chargeList[index].chargeprice
  //             ? this.viewPlanListData.chargeList[index].chargeprice
  //             : this.viewPlanListData.chargeList[index].charge.price;
  //           let url = "/taxes/" + Number(this.viewPlanListData.chargeList[index].charge.taxid);
  //           this.planManagementService.getMethod(url).subscribe((response: any) => {
  //             response.taxData.tieredList.forEach(element => {
  //               this.taxDetails.push(element);
  //             });
  //             this.taxAmount;
  //             console.log(this.taxDetails);
  //             taxData = response.taxData;
  //             if (taxData.taxtype == "SLAB") {
  //               slabList = taxData.slabList;
  //               if (slabList.length > 0) {
  //                 for (let i = 0; i < slabList.length; i++) {
  //                   if (price >= slabList[i].rangeUpTo) {
  //                     if (i == 0) {
  //                       amount =
  //                         slabList[i].rangeUpTo + (slabList[i].rangeUpTo * slabList[i].rate) / 100;
  //                       price = price - slabList[i].rangeUpTo;
  //                     } else {
  //                       let NewAmount = slabList[i].rangeUpTo - slabList[i - 1].rangeUpTo;
  //                       amount = NewAmount + (NewAmount * slabList[i].rate) / 100;
  //                       price = price - NewAmount;
  //                     }
  //                     slabPrice.push(amount);
  //                     if (slabList.length == i + 1) {
  //                       slabPrice.forEach(element => {
  //                         totalslebPrice = totalslebPrice + Number(element);
  //                       });
  //                       this.pricePerTax = totalslebPrice.toFixed(2);

  //                       this.totalPriceData.push(Number(this.pricePerTax));
  //                       this.countTotalOfferPrice =
  //                         Number(this.countTotalOfferPrice) + Number(this.pricePerTax);
  //                       this.planGroupForm.patchValue({
  //                         offerprice: this.countTotalOfferPrice.toFixed(2),
  //                       });
  //
  //                     }
  //                   } else {
  //                     amount = price + (price * slabList[i].rate) / 100;
  //                     slabPrice.push(amount);
  //                     slabPrice.forEach(element => {
  //                       totalslebPrice = totalslebPrice + Number(element);
  //                     });
  //                     this.pricePerTax = totalslebPrice.toFixed(2);
  //                     this.totalPriceData.push(Number(this.pricePerTax));
  //                     this.countTotalOfferPrice =
  //                       Number(this.countTotalOfferPrice) + Number(this.pricePerTax);
  //                     this.planGroupForm.patchValue({
  //                       offerprice: this.countTotalOfferPrice.toFixed(2),
  //                     });

  //                     slabList.length = 0;
  //
  //                   }
  //                 }
  //               }
  //             } else if (taxData.taxtype == "TIER") {
  //               let ifsameTire = false;
  //               if (taxData.tieredList.length > 0) {
  //                 tireList = taxData.tieredList;
  //                 if (tireList.length > 0) {
  //                   let newAmount = 0;
  //                   let totalAmountTire = 0;
  //                   let totalPricetire = 0;
  //                   let tireAmountList = [];

  //                   amount = price + (price * tireList[0].rate) / 100;
  //                   newAmount = (price * tireList[0].rate) / 100;
  //                   totalAmountTire = amount;
  //                   if (tireList.length == 1) {
  //                     this.taxAmountCal(price, tireList[0].rate);
  //                     taxAmountAray.push(this.taxAmount);
  //                     this.pricePerTax = amount.toFixed(2);

  //                     this.countTotalOfferPrice =
  //                       Number(this.countTotalOfferPrice) + Number(this.pricePerTax);
  //                     this.planGroupForm.patchValue({
  //                       offerprice: this.countTotalOfferPrice.toFixed(2),
  //                     });
  //                     this.totalPriceData.push(Number(this.pricePerTax));
  //                     taxAmount.push(this.taxAmount);
  //                     // this.chargeFromArray.value.forEach((elem, indexCharge) => {
  //                     //   let nn = indexCharge + 1;
  //                     //   if (indexCharge == index - 1) {
  //                     //     elem.taxamount = Number(this.taxAmount);
  //                     //   }
  //                     //   if (this.chargeFromArray.value.length == nn) {
  //                     //     this.chargeFromArray.patchValue(this.chargeFromArray.value);
  //                     //   }
  //                     // });
  //
  //                   } else {
  //                     // amount = newAmount
  //                     for (let i = 1; i < tireList.length; i++) {
  //                       let AcTiNo = i;
  //                       while (AcTiNo > 0) {
  //                         let TI_NO = AcTiNo - 1;
  //                         if (tireList[i].taxGroup == tireList[TI_NO].taxGroup) {
  //                           ifsameTire = true;
  //                           AcTiNo = 0;
  //                         } else {
  //                           amount = newAmount;
  //                           ifsameTire = false;
  //                         }
  //                         AcTiNo--;
  //                       }

  //                       if (ifsameTire) {
  //                         amount = amount + (amount * tireList[i].rate) / 100;

  //                         if (tireList.length == i + 1 || amount < 0) {
  //                           totalAmountTire = amount;
  //                           this.pricePerTax = totalAmountTire.toFixed(2);
  //                           tireList.length = 0;

  //                           this.countTotalOfferPrice =
  //                             Number(this.countTotalOfferPrice) + Number(this.pricePerTax);
  //                           this.planGroupForm.patchValue({
  //                             offerprice: this.countTotalOfferPrice.toFixed(2),
  //                           });
  //                           let NewTaxAmountCount = Number(this.pricePerTax) - Number(price);
  //                           taxAmountAray.push(NewTaxAmountCount);
  //                           this.totalPriceData.push(Number(this.pricePerTax));

  //                           taxAmount.push(NewTaxAmountCount);
  //                           // this.chargeFromArray.value.forEach((elem, indexCharge) => {
  //                           //   let nn = indexCharge + 1;
  //                           //   if (indexCharge == index - 1) {
  //                           //     elem.taxamount = Number(this.pricePerTax) - Number(price);
  //                           //   }
  //                           //   if (this.chargeFromArray.value.length == nn) {
  //                           //     this.chargeFromArray.patchValue(this.chargeFromArray.value);
  //                           //   }
  //                           // });
  //
  //                         }
  //                       } else {
  //                         amount = (amount * tireList[i].rate) / 100;
  //                         tireAmountList.push(amount);
  //                         if (tireList.length == i + 1 || amount < 0) {
  //                           tireAmountList.forEach(element => {
  //                             totalPricetire = totalPricetire + Number(element);
  //                           });
  //                           totalAmountTire = Number(totalAmountTire) + Number(totalPricetire);
  //                           this.pricePerTax = totalAmountTire.toFixed(2);
  //                           tireList.length = 0;

  //                           let NewTaxAmountCount = Number(this.pricePerTax) - Number(price);
  //                           taxAmountAray.push(NewTaxAmountCount);
  //                           this.countTotalOfferPrice =
  //                             Number(this.countTotalOfferPrice) + Number(this.pricePerTax);
  //                           this.planGroupForm.patchValue({
  //                             offerprice: this.countTotalOfferPrice.toFixed(2),
  //                           });
  //                           this.totalPriceData.push(Number(this.pricePerTax));

  //                           taxAmount.push(NewTaxAmountCount);
  //                           // this.chargeFromArray.value.forEach((elem, indexCharge) => {
  //                           //   let nn = indexCharge + 1;
  //                           //   if (indexCharge == index - 1) {
  //                           //     elem.taxamount = Number(this.pricePerTax) - Number(amount);
  //                           //   }
  //                           //   if (this.chargeFromArray.value.length == nn) {
  //                           //     this.chargeFromArray.patchValue(this.chargeFromArray.value);
  //                           //   }
  //                           // });
  //
  //                         }
  //                       }
  //                     }
  //                   }

  //                   taxAmount.forEach((element, i) => {
  //                     let nn = i + 1;
  //                     this.chargeFromArray.value.forEach((elem, j) => {
  //                       let mm = j + 1;
  //                       if (i == j) {
  //                         elem.taxamount = element;
  //                       }
  //                       if (this.chargeFromArray.value.length == mm && taxAmount.length == nn) {
  //                         this.chargeFromArray.patchValue(this.chargeFromArray.value);
  //                       }
  //                     });
  //                   });
  //                 }
  //               }
  //             }
  //           });
  //         }

  //         this.disbleDate = this.viewPlanListData.startDate;
  //         this.maxDisbleDate = this.viewPlanListData.endDate;
  //

  //         let copyEditPlan = this.planGroupForm.value;
  //         copyEditPlan.chargeList = this.chargeFromArray.value;
  //         this.copyEditPlanData = copyEditPlan;
  //       },
  //       (error: any) => {
  //         this.messageService.add({
  //           severity: "error",
  //           summary: "Error",
  //           detail: error.error.ERROR,
  //           icon: "far fa-times-circle",
  //         });
  //         // this.spinner.hide()
  //       }
  //     );
  //   }
  // }

  copyEditPlanData: any = [];
  taxAmountCal(price:any, rate:any) {
    this.taxAmount = (price * rate) / 100;
    return this.taxAmount.toFixed(2);
  }

  getAllCASPackage(casID:any) {
    this.casPackageData = this.casmasterData.find(
      (element:any) => element.id === casID
    ).casPackageMappings;
  }
  getList() {
    this.fieldsArr.forEach((el1: any) => {
      // el1.fields.forEach((el2: any) => {
      this.allFieldsArr.push(el1);
      if (el1.fieldType == "select" && el1.isdependant == false) {
        this.custService.getMethod2(el1.endpoint).subscribe((res: any) => {
          // console.log("response",res)
          if (this.optionList != null) {
            const foundIndex = this.optionList.findIndex(
              ({ fieldname }: { fieldname: string }) => fieldname == el1.fieldname
            );
            if (foundIndex != -1) {
              this.optionList.splice(foundIndex, 1);
            }
            this.optionList.push({
              module: el1.module,
              fieldname: el1.fieldname,
              options: res,
            });
          } else {
            this.optionList.push({
              module: el1.module,
              fieldname: el1.fieldname,
              options: res,
            });
          }
        });
      } else if (el1.fieldType == "multi-select" && el1.isdependant == false) {
        this.custService.getMethod2(el1.endpoint).subscribe((res: any) => {
          this.multiOptionList.push({
            moduleName: el1.moduleName,
            fieldname: el1.fieldname,
            options: res,
          });
        });
      }
    });
    console.log("optionList", this.optionList);
    console.log("allFieldsArr", this.allFieldsArr);
    console.log("childOptionList", this.childOptionList);
    //
  }
  getFields() {
    if (!this.isEditPlan) {
      this.fieldsArr = [];
      let id: any;
      if (this.selServiceId.value) {
        id = this.selServiceId.value;
      } else {
        id = this.planServiceId;
      }
      this.tempservice
        .getMethod("/fieldMapping/getPlanFieldsByServiceid/" + id)

        .subscribe(
          (res: any) => {
            if (res.responseCode == 200) this.ifServiceParam = true;
            else this.ifServiceParam = false;
            this.fieldsArr = res.dataList;
            console.log("fieldsArr", this.fieldsArr);

            if (this.fieldsArr.length >= 1) {
              this.fieldsArr.forEach((el2: any) => {
                if (el2.mandatoryFlag) {
                  this.form[el2.fieldname] = new FormControl("", [Validators.required]);
                } else this.form[el2.fieldname] = new FormControl("");
              });
            }
            this.customerGroupForm = this.fb.group(this.form);
            this.getList();
            // console.log('planGroupForm',this.planGroupForm)
            // console.log("this.customerGroupForm", this.customerGroupForm);
          },
          (error: any) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.errorMessage,
              icon: "far fa-times-circle",
            });
          }
        );
    } else if (this.isEditPlan) {
      this.fieldsArr = [];
      this.tempservice
        .getMethod("/fieldMapping/getPlanFieldsByServiceid/" + this.viewPlanListData.serviceId)
        .subscribe((res: any) => {
          this.fieldsArr = res.dataList;
          console.log("fieldsArr", this.fieldsArr);
          this.getList();
          if (this.fieldsArr.length >= 1) {
            this.fieldsArr.forEach((el2: any) => {
              if (el2.mandatoryFlag) {
                this.form[el2.fieldname] = new FormControl("", [Validators.required]);
              } else this.form[el2.fieldname] = new FormControl("");
            });
            this.fieldsArr.forEach((el: any) => {
              if (this.viewPlanListData.hasOwnProperty(el.fieldname)) {
                el.defaultValue = this.viewPlanListData[el.fieldname];
              }
            });

            console.log("fieldsArr Updated", this.fieldsArr);
          }
          this.customerGroupForm = this.fb.group(this.form);
        });
    }
  }
  getPlanGroup() {
    const url = "/commonList/planGroup";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.planGroupData = response.dataList;
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

  getAllCAS() {
    const url = "/casepackage/getactivecas";
    this.planManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.casmasterData = response.dataList;
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

  getAllProduct() {
    const url = "/product/getAllActiveProduct";
    this.planManagementService.getMethod(url).subscribe(
      (response: any) => {
        // if (response.responseCode == 200) {
        this.allActiveProduct = response.dataList;
        //console.log("this.productList", this.productList);
        // } else {
        //   this.messageService.add({
        //     severity: "error",
        //     summary: "Error",
        //     detail: response.responseMessage,
        //     icon: "far fa-times-circle",
        //   });
        // }
      },
      (error: any) => {
        // console.log(error, 'error')
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }
  accessibilityData:[] = [];
  getAccessibilityData() {
    let url = "/commonList/accessibility";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.accessibilityData = response.dataList;
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  getProductsType() {
    const url = "/product/all";
    this.productManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.ProductsType = response.dataList;
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
  getPostoaidPlan(list:any) {
    let size;
    this.searchkey = "";
    this.searchKeyType = "";
    this.countTotalOfferPrice = 0;
    let pageList = this.currentPagePostPaidPlan;
    if (list) {
      size = list;
      this.postPaidPlanitemsPerPage = list;
    } else {
      size = this.postPaidPlanitemsPerPage;
    }

    let plandata = {
      page: pageList,
      pageSize: size,
    };

    const url = "/postpaidplan/list";
    this.planManagementService.postMethod(url, plandata).subscribe(
      (response: any) => {
        this.postPaidPlanList = response.postpaidplanList;
        this.postPaidPlantotalRecords = response.pageDetails.totalRecords;

        //console.log(this.postPaidPlanList, this.staffID);
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
  getPlanCaegory() {
    const url = "/commonList/planCategory";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.planCategoryData = response.dataList;
        console;
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

  getChargeType() {
    let url = "/commonList/generic/chargetype";
    this.commondropdownService.getMethodWithCache(url).subscribe((response: any) => {
      const data = response.dataList;
      this.mainChargeList = response.dataList;
      const newArr = data.filter((object:any) => {
        return object.id !== 46;
      });
      const newArr1 = newArr.filter((object:any) => {
        return object.id !== 47;
      });
      this.chargeType = newArr1;

      this.finalChargeType = this.chargeType;
      console.log("this.chargeType", this.chargeType);
    });
  }

  getTaxDataList() {
    const url = "/taxes/all";
    this.planManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.taxListData = response.taxlist;
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
  getPlanType() {
    const url = "/commonList/planType";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.planTypeData = response.dataList;
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

  getService() {
    const url = "/planservice/all";
    this.planManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.serviceData = response.serviceList;
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

  getQosPolicy() {
    const url = "/qosPolicy/all";
    this.qosPolicyService.getMethod(url).subscribe(
      (response: any) => {
        this.qosPolicyData = response.dataList;
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

  getTimeBasePolicy() {
    const url = "/timebasepolicy/all";
    this.planManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.data = response.dataList;
        this.timeBasePolicyData = this.data.filter((element:any) => element.status === "Active");
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
  getQoutaData() {
    const url = "/commonList/quotaTypeData";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.quotaData = response.dataList;
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

  getInventoryCat() {
    const url = "/productCategory/getAllActiveProductCategoriesByCB";
    this.productCategoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.inventoryCat = response;
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
  getQoutaType() {
    const url = "/commonList/quotaType";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.quotaTypeData = response.dataList;
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

  getSelQoutaType(event:any) {
    const selQuotaType = event.value;
    if (selQuotaType == "Both") {
      this.planGroupForm.controls['quotaUnit'].enable();
      this.planGroupForm.controls['quota'].enable();
      this.planGroupForm.controls['quotaunittime'].enable();
      this.planGroupForm.controls['quotatime'].enable();
      this.isQuotaEnabled = true;
      this.isQuotaTimeEnabled = true;
    } else if (selQuotaType == "Time") {
      this.planGroupForm.controls['quotaUnit'].disable();
      this.planGroupForm.controls['quota'].disable();
      this.planGroupForm.controls['quotaunittime'].enable();
      this.planGroupForm.controls['quotatime'].enable();
      this.isQuotaEnabled = false;
      this.isQuotaTimeEnabled = true;
    } else if (selQuotaType == "Data") {
      this.planGroupForm.controls['quotaUnit'].enable();
      this.planGroupForm.controls['quota'].enable();
      this.planGroupForm.controls['quotaunittime'].disable();
      this.planGroupForm.controls['quotatime'].disable();
      this.isQuotaEnabled = true;
      this.isQuotaTimeEnabled = false;
    } else {
      this.planGroupForm.controls['quotaUnit'].disable();
      this.planGroupForm.controls['quota'].disable();
      this.planGroupForm.controls['quotaunittime'].disable();
      this.planGroupForm.controls['quotatime'].disable();
      this.isQuotaEnabled = false;
      this.isQuotaTimeEnabled = false;
    }
  }

  getChargeById(chargeId:any) {
    if (chargeId) {
      const url = "/charge/" + chargeId;
      this.planManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.viewChargeListData = response.chargebyid;
          this.charge.actualprice = this.viewChargeListData.actualprice;
          this.charge.chargecategory = this.viewChargeListData.chargecategory;
          this.charge.chargetype = this.viewChargeListData.chargetype;
          this.charge.desc = this.viewChargeListData.desc;
          this.charge.discountid = this.viewChargeListData.discountid;
          this.charge.id = this.viewChargeListData.id;
          this.charge.name = this.viewChargeListData.name;
          this.charge.price = parseFloat(this.viewChargeListData.price.toString());
          this.charge.saccode = this.viewChargeListData.saccode;
          this.charge.taxName = this.viewChargeListData.taxName;
          this.charge.taxamount = parseFloat(this.viewChargeListData.taxamount.toString());
          this.charge.taxid = this.viewChargeListData.taxid;
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
  }

  selServiceArea(e:any) {
    let data = [];
    if (this.planGroupForm.value.plantype && this.planGroupForm.value.serviceAreaIds) {
      this.isServiceArea_PlanType = false;
    }
    data = e.value;

    let url = "/serviceArea/getAllServicesByServiceAreaId";
    this.planManagementService.postMethod(url, data).subscribe((response: any) => {
      this.serviceList = response.dataList;
    });

    // this.planGroupForm.controls.serviceId.setValue("");
    this.chargeFromArray = this.fb.array([]);
    //this.chargefromgroup.reset();
  }

  selPlanGroup(event:any) {
    console.log(event.value);
    // if (event.value == "Registration") {
    //   this.type = [{ label: "NORMAL" }];
    // } else {
    //    this.type = [{ label: "NORMAL" }, { label: "SPECIAL" }];
    // }

    if (event.value == "Volume Booster") {
      this.ifplanGroup_VB = true;
      this.ifplanGroup_BWB = false;
      this.planGroupForm.patchValue({
        maxconcurrentsession: 1,
        allowOverUsage: false,
        quotaResetInterval: "Total",
        mode: "NORMAL",
        saccode: "",
        validity: "",
        unitsOfValidity: "Days",
        quota: 0,
        quotatype: "Data",
        quotaUnit: "GB",
      });
    } else if (event.value == "Bandwidthbooster") {
      this.ifplanGroup_BWB = true;
      this.ifplanGroup_VB = false;
      this.planGroupForm.patchValue({
        quotaResetInterval: "Total",
        quota: 0,
        quotatype: "Data",
        quotaUnit: "GB",
        maxconcurrentsession: 1,
        allowOverUsage: false,
      });
    } else {
      this.ifplanGroup_BWB = false;
      this.ifplanGroup_VB = false;
      this.planGroupForm.patchValue({
        quota: "",
        quotatype: "",
        quotaUnit: "",
        maxconcurrentsession: 1,
        allowOverUsage: false,
      });
    }
    if (event.value == "Registration and Renewal") {
      this.planProductMappingShowFlag = true;
    } else if (event.value == "Registration") {
      this.planProductMappingShowFlag = true;
    } else {
      this.planProductMappingShowFlag = false;
      this.planProductMappingFromArray = this.fb.array([]);
      this.planProductfromgroup.reset();
    }
  }

  dateDisble(event:any) {
    this.disbleDate = event.target.value;
  }

  dateMaxDisble(event:any) {
    this.maxDisbleDate = event.target.value;
  }
  plantypeEvntData(_event:any) {
    let recurringLIST = [];
    let refundableList = [];
    let nonrecurringList = [];
    this.chargeArray = [];

    if ("Prepaid" == _event || _event == null) {
      // this.chargeArray = [];
      // this.prepaidListView = true;
      // this.postpaidListView = false;
      //
      // const url = "/charge/ByType/Advance";
      // this.planManagementService.getMethod(url).subscribe((response: any) => {
      //   this.chargeArray.push(...response.chargelist);

      //   const url3 = "/charge/ByType/NON_RECURRING";
      //   this.planManagementService.getMethod(url3).subscribe((response: any) => {
      //     this.chargeArray.push(...response.chargelist);
      //
      //   });
      // });

      this.chargeGroupForm.controls['billingCycle'].setValue(1);
      this.chargeGroupForm.controls['billingCycle'].disable();
      //  this.prepaidType = true;
    }

    if ("Postpaid" == _event) {
      // this.chargeArray = [];
      // this.postpaidListView = true;
      // this.prepaidListView = false;

      //
      // const url1 = "/charge/ByType/RECURRING";
      // this.planManagementService.getMethod(url1).subscribe((response: any) => {
      //   recurringLIST = response.chargelist;
      //   this.chargeArray.push(...response.chargelist);
      //   const url3 = "/charge/ByType/NON_RECURRING";
      //   this.planManagementService.getMethod(url3).subscribe((response: any) => {
      //     nonrecurringList = response.chargelist;
      //     this.chargeArray.push(...response.chargelist);
      //
      //   });
      // });

      // const url2 = "/charge/ByType/REFUNDABLE";
      // this.planManagementService.getMethod(url2).subscribe((response: any) => {
      //   refundableList = response.chargelist;
      //   this.chargeArray.push(...response.chargelist);
      // });

      this.chargeGroupForm.controls['billingCycle'].enable();
      // this.prepaidType = false;
    }

    // if (this.planGroupForm.value.plantype) {
    //   this.isServiceArea_PlanType = false;
    // }
    // if (this.viewPlanListData.plantype !== _event.value) {
    //   this.chargeFromArray = this.fb.array([]);
    //   //this.chargefromgroup.reset();
    //   this.planGroupForm.controls.offerprice.setValue("");
    //   this.planGroupForm.controls.newOfferPrice.setValue("");
    // }
    // if (this.totalCharges.length > 0) {
    //   this.advanceListData = [];
    //   this.totalCharges.forEach(element => {
    //     if (this.planGroupForm.value.plantype == "Prepaid") {
    //       if (
    //         element.charge.chargetype == "ADVANCE" ||
    //         element.charge.chargetype == "NON_RECURRING"
    //       ) {
    //         this.advanceListData.push(element.charge);
    //       }
    //     } else if (this.planGroupForm.value.plantype == "Postpaid") {
    //       if (
    //         element.charge.chargetype == "RECURRING" ||
    //         element.charge.chargetype == "NON_RECURRING"
    //       ) {
    //         this.advanceListData.push(element.charge);
    //       }
    //     }
    //   });
    // }
  }

  deleteConfirmonChargeField(chargeFieldIndex: number, chargeFieldId: number) {
    if (chargeFieldIndex || chargeFieldIndex == 0) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Charge?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.onRemoveTaxTypeSlab(chargeFieldIndex, chargeFieldId);
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

  async onRemoveTaxTypeSlab(chargeFieldIndex: number, chargeFieldId: number) {
    this.chargeGroupFormArray.removeAt(chargeFieldIndex);
  }

  pageChangedCharge(pageNumber:any) {
    this.currentPageChargeData = pageNumber;
  }

  getChargeCategory() {
    const url = "/commonList/chargeCategory";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.chargeCategoryList = response.dataList;
      },
      (error: any) => {
        // console.log(error, 'error')
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  taxRang(event:any) {
    let taxData: any = [];
    let slabList: any = [];
    this.taxUpRange = "";
    this.chargeValueSentence = "";
    let id = event.value;

    let url = "/taxes/" + id;
    this.planManagementService.getMethod(url).subscribe((response: any) => {
      taxData = response.taxData;
      if (taxData.taxtype == "SLAB") {
        slabList = taxData.slabList;
        let index = slabList.length - 1;
        this.taxUpRange = slabList[index].rangeUpTo;
        if (this.viewChargeListData.price > this.taxUpRange) {
          this.chargeValueSentence = "The charge value is not in range with added tax.";
        } else {
          this.chargeValueSentence = "";
        }
      }
    });
  }

  createPlanProductFormGroup(): FormGroup {
    return this.fb.group({
      revisedCharge: [this.planProductfromgroup.value.revisedCharge],
      ownershipType: [this.planProductfromgroup.value.ownershipType, Validators.required],
      productCategoryId: [this.planProductfromgroup.value.productCategoryId, Validators.required],
      productId: [this.planProductfromgroup.value.productId],
      product_type: [this.planProductfromgroup.value.product_type, Validators.required],
      productQuantity: [
        this.planProductfromgroup.value.productQuantity,
        [Validators.required, Validators.min(1)],
      ],
      id: [this.planProductfromgroup.value.id],
      name: [null],
    });
  }

  onAddProductField() {
    this.planProductSubmitted = true;
    this.showQtyError = false;
    if (this.planProductfromgroup.valid) {
      if (
        this.planProductfromgroup.controls['revisedCharge'].value == null &&
        this.planProductfromgroup.controls['ownershipType'].value == "Sold"
      ) {
        this.showQtyError = true;
        this.qtyErroMsg = "Do not add product with charge null and ownership type is Sold..";
      } else {
        this.showQtyError = false;
        this.planProductMappingFromArray.push(this.createPlanProductFormGroup());
        console.log(" this.planProductMappingFromArray", this.planProductMappingFromArray);
        this.planProductfromgroup.reset();
        this.planProductfromgroup.controls['productQuantity'].setValue(1);
        this.planProductSubmitted = false;
        this.productFlag = false;
        this.productTypeFlag = false;
        this.ownershipTypeFlag = false;
        this.revisedChargeFlag = false;
        this.productChargeFlag = false;
      }
    }
  }

  pageChangePlanProductData(number:any) {
    this.currentPagePlanProductMapping = number;
  }

  async onRemovePlanProductMap(productFieldIndex: number, productFieldId: number) {
    this.planProductMappingFromArray.removeAt(productFieldIndex);
  }

  deleteConfirmonPlanProductField(productFieldIndex: number, productFieldId: number) {
    if (productFieldIndex || productFieldIndex == 0) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Product?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.onRemovePlanProductMap(productFieldIndex, productFieldId);
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

  getProductbyCategory(event:any) {
    let prodCateId = event.value;
    this.getProductDetailsById = [];
    this.productChargeFlag = false;
    this.showQtyError = false;
    this.planProductfromgroup.get("productId").reset();
    const url = "/product/getAllProductsByProductCategoryId?pc_id=" + prodCateId;
    this.productManagementService.getMethod(url).subscribe(
      (response: any) => {
        // if (response.responseCode == 200) {
        this.productList = response.dataList;
        this.productFlag = true;
        this.productTypeFlag = true;
        this.ownershipTypeFlag = false;
        this.revisedChargeFlag = false;
        this.productChargeFlag = false;
        // console.log("this.productList", this.productList);
        // } else {
        //   this.messageService.add({
        //     severity: "error",
        //     summary: "Error",
        //     detail: response.responseMessage,
        //     icon: "far fa-times-circle",
        //   });
        // }
      },
      (error: any) => {
        // console.log(error, 'error')
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  getProductDetails(event:any) {
    this.ownershipTypeFlag = false;
    this.revisedChargeFlag = false;
    this.productChargeFlag = false;
    this.showQtyError = false;
    this.planProductfromgroup.get("product_type").reset();
    this.getProductDetailsById = this.productList.filter((element:any) => element.id == event.value);
  }

  getChargeAmount(event:any) {
    this.ownershipTypeFlag = true;
    this.revisedChargeFlag = true;
    this.productChargeFlag = true;
    this.showQtyError = false;
    this.planProductfromgroup.get("ownershipType").reset();
    if (this.getProductDetailsById.length != 0) {
      if (event.value == "New") {
        this.chargeAmount = this.getProductDetailsById.find((element:any) => element).newProductAmount;
        this.revicedAmount = this.chargeAmount;
        if (this.chargeAmount != null) {
          this.planProductfromgroup.controls['revisedCharge'].enable();
        } else {
          this.planProductfromgroup.controls['revisedCharge'].disable();
        }
      }
      if (event.value == "Refurbished") {
        this.chargeAmount = this.getProductDetailsById.find(
          (element:any) => element
        ).refurburshiedProductAmount;
        this.revicedAmount = this.chargeAmount;
        if (this.chargeAmount != null) {
          this.planProductfromgroup.controls['revisedCharge'].enable();
        } else {
          this.planProductfromgroup.controls['revisedCharge'].disable();
        }
      }
    } else {
      this.chargeAmount = null;
      this.revicedAmount = null;
      this.planProductfromgroup.controls['revisedCharge'].disable();
    }
  }

  checkOwnership(e:any) {
    this.showQtyError = false;
    if (e.value == "Organization Owned") {
      this.planProductfromgroup.controls['revisedCharge'].disable();
      this.revicedAmount = null;
    } else {
      if (this.chargeAmount != null) {
        this.planProductfromgroup.controls['revisedCharge'].enable();
        this.revicedAmount = this.chargeAmount;
      } else {
        this.planProductfromgroup.controls['revisedCharge'].disable();
      }
      //this.planProductfromgroup.controls.revisedCharge.setValue(this.chargeAmount);
    }
    // this.planProductfromgroup.controls.revisedCharge.setValue("");
  }

  getSelChargeCategory(event:any) {
    if (event.value == "INSTALLATION") {
      this.chargeGroupForm.controls['chargetype'].setValue("NON_RECURRING");
      this.chargeGroupForm.controls['chargetype'].disable();
      this.chargeType = this.finalChargeType;
    } else {
      this.chargeGroupForm.controls['chargetype'].setValue("");
      this.chargeGroupForm.controls['chargetype'].enable();
      this.chargeType = this.chargeType.filter((object:any) => {
        return object.id !== 44;
      });
    }
  }
}
