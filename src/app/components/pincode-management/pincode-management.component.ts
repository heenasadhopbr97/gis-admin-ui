import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { PincodeManagementService } from "src/app/service/pincode-management.service";
import { Regex } from "src/app/constants/regex";
import { CountryManagement } from "src/app/components/model/country-management";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { COUNTRY, CITY, STATE, PINCODE, AREA, REGEX } from "src/app/RadiusUtils/RadiusConstants";
import { Observable, Observer } from "rxjs";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CityManagementComponent } from "../city-management/city-management.component";
import { CityManagementService } from "src/app/service/city-management.service";
import { MASTERS } from "src/app/constants/aclConstants";
import { WhiteeSpaceValidator } from "../shared/custom-validators";

@Component({
    selector: "app-pincode-management",
    templateUrl: "./pincode-management.component.html",
    styleUrls: ["./pincode-management.component.css"],
    standalone: false
})
export class PincodeManagementComponent implements OnInit {
  regex = REGEX;
  countryTitle = COUNTRY;
  cityTitle = CITY;
  stateTitle = STATE;
  pincodeTitle = PINCODE;
  areaTitle = AREA;
  pincodeFormGroup: FormGroup;
  pincodeListData: any = [];
  cityListData: any = [];
  countryListData: any = [];
  stateListData: any = [];
  submitted: boolean = false;
  createPincodeData: any;
  currentPagePincodeListdata = 1;
  pincodeListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  pincodeListdatatotalRecords: any;
  isPincodeEdit: boolean = false;
  viewPincodeListData: any = [];
  searchPincodeName = "";
  cityDetail: any;
  deletedata: any = {
    id: "",
    cityId: "",
    cityName: "",
    code: "",
    countryId: "",
    countryName: "",
    name: "",
    pincodeId: "",
    stateId: "",
    stateName: "",
    status: ""
  };

  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 1;
  searchkey: string;
  totalDataListLength = 0;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  inputshowSelsctData: boolean = false;
  statusOptions = RadiusConstants.status;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private pincodeManagementService: PincodeManagementService,
    loginService: LoginService,
    private commondropdownService: CommondropdownService,
    private cityManagementService: CityManagementService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    this.createAccess = loginService.hasPermission(MASTERS.PINCODE_CREATE);
    this.deleteAccess = loginService.hasPermission(MASTERS.PINCODE_DELETE);
    this.editAccess = loginService.hasPermission(MASTERS.PINCODE_EDIT);
    // this.isPincodeEdit = !this.createAccess && this.editAccess ? true : false;
  }

  ngOnInit(): void {
    this.pincodeFormGroup = this.fb.group({
      pincode: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
      countryId: ["", Validators.required],
      stateId: ["", Validators.required],
      cityId: ["", Validators.required],
      status: ["", Validators.required]
    });
    // this.getStateList();
    // this.getCountryList();
    this.getCityList();
    this.getPincodeList("");
  }

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPagePincodeListdata > 1) {
      this.currentPagePincodeListdata = 1;
    }
    if (!this.searchkey) {
      this.getPincodeList(this.showItemPerPage);
    } else {
      this.searchPincode();
    }
  }

  getPincodeList(list:any) {
    let size;
    this.searchkey = "";
    let page_list = this.currentPagePincodeListdata;
    if (list) {
      size = list;
      this.pincodeListdataitemsPerPage = list;
    } else {
      // if (this.showItemPerPage == 1) {
      //   this.pincodeListdataitemsPerPage = this.pageITEM
      // } else {
      //   this.pincodeListdataitemsPerPage = this.showItemPerPage
      // }
      size = this.pincodeListdataitemsPerPage;
    }
    const url = "/pincode";
    let pincodedata = {
      page: page_list,
      pageSize: size
    };
    this.pincodeListData = [];
    this.pincodeManagementService.postMethod(url, pincodedata).subscribe(
      (response: any) => {
        if (response.responseCode == 204) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.pincodeListData = response.dataList;
          this.pincodeListdatatotalRecords = response.totalRecords;
        }
      },
      (error: any) => {
        console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getCityList() {
    const url = "/city/all";
    this.cityManagementService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.cityListData = response.cityList;
      },
      (error: any) => {
        console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getCountryList() {
    const url = "/country/all";
    this.pincodeManagementService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.countryListData = response.countryList;
      },
      (error: any) => {
        console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getStateList() {
    const url = "/state/all";
    this.pincodeManagementService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.stateListData = response.stateList;
      },
      (error: any) => {
        console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  addEditPincode(pincodeId:any) {
    this.submitted = true;
    if (this.pincodeFormGroup.valid) {
      if (pincodeId) {
        this.viewPincodeListData = this.pincodeFormGroup.value;
        this.viewPincodeListData.pincodeid = pincodeId;
        const url = "/pincode/update";
        this.pincodeManagementService.postMethod(url, this.viewPincodeListData).subscribe(
          (response: any) => {
            if (response.responseCode == 406 || response.responseCode == 417) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.clearPincode();
              this.commondropdownService.clearCache("/pincode/all");
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.responseMessage,
                icon: "far fa-check-circle"
              });
              if (!this.searchkey) {
                this.getPincodeList("");
              } else {
                this.searchPincode();
              }
            }
          },
          (error: any) => {
            console.log(error, "error");

            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.ERROR,
              icon: "far fa-times-circle"
            });
          }
        );
      } else {
        this.createPincodeData = this.pincodeFormGroup.value;
        const url = "/pincode/save";
        this.pincodeManagementService.postMethod(url, this.createPincodeData).subscribe(
          (response: any) => {
            if (response.responseCode == 406) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.clearPincode();
              this.commondropdownService.clearCache("/pincode/all");
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.responseMessage,
                icon: "far fa-check-circle"
              });
              if (!this.searchkey) {
                this.getPincodeList("");
              } else {
                this.searchPincode();
              }

              this.countryListData = "";
              this.stateListData = "";
            }
          },
          (error: any) => {
            console.log(error, "error");

            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.ERROR,
              icon: "far fa-times-circle"
            });
          }
        );
      }
    }
  }

  editPincode(pincodeId:any) {
    if (pincodeId) {
      this.getStateList();
      this.getCountryList();
      this.isPincodeEdit = true;
      this.inputshowSelsctData = true;
      // this.getPincodeById(pincodeId)
      // setTimeout(() => {
      // }, 1000)

      const url = "/pincode/" + pincodeId;
      this.pincodeManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.viewPincodeListData = response.data;
          let viewPincodeList = response.data;
          this.pincodeFormGroup.patchValue(viewPincodeList);
        },
        (error: any) => {
          console.log(error, "error");
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }

  async getPincodeById(pincodeId:any) {
    const url = "/pincode/" + pincodeId;
    this.pincodeManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.viewPincodeListData = response.data;
        this.deletedata = this.viewPincodeListData;
      },
      (error: any) => {
        console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  searchPincode() {
    if (!this.searchkey || this.searchkey !== this.searchPincodeName) {
      this.currentPagePincodeListdata = 1;
    }
    this.searchkey = this.searchPincodeName.trim();

    if (this.showItemPerPage == 1) {
      this.pincodeListdataitemsPerPage = this.pageITEM;
    } else {
      this.pincodeListdataitemsPerPage = this.showItemPerPage;
    }
    this.searchPincodeName = this.searchPincodeName.trim().replace(/\\/g, "");
    const url = "/pincode/search?s=" + this.searchPincodeName;
    this.pincodeManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          this.pincodeListData = [];
          this.pincodeListdatatotalRecords = 0;
        } else {
          if (response.dataList) {
            this.pincodeListData = response.dataList;
            this.pincodeListdatatotalRecords = response.totalRecords;
            if (this.showItemPerPage > this.pincodeListdataitemsPerPage) {
              this.totalDataListLength = this.pincodeListData.length % this.showItemPerPage;
            } else {
              this.totalDataListLength =
                this.pincodeListData.length % this.pincodeListdataitemsPerPage;
            }
          }
        }
      },
      (error: any) => {
        console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  clearSearchPincode() {
    this.searchPincodeName = "";
    this.getPincodeList("");
    this.clearPincode();
  }
  clearPincode() {
    this.submitted = false;
    this.isPincodeEdit = false;
    this.inputshowSelsctData = false;
    this.pincodeFormGroup.reset();
    this.pincodeFormGroup.controls['pincode'].setValue("");
    this.pincodeFormGroup.controls['countryId'].setValue("");
    this.pincodeFormGroup.controls['stateId'].setValue("");
    this.pincodeFormGroup.controls['cityId'].setValue("");
    this.pincodeFormGroup.controls['status'].setValue("");
  }
  getSelCity(event:any) {
    const selCity = event.value;
    console.log("selCity", selCity);
    this.getCityDetailbyd(selCity);
    this.getStateList();
    this.getCountryList();
  }

  getCityDetailbyd(cityId:any) {
    const url = "/city/" + cityId;
    this.pincodeManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.cityDetail = response.cityList;
        // return
        this.inputshowSelsctData = true;
        this.pincodeFormGroup.controls['countryId'].patchValue(this.cityDetail.countryId);
        this.pincodeFormGroup.controls['stateId'].patchValue(this.cityDetail.statePojo.id);
      },
      (error: any) => {
        console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  canExit() {
    if (!this.pincodeFormGroup.dirty) return true;
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
          }
        });
        return false;
      });
    }
  }

  deleteConfirmonPincode(pincodeId: number) {
    this.getPincodeById(pincodeId);
    if (pincodeId) {
      this.confirmationService.confirm({
        message: "Do you want to delete this " + this.pincodeTitle + "?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deletePincode(pincodeId);
        },
        reject: () => {
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected"
          });
        }
      });
    }
  }

  deletePincode(pincodeId:any) {
    const url = "/pincode/delete";
    this.pincodeManagementService.postMethod(url, this.deletedata).subscribe(
      (response: any) => {
        if (this.currentPagePincodeListdata != 1 && this.totalDataListLength == 1) {
          this.currentPagePincodeListdata = this.currentPagePincodeListdata - 1;
        }

        if (
          response.responseCode == 405 ||
          response.responseCode == 406 ||
          response.responseCode == 417
        ) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.responseMessage,
            icon: "far fa-check-circle"
          });
        }
        this.clearSearchPincode();
        if (!this.searchkey) {
          //   this.getPincodeList("");
        } else {
          this.searchPincode();
        }
      },
      (error: any) => {
        console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.responseMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  pageChangedPincodeList(pageNumber:any) {
    this.currentPagePincodeListdata = pageNumber;
    if (!this.searchkey) {
      this.getPincodeList("");
    } else {
      this.searchPincode();
    }
  }
}
