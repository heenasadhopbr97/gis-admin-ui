import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { CountryManagementService } from "src/app/service/country-management.service";
// import { Regex } from "src/app/constants/regex";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { COUNTRY } from "src/app/RadiusUtils/RadiusConstants";
import { IDeactivateGuard } from "src/app/service/deactivate.service";
import { Observable, Observer } from "rxjs";
// import { resolve } from "dns";
import { ObserversModule } from "@angular/cdk/observers";
import { DepartmentManagement } from "../model/department-management";
import { MASTERS } from "src/app/constants/aclConstants";
import { WhiteeSpaceValidator } from "../shared/custom-validators";

@Component({
    selector: "app-department-management",
    templateUrl: "./department-management.component.html",
    styleUrls: ["./department-management.component.css"],
    standalone: false
})
export class DepartmentManagementComponent implements OnInit, IDeactivateGuard {
  title = RadiusConstants.DEPARMENT;
  departmentFormGroup: FormGroup;
  submitted: boolean = false;
  departmentData: DepartmentManagement;
  departmentListData: any;
  isDepartmentEdit: boolean = false;
  viewDepartmentListData: any;
  currentPageDepartment = 1;
  departmentitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  departmenttotalRecords: any;
  searchDepartmentName: any = "";
  searchData: any;
  AclClassConstants;
  AclConstants;

  statusOptions = RadiusConstants.status;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: string;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  public loginService: LoginService;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private countryManagementService: CountryManagementService,
    loginService: LoginService
  ) {
    this.createAccess = loginService.hasPermission(MASTERS.DEPARTMENT_CREATE);
    this.deleteAccess = loginService.hasPermission(MASTERS.DEPARTMENT_DELETE);
    this.editAccess = loginService.hasPermission(MASTERS.DEPARTMENT_EDIT);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    // this.isDepartmentEdit = !this.createAccess && this.editAccess ? true : false;
  }

  ngOnInit(): void {
    this.departmentFormGroup = this.fb.group({
      name: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
      status: ["", Validators.required]
    });

    this.searchData = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ],
      page: "",
      pageSize: ""
    };
    this.getDepartmentListData("");
  }

  canExit() {
    if (!this.departmentFormGroup.dirty) return true;
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

  addEditDepartment(countryId:any) {
    this.submitted = true;
    if (this.departmentFormGroup.valid) {
      if (countryId) {
        const url = "/department/" + countryId;
        this.departmentData = this.departmentFormGroup.value;
        this.departmentData.delete = false;
        this.departmentData.isDelete = false;
        this.countryManagementService.updateMethod(url, this.departmentData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.isDepartmentEdit = false;
            this.departmentFormGroup.reset();
            this.departmentFormGroup.controls[status].setValue("");
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.msg,
              icon: "far fa-check-circle"
            });
            this.submitted = false;
            if (this.searchkey) {
              this.searchDepartment();
            } else {
              this.getDepartmentListData("");
            }
          },
          (error: any) => {
            // console.log(error, "error")
            if (error.error.status == 406 || error.error.status == 417) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: error.error.ERROR,
                icon: "far fa-times-circle"
              });
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.error.ERROR,
                icon: "far fa-times-circle"
              });
            }
          }
        );
      } else {
        const url = "/department/save";
        this.departmentData = this.departmentFormGroup.value;
        this.departmentData.delete = false;
        this.departmentData.isDelete = false;
        // console.log("this.createChargeData", this.departmentData);
        this.countryManagementService.postMethod(url, this.departmentData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.departmentFormGroup.reset();
            this.departmentFormGroup.controls['status'].setValue("");
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.msg,
              icon: "far fa-check-circle"
            });
            if (this.searchkey) {
              this.searchDepartment();
            } else {
              this.getDepartmentListData("");
            }
          },
          (error: any) => {
            console.log(error, "error");
            if (error.error.status == 406) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: error.error.ERROR,
                icon: "far fa-check-circle"
              });
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.error.ERROR,
                icon: "far fa-times-circle"
              });
            }
          }
        );
      }
    }
  }

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageDepartment > 1) {
      this.currentPageDepartment = 1;
    }
    if (!this.searchkey) {
      this.getDepartmentListData(this.showItemPerPage);
    } else {
      this.searchDepartment();
    }
  }

  getDepartmentListData(list:any) {
    // const url = "/department/all"
    // this.countryManagementService.getMethod(url).subscribe((response: any) => {
    const url = "/department/list";
    let size;
    this.searchkey = "";
    let pageList = this.currentPageDepartment;
    if (list) {
      size = list;
      this.departmentitemsPerPage = list;
    } else {
      size = this.departmentitemsPerPage;
    }
    let plandata = {
      page: pageList,
      pageSize: size
    };
    this.countryManagementService.postMethod(url, plandata).subscribe(
      (response: any) => {
        this.departmentListData = response.departmentList;
        this.departmenttotalRecords = response.pageDetails.totalRecords;

        this.searchkey = "";
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  editDepartment(countryId:any) {
    if (countryId) {
      const url = "/department/" + countryId;
      this.countryManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.isDepartmentEdit = true;
          this.viewDepartmentListData = response.departmentData;
          // console.log(" this.viewDepartmentListData", this.viewDepartmentListData);
          this.departmentFormGroup.patchValue(this.viewDepartmentListData);
        },
        (error: any) => {
          // console.log(error, "error")
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

  searchDepartment() {
    if (!this.searchkey || this.searchkey !== this.searchDepartmentName) {
      this.currentPageDepartment = 1;
    }
    this.searchkey = this.searchDepartmentName;
    if (this.showItemPerPage) {
      this.departmentitemsPerPage = this.showItemPerPage;
    }
    this.searchData.filters[0].filterValue = this.searchDepartmentName.trim();
    this.searchData.page = this.currentPageDepartment;
    this.searchData.pageSize = this.departmentitemsPerPage;

    const url = "/department/search";
    // console.log("this.searchData", this.searchData)
    this.countryManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.departmentListData = response.departmentList;
        this.departmenttotalRecords = response.pageDetails.totalRecords;
      },
      (error: any) => {
        this.departmenttotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.departmentListData = [];
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.response.ERROR,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }

  clearSearchDepartment() {
    this.searchDepartmentName = "";
    this.searchkey = "";
    this.getDepartmentListData("");
    this.submitted = false;
    this.isDepartmentEdit = false;
    this.departmentFormGroup.reset();
    this.departmentFormGroup.controls['status'].setValue("");
  }

  deleteConfirmonDepartment(countryId: number) {
    if (countryId) {
      this.confirmationService.confirm({
        message: "Do you want to delete this " + this.title + "?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteDepartment(countryId);
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

  deleteDepartment(countryId:any) {
    const url = "/department/" + countryId;

    this.countryManagementService.deleteMethod(url).subscribe(
      (response: any) => {
        if (this.currentPageDepartment != 1 && this.departmentListData.length == 1) {
          this.currentPageDepartment = this.currentPageDepartment - 1;
        }
        this.clearSearchDepartment();
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.msg,
          icon: "far fa-check-circle"
        });
        if (this.searchkey) {
          this.searchDepartment();
        } else {
          this.getDepartmentListData("");
        }
      },
      (error: any) => {
        // console.log(error, "error")
        if (error.error.status == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }

  pageChangedDepartmentList(pageNumber:any) {
    this.currentPageDepartment = pageNumber;
    if (this.searchkey) {
      this.searchDepartment();
    } else {
      this.getDepartmentListData("");
    }
  }
}
