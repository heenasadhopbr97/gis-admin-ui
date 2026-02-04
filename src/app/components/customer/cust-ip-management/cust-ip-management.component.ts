import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DatePipe, formatDate } from "@angular/common";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CustomerService } from "src/app/service/customer.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LoginService } from "src/app/service/login.service";
declare var $: any;
@Component({
    selector: "app-cust-ip-management",
    templateUrl: "./cust-ip-management.component.html",
    styleUrls: ["./cust-ip-management.component.css"],
    standalone: false
})
export class CustipManagementComponent implements OnInit {
  custData: any = {};
  customerId = 0;
  custType: string = "";
  editmode: boolean = false;
  ipSubmitted: boolean = false;
  displaymode: boolean = true;
  ipManagementGroup: FormGroup;
  ipMapppingListFromArray: FormArray;
  notificationusername: string;
  ipData: any = [""];
  custId: any = [""];
  service: any[] = [];
  custPlanMapppingId: any = [""];
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  dropdownOptions: any[] = [];
  ipListData: any = [];
  ipListDataMaster: any = [];
  createIp: boolean = false;
  changeStatus: string;
  editingRecord: any = {};
  editingIndex: number | null = null;
  currentEditRecord: any;

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    public datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private customerService: CustomerService,
    private confirmationService: ConfirmationService,
    private customerManagementService: CustomermanagementService,
    public PaymentamountService: PaymentamountService,
    private route: ActivatedRoute,
    private router: Router,
    loginService: LoginService
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
  }

  ngOnInit(): void {
    this.ipManagementGroup = this.fb.group({
      ipAddress: ["", Validators.required],
      ipType: ["", Validators.required],
      custid: [""],
      custsermappingid: [""],
      service: [""],
    });
    this.ipMapppingListFromArray = this.fb.array([]);
    this.getService();
    this.getAllIp();
  }
  ipListFormGroup(): FormGroup {
    const selectedService = this.dropdownOptions.find(
      option => option.value === this.ipManagementGroup.value.custid
    );

    return this.fb.group({
      ipAddress: [this.ipManagementGroup.value.ipAddress],
      ipType: [this.ipManagementGroup.value.ipType],
      custsermappingid: [this.ipManagementGroup.value.custid],
      custid: [this.customerId],
      service: [selectedService.label],
    });
  }
  onAddIPList() {
    this.ipSubmitted = true;
    if (this.ipManagementGroup.valid) {
      this.ipMapppingListFromArray.push(this.ipListFormGroup());
      this.ipManagementGroup.reset();
      this.ipSubmitted = false;
    }
  }

  addIp() {
    this.onAddIPList();
    this.createIp = true;
    this.ipSubmitted = false;
  }
  closeaddIp() {
    this.createIp = false;
    this.ipManagementGroup.reset();
    this.ipMapppingListFromArray = this.fb.array([]);
  }

  getControl(row: AbstractControl, controlName: string): FormControl {
    return (row as FormGroup).get(controlName) as FormControl;
  }
  pageChangedMasterNotificationList(event: any): void {
    console.log('Page changed to:', event);
    // Add logic to handle page change here
  }

  TotalItemPerPageNotificationHistory(event:any){
    
  }

  flattenFormArray(formArray: FormArray): any[] {
    return formArray.controls.map((control: AbstractControl) => {
      const group = control as FormGroup;
      const formData: { [key: string]: any } = {};
      Object.keys(group.controls).forEach(key => {
        formData[key] = group.controls[key].value;
      });
      return formData;
    });
  }
  saveIp() {
    this.createIp = false;
    const url = "/customerIpManagement/save";
    const formArrayData = this.flattenFormArray(this.ipMapppingListFromArray);
    this.customerService.saveIps(url, formArrayData).subscribe(
      (response: any) => {
        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-check-circle",
          });
          this.ipMapppingListFromArray = this.fb.array([]);
          this.createIp = true;
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.responseMessage,
            icon: "far fa-check-circle",
          });
          this.ipMapppingListFromArray = this.fb.array([]);
          this.getAllIp();
        }
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

  editIpById(record:any, index: number) {
    this.editmode = true;
    this.displaymode = false;
    this.editingIndex = index;
    this.currentEditRecord = record;
    this.editingRecord = { ...this.ipListData[index] };
  }

  saveChanges() {
    if (this.editingRecord) {
      const url = "/customerIpManagement/update";

      const payload = this.ipListData.map((record:any) => ({
        custid: record.custid,
        ipAddress: record.ipAddress,
        ipType: record.ipType,
        custsermappingid: record.custsermappingid,
        service: record.service,
      }));
      this.customerService.updateIps(url, payload).subscribe(
        (response: any) => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "IP Address updated successfully",
            icon: "far fa-check-circle",
          });
          this.getAllIp();
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
      this.displaymode = true;
      this.editingIndex = null;
    }

    this.editmode = false;
    this.editingRecord = {};
  }
  cancelChanges() {
    this.displaymode = true;
    this.editingRecord = {};
    this.editingIndex = null;
    console.log("this.ipListDataMaster ::::: ", this.ipListDataMaster);
    this.ipListData = this.ipListDataMaster.map((obj:any) => JSON.parse(JSON.stringify(obj)));
  }

  getAllIp() {
    console.log("initial", this.editmode);
    const url = "/customerIpManagement/getIpsByCustId?custId=" + this.customerId;
    this.customerService.getAllIps(url).subscribe(
      (response: any) => {
        this.ipListData = response.customerIps;
        this.ipListDataMaster = this.ipListData.map((obj:any) => JSON.parse(JSON.stringify(obj)));
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

  deleteConfirm(id:any) {
    this.confirmationService.confirm({
      message: "Do you want to delete this IP?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.deleteIp(id);
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

  deleteIp(id:any) {
    const url = "/customerIpManagement/delete?id=" + id;
    this.customerService.deleteIps(url).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle",
        });
        this.getAllIp();
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

  getService() {
    console.log("customer ::::: ", this.customerId);
    const url =
      "/subscriber/getPlanByCustService/" +
      this.customerId +
      "?isAllRequired=true&isNotChangePlan=true";
    this.customerService.getMethod(url).subscribe(
      (response: any) => {
        this.custId = response.dataList;
        this.service = response.dataList.map((item:any) => item.service);
        this.custPlanMapppingId = response.dataList[0].custPlanMapppingId;
        this.dropdownOptions = response.dataList.map((item:any) => ({
          label: item.service,
          value: item.customerServiceMappingId,
        }));
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

  customerDetailOpen() {
    this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
  }

  ipTypeChange(event:any, selectedOption:any) {
    let selected = selectedOption.selectedOption.value;
    if (selected == "Ipv6") {
      this.ipManagementGroup
        .get("ipAddress")
        .setValidators([
          Validators.pattern(
            "^((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*::((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*|((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4})){7}$"
          ),
        ]);
    } else {
      this.ipManagementGroup
        .get("ipAddress")
        .setValidators([Validators.pattern("^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$")]);
    }
  }
}
