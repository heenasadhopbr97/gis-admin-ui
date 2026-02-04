import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { StateManagementService } from "src/app/service/state-management.service";
import { Regex } from "src/app/constants/regex";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { Observable, Observer } from "rxjs";
import { MASTERS } from "src/app/constants/aclConstants";
import { WhiteeSpaceValidator } from "../shared/custom-validators";

@Component({
    selector: "app-region-management",
    templateUrl: "./region-management.component.html",
    styleUrls: ["./region-management.component.css"],
    standalone: false
})
export class RegionManagementComponent implements OnInit {
  reginFormGroup: FormGroup;
  // countryFormArray: FormArray;
  submitted: boolean = false;
  regionListData: any = [];
  viewRegionListData: any = [];
  currentPageReginListdata = 1;
  ReginListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  ReginListdatatotalRecords: any;
  isReginEdit: boolean = false;
  searchData: any;
  searchReginName: any = "";
  AclClassConstants;
  AclConstants;

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: string;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  statusOptions = RadiusConstants.status;
  public loginService: LoginService;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private stateManagementService: StateManagementService,
    loginService: LoginService,
    public commondropdownService: CommondropdownService
  ) {
    this.createAccess = loginService.hasPermission(MASTERS.REGION_CREATE);
    this.deleteAccess = loginService.hasPermission(MASTERS.REGION_DELETE);
    this.editAccess = loginService.hasPermission(MASTERS.REGION_EDIT);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }

  ngOnInit(): void {
    this.reginFormGroup = this.fb.group({
      rname: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
      status: ["", Validators.required],
      branchid: [""],
      id: [""],
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
    };

    this.getRegionList("");
    this.commondropdownService.getAllActiveBranch();
  }

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageReginListdata > 1) {
      this.currentPageReginListdata = 1;
    }
    if (!this.searchkey) {
      this.getRegionList(this.showItemPerPage);
    } else {
      this.searchRegion();
    }
  }

  getRegionList(list:any) {
    let size;
    this.searchkey = "";
    let List = this.currentPageReginListdata;
    if (list) {
      size = list;
      this.ReginListdataitemsPerPage = list;
    } else {
      size = this.ReginListdataitemsPerPage;
    }
    const url = "/region";
    let plandata = {
      page: List,
      pageSize: size,
    };
    this.stateManagementService.postMethod(url, plandata).subscribe(
      (response: any) => {
        this.regionListData = response.dataList;
        this.ReginListdatatotalRecords = response.totalRecords;

        // console.log("this.regionListData", this.regionListData);
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

  addEditRegion(id:any) {
    this.submitted = true;
    if (this.reginFormGroup.valid) {
      if (id) {
        // setTimeout(() => {
        const url = "/region/update";

        if (this.reginFormGroup.value.branchid.length == 0) {
          this.reginFormGroup.value.branchid = null;
        }
        let regionListData = this.reginFormGroup.value;

        this.stateManagementService.postMethod(url, regionListData).subscribe(
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
              this.isReginEdit = false;
              this.reginFormGroup.reset();
              this.reginFormGroup.controls['branchid'].setValue("");
              this.stateManagementService.clearCache("/region/all");
              if (!this.searchkey) {
                this.getRegionList("");
              } else {
                this.searchRegion();
              }

              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle",
              });
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
        // setTimeout(() => {
        const url = "/region/save";

        if (this.reginFormGroup.value.branchid.length == 0) {
          this.reginFormGroup.value.branchid = null;
        }
        let regionListData = this.reginFormGroup.value;

        this.stateManagementService.postMethod(url, regionListData).subscribe(
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
              this.reginFormGroup.reset();
              this.stateManagementService.clearCache("/region/all");
              if (!this.searchkey) {
                this.getRegionList("");
              } else {
                this.searchRegion();
              }
              this.reginFormGroup.controls['branchid'].setValue("");

              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
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

  editregion(id:any) {
    if (id) {
      const url = "/region/" + id;
      this.stateManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.isReginEdit = true;
          this.viewRegionListData = response.data;
          this.reginFormGroup.patchValue(this.viewRegionListData);
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

  searchRegion() {
    if (!this.searchkey || this.searchkey !== this.searchReginName) {
      this.currentPageReginListdata = 1;
    }
    this.searchkey = this.searchReginName;
    if (this.showItemPerPage) {
      this.ReginListdataitemsPerPage = this.showItemPerPage;
    }

    this.searchData.filter[0].filterValue = this.searchReginName.trim();

    const url =
      "/region/search?page=" +
      this.currentPageReginListdata +
      "&pageSize=" +
      this.ReginListdataitemsPerPage +
      "&sortBy=id&sortOrder=0";
    // console.log("this.searchData", this.searchData)
    this.stateManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        if (response.responseCode == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
          this.regionListData = response.dataList;
          this.ReginListdatatotalRecords = response.totalRecords;
        } else {
          this.regionListData = response.dataList;
          this.ReginListdatatotalRecords = response.totalRecords;
        }
      },
      (error: any) => {
        this.ReginListdatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
          this.regionListData = [];
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

  clearRegionData() {
    this.searchReginName = "";
    this.getRegionList("");
    this.reginFormGroup.reset();
    this.submitted = false;
    this.isReginEdit = false;
    this.reginFormGroup.controls['branchid'].setValue("");
  }

  deleteConfirmon(rdata: any) {
    if (rdata) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Region?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteregion(rdata);
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

  deleteregion(rdata:any) {
    let data = rdata;

    const url = "/region/delete";
    this.stateManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          if (this.currentPageReginListdata != 1 && this.regionListData.length == 1) {
            this.currentPageReginListdata = this.currentPageReginListdata - 1;
          }
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle",
          });
          if (!this.searchkey) {
            this.getRegionList("");
          } else {
            this.searchRegion();
          }
          this.searchReginName = "";
          this.reginFormGroup.reset();
          this.reginFormGroup.controls['branchid'].setValue("");
          this.submitted = false;
          this.isReginEdit = false;
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
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
  }

  pageChangedRegionList(pageNumber:any) {
    this.currentPageReginListdata = pageNumber;
    if (!this.searchkey) {
      this.getRegionList("");
    } else {
      this.searchRegion();
    }
  }
  canExit() {
    if (!this.reginFormGroup.dirty) return true;
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
}
