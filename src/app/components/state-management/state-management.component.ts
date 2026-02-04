import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { StateManagementService } from "src/app/service/state-management.service";
import { Regex } from "src/app/constants/regex";
import { StateManagement } from "src/app/components/model/state-management";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CountryManagement } from "src/app/components/model/country-management";
import { CountryManagementComponent } from "../country-management/country-management.component";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { COUNTRY, CITY, STATE, PINCODE, AREA } from "src/app/RadiusUtils/RadiusConstants";
import { Observable, Observer } from "rxjs";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { MASTERS } from "src/app/constants/aclConstants";
import { WhiteeSpaceValidator } from "../shared/custom-validators";

@Component({
    selector: "app-state-management",
    templateUrl: "./state-management.component.html",
    styleUrls: ["./state-management.component.css"],
    standalone: false
})
export class StateManagementComponent implements OnInit {
  countryTitle = COUNTRY;
  cityTitle = CITY;
  stateTitle = STATE;
  pincodeTitle = PINCODE;
  areaTitle = AREA;
  stateFormGroup: FormGroup;
  // countryFormArray: FormArray;
  submitted: boolean = false;
  stateData: any = {};
  countryListData: any;
  currentPageStateListdata = 1;
  stateListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  stateListdatatotalRecords: any;
  countryPojo: any = {};
  stateListData: any;
  viewCountryListData: any;
  viewStateListData: any;
  isStateEdit: boolean = false;
  searchData: any;
  searchStateName: any = "";
  AclClassConstants;
  AclConstants;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: string;

  statusOptions = RadiusConstants.status;
  public loginService: LoginService;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private stateManagementService: StateManagementService,
    loginService: LoginService,
    private commondropdownService: CommondropdownService
  ) {
    this.createAccess = loginService.hasPermission(MASTERS.STATE_CREATE);
    this.deleteAccess = loginService.hasPermission(MASTERS.STATE_DELETE);
    this.editAccess = loginService.hasPermission(MASTERS.STATE_EDIT);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }

  ngOnInit(): void {
    this.stateFormGroup = this.fb.group({
      name: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
      status: ["", Validators.required],
      countryName: ["", Validators.required],
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

    this.getCountryList();
    this.getStateList("");
    this.countryPojo = {};
    this.viewCountryListData = {
      name: "",
      status: "",
      id: "",
    };
    this.stateData = {
      countryName: "",
    };
  }

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageStateListdata > 1) {
      this.currentPageStateListdata = 1;
    }
    if (!this.searchkey) {
      this.getStateList(this.showItemPerPage);
    } else {
      this.searchState();
    }
  }

  getStateList(list:any) {
    let size;
    this.searchkey = "";
    let List = this.currentPageStateListdata;
    if (list) {
      size = list;
      this.stateListdataitemsPerPage = list;
    } else {
      size = this.stateListdataitemsPerPage;
    }
    // const url = "/state/all"
    // this.stateManagementService.getMethod(url).subscribe((response: any) => {
    const url = "/state/list";
    let plandata = {
      page: List,
      pageSize: size,
    };
    this.stateManagementService.postMethod(url, plandata).subscribe(
      (response: any) => {
        this.stateListData = response.stateList;
        this.stateListdatatotalRecords = response.pageDetails.totalRecords;

        // console.log("this.stateListData", this.stateListData);
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

  countryChange(event:any) {
    this.getCountryById(this.stateFormGroup.controls['countryName'].value);
  }

  addEditState(stateId:any) {
    this.submitted = true;
    if (this.stateFormGroup.valid) {
      if (stateId) {
        // this.getCountryById(this.stateFormGroup.controls.countryName.value);
        // setTimeout(() => {
        const url = "/state/" + stateId;
        this.stateData.name = this.stateFormGroup.controls['name'].value;
        this.stateData.status = this.stateFormGroup.controls['status'].value;
        this.stateData.countryPojo = this.countryPojo;

        //return
        this.stateManagementService.updateMethod(url, this.stateData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.isStateEdit = false;
            this.stateFormGroup.reset();
            this.commondropdownService.clearCache("/state/all");
            if (!this.searchkey) {
              this.getStateList("");
            } else {
              this.searchState();
            }
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle",
            });
          },
          (error: any) => {
            //console.log("msg::::::::::",error);
            if (error.error.status == 406) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: error.error.ERROR,
                icon: "far fa-times-circle",
              });
            } else if (error.error.status == 417) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: error.error.msg,
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
        // this.getCountryById(this.stateFormGroup.controls.countryName.value);
        // setTimeout(() => {
        const url = "/state";

        this.stateData.name = this.stateFormGroup.controls['name'].value;
        this.stateData.status = this.stateFormGroup.controls['status'].value;
        this.stateData.countryPojo = this.countryPojo;
        // console.log(this.stateData);

        //return
        this.stateManagementService.postMethod(url, this.stateData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.stateFormGroup.reset();
            this.commondropdownService.clearCache("/state/all");
            if (!this.searchkey) {
              this.getStateList("");
            } else {
              this.searchState();
            }
            if (response.ERROR) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.ERROR,
                icon: "far fa-check-circle",
              });
            } else {
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.msg,
                icon: "far fa-check-circle",
              });
            }
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
        // }, 3000);
      }
    }
  }

  editState(stateId:any) {
    if (stateId) {
      const url = "/state/" + stateId;
      this.stateManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.isStateEdit = true;
          this.viewStateListData = response.stateData;
          this.stateFormGroup.patchValue(this.viewStateListData);
          this.stateFormGroup.controls['countryName'].patchValue(
            this.viewStateListData.countryPojo.id
          );
          this.getCountryById(this.stateFormGroup.controls['countryName'].value);
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

  getCountryById(countryId:any) {
    if (countryId) {
      //this.spinner.show();
      const url = "/country/" + countryId;
      this.stateManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.countryPojo.name = response.countryData.name;
          this.countryPojo.id = response.countryData.id;
          this.countryPojo.status = response.countryData.status;
          this.stateData.countryName = response.countryData.countryName;
          //this.viewCountryListData = response.countryData;
          // console.log(" this.viewCountryListData", this.viewCountryListData);
          //
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

  getCountryList() {
    const url = "/country/all";
    this.stateManagementService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.countryListData = response.countryList;
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

  searchState() {
    if (!this.searchkey || this.searchkey !== this.searchStateName) {
      this.currentPageStateListdata = 1;
    }
    this.searchkey = this.searchStateName;
    if (this.showItemPerPage) {
      this.stateListdataitemsPerPage = this.showItemPerPage;
    }

    this.searchData.filters[0].filterValue = this.searchStateName.trim();

    this.searchData.page = this.currentPageStateListdata;
    this.searchData.pageSize = this.stateListdataitemsPerPage;
    const url = "/state/search";
    // console.log("this.searchData", this.searchData)
    this.stateManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.stateListData = response.stateList;
        this.stateListdatatotalRecords = response.pageDetails.totalRecords;
      },
      (error: any) => {
        this.stateListdatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
          this.stateListData = [];
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

  clearSearchState() {
    this.searchStateName = "";
    this.getStateList("");
    this.stateFormGroup.reset();
    this.submitted = false;
    this.isStateEdit = false;
  }
  canExit() {
    if (!this.stateFormGroup.dirty) return true;
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

  deleteConfirmonState(stateId: number) {
    if (stateId) {
      this.confirmAndDeleteState(stateId);
    }
  }

  confirmAndDeleteState(stateId: number) {
    this.confirmationService.confirm({
      message: "Do you want to delete this " + this.stateTitle + "?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.deleteState(stateId);
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

  deleteState(stateId: number) {
    const url = "/state/" + stateId;
    this.stateManagementService.deleteMethod(url).subscribe(
      (response: any) => {
        if (this.currentPageStateListdata != 1 && this.stateListData.length == 1) {
          this.currentPageStateListdata = this.currentPageStateListdata - 1;
        }
        // this.handleDeleteResponse(response);
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: "Deleted",
          icon: "far fa-check-circle",
        });
        this.clearSearchState();
      },
      (error: any) => {
        this.handleDeleteError(error);
      }
    );
  }

  handleDeleteResponse(response: any) {
    if (response.responseCode == 200) {
      this.messageService.add({
        severity: "success",
        summary: "Successfully",
        detail: response.error.message,
        icon: "far fa-check-circle",
      });
    } else if (
      response.responseCode == 405 ||
      response.responseCode == 406 ||
      response.responseCode == 417
    ) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: response.responseMessage,
        icon: "far fa-times-circle",
      });
    }
    // if (!this.searchkey) {
    //   this.getStateList("");
    // } else {
    //   this.searchState();
    // }
  }

  handleDeleteError(error: any) {
    console.log("error:::::::::::", error);
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

  pageChangedStateList(pageNumber:any) {
    this.currentPageStateListdata = pageNumber;
    if (!this.searchkey) {
      this.getStateList("");
    } else {
      this.searchState();
    }
  }
}
