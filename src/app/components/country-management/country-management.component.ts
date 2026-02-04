import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { CountryManagementService } from "src/app/service/country-management.service";
// import { Regex } from "src/app/constants/regex";
import { CountryManagement } from "src/app/components/model/country-management";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { COUNTRY } from "src/app/RadiusUtils/RadiusConstants";
import { IDeactivateGuard } from "src/app/service/deactivate.service";
import { Observable, Observer } from "rxjs";
// import { resolve } from "dns";
import { ObserversModule } from "@angular/cdk/observers";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { MASTERS } from "src/app/constants/aclConstants";
import { WhiteeSpaceValidator } from "../shared/custom-validators";

@Component({
    selector: "app-country-management",
    templateUrl: "./country-management.component.html",
    styleUrls: ["./country-management.component.css"],
    standalone: false
})
export class CountryManagementComponent implements OnInit, IDeactivateGuard {
  title = COUNTRY;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  countryFormGroup: FormGroup;
  submitted: boolean = false;
  countryData: CountryManagement;
  countryListData: any;
  isCountryEdit: boolean = false;
  viewCountryListData: any;
  currentPageCountrySlab = 1;
  countryitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  countrytotalRecords: any;
  searchCountryName: any = "";
  searchData: any;
  statusOptions = RadiusConstants.status;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: string;
  public loginService: LoginService;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private countryManagementService: CountryManagementService,
    private commondropdownService: CommondropdownService,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.createAccess = loginService.hasPermission(MASTERS.COUNTRY_CREATE);
    this.deleteAccess = loginService.hasPermission(MASTERS.COUNTRY_DELETE);
    this.editAccess = loginService.hasPermission(MASTERS.COUNTRY_EDIT);
  }

  ngOnInit(): void {
    this.countryFormGroup = this.fb.group({
      name: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
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
    this.getCountryListData("");
  }

  canExit() {
    if (!this.countryFormGroup.dirty) return true;
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

  addEditCountry(countryId:any) {
    this.submitted = true;
    if (this.countryFormGroup.valid) {
      if (countryId) {
        const url = "/country/" + countryId;
        this.countryData = this.countryFormGroup.value;
        this.countryData.delete = false;
        this.countryData.isDelete = false;
        this.countryManagementService.updateMethod(url, this.countryData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.isCountryEdit = false;
            this.countryFormGroup.reset();
            this.countryFormGroup.controls['status'].setValue("");
            this.countryManagementService.clearCache("/country/all");
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.msg,
              icon: "far fa-check-circle",
            });
            this.submitted = false;
            if (this.searchkey) {
              this.searchCountry();
            } else {
              this.getCountryListData("");
            }
          },
          (error: any) => {
            if (error.error.status == 417 || error.error.status == 406) {
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
        const url = "/country";
        this.countryData = this.countryFormGroup.value;
        this.countryData.delete = false;
        this.countryData.isDelete = false;
        // console.log("this.createChargeData", this.countryData);
        this.countryManagementService.postMethod(url, this.countryData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.countryFormGroup.reset();
            this.countryFormGroup.controls['status'].setValue("");
            this.countryManagementService.clearCache("/country/all");
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.msg,
              icon: "far fa-check-circle",
            });
            if (this.searchkey) {
              this.searchCountry();
            } else {
              this.getCountryListData("");
            }
          },
          (error: any) => {
            if (error.error.status == 417 || error.error.status == 406) {
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
      }
    }
  }

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageCountrySlab > 1) {
      this.currentPageCountrySlab = 1;
    }
    if (!this.searchkey) {
      this.getCountryListData(this.showItemPerPage);
    } else {
      this.searchCountry();
    }
  }

  getCountryListData(list:any) {
    // const url = "/country/all"
    // this.countryManagementService.getMethod(url).subscribe((response: any) => {
    const url = "/country/list";
    let size;
    this.searchkey = "";
    let pageList = this.currentPageCountrySlab;
    if (list) {
      size = list;
      this.countryitemsPerPage = list;
    } else {
      size = this.countryitemsPerPage;
    }
    let plandata = {
      page: pageList,
      pageSize: size,
    };
    this.countryManagementService.postMethod(url, plandata).subscribe(
      (response: any) => {
        this.countryListData = response.countryList;
        this.countrytotalRecords = response.pageDetails.totalRecords;
        // console.log("this.countryListData", this.countryListData);

        this.searchkey = "";
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

  editCountry(countryId:any) {
    if (countryId) {
      const url = "/country/" + countryId;
      this.countryManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.isCountryEdit = true;
          this.viewCountryListData = response.countryData;
          // console.log(" this.viewCountryListData", this.viewCountryListData);
          this.countryFormGroup.patchValue(this.viewCountryListData);
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
  }

  searchCountry() {
    if (!this.searchkey || this.searchkey !== this.searchCountryName) {
      this.currentPageCountrySlab = 1;
    }
    this.searchkey = this.searchCountryName;
    if (this.showItemPerPage) {
      this.countryitemsPerPage = this.showItemPerPage;
    }
    this.searchData.filters[0].filterValue = this.searchCountryName.trim();
    this.searchData.page = this.currentPageCountrySlab;
    this.searchData.pageSize = this.countryitemsPerPage;

    const url = "/country/search";
    // console.log("this.searchData", this.searchData)
    this.countryManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.countryListData = response.countryList;
        this.countrytotalRecords = response.pageDetails.totalRecords;
      },
      (error: any) => {
        this.countrytotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
          this.countryListData = [];
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

  clearSearchCountry() {
    this.searchCountryName = "";
    this.searchkey = "";
    this.getCountryListData("");
    this.submitted = false;
    this.isCountryEdit = false;
    this.countryFormGroup.reset();
    this.countryFormGroup.controls['status'].setValue("");
  }

  deleteConfirmonCountry(countryId: number) {
    if (countryId) {
      this.confirmationService.confirm({
        message: "Do you want to delete this " + this.title + "?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteCountry(countryId);
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

  deleteCountry(countryId:any) {
    const url = "/country/" + countryId;

    this.countryManagementService.deleteMethod(url).subscribe(
      (response: any) => {
        if (this.currentPageCountrySlab != 1 && this.countryListData.length == 1) {
          this.currentPageCountrySlab = this.currentPageCountrySlab - 1;
        }
        this.clearSearchCountry();
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.msg,
          icon: "far fa-check-circle",
        });
        if (this.searchkey) {
          this.searchCountry();
        } else {
          this.getCountryListData("");
        }
      },
      (error: any) => {
        if (error.error.status == 417 || error.error.status == 405 || error.error.status == 406) {
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
  }

  pageChangedCountryList(pageNumber:any) {
    this.currentPageCountrySlab = pageNumber;
    if (this.searchkey) {
      this.searchCountry();
    } else {
      this.getCountryListData("");
    }
  }
}
