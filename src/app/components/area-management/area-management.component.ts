import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { AreaManagementService } from "src/app/service/area-management.service";
import { Regex } from "src/app/constants/regex";
import { CountryManagement } from "src/app/components/model/country-management";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { COUNTRY, CITY, STATE, PINCODE, AREA } from "src/app/RadiusUtils/RadiusConstants";
import { Observable, Observer } from "rxjs";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CityManagementService } from "src/app/service/city-management.service";
import { StateManagementService } from "src/app/service/state-management.service";
import { PincodeManagementService } from "src/app/service/pincode-management.service";
import { MASTERS } from "src/app/constants/aclConstants";
import { WhiteeSpaceValidator } from "../shared/custom-validators";

@Component({
    selector: "app-area-management",
    templateUrl: "./area-management.component.html",
    styleUrls: ["./area-management.component.css"],
    standalone: false
})
export class AreaManagementComponent implements OnInit {
  countryTitle = COUNTRY;
  cityTitle = CITY;
  stateTitle = STATE;
  pincodeTitle = PINCODE;
  areaTitle = AREA;
  areaFormGroup!: FormGroup;
  areaListData: any;
  pincodeListData: any;
  cityListData: any;
  countryListData: any;
  areaModal: boolean = false;
  stateListData: any;
  submitted: boolean = false;
  createAreaData: any;
  currentPageAreaListdata = 1;
  areaListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  areaListdatatotalRecords: any;
  viewAreaListData: any;
  isAreaEdit: boolean = false;
  pincode: any = {};
  pincodeDetail: any;
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
    status: "",
    pincode: "",
  };
  areaInputview: boolean = false;
  AclClassConstants;
  AclConstants;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  statusOptions = RadiusConstants.status;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 0;
  searchkey!: string;
  totalAreaListLength = 0;
  searchAreaName: any = "";
  areaparticularData: any = [];
  public loginService: LoginService;
  searchData: any;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private areaManagementService: AreaManagementService,
    private commondropdownService: CommondropdownService,
    private pincodemanagemnetService: PincodeManagementService,
    private statemanagementService: StateManagementService,
    private citymanagementservice: CityManagementService,
    loginService: LoginService
  ) {
    this.createAccess = loginService.hasPermission(MASTERS.AREA_CREATE);
    this.deleteAccess = loginService.hasPermission(MASTERS.AREA_DELETE);
    this.editAccess = loginService.hasPermission(MASTERS.AREA_EDIT);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    // this.isAreaEdit = !this.createAccess && this.editAccess ? true : false;
  }

  ngOnInit(): void {
    this.areaFormGroup = this.fb.group({
      name: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
      countryId: ["", Validators.required],
      stateId: ["", Validators.required],
      cityId: ["", Validators.required],
      pincodeId: ["", Validators.required],
      status: ["", Validators.required],
    });

    this.searchData = {
      filter: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and",
        },
      ],
      //  page: '',
      // pageSize: '',
    };

    this.pincode = {};
    this.getStateList();
    this.getCityList();
    this.getCountryList();
    this.getPincodeList();
    this.getAreaList("");
  }

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageAreaListdata > 1) {
      this.currentPageAreaListdata = 1;
    }
    if (!this.searchkey) {
      this.getAreaList(this.showItemPerPage);
    } else {
      this.searchArea();
    }
  }

  getAreaList(list:any) {
    let size;
    this.searchkey = "";
    let page_list = this.currentPageAreaListdata;
    if (list) {
      size = list;
      this.areaListdataitemsPerPage = list;
    } else {
      // if (this.showItemPerPage == 0) {
      //   this.areaListdataitemsPerPage = this.pageITEM
      // } else {
      //   this.areaListdataitemsPerPage = this.showItemPerPage
      // }
      size = this.areaListdataitemsPerPage;
    }
    const url = "/area";
    let areadata = {
      page: page_list,
      pageSize: size,
    };
    this.areaListData = [];
    this.areaManagementService.postMethod(url, areadata).subscribe(
      (response: any) => {
        if (response.responseCode == 204) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        } else {
          this.areaListData = response.dataList;
          this.areaListdatatotalRecords = response.totalRecords;
        }
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

  searchArea() {
    if (!this.searchkey || this.searchkey !== this.searchAreaName) {
      this.currentPageAreaListdata = 1;
    }
    this.searchkey = this.searchAreaName;
    if (this.showItemPerPage) {
      this.pageITEM = this.showItemPerPage;
    }
    this.searchData.filter[0].filterValue = this.searchAreaName.trim();

    //this.searchData.page = this.currentPageAreaListdata
    //this.searchData.pageSize = this.pageITEM
    const url =
      "/area/search?page=" +
      this.currentPageAreaListdata +
      "&pageSize=" +
      this.pageITEM +
      "&sortBy=id&sortOrder=0";
    //console.log("this.searchData", this.searchData)
    this.areaManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        if (response.responseCode == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
          this.areaListData = [];
          this.areaListdatatotalRecords = 0;
        } else {
          this.areaListData = response.dataList;
          this.areaListdatatotalRecords = response.totalRecords;
        }
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

  clearSearchArea() {
    this.searchAreaName = "";
    this.getAreaList("");
    this.submitted = false;
    this.isAreaEdit = false;
    this.areaInputview = false;
    this.areaFormGroup.reset();
  }

  getPincodeList() {
    const url = "/pincode/all";
    this.pincodemanagemnetService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.pincodeListData = response.dataList.filter((pincode:any) => pincode.status == "Active");
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

  getCityList() {
    const url = "/city/all";
    this.citymanagementservice.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.cityListData = response.cityList;
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
    this.areaManagementService.getMethodWithCache(url).subscribe(
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

  addEditArea(areaId:any) {
    this.submitted = true;
    if (this.areaFormGroup.valid) {
      if (areaId) {
        // this.getPincodeById(this.areaFormGroup.controls.pincodeId.value);
        // setTimeout(() => {
        this.createAreaData = this.areaFormGroup.value;
        this.createAreaData.id = areaId;
        this.createAreaData.pincode = this.pincode;
        const url = "/area/update";
        this.areaManagementService.postMethod(url, this.createAreaData).subscribe(
          (response: any) => {
            if (response.responseCode == 406 || response.responseCode == 417) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.responseMessage,
                icon: "far fa-times-circle",
              });
            } else {
              this.submitted = false;
              this.isAreaEdit = false;
              this.areaInputview = false;
              this.areaFormGroup.reset();
              this.commondropdownService.clearCache("/area/all");
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.responseMessage,
                icon: "far fa-check-circle",
              });
              if (!this.searchkey) {
                this.getAreaList("");
              } else {
                this.searchArea();
              }
            }
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
        // }, 3000);
      } else {
        // this.getPincodeById(this.areaFormGroup.controls.pincodeId.value);
        // setTimeout(() => {
        this.createAreaData = this.areaFormGroup.value;
        this.createAreaData.pincode = this.pincode;
        // emove  this.createAreaData.pincodeId
        const url = "/area/save";
        this.areaManagementService.postMethod(url, this.createAreaData).subscribe(
          (response: any) => {
            if (response.responseCode == 406) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.responseMessage,
                icon: "far fa-times-circle",
              });
            } else {
              this.submitted = false;
              this.areaInputview = false;
              this.areaFormGroup.reset();
              this.commondropdownService.clearCache("/area/all");
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.responseMessage,
                icon: "far fa-check-circle",
              });
              if (!this.searchkey) {
                this.getAreaList("");
              } else {
                this.searchArea();
              }
            }
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
        // }, 3000);
      }
    }
  }

  editArea(areaId:any) {
    if (areaId) {
      this.isAreaEdit = true;
      this.areaInputview = true;
      // this.getAreaById(areaId);
      // setTimeout(() => {
      //   this.areaFormGroup.patchValue(this.viewAreaListData);
      // }, 1000);

      const url = "/area/" + areaId;
      this.areaManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.viewAreaListData = response.data;
          this.deletedata = this.viewAreaListData;
          this.areaFormGroup.patchValue(this.viewAreaListData);
          this.getPincodeById(this.areaFormGroup.controls['pincodeId'].value);
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

  async getAreaById(areaId:any) {
    const url = "/area/" + areaId;
    this.areaManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.viewAreaListData = response.data;
        this.deletedata = this.viewAreaListData;
        this.areaInputview = true;
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

  getPincodeById(pincodeId:any) {
    if (pincodeId) {
      //
      const url = "/pincode/" + pincodeId;

      this.areaManagementService.getMethod(url).subscribe(
        (response: any) => {
          // console.log("pinresponse", response)
          this.pincode.pincodeid = response.data.pincodeid;
          this.pincode.pincode = response.data.pincode;
          this.pincode.status = response.data.status;
          this.pincode.isDeleted = response.data.isDeleted;
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

  getSelPincode(event:any) {
    const selPincode = event.value;
    this.getPincodeDetailbyId(selPincode);
  }

  getPincodeDetailbyId(pincodeId:any) {
    const url = "/pincode/" + pincodeId;
    this.areaManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.pincodeDetail = response.data;
        // console.log("this.pincodeDetail", this.pincodeDetail);
        // return
        this.areaInputview = true;
        this.areaFormGroup.controls['countryId'].patchValue(this.pincodeDetail.countryId);
        this.areaFormGroup.controls['stateId'].patchValue(this.pincodeDetail.stateId);
        this.areaFormGroup.controls['pincodeId'].patchValue(this.pincodeDetail.pincodeid);
        this.areaFormGroup.controls['cityId'].patchValue(this.pincodeDetail.cityId);

        this.pincode.pincodeid = response.data.pincodeid;
        this.pincode.pincode = response.data.pincode;
        this.pincode.status = response.data.status;
        this.pincode.isDeleted = response.data.isDeleted;
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
  canExit() {
    if (!this.areaFormGroup.dirty) return true;
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

  deleteConfirmonArea(areaId: number) {
    this.getAreaById(areaId);
    if (areaId) {
      this.confirmationService.confirm({
        message: "Do you want to delete this " + this.areaTitle + "?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteArea(areaId);
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

  deleteArea(areaId:any) {
    const url = "/area/delete";
    //console.log("this.createQosPolicyData", this.deletedata);
    this.areaManagementService.postMethod(url, this.deletedata).subscribe(
      (response: any) => {
        if (this.currentPageAreaListdata != 1 && this.totalAreaListLength == 1) {
          this.currentPageAreaListdata = this.currentPageAreaListdata - 1;
        }
        if (response.responseCode == 405 || response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.responseMessage,
            icon: "far fa-check-circle",
          });
        }
        this.clearSearchArea();
        if (!this.searchkey) {
          //   this.getAreaList("");
        } else {
          this.searchArea();
        }
      },
      (error: any) => {
        console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.responseMessage,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  pageChangedAreaList(pageNumber:any) {
    this.currentPageAreaListdata = pageNumber;
    if (!this.searchkey) {
      this.getAreaList("");
    } else {
      this.searchArea();
    }
  }

  areaDataOpenModel(data:any) {
    this.areaparticularData = data;
    this.areaModal = true;
  }

  closeAreaModal() {
    this.areaModal = false;
  }
}
