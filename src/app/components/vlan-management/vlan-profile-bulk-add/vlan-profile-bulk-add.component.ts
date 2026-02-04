import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MessageService } from "primeng/api";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { InvoicePaymentListService } from "src/app/service/invoice-payment-list.service";
import { LoginService } from "src/app/service/login.service";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { ActivatedRoute, Router } from "@angular/router";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";
import { StatusCheckService } from "src/app/service/status-check-service.service";
import { VlanProfileService } from "src/app/service/vlan-profile.service";
// import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

declare var $: any;

@Component({
    selector: "app-vlan-profile-bulk-add",
    templateUrl: "./vlan-profile-bulk-add.component.html",
    styleUrls: ["./vlan-profile-bulk-add.component.scss"],
    standalone: false
})
export class VlanProfileBulkAddComponent implements OnInit {
  loggedInUser: any;
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
  showPassword = false;
  passwordCheckStatusList = [
    { label: "True", value: "true" },
    { label: "False", value: "false" }
  ];
  downloadFileOption = [
    { label: ".csv", value: "Bulk-VLAN.csv" },
    { label: ".xlsx", value: "Bulk-VLAN.xlsx" }
  ];
  customerMigration: FormGroup;

  selectedFile: any;
  formSubmit: boolean = false;
  isFIleNameDialog: boolean = false;
  fileName: any;
  actionOptions: any = [
    { label: "Create", value: "create" },
    { label: "Update", value: "update" }
  ];
  action: string = "create";

  constructor(
    public PaymentamountService: PaymentamountService,
    public commondropdownService: CommondropdownService,
    public datepipe: DatePipe,
    public loginService: LoginService,
    public invoicePaymentListService: InvoicePaymentListService,
    private router: Router,
    public KeyannaCommonBaseService: KeyannaCommonBaseService,
    public statusCheckService: StatusCheckService,
    private formBuilder: FormBuilder,
    public vlanProfileService: VlanProfileService,
    private messageService: MessageService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.customerMigration = this.formBuilder.group({
      file: [""]
    });
  }


  async ngOnInit() {
    this.loggedInUser = localStorage.getItem("loginUserName");
    this.mvnoData = JSON.parse(localStorage.getItem("mvnoData"));
    this.mvnoId = localStorage.getItem("mvnoId");
  }

  onFileChangeUpload(event:any) {
    const formData = new FormData();
    let fileArray: FileList;
    this.customerMigration.controls['file'];
    fileArray = this.customerMigration.controls['file'].value;
    console.log(fileArray);
    if (fileArray.length > 0) {
      this.selectedFile = event.target.files[0];
      if (this.customerMigration.controls['file']) {
        if (!this.isValidXLSFile(this.selectedFile) && !this.isValidCSVFile(this.selectedFile)) {
          this.customerMigration.controls['file'].reset();
          alert("Please upload valid .XLSX or .CSV file");
        } else {
          this.formSubmit = true;
        }
      }
    } else {
      alert("Please upload .XLSX file");
    }
  }

  isValidXLSFile(file: any) {
    return file.name.endsWith(".xlsx");
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  uploadDocument() {
    this.submitted = true;
    if (this.customerMigration.valid) {
      const formData = new FormData();
      if (this.customerMigration.controls['file']) {
        if (!this.isValidXLSFile(this.selectedFile) && !this.isValidCSVFile(this.selectedFile)) {
          this.customerMigration.controls['file'].reset();
          alert("Please upload valid .XLSX or .CSV file");
        } else {
          formData.append("file", this.selectedFile);
        }
      }

      if (this.action === "create") {
        this.vlanProfileService.addBulkVLANProfile(formData).subscribe(
          (response: any) => {
            this.formSubmit = false;
            this.customerMigration.controls['file'].reset();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
          },
          error => {
            this.formSubmit = false;
            this.customerMigration.controls['file'].reset();
            if (error.error.status == 400) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: error.error.message,
                icon: "far fa-check-circle"
              });
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.error.message,
                icon: "far fa-check-circle"
              });
            }
          }
        );
      } else {
        this.vlanProfileService.updateBulkVLANProfile(formData).subscribe(
          (response: any) => {
            this.formSubmit = false;
            this.customerMigration.controls['file'].reset();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
          },
          error => {
            this.formSubmit = false;
            this.customerMigration.controls['file'].reset();
            if (error.error.status == 400 || error.error.status == 417) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: error.error.message,
                icon: "far fa-check-circle"
              });
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.error.errorMessage,
                icon: "far fa-check-circle"
              });
            }
          }
        );
      }
    }
  }

  downloadSampleFile() {
    this.vlanProfileService.downloadVlanFile(this.fileName).subscribe(
      (response: any) => {
        const fileExtension = this.fileName.split(".").pop();
        const fileName = `Sample.${fileExtension}`;
        const file = new Blob([response], {
          type: response.type
        });
        // FileSaver.saveAs(file, fileName);
        this.isFIleNameDialog = false;
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

  download() {
    this.isFIleNameDialog = true;
  }

  closeFileNameDialog() {
    this.isFIleNameDialog = false;
  }

  selectAction(event:any) {
    console.log(event);
    this.action = event.value;
  }

  clearForm() {
    this.customerMigration.reset();
    this.formSubmit = false;
    this.action = "create";
  }

  downloadExisitingData() {
    this.vlanProfileService.getAllVlanData().subscribe(
      (response: any) => {
        console.log(response.vlan);
        const parentData = Array.isArray(response.vlan)
          ? response.vlan.map((data:any) => ({
              VLAN_NAME: data.vlanName,
              RADIUS_ATTRIBUTE_GROUP_ID: data.radius_ATTRIBUTE_GROUP_ID,
              mvnoId: data.mvnoId,
              NAS_TYPE: data.nasType,
              CIRCUIT_TYPE: data.circuitType,
              NAS_IDENTIFIER: data.nasIdentifier,
              NAS_PORT_1: data.nasPortId1,
              NAS_PORT_2: data.nasPortId2,
              NAS_PORT_3: data.nasPortId3,
              NAS_PORT_4: data.nasPortId4,
              NAS_PORT_5: data.nasPortId5,
              CALLING_STATION_ID: data.callingStationId,
              FILTER_ID: data.filterId,
              CONTEXT_NAME: data.contextName,
              FORWARD_POLICY: data.forwardPolicy,
              HTTP_REDIRECT_PROFILE: data.httpRedirectProfileName,
              RATE_LIMIT_RATE: data.rateLimitRate,
              RATE_LIMIT_BURST: data.rateLimitBurst,
              QOS_POLICING_POLICY_NAME: data.qosPolicingPolicyName,
              QOS_METERING_POLICY_NAME: data.qosMeteringPolicyName,
              PPPOE_URL: data.pppoeUrl,
              PPP_DNS_PRIMARY: data.pppDnsPrimary,
              PPP_DNS_SECONDARY: data.pppDnsSecondary,
              PPP_NBNS_PRIMARY: data.pppNbnsPrimary,
              SESSION_TIMEOUT: data.sessionTimeOut,
              IDLE_TIMEOUT: data.idleTimeOut,
              FRAMED_IP_ADDRESS: data.framedIpAddress,
              RB_DHCP_MAX_LEASES: data.rbDhcpMaxLeases,
              IP_ADDRESS_POOL_NAME: data.ipAddressPoolName,
              NAT_PROFILE_NAME: data.natProfileName,
              RB_INTERFACE_NAME: data.rbInterfaceName,
              HTTP_REDIRECT_URL: data.httpRedirectUrl,
              FRAMED_IPV6_PREFIX: data.framedIpv6Prefix,
              DELEGATED_IPV6_PREFIX: data.delegatedIpv6Prefix,
              FRAMED_INTERFACE_ID: data.framedInterfaceId,
              FRAMED_IPV6_POOL: data.framedIpv6Pool,
              IPV6_OPTION: data.ipv6Option,
              IPV6_DNS: data.ipv6Dns,
              DELEGATED_MAX_PREFIX: data.delegatedMaxPrefix,
              DELEGATED_IPV6_POOL: data.delegatedIpv6Pool,
              SUB_PROFILE: data.subProfile,
              PRIORITY: data.priority
            }))
          : [];

        // Mapping List Data

        // const mappingData = (response || []).flatMap(data =>
        //   (data.mappingList || []).map(mapping => ({
        //     vlanId: data.vlanId,
        //     validationMappingId: mapping.validationMappingId,
        //     mappingVlanId: mapping.vlanId,
        //     radiusAttribute: mapping.radiusAttribute,
        //     regex: mapping.regex
        //   }))
        // );

        // Create workbook and sheets
        const workbook = XLSX.utils.book_new();

        const parentSheet = XLSX.utils.json_to_sheet(parentData);
        // const mappingSheet = XLSX.utils.json_to_sheet(mappingData);

        XLSX.utils.book_append_sheet(workbook, parentSheet, "Parent Data");
        // XLSX.utils.book_append_sheet(workbook, mappingSheet, "Mapping List");

        // Export workbook
        XLSX.writeFile(workbook, "EXPORT_VLAN_PROFILES.xlsx");
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
