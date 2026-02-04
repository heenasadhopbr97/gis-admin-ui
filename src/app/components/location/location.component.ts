import { Component, OnInit } from "@angular/core";
import { LocationService } from "src/app/service/location.service";
import { FormBuilder, Validators, FormGroup, FormArray, AbstractControl, FormControl } from "@angular/forms";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { LocationMaster } from "../model/location";
import { LoginService } from "src/app/service/login.service";
import { PRODUCTS } from "src/app/constants/aclConstants";
import { WhiteeSpaceValidator } from "../shared/custom-validators";
@Component({
    selector: "app-location",
    templateUrl: "./location.component.html",
    styleUrls: ["./location.component.css"],
    standalone: false
})
export class LocationComponent implements OnInit {
  locationMaster: any = [];
  changeStatusData: any = [];
  locationData: any = [];
  createForm: FormGroup;
  searchByNameForm: FormGroup;
  submitted = false;
  searchSubmitted = false;
  //Used and required for pagination
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  totalRecords: number;
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  accessData: any = JSON.parse(localStorage.getItem("accessData"));
  editConcurrentId: number;
  editMode: boolean = false;
  status = [{ label: "Active" }, { label: "Inactive" }];
  mvnoData: any;
  name: string;
  loggedInUser: any;
  mvnoId: any;
  modalToggle: boolean = true;
  showItemPerPage: any;
  searchkey: string;
  showLocationDetails: LocationMaster = new LocationMaster();
  showDialogue: boolean;
  createAccess: boolean = false;
  //   deleteAccess: boolean = false;
  editAccess: boolean = false;
  showLocationMac: boolean = false;
  locationMacForm: FormGroup;
  overLocationMacArray = this.fb.array([]);
  locationMacsubmitted: boolean = false;
  locationMacData:any[] = [];
  showChargeDetails: boolean = false;
  isMacExist: boolean = false;
overChargeListItemPerPage: string|number;
currentPageoverChargeList: string|number;
overChargeListtotalRecords: string|number;
  constructor(
    private messageService: MessageService,
    private locationService: LocationService,
    private radiusUtility: RadiusUtility,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    loginService: LoginService
  ) {
    this.createAccess = loginService.hasPermission(PRODUCTS.LOCATION_MASTER_CREATE);
    // this.deleteAccess = loginService.hasPermission(PRODUCTS.LOCATION_MASTER_DELETE);
    this.editAccess = loginService.hasPermission(PRODUCTS.LOCATION_MASTER_EDIT);
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
    this.createForm = this.fb.group({
      name: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
      status: ["", Validators.required],
      checkItem: [""],
      locationIdentifyAttribute: [""],
      locationIdentifyValue: [""],
      mvnoName: [""]
    });

    this.searchByNameForm = this.fb.group({
      name: [""]
    });

    this.locationMacForm = this.fb.group({
      identity: [""],
      mac: ["", Validators.required]
    });

    this.findAll("");
    // this.mvnoData = JSON.parse(localStorage.getItem("mvnoData"));
    this.getMvnoNameAnfId();

    this.loggedInUser = localStorage.getItem("loggedInUser");
    this.mvnoId = localStorage.getItem("mvnoId");
  }

  //Properties of Confirmation Popup
  popoverTitle: string = RadiusConstants.CONFIRM_DIALOG_TITLE;
  popoverMessage: string = RadiusConstants.DELETE_GROUP_CONFIRM_MESSAGE;
  confirmedClicked: boolean = false;
  cancelClicked: boolean = false;
  closeOnOutsideClick: boolean = true;

  async searchByName() {
    if (!this.searchkey || this.searchkey !== this.searchByNameForm.controls['name'].value) {
      this.currentPage = 1;
    }
    this.searchSubmitted = true;
    if (this.searchByNameForm.valid) {
      this.locationData = [];

      let name = this.searchByNameForm.controls['name'].value
        ? this.searchByNameForm.controls['name'].value
        : "";

      if (this.showItemPerPage) {
        this.itemsPerPage = this.showItemPerPage;
      }

      this.searchkey = name;
      this.locationService.getAllLocation(this.currentPage, this.itemsPerPage, name).subscribe(
        (response: any) => {
          this.locationData = response.locationMasterList.data;
          this.totalRecords = response.locationMasterList.totalRecords;
        },
        (error: any) => {
          this.locationData = [];
          this.totalRecords = 0;
          if (error.error.status == 404) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: error.error.errorMessage,
              icon: "far fa-times-circle"
            });
          } else {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.errorMessage,
              icon: "far fa-times-circle"
            });
          }
        }
      );
    }
  }

  async findAll(list:any) {
    let size;
    this.searchkey = "";
    let page = this.currentPage;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      size = this.itemsPerPage;
    }
    this.locationService.getAllLocation(page, size, (this.name = "")).subscribe(
      (response: any) => {
        this.locationData = response.locationMasterList.data;
        this.totalRecords = response.locationMasterList.totalRecords;
      },
      (error: any) => {
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.findAll(this.showItemPerPage);
    } else {
      this.searchByName();
    }
  }

  async deleteById(locationMasterId:any, selectedMvnoId:any, index:any) {
    this.locationService.deleteLocation(locationMasterId, selectedMvnoId).subscribe(
      (response: any) => {
        if (this.currentPage != 1 && index == 0 && this.locationData.length == 1) {
          this.currentPage = this.currentPage - 1;
        }

        if (!this.searchkey) {
          this.findAll("");
          this.locationData = [];
        } else {
          this.searchByName();
        }
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  async addConcurrent() {
    this.submitted = true;
    if (this.loggedInUser === "superadmin superadmin") {
      this.createForm.get("mvnoName").setValidators([Validators.required]);
      this.createForm.get("mvnoName").updateValueAndValidity();
    }
    if (this.createForm.valid) {
      this.createForm.get("mvnoName").clearValidators();
      this.createForm.get("mvnoName").updateValueAndValidity();
      if (this.editMode) {
        const updatedData = {
          locationMasterId: this.editConcurrentId,
          name: this.createForm.value.name,
          status: this.createForm.value.status,
          checkItem: this.createForm.value.checkItem,
          locationIdentifyAttribute: this.createForm.value.locationIdentifyAttribute,
          locationIdentifyValue: this.createForm.value.locationIdentifyValue,
          mvnoName: this.createForm.value.mvnoName,
          locationMasterMapping: this.locationMacData
        };
        this.locationService.updateLocation(updatedData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.createForm.reset();
            if (!this.searchkey) {
              this.findAll("");
            } else {
              this.searchByName();
            }
            this.editMode = false;
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
          },
          (error: any) => {
            this.messageService.add({
              severity: "error",
              summary: error.error.errorMessage,
              detail: error.error.errorMessage,
              icon: "far fa-times-circle"
            });
          }
        );
      } else {
        var addLocationrequest = this.createForm.value;
        if (this.loggedInUser === "superadmin superadmin") {
        }
        // var addLocationrequest.patchValue()
        addLocationrequest.locationMasterMapping = this.locationMacData;
        this.locationService.addNewLocation(addLocationrequest).subscribe(
          (response: any) => {
            this.submitted = false;
            this.createForm.reset();
            this.findAll("");
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            this.overLocationMacArray = this.fb.array([]);
            this.locationMacData = [];
          },
          (error: any) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.errorMessage,
              icon: "far fa-times-circle"
            });
          }
        );
      }
    }
  }

  async editById(locationMasterId:any, index:any, selectedMvnoId:any) {
    console.log("check this1 : ", locationMasterId, index, selectedMvnoId);
    if (this.validateUserToPerformOperations(selectedMvnoId)) {
      this.editMode = true;

      this.editConcurrentId = locationMasterId;
      let locationData: any;
      this.overLocationMacArray = this.fb.array([]);
      this.locationMacData = [];
      this.locationService.getLocationById(locationMasterId).subscribe(
        (response: any) => {
          locationData = response.locationMaster;
          this.createForm.patchValue({
            name: locationData.name,
            status: locationData.status,
            checkItem: locationData.checkItem,
            locationIdentifyAttribute: locationData.locationIdentifyAttribute,
            locationIdentifyValue: locationData.locationIdentifyValue,
            mvnoName: locationData.mvnoId
          });

          if (locationData.locationMasterMappings) {
            const macArray = this.fb.array(
              locationData.locationMasterMappings.map((el: any) =>
                this.fb.group({
                  identity: [el.identity],
                  mac: [el.mac],
                  isUsed: [el.isUsed]
                })
              )
            );
  
            this.createForm.setControl('overLocationMacArray', macArray);
            this.locationMacData = macArray.value;
          }
        },
        error => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      );

      //   this.concurrentService.getConcurrentById(locationMasterId).subscribe(
      //     (response: any) => {
      //       this.editConcurrentId = response.concurrent.locationMasterId;

      //     },
      //     (error: any) => {
      //       this.messageService.add({
      //         severity: 'error',
      //         summary: 'Error',
      //         detail: error.error.errorMessage,
      //         icon: 'far fa-times-circle',
      //       });
      //
      //     }
      //   );
    }
  }

  clearSearchForm() {
    this.editMode = false;
    this.ngOnInit();
    this.searchSubmitted = false;
    this.currentPage = 1;
    this.searchByNameForm.reset();
    this.overLocationMacArray = this.fb.array([]);
    this.locationMacData = [];
    this.findAll("");
  }

  async changeStatus(name:any, status:any, selectedMvnoId:any) {
    if (this.validateUserToPerformOperations(selectedMvnoId)) {
      if (status == "Active") {
        status = "Inactive";
      } else {
        status = "Active";
      }
      this.locationService.changeLocationSatus(name, status, selectedMvnoId).subscribe(
        (response: any) => {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          if (this.searchkey) {
            this.searchByName();
          } else {
            this.findAll("");
          }
        },
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      );
    } else {
      if (!this.searchkey) {
        this.findAll("");
      } else {
        this.searchByName();
      }
    }
  }

  pageChanged(pageNumber:any) {
    this.currentPage = pageNumber;

    if (!this.searchkey) {
      this.findAll("");
    } else {
      this.searchByName();
    }
  }
  deleteConfirm(locationMasterId:any, selectedMvnoId:any, index:any) {
    if (this.validateUserToPerformOperations(selectedMvnoId)) {
      this.confirmationService.confirm({
        message: "Do you want to delete this record?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteById(locationMasterId, selectedMvnoId, index);
          //  this.locationData=[];
        },
        //  this.locationData=[];
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

  concurrent = {
    locationMasterId: 0,
    name: "",
    noOfConcurrentConnections: "",
    status: "",
    mvnoName: ""
  };
  editlocationmasterData: {
    locationMasterId: any;
    name: any;
    noOfConcurrentConnections: any;
    status: any;
    mvnoName: any;
    checkItem: any;
  };

  // showDetail(locationMasterId) {
  //
  //   this.concurrentService
  //     .getConcurrentById(locationMasterId)
  //     .subscribe(
  //       (response: any) => {
  //         this.locationData = response;
  //         this.concurrent = this.locationData.concurrent;
  //
  //       },
  //       (error: any) => {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Error',
  //           detail: error.error.errorMessage,
  //           icon: 'far fa-times-circle',
  //         });
  //
  //       }
  //     );
  // }

  validateUserToPerformOperations(selectedMvnoId:any) {
    let loggedInUserMvnoId = localStorage.getItem("mvnoId");
    if (this.loggedInUser != "superadmin superadmin" && selectedMvnoId != loggedInUserMvnoId) {
      //  this.reset();
      this.messageService.add({
        severity: "info",
        summary: "Rejected",
        detail: "You are not authorized to do this operation. Please contact to the administrator",
        icon: "far fa-check-circle"
      });
      this.modalToggle = false;
      return false;
    }
    return true;
  }

  async getLocationDetail(policyId:any) {
    if (this.validateUserToPerformOperations(this.mvnoId)) {
      this.showDialogue = true;
      this.locationService.getLocationById(policyId).subscribe(
        (response: any) => {
          this.showLocationDetails = response.locationMaster;
        },
        error => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }

  locationMacModelOpen() {
    this.showLocationMac = true;
  }

  locationMacModelClose() {
    this.showLocationMac = false;
    this.locationMacForm.reset();
  }

  addLocationMacListField() {
    this.locationMacsubmitted = true;
  
    if (this.locationMacForm.valid) {
      const macArray = this.locationMacForm.get('overLocationMacArray') as FormArray;
  
      var index = macArray.value.findIndex(
        (x: any) => x.mac === this.locationMacForm.value.mac
      );
  
      if (index === -1) {
        macArray.push(this.createLocationMacListFormGroup()); // Now FormGroup is correctly added
        this.locationMacForm.reset();
        this.locationMacsubmitted = false;
      } else {
        this.isMacExist = true;
      }
    }
  }
  

  keypdown(event: any) {
    if (this.locationMacForm.value.mac != "") {
      this.isMacExist = false;
    } else {
      this.isMacExist = true;
    }
  }

  createLocationMacListFormGroup(): FormGroup {
    return this.fb.group({
      identity: [this.locationMacForm.value.identity],
      mac: [this.locationMacForm.value.mac]
    });
  }

  deleteLocationMapField(locationMapFieldIndex: number) {
    this.overLocationMacArray.removeAt(locationMapFieldIndex);
    if (this.locationMacData != null) {
      this.locationMacData.splice(locationMapFieldIndex);
    }
  }

  saveLocationMacData() {
    this.locationMacData = this.overLocationMacArray.value;
    this.showLocationMac = false;
  }

  locationMacDetailsModelOpen() {
    this.showChargeDetails = true;
  }

  locationMacDetailsModelClose() {
    this.showChargeDetails = false;
  }

  getMvnoNameAnfId() {
    const url = "/mvno/getMvnoNameAndIds";
    this.locationService.getMvnoNameAndIds(url).subscribe(
      (response: any) => {
        this.mvnoData = response.dataList.filter((item:any) => item.id !== 1);
        console.log("Location Data", response);
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }
}
