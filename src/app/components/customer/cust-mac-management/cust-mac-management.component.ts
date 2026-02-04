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
    selector: "app-cust-mac-management",
    templateUrl: "./cust-mac-management.component.html",
    styleUrls: ["./cust-mac-management.component.css"],
    standalone: false
})
export class CustmacManagementComponent implements OnInit {
  custData: any = {};
  customerId = 0;
  custType: string = "";
  editmode: boolean = false;
  macSubmitted: boolean = false;
  displaymode: boolean = true;
  macManagementGroup: FormGroup;
  macMapppingListFromArray: FormArray;
  notificationusername: string;
  macData: any = [""];
  custId: any = [""];
  service: any[] = [];
  custPlanMapppingId: any = [""];
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  dropdownOptions: any[] = [];
  macListData: any = [];
  createMac: boolean = false;
  changeStatus: string;
  editingRecord: any = {};
  editingIndex: number | null = null;
  currentEditRecord: any;

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    public datePmace: DatePipe,
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
    this.macManagementGroup = this.fb.group({
      macAddress: ["", [Validators.required]],
      custid: [""],
      custsermappingid: [""],
      service: [""],
    });
    this.macMapppingListFromArray = this.fb.array([]);
    this.getService();
    this.getAllMac();
  }

  macListFormGroup(): FormGroup {
    const selectedService = this.dropdownOptions.find(
      option => option.value === this.macManagementGroup.value.custid
    );

    return this.fb.group({
      macAddress: [this.macManagementGroup.value.macAddress],
      custsermappingid: [this.macManagementGroup.value.custid],
      service: [selectedService.label],
      customer: {
        id: this.customerId,
      },
      isDeleted: false,
    });
  }
  onAddmacList() {
    this.macSubmitted = true;
    if (this.macManagementGroup.valid) {
      const formGroup = this.macListFormGroup();
      formGroup.addControl("isDeleted", new FormControl(false));
      this.macMapppingListFromArray.push(this.macListFormGroup());
      this.macManagementGroup.reset();
      this.macSubmitted = false;
    }
  }
  addMac() {
    this.onAddmacList();
    this.createMac = true;
    this.macSubmitted = false;
  }
  closeaddMac() {
    this.createMac = false;
    this.macMapppingListFromArray = this.fb.array([]);
    this.macManagementGroup.reset();
  }

  getControl(row: AbstractControl, controlName: string): FormControl {
    return (row as FormGroup).get(controlName) as FormControl;
  }

  flattenFormArray(formArray: FormArray): any[] {
    return formArray.controls.map((control: AbstractControl) => {
      const group = control as FormGroup;
      const formData: Record<string, any> = {};
      Object.keys(group.controls).forEach(key => {
        formData[key] = group.controls[key].value;
      });
      return formData;
    });
  }
  saveMac() {
    const url = "/customerMacManagement/save";
    const formArrayData = this.flattenFormArray(this.macMapppingListFromArray);
    this.customerService.saveMacs(url, formArrayData).subscribe(
      (response: any) => {
        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-check-circle",
          });
          this.macMapppingListFromArray = this.fb.array([]);
        } else {
          this.createMac = false;
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.responseMessage,
            icon: "far fa-check-circle",
          });
          this.macMapppingListFromArray = this.fb.array([]);
          this.createMac = false;
          this.getAllMac();
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

  editMacById(record:any, index: number) {
    this.editmode = true;
    this.displaymode = false;
    this.editingIndex = index;
    this.currentEditRecord = record;
    this.editingRecord = { ...this.macListData[index] };
  }

  saveChanges() {
    if (this.editingRecord) {
      const updatedRecords: { customer: any; macAddress: any; custsermappingid: any; id: any } = {
        id: this.editingRecord.id,
        macAddress: this.editingRecord.macAddress,
        custsermappingid: this.editingRecord.custsermappingid,
        customer: {
          id: this.customerId,
        },
      };

      const url = "/customerMacManagement/update";
      this.customerService.updateMacs(url, updatedRecords).subscribe(
        (response: any) => {
          if (response.responseCode == 417) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.responseMessage,
              icon: "far fa-check-circle",
            });
          } else {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: response.responseMessage,
              icon: "far fa-check-circle",
            });
            this.getAllMac();
          }
        },
        (error: any) => {
          // Handle error
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
      this.getAllMac();
    }

    this.editmode = false;
    this.editingRecord = {};
  }
  cancelChanges() {
    this.displaymode = true;
    this.editingRecord = {};
    this.editingIndex = null;
  }

  getAllMac() {
    const url = "/customerMacManagement/findByCustId?custId=" + this.customerId;
    this.customerService.getAllMacs(url).subscribe(
      (response: any) => {
        this.macListData = response.dataList;
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
      message: "Do you want to delete this MAC?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.deleteMac(id);
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

  deleteMac(id:any) {
    const url = "/customerMacManagement/delete?custMacMapppingId=" + id;
    this.customerService.deleteMacs(url).subscribe(
      (response: any) => {
        this.getAllMac();
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

  pageChangedMasterNotificationList(event:any){

  }

  TotalItemPerPageNotificationHistory(event: any){

  }

  customerDetailOpen() {
    this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
  }

  onServiceSelected(serviceId: any) {
    const selectedService = this.dropdownOptions.find(option => option.value === serviceId);

    this.macMapppingListFromArray.controls.forEach(control => {
      control.get("service").setValue(selectedService.label);
    });
  }
}
