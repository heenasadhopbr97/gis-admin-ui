import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { GovernmentIntegrationService } from "src/app/service/government-integration.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { Observable, Observer } from "rxjs";
import { GovernmentIntegration } from "../model/government-integration";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { INTEGRATION_SYSTEMS } from "src/app/constants/aclConstants";

@Component({
    selector: "app-goverment-integration",
    templateUrl: "./goverment-integration.component.html",
    styleUrls: ["./goverment-integration.component.css"],
    standalone: false
})
export class GovermentIntegrationComponent implements OnInit {
  title = "Government Integration";
  govIntragationFormGroup: FormGroup;
  submitted: boolean = false;
  investigationData: GovernmentIntegration;
  investigationListData: any;
  isInvestmentEdit: boolean = false;
  viewInvestmentListData: any;
  currentPageInvestmentSlab = 1;
  investmentItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  investmentTotalRecords: any;
  searchInvestmentName: any = "";
  searchData: any;
  AclClassConstants:any;
  AclConstants:any;

  statusOptions = RadiusConstants.status;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: string;
  governmentAPIMappingsFormArray: FormArray;
  governmentAPIMappingsFormGroup: FormGroup;

  parameterItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  parametertotalRecords: any;
  currentPageparameter = 1;
  public loginService: LoginService;
  apiMethodList: any;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  createAccess: boolean = false;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private GovernmentIntegrationService: GovernmentIntegrationService,
    loginService: LoginService,
    public commondropdownService: CommondropdownService
  ) {
    this.createAccess = loginService.hasPermission(INTEGRATION_SYSTEMS.GOV_INTEGRATION_CREATE);
    this.deleteAccess = loginService.hasPermission(INTEGRATION_SYSTEMS.GOV_INTEGRATION_DELETE);
    this.editAccess = loginService.hasPermission(INTEGRATION_SYSTEMS.GOV_INTEGRATION_EDIT);
    this.governmentAPIMappingsFormGroup = this.fb.group({
      apiName: ["", Validators.required],
      endpoint: ["", Validators.required],
    });
    this.getMethodType();
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
    this.govIntragationFormGroup = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
      governmentAPIMappings: (this.governmentAPIMappingsFormArray = this.fb.array([])),
      status: ["", Validators.required],
    });

    this.searchData = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and",
        },
      ],
      page: "",
      pageSize: "",
    };
    this.getInvestmentListData("");
  }

  canExit() {
    if (!this.govIntragationFormGroup.dirty) {
      return true;
    }
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

  addEditGovIntegration(govIntegId:any) {
    this.submitted = true;
    if (this.govIntragationFormGroup.valid) {
      if (govIntegId) {
        const url = "/governmentintegrationmaster/update";
        this.govIntragationFormGroup.value.governmentAPIMappings =
          this.governmentAPIMappingsFormArray.value;
        this.investigationData = this.govIntragationFormGroup.value;
        this.investigationData.id = govIntegId;
        this.GovernmentIntegrationService.postMethod(url, this.investigationData).subscribe(
          (response: any) => {
            this.governmentAPIMappingsFormArray = this.fb.array([]);
            this.governmentAPIMappingsFormGroup.reset();
            this.submitted = false;
            this.isInvestmentEdit = false;
            this.govIntragationFormGroup.reset();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.msg,
              icon: "far fa-check-circle",
            });
            this.submitted = false;
            if (this.searchkey) {
              this.searchInvestment();
            } else {
              this.getInvestmentListData("");
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
      } else {
        const url = "/governmentintegrationmaster/save";
        this.isInvestmentEdit = false;
        this.govIntragationFormGroup.value.governmentAPIMappings =
          this.governmentAPIMappingsFormArray.value;
        this.investigationData = this.govIntragationFormGroup.value;
        this.GovernmentIntegrationService.postMethod(url, this.investigationData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.govIntragationFormGroup.reset();
            this.governmentAPIMappingsFormArray = this.fb.array([]);
            this.governmentAPIMappingsFormGroup.reset();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.msg,
              icon: "far fa-check-circle",
            });
            if (this.searchkey) {
              this.searchInvestment();
            } else {
              this.getInvestmentListData("");
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
  }

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageInvestmentSlab > 1) {
      this.currentPageInvestmentSlab = 1;
    }
    if (!this.searchkey) {
      this.getInvestmentListData(this.showItemPerPage);
    } else {
      this.searchInvestment();
    }
  }

  getInvestmentListData(list:any) {
    const url = "/governmentintegrationmaster";
    let size;
    this.searchkey = "";
    let pageList = this.currentPageInvestmentSlab;
    if (list) {
      size = list;
      this.investmentItemsPerPage = list;
    } else {
      size = this.investmentItemsPerPage;
    }
    let plandata = {
      page: pageList,
      pageSize: size,
    };
    this.GovernmentIntegrationService.postMethod(url, plandata).subscribe(
      (response: any) => {
        this.investigationListData = response.dataList;
        this.investigationListData = this.investigationListData.filter((s:any) => s.isdelete != 1);
        this.investmentTotalRecords = response.totalRecords;

        this.searchkey = "";
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

  editCountry(govIntegId:any) {
    if (govIntegId) {
      this.governmentAPIMappingsFormArray = this.fb.array([]);
      this.governmentAPIMappingsFormGroup.reset();
      const url = "/governmentintegrationmaster/" + govIntegId;
      this.GovernmentIntegrationService.getMethod(url).subscribe(
        (response: any) => {
          this.isInvestmentEdit = true;
          this.viewInvestmentListData = response.data;
          this.govIntragationFormGroup.patchValue(this.viewInvestmentListData);
          if (this.viewInvestmentListData.governmentAPIMappings.length > 0) {
            this.viewInvestmentListData.governmentAPIMappings.forEach((element:any) => {
              this.governmentAPIMappingsFormArray.push(
                this.fb.group({
                  apiName: [element.apiName],
                  endpoint: [element.endpoint],
                })
              );
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

  searchInvestment() {
    if (!this.searchkey || this.searchkey !== this.searchInvestmentName) {
      this.currentPageInvestmentSlab = 1;
    }
    this.searchkey = this.searchInvestmentName;
    if (this.showItemPerPage) {
      this.investmentItemsPerPage = this.showItemPerPage;
    }
    this.searchData.filters[0].filterValue = this.searchInvestmentName.trim();
    this.searchData.page = this.currentPageInvestmentSlab;
    this.searchData.pageSize = this.investmentItemsPerPage;

    const url = "/governmentintegrationmaster/search";
    this.GovernmentIntegrationService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.investigationListData = response.countryList;
        this.investmentTotalRecords = response.pageDetails.totalRecords;
      },
      (error: any) => {
        this.investmentTotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
          this.investigationListData = [];
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.response.ERROR,
            icon: "far fa-times-circle",
          });
        }
      }
    );
  }

  clearSearchInvestment() {
    this.searchInvestmentName = "";
    this.searchkey = "";
    this.getInvestmentListData("");
    this.submitted = false;
    this.isInvestmentEdit = false;
    this.govIntragationFormGroup.reset();
    this.governmentAPIMappingsFormArray = this.fb.array([]);
    this.governmentAPIMappingsFormGroup.reset();
  }

  deleteConfirmonInvestigation(govIntegId: number) {
    if (govIntegId) {
      this.confirmationService.confirm({
        message: "Do you want to delete this " + this.title + "?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteInvestigation(govIntegId);
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

  deleteInvestigation(govInteg:any) {
    const url = "/governmentintegrationmaster/delete";
    let data = govInteg;
    data.isDeleted = true;
    this.GovernmentIntegrationService.postMethod(url, data).subscribe(
      (response: any) => {
        if (this.currentPageInvestmentSlab != 1 && this.investigationListData.length == 1) {
          this.currentPageInvestmentSlab = this.currentPageInvestmentSlab - 1;
        }
        this.clearSearchInvestment();
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.msg,
          icon: "far fa-check-circle",
        });
        if (this.searchkey) {
          this.searchInvestment();
        } else {
          this.getInvestmentListData("");
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

  pageChangedCountryList(pageNumber:any) {
    this.currentPageInvestmentSlab = pageNumber;
    if (this.searchkey) {
      this.searchInvestment();
    } else {
      this.getInvestmentListData("");
    }
  }

  onAddParameterMappingList() {
    this.submitted = true;
    if (
      this.governmentAPIMappingsFormGroup.controls['apiName'].value != null &&
      this.governmentAPIMappingsFormGroup.controls['endpoint'].value != null
    ) {
      this.governmentAPIMappingsFormArray.push(this.createParameterMappingFormGroup());
      this.governmentAPIMappingsFormGroup.reset();
      this.submitted = false;
    } else {
      this.governmentAPIMappingsFormGroup.reset();
    }
  }

  createParameterMappingFormGroup(): FormGroup {
    return this.fb.group({
      apiName: [
        this.governmentAPIMappingsFormGroup.value.apiName
          ? this.governmentAPIMappingsFormGroup.value.apiName
          : "",
      ],
      endpoint: [this.governmentAPIMappingsFormGroup.value.endpoint],
    });
  }

  async onRemoveparameter(chargeFieldIndex: number) {
    this.governmentAPIMappingsFormArray.removeAt(chargeFieldIndex);
  }

  deleteConfirmonParameterMappingList(index:any) {
    this.confirmationService.confirm({
      message: "Do you want to delete this Paramater?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.onRemoveparameter(index);
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

  pageChangedParameterMappingList(pageNumber:any) {
    this.currentPageparameter = pageNumber;
  }

  getMethodType() {
    let url = `/commonList/generic/SEND_OPTIONS_GOVERNMENT`;
    this.commondropdownService.getMethodWithCache(url).subscribe((response: any) => {
      this.apiMethodList = response.dataList;
    });
  }
}
