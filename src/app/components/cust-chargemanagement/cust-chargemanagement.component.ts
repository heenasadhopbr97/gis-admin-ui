import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { Observable } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { formatDate, DatePipe } from "@angular/common";
import { CommondropdownService } from "src/app/service/commondropdown.service";
// import * as moment from "moment";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";
import { ServiceAreaService } from "src/app/service/service-area.service";
import { LoginService } from "src/app/service/login.service";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
declare var $: any;

@Component({
    selector: "app-cust-chargemanagement",
    templateUrl: "./cust-chargemanagement.component.html",
    styleUrls: ["./cust-chargemanagement.component.css"],
    standalone: false
})
export class CustChargemanagementComponent implements OnInit {
  @Input() custid: string;
  @Input() custData: any;
  @Output() backButton = new EventEmitter();
  customerId = "";
  PRE_CUST_CONSTANTS;
  POST_CUST_CONSTANTS;
  addChargeAccess: boolean = false;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  displayCreateChargeDialog: boolean = false;
  currentCustChargePageSlab = 1;
  itemsCustChargePerPage = RadiusConstants.ITEMS_PER_PAGE;
  totalCustChargeRecords: any;
  showItemCustChargePerPage = 0;
  ChargeCustList: any[] = [];
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  overChargeListItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  overChargeListtotalRecords: any;
  currentPageoverChargeList = 1;
  overChargeListFromArray: FormArray;
  chargeGroupForm: FormGroup;
  currentDate = new Date();
  billingCycle: any = [];
  chargeType = [{ label: "One-time" }, { label: "Recurring" }];
  custmerType: any = "";
  viewcustomerListData: any = [];
  filterPlanData:[] = [];
  planDropdownInChageData: any = [];
  selectchargeValueShow: boolean = false;
  chargesubmitted = false;
  endData: any = "";
  deleteChargeID: any = "";
  planChageData: any;
  dateTime = new Date();
  todayDate: any;
  selectedParentCust: any = [];
  billableCusList: any;
  newFirst = 0;
  currentPageParentCustomerListdata = 1;
  parentCustomerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  prepaidParentCustomerList: any;
  parentCustomerListdatatotalRecords: any;
  parentFieldEnable = false;
  searchParentCustValue = "";
  searchParentCustOption = "";
  billableCustomerId:any = null;
  planMappingList: any = [];
  paymentOwnerId:any = null;
  customerPlanMappingList: any = [];
  currency: string;
  displaySelectParentCustomer: boolean = false;
  chargeManagementAccess: boolean = false;
  custType: string;
  createChargeVisible: boolean = false;
searchOptionSelect: any[];
  constructor(
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private customerManagementService: CustomermanagementService,
    public confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    public serviceAreaService: ServiceAreaService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private systemService: SystemconfigService,
    public loginService: LoginService
  ) {
    this.PRE_CUST_CONSTANTS = PRE_CUST_CONSTANTS;
    this.POST_CUST_CONSTANTS = POST_CUST_CONSTANTS;
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
    this.chargeManagementAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CHARGE
        : POST_CUST_CONSTANTS.POST_CUST_CHARGE
    );
    this.addChargeAccess = this.loginService.hasPermission(
      this.custData.custtype == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_CHARGE_CREATE_CHARGE
        : POST_CUST_CONSTANTS.POST_CUST_CAF_CHARGE_CREATE
    );
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
      billingCycle: [""],
      connection_no: ["", Validators.required],
      paymentOwnerId: ["", Validators.required],
      discount: [""],
      expiry: ["", Validators.required],
      expiryDate: [""],
    });
    this.overChargeListFromArray = this.fb.array([]);
    console.log("custId", this.custid);
    this.customerId = this.custid;
    this.getSingleCustomerData(this.custid);
    this.getCustChargeDetails("", this.custid);
    this.getserviceData();
    this.dateTime.setDate(this.dateTime.getDate());
    this.todayDate = this.dateTime.getTime();

    this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
      this.currency = res.data.value;
    });
  }

  TotalItemCustChargePerPage(event:any) {
    this.showItemCustChargePerPage = Number(event.value);
    if (this.currentCustChargePageSlab > 1) {
      this.currentCustChargePageSlab = 1;
    }
    this.getCustChargeDetails(this.showItemCustChargePerPage, this.custid);
  }

  getCustChargeDetails(size:any, id:any) {
    this.planChageData = [];
    let page_list;
    if (size) {
      page_list = size;
      this.itemsCustChargePerPage = size;
    } else {
      if (this.showItemCustChargePerPage == 0) {
        this.itemsCustChargePerPage = this.pageITEM;
      } else {
        this.itemsCustChargePerPage = this.showItemCustChargePerPage;
      }
    }
    this.ChargeCustList = [];

    let data:[] = [];

    let url = "/getAllCustomerDirectChargeByCustomer/" + id;
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.ChargeCustList = response.custChargeOverrideList;
        response.custChargeOverrideList.forEach((element:any) => {
          if (element.planid) {
            const url = "/postpaidplan/" + element.planid;
            this.customerManagementService.getMethod(url).subscribe((response: any) => {
              this.planChageData.push(response.postPaidPlan);
            });
          }
        });
        this.ChargeCustList = this.ChargeCustList.filter(value => value.isDeleted == false);
        // this.ChargeCustList.forEach((element, i) => {
        //   let SDate = new Date(element.startdate);
        //   let EDate = new Date(element.enddate);
        //   this.ChargeCustList[i].startdate = SDate.getTime();
        //   this.ChargeCustList[i].enddate = EDate.getTime();
        // });
        // console.log(this.ChargeCustList);
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

  pageChangedList(pageNumber:any) {
    this.currentCustChargePageSlab = pageNumber;
    this.getCustChargeDetails("", this.customerId);
  }

  // add charge
  billingSequence() {
    for (let i = 0; i < 12; i++) {
      this.billingCycle.push({ label: i + 1 });
      // console.log(this.billingCycle)
    }
  }

  getSingleCustomerData(id:any) {
    this.planDropdownInChageData = [];
    this.customerPlanMappingList = [];
    let url = "/customers/" + id;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.custmerType = response.customers.custtype;

      this.getStaffDetailById(response.customers.serviceareaid);
      // this.chargeGroupForm.get("billingCycle").clearValidators();
      // this.chargeGroupForm.get("billingCycle").updateValueAndValidity();
      this.chargeGroupForm.patchValue({
        type: "Recurring",
      });
      this.billingSequence();
      // if (response.customers.plangroupid) {
      //   this.getPlangroupByPlan(response.customers.plangroupid);
      // } else {
      this.customerPlanMappingList = response.customers.planMappingList;
      // response.customers.planMappingList.forEach(element => {
      //   if (element.planId) {
      //     const url = "/postpaidplan/" + element.planId;
      //     this.customerManagementService.getMethod(url).subscribe((response: any) => {
      //       this.planDropdownInChageData.push(response.postPaidPlan);
      //     });
      //   }
      // });
      // }
      const url = "/subscriber/fetchCustomerDiscountDetailServiceLevel/" + id;
      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.planMappingList = response.discountDetails;
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
    });
  }

  selectTypecharge(e:any) {
    this.chargeGroupForm.get("connection_no").reset();
    this.chargeGroupForm.get("planid").reset();
    this.chargeGroupForm.get("expiry").reset();
    if (e.value == "Recurring") {
      // this.chargeGroupForm.get("billingCycle").setValidators([Validators.required]);
      // this.chargeGroupForm.get("billingCycle").updateValueAndValidity();
    } else {
      this.chargeGroupForm.value.billingCycle = 0;
      // this.chargeGroupForm.get("billingCycle").clearValidators();
      // this.chargeGroupForm.get("billingCycle").updateValueAndValidity();
    }
  }

  onBillingCycleChange(e:any) {
    this.chargeGroupForm.get("connection_no").reset();
    this.chargeGroupForm.get("planid").reset();
    this.chargeGroupForm.get("expiry").reset();
  }

  deleteConfirmonChargeField(chargeFieldIndex: number, name: string) {
    if (chargeFieldIndex || chargeFieldIndex == 0) {
      this.confirmationService.confirm({
        message: "Do you want to delete this " + name + "?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.onRemoveChargelist(chargeFieldIndex);
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

  onRemoveChargelist(index: number) {
    this.overChargeListFromArray.removeAt(index);
  }

  pageChangedOverChargeList(pageNumber:any) {
    this.currentPageoverChargeList = pageNumber;
  }

  createoverChargeListFormGroup(): FormGroup {
    // this.chargeGroupForm.get("billingCycle").clearValidators();
    // this.chargeGroupForm.get("billingCycle").updateValueAndValidity();
    let billingCycle = this.chargeGroupForm.value.type === "Recurring" ? 1 : "";
    let planName = this.planByService
      .filter((el:any) => el.planId.split("-")[0] === this.chargeGroupForm.value.planid.split("-")[0])[0]
      .planName.split("(")[0];
    return this.fb.group({
      // chargeid: [''],
      type: [this.chargeGroupForm.value.type ? this.chargeGroupForm.value.type : "Recurring"],
      chargeid: [this.chargeGroupForm.value.chargeid],
      validity: [this.chargeGroupForm.value.validity],
      price: [this.chargeGroupForm.value.price],
      actualprice: [this.chargeGroupForm.value.actualprice],
      charge_date: [this.chargeGroupForm.value.charge_date],
      planid: [this.chargeGroupForm.value.planid.split("-")[0]],
      planName: [planName],
      unitsOfValidity: [this.chargeGroupForm.value.unitsOfValidity],
      billingCycle: [billingCycle],
      paymentOwnerId: [this.paymentOwnerId],
      discount: [this.chargeGroupForm.value.discount],
      staticIPAdrress: [this.chargeGroupForm.value.staticIPAdrress],
      expiry: [this.chargeGroupForm.value.expiry],
      expiryDate: [(this.chargeGroupForm.value.expiry).format("DD-MM-YYYY HH:mm").toString()],
      connection_no: [this.chargeGroupForm.value.connection_no],
    });
  }

  staticIPCharge:any = null;
  staticIPExpiryDate:any = null;

  editStaticIP(charge:any) {
    this.staticIPCharge = charge;
    this.staticIPCharge.enddate = (charge.enddate).toDate();
    this.staticIPCharge.startdate = (charge.startdate).toDate();
    this.staticIPExpiryDate = (charge.enddate).toDate();
    $("#updateStaticIP").modal("show");
  }

  updateStaticIPAddress() {
    const url = `/updateStaticIpAddress?custChargeId=${this.staticIPCharge.id}&staticIPAddress=${
      this.staticIPCharge.staticIPAdrress
    }&staticIPExpiryDate=${this.datePipe.transform(this.staticIPExpiryDate, "yyyy-MM-dd")}`;
    this.customerManagementService.updateMethod(url, {}).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle",
        });
        $("#updateStaticIP").modal("hide");
        this.staticIPCharge = null;
        this.staticIPExpiryDate = null;
        this.getCustChargeDetails("", this.custid);
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

  onAddoverChargeListField() {
    this.chargesubmitted = true;
    this.chargeGroupForm.patchValue({
      paymentOwnerId: this.paymentOwnerId,
      type: "Recurring",
    });
    if (this.chargeGroupForm.valid) {
      if (this.chargeGroupForm.value.price >= this.chargeGroupForm.value.actualprice) {
        this.overChargeListFromArray.push(this.createoverChargeListFormGroup());
        this.chargeGroupForm.reset();
        this.chargeGroupForm.patchValue({
          type: "Recurring",
        });
        this.chargesubmitted = false;
        this.selectchargeValueShow = false;
        this.planByService = [];
      }
    }
  }

  getPlangroupByPlan(planGroupId:any) {
    // this.planDropdownInChageData = [];
    this.customerPlanMappingList = [];
    let MappURL = "/findPlanGroupMappingByPlanGroupId?planGroupId=" + planGroupId;
    this.customerManagementService.getMethod(MappURL).subscribe((response: any) => {
      let attributeList = response.planGroupMappingList;
      attributeList.forEach((element:any) => {
        this.customerPlanMappingList.push(element.plan);
      });
    });
  }

  getPlanValidityForChagre(event:any) {
    const planId = event.value.split("-")[0];
    const id = event.value.split("-")[1];
    let customerPlanMappingListPlanId = this.customerPlanMappingList.find(
      (plan:any) => Number(plan.planId) == Number(planId)
    );
    let expiry = this.planByService.find(
      (plan:any) =>
        Number(plan.planId.split("-")[0]) == Number(planId) &&
        Number(plan.planId.split("-")[1] == id)
    ).expiryDate;
    let expiryDate = (expiry).format("DD-MM-YYYY HH:mm").toString();

    this.chargeGroupForm.patchValue({
      validity: Number(customerPlanMappingListPlanId.validity),
      unitsOfValidity: customerPlanMappingListPlanId.unitsOfValidity,
      expiry: expiry,
    });
    let planData = this.planMappingList.find(
      (element:any) => element.connectionNo === this.chargeGroupForm.value.connection_no
    );
    let planExpirydate = new Date(planData.discountExpiryDate);
    planExpirydate.setHours(23);
    planExpirydate.setMinutes(59);
    planExpirydate.setSeconds(59);
    if (
      planData.discountType === "Recurring" &&
      planExpirydate > this.dateTime &&
      planData.discount > 0
    ) {
      this.confirmationService.confirm({
        message: "Do you want to apply " + planData.discount + " % of  Discount?",
        header: "Change Discount Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.chargeGroupForm.patchValue({
            discount: planData.discount,
          });
        },
        reject: () => {
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected",
          });
          this.chargeGroupForm.patchValue({
            discount: 0,
          });
        },
      });
    } else if (
      planData.discountType === "Recurring" &&
      planExpirydate > this.dateTime &&
      planData.discount < 0
    ) {
      this.confirmationService.confirm({
        message: "Do you want to over charge customer " + planData.discount + " % ?",
        header: "Change Discount Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.chargeGroupForm.patchValue({
            discount: planData.discount,
          });
        },
        reject: () => {
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected",
          });
          this.chargeGroupForm.patchValue({
            discount: 0,
          });
        },
      });
    }
    //
    // });
  }

  selectcharge(_event: any) {
    let chargeId = _event.value;
    let viewChargeData;
    let date;

    date = this.currentDate.toISOString();
    const format = "yyyy-MM-dd";
    const locale = "en-US";
    const myDate = date;
    const formattedDate = formatDate(myDate, format, locale);
    //
    // console.log(this.currentDate);
    const url = "/charge/" + chargeId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      viewChargeData = response.chargebyid;
      this.selectchargeValueShow = true;
      if (viewChargeData.chargecategory === "IP") {
        this.chargeGroupForm.get("staticIPAdrress").setValidators([Validators.required]);
        this.chargeGroupForm.get("staticIPAdrress").updateValueAndValidity();
      } else {
        this.chargeGroupForm.get("staticIPAdrress").clearValidators();
        this.chargeGroupForm.get("staticIPAdrress").updateValueAndValidity();
      }
      this.chargeGroupForm.patchValue({
        actualprice: Number(viewChargeData.actualprice),
        price: Number(viewChargeData.actualprice),
        charge_date: formattedDate,
      });
    });
  }

  closeChargeModal() {
    // $("#addChargeDataid").modal("hide");
    this.createChargeVisible = false;
    this.chargeGroupForm.reset();
    this.overChargeListFromArray = this.fb.array([]);
    this.removeSelParentCust();
    this.removeSelectStaff();
  }

  saveChargeData() {
    const url = "/createCustChargeOverride";
    var request = [];
    request = this.overChargeListFromArray.value;
    request.forEach((charge:any) => {
      // var dateParts = charge.expiry.substring(0, 10).split("-");
      // var newDate = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
      charge.expiry = (charge.expiry).format("YYYY-MM-DD");
    });
    let chargeDta = {
      custChargeDetailsPojoList: request,
      custid: this.custid,
      billableCustomerId: this.billableCustomerId,
      paymentOwnerId: this.paymentOwnerId,
    };
    this.customerManagementService.postMethod(url, chargeDta).subscribe(
      (response: any) => {
        this.getCustChargeDetails("", this.custid);
        this.closeChargeModal();
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle",
        });
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

  deleteConfirmCharge(id:any, startdate:any, enddate:any) {
    this.deleteChargeID = id;

    if (this.todayDate < enddate && this.todayDate > startdate) {
      console.log("TData < EDate && TData > SDate  = cuurent");
      this.confirmationService.confirm({
        message: "Do you want to Delete of  Charge?",
        header: "Delete Charge Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          $("#deleteChargeId").modal("show");
        },
        reject: () => {
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected",
          });
        },
      });
    } else if (this.todayDate < enddate && this.todayDate < startdate) {
      console.log("TData < EDate && TData < SDate  = future");
      this.deletechargeData("softDel");
    }
  }

  deletecloseModel() {
    this.deleteChargeID = "";
  }

  deletechargeData(SID:any) {
    let data;
    if (SID == "softDel") {
      data = {
        endDate: "",
        id: this.deleteChargeID,
        softDelete: true,
      };
    } else {
      data = {
        endDate: this.endData,
        id: this.deleteChargeID,
        softDelete: false,
      };
    }

    const url = "/deleteCustomerDirectCharge";
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.getCustChargeDetails("", this.custid);
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle",
        });
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
  custServiceData: any = [];
  planByService: any = [];
  isShowConnection = true;
  serviceSerialNumbers: { serialNumber: any; custPlanMapppingId: any; connection_no: any }[] = [];
  async getserviceData() {
    // const url = "/subscriber/getPlanByCustService/" + this.custid;
    // this.customerManagementService.getMethod(url).subscribe(
    //   (response: any) => {
    //     this.custServiceData = response.dataList;
    //
    //   },
    //   (error: any) => {
    //     this.messageService.add({
    //       severity: "error",
    //       summary: "Error",
    //       detail: error.error.ERROR,
    //       icon: "far fa-times-circle",
    //     });
    //
    //   }
    // );
    // const url = "/subscriber/getFuturePlanList/" + this.custid;
    // await this.customerManagementService.getMethod(url).subscribe(
    //   (response: any) => {
    //     if (response.dataList != null) {
    //       response.dataList.forEach(data => {
    //         if (this.custServiceData.length > 0) {
    //           let isElementAlreadyExist = this.custServiceData.find(
    //             el => el.serviceId === data.serviceId
    //           )
    //             ? true
    //             : false;
    //           if (!isElementAlreadyExist) {
    //             this.custServiceData.push(data);
    //           }
    //         } else {
    //           this.custServiceData.push(data);
    //         }
    //       });
    //     }
    //
    //   },
    //   (error: any) => {
    //     // console.log(error, "error")
    //     this.messageService.add({
    //       severity: "error",
    //       summary: "Error",
    //       detail: error.error.ERROR,
    //       icon: "far fa-times-circle",
    //     });
    //
    //   }
    // );

    const url1 = "/subscriber/getActivePlanList/" + this.custid + "?isNotChangePlan=true";
    await this.customerManagementService.getMethod(url1).subscribe(
      (response: any) => {
        if (response.dataList != null) {
          this.custServiceData = response.dataList.filter(
            (item:any) =>
              item.plangroup !== "Volume Booster" &&
              item.plangroup !== "Bandwidthbooster" &&
              item.plangroup !== "DTV Addon"
          );
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
  getServiceSerialNumber() {
    this.createChargeVisible = true;
    var keepGping = false;
    this.serviceSerialNumbers = [];
    this.overChargeListFromArray = this.fb.array([]);
    this.chargeGroupForm.reset();
    if (this.custServiceData.length > 0) {
      this.custServiceData.forEach((item:any) => {
        if (!keepGping) {
          var filteredItem = item.customerInventorySerialnumberDtos.filter((item:any) => item.primary);
          if (filteredItem.length > 0) {
            this.isShowConnection = false;
            this.serviceSerialNumbers.push({
              serialNumber: filteredItem[0].serialNumber,
              custPlanMapppingId: item.custPlanMapppingId,
              connection_no: item.connection_no,
            });
          } else {
            this.isShowConnection = true;
            this.serviceSerialNumbers = [];
            keepGping = true;
          }
        }
      });
    }
  }
  filterPlan(e:any) {
    this.planByService = [];
    let expiryDate;
    this.customerPlanMappingList.filter((element:any) => {
      let isElementAlreadyExist = this.planByService.filter((el:any) => el.planId === element.planId);
      if (
        element.serviceId ==
          this.planMappingList.find((plan:any) => plan.connectionNo === e.value).serviceId &&
        (element.plangroup === "Renew" || element.plangroup === "Registration and Renewal") &&
        element.custPlanStatus.toLowerCase() === "active"
      ) {
        expiryDate = new Date(element.expiryDate);
        // let date = new Date(expiryDate);
        // let extendValue = 1 * element.validity;
        // if (this.chargeGroupForm.value.type === this.chargeType[1].label) {
        // var unitsOfValidity = element.unitsOfValidity;
        // switch (unitsOfValidity) {
        //   case "Days": {
        //     date.setDate(date.getDate() + extendValue);
        //     break;
        //   }

        //   case "Hours": {
        //     date.setHours(date.getHours() + extendValue);
        //     break;
        //   }

        //   case "Months": {
        //     date.setMonth(date.getMonth() + extendValue);
        //     break;
        //   }

        //   case "Years": {
        //     date.setFullYear(date.getFullYear() + extendValue);
        //     break;
        //   }
        // }
        // expiryDate = date;
        // }
        if (isElementAlreadyExist.length > 0 && isElementAlreadyExist.id !== element.id) {
          this.planByService.push({
            planId: element.planId,
            planName: element.planName,
            expiryDate: expiryDate,
          });
        } else {
          this.planByService.push({
            planId: element.planId,
            planName: element.planName,
            expiryDate: expiryDate,
          });
        }
      }
    });
    this.planByService.map((plan:any) => {
      plan.planId = plan.planId + "-" + plan.id;
      plan.planName =
        plan.planName + "(" + (plan.expiryDate).format("DD-MM-YYYY").toString() + ")";
    });
    this.commondropdownService.getChargeTypeByList(
      this.planMappingList.find((plan:any) => plan.connectionNo === e.value).serviceId
    );
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
        const filterList = list.filter((cust:any) => cust.id !== this.custid);

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
        const filterList = list.filter((cust:any) => cust.id !== this.custid);
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
    this.billableCustomerId = this.selectedParentCust.id;
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
    this.billableCustomerId = null;
  }

  staffDataList: any = [];

  getStaffDetailById(serviceAreaId:any) {
    const url = "/getstaffuserbyserviceareaid/" + serviceAreaId;
    this.serviceAreaService.getMethod(url).subscribe((response: any) => {
      this.staffDataList = response.dataList;
      //console.log("staffDataList", this.data);
      this.staffDataList.forEach((element:any, i:any) => {
        element.displayLabel = element.fullName + " (Ph: " + element.phone + ")";
      });
    });
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
    // if (this.selectStaffType == "paymentCharge") {
    this.paymentOwnerId = Number(data.id);
    // this.chargeGroupForm.patchValue({
    //   paymentOwnerId: data.id,
    // });
    // }
  }

  closeSelectStaff() {
    this.showSelectStaffModel = false;
  }

  removeSelectStaff() {
    this.staffSelectList = [];
    this.paymentOwnerId = null;
  }
}
