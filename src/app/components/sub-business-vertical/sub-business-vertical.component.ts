import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CountryManagement } from "../model/country-management";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { MessageService } from "primeng/api";
import { Observable, Observer } from "rxjs";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { subBusinessVerticalService } from "./sub-business-vertical.service";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { StateManagementService } from "src/app/service/state-management.service";
import { MASTERS } from "src/app/constants/aclConstants";
import { WhiteeSpaceValidator } from "../shared/custom-validators";

@Component({
    selector: "app-sub-business-vertical",
    templateUrl: "./sub-business-vertical.component.html",
    styleUrls: ["./sub-business-vertical.component.css"],
    standalone: false
})
export class SubBusinessVerticalComponent implements OnInit {
  title = "Sub Business Vertical";
  subbusinessVerticalFormGroup: FormGroup;
  submitted: boolean = false;
  // countryData: CountryManagement;
  businessverticalListData: any;
  isSubBusinessVEdit: boolean = false;
  viewSubBusinessVListData: any;
  currentPageSubBusinessVSlab = 1;
  subbusinessVitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  subbusinessVtotalRecords: any;
  searchCountryName: any = "";
  searchName: any = "";
  searchData: any;
  businessverticalSector:any;
  subbusinessVisData: any[] = [];  

  subbusinessVData: any = [];
  AclClassConstants;
  AclConstants;
  subbusinessData: any;
  isDeleted: boolean;
  isEdit: boolean = false;
  statusOptions = RadiusConstants.status;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: string;
  deletedata: any = {
    id: "",
  };
  editMode: boolean;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  public loginService: LoginService;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private subBusinessVerticalService: subBusinessVerticalService,
    loginService: LoginService,
    private commondropdownService: CommondropdownService,
    private stateManagementService: StateManagementService
  ) {
    this.createAccess = loginService.hasPermission(MASTERS.SUB_BUSINESS_VERTICALS_CREATE);
    this.deleteAccess = loginService.hasPermission(MASTERS.SUB_BUSINESS_VERTICALS_DELETE);
    this.editAccess = loginService.hasPermission(MASTERS.SUB_BUSINESS_VERTICALS_EDIT);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    // this.isEdit = !createAccess && editAccess ? true : false;
  }

  ngOnInit(): void {
    this.subbusinessVerticalFormGroup = this.fb.group({
      sbvname: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
      buVerticalsId: ["", Validators.required],
      status: ["", Validators.required],
      // id: [""],
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
      page: "",
      pageSize: "",
    };

    this.getBusinessVertical();
    this.getAllSubBussiesVerticalData("");
  }
  getSelectCustomerSector(id: any) {
    const idtem = id;
    console.log(idtem, "idtem");
  }
  getBusinessVertical() {
    const url = "/businessverticals/all";
    const custerlist = {};
    this.stateManagementService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.businessverticalSector = response.dataList;
        console.log(this.businessverticalSector, " this.businessverticalSector");
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
  addEdit(id:any) {
    this.submitted = true;
    if (this.subbusinessVerticalFormGroup.valid) {
      if (id) {
        const url = "/subbusinessvertical/update";
        this.subbusinessVData = this.subbusinessVerticalFormGroup.value;
        //console.log(this.subbusinessData,"subbusinessData")
        this.subbusinessVData.id = id;
        this.subBusinessVerticalService.postMethod(url, this.subbusinessVData).subscribe(
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
              this.isEdit = false;
              this.subbusinessVerticalFormGroup.reset();
              this.subbusinessVerticalFormGroup.controls['status'].setValue("");
              this.getAllSubBussiesVerticalData("");

              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle",
              });
              this.submitted = false;
              if (this.searchkey) {
                this.searchSubBusinessV();
              } else {
                this.getAllSubBussiesVerticalData("");
              }
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
      } else {
        console.log("4");

        const url = "/subbusinessvertical/save";
        this.subbusinessData = this.subbusinessVerticalFormGroup.value;
        console.log(this.subbusinessData, " this.subbusinessData ");
        this.subBusinessVerticalService.postMethod(url, this.subbusinessData).subscribe(
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
              this.subbusinessVerticalFormGroup.reset();
              this.subbusinessVerticalFormGroup.controls['status'].setValue("");
              this.getAllSubBussiesVerticalData("");

              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle",
              });
              this.getBusinessVertical();
              if (this.searchkey) {
                this.searchSubBusinessV();
              } else {
                this.getAllSubBussiesVerticalData("");
              }
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
  deleteConfirmSubBusinessV(id: number): void {
    if (id) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Sub Business Vertical?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.delete(id);
          //   let deletedata: any;
          //
          //   const url = "/subbusinessvertical/" + id;
          //   this.subBusinessVerticalService.getMethod(url).subscribe(
          //     (response: any) => {
          //       deletedata = response.deletedata;
          //       this.delete(deletedata);
          //     },
          //     (error: any) => {
          //       this.messageService.add({
          //         severity: "error",
          //         summary: "Error",
          //         detail: error.error.ERROR,
          //         icon: "far fa-times-circle",
          //       });
          //
          //     }
          //   );
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
  delete(id:any) {
    const url = "/subbusinessvertical/delete?id=" + id;
    this.subBusinessVerticalService.deleteMethod(url).subscribe(
      (response: any) => {
        if (
          response.responseCode == 405 ||
          response.responseCode == 406 ||
          response.responseCode == 417
        ) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        } else {
          this.getAllSubBussiesVerticalData("");
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle",
          });
        }
        if (this.searchkey) {
          this.searchSubBusinessV();
        } else {
          this.getAllSubBussiesVerticalData("");
          this.subbusinessVerticalFormGroup.reset();
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
  searchSubBusinessV() {
    if (!this.searchkey || this.searchkey !== this.searchName) {
      this.currentPageSubBusinessVSlab = 1;
    }
    this.searchkey = this.searchName;
    if (this.showItemPerPage) {
      this.subbusinessVitemsPerPage = this.showItemPerPage;
    }
    this.searchData.filter[0].filterValue = this.searchName.trim();
    this.searchData.page = this.currentPageSubBusinessVSlab;
    this.searchData.pageSize = this.subbusinessVitemsPerPage;

    const url = `/subbusinessvertical/search?page=${this.currentPageSubBusinessVSlab}&pageSize=${this.subbusinessVitemsPerPage}&sortBy=id&sortOrder=0`;

    console.log("this.searchData", this.searchData);
    this.subBusinessVerticalService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.subbusinessVisData = response.dataList;
          this.subbusinessVtotalRecords = response.totalRecords;
        } else if (response.responseCode == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
          this.subbusinessVisData = response.dataList;
          this.subbusinessVtotalRecords = response.totalRecords;
        }
      },
      (error: any) => {
        this.subbusinessVtotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
          this.businessverticalListData = [];
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

  canExit() {
    if (!this.subbusinessVerticalFormGroup.dirty) return true;
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
  clearSearchCountry() {
    this.searchName = "";
    this.searchkey = "";
    this.getAllSubBussiesVerticalData("");
    this.submitted = false;
    this.isEdit = false;
    this.subbusinessVerticalFormGroup.reset();
    this.subbusinessVerticalFormGroup.controls['status'].setValue("");
  }
  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageSubBusinessVSlab > 1) {
      this.currentPageSubBusinessVSlab = 1;
    }
    if (!this.searchkey) {
      this.getAllSubBussiesVerticalData(this.showItemPerPage);
    } else {
      this.searchSubBusinessV();
    }
  }

  getAllSubBussiesVerticalData(list:any) {
    const url = "/subbusinessvertical";
    let size;
    this.searchkey = "";
    let pageList = this.currentPageSubBusinessVSlab;
    if (list) {
      size = list;
      this.subbusinessVitemsPerPage = list;
    } else {
      size = this.subbusinessVitemsPerPage;
    }
    let plandata = {
      page: pageList,
      pageSize: size,
      // SortBy: "id",
      // sortOrder: 0,
    };
    this.subBusinessVerticalService.postMethod(url, plandata).subscribe(
      (response: any) => {
        var data = response.dataList;
        const result = data.filter((word:any) => word.isDeleted === false);
        this.subbusinessVisData = result;
        this.subbusinessVtotalRecords = response.totalRecords;
        console.log("this.subbusinessVisData", this.subbusinessVisData);

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

  editSubBusinessVertical(id:any) {
    if (id) {
      const url = "/subbusinessvertical/" + id;
      this.subBusinessVerticalService.getMethod(url).subscribe(
        (response: any) => {
          this.isEdit = true;
          this.viewSubBusinessVListData = response.data;
          console.log(" this.viewSubBusinessVListData", this.viewSubBusinessVListData);
          this.subbusinessVerticalFormGroup.patchValue(this.viewSubBusinessVListData);
          this.subbusinessVData.id = id;
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

  pageChangedList(pageNumber:any) {
    this.currentPageSubBusinessVSlab = pageNumber;
    if (this.searchkey) {
      this.searchSubBusinessV();
    } else {
      this.getAllSubBussiesVerticalData("");
    }
  }
}
