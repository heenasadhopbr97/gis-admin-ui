import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { ActivatedRoute, Router } from "@angular/router";
// import * as moment from "moment";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { BehaviorSubject } from "rxjs";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { DatePipe, formatDate } from "@angular/common";
// import { element } from "protractor";
import { Regex } from "src/app/constants/regex";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";
import { any } from "underscore";

declare var $: any;

@Component({
    selector: "app-cust-change_plan",
    templateUrl: "./cust-change_plan.component.html",
    styleUrls: ["./cust-change_plan.component.scss"],
    standalone: false
})
export class CustChangePlanComponent implements OnInit {
    custType: any;
    customerId: number;
    loggedInStaffId = localStorage.getItem("userId");
    partnerId = Number(localStorage.getItem("partnerId"));

    changePlanNewForm: FormGroup;
    // changenewPlanForm: FormGroup;
    changePlanForm: FormGroup;
    plansArray: FormArray;

    custDetails: any = {};
    planForConnection: any;
    changePlanTypeValue: any;
    changePlanTypeSelection: any;
    ChangePLanDateSelection: any;
    childCustList: any = [];
    childPlanGroup: any = [];
    newPlanSelection: any;
    planSelected: any;
    custPlanMapppingId: any;
    planGroupSelected: any;
    planDetails: any;
    newPlanGroupId: any;
    isAddCharge: boolean = false;
    planGroupChanges: any;
    newPlanGroupIdChild: any;
    selectedPlanCategory: any;
    billableCustList: any;
    parentCustomerDialogType: any = "";
    customerSelectType: any = "";
    selectedParentCust: any = [];
    currentIndex: number;
    planDiscount: number;
    finalOfferPrice: number;

    custServiceData: any[] = [];
    serviceSerialNumbers: { serialNumber: any; custPlanMapppingId: any }[] = [];
    promiseToPayData: { startDate: any; endDate: any; days: any }[] = [];
    selectedChangePlan:[] = [];
    newPlanData: any = {};
    planDropdownInChageData:[] = [];

    custCustDiscountList: any = [];
    selectPlanListIDs:[] = [];
    planMappingListData: any = [];
    groupOfferPrices: { [key: string]: number } = {};
    offerPrice = 0;

    isShowConnection = true;
    showPlanConnectionNo = false;
    isPromiseToPayModelOpen: boolean = false;
    changePlanSubmitted = false;
    ifPlanSelectChanePlan = false;
    ifPlanGroup = false;
    subisuChange = false;
    showParentCustomerModel = false;

    pageLimitOptions = RadiusConstants.pageLimitOptions;
    customerCurrentPlanListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
    customerCurrentPlanListdatatotalRecords = 0;
    currentPagecustomerCurrentPlanListdata = 1;

    planQuota = new BehaviorSubject({
        custid: "",
        PlanData: ""
    });
    selPlanData: any = {
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
        finalAmount: ""
    };

    planDetailsCategory = [
        { label: "Individual", value: "individual" },
        { label: "Plan Group", value: "groupPlan" }
    ];
    displayPlanDetails: boolean = false;
    visibleQuotaDetails: boolean = false;
    showAddDirectCharge: boolean = false;
    showChargeDetails: boolean = false;
    selectchargeValueShow: boolean = false;
    chargesubmitted: boolean = false;

    overChargeListFromArray: FormArray<FormGroup> = this.fb.array<FormGroup>([]);
    chargeGroupForm: FormGroup;

    overChargeListItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
    overChargeListtotalRecords: any;
    currentPageoverChargeList = 1;

    custPlansForCharge = {};
    plansForChargeByCust: { connection_no: string; custId: number; planId: number; planName: string; unitsOfValidity: string; validity: number; discount: number; discountExpiryDate: Date; discountType: string }[] = [];
    plansForCharge: { planId: number; planName: string; validity: number; unitsOfValidity: string; discountType?: string; discountExpiryDate?: Date; discount?: number }[] = [];
    currentDate = new Date();
    addedChargeList: any[] = [];
    chargeType = [{ label: "One-time" }, { label: "Recurring" }];

    displayRecordPaymentDialog: boolean = false;
    displaySelectInvoiceDialog: boolean = false;
    submitted: boolean = false;
    masterSelected: boolean = false;
    isShowInvoiceList: boolean = false;
    destinationbank: boolean = false;
    paymentFormGroup: FormGroup;
    invoiceList: any = [{ docnumber: "Advance", id: 0, isSelected: false }];
    //   invoicedropdownValue = [{ docnumber: "Advance", id: 0 }];
    chequeDateName = "Cheque Date";
    selectedInvoice: any = [];
    onlineSourceData:[] = [];
    tdsPercent: number;
    abbsPercent: number;
    expiryDate: Date;

    Amount: any = 0;
    paymentMode:[] = [];
    bankDataList: any;
    bankDestination: any;
    paymentOwnerRequiredValue: any;
    paymentOwnerRequired: boolean = true;
    changePlanType: any[] = [];
    dateType: any[] = [];
    addOnEndDate: Date;
    addOnStartDate: Date;
    dateTime: Date = new Date();
    isoDateString: string;
    //   expiryDate: string;
    endDate: Date;
    skipQuotaUpdate: boolean = false;
    isoStartDateString: string;
childCust: any;
    constructor(
        private fb: FormBuilder,
        private datePipe: DatePipe,
        private spinner: NgxSpinnerService,
        private messageService: MessageService,
        private customerManagementService: CustomermanagementService,
        private paymentamountService: PaymentamountService,
        public commonDropDownService: CommondropdownService,
        private route: ActivatedRoute,
        private router: Router,
        private confirmationService: ConfirmationService,
        private systemService: SystemconfigService,
        public KeyannaCommonBaseService: KeyannaCommonBaseService
    ) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
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

    async ngOnInit() {
        this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
        this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
        this.initData();
        console.log("plandetails", this.planDetails);
    }

    initData() {
        this.changePlanNewForm = this.fb.group({
            isPaymentReceived: ["false"],
            remarks: ["", Validators.required],
            paymentOwnerId: ["", Validators.required],
            billableCustomerId: [""],
            externalRemark: [""],
            isTriggerCoaDm: [true]
        });
        this.changePlanForm = this.fb.group({
            connectionNo: [null, Validators.required],
            serviceName: [null],
            serviceNickName: [null],
            purchaseType: ["", Validators.required],
            planId: ["", Validators.required],
            planGroupId: ["", Validators.required],
            planList: [""],
            isPaymentReceived: ["false"],
            remarks: ["", Validators.required],
            paymentOwnerId: ["", Validators.required],
            billableCustomerId: [""],
            // addonStartDate: [this.currentData],
            ChangePlanCategory: [""]
        });
        this.chargeGroupForm = this.fb.group({
            chargeid: ["", Validators.required],
            custId: [""],
            validity: ["", Validators.required],
            price: ["", Validators.required],
            actualprice: ["", Validators.required],
            charge_date: ["", Validators.required],
            type: ["One-time", Validators.required],
            staticIPAdrress: [""],
            planid: ["", Validators.required],
            unitsOfValidity: ["", Validators.required],
            discount: [""],
            billingCycle: [""]
        });
        this.paymentFormGroup = this.fb.group({
            amount: [0, [Validators.required, Validators.min(1)]],
            bank: [""],
            branch: [""],
            chequedate: ["", Validators.required],
            chequeno: ["", [Validators.required, Validators.pattern(Regex.numeric)]],
            customerid: ["", Validators.required],
            paymode: ["", Validators.required],
            referenceno: ["", Validators.required],
            remark: ["", Validators.required],
            bankManagement: ["", Validators.required],
            destinationBank: ["", Validators.required],
            reciptNo: [""],
            type: ["Payment"],
            paytype: [""],
            tdsAmount: [0],
            abbsAmount: [0],
            invoiceId: ["", Validators.required],
            onlinesource: [""]
        });
        this.getCustomersDetail(this.customerId);
        this.getserviceData();
        this.getcustDiscountDetails(this.customerId, "");
        this.getChildCustomersForChangePlan();

        this.getPlanPurchaseType();
        this.getChangePlanDate();
        this.commonDropDownService.getChargeTypeByList();
        this.commonDropDownService.getPostpaidplanData();
        this.systemService.getConfigurationByName("TDS").subscribe((res: any) => {
            this.tdsPercent = res.data.value;
        });
        this.systemService.getConfigurationByName("ABBS").subscribe((res: any) => {
            this.abbsPercent = res.data.value;
        });
        this.systemService.getConfigurationByName("PAYMENTOWNERREQUIRED").subscribe((res: any) => {
            this.paymentOwnerRequiredValue = res.data != null ? res.data.value : "true";
            if (this.paymentOwnerRequiredValue === "false") {
                this.paymentOwnerRequired = false;
            }
            if (this.paymentOwnerRequired === false) {
                // this logic is make payment owner mandetory or non mandetory with setting parameter
                this.changePlanNewForm.controls["paymentOwnerId"].clearValidators();
            } else {
                this.changePlanNewForm.controls["paymentOwnerId"].setValidators(Validators.required);
            }
            this.changePlanNewForm.controls["paymentOwnerId"].updateValueAndValidity();
        });
    }

    customerDetailOpen() {
        this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
    }

    refreshChangePlan() {
        this.getserviceData();
    }

    getCustomersDetail(custId:any) {
        const url = "/customers/" + custId;
        this.customerManagementService.getMethod(url).subscribe(
            (response: any) => {
                this.custDetails = response.customers;
                this.billableCustList = [
                    {
                        id: this.custDetails.id,
                        name: `${this.custDetails.title} ${this.custDetails.custname} `
                    }
                ];
                console.log("this.billableCustList ::::::: ", this.billableCustList);

                this.changePlanNewForm.patchValue({
                    billableCustomerId: this.custDetails.id
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

    getserviceData() {
        let services = [];
        const url =
            "/subscriber/getPlanByCustService/" +
            this.customerId +
            "?isAllRequired=true" +
            "&isNotChangePlan=false";
        this.customerManagementService.getMethod(url).subscribe(
            (response: any) => {
                this.custServiceData = [];
                var keepGping = false;
                console.log("response.dataList :::::::: ", response.dataList);
                response.dataList.forEach((service:any) => {
                    if (
                        !this.custServiceData.find((srv:any) => srv.connection_no === service.connection_no) &&
                        service.custPlanStatus.toLowerCase() !== "newactivation" &&
                        (service.invoiceType == null ||
                            service.invoiceType == "" ||
                            service.invoiceType === "Independent")
                    ) {
                        this.custServiceData.push(service);
                    }
                });

                // this.selectedCustService.invoiceType === "Independent";

                if (this.custServiceData.length > 0) {
                    this.serviceSerialNumbers = [];
                    this.custServiceData.forEach(item => {
                        if (!keepGping) {
                            var filteredItem = item.customerInventorySerialnumberDtos.filter(
                                (item:any) => item.primary
                            );
                            if (filteredItem.length > 0) {
                                this.isShowConnection = false;
                                this.serviceSerialNumbers.push({
                                    serialNumber: filteredItem[0].serialNumber,
                                    custPlanMapppingId: item.custPlanMapppingId
                                });
                            } else {
                                this.isShowConnection = true;
                                this.serviceSerialNumbers = [];
                                keepGping = true;
                            }
                        }
                    });
                }
                let data = this.custServiceData;
                this.custServiceData = [];
                data.forEach(element => {
                    if (element.custPlanStatus.toLowerCase() != "terminate") {
                        this.custServiceData.push(element);
                    }
                });
                this.customerCurrentPlanListdatatotalRecords = this.custServiceData.length;
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

    getChildCustomersForChangePlan() {
        let chargeAvailable: Boolean = false;
        const url = `/getAllChildCustomer?customerId=${this.customerId}&invoiceType=Group`;
        const data = {
            page: 1,
            pageSize: 5
        };
        this.customerManagementService.postMethod(url, data).subscribe(
            (response: any) => {
                var childCustomerDataListForChangePlan = response.customerList;
                this.childCustList = childCustomerDataListForChangePlan;
                // this.childPlanGroup = childCustomerDataListForChangePlan.filter(e => e.plangroupid);
                childCustomerDataListForChangePlan.forEach((element:any, i:any) => {
                    // this.getplanChangeforplanGroup(element.id);
                    if (element.indiChargeList.length == 0) {
                        chargeAvailable = false;
                    } else {
                        chargeAvailable = true;
                    }
                    this.getcustDiscountDetails(element.id, "");
                    // const url = "/subscriber/getActivePlanList/" + element.id + "?isNotChangePlan=false";
                    const url =
                        "/subscriber/getPlanByCustService/" +
                        element.id +
                        "?isAllRequired=true" +
                        "&isNotChangePlan=false";
                    this.customerManagementService.getMethod(url).subscribe(
                        (response: any) => {
                            let childActivePlans: any[] = [];
                            let childActivePlanGroup = [];
                            response.dataList.forEach((item:any) => {
                                if (
                                    item.invoiceType == "Group" &&
                                    item.plangroup !== "Volume Booster" &&
                                    item.plangroup !== "Bandwidthbooster" &&
                                    item.plangroup !== "DTV Addon" &&
                                    item.custPlanStatus.toLowerCase() !== "newactivation"
                                )
                                    childActivePlans.push(item);
                                // else if (
                                //   item.invoiceType == "Group" &&
                                //   item.plangroup !== "Volume Booster" &&
                                //   item.plangroup !== "Bandwidthbooster" &&
                                //   item.plangroup !== "DTV Addon" &&
                                //   item.custPlanStatus.toLowerCase() !== "newactivation"
                                // )
                                //   childActivePlanGroup.push(item);
                            });

                            // if (childActivePlanGroup.length > 0)
                            //   this.childPlanGroup[i].serviceMappingData = childActivePlanGroup;
                            if (childActivePlans.length > 0)
                                this.childCustList[i].serviceMappingData = childActivePlans;
                        },
                        (error: any) => {
                            this.messageService.add({
                                severity: "error",
                                summary: "Error",
                                detail: error.error.msg,
                                icon: "far fa-times-circle"
                            });
                        }
                    );
                });
            },
            (error: any) => {
                this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail: error.error.msg,
                    icon: "far fa-times-circle"
                });
            }
        );
    }

    modalOpenDetails(newPlanId:any, connection_no:any, custId:any, selectedPlanCategory:any) {
        if (selectedPlanCategory == "groupPlan") {
            this.planGroupData[custId].forEach((e:any) => {
                if (e.plan.id == newPlanId) this.planDetails = e.plan;
            });
        } else {
            this.newPlanData[connection_no].forEach((e:any) => {
                if (e.id == newPlanId) this.planDetails = e;
            });
        }

        this.displayPlanDetails = true;
        this.calculateExpiry();
    }

    closeDisplayPlanDetails() {
        this.displayPlanDetails = false;
    }

    onChangePlanType(event:any) {
        this.changePlanSubmitted = false;

        this.newPlanGroupId = null;
        this.isAddCharge = false;
        this.changePlanNewForm.reset();
        this.changePlanNewForm.patchValue({
            isPaymentReceived: "false",
            billableCustomerId: this.custDetails.id,
            isTriggerCoaDm: true
        });
        this.childCustList.forEach((element:any) => {
            if (
                element.serviceMappingData != null &&
                element.serviceMappingData.length == 1 &&
                this.changePlanTypeSelection !== "Addon"
            ) {
                element.selectedPlanCategory = "individual";
            } else {
                element.selectedPlanCategory = null;
            }
            element.newPlanGroupId = null;
            element.isAddCharge = false;
            element.serviceMappingData.forEach((item:any) => {
                item.changeFlag = false;
                item.newPlanSelection = null;
            });
        });
        if (
            this.custServiceData != null &&
            this.custServiceData.length == 1 &&
            this.changePlanTypeSelection !== "Addon"
        ) {
            this.selectedPlanCategory = "individual";
        } else {
            this.selectedPlanCategory = null;
        }
        this.custServiceData.forEach(element => {
            element.changeFlag = false;
            element.newPlanSelection = null;
        });
    }

    selectNewPlan(i:any, event:any, custServiceMapping:any, custId?:any, selectedPlanCategory?:any) {
        this.currentIndex = i;
        this.addEndDate(custServiceMapping.newPlanSelection, custServiceMapping.connection_no);
        this.getPlanDetailById(event, custServiceMapping);
    }

    addEndDate(newPlanId: any, connection_no: any) {
        // Locate the plan details based on the provided IDs
        this.newPlanData[connection_no].forEach((e:any) => {
            if (e.id === newPlanId) {
                this.planDetails = e;
            }
        });

        console.log("Plan Details:", this.planDetails);

        if (this.planDetails && this.planDetails.validity) {
            const currentDate = new Date();
            const validity = this.planDetails.validity;
            const calculatedEndDate = new Date(currentDate);

            if (this.planDetails.unitsOfValidity.toLowerCase() === "years") {
                calculatedEndDate.setFullYear(currentDate.getFullYear() + validity);
            } else if (this.planDetails.unitsOfValidity.toLowerCase() === "months") {
                const newMonth = currentDate.getMonth() + validity;
                calculatedEndDate.setMonth(newMonth);
            } else if (this.planDetails.unitsOfValidity.toLowerCase() === "days") {
                calculatedEndDate.setDate(currentDate.getDate() + validity);
            } else if (this.planDetails.unitsOfValidity.toLowerCase() === "hours") {
                calculatedEndDate.setHours(currentDate.getHours() + validity);
            } else {
                calculatedEndDate.setDate(currentDate.getDate() + validity);
            }

            this.addOnEndDate = calculatedEndDate;
            this.addOnStartDate = new Date();
            // this.isoStartDateString = moment(this.addOnStartDate).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
            // this.isoDateString = moment(this.addOnEndDate).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
            // this.isoStartDateString = moment(this.addOnStartDate).local().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            // this.isoDateString = moment(this.addOnEndDate).local().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            console.log(this.addOnEndDate, this.isoDateString);
            console.log(this.addOnStartDate, this.isoStartDateString);
        } else {
            this.addOnEndDate = null;
            this.addOnStartDate = null;
        }
    }

    onDateSelectStartDate(event:any) {
        const selectedDate = new Date(event);
        const currentTime = new Date();
        this.addOnStartDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            currentTime.getHours(),
            currentTime.getMinutes(),
            currentTime.getSeconds()
        );
        // this.isoStartDateString = moment(this.addOnStartDate).local().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        if (this.planDetails && this.planDetails.validity) {
            const currentDate = this.addOnStartDate;
            const validity = this.planDetails.validity;
            const calculatedEndDate = new Date(currentDate);

            if (this.planDetails.unitsOfValidity.toLowerCase() === "years") {
                calculatedEndDate.setFullYear(currentDate.getFullYear() + validity);
            } else if (this.planDetails.unitsOfValidity.toLowerCase() === "months") {
                const newMonth = currentDate.getMonth() + validity;
                calculatedEndDate.setMonth(newMonth);
            } else if (this.planDetails.unitsOfValidity.toLowerCase() === "days") {
                calculatedEndDate.setDate(currentDate.getDate() + validity);
            } else if (this.planDetails.unitsOfValidity.toLowerCase() === "hours") {
                calculatedEndDate.setHours(currentDate.getHours() + validity);
            } else {
                calculatedEndDate.setDate(currentDate.getDate() + validity);
            }

            this.addOnEndDate = calculatedEndDate;
            // this.isoStartDateString = moment(this.addOnStartDate).local().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            // this.isoDateString = moment(this.addOnEndDate).local().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            console.log(this.addOnEndDate, this.isoDateString);
            console.log(this.addOnStartDate, this.isoStartDateString);
        }
    }

    onDateSelect(event:any) {
        const selectedDate = new Date(event);
        const currentTime = new Date();
        this.addOnEndDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            currentTime.getHours(),
            currentTime.getMinutes(),
            currentTime.getSeconds()
        );
        // this.isoDateString = moment(this.addOnEndDate).local().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    }

    pageChangedcustomerCurrentPlanListData(pageNumber:any) {
        this.currentPagecustomerCurrentPlanListdata = pageNumber;
        this.getserviceData();
    }

    TotalCurrentPlanItemPerPage(event:any) {
        this.customerCurrentPlanListdataitemsPerPage = Number(event.value);
        if (this.currentPagecustomerCurrentPlanListdata > 1) {
            this.currentPagecustomerCurrentPlanListdata = 1;
        }
        this.getserviceData();
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

    closeModel() {
        this.visibleQuotaDetails = false;
        this.planQuota = new BehaviorSubject({
            custid: "",
            PlanData: ""
        });
    }

    findDuration(expiryDate: Date) {
        var start = (new Date(new Date().setHours(0, 0, 0, 0)), "DD/MM/YYYY"); //todays date
        var end = (new Date(expiryDate), "DD/MM/YYYY"); // another date
        // var duration = moment.duration(end.diff(start));

        // var days = duration.asDays();
        // return Math.trunc(days);
    }

    findDurationFromStartDate(startDate: Date, expiryDate: Date) {
        var start = (new Date(startDate), "DD/MM/YYYY"); //start date
        var currentDate = (new Date(new Date().setHours(0, 0, 0, 0)), "DD/MM/YYYY");
        if (currentDate <= start) start = currentDate;
        var end = (new Date(expiryDate), "DD/MM/YYYY"); // another date
        // var duration = moment.duration(end.diff(start));

        // var days = duration.asDays();
        // return Math.trunc(days);
    }

    promiseToPayDetailsClick(id:any, startDate:any, endDate:any, days:any) {
        this.promiseToPayData = [{ startDate: startDate, endDate: endDate, days: days }];
        this.isPromiseToPayModelOpen = true;
        this.paymentamountService.show(id);
    }

    quotaPlanDetailsModel(modelID:any, custid:any, PlanData:any) {
        this.visibleQuotaDetails = true;
        this.paymentamountService.show(modelID);
        this.planQuota.next({
            custid,
            PlanData
        });
    }

    getcustDiscountDetails(custId:any, discountType:any) {
        let custDiscountdatalength = 0;
        let url =
            "/subscriber/fetchCustomerDiscountDetailServiceLevel/" +
            custId +
            "?isExpiredRequired=" +
            (discountType === "changeDiscount");
        this.customerManagementService.getMethod(url).subscribe(
            (response: any) => {
                this.custCustDiscountList = [...this.custCustDiscountList, ...response.discountDetails];

                while (custDiscountdatalength < this.custCustDiscountList.length) {
                    // const planurl =
                    //   "/postpaidplan/" +
                    //   this.custCustDiscountList[custDiscountdatalength].planId;
                    // this.customerManagementService
                    //   .getMethod(planurl)
                    //   .subscribe((response: any) => {
                    //     this.dataDiscountPlan.push(response.postPaidPlan);
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
                    icon: "far fa-times-circle"
                });
            }
        );
    }

    getPlanChangeGroup(custData:any) {
        // this.newPlanGroupId = null;
        let url = "/getPlanGroupByFilters";
        let data = {
            changePlanType: this.changePlanTypeSelection.toLowerCase(),
            custId: custData.id,
            planGroupId: custData.plangroupid,
            customerServiceMappingID: custData.planMappingList[0].custServiceMappingId
        };
        this.customerManagementService.postMethod(url, data).subscribe(
            (response: any) => {
                this.planGroupChanges = response;
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

    changePlanSelection(e:any, data:any, i:any, isChildPlan:any, childIdx:any) {
        if (e.checked) {
            let url = "/getPlansByFilters";
            var payload = {
                changePlanType: this.changePlanTypeSelection.toLowerCase(),
                custId: data.custId,
                serviceId: data.serviceId,
                customerServiceMappingID: data.customerServiceMappingId
            };
            this.customerManagementService.postMethod(url, payload).subscribe(
                (response: any) => {
                    this.newPlanData[data.connection_no] = response.filter(
                        (item:any) => item.plantype == this.custType
                    );
                    console.log(this.newPlanData[data.connection_no]);
                    this.newPlanData[data.connection_no].forEach((e:any) => {
                        if (e.plantype == "Postpaid") {
                            e.label = e.name;
                        } else {
                            // if (e.planGroup !== "Bandwidthbooster") {
                            if (e.quotatype == "Data") {
                                e.label =
                                    e.name +
                                    ` (${data.is_qosv ? e.quota + " " + e.quotaUnit : ""}
              ${e.quotaResetInterval == "Total" ? "" : "/" + e.quotaResetInterval + " - "}${e.validity
                                    } ${e.unitsOfValidity} ${e.qospolicyName ? "-" + e.qospolicyName : ""})`;
                            } else if (e.quotatype == "Time") {
                                e.label =
                                    e.name +
                                    ` (${e.quotatime} ${e.quotaunittime}${e.quotaResetInterval == "Total" ? "" : "/" + e.quotaResetInterval + " - "
                                    }${e.validity} ${e.unitsOfValidity} ${e.qospolicyName ? "-" + e.qospolicyName : ""
                                    })`;
                            } else if (e.quotatype == "Both") {
                                e.label =
                                    e.name +
                                    ` (${data.is_qosv ? e.quota + " " + e.quotaUnit : ""}${e.quotaResetInterval == "Total" ? "" : "/" + e.quotaResetInterval + " and "
                                    }${e.quotatime} ${e.quotaunittime}${e.quotaResetInterval == "Total" ? "" : "/" + e.quotaResetInterval
                                    }  - ${e.validity} ${e.unitsOfValidity} ${e.qospolicyName ? "-" + e.qospolicyName : ""
                                    })`;
                            } else {
                                e.label = e.name;
                            }
                            // } else e.label = e.name;
                        }
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
        } else {
            if (isChildPlan) {
                this.childCustList[childIdx].serviceMappingData[i].changeFlag = false;
                this.childCustList[childIdx].serviceMappingData[i].newPlanSelection = null;
            } else {
                this.custServiceData[i].changeFlag = false;
                this.custServiceData[i].newPlanSelection = null;
            }
        }
    }

    getPlanDetailById(event:any, custServiceMapping:any) {
        this.planDiscount = 0;
        // this.planDropdownInChageData = [];
        this.plansArray = this.fb.array([]);
        this.ifPlanSelectChanePlan = true;

        this.planSelected = event.value;
        const url = "/postpaidplan/" + this.planSelected;
        this.customerManagementService.getMethod(url).subscribe(
            (response: any) => {
                this.selPlanData = response.postPaidPlan;

                const date = new Date();
                this.selPlanData.activationDate = this.datePipe.transform(date, "dd-MM-yyyy");
                this.selPlanData.expiryDate = date.setDate(date.getDate() + this.selPlanData.validity);
                this.selPlanData.expiryDate = this.datePipe.transform(
                    this.selPlanData.expiryDate,
                    "dd-MM-yyyy"
                );
                this.selPlanData.finalAmount = this.selPlanData.offerprice + this.selPlanData.taxamount;
                let discountData = this.custCustDiscountList.find(
                    (element:any) => element.custId === custServiceMapping.custId
                );

                if (
                    discountData &&
                    discountData.discountType === "Recurring" &&
                    (discountData.discountExpiryDate).isSameOrAfter( "day") &&
                    (discountData.discount > 0 || discountData.discount < 0)
                ) {
                    this.confirmationService.confirm({
                        message: "Do you want to apply " + custServiceMapping.discount + " % of  Discount?",
                        header: "Change Discount Confirmation",
                        icon: "pi pi-info-circle",
                        accept: () => {
                            this.planDiscount = custServiceMapping.discount;
                            this.updateDiscountFromService(event.value, event.index);
                            //   this.custServiceData[this.currentIndex].newDiscount = discountData.discount;
                            custServiceMapping.newDiscount = custServiceMapping.discount;
                            console.log(" custServiceMapping.newDiscount", custServiceMapping.newDiscount);
                        },
                        reject: () => {
                            this.messageService.add({
                                severity: "info",
                                summary: "Rejected",
                                detail: "You have rejected"
                            });
                            this.planDiscount = 0;
                            //   this.custServiceData[this.currentIndex].newDiscount = 0;
                            custServiceMapping.newDiscount = 0;
                            this.updateDiscountFromService(event.value, event.index);
                        }
                    });
                } else if (
                    discountData &&
                    discountData.discountType === "Recurring" &&
                    (discountData.discountExpiryDate).isSameOrAfter( "day") &&
                    discountData.discount < 0
                ) {
                    this.planDiscount = discountData.discount;
                    //   this.custServiceData[this.currentIndex].newDiscount = 0;
                    custServiceMapping.newDiscount = 0;
                    this.updateDiscountFromService(event.value, event.index);
                } else {
                    this.planDiscount = 0;
                    //   this.custServiceData[this.currentIndex].newDiscount = 0;
                    custServiceMapping.newDiscount = 0;
                    this.updateDiscountFromService(event.value, event.index);
                }
                if (this.plansForChargeByCust != null && this.plansForChargeByCust.length > 0) {
                    let index = this.plansForChargeByCust.findIndex(
                        item => item.connection_no == custServiceMapping.connection_no
                    );
                    if (index != -1) this.plansForChargeByCust.splice(index);
                }
                this.plansForChargeByCust.push({
                    connection_no: custServiceMapping.connection_no,
                    custId: custServiceMapping.custId,
                    planId: this.selPlanData.id,
                    planName: this.selPlanData.name,
                    unitsOfValidity: this.selPlanData.unitsOfValidity,
                    validity: this.selPlanData.validity,
                    discount: custServiceMapping.discount,
                    discountExpiryDate: custServiceMapping.discountExpiryDate,
                    discountType: custServiceMapping.discountType
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

    updateDiscountFromService(id:any, index:any) {
        if (this.ifPlanGroup && this.changePlanForm.value.purchaseType !== "Addon") {
            this.custServiceData.find(serviceData => serviceData.newplan === id).discount =
                this.planDiscount;
            this.finalOfferPrice = 0;
            this.custServiceData.forEach(custChild => {
                if (index !== "") {
                    this.groupOfferPrices[index] = Number(this.selPlanData.offerprice);
                }
                if (custChild.newplan) {
                    this.customerManagementService
                        .getofferPriceWithTax(custChild.newplan, custChild.discount, this.planGroupSelected)
                        .subscribe((response: any) => {
                            if (response.result.finalAmount) {
                                this.finalOfferPrice =
                                    this.finalOfferPrice + Number(response.result.finalAmount.toFixed(3));
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
            this.offerPrice = 0;
            this.changePlanForm.value.discount = this.planDiscount;
            this.finalOfferPrice = 0;
            this.offerPrice += Number(this.selPlanData.offerprice);
            this.customerManagementService
                .getofferPriceWithTax(this.changePlanForm.value.planId, this.planDiscount)
                .subscribe((response: any) => {
                    if (response.result.finalAmount) {
                        this.finalOfferPrice = Number(response.result.finalAmount.toFixed(3));
                    } else {
                        this.finalOfferPrice = 0;
                    }
                });
        }
        if (
            this.custDetails.planMappingList[0].billTo == "ORGANIZATION" ||
            this.custDetails.planMappingList[0].billTo == "Organization"
        ) {
            this.confirmationService.confirm({
                message: "The customer is bill_to organization, do you want to continue?",
                header: "Change Plan Confirmation",
                icon: "pi pi-info-circle",
                accept: () => {
                    this.subisuChange = true;
                    this.plansArray.push(
                        this.fb.group({
                            planId: this.selPlanData.id,
                            name: this.selPlanData.displayName,
                            service: this.selPlanData.serviceId,
                            validity: this.selPlanData.validity,
                            discount: this.selPlanData.discount,
                            billTo: "ORGANIZATION",
                            offerPrice: this.selPlanData.offerprice,
                            newAmount:
                                this.selPlanData.newAmount != null
                                    ? this.selPlanData.newAmount
                                    : this.selPlanData.offerprice,
                            chargeName: this.selPlanData.chargeList[0].charge.name,
                            isInvoiceToOrg: this.custDetails.isInvoiceToOrg,
                            istrialplan: this.custDetails.istrialplan
                            // invoiceType: this.customerGroupForm.value.invoiceType,
                        })
                    );
                    // }
                    // $("#selectPlanGroup").modal("show");
                },
                reject: () => {
                    this.subisuChange = false;
                    this.messageService.add({
                        severity: "info",
                        summary: "Rejected",
                        detail: "You have rejected"
                    });
                    // $("#selectPlanChange").modal("show");
                }
            });
        }
        // }
    }
    planGroupData: any = {};
    selectPlanGroup(e:any, childIdx:any) {
        let planMappingListData: any[] = [];
        let data: any;

        this.planGroupChanges.forEach((element:any) => {
            if (e.value == element.planGroupId) data = element;
        });
        data.planMappingList.forEach((d:any) => {
            return planMappingListData.push(d);
        });
        if (childIdx != -1) {
            this.planGroupData[this.childCustList[childIdx].id] = planMappingListData;
        } else {
            this.planGroupData[this.custDetails.id] = planMappingListData;
        }
    }

    selectPlanCategory(event:any, childIdx:any, custData:any) {
        if (event.value === "individual") {
            if (childIdx != -1) {
                this.childCustList[childIdx].newPlanGroupId = null;
                this.childCustList[childIdx].isAddCharge = false;
            } else {
                this.newPlanGroupId = null;
                this.isAddCharge = false;
            }
        }
        if (childIdx != -1) {
            this.childCustList[childIdx].serviceMappingData.map((item:any) => {
                item.changeFlag = false;
                item.newPlanSelection = null;
            });
        } else {
            this.custServiceData.map(item => {
                item.changeFlag = false;
                item.newPlanSelection = null;
            });
        }
        if (event.value === "groupPlan") {
            this.getPlanChangeGroup(custData);
        }
        // this.planMappingListData = [];
        // let data: any;
        // this.planGroupChanges.forEach(element => {
        //   if (e.value == element.planGroupId) data = element;
        // });
        // data.planMappingList.forEach(d => {
        //   this.planMappingListData.push(d);
        // });
    }

    filterPlanGroup(service:any, childIdx:any) {
        if (childIdx != -1) {
            const planGroup = this.planGroupData[this.childCustList[childIdx]?.id];
            if (planGroup) {
                planGroup.forEach((element:any) => {
                    if (element.service == service) element.inactive = false;
                    else element.inactive = true;
                });
            }
        } else {
            const planGroup = this.planGroupData[this.custDetails?.id];
            if (planGroup) {
                planGroup.forEach((element:any) => {
                    if (element.service == service) element.inactive = false;
                    else element.inactive = true;
                });
            }
        }
    }

    getStatusClass(planStatus:any, workflowStatus:any) {
        let status = planStatus.toLowerCase();
        let statusWorkflow = workflowStatus ? workflowStatus.toLowerCase() : "";

        if (statusWorkflow == "new activation" || statusWorkflow == "rejected") {
            if (statusWorkflow == "new activation") return "badge badge-success";
            else return "badge badge-danger";
        } else {
            switch (status) {
                case "active":
                case "ingrace":
                    return "badge badge-success";
                case "terminate":
                case "stop":
                case "inactive":
                case "expired":
                    return "badge badge-danger";
                    break;
                case "hold":
                case "disable":
                    return "badge badge-primary";
                default:
                    break;
            }
        }
        return "";
    }

    getStatus(planStatus:any, workflowStatus:any) {
        let statusWorkflow = workflowStatus ? workflowStatus.toLowerCase() : "";
        if (statusWorkflow == "new activation" || statusWorkflow == "rejected") {
            return workflowStatus.toUpperCase();
        } else {
            return planStatus.toUpperCase();
        }
    }

    resetFormType() {
        this.changePlanSubmitted = false;
        this.changePlanNewForm.reset();
        this.changePlanNewForm.patchValue({
            isPaymentReceived: "false",
            billableCustomerId: this.custDetails.id,
            isTriggerCoaDm: true
        });
        this.custServiceData.forEach(element => {
            element.changeFlag = false;
            element.newPlanSelection = null;
        });
        this.childCustList.forEach((element:any) => {
            element.serviceMappingData.forEach((item:any) => {
                item.changeFlag = false;
                item.newPlanSelection = null;
            });
        });
        this.childPlanGroup.forEach((element:any) => {
            element.serviceMappingData.forEach((item:any) => {
                item.changeFlag = false;
                item.newPlanSelection = null;
            });
        });
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

    async selectedCustChange(event:any) {
        this.showParentCustomerModel = false;
        this.selectedParentCust = event;

        this.billableCustList = [
            {
                id: this.selectedParentCust.id,
                name: this.selectedParentCust.name
            }
        ];
        // this.changePlanForm.patchValue({
        //   billableCustomerId: this.selectedParentCust.id,
        // });
        this.changePlanNewForm.patchValue({
            billableCustomerId: this.selectedParentCust.id
        });
    }
    closeParentCust() {
        this.showParentCustomerModel = false;
    }

    removeSelParentCust(type:any) {
        this.selectedParentCust = [];
        this.billableCustList = [];
        this.changePlanForm.patchValue({
            billableCustomerId: null
        });
    }

    paymentFlagToggle(e:any) {
        if (e.target.checked) {
            this.changePlanNewForm.controls["paymentOwnerId"].setValidators(Validators.required);
            if (this.paymentOwnerRequired === false) {
                // this logic is make payment owner mandetory or non mandetory with setting parameter
                this.changePlanNewForm.controls["paymentOwnerId"].clearValidators();
            } else {
                this.changePlanNewForm.controls["paymentOwnerId"].setValidators(Validators.required);
            }
            this.changePlanNewForm.controls["paymentOwnerId"].updateValueAndValidity();
        } else {
            this.changePlanNewForm.controls["paymentOwnerId"].clearValidators();
        }
        this.changePlanNewForm.controls["paymentOwnerId"].updateValueAndValidity();
        this.changePlanNewForm.patchValue({
            isPaymentReceived: e.target.checked
        });
    }
    selectedStaff: any = [];
    staffCustList: { id: number; name: string }[] = [];
    paymentOwnerId:[];
    displayDTVHistory = false;
    staffid:any;
    modalOpenStaff() {
        this.displayDTVHistory = true;
        // $("#selectStaff").modal("show");
        this.selectedStaff = [];
    }
    selectedStaffChange(selectedStaff: any) {
        this.staffCustList = [
            {
                id: Number(selectedStaff.id),
                name: selectedStaff.firstname
            }
        ];
        this.changePlanForm.patchValue({
            paymentOwnerId: selectedStaff.id
        });
        this.changePlanNewForm.patchValue({
            paymentOwnerId: selectedStaff.id
        });
        this.paymentOwnerId = selectedStaff.id;
        this.displayDTVHistory = false;
        // this.closeStaff();
    }
    closeStaff() {
        this.displayDTVHistory = false;
        // $("#selectStaff").modal("hide");
    }
    removeSelStaff() {
        this.staffCustList = [];
        this.staffid = null;
    }

    private hasSelectedPlanCategory(planCategory: string): boolean {
        return this.childCustList.some((item:any) => item.selectedPlanCategory === planCategory);
    }
    // Helper function to check if any item in the array has a null value for the specified field
    private hasNullValue(items: any[], fieldName: string): boolean {
        return items.some(item => item[fieldName] == null);
    }

    // Helper function to check if any item in the array has a non-null value for the specified field
    private hasNonNullValue(items: any[], fieldCheckbox: string, fieldName: string): boolean {
        return items.some(item => item[fieldName] != null);
    }

    changePlanGroupBulk() {
        this.changePlanSubmitted = true;
        let isOnePlanSelected = true;
        let isAnyFieldNull = false;
        console.log("changePlanNewForm ::", this.changePlanNewForm); //this is for groupplan
        if (this.changePlanNewForm.value.isTriggerCoaDm == null) {
            this.changePlanNewForm.patchValue({
                isTriggerCoaDm: true
            });
        }
        if (!this.changePlanNewForm.valid) {
            return;
        }

        const isAddon = this.changePlanTypeSelection === "Addon";
        const hasIndividualSelected = this.hasSelectedPlanCategory("individual");
        const hasGroupPlanSelected = this.hasSelectedPlanCategory("groupPlan");
        if (this.changePlanTypeSelection == null || this.changePlanTypeSelection == "") {
            this.messageService.add({
                severity: "error",
                summary: "Required Details",
                detail: "Please select Change Plan Type.",
                icon: "far fa-times-circle"
            });
            return;
        }
        if (!isAddon && this.childCustList.length === 0) {
            if (this.selectedPlanCategory === "individual") {
                isOnePlanSelected = this.hasNonNullValue(
                    this.custServiceData,
                    "changeFlag",
                    "newPlanSelection"
                );
            } else if (this.selectedPlanCategory === "groupPlan") {
                isAnyFieldNull = this.hasNullValue(this.custServiceData, "newPlanSelection");
            }
        } else if (
            !isAddon &&
            (this.selectedPlanCategory == null || this.selectedPlanCategory === "")
        ) {
            for (const item of this.childCustList) {
                if (item.selectedPlanCategory === "individual") {
                    isOnePlanSelected = this.hasNonNullValue(
                        item.serviceMappingData,
                        "changeFlag",
                        "newPlanSelection"
                    );
                } else if (item.selectedPlanCategory === "groupPlan") {
                    isAnyFieldNull = this.hasNullValue(item.serviceMappingData, "newPlanSelection");
                    if (isAnyFieldNull) {
                        this.errorMsg();
                        return;
                    }
                }
            }
        } else if (isAddon) {
            isOnePlanSelected = this.hasNonNullValue(
                this.custServiceData,
                "changeFlag",
                "newPlanSelection"
            );
            if (!isOnePlanSelected) {
                for (const item of this.childCustList) {
                    if (this.hasNonNullValue(item.serviceMappingData, "changeFlag", "newPlanSelection")) {
                        isOnePlanSelected = true;
                        break;
                    } else {
                        isOnePlanSelected = true;
                        isAnyFieldNull = false;
                    }
                }
            }
        } else {
            if (this.selectedPlanCategory === "individual") {
                isOnePlanSelected = this.hasNonNullValue(
                    this.custServiceData,
                    "changeFlag",
                    "newPlanSelection"
                );
                if (!isOnePlanSelected) {
                    for (const item of this.childCustList) {
                        if (hasIndividualSelected) {
                            isOnePlanSelected = this.hasNonNullValue(
                                item.serviceMappingData,
                                "changeFlag",
                                "newPlanSelection"
                            );
                            if (isOnePlanSelected) break;
                        } else if (hasGroupPlanSelected) {
                            isAnyFieldNull = this.hasNullValue(item.serviceMappingData, "newPlanSelection");
                            break;
                        }
                    }
                }
            } else if (this.selectedPlanCategory === "groupPlan") {
                isAnyFieldNull = this.hasNullValue(this.custServiceData, "newPlanSelection");
                if (isAnyFieldNull) {
                    for (const item of this.childCustList) {
                        if (hasIndividualSelected) {
                            isOnePlanSelected = this.hasNonNullValue(
                                item.serviceMappingData,
                                "changeFlag",
                                "newPlanSelection"
                            );
                            break;
                        } else if (hasGroupPlanSelected) {
                            isAnyFieldNull = this.hasNullValue(item.serviceMappingData, "newPlanSelection");
                            break;
                        }
                    }
                }
            }
        }

        if (!isOnePlanSelected || isAnyFieldNull) {
            this.errorMsg();
            return;
        }
        console.log("Called API ::::::::::::: ");

        if (this.changePlanNewForm.value.isPaymentReceived) {
            this.prepareChangePlanPayload(null);
        } else {
            this.openRecordPayment();
        }
    }

    prepareChangePlanPayload(recordPaymentPojo:any) {
        if (this.changePlanTypeSelection == "Renew") {
            let planBindWithOldPlans: { newPlanId: any; custServiceMappingId: any; oldPlanId: any; discount: any }[] = [];
            let planList: any[] = [];
            let changePlanRequestDTOList = [];
            let pojo: {
                purchaseType: string;
                isPaymentReceived: any;
                remarks: any;
                paymentOwnerId: any;
                billableCustomerId: any;
                addonStartDate: string;
                addonEndDate: string;
                ChangePlanCategory: string;
                isAdvRenewal: boolean;
                custId: any;
                recordPaymentDTO: any;
                isRefund: boolean;
                planBindWithOldPlans: any[];
                newPlanList: any[];
                planMappingList: any | null;
                isParent: boolean;
                planGroupId?: any;
                custServiceMappingId?: any; // Added custServiceMappingId property
                planId?: any; // Added planId property
            } = {
                purchaseType: "",
                isPaymentReceived: undefined,
                remarks: undefined,
                paymentOwnerId: undefined,
                billableCustomerId: undefined,
                addonStartDate: "",
                addonEndDate: "",
                ChangePlanCategory: "",
                isAdvRenewal: false,
                custId: undefined,
                recordPaymentDTO: undefined,
                isRefund: false,
                planBindWithOldPlans: [] as { newPlanId: any; custServiceMappingId: any; oldPlanId: any; discount: any }[],
                newPlanList: [],
                planMappingList: undefined,
                isParent: false
            };
            if (this.selectedPlanCategory == "groupPlan") {
                let pojo: {
                    purchaseType: string;
                    isPaymentReceived: any;
                    remarks: any;
                    paymentOwnerId: any;
                    billableCustomerId: any;
                    addonStartDate: string | null;
                    addonEndDate: string | null;
                    ChangePlanCategory: string;
                    isAdvRenewal: boolean;
                    custId: any;
                    recordPaymentDTO: any;
                    isRefund: boolean;
                    planBindWithOldPlans: any[];
                    newPlanList: any[];
                    planMappingList: any | null;
                    isParent: boolean;
                    planGroupId?: any; // Added planGroupId property
                    custServiceMappingId?: any; // Added custServiceMappingId property
                    planId?: any; // Added planId property
                } = {
                    purchaseType: "Renew",
                    isPaymentReceived: this.changePlanNewForm.value.isPaymentReceived,
                    remarks: this.changePlanNewForm.value.remarks,
                    paymentOwnerId: this.changePlanNewForm.value.paymentOwnerId,
                    billableCustomerId: this.changePlanNewForm.value.billableCustomerId,
                    addonStartDate: null as string | null,
                    addonEndDate: null as string | null,
                    ChangePlanCategory: "",
                    isAdvRenewal: false,
                    // custId: this.custDetails.id, // Removed as it is not a valid property
                    recordPaymentDTO: {},
                    isRefund: false,
                    planBindWithOldPlans: planBindWithOldPlans,
                    newPlanList: planList,
                    planMappingList: null as any[] | null,
                    isParent: true,
                    custId: undefined
                };
                this.custServiceData.forEach(element => {
                    if (element.newPlanSelection != null) {
                        let data = {
                            newPlanId: element.newPlanSelection,
                            custServiceMappingId: element.customerServiceMappingId,
                            oldPlanId: element.planId,
                            discount: element.newDiscount
                        };
                        planList.push(element.newPlanSelection);
                        planBindWithOldPlans.push(data);
                        pojo["planGroupId"] = this.newPlanGroupId;
                        pojo["planBindWithOldPlans"] = planBindWithOldPlans;
                        pojo["custServiceMappingId"] = element.customerServiceMappingId;
                        pojo["newPlanList"] = planList;
                        (pojo as { planId?: any })["planId"] = element.newPlanSelection;
                    }
                });
                changePlanRequestDTOList.push(pojo);
            } else if (this.selectedPlanCategory == "individual") {
                this.custServiceData.forEach(element => {
                    if (element.newPlanSelection != null) {
                        let pojo: {
                            purchaseType: string;
                            isPaymentReceived: any;
                            remarks: any;
                            paymentOwnerId: any;
                            billableCustomerId: any;
                            addonStartDate: string | null;
                            addonEndDate: string | null;
                            ChangePlanCategory: string;
                            isAdvRenewal: boolean;
                            custId: any;
                            recordPaymentDTO: any;
                            isRefund: boolean;
                            planBindWithOldPlans: any[];
                            newPlanList: any[] | null;
                            planMappingList: any[] | null;
                            isParent: boolean;
                            discount?: any; // Added discount property
                            planId?: any; // Added planId property
                            custServiceMappingId?: any; // Added custServiceMappingId property
                        } = {
                            purchaseType: "Renew",
                            isPaymentReceived: this.changePlanNewForm.value.isPaymentReceived,
                            remarks: this.changePlanNewForm.value.remarks,
                            paymentOwnerId: this.changePlanNewForm.value.paymentOwnerId,
                            billableCustomerId: this.changePlanNewForm.value.billableCustomerId,
                            addonStartDate: null as string | null,
                            addonEndDate: null as string | null,
                            ChangePlanCategory: "",
                            isAdvRenewal: false,
                            custId: this.custDetails.id,
                            recordPaymentDTO: {},
                            isRefund: false,
                            planBindWithOldPlans: planBindWithOldPlans,
                            newPlanList: null as any[] | null,
                            planMappingList: null as any[] | null,
                            isParent: true
                        };

                        pojo["discount"] = element.newDiscount;
                        pojo["planId"] = element.newPlanSelection;
                        pojo["custServiceMappingId"] = element.customerServiceMappingId;
                        changePlanRequestDTOList.push(pojo);
                    }
                });
            }

            if (this.childCustList.length > 0) {
                this.childCustList.forEach((childCust: any) => {
                    let childPlanBindWithOldPlans: any[] = [];
                    let childPlanList: any[] = [];
                    if (childCust.serviceMappingData.length > 0) {
                        if (childCust.selectedPlanCategory != null && childCust.selectedPlanCategory != "") {
                            if (childCust.selectedPlanCategory == "groupPlan") {
                                let pojo: {
                                    purchaseType: string;
                                    isPaymentReceived: any;
                                    remarks: any;
                                    paymentOwnerId: any;
                                    billableCustomerId: any;
                                    addonStartDate: string | null;
                                    addonEndDate: string | null;
                                    ChangePlanCategory: string;
                                    isAdvRenewal: boolean;
                                    custId: any;
                                    recordPaymentDTO: any;
                                    isRefund: boolean;
                                    planBindWithOldPlans: any[];
                                    newPlanList: any[];
                                    planMappingList: any[] | null;
                                    isParent: boolean;
                                    planGroupId?: any;
                                    planId?: any;
                                    custServiceMappingId?: any;   // added
                                    discount?: any;               // added
                                } = {
                                    purchaseType: "Renew",
                                    isPaymentReceived: this.changePlanNewForm.value.isPaymentReceived,
                                    remarks: this.changePlanNewForm.value.remarks,
                                    paymentOwnerId: this.changePlanNewForm.value.paymentOwnerId,
                                    billableCustomerId: this.changePlanNewForm.value.billableCustomerId,
                                    addonStartDate: null,
                                    addonEndDate: null,
                                    ChangePlanCategory: "",
                                    isAdvRenewal: false,
                                    custId: childCust.id,
                                    recordPaymentDTO: {},
                                    isRefund: false,
                                    planBindWithOldPlans: childPlanBindWithOldPlans,
                                    newPlanList: childPlanList,
                                    planMappingList: null as any[] | null,
                                    isParent: false
                                };
            
                                childCust.serviceMappingData.forEach((element: any) => {
                                    if (element.newPlanSelection != null) {
                                        let data = {
                                            newPlanId: element.newPlanSelection,
                                            custServiceMappingId: element.customerServiceMappingId,
                                            oldPlanId: element.planId,
                                            discount: element.newDiscount
                                        };
                                        childPlanList.push(element.newPlanSelection);
                                        childPlanBindWithOldPlans.push(data);
                                        pojo["planGroupId"] = childCust.newPlanGroupId;
                                        pojo["planBindWithOldPlans"] = childPlanBindWithOldPlans;
                                        pojo["custServiceMappingId"] = element.customerServiceMappingId;
                                        pojo["newPlanList"] = childPlanList;
                                        pojo["planId"] = element.newPlanSelection;
                                        pojo["discount"] = element.newDiscount;  // ✅
                                    }
                                });
                                changePlanRequestDTOList.push(pojo);
                            } else if (childCust.selectedPlanCategory == "individual") {
                                childCust.serviceMappingData.forEach((element: any) => {
                                    if (element.newPlanSelection != null) {
                                        let pojo: {
                                            purchaseType: string;
                                            isPaymentReceived: any;
                                            remarks: any;
                                            paymentOwnerId: any;
                                            billableCustomerId: any;
                                            addonStartDate: string | null;
                                            addonEndDate: string | null;
                                            ChangePlanCategory: string;
                                            isAdvRenewal: boolean;
                                            custId: any;
                                            recordPaymentDTO: any;
                                            isRefund: boolean;
                                            planBindWithOldPlans: any[];
                                            newPlanList: any[] | null;
                                            planMappingList: any[] | null;
                                            isParent: boolean;
                                            planId?: any;
                                            custServiceMappingId?: any;
                                            discount?: any;   // added
                                        } = {
                                            purchaseType: "Renew",
                                            isPaymentReceived: this.changePlanNewForm.value.isPaymentReceived,
                                            remarks: this.changePlanNewForm.value.remarks,
                                            paymentOwnerId: this.changePlanNewForm.value.paymentOwnerId,
                                            billableCustomerId: this.changePlanNewForm.value.billableCustomerId,
                                            addonStartDate: null,
                                            addonEndDate: null,
                                            ChangePlanCategory: "",
                                            isAdvRenewal: false,
                                            custId: childCust.id,
                                            recordPaymentDTO: {},
                                            isRefund: false,
                                            planBindWithOldPlans: childPlanBindWithOldPlans,
                                            newPlanList: null as any[] | null,
                                            planMappingList: null as any[] | null,
                                            isParent: false
                                        };
                                        pojo["discount"] = element.newDiscount;  // ✅
                                        pojo["planId"] = element.newPlanSelection;
                                        pojo["custServiceMappingId"] = element.customerServiceMappingId;
                                        changePlanRequestDTOList.push(pojo);
                                    }
                                });
                            }
                        }
                    }
                });
            }
            
            let finalRenewData: any = {
                changePlanRequestDTOList: changePlanRequestDTOList,
                recordPayment: null
            };
            if (recordPaymentPojo != null) {
                finalRenewData.recordPayment = recordPaymentPojo;
            }
            this.addChargeDataInRenew(finalRenewData);
        } else if (this.changePlanTypeSelection == "Addon") {
            let changePlanRequestDTOList: { connectionNo?: any; serviceName?: any; serviceNickName?: any; purchaseType: string; planId: any; isPaymentReceived: any; remarks: any; paymentOwnerId: any; billableCustomerId: any; addonStartDate: string; addonEndDate: string; ChangePlanCategory: string; isAdvRenewal: boolean; custId: any; recordPaymentDTO: {} | {}; isRefund: boolean; discount: any; planBindWithOldPlans: any[]; newPlanList: any; planMappingList: any; custServiceMappingId: any; isParent: boolean; }[] = [];
            this.custServiceData.forEach(element => {
                if (element.newPlanSelection != null) {
                    let addonPojo: {
                        connectionNo: any;
                        serviceName: any;
                        serviceNickName: any;
                        purchaseType: string;
                        planId: any;
                        isPaymentReceived: any;
                        remarks: any;
                        paymentOwnerId: any;
                        billableCustomerId: any;
                        addonStartDate: string | null;
                        addonEndDate: string | null;
                        ChangePlanCategory: string;
                        isAdvRenewal: boolean;
                        custId: any;
                        recordPaymentDTO: any;
                        isRefund: boolean;
                        discount: any;
                        planBindWithOldPlans: { newPlanId: any; custServiceMappingId: any; oldPlanId: any; discount: any }[];
                        newPlanList: any[];
                        planMappingList: any[] | null;
                        custServiceMappingId: any;
                        isParent: boolean;
                        planGroupId?: any;  
                    } = {
                        connectionNo: element.connectionNo,
                        serviceName: element.serviceName,
                        serviceNickName: element.serviceName,
                        purchaseType: "Addon",
                        planId: element.newPlanSelection,
                        isPaymentReceived: this.changePlanNewForm.value.isPaymentReceived,
                        remarks: this.changePlanNewForm.value.remarks,
                        paymentOwnerId: this.changePlanNewForm.value.paymentOwnerId,
                        billableCustomerId: this.changePlanNewForm.value.billableCustomerId,
                        addonStartDate: this.isoStartDateString,
                        addonEndDate: this.isoDateString,
                        ChangePlanCategory: "",
                        isAdvRenewal: false,
                        custId: this.custDetails.id,
                        recordPaymentDTO: {},
                        isRefund: false,
                        discount: element.newDiscount,
                        planBindWithOldPlans: [] as { newPlanId: any; custServiceMappingId: any; oldPlanId: any; discount: any }[],
                        newPlanList: [],
                        planMappingList: null as any[] | null,
                        custServiceMappingId: element.customerServiceMappingId,
                        isParent: true
                    };
                
                    if (this.custDetails.plangroupid != null) {
                        addonPojo.planGroupId = this.custDetails.plangroupid;  
                    }
                
                    changePlanRequestDTOList.push(addonPojo);
                }
                
            });
            this.childCustList.forEach((childCust:any) => {
                childCust.serviceMappingData.forEach((element:any) => {
                    if (element.newPlanSelection != null) {
                        let addonPojo = {
                            purchaseType: "Addon",
                            planId: element.newPlanSelection,
                            // planGroupId: childCust.newPlanGroupId,
                            isPaymentReceived: this.changePlanNewForm.value.isPaymentReceived,
                            remarks: this.changePlanNewForm.value.remarks,
                            paymentOwnerId: this.changePlanNewForm.value.paymentOwnerId,
                            billableCustomerId: this.changePlanNewForm.value.billableCustomerId,
                            addonStartDate: this.isoStartDateString,
                            addonEndDate: this.isoDateString,
                            ChangePlanCategory: "",
                            isAdvRenewal: false,
                            custId: childCust.id,
                            recordPaymentDTO: {},
                            isRefund: false,
                            discount: element.newDiscount,
                            planBindWithOldPlans: [] as { newPlanId: any; custServiceMappingId: any; oldPlanId: any; discount: any }[],
                            newPlanList: [] as any[],
                            planMappingList: null as any[] | null,
                            custServiceMappingId: element.customerServiceMappingId,
                            isParent: false,
                            planGroupId: any,
                        };
                        if (childCust.plangroupid != null) {
                            addonPojo["planGroupId"] = childCust.plangroupid;
                        }
                        changePlanRequestDTOList.push(addonPojo);
                    }
                });
            });

            let finalAddonData: any = {
                changePlanRequestDTOList: changePlanRequestDTOList,
                recordPayment: null as any,
                isTriggerCoaDm: this.changePlanNewForm.value.isTriggerCoaDm
            };
            if (recordPaymentPojo != null) {
                finalAddonData.recordPayment = recordPaymentPojo;
            }
            this.addOnPlans(finalAddonData);
        } else {
            let deactivatePlanReqModels: { billToOrg: boolean; newPlanGroupId: any; planGroupId: any; newPlanId: any; custServiceMappingId: any; discount: any; }[] = [];
            let deactivatePlanReqModelsChild: { billToOrg: boolean; newPlanGroupId: any; planGroupId: any; newPlanId: any; custServiceMappingId: any; discount: any; }[] = [];
            let finalData = {
                deactivatePlanReqDTOS: [] as { billToOrg: boolean; newPlanGroupId: any; planGroupId: any; newPlanId: any; custServiceMappingId: any; discount: any; }[],
                recordPayment: null as any,
                skipQuotaUpdate: this.skipQuotaUpdate === null || this.skipQuotaUpdate === undefined ? false : this.skipQuotaUpdate
            };
            if (
                this.selectedPlanCategory != null &&
                this.selectedPlanCategory !== undefined &&
                this.selectedPlanCategory != ""
            ) {
                this.custServiceData.forEach(element => {
                    if (element.newPlanSelection != null) {
                        let data = {
                            billToOrg: false,
                            newPlanGroupId: this.newPlanGroupId,
                            planGroupId: this.custDetails.plangroupid,
                            newPlanId: element.newPlanSelection,
                            custServiceMappingId: element.customerServiceMappingId,
                            discount: element.newDiscount
                        };
                        deactivatePlanReqModels.push(data);
                    }
                });
                if (deactivatePlanReqModels.length > 0) {
                    finalData.deactivatePlanReqDTOS.push({
                        custId: this.custDetails.id,
                        deactivatePlanReqModels: deactivatePlanReqModels,
                        planGroupChange: this.selectedPlanCategory === "groupPlan",
                        planGroupFullyChanged: this.selectedPlanCategory === "groupPlan",
                        paymentOwner: "yogesh Patil",
                        paymentOwnerId: this.changePlanNewForm.value.paymentOwnerId,
                        billableCustomerId: this.changePlanNewForm.value.billableCustomerId,
                        isParent: true,
                        remark: this.changePlanNewForm.value.remarks,
                        changePlanDate: this.ChangePLanDateSelection,
                    } as any);
                    
                }
            }

            this.childCustList.forEach((childCust: { selectedPlanCategory: string; serviceMappingData: any[]; newPlanGroupId: any; plangroupid: any; id: any; }) => {
                if (
                    childCust.selectedPlanCategory != null &&
                    childCust.selectedPlanCategory !== undefined &&
                    childCust.selectedPlanCategory != ""
                ) {
                    deactivatePlanReqModelsChild = [];
                    childCust.serviceMappingData.forEach(element => {
                        if (element.newPlanSelection) {
                            let changeDetails = {
                                billToOrg: false,
                                newPlanGroupId: childCust.newPlanGroupId,
                                planGroupId: childCust.plangroupid,
                                newPlanId: element.newPlanSelection,
                                custServiceMappingId: element.customerServiceMappingId,
                                discount: element.newDiscount
                            };
                            deactivatePlanReqModelsChild.push(changeDetails);
                        }
                    });
                    if (deactivatePlanReqModelsChild.length > 0) {
                        let childPojo = {
                            custId: childCust.id,
                            deactivatePlanReqModels: deactivatePlanReqModelsChild,
                            planGroupChange: childCust.selectedPlanCategory === "groupPlan",
                            planGroupFullyChanged: childCust.selectedPlanCategory === "groupPlan",
                            paymentOwner: "yogesh Patil",
                            paymentOwnerId: this.changePlanNewForm.value.paymentOwnerId,
                            billableCustomerId: this.changePlanNewForm.value.billableCustomerId,
                            isParent: false,
                            remark: this.changePlanNewForm.value.remarks
                        };
                        finalData.deactivatePlanReqDTOS.push(childPojo as any);

                    }
                }
            });
            if (recordPaymentPojo != null) {
                finalData.recordPayment = recordPaymentPojo;
            }
            this.changePlans(finalData);
        }
    }
    chargeData: {
        custChargeDetailsPojoList: any[];
        custid: any;
        parentId: any;
        billableCustomerId: any;
        paymentOwnerId: any;
      }[] = [];
      
    addChargeDataInRenew(finalRenewData:any) {
        finalRenewData.custChargeDetailsList = this.chargeData;
        this.renewPlans(finalRenewData);
    }

    renewPlans(finalRenewData:any) {
        let url = "/subscriber/changePlan01";
        this.customerManagementService.postMethod(url, finalRenewData).subscribe(
            (response: any) => {
                if (response.responseCode == 417 || response.responseCode == 406) {
                    this.messageService.add({
                        severity: "info",
                        summary: "Info",
                        detail: response.responseMessage,
                        icon: "far fa-times-circle"
                    });
                } else {
                    this.messageService.add({
                        severity: "success",
                        summary: "Successfully",
                        detail: "",
                        icon: "far fa-check-circle"
                    });
                }
                this.resetForm();
                this.initData();
            },
            (error: any) => {
                console.log(error);
                this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail: error.error.ERROR,
                    icon: "far fa-times-circle"
                });
            }
        );
    }

    addOnPlans(finalAddonData:any) {
        let url = "/subscriber/changePlan01";
        this.customerManagementService.postMethod(url, finalAddonData).subscribe(
            (response: any) => {
                console.log(response);
                if (response.responseCode == 417 || response.responseCode == 406) {
                    this.messageService.add({
                        severity: "info",
                        summary: "Info",
                        detail: response.responseMessage,
                        icon: "far fa-times-circle"
                    });
                } else {
                    this.messageService.add({
                        severity: "success",
                        summary: "Successfully",
                        detail: "",
                        icon: "far fa-check-circle"
                    });
                }
                this.resetForm();
                this.initData();
            },
            (error: any) => {
                console.log(error);
                this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail: error.error.ERROR,
                    icon: "far fa-times-circle"
                });
            }
        );
    }

    changePlans(finalData:any) {
        let url = "/subscriber/deactivatePlanInBulk";
        this.customerManagementService.postMethod(url, finalData).subscribe(
            (response: any) => {
                if (response.responseCode == 417) {
                    this.messageService.add({
                        severity: "info",
                        summary: "Info",
                        detail: response.responseMessage,
                        icon: "far fa-times-circle"
                    });
                } else {
                    this.messageService.add({
                        severity: "success",
                        summary: "Successfully",
                        detail: "",
                        icon: "far fa-check-circle"
                    });
                }
                this.resetForm();
                this.initData();
            },
            (error: any) => {
                if (error.error.status == 417) {
                    this.messageService.add({
                        severity: "info",
                        summary: "Info",
                        detail: error.error.ERROR,
                        icon: "far fa-times-circle"
                    });
                } else {
                    this.messageService.add({
                        severity: "error",
                        summary: "Error",
                        detail: error.error.ERROR,
                        icon: "far fa-times-circle"
                    });
                }
            }
        );
    }

    errorMsg() {
        this.messageService.add({
            severity: "error",
            summary: "Required Details",
            detail: "Please select at least one new plan.",
            icon: "far fa-times-circle"
        });
    }

    resetForm() {
        this.changePlanSubmitted = false;
        this.changePlanTypeSelection = null;
        this.selectedPlanCategory = null;
        this.newPlanGroupId = null;
        this.isAddCharge = false;
        this.changePlanNewForm.reset();
        this.changePlanNewForm.patchValue({
            isPaymentReceived: "false",
            billableCustomerId: this.custDetails.id,
            isTriggerCoaDm: true
        });
        this.childCustList.forEach((element:any) => {
            element.changePlanTypeSelection = null;
            element.newPlanGroupId = null;
            element.isAddCharge = false;
            element.serviceMappingData.forEach((item:any) => {
                item.changeFlag = false;
                item.newPlanSelection = null;
            });
        });
        this.custServiceData.forEach(element => {
            element.changeFlag = false;
            element.newPlanSelection = null;
        });
    }

    //Direct Charge developement

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
                type: "One-time"
            });
        });
    }

    isStaticIPAdrress(chargeid:any) {
        if (chargeid !== null && chargeid !== undefined && chargeid !== "") {
            return (
                this.commonDropDownService.chargeByTypeData.filter(
                    (charge:any) => charge.id === chargeid && charge.chargecategory === "IP"
                ).length > 0
            );
        } else {
            return false;
        }
    }

    getPlanValidityForChagre(event:any) {
        const planId = event.value;

        // const url = "/postpaidplan/" + planId;
        // this.customerManagementService.getMethod(url).subscribe((response: any) => {
        //   const planDetailData = response.postPaidPlan;
        let selectedPlan = this.plansForCharge.find(item => item.planId == event.value);

        this.chargeGroupForm.patchValue({
            validity: Number(selectedPlan.validity),
            unitsOfValidity: selectedPlan.unitsOfValidity
        });

        if (
            selectedPlan.discountType === "Recurring" &&
            new Date(selectedPlan.discountExpiryDate) > new Date() &&
            selectedPlan.discount > 0
        ) {
            this.confirmationService.confirm({
                message: "Do you want to apply " + selectedPlan.discount + " % of  Discount?",
                header: "Change Discount Confirmation",
                icon: "pi pi-info-circle",
                accept: () => {
                    this.chargeGroupForm.patchValue({
                        discount: selectedPlan.discount,
                        discountType: selectedPlan.discountType
                    });
                },
                reject: () => {
                    this.messageService.add({
                        severity: "info",
                        summary: "Rejected",
                        detail: "You have rejected"
                    });
                    this.chargeGroupForm.patchValue({
                        discount: 0
                    });
                }
            });
        } else if (
            selectedPlan.discountType === "Recurring" &&
            new Date(selectedPlan.discountExpiryDate) > new Date() &&
            selectedPlan.discount < 0
        ) {
            this.confirmationService.confirm({
                message: "Do you want to over charge customer " + selectedPlan.discount + " % ?",
                header: "Change Discount Confirmation",
                icon: "pi pi-info-circle",
                accept: () => {
                    this.chargeGroupForm.patchValue({
                        discount: selectedPlan.discount,
                        discountType: selectedPlan.discountType
                    });
                },
                reject: () => {
                    this.messageService.add({
                        severity: "info",
                        summary: "Rejected",
                        detail: "You have rejected"
                    });
                    this.chargeGroupForm.patchValue({
                        discount: 0
                    });
                }
            });
        }

        //
        // });
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
            console.log("I am not valid");
        }
    }

    createoverChargeListFormGroup(): FormGroup {
        let billingCycle = this.chargeGroupForm.value.type === "Recurring" ? 1 : "";
        let planName = this.plansForCharge.find(
            plan => plan.planId == this.chargeGroupForm.value.planid
        ).planName;
        return this.fb.group({
            // chargeid: [''],
            type: [this.chargeGroupForm.value.type ? this.chargeGroupForm.value.type : "Recurring"],
            custid: [this.chargeGroupForm.value.custId],
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
            staticIPAdrress: [this.chargeGroupForm.value.staticIPAdrress]
            //   expiry: [this.chargeGroupForm.value.expiry],
            //   expiryDate: [moment(this.chargeGroupForm.value.expiry).format("DD-MM-YYYY HH:mm").toString()],
        });
    }

    deleteConfirmonChargeField(chargeFieldIndex: number, custId:any) {
        if (chargeFieldIndex || chargeFieldIndex == 0) {
            this.confirmationService.confirm({
                message: "Do you want to delete this Charge ?",
                header: "Delete Confirmation",
                icon: "pi pi-info-circle",
                accept: () => {
                    // console.log(name);
                    this.chargeData.splice(this.chargeData.findIndex((item:any) => item.custid == custId));
                    this.overChargeListFromArray.removeAt(chargeFieldIndex);
                    if (this.addedChargeList != null) {
                        this.addedChargeList.splice(chargeFieldIndex);
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

    pageChangedOverChargeList(pageNumber:any) {
        this.currentPageoverChargeList = pageNumber;
    }

    isPlanSelected(custId:any) {
        var plans = this.plansForChargeByCust.filter(item => item.custId == custId);
        if (plans != null && plans.length > 0) {
            return false;
        }
        return true;
    }

    getChargeName(chargeid:any) {
        return this.commonDropDownService.chargeByTypeData.filter((item:any) => item.id == chargeid)[0].name;
    }

    onDirectChargeChange(event:any, custId:any) {
        this.plansForCharge = this.plansForChargeByCust.filter(item => item.custId == custId);
        if (event.checked) {
            this.showAddDirectCharge = true;
            this.chargeGroupForm.patchValue({
                custId: custId
            });
            this.overChargeListFromArray = this.fb.array<FormGroup>([]);
            var filteredCharge: any = this.chargeData.find((item:any) => item.custid == custId);

            if (filteredCharge != null) {
                filteredCharge.custChargeDetailsPojoList.forEach((item:any) => {
                    this.overChargeListFromArray.push(
                        this.fb.group({
                            type: [item.type],
                            custid: [item.custId],
                            chargeid: [item.chargeid],
                            validity: [item.validity],
                            price: [item.price],
                            actualprice: [item.actualprice],
                            charge_date: [item.charge_date],
                            planid: [item.planid],
                            planName: [item.planName],
                            unitsOfValidity: [item.unitsOfValidity],
                            billingCycle: [item.billingCycle],
                            discount: [item.discount],
                            staticIPAdrress: [item.staticIPAdrress]
                        })
                    );
                });
            }
        } else {
            var index: any = this.chargeData.findIndex((item:any) => item.custid == custId);
            if (index != -1) this.chargeData.splice(index);
            this.addedChargeList = [];
        }
    }

    

    saveChargeData() {
        const url = "/createCustChargeOverride";
        var chargeList = [];
        chargeList = this.overChargeListFromArray.value;

        this.chargeData.push({
            custChargeDetailsPojoList: chargeList,
            custid: chargeList[0].custid,
            parentId: this.custDetails.id,
            billableCustomerId: this.custDetails.id,
            paymentOwnerId: this.paymentOwnerId
        });

        this.showAddDirectCharge = false;
    }

    closeAddCharge() {
        this.showAddDirectCharge = false;
        this.chargeGroupForm.reset();
    }

    closeChargeDetaills() {
        this.showChargeDetails = false;
    }

    openChargeDetails(custId:any) {
        var filteredCharge: any = this.chargeData.find(item => item.custid == custId);
        if (filteredCharge != null) {
            this.addedChargeList = filteredCharge.custChargeDetailsPojoList;
        }
        this.showChargeDetails = true;
    }

    // Record advance payment

    openRecordPayment() {
        this.getPaymentMode();
        this.displayRecordPaymentDialog = true;
        this.paymentFormGroup.patchValue({
            customerid: this.custDetails.id
        });
    }
    modalOpenInvoice(id:any) {
        this.displaySelectInvoiceDialog = true;
        this.masterSelected = false;
    }
    getPaymentMode() {
        const url = "/commonList/paymentMode";
        this.commonDropDownService.getMethodWithCache(url).subscribe(
            (response: any) => {
                this.paymentMode = response.dataList;
            },
            (error: any) => { }
        );
    }

    async selPayModeRecord(event:any) {
        this.resetPayMode();
        const payMode = event.value.toLowerCase();
        if (payMode == "POS".toLowerCase() || payMode == "VatReceiveable".toLowerCase()) {
            this.paymentFormGroup.controls['chequedate'].enable();
            this.paymentFormGroup.controls['chequedate'].setValidators([Validators.required]);
            this.paymentFormGroup.controls['referenceno'].clearValidators();
            this.paymentFormGroup.controls['reciptNo'].enable();
            this.paymentFormGroup.controls['chequedate'].updateValueAndValidity();
            this.paymentFormGroup.controls['referenceno'].updateValueAndValidity();
            this.paymentFormGroup.updateValueAndValidity();
            this.chequeDateName = "Transaction date";
        } else if (payMode == "Online".toLowerCase()) {
            this.paymentFormGroup.controls['chequedate'].enable();
            this.paymentFormGroup.controls['chequedate'].setValidators([Validators.required]);
            this.paymentFormGroup.controls['chequedate'].updateValueAndValidity();
            this.paymentFormGroup.controls['referenceno'].setValidators([Validators.required]);
            this.paymentFormGroup.controls['reciptNo'].enable();
            this.paymentFormGroup.controls['referenceno'].updateValueAndValidity();
            this.chequeDateName = "Transaction date";
        } else if (payMode == "Direct Deposit".toLowerCase()) {
            this.paymentFormGroup.controls['branch'].enable();
            this.paymentFormGroup.controls['chequedate'].enable();
            this.paymentFormGroup.controls['chequedate'].setValidators([Validators.required]);
            this.paymentFormGroup.controls['chequedate'].updateValueAndValidity();
            this.paymentFormGroup.controls['destinationBank'].enable();
            this.paymentFormGroup.controls['destinationBank'].setValidators([Validators.required]);
            this.paymentFormGroup.controls['referenceno'].clearValidators();
            this.paymentFormGroup.controls['referenceno'].updateValueAndValidity();
            this.paymentFormGroup.controls['reciptNo'].disable();
            this.paymentFormGroup.controls['destinationBank'].updateValueAndValidity();
            this.chequeDateName = "Transaction date";
        } else if (payMode == "NEFT_RTGS".toLowerCase()) {
            this.paymentFormGroup.controls['bankManagement'].enable();
            this.paymentFormGroup.controls['bankManagement'].setValidators([Validators.required]);
            this.paymentFormGroup.controls['bankManagement'].updateValueAndValidity();
            this.paymentFormGroup.controls['destinationBank'].enable();
            this.paymentFormGroup.controls['destinationBank'].setValidators([Validators.required]);
            this.paymentFormGroup.controls['referenceno'].clearValidators();
            this.paymentFormGroup.controls['referenceno'].updateValueAndValidity();
            this.paymentFormGroup.controls['reciptNo'].enable();
            this.paymentFormGroup.controls['destinationBank'].updateValueAndValidity();
        } else if (payMode == "Cheque".toLowerCase()) {
            this.paymentFormGroup.controls['chequedate'].enable();
            this.paymentFormGroup.controls['chequedate'].setValidators([Validators.required]);
            this.paymentFormGroup.controls['chequedate'].updateValueAndValidity();
            this.paymentFormGroup.controls['bankManagement'].enable();
            this.paymentFormGroup.controls['bankManagement'].setValidators([Validators.required]);
            this.paymentFormGroup.controls['bankManagement'].updateValueAndValidity();
            this.paymentFormGroup.controls['chequeno'].enable();
            this.paymentFormGroup.controls['chequeno'].setValidators([Validators.required]);
            this.paymentFormGroup.controls['referenceno'].clearValidators();
            this.paymentFormGroup.controls['referenceno'].updateValueAndValidity();
            this.paymentFormGroup.controls['reciptNo'].enable();
            this.paymentFormGroup.controls['branch'].enable();
            this.paymentFormGroup.controls['chequeno'].updateValueAndValidity();
        }
        // await this.commondropdownService.getOnlineSourceData(payMode.toLowerCase());

        const url = "/commonList/generic/" + payMode;
        this.commonDropDownService.getMethodWithCache(url).subscribe(
            (response: any) => {
                this.onlineSourceData = response.dataList;
                this.paymentFormGroup.patchValue({
                    onlinesource: ""
                });
                if (this.onlineSourceData.length > 0) {
                    this.paymentFormGroup.controls['onlinesource'].setValidators([Validators.required]);
                    this.paymentFormGroup.controls['onlinesource'].updateValueAndValidity();
                } else {
                    this.paymentFormGroup.controls['onlinesource'].clearValidators();
                    this.paymentFormGroup.controls['onlinesource'].updateValueAndValidity();
                }
                this.paymentFormGroup.updateValueAndValidity();
            },
            (error: any) => {
                this.onlineSourceData = [];
                console.log(error, "error");
            }
        );
        this.paymentFormGroup.updateValueAndValidity();
        this.onChangeOFAmountTest(this.selectedInvoice);
        // let isAbbsTdsMode = this.checkPaymentMode(payMode);
        // if (isAbbsTdsMode) {
        //   this.paymentFormGroup.patchValue({
        //     tdsAmount: 0,
        //     abbsAmount: 0,
        //   });
        //   if (this.selectedInvoice.length > 0) {
        //     this.selectedInvoice.map(element => {
        //       element.tds = 0;
        //       element.abbs = 0;
        //     });
        //   }
        // }
    }

    resetPayMode() {
        this.paymentFormGroup.controls['chequeno'].disable();
        this.paymentFormGroup.controls['chequedate'].disable();
        this.paymentFormGroup.controls['bankManagement'].disable();
        this.paymentFormGroup.controls['branch'].disable();
        this.paymentFormGroup.controls['destinationBank'].disable();
        this.paymentFormGroup.controls['reciptNo'].enable();
        this.chequeDateName = "Cheque Date";
        this.paymentFormGroup.controls['referenceno'].clearValidators();
        this.paymentFormGroup.controls['referenceno'].updateValueAndValidity();
        this.paymentFormGroup.controls['chequedate'].setValidators([]);
        this.paymentFormGroup.controls['destinationBank'].setValidators([]);
        this.paymentFormGroup.controls['bankManagement'].setValidators([]);
        this.paymentFormGroup.controls['chequeno'].setValidators([]);
        this.paymentFormGroup.controls['onlinesource'].setValidators([]);
        this.paymentFormGroup.updateValueAndValidity();
    }

    selPaySourceRecord(event:any) {
        const paySource = event.value.toLowerCase();

        switch (paySource) {
            case "cash_via_bank":
                this.paymentFormGroup.controls['destinationBank'].enable();
                this.paymentFormGroup.controls['destinationBank'].setValidators([Validators.required]);
                this.paymentFormGroup.controls['destinationBank'].updateValueAndValidity();
                this.paymentFormGroup.controls['branch'].enable();
                break;
            case "cash_in_hand":
                this.paymentFormGroup.controls['destinationBank'].disable();
                this.paymentFormGroup.controls['destinationBank'].clearValidators();
                this.paymentFormGroup.controls['destinationBank'].updateValueAndValidity();
                this.paymentFormGroup.controls['branch'].disable();
                break;
        }
    }

    checkUncheckAllInvoice() {
        for (let i = 0; i < this.invoiceList.length; i++) {
            this.invoiceList[i].isSelected = this.masterSelected;
        }
        this.getCheckedItemListInvoice();
    }

    isAllSelectedInvoice() {
        this.masterSelected = this.invoiceList.every(function (item: any) {
            return item.isSelected == true;
        });
        this.getCheckedItemListInvoice();
    }

    getCheckedItemListInvoice() {
        this.selectedInvoice = [];
        for (let i = 0; i < this.invoiceList.length; i++) {
            if (this.invoiceList[i].isSelected) {
                this.selectedInvoice.push(this.invoiceList[i]);
            }
        }
    }

    onSelectedInvoice(event:any, data:any, isTDS:any, isABBS:any) {
        if (event > 0) {
            if (isTDS) {
                data.tdsCheck = ((data.totalamount * this.tdsPercent) / 100).toFixed(2);
            }
            if (isABBS) {
                data.abbsCheck = ((data.totalamount * this.abbsPercent) / 100).toFixed(2);
            }
        } else {
            data.includeTds = false;
            data.includeAbbs = false;
            data.tdsCheck = 0;
            data.abbsCheck = 0;
        }
    }

    onChangeOFTDSTest(event:any, data:any) {
        // data.includeTds = event.checked;
        if (event.checked && data.testamount) {
            data.includeTds = true;
            data.tdsCheck = ((data.testamount * this.tdsPercent) / 100).toFixed(2);
            data.tds = ((data.testamount * this.tdsPercent) / 100).toFixed(2);
        } else {
            data.includeTds = false;
            data.tdsCheck = 0;
            data.tds = 0;
        }
    }

    onChangeOFABBSTest(event:any, data:any) {
        if (event.checked && data.testamount) {
            data.includeAbbs = true;
            data.abbsCheck = ((data.testamount * this.abbsPercent) / 100).toFixed(2);
            data.abbs = ((data.testamount * this.abbsPercent) / 100).toFixed(2);
        } else {
            data.includeAbbs = false;
            data.abbsCheck = 0;
            data.abbs = 0;
        }
    }

    bindInvoice() {
        if (this.selectedInvoice.length >= 1) {
            this.isShowInvoiceList = true;
            this.Amount = 0;
            this.selectedInvoice.forEach((element:any) => {
                if (element.testamount !== null) {
                    this.Amount += parseFloat(element.testamount);
                }
            });
            console.log("this.Amount:::", this.Amount);
            if (!this.Amount || this.Amount < 1) {
                this.messageService.add({
                    severity: "info",
                    summary: "Info",
                    detail: "Please enter amount greater than 1",
                    icon: "far fa-check-circle"
                });
                return;
            }
            this.paymentFormGroup.patchValue({
                invoiceId: this.selectedInvoice.map((item:any) => item.id),
                amount: this.Amount.toFixed(2)
            });

            this.onChangeOFAmountTest(this.selectedInvoice);
            this.destinationbank = true;
        } else {
            this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: "Please select at least one invoice or advance mode.",
                icon: "far fa-check-circle"
            });
            return;
        }
        if (this.selectedInvoice.length == 2) {
            this.selectedInvoice.forEach((element:any) => {
                if (element.docnumber == "Advance") {
                    this.selectedInvoice = [];
                    this.invoiceList.forEach((element:any) => {
                        element.isSelected = false;
                    });
                    this.masterSelected = false;
                    this.messageService.add({
                        severity: "info",
                        summary: "Info",
                        detail: "Please select advance mode value only.",
                        icon: "far fa-check-circle"
                    });
                }
            });
        }
        this.displaySelectInvoiceDialog = false;
    }

    onChangeOFAmountTest(event:any) {
        if (this.selectedInvoice.length >= 1) {
            let isAbbsTdsMode: boolean = false;
            if (this.paymentFormGroup.controls['paymode'].value) {
                let formPayModeValue = this.paymentFormGroup.controls['paymode'].value.toLowerCase();
                isAbbsTdsMode = this.checkPaymentMode(formPayModeValue);
            }
            let totaltdsAmount = 0;
            let totalabbsAmount = 0;

            this.selectedInvoice.forEach((element:any) => {
                let tds = 0;
                let abbs = 0;
                if (element.includeTds) {
                    if (element.includeTds === true) {
                        tds = Number(element.tdsCheck);
                        totaltdsAmount = Number(element.tdsCheck) + Number(totaltdsAmount);
                        // this.isTdsFlag = true;
                    }
                }
                if (element.includeAbbs) {
                    if (element.includeAbbs === true) {
                        abbs = Number(element.abbsCheck);
                        totalabbsAmount = Number(element.abbsCheck) + Number(totalabbsAmount);
                        // this.isAbbsFlag = true;
                    }
                }
                if (isAbbsTdsMode) {
                    element.tds = 0;
                    element.abbs = 0;
                } else {
                    element.tds = tds;
                    element.abbs = abbs;
                }
            });
            const tdsAmount = totaltdsAmount;
            const abbsAmount = totalabbsAmount;

            if (isAbbsTdsMode) {
                this.paymentFormGroup.controls['abbsAmount'].setValue(0);
                this.paymentFormGroup.controls['tdsAmount'].setValue(0);
            } else {
                // if (this.isAbbsFlag) {
                this.paymentFormGroup.controls['abbsAmount'].setValue(abbsAmount);
                // }
                // if (this.isTdsFlag) {
                this.paymentFormGroup.controls['tdsAmount'].setValue(tdsAmount);
                // }
            }
        }
    }

    checkPaymentMode(formPayModeValue:any) {
        if (
            formPayModeValue &&
            (formPayModeValue == "vatreceiveable" ||
                formPayModeValue == "tds" ||
                formPayModeValue == "abbs")
        ) {
            return true;
        } else {
            return false;
        }
    }

    modalCloseInvoiceList() {
        this.paymentFormGroup.patchValue({
            invoiceId: this.selectedInvoice.id,
            amount: this.selectedInvoice.refundAbleAmount
        });
        this.isShowInvoiceList = true;
        this.displaySelectInvoiceDialog = false;
        // this.newFirst = 0;
    }

    keypressId(event: any) {
        const pattern = /[0-9\.]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && event.keyCode != 9 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    getBankDetail() {
        const url = "/bankManagement/searchByStatus?banktype=other";
        this.KeyannaCommonBaseService.get(url).subscribe(
            (response: any) => {
                this.bankDataList = response.dataList;
                // this.bankDestination = response.dataList.banktype
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

    getBankDestinationDetail() {
        const url = "/bankManagement/searchByStatus?banktype=operator";
        this.KeyannaCommonBaseService.get(url).subscribe(
            (response: any) => {
                // this.bankDataList = response.dataList.banktype;
                this.bankDestination = response.dataList;
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

    addPayment(paymentId:any) {
        this.submitted = true;

        if (this.paymentFormGroup.valid) {
            //
            //   if (this.paymentFormGroup.value.invoiceId == 0) {
            //     this.paymentFormGroup.value.paytype = "advance";
            //   } else {
            //     this.paymentFormGroup.value.paytype = "invoice";
            //   }

            if (this.selectedInvoice.length == 0) {
                this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail: "Please select atleat one invoice or advance mode.",
                    icon: "far fa-check-circle"
                });
                return;
            } else {
                var createPaymentData: any = {};
                const url = "/record/payment";
                this.paymentFormGroup.value.customerid = this.custDetails.id;
                this.paymentFormGroup.value.type = "Payment";
                createPaymentData = this.paymentFormGroup.value;
                createPaymentData.onlinesource = this.paymentFormGroup.controls['onlinesource'].value;
                const formData = new FormData();
                var paymentListPojos: { tdsAmountAgainstInvoice: any; abbsAmountAgainstInvoice: any; amountAgainstInvoice: any; invoiceId: any; }[] = [];
                this.selectedInvoice.forEach((element:any) => {
                    let data = {
                        tdsAmountAgainstInvoice: element.tds,
                        abbsAmountAgainstInvoice: element.abbs,
                        amountAgainstInvoice: element.testamount,
                        invoiceId: element.id
                    };
                    paymentListPojos.push(data);
                });
                createPaymentData.paymentListPojos = paymentListPojos;

                this.prepareChangePlanPayload(createPaymentData);
            }
            this.displayRecordPaymentDialog = false;
        }
    }

    closePaymentForm() {
        this.paymentFormGroup.reset();
        this.displayRecordPaymentDialog = false;
        this.submitted = false;
        this.isShowInvoiceList = false;
        this.selectedInvoice = [];
    }

    getPlanPurchaseType() {
        const url = "/commonList/generic/planPurchaseType";
        this.KeyannaCommonBaseService.get(url).subscribe(
            (response: any) => {
                console.log("  this.planPurchaseTypeData", response);
                if (this.custType === "Postpaid") {
                    this.changePlanType = response.dataList.filter(
                        (type:any) => type.text !== "New" && type.text !== "Upgrade" && type.text !== "Renew"
                    );
                } else {
                    this.changePlanType = response.dataList.filter(
                        (type:any) => type.text !== "New" && type.text !== "Upgrade"
                    );
                }
                console.log("  this.this.changePlanType", this.changePlanType);
            },
            (error: any) => {
                // this.messageService.add({
                //   severity: 'error',
                //   summary: 'Error',
                //   detail: error.error.ERROR,
                //   icon: 'far fa-times-circle',
                // })
            }
        );
    }

    getChangePlanDate() {
        const url = "/commonList/generic/changePlanDate";
        this.KeyannaCommonBaseService.get(url).subscribe((response: any) => {
            console.log("  this.planPurchaseTypeData", response);
            this.dateType = response.dataList;
            if (this.custType == "Postpaid") {
                this.ChangePLanDateSelection = this.dateType[0].value;
            }
            console.log("  this.this.changePlanType", this.changePlanType);
        });
    }

    calculateExpiry() {
        if (this.planDetails?.validity) {
            const currentDate = new Date();
            const expiry = new Date(currentDate);
            if (this.planDetails.unitsOfValidity.toLowerCase() === "years") {
                expiry.setFullYear(currentDate.getFullYear() + this.planDetails.validity);
            } else if (this.planDetails.unitsOfValidity.toLowerCase() === "months") {
                expiry.setMonth(currentDate.getMonth() + this.planDetails.validity);
            } else if (this.planDetails.unitsOfValidity.toLowerCase() === "days") {
                expiry.setDate(currentDate.getDate() + this.planDetails.validity);
            } else if (this.planDetails.unitsOfValidity.toLowerCase() === "hours") {
                expiry.setHours(currentDate.getHours() + this.planDetails.validity);
            } else {
                expiry.setDate(currentDate.getDate() + this.planDetails.validity);
            }

            this.expiryDate = expiry;
        } else {
            this.expiryDate = null;
        }
    }
}
