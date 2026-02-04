import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { LoginService } from "src/app/service/login.service";
import { ProuctManagementService } from "src/app/service/prouct-management.service";
import { ProductCategoryManagementService } from "src/app/service/product-category-management.service";
import { Observable, Observer } from "rxjs";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { SETTINGS } from "src/app/constants/aclConstants";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";
import { PaymentGatewayConfigurationService } from "src/app/service/payment-gateway-configuration.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

declare var $: any;
@Component({
    selector: "app-payment-gateway-configuration",
    templateUrl: "./payment-gateway-configuration.component.html",
    styleUrls: ["./payment-gateway-configuration.component.scss"],
    standalone: false
})
export class PaymentGatewayConfigurationComponent implements OnInit {
  paymentgatewayConfigFormGroup: FormGroup;
  submitted = false;
  isDropdownClick = false;
  AclClassConstants: any;
  AclConstants: any;
  editMode: boolean = false;
  status = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
  ];
  detailView: boolean = false;
  editAccess: boolean = false;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  paymentgatewayList: any[] = [];
  labelMap: any = {};
  parameterForMap: any = {};

  paymentGatewayConfigurationList: any[] = [];
  paymentConfigItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  paymentConfigCurrentPage = 1;
  paymentConfigTotalRecords: any;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  isEmailConfigEdit:boolean;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public loginService: LoginService,
    public commondropdownService: CommondropdownService,
    public KeyannaCommonBaseService: KeyannaCommonBaseService,
    public paymentGatewayConfigService: PaymentGatewayConfigurationService
  ) {
    this.createAccess = loginService.hasPermission(SETTINGS.PAYMENT_GATEWAY_CONFIGURATION_CREATE);
    this.deleteAccess = loginService.hasPermission(SETTINGS.PAYMENT_GATEWAY_CONFIGURATION_DELETE);
    this.editAccess = loginService.hasPermission(SETTINGS.PAYMENT_GATEWAY_CONFIGURATION_EDIT);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }

  ngOnInit(): void {
    this.paymentgatewayConfigFormGroup = this.fb.group({
      paymentConfigId: [""],
      paymentConfigName: ["", Validators.required],
      paymentGatewayInfo: [""],
    });
    this.getAllPaymentGateway();
    this.getAllPaymentGatewayConfiguration();
  }

  getAllPaymentGatewayConfiguration() {
    var pageRequest = {
      page: this.paymentConfigCurrentPage,
      pageSize: this.paymentConfigItemsPerPage,
    };
    this.paymentGatewayConfigService.getAlPaymentGatewayConfiguration(pageRequest).subscribe(
      (response: any) => {
        this.paymentGatewayConfigurationList = response.dataList;
        this.paymentConfigTotalRecords = response.totalRecords;
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

  getAllPaymentGateway() {
    const url = "/commonList/paymentGateway";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.paymentgatewayList = response.dataList;
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

  onPaymentGatewayChange(event: any) {
    this.submitted = false;
    this.isDropdownClick = true;

    let gatewayName = event.value;

    this.paymentGatewayConfigService.getConfigParameterByname(gatewayName).subscribe(
      (response: any) => {
        if (response.paymentConfig.paymentConfigMappingList.length > 0) {
          this.paymentgatewayConfigFormGroup = this.createForm(
            response.paymentConfig.paymentConfigMappingList
          );
        } else {
          let existingGatewayName = this.paymentgatewayConfigFormGroup.value.paymentConfigName;
          let existingGatewayInfo = this.paymentgatewayConfigFormGroup.value.paymentGatewayInfo;
          this.paymentgatewayConfigFormGroup = this.fb.group({
            paymentConfigId: [""],
            paymentConfigName: [existingGatewayName, Validators.required],
            paymentGatewayInfo: [existingGatewayInfo],
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

  public createForm(data: any): FormGroup {
    let existingGatewayName = this.paymentgatewayConfigFormGroup.value.paymentConfigName;
    let existingGatewayId = this.paymentgatewayConfigFormGroup.value.paymentConfigId;
    let existingGatewayInfo = this.paymentgatewayConfigFormGroup.value.paymentGatewayInfo;
  
    // Explicitly define formGroupConfig type to avoid implicit 'any' error
    const formGroupConfig: Record<string, any[]> = {};  
  
    this.labelMap = {};
    this.parameterForMap = {};
  
    formGroupConfig["paymentConfigName"] = [existingGatewayName, Validators.required];
    formGroupConfig["paymentConfigId"] = [existingGatewayId];
    formGroupConfig["paymentGatewayInfo"] = [existingGatewayInfo];
  
    data.forEach((mapping: any) => {
      formGroupConfig[mapping.paymentParameterName] = [
        mapping.paymentParameterValue,
        Validators.required,
      ];
      this.labelMap[mapping.paymentParameterName] =
        mapping.parameterDisplayName || mapping.paymentParameterName;
      this.parameterForMap[mapping.paymentParameterName] = mapping.paymentParameterFor;
    });
  
    return this.fb.group(formGroupConfig);
  }
  

  addUpdatePaymentGatewayConfig() {
    this.submitted = true;
    if (this.paymentgatewayConfigFormGroup.valid) {
      if (this.editMode) {
        var requestData = this.createRequestData();

        this.paymentGatewayConfigService.updatePaymentGatewayConfiguration(requestData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.editMode = false;
            this.resetConfigForm();
            this.getAllPaymentGatewayConfiguration();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle",
            });
          },
          (error: any) => {
            if (error.status == 400) {
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
      } else {
        var requestData = this.createRequestData();

        this.paymentGatewayConfigService.addPaymentGatewayConfiguration(requestData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.resetConfigForm();
            this.getAllPaymentGatewayConfiguration();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle",
            });
            this.isDropdownClick = false;

            this.isDropdownClick = false;
          },
          (error: any) => {
            if (error.status == 400) {
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
            this.isDropdownClick = false;
          }
        );
      }
    }
  }

  createRequestData() {
    let paymentConfigMappingList: any[] = [];

    for (const key in this.paymentgatewayConfigFormGroup.value) {
      if (
        key !== "paymentConfigName" &&
        key !== "paymentConfigId" &&
        key !== "paymentGatewayInfo"
      ) {
        const transformedItem = {
          paymentParameterName: key,
          paymentParameterValue: this.paymentgatewayConfigFormGroup.value[key],
        };
        paymentConfigMappingList.push(transformedItem);
      }
    }

    var request = {
      paymentConfigName: this.paymentgatewayConfigFormGroup.value.paymentConfigName,
      paymentConfigId: this.paymentgatewayConfigFormGroup.value.paymentConfigId,
      paymentGatewayInfo: this.paymentgatewayConfigFormGroup.value.paymentGatewayInfo,
      paymentConfigMappingList: paymentConfigMappingList,
    };

    return request;
  }

  resetConfigForm() {
    this.paymentgatewayConfigFormGroup.reset();
    this.paymentgatewayConfigFormGroup = this.fb.group({
      paymentConfigName: ["", Validators.required],
      paymentGatewayInfo: [""],
      paymentConfigId: [""],
    });
  }

  editConfigById(configId:any) {
    this.editMode = true;
    this.paymentGatewayConfigService.getPaymentgatewayConfigurationById(configId).subscribe(
      (response: any) => {
        var configuration = response.paymentConfig;
        this.paymentgatewayConfigFormGroup.controls['paymentConfigName'].setValue(
          configuration.paymentConfigName
        );
        this.paymentgatewayConfigFormGroup.controls['paymentConfigId'].setValue(
          configuration.paymentConfigId
        );
        this.paymentgatewayConfigFormGroup.controls['paymentGatewayInfo'].setValue(
          configuration.paymentGatewayInfo
        );
        this.paymentgatewayConfigFormGroup = this.createForm(
          configuration.paymentConfigMappingList
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

  canExit() {
    if (!this.paymentgatewayConfigFormGroup.dirty) return true;
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
          },
        });
        return false;
      });
    }
  }

  changeConfigStatus(config:any) {
    var request = {
      paymentConfigId: config.paymentConfigId,
      isActive: config.isActive,
    };

    this.paymentGatewayConfigService.changePaymentGatewatConfigStatus(request).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle",
        });
      },
      (error: any) => {
        if (error.status == 400) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.ERROR,
            icon: "far fa-times-circle",
          });
          config.isActive = false;
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

  deletePaymentConfigConfirmation(configId:any) {
    if (configId) {
      this.confirmationService.confirm({
        message: "Do you want to delete this payment gateway configuration ?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deletePaymentConfig(configId);
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

  deletePaymentConfig(configId:any) {
    this.paymentGatewayConfigService.deletePaymentGatewayConfiguration(configId).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle",
        });
        this.getAllPaymentGatewayConfiguration();
        this.resetConfigForm();
        this.editMode = false;
        this.isDropdownClick = false;
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

  pageChanged(pageNumber:any) {
    this.paymentConfigCurrentPage = pageNumber;
    this.getAllPaymentGatewayConfiguration();
  }

  TotalItemPerPage(event: any) {
    this.paymentConfigItemsPerPage = Number(event.value);
    this.getAllPaymentGatewayConfiguration();
  }
  resetForm() {
    this.paymentgatewayConfigFormGroup.reset();
    this.resetConfigForm();
    this.editMode = false;
    this.isDropdownClick = false;
  }

  resetFormConfirm() {
    this.confirmationService.confirm({
      message: "Do you want to clear this form ?",
      header: "Clear Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.resetForm();
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
