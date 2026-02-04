import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { CityManagementService } from "src/app/service/city-management.service";
import { Regex } from "src/app/constants/regex";
import { CountryManagement } from "src/app/components/model/country-management";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { COUNTRY, CITY, STATE, PINCODE, AREA } from "src/app/RadiusUtils/RadiusConstants";
import { Observable, Observer } from "rxjs";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { StateManagementService } from "src/app/service/state-management.service";
import { MASTERS } from "src/app/constants/aclConstants";
import { WhiteeSpaceValidator } from "../shared/custom-validators";

@Component({
    selector: "app-city-management",
    templateUrl: "./city-management.component.html",
    styleUrls: ["./city-management.component.css"],
    standalone: false
})
export class CityManagementComponent implements OnInit {
  countryTitle = COUNTRY;
  cityTitle = CITY;
  stateTitle = STATE;
  pincodeTitle = PINCODE;
  areaTitle = AREA;
  cityFormGroup!: FormGroup;
  countryListData: any;
  stateListData: any;
  submitted: boolean = false;
  cityData: any = {};
  statePojo: any = {};
  countryPojo: any = {};
  cityListData: any;
  currentPageCityListdata = 1;
  cityListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  cityListdatatotalRecords: any;
  isCityEdit: boolean = false;
  viewCityListData: any;
  searchData: any;
  searchCityName: any = "";

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey!: string;

  statusOptions = RadiusConstants.status;
  countryselectshow = false;
  stateseclectData: any = [];
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private cityManagementService: CityManagementService,
    loginService: LoginService,
    private commondropdownService: CommondropdownService,
    private statemanagementService: StateManagementService
  ) {
    this.createAccess = loginService.hasPermission(MASTERS.CITY_CREATE);
    this.deleteAccess = loginService.hasPermission(MASTERS.CITY_DELETE);
    this.editAccess = loginService.hasPermission(MASTERS.CITY_EDIT);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }

  ngOnInit(): void {
    this.cityFormGroup = this.fb.group({
      name: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
      status: ["", Validators.required],
      countryId: ["", Validators.required],
      stateName: ["", Validators.required],
    });
    this.getCountryList();
    this.getStateList();
    this.getCityList("");
    this.statePojo = {};
    this.countryPojo = {};
    this.cityData = {
      countryName: "",
    };

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
  }

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageCityListdata > 1) {
      this.currentPageCityListdata = 1;
    }
    if (!this.searchkey) {
      this.getCityList(this.showItemPerPage);
    } else {
      this.searchCity();
    }
  }

  getCityList(list:any) {
    // const url = "/city/all"
    // this.cityManagementService.getMethod(url).subscribe((response: any) => {
    let size;
    this.searchkey = "";
    let pageList = this.currentPageCityListdata;
    if (list) {
      size = list;
      this.cityListdataitemsPerPage = list;
    } else {
      size = this.cityListdataitemsPerPage;
    }
    const url = "/city/list";
    let plandata = {
      page: pageList,
      pageSize: size,
    };
    this.cityManagementService.postMethod(url, plandata).subscribe(
      (response: any) => {
        this.cityListData = response.cityList;
        this.cityListdatatotalRecords = response.pageDetails.totalRecords;

        // this.cityListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
      },
      (error: any) => {
        console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  getCountryList() {
    const url = "/country/all";
    this.cityManagementService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.countryListData = response.countryList;
      },
      (error: any) => {
        console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  getStateList() {
    const url = "/state/all";
    this.statemanagementService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.stateListData = response.stateList;
      },
      (error: any) => {
        console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  selectStateChange(event: any) {
    let id = Number(event.value);
    const url = "/state/" + id;
    this.cityManagementService.getMethod(url).subscribe((response: any) => {
      this.countryselectshow = true;
      this.stateseclectData = response.stateData.countryPojo.id;
      this.cityFormGroup.patchValue({
        countryId: response.stateData.countryPojo.id,
      });
      this.statePojo.name = response.stateData.name;
      this.statePojo.id = response.stateData.id;
      this.statePojo.status = response.stateData.status;
      this.cityData.countryName = response.stateData.countryName;
      this.getCountryById(this.cityFormGroup.controls['countryId'].value);
    });
  }

  addEditCity(cityId:any) {
    this.submitted = true;
    if (this.cityFormGroup.valid) {
      if (cityId) {
        // this.getCountryById(this.cityFormGroup.controls.countryId.value);
        // this.getStateById(this.cityFormGroup.controls.stateName.value);
        // setTimeout(() => {
        const url = "/city/" + cityId;
        this.cityData.name = this.cityFormGroup.controls['name'].value;
        this.cityData.status = this.cityFormGroup.controls['status'].value;
        this.cityData.countryId = this.cityFormGroup.controls['countryId'].value;
        this.cityData.statePojo = this.statePojo;
        this.cityData.statePojo.countryPojo = this.countryPojo;
        this.cityManagementService.updateMethod(url, this.cityData).subscribe(
          (response: any) => {
            this.clearCity();
            this.isCityEdit = false;
            this.commondropdownService.clearCache("/city/all");
            if (!this.searchkey) {
              this.getCityList("");
            } else {
              this.searchCity();
            }

            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle",
            });
          },
          (error: any) => {
            //console.log(error, "error");
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
        // }, 3000);
      } else {
        // this.getCountryById(this.cityFormGroup.controls.countryId.value);
        // this.getStateById(this.cityFormGroup.controls.stateName.value);
        // setTimeout(() => {
        const url = "/city";
        this.cityData.name = this.cityFormGroup.controls['name'].value;
        this.cityData.status = this.cityFormGroup.controls['status'].value;
        this.cityData.countryId = this.cityFormGroup.controls['countryId'].value;
        this.cityData.statePojo = this.statePojo;
        this.cityData.statePojo.countryPojo = this.countryPojo;
        this.cityManagementService.postMethod(url, this.cityData).subscribe(
          (response: any) => {
            this.clearCity();
            this.commondropdownService.clearCache("/city/all");
            if (!this.searchkey) {
              this.getCityList("");
            } else {
              this.searchCity();
            }

            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle",
            });
          },
          (error: any) => {
            if (error.error.status == 406) {
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
        // }, 3000);
      }
    }
  }

  editCity(cityId:any) {
    if (cityId) {
      const url = "/city/" + cityId;
      this.cityManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.isCityEdit = true;
          this.countryselectshow = true;
          this.viewCityListData = response.cityList;
          //console.log("this.viewCityListData", this.viewCityListData)
          this.cityFormGroup.patchValue(this.viewCityListData);
          this.cityFormGroup.controls['stateName'].patchValue(this.viewCityListData.statePojo.id);
          this.cityFormGroup.controls['countryId'].patchValue(
            this.viewCityListData.statePojo.countryPojo.id
          );
          let data = {
            value: this.viewCityListData.statePojo.id,
          };

          this.selectStateChange(data);
        },
        (error: any) => {
          console.log(error, "error");
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

  getCountryById(countryId:any) {
    if (countryId) {
      //this.spinner.show();
      const url = "/country/" + countryId;
      this.cityManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.countryPojo.name = response.countryData.name;
          this.countryPojo.id = response.countryData.id;
          this.countryPojo.status = response.countryData.status;
          this.cityData.countryName = response.countryData.name;
          //this.viewCountryListData = response.countryData;

          //
        },
        (error: any) => {
          console.log(error, "error");
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

  getStateById(stateId:any) {
    if (stateId) {
      //
      const url = "/state/" + stateId;
      this.cityManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.statePojo.name = response.stateData.name;
          this.statePojo.id = response.stateData.id;
          this.statePojo.status = response.stateData.status;
          this.cityData.countryName = response.stateData.countryName;
          //this.viewCountryListData = response.countryData;

          //
        },
        (error: any) => {
          console.log(error, "error");
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

  searchCity() {
    if (!this.searchkey || this.searchkey !== this.searchCityName) {
      this.currentPageCityListdata = 1;
    }
    this.searchkey = this.searchCityName;
    if (this.showItemPerPage) {
      this.cityListdataitemsPerPage = this.showItemPerPage;
    }
    this.searchData.filters[0].filterValue = this.searchCityName.trim();

    this.searchData.page = this.currentPageCityListdata;
    this.searchData.pageSize = this.cityListdataitemsPerPage;
    const url = "/city/search";
    //console.log("this.searchData", this.searchData)
    this.cityManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.cityListData = response.cityList;
        this.cityListdatatotalRecords = response.pageDetails.totalRecords;
      },
      (error: any) => {
        this.cityListdatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
          this.cityListData = [];
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

  clearSearchCity() {
    this.searchCityName = "";
    this.getCityList("");
    this.clearCity();
  }

  clearCity() {
    this.submitted = false;
    this.countryselectshow = false;
    this.cityFormGroup.reset();
    this.isCityEdit = false;
    this.cityFormGroup.controls["name"].setValue("");
    this.cityFormGroup.controls["status"].setValue("");
    this.cityFormGroup.controls["countryId"].setValue("");
    this.cityFormGroup.controls["stateName"].setValue("");
  }
  canExit() {
    if (!this.cityFormGroup.dirty) return true;
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
  deleteConfirmonCity(cityId: number) {
    if (cityId) {
      this.confirmationService.confirm({
        message: "Do you want to delete this " + this.cityTitle + "?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteCity(cityId);
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

  deleteCity(cityId:any) {
    const url = "/city/" + cityId;
    this.cityManagementService.deleteMethod(url).subscribe(
      (response: any) => {
        if (this.currentPageCityListdata != 1 && this.cityListData.length == 1) {
          this.currentPageCityListdata = this.currentPageCityListdata - 1;
        }
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle",
        });
        this.clearSearchCity();
        if (!this.searchkey) {
          this.getCityList("");
        } else {
          this.searchCity();
        }
      },
      (error: any) => {
        console.log(error, "error");
        if (error.error.status == 405 || error.error.status == 417) {
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

  pageChangedCityList(pageNumber:any) {
    this.currentPageCityListdata = pageNumber;
    if (!this.searchkey) {
      this.getCityList("");
    } else {
      this.searchCity();
    }
  }
}
