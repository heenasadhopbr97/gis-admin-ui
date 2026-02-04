import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DatePipe, formatDate } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { BehaviorSubject } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
// import * as moment from "moment";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { NetworkdeviceService } from "src/app/service/networkdevice.service";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import { ServiceAreaService } from "src/app/service/service-area.service";
import { PartnerService } from "src/app/service/partner.service";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
import { StatusCheckService } from "src/app/service/status-check-service.service";
export declare var $: any;
@Component({
    selector: "app-cust-shift-location",
    templateUrl: "./cust-shift-location.component.html",
    styleUrls: ["./cust-shift-location.component.css"],
    standalone: false
})
export class CustShiftLocationComponent implements OnInit {
    loggedInStaffId = localStorage.getItem("userId");
    custData: any = {};
    customerId = 0;
    custType: string = "";

    AclClassConstants;
    AclConstants;

    countryTitle = RadiusConstants.COUNTRY;
    cityTitle = RadiusConstants.CITY;
    stateTitle = RadiusConstants.STATE;
    pincodeTitle = RadiusConstants.PINCODE;
    areaTitle = RadiusConstants.AREA;

    pageLimitOptions = RadiusConstants.pageLimitOptions;
    showItemPerPage = 1;

    approvableStaff: any = [];
    oltDevices:any[] = [];
    spliterDevices:any[] = [];
    masterDbDevices:any[] = [];
    partnerList:any[] = [];
    pincodeDD: any = [];
    partnerListByServiceArea: any = [];
    staffList: any = [];
    branchData: any = [];
    AreaListDD: any = [];
    areaDetails: any = [];
    staffSelectList: any = [];
    billableCustList: any = [];
    selectedParentCust: any = [];
    assignShiftLocationData: any = [];
    approveInventoryData:any[] = [];
    rejectInventoryData:any[] = [];
    shiftLocationFlagType = "";
    AppRjecHeader = "";

    assignedShiftLocationid: any;
    newCustomerAddressDataForCustometr: any = [];
    selectStaff: any;
    requestedByID: number;
    paymentOwnerId: number;
    shiftLocationPopId: number;
    shiftLocationOltId: number;
    branchID: number = 0;
    walletValue: number;
    prepaid: any;
    dueValue: number;
    parentCustomerDialogType: any = "";
    customerSelectType: any = "";
    staffSelectType = "";
    approveId: any;
    selectStaffReject: any;

    shiftlocationFormRemark: FormGroup;
    shiftLocationChargeGroupForm: FormGroup;
    presentGroupForm: FormGroup;
    assignAppRejectShiftLocationForm: FormGroup;

    approved = false;
    reject = false;
    serviceAreaDisable = false;
    isBranchAvailable = false;
    isBranchShiftLocation = false;
    isServiceInShiftLocation: boolean = false;
    submitted = false;
    selectPincodeList = false;
    showParentCustomerModel = false;
    ifUpdateAddressSubmited = false;
    assignShiftLocationsubmitted = false;
    rejectCustomerInventoryModal: boolean = false;
    rejectApproveShiftLocationModal: boolean = false;
    selectedStaff: any = [];
    staffCustList:any[] = [];
    isSelectStaff: boolean = false;
    staffid:any;

    currentDate = new Date();
    selectchargeValueShow = false;

    auditcustid = new BehaviorSubject({
        auditcustid: "",
        checkHierachy: "",
        planId: "",
    });

    chargeType = [{ label: "One-time" }, { label: "Recurring" }];
    shiftLocationDTO: any = {
        addressDetails: {
            id: "",
            addressType: "",
            landmark: "",
            areaId: "",
            pincodeId: "",
            cityId: "",
            stateId: "",
            countryId: "",
            isDelete: false,
        },
        updateAddressServiceAreaId: "",
        isPaymentAddresSame: "true",
        isPermanentAddress: "true",
        shiftPartnerid: "",
        popid: "",
        oltid: "",
        requestedById: "",
        branchID: "",
    };
    displayShiftLocationDetails: boolean = false;
    addShiftLocationAccess: boolean = false;
    ifModelIsShow: boolean = false;
    prepaidValue: number;
    assignDocSubmitted: boolean;
    remark: any;
    assignPlanForm: FormGroup;
    assignDocForm: any;

    constructor(
        private messageService: MessageService,
        private fb: FormBuilder,
        public datePipe: DatePipe,
        private spinner: NgxSpinnerService,
        private confirmationService: ConfirmationService,
        private customerManagementService: CustomermanagementService,
        public PaymentamountService: PaymentamountService,
        private route: ActivatedRoute,
        private router: Router,
        public datepipe: DatePipe,
        public loginService: LoginService,
        private networkdeviceService: NetworkdeviceService,
        public KeyannaCommonBaseService: KeyannaCommonBaseService,
        public commondropdownService: CommondropdownService,
        public partnerService: PartnerService,
        public serviceAreaService: ServiceAreaService,
        public revenueManagementService: RevenueManagementService,
        public statusCheckService: StatusCheckService
    ) {
        this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
        this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
        this.addShiftLocationAccess = loginService.hasPermission(
            this.custType == "Prepaid"
                ? PRE_CUST_CONSTANTS.PRE_CUST_SHIFT_LOCATION_ADD
                : POST_CUST_CONSTANTS.POST_CUST_SHIFT_LOCATION_ADD
        );
        console.log("addShiftLocationAccess ::::: ", this.addShiftLocationAccess);

        this.AclClassConstants = AclClassConstants;
        this.AclConstants = AclConstants;
    }

    ngOnInit(): void {
        this.shiftLocationChargeGroupForm = this.fb.group({
            chargeid: ["", Validators.required],
            price: ["", Validators.required],
            actualprice: ["", Validators.required],
            charge_date: ["", Validators.required],
            type: ["", Validators.required],
            discount: [""],
            billingCycle: [""],
            id: [""],
            billableCustomerId: [""],
            paymentOwnerId: ["", Validators.required],
        });
        this.presentGroupForm = this.fb.group({
            addressType: ["Present", Validators.required],
            landmark: ["", Validators.required],
            areaId: ["", Validators.required],
            pincodeId: ["", Validators.required],
            cityId: ["", Validators.required],
            stateId: ["", Validators.required],
            countryId: ["", Validators.required],
            landmark1: [""],
        });
        this.assignAppRejectShiftLocationForm = this.fb.group({
            remark: ["", Validators.required],
        });
        this.assignDocForm = this.fb.group({
            remark: ["", Validators.required],
        });
        this.getpartnerAll();
        if (this.statusCheckService.isActiveInventoryService) {
            this.commondropdownService.getPOPList();
        }
        this.commondropdownService.getCityList();
        this.commondropdownService.getStateList();
        this.commondropdownService.getCountryList();
        this.commondropdownService.getChargeTypeByList();
        this.commondropdownService.getChargeTypeByList();
        this.commondropdownService.getAllPinCodeNumber();
        this.getNewCustomerAddressForCustomer();
        this.searchPrepaidValue();
        console.log("history.state.data :::::::: ", history.state.data);
        if (history.state.data) {
            this.custData = history.state.data;
            if (this.custData.serviceareaid) {
                this.isServiceInShiftLocation = true;
                this.shiftLocationDTO.updateAddressServiceAreaId = this.custData.serviceareaid;
                this.shiftLocationPopId = this.custData.popid;
                this.shiftLocationOltId = this.custData.oltid;

                this.getPartnerAllByServiceArea(this.custData.serviceareaid);
                this.branchByServiceAreaID(this.custData.serviceareaid);
                let serviceAreaId = {
                    value: Number(this.custData.serviceareaid),
                };
                this.selServiceArea(serviceAreaId);
                var customerAddress = this.custData.addressList.find((address:any) => address.version === "NEW");
                // this.getStaffDetailById(customerData.serviceareaid)
                const data = {
                    value: Number(customerAddress.pincodeId),
                };
                this.selectPINCODEChange(data, "");
                this.branchID = this.custData.branch;
            }
            if (this.custData.partnerid) {
                this.shiftLocationDTO.shiftPartnerid = this.custData.partnerid;
            }
            this.shiftLocationDTO.isPermanentAddress = false;
            this.shiftLocationDTO.isPaymentAddresSame = false;
            console.log("custData :::::::: ", this.custData);

            this.presentGroupForm.patchValue(customerAddress);

            this.staffSelectList = [];
        } else this.getCustomersDetail(this.customerId);

        this.shiftlocationFormRemark = this.fb.group({
            remark: [""],
        });

        const serviceArea = localStorage.getItem("serviceArea");
        let serviceAreaArray = JSON.parse(serviceArea);
        if (serviceAreaArray.length !== 0) {
            this.commondropdownService.filterserviceAreaList();
            // this.commondropdownService.filterPartnerAll();
        } else {
            this.commondropdownService.getserviceAreaList();
            // this.commondropdownService.getpartnerAll();
        }
    }

    getCustomersDetail(custId:any) {
        const url = "/customers/" + custId;
        this.customerManagementService.getMethod(url).subscribe((response: any) => {
            this.custData = response.customers;
            if (this.custData.serviceareaid) {
                this.isServiceInShiftLocation = true;
                this.shiftLocationDTO.updateAddressServiceAreaId = this.custData.serviceareaid;
                this.shiftLocationPopId = this.custData.popid;
                this.shiftLocationOltId = this.custData.oltid;
                this.getPartnerAllByServiceArea(this.custData.serviceareaid);
                this.branchByServiceAreaID(this.custData.serviceareaid);
                this.getWalletData(custId);
                let serviceAreaId = {
                    value: Number(this.custData.serviceareaid),
                };
                this.selServiceArea(serviceAreaId);
                var customerAddress = this.custData.addressList.find((address:any) => address.version === "NEW");
                // this.getStaffDetailById(customerData.serviceareaid)
                const data = {
                    value: Number(customerAddress.pincodeId),
                };
                this.selectPINCODEChange(data, "");
                this.branchID = this.custData.branch;
            }
            if (this.custData.partnerid) {
                this.shiftLocationDTO.shiftPartnerid = this.custData.partnerid;
            }
            this.shiftLocationDTO.isPermanentAddress = false;
            this.shiftLocationDTO.isPaymentAddresSame = false;
            console.log("customerAddress :::::::: ", customerAddress);

            this.presentGroupForm.patchValue(customerAddress);

            this.staffSelectList = [];
        });
    }
    customerDetailOpen() {
        this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
    }

    getWalletData(custID:any) {
        console.log("in wallet::::::");
        const data = {
            CREATE_DATE: "",
            END_DATE: "",
            amount: "",
            balAmount: "",
            custId: custID,
            description: "",
            id: "",
            refNo: "",
            transcategory: "",
            transtype: "",
        };
        const url = "/wallet";
        this.revenueManagementService.postMethod(url, data).subscribe((response: any) => {
            this.walletValue = response.customerWalletDetails;
            if (this.walletValue >= 0) {
                this.dueValue = 0;
            } else {
                this.dueValue = Math.abs(this.walletValue);
            }
        });
    }

    getpartnerAll() {
        const url = "/partner/all";
        this.partnerService.getMethodNew(url).subscribe(
            (response: any) => {
                this.partnerList = response.partnerlist.filter((item:any) => item.id != 1);
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

    getNewCustomerAddressForCustomer(): void {
        const url = "/newcustomeraddress/" + this.customerId;

        this.customerManagementService.getMethod(url).subscribe(
            (res: any) => {
                this.newCustomerAddressDataForCustometr = res.newcustomerAddress;
            },
            (error: any) => { }
        );
    }

    openShiftLocationForm() {
        this.displayShiftLocationDetails = true;
        this.getNetworkDevicesByType("OLT");
        this.shiftLocationChargeGroupForm.reset();
    }

    getNetworkDevicesByType(deviceType:any) {
        console.log("deviceType ::::", deviceType);

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
                    icon: "far fa-times-circle",
                });
            }
        );
    }

    StaffReasignListShiftLocation(data:any) {
        let url = `/teamHierarchy/reassignWorkflowGetStaffList?entityId=${data.id}&eventName=SHIFT_LOCATION`;
        this.customerManagementService.getMethod(url).subscribe(
            (response: any) => {
                this.assignedShiftLocationid = data.id;
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
                    // this.getCustomer();
                    this.approvableStaff = response.dataList;
                    this.approved = true;
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

    reassignWorkflowShiftLocation() {
        let url: any;
        // this.remark = this.shiftlocationFormRemark.value.remark;
        url = `/teamHierarchy/reassignWorkflow?entityId=${this.assignedShiftLocationid}&eventName=SHIFT_LOCATION&assignToStaffId=${this.selectStaff}&remark=${this.shiftlocationFormRemark.value.remark}`;

        this.customerManagementService.getMethod(url).subscribe(
            (response: any) => {
                $("#reAssignSHIFTLOCATIONModal").modal("hide");
                // this.getcustomerList("");
                if (response.responseCode == 417) {
                    this.messageService.add({
                        severity: "error",
                        summary: "Error",
                        detail: response.responseMessage,
                        icon: "far fa-times-circle",
                    });
                } else {
                    // this.getcustomerList("");
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
    }

    selServiceArea(event:any) {
        this.pincodeDD = [];
        const serviceAreaId = event.value;
        if (serviceAreaId) {
            const url = "/serviceArea/" + serviceAreaId;
            this.KeyannaCommonBaseService.get(url).subscribe(
                (response: any) => {
                    // this.serviceareaCheck = false;
                    let serviceAreaData = response.data;
                    serviceAreaData.pincodes.forEach((element:any) => {
                        console.log(
                            "this.commondropdownService.allpincodeNumber :::: ",
                            this.commondropdownService.allpincodeNumber
                        );

                        this.commondropdownService.allpincodeNumber.forEach((e:any) => {
                            console.log("element :::: ", element);
                            if (e.pincodeid == element) {
                                this.pincodeDD.push(e);
                                console.log("this.pincodeDD :::: ", this.pincodeDD);
                            }
                        });
                    });

                    console.log(this.pincodeDD);
                },
                (error: any) => { }
            );
            this.getPartnerAllByServiceArea(serviceAreaId);
            this.getStaffUserByServiceArea(serviceAreaId);
            this.branchByServiceAreaID(serviceAreaId);
            // this.getStaffDetailById(serviceAreaId);
            this.shiftLocationDTO.shiftPartnerid = "";
        }
    }

    getPartnerAllByServiceArea(serviceAreaId:any) {
        const url = "/getPartnerByServiceAreaId/" + serviceAreaId;
        this.commondropdownService.getMethod(url).subscribe(
            (response: any) => {
                this.partnerListByServiceArea = response.partnerList.filter((item:any) => item.id != 1);
                // console.log("partnerList", response);
            },
            (error: any) => { }
        );
    }

    getStaffUserByServiceArea(ids:any) {
        let data = [];
        data.push(ids);
        let url = "/staffsByServiceAreaId/" + ids;
        this.serviceAreaService.getMethod(url).subscribe((response: any) => {
            //
            this.staffList = response.dataList;
        });
    }

    branchByServiceAreaID(ids:any) {
        let data = [];
        data.push(ids);
        let url = "/branchManagement/getAllBranchesByServiceAreaId";
        this.KeyannaCommonBaseService.post(url, data).subscribe((response: any) => {
            this.branchData = response.dataList;
            if (this.branchData != null && this.branchData.length > 0) {
                this.isBranchShiftLocation = true;
                // this.isBranchAvailable = true;
            } else {
                this.isBranchShiftLocation = false;
                // this.isBranchAvailable = false;
            }
        });
    }

    selectPINCODEChange(_event: any, index: any) {
        const url = "/area/pincode?pincodeId=" + _event.value;
        this.KeyannaCommonBaseService.get(url).subscribe(
            (response: any) => {
                this.AreaListDD = response.areaList;
            },
            (error: any) => {
                console.log(error);
            }
        );
        // this.getpincodeData(_event.value, index);
    }
    selectAreaChange(_event: any, index: any) {
        this.getAreaData(_event.value, index);
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
                    countryId: Number(this.areaDetails.countryId),
                });
            }
        });
    }

    modalOpenStaff(type:any) {
        this.staffSelectType = type;
        this.isSelectStaff = true;
        this.selectedStaff = [];
    }

    selectedStaffChange(selectedStaff:any) {
        console.log("selectedStaff ::::: ", selectedStaff);
        this.staffCustList.push({
            id: Number(selectedStaff.id),
            name: selectedStaff.firstname,
        });
        this.isSelectStaff = false;
        console.log("selectedStaff ::::: ", this.staffSelectType);
        if (this.staffSelectType == "paymentCharge") {
            this.paymentOwnerId = Number(selectedStaff.id);
            this.shiftLocationChargeGroupForm.patchValue({
                paymentOwnerId: Number(selectedStaff.id),
            });
        } else if (this.staffSelectType == "requestedBy") this.requestedByID = Number(selectedStaff.id);
        this.staffSelectType = "";
    }

    closeStaff() {
        this.isSelectStaff = false;
        this.staffSelectType = "";
    }

    removeSelStaff(type:any) {
        if (type == "paymentCharge") {
            this.paymentOwnerId = 0;
            this.shiftLocationChargeGroupForm.patchValue({
                paymentOwnerId: "",
            });
        } else if (type == "requestedBy") this.requestedByID = 0;
        this.staffid = null;
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
        console.log("page event", this.selectedParentCust);
        if (this.parentCustomerDialogType === "billable-shift-location") {
            this.billableCustList = [
                {
                    id: this.selectedParentCust.id,
                    name: this.selectedParentCust.name,
                },
            ];
            this.shiftLocationChargeGroupForm.patchValue({
                billableCustomerId: this.selectedParentCust.id,
            });
        }
    }

    closeParentCust() {
        this.showParentCustomerModel = false;
    }

    closeParentCustt() {
        this.ifModelIsShow = false;
    }

    removeSelParentCust(type:any) {
        this.selectedParentCust = [];
        this.billableCustList = [];
        this.shiftLocationChargeGroupForm.patchValue({
            billableCustomerId: null,
        });
        this.isBranchAvailable = false;
    }

    selectcharge(_event: any, type:any) {
        const chargeId = _event.value;
        let viewChargeData;
        let date;

        date = this.currentDate.toISOString();
        const format = "yyyy-MM-dd";
        const locale = "en-US";
        const myDate = date;
        const formattedDate = formatDate(myDate, format, locale);
        const url = "/charge/" + chargeId;
        this.customerManagementService.getMethod(url).subscribe((response: any) => {
            viewChargeData = response.chargebyid;
            this.selectchargeValueShow = true;
            this.shiftLocationChargeGroupForm.patchValue({
                actualprice: Number(viewChargeData.actualprice),
                charge_date: formattedDate,
                type: "One-time",
            });
        });
    }

    selectTypecharge(e:any) {
        // this.chargeGroupForm.get("connection_no").reset();
        // this.chargeGroupForm.get("planid").reset();
        // this.chargeGroupForm.get("expiry").reset();
        // if (e.value == "Recurring") {
        //   // this.chargeGroupForm.get("billingCycle").setValidators([Validators.required]);
        //   // this.chargeGroupForm.get("billingCycle").updateValueAndValidity();
        // } else {
        //   this.chargeGroupForm.value.billingCycle = 0;
        //   // this.chargeGroupForm.get("billingCycle").clearValidators();
        //   // this.chargeGroupForm.get("billingCycle").updateValueAndValidity();
        // }
    }

    saveShiftLocation() :any{
        this.submitted = true;
        this.ifUpdateAddressSubmited = true;
        if (
            (this.shiftLocationDTO.shiftPartnerid === "" && this.isBranchShiftLocation == false) ||
            (this.branchID == 0 && this.isBranchShiftLocation) ||
            (this.shiftLocationChargeGroupForm.value.price <
                this.shiftLocationChargeGroupForm.value.actualprice) ||
            this.requestedByID == 0 ||
            this.presentGroupForm.invalid
        ) {
            return this;
        }

        if (this.shiftLocationChargeGroupForm.valid) {
            if (this.shiftLocationChargeGroupForm.value.type == "Recurring") {
                this.shiftLocationChargeGroupForm.value.billingCycle = 1;
            }
            this.shiftLocationDTO.addressDetails = this.presentGroupForm.getRawValue();
            this.shiftLocationDTO.custChargeOverrideDTO = {
                billableCustomerId: this.shiftLocationChargeGroupForm.value.billableCustomerId,
                custChargeDetailsPojoList: [this.shiftLocationChargeGroupForm.value],
                custid: this.customerId,
                paymentOwnerId: this.shiftLocationChargeGroupForm.value.paymentOwnerId,
            };
            this.shiftLocationDTO.popid = this.shiftLocationPopId;
            this.shiftLocationDTO.oltid = this.shiftLocationOltId;
            this.shiftLocationDTO.requestedById = this.requestedByID;
            this.shiftLocationDTO.branchID = this.branchID;
            if (this.shiftLocationDTO.shiftPartnerid === "") {
                this.shiftLocationDTO.shiftPartnerid = 1;
            }
            if (this.shiftLocationDTO.branchID == 0 || !this.isBranchShiftLocation) {
                this.shiftLocationDTO.branchID = null;
            }
            if (this.shiftLocationDTO.popid == 0) {
                this.shiftLocationDTO.popid = null;
            }
            console.log("this.shiftLocationDTO ::: ", this.shiftLocationDTO);

            const url = "/balanceAndCommissionInfoForShiftLocation/" + this.customerId;
            this.revenueManagementService.getMethod(url).subscribe(
                (response: any) => {
                    console.log("response ::::::::: ", response);
                    this.shiftLocationDTO.isInvoiceCleared = response.balanceAndCommissionInfo.isInvoiceClear;
                    this.shiftLocationDTO.transferableCommission =
                        response.balanceAndCommissionInfo.transferCommission;
                    this.shiftLocationDTO.transferableBalance =
                        response.balanceAndCommissionInfo.transferBalance;
                    const url = "/shiftCustomerLocation/" + this.customerId;
                    this.commondropdownService.postMethod(url, this.shiftLocationDTO).subscribe(
                        (response: any) => {
                            $("#openAddressForm").modal("hide");
                            this.messageService.add({
                                severity: "success",
                                summary: "Successfully",
                                detail: "Shift customer location successfully.",
                                icon: "far fa-check-circle",
                            });
                            this.getCustomersDetail(this.customerId);
                            this.getNewCustomerAddressForCustomer();
                            this.closeShiftLocation();
                        },
                        (error: any) => {
                            if (error.error.status == 417) {
                                this.messageService.add({
                                    severity: "info",
                                    summary: "Info",
                                    detail: error.error.ERROR,
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
        // this.closeShiftLocation();
    }

    closeShiftLocation() {
        this.submitted = false;
        this.ifUpdateAddressSubmited = false;
        this.shiftLocationChargeGroupForm.reset();
        this.ifUpdateAddressSubmited = false;
        this.requestedByID = 0;
        this.branchID = 0;
        this.displayShiftLocationDetails = false;
    }

    pickModalOpen(data:any) {
        let name;
        let entityID;
        name = "SHIFT_LOCATION";
        entityID = data.id;
        let url = "/workflow/pickupworkflow?eventName=" + name + "&entityId=" + entityID;
        this.customerManagementService.getMethod(url).subscribe(
            (response: any) => {
                console.log(this.newCustomerAddressDataForCustometr);
                // this.openCustomerAddress();
                this.getNewCustomerAddressForCustomer();

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

    shiftLocationRejected(data:any) {
        this.approveId = data.id;
        this.rejectApproveShiftLocationModal = true;
        this.assignShiftLocationData = data;
        this.shiftLocationFlagType = "Rejected";
        this.AppRjecHeader = "Reject";
        this.assignAppRejectShiftLocationForm.reset();
    }

    shiftLocationApproved(data:any) {
        this.approveId = data.id;
        this.rejectApproveShiftLocationModal = true;
        this.assignShiftLocationData = data;
        this.shiftLocationFlagType = "approved";
        this.AppRjecHeader = "Apporve ";
        this.assignAppRejectShiftLocationForm.reset();
    }

    closeDisplayShiftLocationDetails() {
        this.rejectApproveShiftLocationModal = false;
    }
    assignShiftLocation1: boolean = false;
    assignAddressApprove() {
        this.assignShiftLocationsubmitted = true;
        if (this.assignAppRejectShiftLocationForm.valid) {
            let url = "/approveCustomerAddress";

            let assignCAFData = {
                addressId: this.assignShiftLocationData.id,
                flag: this.shiftLocationFlagType,
                nextStaffId: 0,
                remark: this.assignAppRejectShiftLocationForm.controls['remark'].value,
                staffId: localStorage.getItem("userId"),
            };

            this.customerManagementService.updateMethod(url, assignCAFData).subscribe(
                (response: any) => {
                    this.rejectApproveShiftLocationModal = false;
                    this.approveInventoryData = null;
                    this.rejectInventoryData = null;
                    if (response.result.dataList) {
                        if (this.shiftLocationFlagType == "approved") {
                            this.approved = true;
                            this.approveInventoryData = response.result.dataList;
                            this.assignShiftLocation1 = true;
                            //   $("#assignCustomerInventoryModal").modal("show");
                        } else {
                            this.reject = true;
                            this.rejectInventoryData = response.result.dataList;
                            this.rejectCustomerInventoryModal = true;
                        }
                    } else {
                        this.getNewCustomerAddressForCustomer();
                    }
                    this.assignAppRejectShiftLocationForm.reset();
                    this.assignShiftLocationsubmitted = false;
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

    assignToStaff(flag:any) {
        let url: any;
        let name: string;
        name = "SHIFT_LOCATION";
        if (!this.selectStaff && !this.selectStaffReject) {
            url = `/teamHierarchy/assignEveryStaff?entityId=${this.approveId}&eventName=${name}&isApproveRequest=${flag}`;
        } else {
            if (flag) {
                url = `/teamHierarchy/assignFromStaffList?entityId=${this.approveId}&eventName=${name}&nextAssignStaff=${this.selectStaff}&isApproveRequest=${flag}`;
            } else {
                url = `/teamHierarchy/assignFromStaffList?entityId=${this.approveId}&eventName=${name}&nextAssignStaff=${this.selectStaffReject}&isApproveRequest=${flag}`;
            }
        }

        this.customerManagementService.getMethod(url).subscribe(
            (response: any) => {
                if (flag) {
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
                            detail: "Approved Successfully.",
                            icon: "far fa-times-circle",
                        });
                    }
                } else {
                    this.messageService.add({
                        severity: "success",
                        summary: "Success",
                        detail: "Rejected Successfully.",
                        icon: "far fa-times-circle",
                    });
                }
                // $("#assignCustomerInventoryModal").modal("hide");
                this.assignShiftLocation1 = false;
                this.rejectCustomerInventoryModal = false;
                this.getNewCustomerAddressForCustomer();
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
    searchPrepaidValue() {
        this.prepaid = "";
        this.prepaidValue = 0;
        const now = new Date();
        let firstDay;
        let lastDay;
        firstDay = this.datepipe.transform(now, "yyyy-MM-dd");
        lastDay = this.datepipe.transform(new Date(now.setDate(now.getDate() + 1)), "yyyy-MM-dd");
        const url =
            "/getCustomer?custid=" + this.customerId + "&startdate=" + firstDay + "&endate=" + firstDay;
        this.revenueManagementService.getMethod(url).subscribe(
            (response: any) => {
                response.customerDBRPojos.forEach((dbr:any) => {
                    // var DBRDate = moment(dbr.month, "DD/MM/YYYY").toDate();
                    // var today = moment(new Date(), "DD/MM/YYYY").toDate();
                    // if (moment(DBRDate.setHours(0, 0, 0, 0)).isSame(moment(today.setHours(0, 0, 0, 0)))) {
                    //     this.prepaidValue = this.prepaidValue + dbr.pendingamt;
                    // }
                });
                this.prepaid = this.prepaidValue.toFixed(2);
            },
            (error: any) => {
                this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail: error.error.errorMessage,
                    icon: "far fa-times-circle",
                });
            }
        );
    }
    shiftWorkflow(data:any) {
        this.ifModelIsShow = true;
        this.PaymentamountService.show("custauditWorkflowModal");
        this.auditcustid.next({
            auditcustid: data.id,
            checkHierachy: "SHIFT_LOCATION",
            planId: "",
        });
    }
    reassignWorkflow() {
        this.assignDocSubmitted = false;
        this.remark = this.assignDocForm.value.remark;
        let url: any;
        url = `/teamHierarchy/reassignWorkflow?entityId=${this.assignedShiftLocationid}&eventName=SHIFT_LOCATION&assignToStaffId=${this.selectStaff}&remark=${this.remark}`;

        this.customerManagementService.getMethod(url).subscribe(
            (response: any) => {
                $("#reAssignPLANModal").modal("hide");
                //  this.getAll();
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
    }
    closeStaffModel(arg0: boolean) {
        this.assignShiftLocation1 = false;
    }
}
