import { DatePipe, formatDate } from "@angular/common";
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
// import * as FileSaver from "file-saver";
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
    selector: "app-vlan-audit-create",
    templateUrl: "./vlan-audit.component.html",
    styleUrls: ["./vlan-audit.component.scss"],
    standalone: false
})
export class VlanAuditComponent implements OnInit {
  editProfileId: any;
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPage: any;
  searchkey: string;

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  vlanProfileForm: FormGroup;
  loggedInUser: any;
  filteredCoADMProfileList: Array<any> = [];
  filteredProxyServerList: Array<any> = [];
  mappingMasterData: any = [];
  proxyServerData: any = [];
  showProfile: boolean = false;
  filteredMappingList: Array<any> = [];
  searchSubmitted = false;
  mvnoData: any;
  searchData: any = [];
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
  searchProfileForm: FormGroup;
  searchOption: any;
  staffId: any;
  showPassword = false;
  passwordCheckStatusList = [
    { label: "True", value: "true" },
    { label: "False", value: "false" }
  ];
  attribute: FormArray;
  profileData: any[];
  auditDetails: any;

  searchOptionSelect = [
    { label: "Staff name", value: "staffName" },
    { label: "Action", value: "action" }
  ];
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

  async ngOnInit() {
    this.loggedInUser = localStorage.getItem("loggedInUser");

    this.mvnoData = JSON.parse(localStorage.getItem("mvnoData"));
    this.mvnoId = localStorage.getItem("mvnoId");
    this.findAllVLANAudit("");
    this.searchProfileForm = this.fb.group({
      staffName: [""],
      action: [""]
    });

    this.searchData = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ],
      page: "",
      pageSize: ""
    };
  }
  findAllVLANAudit(list:any) {
    let size;
    this.auditDetails = null;
    let page = this.currentPage;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      size = this.itemsPerPage;
    }
    this.profileData = [];
    var pageRequest = {
      size: size,
      page: page
    };
    this.vlanProfileService.findAllVLANAudit(pageRequest).subscribe(
      (response: any) => {
        this.auditDetails = response.vlanAuditList.data;
        console.log(response);
        this.totalRecords = response.vlanAuditList.totalRecords;
      },
      error => {
        this.totalRecords = 0;
        if (error.error.status == 404) {
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
  pageAuditChanged(pageNumber:any) {
    this.currentPage = pageNumber;
    if (!this.searchkey) {
      this.findAllVLANAudit("");
    } else {
      this.searchProfileByName();
    }
  }

  TotalItemPerPageAudit(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.findAllVLANAudit(this.showItemPerPage);
    } else {
      this.searchProfileByName();
    }
  }

  searchProfileByName() {
    this.auditDetails = null;
    this.searchSubmitted = true;
    if (!this.searchkey || this.searchkey !== this.searchOption) {
      this.currentPage = 1;
    }
    this.searchkey = this.searchOption;
    if (this.showItemPerPage) {
      this.itemsPerPage = this.showItemPerPage;
    }
    this.searchData.filters[0].filterValue = this.searchProfileForm.value.staffName.trim();
    this.searchData.filters[0].filterColumn = this.searchOption.trim();
    this.searchData.filters[0].filterDataType = "";
    this.searchData.page = this.currentPage;
    this.searchData.pageSize = this.itemsPerPage;

    if (this.searchProfileForm.valid) {
      this.vlanProfileService.filterAudit(this.searchData).subscribe(
        (response: any) => {
          this.auditDetails = response.acctCdr.content;
          console.log(response.acctCdr.content);
          this.totalRecords = response.acctCdr.totalElements;
        },
        error => {
          this.auditDetails = null;
          this.totalRecords = 0;
          if (error.error.status == 404) {
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
  }
  selSearchOption(event:any) {
    console.log(event);
    if (event.value == "staffName") {
      this.searchProfileForm.patchValue({
        stffName: ""
      });
    } else {
      this.searchProfileForm.patchValue({
        action: ""
      });
    }
  }
  clearSearchForm() {
    this.searchSubmitted = false;
    this.searchProfileForm.reset();
    this.currentPage = 1;
    this.itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
    this.searchOption = "";
    this.findAllVLANAudit("");
  }

  downloadAuditFile(filename:any) {
    this.vlanProfileService.downloadVlanAuditFile(filename).subscribe(
      (response: any) => {
        const fileExtension = filename.split(".").pop();
        const fileName = `Sample.${fileExtension}`;
        const file = new Blob([response], {
          type: response.type
        });
        // FileSaver.saveAs(file, fileName);
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong!!!!",
          icon: "far fa-times-circle"
        });
      }
    );
  }
}
