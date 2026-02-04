import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { Regex } from "src/app/constants/regex";
import { CountryManagement } from "src/app/components/model/country-management";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { COUNTRY } from "src/app/RadiusUtils/RadiusConstants";
import { BranchManagementService } from "src/app/components/branch-management/branch-management.service";
import { Observable, Observer } from "rxjs";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { StateManagementService } from "src/app/service/state-management.service";
import { MASTERS } from "src/app/constants/aclConstants";
import { WhiteeSpaceValidator } from "../shared/custom-validators";
@Component({
    selector: "app-business-vertical-management",
    templateUrl: "./business-vertical-management.component.html",
    styleUrls: ["./business-vertical-management.component.css"],
    standalone: false
})
export class BusinessVerticalManagementComponent implements OnInit {
  title = "Business Vertical";
  businessVerticalFormGroup!: FormGroup;
  submitted: boolean = false;
  countryData!: CountryManagement;
  regionListData: any;
  isBusinessVEdit: boolean = false;
  viewBusinessVListData: any;
  currentPageBusinessVSlab = 1;
  businessVitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  businessVtotalRecords: any;
  searchCountryName: any = "";
  searchBusinessVName: any = "";
  searchData: any;
  businessVisData: any[] = [];
  businessVData: any = [];
  AclClassConstants:any;
  AclConstants:any;
  businessData: any;
  isDeleted!: boolean;
  regionSector: any[] = [];
  isEdit!: boolean;
  statusOptions = RadiusConstants.status;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey!: string;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  public loginService: LoginService;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private branchManagementService: BranchManagementService,
    loginService: LoginService,
    private commondropdownService: CommondropdownService,
    private stateManagementService: StateManagementService
  ) {
    this.loginService = loginService;
    this.createAccess = loginService.hasPermission(MASTERS.BUSINESS_VERTICALS_CREATE);
    this.deleteAccess = loginService.hasPermission(MASTERS.BUSINESS_VERTICALS_DELETE);
    this.editAccess = loginService.hasPermission(MASTERS.BUSINESS_VERTICALS_EDIT);
  }

  ngOnInit(): void {
    this.businessVerticalFormGroup = this.fb.group({
      vname: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
      region_id: [],
      status: ["", Validators.required]
    });

    this.searchData = {
      filter: [
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

    this.getRegionList();
    this.getAllBussiesVerticalData(""); //   this.getCountryListData("");
  }
  getSelectCustomerSector(id: any) {
    const idtem = id;
    console.log(idtem, "idtem");
  }
  getRegionList() {
    const url = "/region/all";
    const custerlist = {};
    this.stateManagementService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.regionSector = response.dataList;
        console.log(this.regionSector, " this.regionSector");
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
  addEdit(id:any) {
    this.submitted = true;
    if (this.businessVerticalFormGroup.valid) {
      //console.log("2 " , this.businessVerticalFormGroup.value)

      if (id) {
        //console.log("3 ")

        const url = "/businessverticals/update";
        this.businessVData = this.businessVerticalFormGroup.value;
        //console.log(this.businessData,"businessData")
        this.businessVData.id = id;
        this.branchManagementService.postMethod(url, this.businessVData).subscribe(
          (response: any) => {
            if (response.responseCode == 406) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.submitted = false;
              this.isBusinessVEdit = false;
              this.businessVerticalFormGroup.reset();
              this.businessVerticalFormGroup.controls['status'].setValue("");
              this.getAllBussiesVerticalData("");
              this.commondropdownService.clearCache("/businessverticals/all");

              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle"
              });
              this.submitted = false;
              if (this.searchkey) {
                //this.search();
              } else {
                //this.getListData("");
              }
            }
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
      } else {
        // console.log("4");

        const url = "/businessverticals/save";
        this.businessData = this.businessVerticalFormGroup.value;
        // console.log(this.businessData, " this.businessData ");
        this.branchManagementService.postMethod(url, this.businessData).subscribe(
          (response: any) => {
            if (response.responseCode == 406) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.submitted = false;
              this.businessVerticalFormGroup.reset();
              this.businessVerticalFormGroup.controls['status'].setValue("");
              this.getAllBussiesVerticalData("");

              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.responseMessage,
                icon: "far fa-check-circle"
              });
              this.getRegionList();
              if (this.searchkey) {
                //this.search();
              } else {
                //this.getListData("");
              }
            }
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
    }
  }
  deleteConfirmBusinessV(id: number) {
    if (id) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Business Vertical?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          let data: any;
          const url1 = "/businessverticals/" + id;
          this.branchManagementService.getMethod(url1).subscribe(
            (response: any) => {
              data = response.data;
              this.delete(data);
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
  delete(data:any) {
    const url = "/businessverticals/delete";
    this.branchManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 405 || response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.getAllBussiesVerticalData("");
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.responseMessage,
            icon: "far fa-check-circle"
          });
        }
        if (this.searchkey) {
          // this.search();
        } else {
          // this.getListData("");
          this.getAllBussiesVerticalData("");
        }
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
    // location.reload();
  }
  searchBusinessV() {
    if (!this.searchkey || this.searchkey !== this.searchBusinessVName) {
      this.currentPageBusinessVSlab = 1;
    }
    this.searchkey = this.searchBusinessVName;
    if (this.showItemPerPage) {
      this.businessVitemsPerPage = this.showItemPerPage;
    }
    this.searchData.filter[0].filterValue = this.searchBusinessVName.trim();
    this.searchData.page = this.currentPageBusinessVSlab;
    this.searchData.pageSize = this.businessVitemsPerPage;

    const url = `/businessverticals/search?page=${this.currentPageBusinessVSlab}&pageSize=${this.businessVitemsPerPage}&sortBy=id&sortOrder=0`;
    // console.log("this.searchData", this.searchData);
    this.branchManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.businessVisData = response.dataList;
        this.businessVtotalRecords = response.totalRecords;
        if (response.responseCode == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Record fetched successfully",
            icon: "far fa-times-circle"
          });
        }
      },
      (error: any) => {
        this.businessVtotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.regionListData = [];
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

  canExit() {
    if (!this.businessVerticalFormGroup.dirty) return true;
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
  clearSearchCountry() {
    this.searchBusinessVName = "";
    this.searchkey = "";
    this.getAllBussiesVerticalData("");
    this.submitted = false;
    this.isBusinessVEdit = false;
    this.businessVerticalFormGroup.reset();
    this.businessVerticalFormGroup.controls['status'].setValue("");
  }
  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageBusinessVSlab > 1) {
      this.currentPageBusinessVSlab = 1;
    }
    if (!this.searchkey) {
      this.getAllBussiesVerticalData(this.showItemPerPage);
    } else {
      this.searchBusinessV();
    }
  }

  getAllBussiesVerticalData(list:any) {
    const url = "/businessverticals";
    let size;
    this.searchkey = "";
    let pageList = this.currentPageBusinessVSlab;
    if (list) {
      size = list;
      this.businessVitemsPerPage = list;
    } else {
      size = this.businessVitemsPerPage;
    }
    let plandata = {
      page: pageList,
      pageSize: size
    };
    this.branchManagementService.postMethod(url, plandata).subscribe(
      (response: any) => {
        var data = response.dataList;
        const result = data.filter((word:any) => word.isDeleted === false);
        this.businessVisData = result;
        this.businessVtotalRecords = response.totalRecords;
        // console.log("this.businessVisData", this.businessVisData);

        this.searchkey = "";
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

  editRegion(countryId:any) {
    if (countryId) {
      const url = "/businessverticals/" + countryId;
      this.branchManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.isBusinessVEdit = true;
          this.viewBusinessVListData = response.data;
          // console.log(" this.viewBusinessVListData", this.viewBusinessVListData);
          this.businessVerticalFormGroup.patchValue(this.viewBusinessVListData);
          this.businessVData.id = countryId;
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

  pageChangedCountryList(current:any) {
    this.currentPageBusinessVSlab = current;
    this.getAllBussiesVerticalData("");
  }
}
