import { DatePipe, formatDate } from "@angular/common";
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
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
import { ChildCustChangePlanComponent } from "src/app/components/child-cust-change-plan/child-cust-change-plan.component";
import { Subject } from "rxjs";
import { SearchPaymentService } from "src/app/service/search-payment.service";
import { filter, isEqual } from "lodash";
// import * as moment from "moment";
import { Utils } from "src/app/utils/utils";
import { ActivatedRoute, Router } from "@angular/router";
import { NetworkdeviceService } from "src/app/service/networkdevice.service";
import { CustomerService } from "src/app/service/customer.service";
// import { PrimeNGConfig } from "primeng/api";
import { Table } from "primeng/table";
// import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { CountryManagementService } from "src/app/service/country-management.service";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";
import { DeactivateService } from "src/app/service/deactivate.service";
import { StatusCheckService } from "src/app/service/status-check-service.service";
import { LocationService } from "src/app/service/location.service";

declare var $: any;

@Component({
    selector: "app-radius-customer-create",
    templateUrl: "./radius-customer-create.component.html",
    styleUrls: ["./radius-customer-create.component.scss"],
    standalone: false
})
export class RadiusCustomerCreateComponent implements OnInit {
  custType;
  mvnoData: any;
  loggedInUser: any;
  mvnoId: any;
  isShowMenu = true;
  isShowCreateView = true;
  isShowListView = true;
  createAccess: boolean = false;
  editCustId: any;
  loggedInStaffId = localStorage.getItem("userId");
  partnerId = Number(localStorage.getItem("partnerId"));
  AclClassConstants;
  AclConstants;
  custData: any = {};
  custLocationData: any = [];

  customerGroupForm: FormGroup;
  planCategoryForm: FormGroup;
  planGroupForm: FormGroup;
  presentGroupForm: FormGroup;
  paymentGroupForm: FormGroup;
  permanentGroupForm: FormGroup;
  planDataForm: FormGroup;
  chargeGroupForm: FormGroup;
  validityUnitFormGroup: FormGroup;

  payMappingListFromArray: FormArray;
  addressListFromArray: FormArray;
  paymentDetailsFromArray: FormArray;
  overChargeListFromArray: FormArray;
  custMacMapppingListFromArray: FormArray;
  plansArray: FormArray;
  validityUnitFormArray: FormArray;
  locationDataByPlan: any = [];
  iscustomerEdit = false;
  submitted = false;
  showPassword = false;
  calTypwDisable = false;
  isCustSubTypeCon = false;
  showParentCustomerModel = false;
  serviceareaCheck = true;
  serviceAreaDisable = false;
  parentFieldEnable = false;
  isBranchAvailable = false;
  isParantExpirenceEdit = false;
  selectAreaList = false;
  selectPincodeList = false;
  selectPincodeListPermanent = false;
  selectPincodeListPayment = false;
  iflocationFill = false;
  ifsearchLocationModal = false;
  ifPlanGroup = false;
  ifcustomerDiscountField = false;
  ifplanisSubisuSelect = false;
  ifIndividualPlan = false;
  isTrialCheckDisable = false;
  plansubmitted = false;
  ifdiscounAllow = true;
  isSerialNumberShow: boolean = false;
  serialNumber: any;
  isProductRequired = false;

  currentPagesearchLocationList = 1;
  planTotalOffetPrice = 0;
  discountValue: any = 0;

  _passwordType = "password";

  countries: any = countries;
  pincodeTitle = PINCODE;
  countryTitle = COUNTRY;
  cityTitle = CITY;
  stateTitle = STATE;
  areaTitle = AREA;

  paymappingItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  payMappinftotalRecords = 0;
  currentPagePayMapping = 1;

  dunningRules: any;
  serviceAreaData: any;
  selectedParentCustId: any;
  departmentListData: any;
  planByServiceArea: any;
  areaDetails: any;
  pincodeDeatils: any;
  paymentareaDetails: any;
  permanentareaDetails: any;
  planGroupSelectedSubisu: any;
  planGroupSelected: any;
  plantypaSelectData: any;
  areaAvailableList: any;
  newSubisuPrice: any;
  finalOfferPrice: number;

  inputMobile = "";
  inputMobileSec = "";
  extendDays: any = "";
  trailbtnTypeSelect = "";
  customerSector = "";
  parentCustomerDialogType = "";
  customerSelectType = "";

  customerType: any[];
  customerSubType: any[];
  days:any[] = [];
  staffList:any[] = [];
  parentCustList:any[] = [];
  billableCustList:any[] = [];
  pincodeDD: any = [];
  areaListDD: any;
  selectedParentCust: any = [];
  partnerListByServiceArea: any = [];
  serviceData: any = [];
  branchData: any = [];
  filterPlanData: any = [];
  planDropdownInChageData:any[] = [];
  discountValueStore: any = [];
  filterNormalPlanGroup:any[] = [];
  planListSubisu:any[]= [];
  planIds:any[] = [];
  planGroupMapingList: any = [];
  oltDevices:any[] = [];
  spliterDevices:any[] = [];
  masterDbDevices:any[] = [];

  dateTime = new Date();

  createcustomerData: CustomerManagements;

  selectTitile = [
    { label: "Mr" },
    { label: "Ms" },
    { label: "Mrs" },
    { label: "Miss" },
    { label: "M/S" }
  ];
  celendarTypeData = [{ label: "English" }, { label: "Nepali" }];
  planDetailsCategory = [
    { label: "Individual", value: "individual" },
    { label: "Plan Group", value: "groupPlan" }
  ];
  customerTypeValue = [
    { label: "Customer", value: "customer" },
    { label: "Organization", value: "organization" }
  ];
  invoiceType = [
    { label: "Group", value: "Group" },
    { label: "Independent", value: "Independent" }
  ];
  parentExperience = [
    { label: "Single", value: "Single" },
    { label: "Actual", value: "Actual" }
  ];
  valleyType = [
    { label: "Inside Valley", value: "Inside Valley" },
    { label: "Outside valley", value: "Outside valley" }
  ];
  invoiceData = [
    { label: "YES", value: true },
    { label: "NO", value: false }
  ];

  quotaSharableData = [
    { label: "shareable", value: "shareable" },
    { label: "individual", value: "individual" }
  ];
  chargeType = [{ label: "One-time" }, { label: "Recurring" }];
  discountType: any = "One-time";
  serviceAreaList: any = [];
  defualtServiceArea: any = [];
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  showLocationMac: boolean = false;
  locationMacForm: FormGroup;
  overLocationMacArray = this.fb.array([]);
  macData: any = [];
  locationMacData: any = [];

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private customerManagementService: CustomermanagementService,
    public PaymentamountService: PaymentamountService,
    public commondropdownService: CommondropdownService,
    public datepipe: DatePipe,
    public loginService: LoginService,
    public invoicePaymentListService: InvoicePaymentListService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private networkdeviceService: NetworkdeviceService,
    private liveUserService: LiveUserService,
    private countryManagementService: CountryManagementService,
    public KeyannaCommonBaseService: KeyannaCommonBaseService,
    private deactivateService: DeactivateService,
    private locationService: LocationService,
    public statusCheckService: StatusCheckService
  ) {
    this.custType = this.route.snapshot.paramMap.get("custType")!;
    this.editCustId = this.route.snapshot.paramMap.get("custId")!;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }

  ngOnInit(): void {
    this.initData();
  }

  canExit() {
    if (!this.customerGroupForm.dirty) return true;
    {
      return Observable.create((observer: Observer<boolean>) => {
        this.confirmationService.confirm({
          header: "Alert",
          message: "The filled data will be lost. Do you want to continue? (Yes/No)",
          icon: "pi pi-info-circle",
          accept: () => {
            observer.next(true);
            observer.complete();
          },
          reject: () => {
            observer.next(false);
            observer.complete();
          }
        });
        return false;
      });
    }
  }

  initData() {
    this.mvnoData = JSON.parse(localStorage.getItem("mvnoData"));
    this.loggedInUser = localStorage.getItem("loggedInUser");
    this.mvnoId = localStorage.getItem("mvnoId");
    console.log("this.editCustId :::: ", this.editCustId);
    this.getPartnerAll();
    this.iscustomerEdit = false;
    if (this.editCustId != null) {
      this.iscustomerEdit = true;
      this.editCustomer();
    }
    this.customerGroupForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      title: ["", Validators.required],
      partner: ["", Validators.required],
      failcount: ["0"],
      acct_no: [""],
      thparam1: ["", Validators.required],
      thparam2: ["", Validators.required],
      thparam3: ["", Validators.required],
      thparam4: ["", Validators.required],
      vsiid: [""],
      vsiname: [""],
      vrfname: [""],
      rdvalue: [""],
      rdexport: [""],
      ipprefixes: [""],
      gatewayIpBind: [""],
      skipnetconf: [""],
      rdimport: [""],
      bngrouterinterface: [""],
      qos: [""],
      vlanid: [""],
      wanip: [""],
      lanip: [""],
      asnnumber: [""],
      llaccountid: [""],
      peerip: [""],
      remarks: ["", Validators.required],
      // acctno: ['', Validators.required],
      custtype: ["", Validators.required],
      mobile: ["", [Validators.required, Validators.maxLength(10)]],
      birthDate: [""],
      countryCode: [this.commondropdownService.commonCountryCode],
      partnerid: [this.partnerId],
      status: ["", Validators.required],
      parentCustomerId: [""],
      expiryDate: [""],
      eDate: [""],
      framedIPNetmask: [""],
      framedIPv6Prefix: [""],
      gatewayIP: [""],
      primaryDNS: [""],
      primaryIPv6DNS: [""],
      secondaryIPv6DNS: [""],
      secondaryDNS: [""]
    });

    this.commondropdownService.getCustomerStatus();
  }

  editCustomer() {
    this.partnerListByServiceArea;

    const url = "/customerById?custid=" + this.editCustId + "&mvnoId=" + this.mvnoId;
    this.customerManagementService.getMethodForRadius(url).subscribe(
      (response: any) => {
        // this.iscustomerEdit = true;
        this.custData = response.customer;
        this.customerGroupForm.patchValue(this.custData);
        this.customerGroupForm.controls['thparam1'].patchValue(this.custData.addparam1);
        this.customerGroupForm.controls['thparam2'].patchValue(this.custData.addparam2);
        this.customerGroupForm.controls['thparam3'].patchValue(this.custData.addparam3);
        this.customerGroupForm.controls['thparam4'].patchValue(this.custData.addparam4);
        this.customerGroupForm.controls['acct_no'].patchValue(this.custData.acctno);
        this.customerGroupForm.controls['gatewayIpBind'].patchValue(this.custData.gatewayip);
        this.customerGroupForm.controls['partner'].setValue(Number(this.custData.partner));
        if (this.custData.expirydate) {
          this.customerGroupForm.controls['expiryDate'].patchValue(
            this.datePipe.transform(this.custData.expirydate, "yyyy-MM-dd")
          );
        }
        this.customerGroupForm.controls['eDate'].setValue(this.custData.expirydate);
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getTempPincodeData(id: any, index: any) {
    const url = "/pincode/" + id;

    this.KeyannaCommonBaseService.get(url).subscribe((response: any) => {
      if (index === "present") {
        this.pincodeDeatils = response.data;
        if (response.data.areaList.length !== 0) {
          this.areaAvailableList = response.data.areaList;
        }
      }
      // if (index === "payment") {
      //   this.PyamentpincodeDeatils = response.data;
      //   if (response.data.areaList.length !== 0) {
      //     this.paymentareaAvailableList = response.data.areaList;
      //   }
      //
      // }
      // if (index === "permanent") {
      //   this.permanentpincodeDeatils = response.data;
      //   if (response.data.areaList.length !== 0) {
      //     this.permanentareaAvailableList = response.data.areaList;
      //   }
      //
      // }
    });
  }

  getBillableCust(billableCustomerId:any) {
    const url = "/customers/" + billableCustomerId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        var name = response.customers.firstname + " " + response.customers.lastname;
        this.billableCustList = [
          {
            name: name,
            id: billableCustomerId
          }
        ];
        this.customerGroupForm.patchValue({ billableCustomerId: billableCustomerId });
      },
      error => {}
    );
  }

  daySequence() {
    for (let i = 0; i < 31; i++) {
      this.days.push({ label: i + 1 });
    }
  }

  getsystemconfigListByName(keyName: string) {
    const url = "/system/configurationListByKey?keyName=" + keyName;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.dunningRules = response.dataList;
      },
      (error: any) => {}
    );
  }

  getStaffUserByServiceArea(ids:any) {
    let data = [];
    data.push(ids);
    let url = "/staffsByServiceAreaId/" + ids;
    this.KeyannaCommonBaseService.get(url).subscribe((response: any) => {
      //
      this.staffList = response.dataList;
    });
  }

  getCustomerType() {
    const url = "/commonList/Customer_Type";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.customerType = response.dataList;
        // console.log("this.customerType ::::: ", this.customerType);
      },
      (error: any) => {
        console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getcustType(event:any) {
    let value = event.value;
    this.customerGroupForm.controls['customerSubType'].enable();
    let actionUrl = `/commonList/${value}`;
    if (event.value == "Barter") {
      this.isCustSubTypeCon = false;
    } else {
      this.isCustSubTypeCon = true;
      this.getCustomerTypeFlow(actionUrl);
    }
  }

  getCustomerTypeFlow(url:any) {
    this.commondropdownService.getMethodWithCache(url).subscribe((response: any) => {
      this.customerSubType = response.dataList;
    });
  }

  getCustomerSector() {
    const url = "/commonList/Customer_Sector";
    const custerlist = {};
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.customerSector = response.dataList;
      },
      (error: any) => {
        console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getDepartmentList() {
    const url = "/department/all";
    this.countryManagementService.getMethod(url).subscribe(
      (res: any) => {
        this.departmentListData = res.departmentList;
      },
      (err: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong while fetching lead origin types",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getNetworkDevicesByType(deviceType:any) {
    if (this.statusCheckService.isActiveInventoryService) {
      const url = "/NetworkDevice/getNetworkDevicesByDeviceType?deviceType=" + deviceType;
      this.networkdeviceService.getMethod(url).subscribe(
        (response: any) => {
          switch (deviceType) {
            case "OLT":
              this.oltDevices = response.dataList;
              break;
            case "Splitter/DB":
              this.spliterDevices = response.dataList;
              break;
            case "Master DB":
              this.masterDbDevices = response.dataList;
              break;
          }
        },
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }

  getSelectCustomerSector(event:any) {
    const value = event.value;
    if (value) {
      this.customerGroupForm.controls['customerSubSector'].enable();
    } else {
      this.customerGroupForm.controls['customerSubSector'].disable();
    }
  }

  async selectedCustChange(event:any) {
    this.showParentCustomerModel = false;
    this.selectedParentCust = event;

    if (this.parentCustomerDialogType === "billable") {
      this.billableCustList = [
        {
          id: this.selectedParentCust.id,
          name: this.selectedParentCust.name
        }
      ];
      this.customerGroupForm.patchValue({
        billableCustomerId: this.selectedParentCust.id
      });
    } else {
      this.parentCustList = [
        {
          id: this.selectedParentCust.id,
          name: this.selectedParentCust.name
        }
      ];
      this.customerGroupForm.patchValue({
        parentCustomerId: this.selectedParentCust.id
      });

      //TODO remove below api call once we done fetching service area id in in parent customer api
      const url = "/customers/" + this.selectedParentCust.id;
      let parentCustServiceAreaId: any;

      await this.customerManagementService.getMethod(url).subscribe((response: any) => {
        parentCustServiceAreaId = response.customers.serviceareaid;
        this.serviceareaCheck = false;
        this.customerGroupForm.patchValue({
          serviceareaid: parentCustServiceAreaId
        });
        if (parentCustServiceAreaId) {
          this.selServiceAreaByParent(parentCustServiceAreaId);
          this.serviceAreaDisable = true;
        }
        this.customerGroupForm.controls['parentExperience'].setValue("Actual");
        this.customerGroupForm.controls['parentExperience'].enable();
      });
      // setTimeout(() => {

      // }, 5000);
      if (
        this.planCategoryForm.value.planCategory != null &&
        this.planCategoryForm.value.planCategory == "groupPlan"
      ) {
        this.customerGroupForm.controls['invoiceType'].enable();
        this.planGroupForm.controls['invoiceType'].disable();
      } else if (
        this.planCategoryForm.value.planCategory != null &&
        this.planCategoryForm.value.planCategory == "individual"
      ) {
        this.customerGroupForm.controls['invoiceType'].disable();
        this.planGroupForm.controls['invoiceType'].enable();
      }
    }
  }

  removeSelParentCust(type:any) {
    this.selectedParentCust = [];
    if (type === "billable") {
      this.billableCustList = [];
      this.customerGroupForm.patchValue({
        billableCustomerId: null
      });
    } else {
      this.customerGroupForm.patchValue({
        parentCustomerId: ""
      });
      this.customerGroupForm.controls['invoiceType'].setValue("");
      this.customerGroupForm.controls['invoiceType'].disable();
      this.planGroupForm.controls['invoiceType'].setValue("");
      this.planGroupForm.controls['invoiceType'].disable();
      this.customerGroupForm.controls['parentExperience'].setValue("");
      this.customerGroupForm.controls['parentExperience'].disable();

      this.customerGroupForm.controls['serviceareaid'].setValue("");
      this.serviceAreaDisable = false;
      this.parentCustList = [];
    }
    this.isBranchAvailable = false;
  }

  selServiceAreaByParent(id:any) {
    const serviceAreaId = id;
    this.pincodeDD = [];
    if (serviceAreaId) {
      const url = "/serviceArea/" + serviceAreaId;
      this.KeyannaCommonBaseService.get(url).subscribe(
        (response: any) => {
          this.serviceareaCheck = false;
          this.serviceAreaData = response.data;
          this.serviceAreaData.pincodes.forEach((element:any) => {
            this.commondropdownService.allpincodeNumber.forEach((e:any) => {
              if (e.pincodeid == element) {
                this.pincodeDD.push(e);
              }
            });
          });
          this.getPartnerAll();
          this.getServiceByServiceAreaID(serviceAreaId);
          this.getPlanbyServiceArea(serviceAreaId);
          this.getBranchByServiceAreaID(serviceAreaId);
          this.getStaffUserByServiceArea(serviceAreaId);
        },
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }

  selServiceArea(event:any) {
    this.pincodeDD = [];
    const serviceAreaId = event.value;
    this.planGroupForm.patchValue({
      service: "",
      planId: ""
    });

    if (serviceAreaId) {
      const url = "/serviceArea/" + serviceAreaId;
      this.KeyannaCommonBaseService.get(url).subscribe(
        (response: any) => {
          this.serviceareaCheck = false;
          this.serviceAreaData = response.data;
          this.plantypaSelectData = [];
          this.serviceAreaData.pincodes.forEach((element:any) => {
            this.commondropdownService.allpincodeNumber.forEach((e:any) => {
              if (e.pincodeid == element) {
                this.pincodeDD.push(e);
              }
            });
          });

          this.getPlanbyServiceArea(serviceAreaId);
          if (!this.iscustomerEdit) {
            this.presentGroupForm.reset();
          }
        },
        (error: any) => {}
      );
      this.getPartnerAll();
      this.getServiceByServiceAreaID(serviceAreaId);
      if (this.partnerId == 1) this.getBranchByServiceAreaID(serviceAreaId);
      this.getStaffUserByServiceArea(serviceAreaId);
    }
  }

  getBranchByServiceAreaID(ids:any) {
    let data = [];
    if (ids) ids = 1;
    data.push(ids);
    let url = "/branchManagement/getAllBranchesByServiceAreaId";
    this.KeyannaCommonBaseService.post(url, data).subscribe((response: any) => {
      this.branchData = response.dataList;
      if (this.branchData != null && this.branchData.length > 0) {
        this.isBranchAvailable = true;
        this.customerGroupForm.controls['branch'].setValidators(Validators.required);
        this.customerGroupForm.controls['partnerid'].clearValidators();
        this.customerGroupForm.updateValueAndValidity();
      } else {
        this.isBranchAvailable = false;
        this.customerGroupForm.controls['partnerid'].setValidators(Validators.required);
        this.customerGroupForm.controls['branch'].clearValidators();
        this.customerGroupForm.controls['branch'].updateValueAndValidity();
        this.customerGroupForm.updateValueAndValidity();
      }
    });
  }

  //   getPartnerAllByServiceArea(serviceAreaId) {
  //
  //     const url = "/getPartnerByServiceAreaId/" + serviceAreaId;
  //     this.commondropdownService.getMethod(url).subscribe(
  //       (response: any) => {
  //         this.partnerListByServiceArea = response.partnerList.filter(item => item.id != 1);
  //
  //       },
  //       (error: any) => {
  //
  //       }
  //     );
  //   }

  getPartnerAll() {
    const url = "/partner/all";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.partnerListByServiceArea = response.partnerlist;
      },
      (error: any) => {}
    );
  }

  getServiceByServiceAreaID(ids:any) {
    let data = [];
    data.push(ids);
    let url = "/serviceArea/getAllServicesByServiceAreaId";
    this.customerManagementService.postMethod(url, data).subscribe((response: any) => {
      this.serviceData = response.dataList;
    });
  }

  getPlanbyServiceArea(serviceAreaId:any) {
    if (serviceAreaId) {
      this.filterPlanData = [];
      const custType = this.custType;
      const url = "/plans/serviceArea?planmode=NORMAL&serviceAreaId=" + serviceAreaId;
      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.planByServiceArea = response.postpaidplanList;
          this.filterPlanData = this.planByServiceArea.filter((plan:any) => plan.plantype == custType);
        },
        (error: any) => {
          console.log(error, "error");
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }

  getAreaData(id: any, index: any) {
    const url = "/area/" + id;

    this.KeyannaCommonBaseService.get(url).subscribe((response: any) => {
      if (index === "present") {
        this.areaDetails = response.data;

        this.selectPincodeList = true;

        this.presentGroupForm.patchValue({
          addressType: "Present",
          areaId: Number(this.areaDetails.id),
          pincodeId: Number(this.areaDetails.pincodeId),
          cityId: Number(this.areaDetails.cityId),
          stateId: Number(this.areaDetails.stateId),
          countryId: Number(this.areaDetails.countryId)
        });
      }
      if (index === "payment") {
        this.paymentareaDetails = response.data;

        this.selectPincodeListPayment = true;

        this.paymentGroupForm.patchValue({
          addressType: "Payment",
          pincodeId: Number(this.paymentareaDetails.pincodeId),
          cityId: Number(this.paymentareaDetails.cityId),
          stateId: Number(this.paymentareaDetails.stateId),
          countryId: Number(this.paymentareaDetails.countryId)
        });
      }
      if (index === "permanent") {
        this.permanentareaDetails = response.data;

        this.selectPincodeListPermanent = true;
        this.permanentGroupForm.patchValue({
          addressType: "Permanent",
          pincodeId: Number(this.permanentareaDetails.pincodeId),
          cityId: Number(this.permanentareaDetails.cityId),
          stateId: Number(this.permanentareaDetails.stateId),
          countryId: Number(this.permanentareaDetails.countryId)
        });
      }
    });
  }

  onKey(event:any) {
    if (event.key == "Tab") {
      const url =
        "/custUsernameIsAlreadyExists?userName=" + this.customerGroupForm.controls['username'].value;
      this.customerManagementService.getMethodForRadius(url).subscribe((response: any) => {
        if (response.isAlreadyExists == true) {
          this.messageService.add({
            severity: "error",
            summary: "Error ",
            detail: "Username not available. Please Change Username",
            icon: "far fa-times-circle"
          });
        }
      });
    }
  }

  onKeymobilelength(event:any) {
    const str = this.customerGroupForm.value.mobile.toString();
    const withoutCommas = str.replace(/,/g, "");
    const strrr = withoutCommas.trim();
    let mobilenumberlength = this.commondropdownService.commonMoNumberLength;
    if (mobilenumberlength === 0 || mobilenumberlength === null) {
      mobilenumberlength = 10;
    }
    if (strrr.length > Number(mobilenumberlength)) {
      this.inputMobile = `${mobilenumberlength} character required.`;
    } else if (strrr.length == Number(mobilenumberlength)) {
      this.inputMobile = "";
    } else {
      this.inputMobile = `${mobilenumberlength} character required.`;
    }
  }

  mobileError: boolean = false;

  onInputMobile(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    // Check if the input starts with 0
    if (inputValue.startsWith("0")) {
      this.mobileError = true;
    } else {
      this.mobileError = false;
    }
  }

  onKeymobilelengthsec(event:any) {
    const str = this.customerGroupForm.value.altmobile.toLocaleString();
    const withoutCommas = str.replace(/,/g, "");
    const strrr = withoutCommas.trim();
    let mobilenumberlength = this.commondropdownService.commonMoNumberLength;
    if (strrr.length > Number(mobilenumberlength)) {
      this.inputMobileSec = `Mobile Number minimum ${mobilenumberlength} character is required.`;
    } else if (strrr.length == Number(mobilenumberlength)) {
      this.inputMobileSec = "";
    } else {
      this.inputMobileSec = `Mobile Number minimum ${mobilenumberlength} character is required.`;
    }
  }

  keypressId(event: any) {
    const pattern = /[0-9\.]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && event.keyCode != 9 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
    if (this.trailbtnTypeSelect == "extend") {
      if (Number(this.extendDays) > Number(this.commondropdownService.trialPLanMaxLength)) {
        this.extendDays = 0;
        this.messageService.add({
          severity: "info",
          summary: "Info",
          detail: "Maximmum value is " + this.commondropdownService.trialPLanMaxLength,
          icon: "far fa-times-circle"
        });
      }
    }
  }

  discountvaluesetPercentage(e:any) {
    let data = [];
    let price = Number(this.planDataForm.value.offerPrice);
    let selDiscount = parseFloat(this.planDataForm.value.discountPrice).toFixed(2);
    let discount = Number(selDiscount);
    let discountPlan = (discount * 100) / price;
    let discountValueNUmber = discountPlan.toFixed(2);
    let value = 100 - Number(discountValueNUmber);

    if (this.ifPlanGroup) {
      if (discount == 0) {
        this.customerGroupForm.patchValue({
          discount: 100
        });
      } else {
        this.customerGroupForm.patchValue({
          discount: value.toFixed(2)
        });
      }
    } else {
      this.payMappingListFromArray.value.forEach((element:any, i:any) => {
        let n = i + 1;
        if (discount == 0) {
          element.discount = 100;
        } else {
          element.discount = value.toFixed(2);
        }

        if (this.payMappingListFromArray.value.length == n) {
          this.payMappingListFromArray.patchValue(this.payMappingListFromArray.value);
        }
      });
    }
  }

  mylocation() {
    //
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        if (position) {
          this.iflocationFill = true;
          this.customerGroupForm.patchValue({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        }
      });
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Geolocation is not supported by this browser.",
        icon: "far fa-times-circle"
      });
    }
  }

  parentExperienceSelect(e:any) {
    this.planGroupForm.value.invoiceType = "Group";
  }

  onChnagePincode(_event: any, index: any) {
    const url = "/area/pincode?pincodeId=" + _event.value;
    this.KeyannaCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.areaListDD = response.areaList;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  planSelectType(event:any) {
    this.planDropdownInChageData = [];
    this.discountValueStore = [];
    this.discountValue = 0;
    this.planTotalOffetPrice = 0;
    const planaddDetailType = event.value;
    this.ifplanisSubisuSelect = false;
    this.planDataForm.reset();
    this.customerGroupForm.controls['plangroupid'].reset();
    this.customerGroupForm.controls['discount'].reset();
    this.customerGroupForm.controls['discountType'].reset();
    this.customerGroupForm.controls['discountExpiryDate'].reset();
    if (planaddDetailType == "individual") {
      this.ifIndividualPlan = true;
      this.ifPlanGroup = false;
      this.payMappingListFromArray.controls = [];
      if (
        this.customerGroupForm.value.parentCustomerId != null &&
        this.customerGroupForm.value.parentCustomerId != ""
      ) {
        this.planGroupForm.controls['invoiceType'].enable();
        this.customerGroupForm.controls['invoiceType'].disable();
        if (this.customerGroupForm.value.parentExperience == "Single")
          this.planGroupForm.patchValue({ invoiceType: "Group" });
        else this.planGroupForm.patchValue({ invoiceType: "" });
      }
    } else if (planaddDetailType == "groupPlan") {
      if (this.serviceAreaData) {
        this.filterNormalPlanGroup = [];
        if (this.custType == "Prepaid") {
          this.commondropdownService.PrepaidPlanGroupDetails.forEach(element => {
            if (
              element['planMode'] == "NORMAL" &&
              (element['planGroupType'] === "Registration" ||
                element['planGroupType'] === "Registration and Renewal")
            ) {
              this.filterNormalPlanGroup.push(element);
            }
          });
        }
        if (this.custType == "Postpaid") {
          this.commondropdownService.postPlanGroupDetails.forEach(element => {
            if (
              element['planMode'] == "NORMAL" &&
              (element['planGroupType'] === "Registration" ||
                element['planGroupType'] === "Registration and Renewal")
            ) {
              this.filterNormalPlanGroup.push(element);
            }
          });
        }
        let data1;
        let data2;
        if (this.filterNormalPlanGroup) {
          data1 = this.filterNormalPlanGroup.filter(
            plan => plan.servicearea.id == this.serviceAreaData.id
          );
          data2 = this.filterNormalPlanGroup.filter(plan =>
            plan.servicearea.filter((e:any) => e == this.serviceAreaData.id)
          );
        }
        this.filterNormalPlanGroup = [...data1, ...data2];
        if (
          this.customerGroupForm.value.parentCustomerId != null &&
          this.customerGroupForm.value.parentCustomerId != ""
        ) {
          this.customerGroupForm.controls['invoiceType'].enable();
          this.planGroupForm.controls['invoiceType'].disable();
          if (this.customerGroupForm.value.parentExperience == "Single")
            this.customerGroupForm.patchValue({ invoiceType: "Group" });
          else this.customerGroupForm.patchValue({ invoiceType: "" });
        }
      }

      this.ifIndividualPlan = false;
      this.ifPlanGroup = true;
      this.customerGroupForm.patchValue({
        plangroupid: ""
      });
    } else {
      this.ifIndividualPlan = false;
      this.ifPlanGroup = false;
    }
  }

  billtoSelectValue(e:any) {
    this.payMappingListFromArray.controls = [];
    this.planGroupForm.reset();
    this.plansArray = this.fb.array([]);
    this.customerGroupForm.patchValue({
      plangroupid: ""
    });
  }

  onChangeArea(_event: any, index: any) {
    this.getAreaData(_event.value, index);
  }

  onChangeInvoiceToOrg(e:any) {
    if (!this.ifPlanGroup) {
      this.plansArray.value.forEach((element:any) => {
        element.isInvoiceToOrg = e.value;
      });
    }
  }

  planGroupSelectSubisu(e:any) {
    if (this.ifPlanGroup) {
      this.customerGroupForm.patchValue({
        discount: 0
      });

      this.planDataForm.patchValue({
        discountPrice: 0
      });
    }
    this.ifcustomerDiscountField = false;
    if (e.value) {
      this.planGroupSelected = e.value;
      let url = "/findPlanGroupById?planGroupId=" + e.value;
      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          const planDetailData = response.planGroup;
          if (response.planGroup.allowDiscount == true) {
            this.ifcustomerDiscountField = true;
          } else {
            this.ifcustomerDiscountField = false;
          }
          if (planDetailData.category == "Business Promotion") {
            this.ifplanisSubisuSelect = true;
            this.customerGroupForm.patchValue({
              billTo: "ORGANIZATION",
              isInvoiceToOrg: planDetailData.invoiceToOrg
            });

            // $("#selectPlanGroup").modal("show");
            // this.plansArray.controls = response.planGroup
            this.planGroupSelectedSubisu = e.value;
            this.getPlanListByGroupIdSubisu();
          } else if (
            this.customerGroupForm.value.billTo == "ORGANIZATION" &&
            planDetailData.category == "Normal" &&
            this.ifplanisSubisuSelect == false
          ) {
            this.ifplanisSubisuSelect = false;
            this.customerGroupForm.patchValue({
              billTo: "ORGANIZATION"
            });
            $("#selectPlanGroup").modal("show");
            this.planGroupSelectedSubisu = e.value;
            this.getPlanListByGroupIdSubisu();
          } else {
            this.ifplanisSubisuSelect = false;
            this.customerGroupForm.patchValue({
              billTo: "CUSTOMER"
            });

            // if (this.customerChangePlan) {
            //   $("#selectPlanGroup").modal("show");
            //   this.planGroupSelectedSubisu = e.value;
            //   console.log(this.planGroupSelectedSubisu);
            //   this.getPlanListByGroupIdSubisu();
            // } else {
            this.planGroupSelectedSubisu = e.value;
            // }
          }
          let newAmount = 0;
          let totalAmount = 0;
          this.planIds = [];
          planDetailData.planMappingList.forEach((element:any, i:any) => {
            let n = i + 1;
            newAmount =
              element.plan.newOfferPrice != null
                ? element.plan.newOfferPrice
                : element.plan.offerprice;
            totalAmount = Number(totalAmount) + Number(newAmount);
            if (planDetailData.planMappingList.length == n) {
              this.planDataForm.patchValue({
                offerPrice: totalAmount
              });
            }
            this.planIds.push(element.plan.id);
          });
          this.discountPercentage({ planGroupId: e.value });
        },
        (error: any) => {}
      );
    }
    // else if (this.customerChangePlan) {
    //   $("#selectPlanGroup").modal("show");
    //   this.planGroupSelectedSubisu = e;
    //   console.log(this.planGroupSelectedSubisu);
    //   this.getPlanListByGroupIdSubisu();
    // }

    // if (this.customerGroupForm.value.billTo == "ORGANIZATION") {
    //   $("#selectPlanGroup").modal("show");
    //   this.planGroupSelectedSubisu = e.value;
    //   console.log(this.planGroupSelectedSubisu);
    //   this.getPlanListByGroupIdSubisu();
    // } else if (this.customerChangePlan) {
    //   $("#selectPlanGroup").modal("show");
    //   this.planGroupSelectedSubisu = e;
    //   console.log(this.planGroupSelectedSubisu);
    //   this.getPlanListByGroupIdSubisu();
    // }
    if (e.value) {
      this.getPlangroupByPlan(e.value);
      this.planGroupDataById(e.value);
    }
  }

  planGroupDataById(planGroupId:any) {
    let url = "/findPlanGroupById?planGroupId=" + planGroupId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.planGroupMapingList = response.planGroup.planMappingList;
    });
  }

  subisuPrice(e:any) {
    this.newSubisuPrice = e.target.value;
  }
  modalClosePlanChangeSubisu() {
    $("#selectPlanGroup").modal("hide");
  }

  discountPercentage(e:any) {
    if (this.ifPlanGroup) {
      this.customerManagementService
        .getofferPriceWithTax(
          this.planIds,
          this.customerGroupForm.value.discount,
          this.planGroupSelected
        )
        .subscribe((response: any) => {
          if (response.result.finalAmount) {
            this.finalOfferPrice = response.result.finalAmount.toFixed(3);
            this.discountValue = response.result.finalAmount.toFixed(3);
          } else {
            this.finalOfferPrice = 0;
            this.discountValue = 0;
          }
          this.planDataForm.patchValue({
            discountPrice: Number(this.discountValue).toFixed(2)
          });
        });
    } else {
      this.customerManagementService
        .getofferPriceWithTax(this.planGroupForm.value.planId, this.planGroupForm.value.discount)
        .subscribe((response: any) => {
          if (response.result.finalAmount) {
            this.finalOfferPrice = response.result.finalAmount.toFixed(3);
            this.discountValue = response.result.finalAmount.toFixed(3);
          } else {
            this.finalOfferPrice = 0;
            this.discountValue = 0;
          }
        });
    }
  }

  getPlangroupByPlan(planGroupId:any) {
    this.planDropdownInChageData = [];
    const MappURL = "/findPlanGroupMappingByPlanGroupId?planGroupId=" + planGroupId;
    this.customerManagementService.getMethod(MappURL).subscribe((response: any) => {
      const attributeList = response.planGroupMappingList;
      attributeList.forEach((element:any) => {
        this.planDropdownInChageData.push(element.plan);
      });

      if (this.ifPlanGroup && this.iscustomerEdit) {
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
            this.planDataForm.patchValue({
              offerPrice: totalAmount
            });

            let price = Number(this.planDataForm.value.offerPrice);
            let discount = Number(this.customerGroupForm.value.discount);
            let DiscountV = (price * discount) / 100;
            let discountValueNUmber = DiscountV.toFixed(2);
            this.discountValue = Number(discountValueNUmber);
            let discountfV = Number(this.planDataForm.value.offerPrice) - this.discountValue;
            this.planDataForm.patchValue({
              discountPrice: discountfV.toFixed(2)
            });
          }
        });
      }
    });
  }

  getPlanListByGroupIdSubisu() {
    this.planTotalOffetPrice = 0;
    this.planListSubisu = [];
    this.plansArray.reset();
    this.plansArray = this.fb.array([]);

    const url = `/plansByPlanGroupId?planGroupId=` + this.planGroupSelectedSubisu;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.planListSubisu = response.planList;
        this.planListSubisu.forEach((element, i) => {
          let newAmount =
            element.newOfferPrice != null ? element.newOfferPrice : element.offerprice;

          this.plansArray.push(
            this.fb.group({
              planId: element.id,
              name: element.displayName,
              service: element.serviceId,
              validity: element.validity,
              discount: element.discount,
              billTo: "ORGANIZATION",
              offerPrice: element.offerprice,
              newAmount: element.newOfferPrice != null ? element.newOfferPrice : element.offerprice,
              chargeName: element.chargeList[0].charge.name,
              isInvoiceToOrg: this.customerGroupForm.value.isInvoiceToOrg
            })
          );

          this.planTotalOffetPrice = this.planTotalOffetPrice + Number(newAmount);
        });

        // console.log(this.planListSubisu);

        this.planDataForm.patchValue({
          offerPrice: this.planTotalOffetPrice
        });
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  checkIfDiscountPlanGroup(plangroupid:any) {
    if (plangroupid !== null && plangroupid !== undefined && plangroupid !== "") {
      // console.log(
      //   plangroupid,
      //   this.filterNormalPlanGroup.find(planGroup => planGroup.planGroupId === plangroupid)
      // );
      return !this.filterNormalPlanGroup.find(planGroup => planGroup.planGroupId === plangroupid)
        .allowDiscount;
    } else {
      return false;
    }
  }

  serviceBasePlanDATA(event:any) {
    let planserviceData;
    let planServiceID = "";
    const serviceId = event.value;
    const servicename = this.serviceData.find((item:any) => item.id == serviceId).name;
    this.planGroupForm.patchValue({ service: servicename });
    this.planGroupForm.controls['istrialplan'].reset();
    this.changeTrialCheck();
    const planserviceurl = "/planservice/all";
    this.customerManagementService.getMethod(planserviceurl).subscribe((response: any) => {
      //
      console.log("serviceList :::::::: ", response.serviceList);

      planserviceData = response.serviceList.filter((service:any) => service.id === serviceId);
      // console.log("planserviceData", planserviceData);
      this.isSerialNumberShow = planserviceData[0].serviceParamMappingList.some(
        (item:any) => item.serviceParamName !== null && item.serviceParamName === "Product Required"
      );
      // console.log("isNull ::::: ", this.isSerialNumberShow);
      if (planserviceData.length > 0) {
        planServiceID = planserviceData[0].id;

        // if (this.customerGroupForm.value.custtype) {
        this.plantypaSelectData = this.filterPlanData.filter(
          (id:any) =>
            id.serviceId === planServiceID &&
            (id.planGroup === "Registration" || id.planGroup === "Registration and Renewal")
        );
        //console.log("this.plantypaSelectData", this.plantypaSelectData);
        if (this.plantypaSelectData.length === 0) {
          this.messageService.add({
            severity: "info",
            summary: "Note ",
            detail: "Plan not available for this customer type and service ",
            icon: "far fa-times-circle"
          });
        }

        // }
        // else {
        //   this.messageService.add({
        //     severity: 'info',
        //     summary: 'Required ',
        //     detail: 'Customer Type Field Required',
        //     icon: 'far fa-times-circle',
        //   });
        // }
      }
    });
  }
  changeTrialCheck() {
    if (
      this.payMappingListFromArray.value != null &&
      this.payMappingListFromArray.value.length > 0 &&
      this.planGroupForm.value.service != null &&
      this.planGroupForm.value.service != ""
    ) {
      var isCheckingDone = false;
      this.payMappingListFromArray.value.forEach((element:any) => {
        if (!isCheckingDone) {
          if (element.service == this.planGroupForm.value.service && element.istrialplan) {
            this.isTrialCheckDisable = true;
            isCheckingDone = true;
          } else this.isTrialCheckDisable = false;
        }
      });
    } else {
      this.isTrialCheckDisable = false;
    }

    return false;
  }

  getPlanValidity(event:any) {
    const planId = event.value;
    this.checkIfDiscount(planId);
    const url = "/postpaidplan/" + planId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        const planDetailData = response.postPaidPlan;
        if (response.postPaidPlan.allowdiscount == true) {
          this.planGroupForm.patchValue({ discount: null });
          this.ifcustomerDiscountField = true;
        } else {
          this.planGroupForm.patchValue({ discount: null });
          this.ifcustomerDiscountField = false;
        }
        // console.log("this.planDetailData", planDetailData);
        this.planGroupForm.patchValue({
          validity: Number(planDetailData.validity),
          offerprice: Number(planDetailData.offerprice)
        });
        this.validityUnitFormGroup.patchValue({
          validityUnit: planDetailData.unitsOfValidity
        });
        if (planDetailData.category == "Business Promotion") {
          this.ifplanisSubisuSelect = true;
          // this.payMappingListFromArray.controls = [];
          this.customerGroupForm.patchValue({
            billTo: "ORGANIZATION",
            isInvoiceToOrg: planDetailData.invoiceToOrg
          });
          this.planGroupForm.patchValue({
            newAmount: Number(planDetailData.newOfferPrice)
          });
        } else if (
          this.customerGroupForm.value.billTo == "ORGANIZATION" &&
          planDetailData.category == "Normal" &&
          this.ifplanisSubisuSelect == false
        ) {
          // this.payMappingListFromArray.controls = [];
          this.ifplanisSubisuSelect = false;
          this.customerGroupForm.patchValue({
            billTo: "ORGANIZATION"
          });
          this.planGroupForm.patchValue({
            newAmount: Number(planDetailData.offerprice)
          });
        } else {
          this.ifplanisSubisuSelect = false;
          // this.payMappingListFromArray.controls = [];
          this.customerGroupForm.patchValue({
            billTo: "CUSTOMER"
          });
        }
        this.discountValue = planDetailData.offerprice;

        this.planGroupForm.controls['validity'].disable();
      },
      (error: any) => {
        console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  checkIfDiscount(planId:any) {
    let data: any;
    if (planId !== null && planId !== undefined && planId !== "") {
      // return !this.plantypaSelectData.find(plan => plan.id === planId).allowdiscount;

      data = this.plantypaSelectData.find((plan:any) => plan.id === planId);

      if (data.allowdiscount) {
        this.ifdiscounAllow = false;
      } else {
        this.ifdiscounAllow = true;
      }
    } else {
      this.ifdiscounAllow = false;
    }
  }

  onAddplanMappingList() {
    this.plansubmitted = true;
    let offerP = 0;
    let disValue = 0;
    if (this.planGroupForm.valid) {
      this.discountValueStore.push({ value: this.discountValue });
      if (this.discountValue == 0) {
        disValue =
          Number(this.planGroupForm.value.offerprice) +
          Number(this.planDataForm.value.discountPrice);
      } else {
        disValue = Number(this.discountValue) + Number(this.planDataForm.value.discountPrice);
      }
      this.planDataForm.patchValue({
        discountPrice: disValue.toFixed(2)
      });
      this.serialNumber = this.planGroupForm.value.serialNumber;
      this.planTotalOffetPrice =
        this.planTotalOffetPrice + Number(this.planGroupForm.value.offerprice);

      this.planDataForm.patchValue({
        offerPrice: this.planTotalOffetPrice
      });

      if (this.planGroupForm.value.planId) {
        this.getChargeUsePlanList(this.planGroupForm.value.planId);
      }
      this.payMappingListFromArray.push(this.planMappingListFormGroup());
      this.validityUnitFormArray.push(this.validityUnitListFormGroup());
      this.validityUnitFormGroup.reset();

      this.planGroupForm.reset();
      this.planGroupForm.controls['validity'].enable();
      this.plansubmitted = false;
      this.discountType = "One-time";
      this.discountValue = 0;
      if (this.customerGroupForm.value.parentExperience == "Single")
        this.planGroupForm.patchValue({ invoiceType: "Group" });
      else this.planGroupForm.patchValue({ invoiceType: "" });
    } else {
      // console.log("I am not valid");
    }
  }

  validityUnitListFormGroup(): FormGroup {
    return this.fb.group({
      validityUnit: [this.validityUnitFormGroup.value.validityUnit]
    });
  }

  getChargeUsePlanList(id:any) {
    const url = "/postpaidplan/" + id;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      const data = response.postPaidPlan;
      this.planDropdownInChageData.push(data);
    });
  }

  planMappingListFormGroup(): FormGroup {
    for (const prop in this.planGroupForm.controls) {
      this.planGroupForm.value[prop] = this.planGroupForm.controls[prop].value;
    }

    return this.fb.group({
      planId: [this.planGroupForm.value.planId, Validators.required],
      service: [this.planGroupForm.value.service, Validators.required],
      validity: [this.planGroupForm.value.validity, Validators.required],
      serviceId: [
        this.serviceData
          .filter((data:any) => this.planGroupForm.value.service.includes(data.name))
          .map((data:any) => data.id)[0],
        Validators.required
      ],

      discount: [this.planGroupForm.value.discount ? this.planGroupForm.value.discount : 0],
      billTo: [this.customerGroupForm.value.billTo],
      billableCustomerId: [this.customerGroupForm.value.billableCustomerId],
      newAmount: [this.planGroupForm.value.newAmount],
      invoiceType: [this.planGroupForm.value.invoiceType],
      offerPrice: [this.planGroupForm.value.offerprice],
      isInvoiceToOrg: [this.customerGroupForm.value.isInvoiceToOrg],
      istrialplan: [this.planGroupForm.value.istrialplan],
      discountType: [this.planGroupForm.value.discountType],
      serialNumber: [this.planGroupForm.value.serialNumber],
      discountExpiryDate: [
        this.planGroupForm.value.discountExpiryDate
          ? (this.planGroupForm.value.discountExpiryDate).utc(true).toDate()
          : null
      ]
      // id:[]
    });
  }

  discountChange(e:any, index:any) {
    let lastvalue: any = 0;

    this.customerManagementService
      .getofferPriceWithTax(
        this.payMappingListFromArray.value[index].planId,
        this.payMappingListFromArray.value[index].discount,
        this.payMappingListFromArray.value[index].planGroupId
      )
      .subscribe((response: any) => {
        if (response.result.finalAmount) {
          lastvalue = response.result.finalAmount.toFixed(3);
        } else {
          lastvalue = 0;
        }
        this.planDataForm.patchValue({
          discountPrice: Number(
            this.planDataForm.value.discountPrice - this.discountValueStore[index].value + lastvalue
          ).toFixed(2)
        });

        this.discountValueStore[index].value = lastvalue;
      });
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
            case "Plan":
              if (this.ifplanisSubisuSelect == true) {
                this.ifplanisSubisuSelect = false;
                this.customerGroupForm.patchValue({
                  billTo: "CUSTOMER",
                  parentExperience: "Actual"
                });
              }

              this.onRemovePayMapping(chargeFieldIndex);
              break;
            // case "Charge":
            //   this.onRemoveChargelist(chargeFieldIndex);
            //   break;
            // case "MAC":
            //   this.onRemoveMACaddress(chargeFieldIndex);
            //   break;
            // case 'uploadDocument':
            //   this.onRemoveUploadDocument(chargeFieldIndex);
            //   break;
          }
        },
        reject: () => {
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected"
          });
        }
      });
    }
  }

  async onRemovePayMapping(chargeFieldIndex: number) {
    this.planTotalOffetPrice =
      this.planTotalOffetPrice -
      Number(this.payMappingListFromArray.value[chargeFieldIndex].offerPrice);

    this.planDataForm.patchValue({
      offerPrice: this.planTotalOffetPrice,
      discountPrice: Number(
        this.planDataForm.value.discountPrice - this.discountValueStore[chargeFieldIndex].value
      ).toFixed(2)
    });

    this.payMappingListFromArray.removeAt(chargeFieldIndex);

    this.discountValueStore.splice(chargeFieldIndex, 1);
    if (this.payMappingListFromArray.value.length == 0) {
      this.discountValueStore = [];
      this.planTotalOffetPrice = 0;
      this.planDataForm.patchValue({
        discountPrice: 0,
        offerPrice: 0
      });
    }
    this.changeTrialCheck();
  }

  pageChangedpayMapping(pageNumber:any) {
    this.currentPagePayMapping = pageNumber;
  }

  modalOpenParentCustomer(type:any) {
    this.parentCustomerDialogType = type;
    this.showParentCustomerModel = true;
    this.customerSelectType = "Billable To";
    if (type === "parent") {
      this.customerSelectType = "Parent";
    }
    this.selectedParentCust = [];
  }

  closeParentCust() {
    this.showParentCustomerModel = false;
  }

  openSearchModel() {
    this.ifsearchLocationModal = true;
    this.currentPagesearchLocationList = 1;
  }

  checkUsernme(customerId:any) {
    this.submitted = true;
    if (this.customerGroupForm.valid) {
      const url =
        "/custUsernameIsAlreadyExists?userName=" + this.customerGroupForm.controls['username'].value;
      this.customerManagementService.getMethodForRadius(url).subscribe((response: any) => {
        if (response.isAlreadyExists == true) {
          this.messageService.add({
            severity: "error",
            summary: "Error ",
            detail: "Username not available. Please Change Username",
            icon: "far fa-times-circle"
          });
        } else {
          this.addEditcustomer(customerId);
        }
      });
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Required ",
        detail: "Fields are Mandatory or Invalid. Please fill or update those field.",
        icon: "far fa-times-circle"
      });
      this.scrollToError();
    }
  }

  scrollToError(): void {
    const firstElementWithError = document.querySelector(".ng-invalid[formControlName]");
    this.scrollTo(firstElementWithError);
  }

  scrollTo(el: Element): void {
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  addEditcustomer(customerId:any) {
    this.submitted = true;
    let x = 0;
    let a = 0;
    let b = 0;
    let c = 0;
    let addressListData: any = [];
    console.log("this.customerGroupForm :::::: ", this.customerGroupForm);
    console.log("this.presentGroupForm :::::: ", this.presentGroupForm);

    if (this.customerGroupForm.valid) {
      if (customerId) {
        const url = "/updateCustomers/" + customerId + "?mvnoId=" + this.mvnoId;
        if (this.customerGroupForm.value.expiryDate != null) {
          this.customerGroupForm.controls['eDate'].setValue(this.customerGroupForm.value.expiryDate);
        }

        if (
          this.customerGroupForm.value.countryCode == "" ||
          this.customerGroupForm.value.countryCode == null
        ) {
          this.customerGroupForm.value.countryCode = this.commondropdownService.commonCountryCode;
        }
        this.createcustomerData = this.customerGroupForm.value;

        this.createcustomerData.failcount = Number(this.createcustomerData.failcount);
        if (
          this.customerGroupForm.controls['partnerid'].value == null ||
          this.customerGroupForm.controls['partnerid'].value == ""
        ) {
          this.createcustomerData.partnerid = 1;
        } else {
          this.createcustomerData.partnerid =
            this.partnerId !== 1 ? this.partnerId : this.customerGroupForm.controls['partnerid'].value;
        }
        this.customerManagementService.updateRadiusMethod(url, this.createcustomerData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.iscustomerEdit = false;
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            this.deactivateService.setShouldCheckCanExit(false);

            this.router.navigate(["/home/radiuscustomer/"]);
            // this.customerID = "";
            // this.payMappingListFromArray.controls = [];
            // this.overChargeListFromArray.controls = [];
            // this.custMacMapppingListFromArray.controls = [];
            // //   this.uploadDocumentListFromArray.controls = [];

            // this.customerFormReset();
            // this.customerGroupForm.controls.parentExperience.disable();
            // //  this.uploadDocumentGroupForm.reset();
            // this.viewcustomerListData = [];
            // this.planCategoryForm.reset();
            // this.addressListData = [];

            // this.listView = true;
            // this.createView = false;
            // this.selectAreaList = false;
            // this.selectchargeValueShow = false;
            // this.ifIndividualPlan = false;
            // this.ifPlanGroup = false;
            // //    this.listSearchView = false;
            // if (this.searchkey) {
            //   this.searchcustomer();
            // } else {
            //   this.getcustomerList("");
            // }
          },
          (error: any) => {
            // console.log(error, "error")

            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.ERROR,
              icon: "far fa-times-circle"
            });
          }
        );
      } else {
        if (this.customerGroupForm.valid) {
          if (
            this.customerGroupForm.value.countryCode == "" ||
            this.customerGroupForm.value.countryCode == null
          ) {
            this.customerGroupForm.value.countryCode = this.commondropdownService.commonCountryCode;
          }
          const url = "/addNewCustomer";

          this.createcustomerData = this.customerGroupForm.value;
          this.createcustomerData.birthDate = new Date(this.customerGroupForm.value.birthDate);

          //   this.createcustomerData.addressList = addressListData;

          this.createcustomerData.failcount = Number(this.createcustomerData.failcount);
          if (
            this.customerGroupForm.controls['partner'].value == null ||
            this.customerGroupForm.controls['partner'].value == ""
          ) {
            this.createcustomerData.partnerid = 1;
          } else {
            this.createcustomerData.partnerid =
              this.partnerId !== 1 ? this.partnerId : this.customerGroupForm.controls['partner'].value;
          }

          this.createcustomerData.custtype = "Prepaid";
          this.customerManagementService.postMethodRadius(url, this.createcustomerData).subscribe(
            (response: any) => {
              if (response.responseCode == 406) {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: response.responseMessage,
                  icon: "far fa-times-circle"
                });
              } else {
                this.deactivateService.setShouldCheckCanExit(false);
                this.submitted = false;
                this.router.navigate(["/home/radiuscustomer/"]);
              }
            },
            (error: any) => {
              // console.log(error, "error")

              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.error.ERROR,
                icon: "far fa-times-circle"
              });
            }
          );
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Required ",
            detail: "Minimum one Plan Details need to add",
            icon: "far fa-times-circle"
          });
        }
      }
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Required ",
        detail: "Fields are Mandatory or Invalid. Please fill or update those field.",
        icon: "far fa-times-circle"
      });
      this.scrollToError();
    }
  }

  setDefualtServiceArea() {
    this.serviceAreaList = this.commondropdownService.serviceAreaList;
    const anyMatch = this.serviceAreaList.some((obj:any) => this.anyMatchString(obj, "Default"));
    if (anyMatch === true) {
      this.serviceAreaList.filter((el: any) => {
        if (el.name === "Default") {
          this.pincodeDD = [];
          const serviceAreaId = el.id;
          console.log("serviceAreaId", serviceAreaId);
          if (serviceAreaId) {
            const url = "/serviceArea/" + serviceAreaId;
            this.KeyannaCommonBaseService.get(url).subscribe(
              (response: any) => {
                this.serviceareaCheck = false;
                this.serviceAreaData = response.data;
                this.serviceAreaData.pincodes.forEach((element:any) => {
                  this.commondropdownService.allpincodeNumber.forEach((e:any) => {
                    if (e.pincodeid == element) {
                      this.pincodeDD.push(e);
                      console.log("this.pincodeDD ::::", this.pincodeDD);
                    }
                  });
                });

                this.getPlanbyServiceArea(serviceAreaId);
              },
              (error: any) => {}
            );
            this.getServiceByServiceAreaID(serviceAreaId);
            let data = [];
            data.push(serviceAreaId);
            let url3 = "/branchManagement/getAllBranchesByServiceAreaId";
            this.KeyannaCommonBaseService.postMethod(url3, data).subscribe((response: any) => {
              console.log("Branch DATA ::::", response.dataList);
              this.branchData = response.dataList;
              console.log("this.branchData[0] ::::", this.branchData[0]);
              this.customerGroupForm.patchValue({
                branch: this.branchData[0].id
              });
            });
            // this.shiftLocationDTO.shiftPartnerid = "";
          }
          this.isBranchAvailable = true;
          this.customerGroupForm.patchValue({
            serviceareaid: el.id
          });
          this.presentGroupForm.controls['landmark'].setValue(el.name);

          const url = "/area/pincode?pincodeId=" + el.pincodes[el.pincodes.length - 1];
          this.KeyannaCommonBaseService.get(url).subscribe(
            (response: any) => {
              console.log("Area DATA ::::", response.areaList);
              this.areaListDD = response.areaList;
              console.log("this.areaListDD", this.areaListDD);

              setTimeout(() => {
                this.presentGroupForm.patchValue({
                  addressType: "Present",
                  pincodeId: Number(el.pincodes[el.pincodes.length - 1]),
                  cityId: Number(this.areaListDD[0].cityId),
                  stateId: Number(this.areaListDD[0].stateId),
                  countryId: Number(this.areaListDD[0].countryId)
                });
              }, 500);
              const url4 = "/pincode/" + this.areaListDD[0].id;

              setTimeout(() => {
                this.KeyannaCommonBaseService.get(url4).subscribe((response: any) => {
                  this.presentGroupForm.patchValue({
                    areaId: this.areaListDD[0].id
                  });
                });
              }, 500);
            },
            (error: any) => {
              console.log(error);
            }
          );
        }
      });
    }
  }

  setDeafaultValueOnEdit(custId: any) {
    console.log(":::::::::: this.partnerListByServiceArea::: ", this.partnerListByServiceArea);
    this.customerGroupForm.patchValue({
      parent: this.partnerListByServiceArea[0].id
    });
  }

  anyMatchString(servicearea: any, string: any) {
    const serviceareanameLower = servicearea.name.toLowerCase();
    const searchStringLower = string.toLowerCase();
    return serviceareanameLower.includes(searchStringLower);
  }
}
