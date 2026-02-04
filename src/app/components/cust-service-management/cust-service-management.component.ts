import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { PlanManagementService } from "src/app/service/plan-management.service";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { BehaviorSubject } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { WorkflowAuditDetailsModalComponent } from "src/app/components/workflow-audit-details-modal/workflow-audit-details-modal.component";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";
import { PincodeManagementService } from "src/app/service/pincode-management.service";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { LoginService } from "src/app/service/login.service";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
// import { eventNames } from "process";
// import { AnyRecord } from "dns";

declare var $: any;

@Component({
    selector: "app-cust-service-management",
    templateUrl: "./cust-service-management.component.html",
    styleUrls: ["./cust-service-management.component.css"],
    standalone: false
})
export class CustServiceManagementComponent implements OnInit {
  @ViewChild(WorkflowAuditDetailsModalComponent)
  custauditWorkflowModal: WorkflowAuditDetailsModalComponent;

  @Input() custData: any;
  @Input() isLeadMaster: boolean = false;
  @Input() isThroughLead: boolean = true;
  @Input() ifcustCaf: boolean = false;
  @Output() custPlanMappping = new EventEmitter();
  @Output() backButton = new EventEmitter();
  auditcustid = new BehaviorSubject({
    auditcustid: "",
    checkHierachy: "",
    planId: "",
  });
  custCurrentPlanList: {
[x: string]: any;
nextTeamHierarchyMappingId: any;
nextStaff: any;
nickname: any;
custPlanMapppingId: any;
serviceResumeRemarks: any;
serviceHoldRemarks: any;
serviceHoldBy: any;
custServMappingStatus: any;
serviceResumeDate: any;
serviceEndDate: any;
planName: any;
service: any;
invoiceType: any;
    stopServiceDate: any;
    planId(planId: any): unknown; custPlanStatus: string 
}[] = [];
  serviceForm: FormGroup;
  planGroupForm: FormGroup;
  servicePlanFormArray: FormArray;
  planDetailsCategory = [
    { label: "Individual", value: "individual" },
    { label: "Plan Group", value: "groupPlan" },
  ];
  isInvoiceData = [
    { label: "YES", value: true },
    { label: "NO", value: false },
  ];
  chargeType = [{ label: "One-time" }, { label: "Recurring" }];
  filterPlanData: any = [];
  planByServiceArea: any = [];
  plantypaSelectData: any = [];
  servicePlanItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  servicePlantotalRecords: any;
  currentPageServicePlan = 1;
  submitted: boolean = false;
  plansubmitted: boolean = false;
  isPlanCategoryGroup: boolean = false;
  addServicePlanData: any = [];
  planGroup: any = [];
  customercurrenrCustListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customercurrenrCustListdatatotalRecords: String;
  currentPagecustomercurrenrCustListdata = 1;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  pausePlatbtnCondition = "";
  selectDeactivateReason: string = "";
  deactiveDataList: any = [];
  ifselecResonType: any;
  servicePerticularData: any = [];
  iscustomerEdit = false;
  ifcustomerDiscountField: boolean = false;
  ifModelIsShow: boolean = false;
  selectedParentCust: any = [];
  isServiceThroughLead: boolean = false;
  billableCusList: any;
  newFirst = 0;
  currentPageParentCustomerListdata = 1;
  parentCustomerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  prepaidParentCustomerList: any;
  parentCustomerListdatatotalRecords: any;
  parentFieldEnable = false;
  searchParentCustValue = "";
  searchParentCustOption = "";
  dateTime = new Date();
  discountType: any = "One-time";
  serviceStropRemarks: string = "";
  invoiceTypes = [
    { label: "Group", value: "Group" },
    { label: "Independent", value: "Independent" },
  ];
  nextApproverId: any;
  rejectPlanSubmitted: boolean = false;
  assignedPlanid: any;
  assignPlansubmitted: boolean = false;
  assignPlanForm: FormGroup;
  rejectPlanForm: FormGroup;
  staffUserId: any;
  loggedInUser: any;

  searchkey: string;
  searchKeyType: any;
  customerServiceMappingId: any;

  // assignPLANForm: FormGroup;
  rejectCustomerCAFForm: FormGroup;

  setplanMode = "";
  setplanGroupType = "";
  setplanCategory = "";
  serviceStartPuase: boolean = false;

  data: any = [];
  failcount: any;
  custtype: any;
  countryCode: any;
  cafno: any;
  calendarType: any;
  partnerid: any;
  serviceareaid: any;
  status: any;
  billTo: any;
  billableCustomerId: any;
  isInvoiceToOrg: any;
  planMappingList: any = [];
  addressList: any = [];
  paymentDetails: any;
  dunningCategory: any;
  assignPlanID: any;
  approvableStaff: any = [];

  selectStaff: any;
  selectStaffReject: any;
  approvePlanData:[] = [];
  approved = false;
  rejectPlanData:[] = [];
  reject = false;
  serviceAreaBYserviceList:[] = [];
  planList:[] = [];
  showPlanConnectionNo: boolean = false;
  planForConnection:any;
  custCurrentPlanListLength: number;
  displaySelectParentCustomer: boolean = false;

  addServiceAccess: boolean = false;
searchOptionSelect: any[];
remark: any;
  constructor(
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private customerManagementService: CustomermanagementService,
    public confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private planManagementService: PlanManagementService,
    public PaymentamountService: PaymentamountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public KeyannaCommonBaseService: KeyannaCommonBaseService,
    public loginService: LoginService
  ) {
    this.commondropdownService.findAllplanGroups();
  }

  getControl(row: AbstractControl, controlName: string): FormControl {
    if (row instanceof FormGroup) {
      const ctrl = row.get(controlName);
      if (ctrl instanceof FormControl) {
        return ctrl;
      }
    }
    return new FormControl('');
  }

  ngOnInit(): void {
    console.log("custData", this.custData);
    this.addServiceAccess = this.loginService.hasPermission(
      this.custData.custtype == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_SERVICE_CREATE
        : POST_CUST_CONSTANTS.POST_CUST_CAF_SERVICE_CREATE
    );
    this.serviceForm = this.fb.group({
      parentCustomerId: [""],
      planCategory: [""],
      billTo: [""],
      billableCustomerId: [""],
      isInvoiceToOrg: [false],
      discount: ["", [Validators.max(99)]],
      plangroupid: [""],
      istrialplan: [""],
    });

    this.planGroupForm = this.fb.group({
      discount: ["", [Validators.max(99)]],
      planId: ["", Validators.required],
      service: ["", Validators.required],
      validity: ["", Validators.required],
      offerprice: [""],
      validityUnit: [""],
      newAmount: [""],
      istrialplan: [""],
      discountType: [""],
      discountExpiryDate: [""],
      invoiceType: [""],
    });

    this.assignPlanForm = this.fb.group({
      remark: ["", Validators.required],
    });

    this.rejectPlanForm = this.fb.group({
      remark: ["", Validators.required],
    });

    this.servicePlanFormArray = this.fb.array([]);
    this.commondropdownService.getBillToData();
    this.commondropdownService.getplanservice();
    this.commondropdownService.planCreationType();
    console.log(this.custData.status);
    if (this.custData.custtype == "Prepaid") {
      this.planGroup = this.commondropdownService.PrepaidPlanGroupDetails.filter(
        (planGroup:any) => planGroup.servicearea.id == this.custData.serviceareaid
      );
    } else {
      this.planGroup = this.commondropdownService.postPlanGroupDetails.filter(
        (planGroup:any) => planGroup.servicearea.id == this.custData.serviceareaid
      );
    }

    this.getDectivateData();
    this.getLoggedinUserData();
    this.getActivePlanDetails();
    this.getServiceByServiceAreaID(this.custData.serviceareaid);
    this.getPlanbyServiceArea(this.custData.serviceareaid);
  }

  getLoggedinUserData() {
    let staffId = localStorage.getItem("userId");
    this.staffUserId = localStorage.getItem("userId");
    console.log("staffUserId ", this.staffUserId);
    this.loggedInUser = localStorage.getItem("loggedInUser");
    console.log("loggedInUser ", this.loggedInUser);
  }

  openAddServiceModal() {
    if (!this.isLeadMaster && this.isThroughLead) {
      this.confirmationService.confirm({
        header: "Alert",
        message:
          "You need to create lead first in order to add service. Do you want to create lead? (Yes/No)",
        icon: "pi pi-info-circle",
        accept: () => {
          if (this.commondropdownService.isPlanOnDemand) {
            this.router.navigate(["/home/enterprise-lead"], {
              queryParams: { id: this.custData.id },
            });
          } else {
            this.router.navigate(["/home/lead-management"], {
              queryParams: { id: this.custData.id },
            });
          }
        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.planGroupForm.reset();
      this.serviceForm.reset();
      this.servicePlanFormArray = this.fb.array([]);
      this.filterPlanData = [];
      var planCategory = "";
      if (this.custData.plangroupid) {
        this.isPlanCategoryGroup = false;
        planCategory = "groupPlan";
        // this.serviceForm.controls.plangroupid.patchValue(this.custData.plangroupid);
        // this.serviceForm.controls.discount.patchValue(this.custData.planMappingList[0].discount);
        // this.serviceForm.controls.isInvoiceToOrg.patchValue(
        //   this.custData.planMappingList[0].isInvoiceToOrg
        // );
      } else {
        this.isPlanCategoryGroup = false;
        planCategory = "individual";
        this.serviceForm.controls['plangroupid'].disable();
        this.serviceForm.controls['discount'].disable();
        this.serviceForm.controls['isInvoiceToOrg'].disable();
      }
      console.log("this.custData :::::::: parentCustomerId ", this.custData);

      if (this.custData.planMappingList.length > 0) {
        this.serviceForm.patchValue({
          parentCustomerId: this.custData.parentCustomerId,
          planCategory: planCategory,
          billTo:
            this.custData.planMappingList.length > 0 ? this.custData.planMappingList[0].billTo : "",
          billableCustomerId:
            this.custData.planMappingList.length > 0
              ? this.custData.planMappingList[0].billableCustomerId
              : "",
          isInvoiceToOrg:
            this.custData.planMappingList.length > 0
              ? this.custData.planMappingList[0].isInvoiceToOrg
              : "",
        });
      }

      $("#addServiceModal").modal("show");
    }
  }

  getServiceByServiceAreaID(ids:any) {
    let data = [];
    data.push(ids);
    let url = "/serviceArea/getAllServicesByServiceAreaId";
    this.customerManagementService.postMethod(url, data).subscribe((response: any) => {
      console.log("service Data", response.dataList);
      this.serviceAreaBYserviceList = response.dataList;
      if (response.dataList.size > 0) {
        console.log("service Data", response.dataList);
      }
    });
  }

  createServiceFormGroup(): FormGroup {
    return this.fb.group({
      discount: [this.planGroupForm.value.discount, [Validators.max(99)]],
      planId: [this.planGroupForm.value.planId, Validators.required],
      service: [this.planGroupForm.value.service, Validators.required],
      validity: [this.planGroupForm.value.validity, Validators.required],
      offerprice: [this.planGroupForm.value.offerprice],
      validityUnit: [this.planGroupForm.value.validityUnit],
      istrialplan: [this.planGroupForm.value.istrialplan],
      discountType: [this.planGroupForm.value.discountType],
      discountExpiryDate: [this.planGroupForm.value.discountExpiryDate],
      invoiceType: [this.planGroupForm.value.invoiceType],
    });
  }

  planValidity = "";
  planunitValidity = "";
  onAddPlanServiceField() {
    this.plansubmitted = true;
    if (this.planGroupForm.valid) {
      this.servicePlanFormArray.push(this.createServiceFormGroup());
      this.planGroupForm.reset();
      this.plansubmitted = false;
      this.discountType = "One-time";
    }
    console.log(this.servicePlanFormArray.value);
  }

  getPlanbyServiceArea(serviceAreaId:any) {
    if (serviceAreaId) {
      this.filterPlanData = [];
      const url = "/plans/serviceArea?planmode=ALL&serviceAreaId=" + serviceAreaId;
      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.planByServiceArea = response.postpaidplanList;
          this.filterPlanData = this.planByServiceArea.filter(
            (plan:any) => plan.plantype == this.custData.custtype
          );
          console.log("this.filterPlanData", this.filterPlanData);
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
  }

  serviceBasePlanDATA(event:any) {
    console.log("******");

    let planserviceData;
    let planServiceID = "";
    let planType = "";
    const servicename = event.value;
    const planserviceurl = "/planservice/all";
    this.customerManagementService.getMethod(planserviceurl).subscribe((response: any) => {
      //
      planserviceData = response.serviceList.filter((service:any) => service.name === servicename);
      if (planserviceData.length > 0) {
        planServiceID = planserviceData[0].id;
        planType = this.custData.custtype;
        console.log("this.custData.custtype", this.custData.custtype);

        this.plantypaSelectData = [];
        this.postpaidplanByService(planServiceID, planType);
        // const planserviceurl = "/plansByTypeServiceModeStatusAndServiceArea";
        // this.customerManagementService
        //   .getPlansByTypeServiceModeStatusAndServiceAreaWithoutService(
        //     planserviceurl,
        //     this.custData.custtype,
        //     planServiceID,
        //     this.custData.serviceareaid,
        //     this.setplanMode,
        //     "Active",
        //     this.setplanGroupType
        //   )
        //   .subscribe((response: any) => {
        //     if (response.status == 200 && response.postPaidPlan.length > 0) {
        //       this.plantypaSelectData = response.postPaidPlan;
        //     } else {
        //       this.plantypaSelectData = [];
        //       this.messageService.add({
        //         severity: "info",
        //         summary: "Note ",
        //         detail: "Plan not available for this Plan type and service ",
        //       });
        //     }
        //   });

        //     // if (this.customerGroupForm.value.custtype) {
        //     console.log("this.filterPlanData", this.filterPlanData);
        //     this.plantypaSelectData = this.filterPlanData.filter(
        //       id =>
        //         id.serviceId === planServiceID &&
        //         (id.planGroup === "Registration" || id.planGroup === "Registration and Renewal")
        //     );
        //     if (this.plantypaSelectData.length === 0) {
        //       this.messageService.add({
        //         severity: "info",
        //         summary: "Note ",
        //         detail:
        //           this.custData.custtype + " Plan not available for this customer type and service ",
        //         icon: "far fa-times-circle",
        //       });
        //     }
        //     // }
        //     // else {
        //     //   this.messageService.add({
        //     //     severity: 'info',
        //     //     summary: 'Required ',
        //     //     detail: 'Customer Type Field Required',
        //     //     icon: 'far fa-times-circle',
        //     //   });
        //     // }
      }
    });
  }

  postpaidplanByService(serviceId:any, planType:any) {
    let url = `/postpaidplanByService/${serviceId}/${planType}`;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.status == 200 && response.postPaidPlan.length > 0) {
          this.plantypaSelectData = response.postPaidPlan;
        } else {
          this.plantypaSelectData = [];
          this.messageService.add({
            severity: "info",
            summary: "Note ",
            detail: "Plan not available for this Plan type and service ",
          });
        }
      },
      error => {
        this.plantypaSelectData = [];
        this.messageService.add({
          severity: "info",
          summary: "Note ",
          detail: "Plan not available for this Plan type and service ",
        });
      }
    );
  }

  pageChangedPlanService(pageNumber:any) {
    this.currentPageServicePlan = pageNumber;
  }

  deleteConfirmonChargeField(planFieldIndex: number) {
    if (planFieldIndex || planFieldIndex === 0) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Plan?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.onRemovePayMapping(planFieldIndex);
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

  async onRemovePayMapping(planFieldIndex: number) {
    this.servicePlanFormArray.removeAt(planFieldIndex);
  }

  getPlanValidity(event:any) {
    const planId = event.value;
    console.log("planId", planId);
    const url = "/postpaidplan/" + planId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        const planDetailData = response.postPaidPlan;
        console.log("this.planDetailData", planDetailData);
        this.planGroupForm.patchValue({
          validity: Number(planDetailData.validity),
          offerprice: Number(planDetailData.offerprice),
          newAmount: Number(planDetailData.offerprice),
          validityUnit: planDetailData.unitsOfValidity,
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
  }

  addPlanService() {
    if (this.serviceForm.valid) {
      this.addServicePlanData = this.custData;
      this.addServicePlanData.planMappingList = [];
      // if (this.serviceForm.controls.planCategory.value == "groupPlan") {
      //   //this.addServicePlanData = this.serviceForm.getRawValue();
      //   this.addServicePlanData.id = this.custData.id;
      //   // this.addServicePlanData.custtype = "Prepaid";
      //   // this.addServicePlanData.serviceareaid = this.custData.serviceareaid;
      //   this.addServicePlanData.planMappingList = [];
      //   console.log("this.addServicePlanData", this.addServicePlanData);
      //   this.planServiceAdd(this.addServicePlanData);
      // } else {
      //this.addServicePlanData = this.serviceForm.getRawValue();
      this.addServicePlanData.id = this.custData.id;
      // this.addServicePlanData.custtype = "Prepaid";
      // this.addServicePlanData.serviceareaid = this.custData.serviceareaid;
      this.addServicePlanData.planMappingList = this.servicePlanFormArray.value;

      this.addServicePlanData.planMappingList.forEach((plan:any) => {
        plan.planCategory = this.serviceForm.controls['planCategory'].value;
        plan.billTo = this.serviceForm.controls['billTo'].value;
        plan.billableCustomerId = this.serviceForm.controls['billableCustomerId'].value;
        plan.newAmount = plan.offerprice;
        plan.isInvoiceToOrg = this.serviceForm.controls['isInvoiceToOrg'].value;
      });

      if (this.addServicePlanData.planMappingList.length <= 0) {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Please add atleast one service and plan",
          icon: "far fa-times-circle",
        });
      } else {
        console.log("this.addServicePlanData", this.addServicePlanData);
        this.planServiceAdd(this.data);
      }
    }
    // }
  }

  planServiceAdd(data:any) {
    let id = this.addServicePlanData.id;
    this.failcount = this.addServicePlanData.failcount;
    this.custtype = this.addServicePlanData.custtype;
    this.countryCode = this.addServicePlanData.countryCode;
    this.cafno = this.addServicePlanData.cafno;
    this.calendarType = this.addServicePlanData.calendarType;
    this.partnerid = this.addServicePlanData.partnerid;
    this.serviceareaid = this.addServicePlanData.serviceareaid;
    this.status = this.addServicePlanData.status;
    this.billTo = this.addServicePlanData.billTo;

    this.billableCustomerId = this.addServicePlanData.billableCustomerId;
    this.isInvoiceToOrg = this.addServicePlanData.isInvoiceToOrg;
    this.planMappingList = this.addServicePlanData.planMappingList;
    this.addressList = this.addServicePlanData.addressList;
    this.paymentDetails = this.addServicePlanData.paymentDetails;
    this.dunningCategory = this.addServicePlanData.dunningCategory;
    this.data = {
      id: id,
      failcount: this.failcount,
      custtype: this.custtype,
      countryCode: this.countryCode,
      cafno: this.cafno,
      calendarType: this.calendarType,
      partnerid: this.partnerid,
      serviceareaid: this.serviceareaid,
      status: this.status,
      billTo: this.billTo,
      billableCustomerId: this.billableCustomerId,
      isInvoiceToOrg: this.isInvoiceToOrg,
      planMappingList: this.planMappingList,
      addressList: this.addressList,
      paymentDetails: this.paymentDetails,
      dunningCategory: this.dunningCategory,
    };
    //console.log("data",this.data)

    let url: any = "";
    if (this.isLeadMaster) {
      url = "/KeyannaSalesCrmsBss/leadMaster/addNewService";
    } else {
      url = "/subscriber/addNewService";
    }
    console.log("data", url);
    this.customerManagementService.postMethod(url, this.data).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        } else {
          this.serviceForm.reset();
          this.planGroupForm.reset();
          this.submitted = false;
          this.plansubmitted = false;
          this.servicePlanFormArray.controls = [];
          $("#addServiceModal").modal("hide");
          this.getActivePlanDetails();

          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle",
          });
        }
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

  getActivePlanDetails() {
    let url: any;

    if (this.ifcustCaf) {
      url =
        "/subscriber/getPlanByCustService/" +
        this.custData.id +
        "?status=NewActivation" +
        "&isNotChangePlan=true";
    } else {
      url =
        "/subscriber/getPlanByCustService/" +
        this.custData.id +
        "?status=Active" +
        "?isAllRequired=true" +
        "&isNotChangePlan=true";
    }
    this.serviceStopBulkFlag = false;
    this.serviceStopId = [];
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        // if (response.responseCode == 200) {
        this.custCurrentPlanList = response.dataList;
        if (this.custCurrentPlanList == null) {
          this.custCurrentPlanList = [];
        }
        // this.custCurrentPlanList = this.custCurrentPlanList.filter(
        //   data => data.custPlanStatus == "Active" || data.custPlanStatus == "ACTIVE"
        // );

        if (this.custCurrentPlanList.length > 0) {
          if (this.custCurrentPlanList && this.custCurrentPlanList.length > 0) {
            this.pausePlatbtnCondition = (this.custCurrentPlanList && this.custCurrentPlanList.length > 0 && this.custCurrentPlanList[0]?.custPlanStatus) 
                ? this.custCurrentPlanList[0].custPlanStatus 
                : '';
          }
          this.SelectplanDataValue(this.custCurrentPlanList[0].planId);
        }
        this.custCurrentPlanList.forEach(e => {
          if (e.custPlanStatus == "ACTIVE") {
            this.serviceStartPuase = true;
          } else {
            if (e.stopServiceDate) this.serviceStartPuase = false;
            else this.serviceStartPuase = true;
          }
        });
        console.log(" this.currenrCustList", this.custCurrentPlanList);

        // } else {
        //
        //   this.messageService.add({
        //     severity: "error",
        //     summary: "Error",
        //     detail: response.responseMessage,
        //     icon: "far fa-times-circle",
        //   });
        // }
      },
      (error: any) => {
        // console.log(error, "error")
        this.custCurrentPlanList = [];
        this.planList = [];
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  SelectplanDataValue(planId:any) {
    const url = "/postpaidplan/" + planId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      let viewPlanListData = response.postPaidPlan;
      this.setplanMode = viewPlanListData.mode;
      this.setplanGroupType = viewPlanListData.planGroup;
      this.setplanCategory = viewPlanListData.category;
      this.planValidity = viewPlanListData.validity;
      this.planunitValidity = viewPlanListData.unitsOfValidity;
    });
  }

  pageChangedcustomercurrenrCustListData(pageNumber:any) {
    this.currentPagecustomercurrenrCustListdata = pageNumber;
    //this.getActivePlanDetails();
  }

  TotalCurrentPlanItemPerPage(event:any) {
    this.customercurrenrCustListdataitemsPerPage = Number(event.value);
    if (this.currentPagecustomercurrenrCustListdata > 1) {
      this.currentPagecustomercurrenrCustListdata = 1;
    }
    // this.getActivePlanDetails();
  }

  closeParentCustt() {
    this.ifModelIsShow = false;
  }

  deleteServicePlanData() {
    let planMapId = this.servicePerticularData.planmapid;
    let custId = this.servicePerticularData.custId;
    let planId = this.servicePerticularData.planId;

    let data1 = {};

    if (!this.serviceStopBulkFlag) {
      const url =
        "/subscriber/deleteService/" +
        planId +
        "?custId=" +
        custId +
        "&planMapId=" +
        planMapId +
        "&reasonId=" +
        this.selectDeactivateReason;
      this.customerManagementService.postMethod(url, data1).subscribe(
        (response: any) => {
          if (response.responseCode == 406) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle",
            });
          } else {
            this.getActivePlanDetails();
            // $("#StopServiceModal").modal("show");
            $("#StopServiceModal").modal("hide");
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle",
            });
          }
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
    } else {
      let data;
      let terminateService: { custPlanMappingId: any }[] = [];
      this.serviceStopId.map(e => {
        return terminateService.push({
          custPlanMappingId: e.planmapid,
        });
      });
      data = {
        customerId: this.serviceStopId[0].custId,
        reason: this.selectDeactivateReason,
        terminateService: terminateService,
      };
      const url = "/subscriber/terminateServiceInBulk";
      this.customerManagementService.postMethod(url, data).subscribe(
        (response: any) => {
          if (response.responseCode == 406) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle",
            });
          } else {
            $("#StopServiceModal").modal("hide");
            this.getActivePlanDetails();
            this.serviceStopBulkFlag = false;
            this.serviceStopId = [];
            this.custPlanMappping.emit();
          }
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
  }

  pauseService() {
    let custId = this.servicePerticularData.custId;
    let data;
    if (!this.serviceStopBulkFlag) {
      data = {
        custId: custId,
        deactivatePlanReqModels: [
          {
            custServiceMappingId: this.servicePerticularData.customerServiceMappingId,
            remarks: this.serviceStropRemarks,
          },
        ],
      };
    } else {
      let deactivatePlanReqModels:any = [];
      this.serviceStopId.map(e => {
        deactivatePlanReqModels.push({
          custServiceMappingId: e.customerServiceMappingId,
          remarks: this.serviceStropRemarks,
        });
      });
      data = {
        custId: this.custData.id,
        deactivatePlanReqModels: deactivatePlanReqModels,
      };
    }
    const url = "/subscriber/holdServiceInBulk";
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        } else {
          $("#StopServiceModal").modal("hide");
          this.serviceStopBulkFlag = false;
          this.serviceStopId = [];
          this.getActivePlanDetails();
          this.custPlanMappping.emit();
        }
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
  playService() {
    let data;
    let custId = this.servicePerticularData.custId;
    if (!this.serviceStopBulkFlag) {
      data = {
        custId: custId,
        deactivatePlanReqModels: [
          {
            custServiceMappingId: this.servicePerticularData.customerServiceMappingId,
            remarks: this.serviceStropRemarks,
          },
        ],
      };
    } else {
      let deactivatePlanReqModels:any = [];
      this.serviceStopId.map(e => {
        deactivatePlanReqModels.push({
          custServiceMappingId: e.customerServiceMappingId,
          remarks: this.serviceStropRemarks,
        });
      });
      data = {
        custId: this.custData.id,
        deactivatePlanReqModels: deactivatePlanReqModels,
      };
    }
    const url = "/subscriber/resumeServiceInBulk";
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        } else {
          $("#StopServiceModal").modal("hide");
          this.getActivePlanDetails();
          this.serviceStopBulkFlag = false;
          this.serviceStopId = [];
          this.custPlanMappping.emit();
        }
      },
      (error: any) => {
        console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
        $("#StopServiceModal").modal("hide");
        this.getActivePlanDetails();
        this.serviceStopBulkFlag = false;
        this.serviceStopId = [];
      }
    );
  }

  saveEditNickName(serviceMappingID:any, nickName:any) {
    let data = {};
    const url = `/subscriber/nickName?custServiceMappingId=${serviceMappingID}&name=${nickName}`;
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        } else {
          this.getActivePlanDetails();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Successfully",
            icon: "far fa-check-circle",
          });
        }
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

  openPaushSearviceMedel(data:any, type:any) {
    if (type === "Delete" && data.isChildExists) {
      this.confirmationService.confirm({
        message: "Child customer service also terminate, Do you want to continue ?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.ifselecResonType = type;
          this.servicePerticularData = data;
          this.selectDeactivateReason = "";
          this.serviceStropRemarks = "";
          $("#StopServiceModal").modal("show");
        },
        reject: () => {
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected",
          });
        },
      });
    } else {
      this.ifselecResonType = type;
      this.servicePerticularData = data;
      this.selectDeactivateReason = "";
      this.serviceStropRemarks = "";
      $("#StopServiceModal").modal("show");
    }
  }

  // openStartSearviceMedel(data, type) {
  //   this.ifselecResonType = type;
  //   this.servicePerticularData = data;
  //   this.selectDeactivateReason = "";
  //   this.serviceStropRemarks ="";
  //   if (type === "Pause") {
  //     $("#StopServiceModal").modal("show");
  //   } else {
  //     this.playService();
  //   }
  // }

  getDectivateData() {
    let url = `/commonList/generic/DEACTIVATE_REASON_EZ_BILL`;
    this.commondropdownService.getMethodWithCache(url).subscribe((response: any) => {
      this.deactiveDataList = response.dataList;
    });
  }

  modalOpenParentCustomer() {
    this.displaySelectParentCustomer = true;
    this.newFirst = 0;
    this.getParentCustomerData();
    this.selectedParentCust = [];
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
        const filterList = list.filter((cust:any) => cust.id !== this.custData.id);

        this.prepaidParentCustomerList = filterList;
        console.log("list", filterList);

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

  selParentSearchOption(event:any) {
    // console.log("value", event.value);
    if (event.value) {
      this.parentFieldEnable = true;
    } else {
      this.parentFieldEnable = false;
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
        const filterList = list.filter((cust:any) => cust.id !== this.custData.id);
        this.prepaidParentCustomerList = filterList;
        console.log("list", filterList);
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

  paginate(event:any) {
    console.log("page event", this.selectedParentCust);
    this.currentPageParentCustomerListdata = event.page + 1;
    // this.first = event.first;
    if (this.searchParentCustValue) {
      this.searchParentCustomer();
    } else {
      this.getParentCustomerData();
    }
  }

  async saveSelCustomer() {
    console.log("page event", this.selectedParentCust);
    this.billableCusList = [
      {
        id: this.selectedParentCust.id,
        name: this.selectedParentCust.name,
      },
    ];
    this.serviceForm.patchValue({
      billableCustomerId: this.selectedParentCust.id,
    });

    this.modalCloseParentCustomer();
  }

  modalCloseParentCustomer() {
    this.displaySelectParentCustomer = false;
    this.currentPageParentCustomerListdata = 1;
    this.newFirst = 0;
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
  }

  removeSelParentCust() {
    this.selectedParentCust = [];
    this.billableCusList = [];
    this.serviceForm.patchValue({
      billableCustomerId: null,
    });
  }
  newActivationFlag: boolean = false;
  approvePlanOpen(planId:any, nextApproverId:any, serviceMappingId:any, status:any) {
    if (status === "NewActivation") this.newActivationFlag = true;
    else this.newActivationFlag = false;
    this.approved = false;
    this.selectStaff = null;
    this.approvePlanData = [];
    $("#assignApporvePlanModal").modal("show");
    this.assignPlanID = planId;
    this.nextApproverId = nextApproverId;
    this.customerServiceMappingId = serviceMappingId;
    // this.rejectPlanForm.reset();
    this.rejectPlanSubmitted = false;
  }
  eventName: any = "";
  pickModalOpen(data:any) {
    if (data.custServMappingStatus == "NewActivation") {
      this.eventName = "CUSTOMER_SERVICE_ADD";
    } else {
      this.eventName = "CUSTOMER_SERVICE_TERMINATION";
    }
    let url =
      "/workflow/pickupworkflow?eventName=" +
      this.eventName +
      "&entityId=" +
      data?.customerServiceMappingId;
    this.planManagementService.getMethod(url).subscribe(
      (response: any) => {
        // this.getPostoaidPlan("");
        this.getActivePlanDetails();

        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        }
      },
      (error: any) => {
        // console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }
  rejectPlanOpen(planId: any, nextApproverId: any, mappingId: any, status: any) {
    if (status === "NewActivation") this.newActivationFlag = true;
    else this.newActivationFlag = false;
    this.reject = false;
    this.selectStaff = null;
    this.rejectPlanData = [];
    $("#rejectPlanModal").modal("show");
    this.assignPlanID = planId;
    this.nextApproverId = nextApproverId;
    this.customerServiceMappingId = mappingId;
    this.rejectPlanSubmitted = false;
  }
  

  StaffReasignList(data:any) {
    this.customerServiceMappingId = data.customerServiceMappingId;
    let url = `/teamHierarchy/reassignWorkflowGetStaffList?entityId=${data.customerServiceMappingId}&eventName=CUSTOMER_SERVICE_TERMINATION`;
    this.planManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.assignedPlanid = data.id;
        this.approvableStaff = [];
        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        }
        if (response.dataList != null) {
          this.approvableStaff = response.dataList;
          this.approved = true;
          console.log("this.approved 2", this.approved);
          $("#reAssignPLANModal").modal("show");
        } else {
          $("#reAssignPLANModal").modal("hide");
        }
        console.log(response);
      },
      (error: any) => {
        // console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  reassignWorkflow() {
    let url: any;
    // this.remarks = this.assignPlanForm.controls.remark;
    if (this.customerServiceMappingId != null) {
      url = `/teamHierarchy/reassignWorkflow?entityId=${this.customerServiceMappingId}&eventName=CUSTOMER_SERVICE_TERMINATION&assignToStaffId=${this.selectStaff}&remark=${this.assignPlanForm.value.remark}`;

      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          $("#reAssignPLANModal").modal("hide");
          this.getActivePlanDetails();
          if (response.responseCode == 417) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle",
            });
          } else {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: "Assigned to the next staff successfully.",
              icon: "far fa-times-circle",
            });
          }
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
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please Aprove Before Reassigne",
        icon: "far fa-times-circle",
      });
    }
  }

  assignPlan() {
    console.log("assignPlan ");
    this.assignPlansubmitted = true;
    this.approved = false;
    console.log("this.approved 3", this.approved);
    this.selectStaff = null;
    this.approvePlanData = [];
    if (this.assignPlanForm.valid) {
      let url;
      if (this.newActivationFlag)
        url = `/subscriber/approveCustomerServiceAdd?customerServiceMappingId=${this.customerServiceMappingId}&isApproveRequest=true&remarks=${this.assignPlanForm.controls['remark'].value}`;
      else
        url = `/subscriber/approveCustomerServiceTermination?customerServiceMappingId=${this.customerServiceMappingId}&isApproveRequest=true&remarks=${this.assignPlanForm.controls['remark'].value}`;
      // customerServiceMappingId=11&isApproveRequest=true&remarks=11
      let assignCAFData = {
        planId: this.assignPlanID,
        nextStaffId: "",
        flag: "approved",
        remark: this.assignPlanForm.controls['remark'].value,
        staffId: localStorage.getItem("userId"),
      };
      console.log("assignCAFData ", assignCAFData);

      this.planManagementService.getMethod(url).subscribe(
        (response: any) => {
          // $("#assignApporvePlanModal").modal("hide");
          if (!this.searchkey && !this.searchKeyType) {
            // this.getPostoaidPlan("");
            this.getActivePlanDetails();
          } else {
            // this.searchPlan();
          }
          if (response.responseCode === 417) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle",
            });
          } else {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle",
            });

            this.assignPlanForm.reset();
            this.assignPlansubmitted = false;
            console.log("response.result.dataList ", response.dataList);
            if (response.dataList != null) {
              this.approvePlanData = response.dataList;
              this.approved = true;
            } else {
              $("#assignApporvePlanModal").modal("hide");
            }
            console.log("this.approved 4", this.approved);
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
  }

  rejectPlan() {
    this.rejectPlanSubmitted = true;
    if (this.rejectPlanForm.valid) {
      let assignCAFData = {
        planId: this.assignPlanID,
        nextStaffId: "",
        flag: "Rejected",
        remark: this.rejectPlanForm.controls['remark'].value,
        staffId: localStorage.getItem("userId"),
      };
      let url;
      if (this.newActivationFlag)
        url = `/subscriber/approveCustomerServiceAdd?customerServiceMappingId=${this.customerServiceMappingId}&isApproveRequest=false&remarks=${this.assignPlanForm.controls['remark'].value}`;
      else
        url = `/subscriber/approveCustomerServiceTermination?customerServiceMappingId=${this.customerServiceMappingId}&isApproveRequest=false&remarks=${this.assignPlanForm.controls['remark'].value}`;
      this.planManagementService.getMethod(url).subscribe(
        (response: any) => {
          if (!this.searchkey && !this.searchKeyType) {
            // this.getPostoaidPlan("");
            this.getActivePlanDetails();
          } else {
            // this.searchPlan();
          }
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle",
          });

          this.rejectPlanForm.reset();
          this.rejectPlanSubmitted = false;
          if (response.dataList != null) {
            this.rejectPlanData = response.dataList;
            this.reject = true;
          } else {
            $("#rejectPlanModal").modal("hide");
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
  }

  assignToStaff(flag:any) {
    let url: any;
    let event;
    if (this.newActivationFlag) event = "CUSTOMER_SERVICE_ADD";
    else event = "CUSTOMER_SERVICE_TERMINATION";
    if (flag == true) {
      if (this.selectStaff) {
        url = `/teamHierarchy/assignFromStaffList?entityId=${this.customerServiceMappingId}&eventName=${event}&nextAssignStaff=${this.selectStaff}&isApproveRequest=${flag}`;
      } else {
        url = `/teamHierarchy/assignEveryStaff?entityId=${this.customerServiceMappingId}&eventName=${event}&isApproveRequest=${flag}`;
      }
    } else {
      if (this.selectStaffReject) {
        url = `/teamHierarchy/assignFromStaffList?entityId=${this.customerServiceMappingId}&eventName=${event}&nextAssignStaff=${this.selectStaffReject}&isApproveRequest=${flag}`;
      } else {
        url = `/teamHierarchy/assignEveryStaff?entityId=${this.customerServiceMappingId}&eventName=${event}&isApproveRequest=${flag}`;
      }
    }

    this.planManagementService.getMethod(url).subscribe(
      response => {
        $("#assignApporvePlanModal").modal("hide");
        $("#rejectPlanModal").modal("hide");
        // this.getPostoaidPlan("");
        this.getActivePlanDetails();
        console.log(response);
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

  openAddWorkFlow(id:any, auditcustid:any) {
    this.ifModelIsShow = true;
    console.log("id, auditcustid ", id, auditcustid);
    this.PaymentamountService.show(id);
    this.auditcustid.next({
      auditcustid: auditcustid,
      checkHierachy: "CUSTOMER_SERVICE_ADD",
      planId: "",
    });
  }

  openEditWorkFlow(id:any, auditcustid:any) {
    console.log("id, auditcustid ", id, auditcustid);
    this.PaymentamountService.show(id);
    this.auditcustid.next({
      auditcustid: auditcustid,
      checkHierachy: "CUSTOMER_SERVICE_TERMINATION",
      planId: "",
    });
  }
  auditData: any = [];
  auditItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  currentPageAuditList = 1;
  audittotalRecords: any;

  openAudit(auditcustid:any) {
    $("#auditDetails").modal("show");

    let currentPage;
    // if (pageData) {
    //   currentPage = pageData + 1;
    // } else {
    currentPage = this.currentPageAuditList;
    // }

    const data = {
      page: currentPage,
      pageSize: this.auditItemPerPage,
    };
    const url = "/subscriber/servicestatusAudit/" + auditcustid;
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.auditData = response.data.content;
        this.audittotalRecords = response.data.totalElements;
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

  pageChangedauditList(pageNumber:any) {
    this.currentPageAuditList = pageNumber;
  }

  auditCloseModal() {
    $("#auditDetails").modal("hide");
    this.auditData = [];
  }
  serviceStopBulkFlag: boolean = false;

  serviceStopId: {
    customerServiceMappingId: any;
    planmapid: any;
    custId: any;
    custPlanMapppingId: any; custPlanStatus: string 
}[] = [];

  isServiceResumeValid():any {
    if (this.serviceStopBulkFlag) {
      return this.serviceStopId.some(x => x.custPlanStatus === "Hold");
    }
  }

  seviceStopBulk(data:any, e:any) {
    if (e.checked) {
      this.serviceStopBulkFlag = true;
      this.serviceStopId.push(data);
      if (this.serviceStopId.length > 0) {
        if (
          this.serviceStopId[0].custPlanStatus.toLowerCase() !== data.custPlanStatus.toLowerCase()
        ) {
          this.messageService.add({
            severity: "warn",
            summary: "Diffrent Service Selected",
            detail: "Please select service with same status!",
          });
          this.serviceStopBulkFlag = false;
        }
      }
    } else {
      let requiredIndex;
      this.serviceStopId.forEach((element, i) => {
        if (element.custPlanMapppingId == data.custPlanMapppingId) requiredIndex = i;
      });
      if (typeof requiredIndex !== 'undefined' && requiredIndex >= 0) this.serviceStopId.splice(requiredIndex, 1);
      if (this.serviceStopId.length > 0) {
        let check = [];
        this.serviceStopId.forEach(element => {
          if (this.serviceStopId[0].custPlanStatus != element.custPlanStatus) check.push(element);
        });
        if (check.length == 0) this.serviceStopBulkFlag = true;
      }
      if (this.serviceStopId.length <= 0) this.serviceStopBulkFlag = false;
    }
  }
  serviceStop() {
    this.confirmationService.confirm({
      message: "If Child customer is there child service also Stop, Do you want to continue ?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        let deactivatePlanReqModels: { custServiceMappingId: any; remarks: string; reasonId: string; }[] = [];
        let data: any;
        if (this.serviceStopBulkFlag) {
          this.serviceStopId.map(e => {
            deactivatePlanReqModels.push({
              custServiceMappingId: e.custPlanMapppingId,
              remarks: this.serviceStropRemarks,
              reasonId: this.selectDeactivateReason,
            });
          });
          data = {
            custId: this.serviceStopId[0].custId,
            deactivatePlanReqModels: deactivatePlanReqModels,
          };
        } else {
          deactivatePlanReqModels.push({
            custServiceMappingId: this.servicePerticularData.custPlanMapppingId,
            remarks: this.serviceStropRemarks,
            reasonId: this.selectDeactivateReason,
          });
          data = {
            custId: this.servicePerticularData.custId,
            deactivatePlanReqModels: deactivatePlanReqModels,
          };
        }

        const url = "/subscriber/stopServiceInBulk";
        this.customerManagementService.postMethod(url, data).subscribe(
          (response: any) => {
            if (response.responseCode == 406) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: response.responseMessage,
                icon: "far fa-times-circle",
              });
            } else {
              $("#StopServiceModal").modal("hide");
              this.getActivePlanDetails();
              this.serviceStopBulkFlag = false;
              this.serviceStopId = [];
              this.custPlanMappping.emit();
            }
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
      },
      reject: () => {
        this.messageService.add({
          severity: "info",
          summary: "Rejected",
          detail: "You have rejected",
        });
        this.serviceStopBulkFlag = false;
        this.serviceStopId = [];
        this.selectDeactivateReason = "";
        this.serviceStropRemarks = "";
        $("#StopServiceModal").modal("show");
      },
    });
  }
  chekcPlanGroup(plan:any, planList:any) {
    if (this.custData.plangroupid !== null) {
      let groupPlanList = planList.filter((item:any) => item.plangroupid == plan.plangroupid);
      return groupPlanList[0] === plan;
    }
    return true;
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
  currentDate = new Date();
  serviceTerminationCheck(serviceEndDate:any, custPlanStatus:any) {
    if ((custPlanStatus == "Stop" || custPlanStatus == "STOP") && serviceEndDate) {
      serviceEndDate = new Date(serviceEndDate);
      if (serviceEndDate.getTime() < this.currentDate.getTime()) return false;
    }
    return true;
  }
  badgeTypeForStatus: any;
  displayStatus: any;
  checkStatus(planStatus:any, workflowStatus:any) {
    let status = planStatus.toLowerCase();
    let statusWorkflow = workflowStatus.toLowerCase();

    if (statusWorkflow == "newactivation") {
      if (statusWorkflow == "newactivation") this.badgeTypeForStatus = "green";
      else if (statusWorkflow == "rejected") this.badgeTypeForStatus == "red";
      this.displayStatus = workflowStatus.toUpperCase();
    } else {
      this.displayStatus = planStatus.toUpperCase();
      switch (status) {
        case "active":
        case "ingrace":
        case "newactivation":
        case "ActivationPending":
          this.badgeTypeForStatus = "green";
          break;
        case "terminate":
        case "stop":
        case "inactive":
        case "expired":
          this.badgeTypeForStatus = "red";
          break;
        case "hold":
        case "disable":
          this.badgeTypeForStatus = "grey";
          break;
        default:
          break;
      }
    }
    return true;
  }

  reActivate(plan:any) {
    const url = `/reactivateService?custId=${plan.custId}&custServiceId=${plan.customerServiceMappingId}`;
    let data = {};
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          if (response.data) {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: "Re-activate Sucessfully",
              icon: "far fa-check-circle",
            });
          } else {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Something went wrong!!!",
              icon: "far fa-times-circle",
            });
          }
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
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
}
