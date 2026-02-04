import { DatePipe, formatDate } from "@angular/common";
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
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
import { ChildCustChangePlanComponent } from "src/app/components/child-cust-change-plan/child-cust-change-plan.component";
import { Subject } from "rxjs";
import { SearchPaymentService } from "src/app/service/search-payment.service";
import { filter, isEqual } from "lodash";
// import * as moment from "moment";
import { Utils } from "src/app/utils/utils";
import { ActivatedRoute, Router } from "@angular/router";
import { NetworkdeviceService } from "src/app/service/networkdevice.service";
import { QuotaDetailsModalComponent } from "../../quota-details-modal/quota-details-modal.component";
import { CustomerService } from "src/app/service/customer.service";
// import { PrimeNGConfig } from "primeng/api";
import { Table } from "primeng/table";
// import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { CountryManagementService } from "src/app/service/country-management.service";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";
import { DeactivateService } from "src/app/service/deactivate.service";
import { StatusCheckService } from "src/app/service/status-check-service.service";
import { LocationService } from "src/app/service/location.service";
import { DeviceDriverService } from "src/app/service/device-driver.service";
import { AcctProfileService } from "src/app/service/radius-profile.service";
import { DBMappingMasterService } from "src/app/service/db-mapping-master.service";
import { Iprofile } from "../../model/acct-profile";
import { CoaService } from "src/app/service/coa.service";
import { DictionaryService } from "src/app/service/dictionary.service";
import { VlanProfileService } from "src/app/service/vlan-profile.service";

declare var $: any;

@Component({
    selector: "app-vlan-profile-create",
    templateUrl: "./vlan-profile-create.component.html",
    styleUrls: ["./vlan-profile-create.component.scss"],
    standalone: false
})
export class VlanProfileCreateComponent implements OnInit {
  editProfileId: any;
  vlanProfileForm: FormGroup;
  loggedInUser: any;
  filteredCoADMProfileList: Array<any> = [];
  filteredProxyServerList: Array<any> = [];
  mappingMasterData: any = [];
  proxyServerData: any = [];
  showProfile: boolean = false;
  filteredMappingList: Array<any> = [];
  mvnoData: any;
  type:any[] = [];
  authenticationMode: any[] = [];
  authenticationType: any[] = [];
  authenticationSubType: any[] = [];
  status = [{ label: "Active" }, { label: "Inactive" }];
  status1 = [{ label: "Enable" }, { label: "Disable" }];
  deviceDriverList: Array<any> = [];
  totalRecords: number;
  submitted = false;
  editMode: boolean = false;
  editProfileData: any = {};
  editProfileMappings: any[] = [];
  mvnoId: any;
  selectedMvnoId: any;
  trustStoreDoc: any = {};
  keystoreDoc: any = {};
  keystorePassword: any = {};
  trustStorePassword: any = {};
  editProfileData1: any;
  selectedTruststoreFilePreview: any[] = [];
  selectedKeystoreFilePreview: any[] = [];
  dictionaryAttributeData: any = [];
  staffId: any;
  showPassword = false;
  passwordCheckStatusList = [
    { label: "True", value: "true" },
    { label: "False", value: "false" }
  ];
  attribute: FormArray;
iscustomerEdit: any;

  constructor(
    private fb: FormBuilder,
    public PaymentamountService: PaymentamountService,
    public commondropdownService: CommondropdownService,
    public datepipe: DatePipe,
    public loginService: LoginService,
    public invoicePaymentListService: InvoicePaymentListService,
    private route: ActivatedRoute,
    private router: Router,
    public KeyannaCommonBaseService: KeyannaCommonBaseService,
    public statusCheckService: StatusCheckService,
    private deviceDriverService: DeviceDriverService,
    private messageService: MessageService,
    private dbMappingMasterService: DBMappingMasterService,
    private coaService: CoaService,
    private dictionaryService: DictionaryService,
    private vlanProfileService: VlanProfileService
  ) {
    this.editProfileId = this.route.snapshot.paramMap.get("profileIdId")!;
    this.selectedMvnoId = this.route.snapshot.paramMap.get("mvnoId")!;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.commondropdownService
      .getMethodWithCache("/commonList/generic/RADIUS_REQUEST_TYPE")
      .subscribe((response: any) => {
        this.type = response.dataList;
      });
    this.attribute = this.fb.array([]);
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
    this.loggedInUser = localStorage.getItem("loggedInUser");

    this.mvnoData = JSON.parse(localStorage.getItem("mvnoData"));
    this.mvnoId = localStorage.getItem("mvnoId");
    // if (this.loggedInUser == "superadmin") {
    this.vlanProfileForm = this.fb.group({
      vlanId: [""],
      vlanName: ["", Validators.required],
      radiusAttributeGroupId: [""],
      nasType: [""],
      circuitType: [""],
      nasIdentifier: ["", Validators.required],
      nasPortId1: [""],
      nasPortId2: [""],
      nasPortId3: [""],
      nasPortId4: [""],
      nasPortId5: [""],
      callingStationId: [""],
      contextName: [""],
      filterId: [""],
      forwardPolicy: [""],
      httpRedirectProfileName: [""],
      rateLimitRate: [""],
      rateLimitBurst: [""],
      qosPolicingPolicyName: [""],
      qosMeteringPolicyName: [""],
      pppoeUrl: [""],
      pppDnsPrimary: [""],
      pppDnsSecondary: [""],
      pppNbnsPrimary: [""],
      sessionTimeOut: [""],
      idleTimeOut: [""],
      framedIpAddress: [""],
      rbDhcpMaxLeases: [""],
      ipAddressPoolName: [""],
      natProfileName: [""],
      rbInterfaceName: [""],
      httpRedirectUrl: [""],
      framedIpv6Prefix: [""],
      delegatedIpv6Prefix: [""],
      framedInterfaceId: [""],
      framedIpv6Pool: [""],
      ipv6Option: [""],
      ipv6Dns: [""],
      delegatedMaxPrefix: [""],
      delegatedIpv6Pool: [""],
      subProfile: [""],
      priority: [""],
      mappingList: [this.attribute.value],
      staffId: localStorage.getItem("userId"),
      loggedInUser: localStorage.getItem("loginUserName")
    });
    this.getAllDictionaryAttributes();
    if (this.editProfileId != null) {
      this.editMode = true;
      this.editVLANProfileById(this.editProfileId, this.selectedMvnoId);
    }
  }

  async addVLANProfile() {
    this.submitted = true;
    if (this.vlanProfileForm.valid && this.attribute.valid) {
      if (this.editMode) {
        this.vlanProfileForm.patchValue({
          mappingList: this.attribute.value
        });
        this.vlanProfileService.updateVLANProfile(this.vlanProfileForm.value).subscribe(
          (response: any) => {
            this.editMode = false;
            this.submitted = false;
            this.vlanProfileForm.reset();
            this.attribute = this.fb.array([]);
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            this.router.navigate(["/home/vlanManagement/list/"]);
          },
          (error: any) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.errorMessage,
              icon: "far fa-times-circle"
            });
          }
        );
      } else {
        this.vlanProfileForm.patchValue({
          mappingList: this.attribute.value,
          priority: Number(this.vlanProfileForm.value.priority)
        });
        this.vlanProfileService.addNewVLANProfile(this.vlanProfileForm.value).subscribe(
          (response: any) => {
            this.submitted = false;
            this.vlanProfileForm.reset();
            this.attribute = this.fb.array([]);
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            console.log("navgate :::::::");
            this.router.navigate(["/home/vlanManagement/list/"]);
          },
          (error: any) => {
            if (error.error.status == 417) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: error.error.errorMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.error.errorMessage,
                icon: "far fa-times-circle"
              });
            }
          }
        );
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

    this.showProfile = false;
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

  async editVLANProfileById(vlanProfileId:any, selectedMvnoId:any) {
    if (this.validateUserToPerformOperations(selectedMvnoId)) {
      this.editMode = true;

      this.vlanProfileService.getProfileById(vlanProfileId).subscribe(
        (response: any) => {
          console.log(response);
          this.editProfileData = response.vlan;
          this.editProfileId = this.editProfileData.vlanId;
          this.vlanProfileForm.patchValue(this.editProfileData);
          let mappingList = this.editProfileData.mappingList;
          mappingList.forEach((element:any) => {
            this.attribute.push(this.fb.group(element));
          });

          console.log("this.vlanProfileForm. ::::::: ", this.vlanProfileForm.value);
        },
        error => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }

  validateUserToPerformOperations(selectedMvnoId:any) {
    let loggedInUserMvnoId = localStorage.getItem("mvnoId");
    if (this.loggedInUser != "superadmin superadmin" && selectedMvnoId != loggedInUserMvnoId) {
      this.messageService.add({
        severity: "info",
        summary: "Rejected",
        detail: "You are not authorized to do this operation. Please contact to the administrator",
        icon: "far fa-check-circle"
      });
      return false;
    }
    return true;
  }

  onAddAttribute() {
    this.submitted = false;
    this.attribute.push(this.createAttributeFormGroup());
  }

  createAttributeFormGroup(): FormGroup {
    return this.fb.group({
      radiusAttribute: ["", Validators.required],
      regex: ["", Validators.required]
    });
  }

  async getAllDictionaryAttributes() {
    this.dictionaryService.findAllAttributes().subscribe(
      (response: any) => {
        this.dictionaryAttributeData = response;
      },
      (error: any) => {
        if (error.error.status == "404") {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        } else {
          console.log("shubham");
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }

  deleteConfirmAttribute(attributeIndex: number) {
    this.attribute.removeAt(attributeIndex);
  }
}
