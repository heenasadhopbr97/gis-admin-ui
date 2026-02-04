import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { CountryManagementService } from "../../service/country-management.service";
import * as RadiusConstants from "../../RadiusUtils/RadiusConstants";
import { LoginService } from "../../service/login.service";
import { AclClassConstants } from "../../constants/aclClassConstants";
import { AclConstants } from "../../constants/aclOperationConstants";
import { Observable, Observer } from "rxjs";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { MASTERS } from "src/app/constants/aclConstants";
import { WhiteeSpaceValidator } from "../shared/custom-validators";

@Component({
    selector: "app-business-unit",
    templateUrl: "./business-unit.component.html",
    styleUrls: ["./business-unit.component.css"],
    standalone: false
})
export class BusinessUnitComponent implements OnInit {
  businessUnitFormGroup!: FormGroup;
  submitted: boolean = false;
  businessUnitData: any;
  businessUnitListData: any;
  isEdit: boolean = false;
  viewListData: any;

  currentPageSlab = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  totalRecords: any;

  searchName: any = "";
  searchData: any;
  AclClassConstants;
  AclConstants;

  statusOptions = RadiusConstants.status;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey!: string;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  IcListData: any = [];
  // businessUnitTypeData :any= [
  //   { label: "Predefined", value: "Predefined", val: "Predefined" },
  //   { label: "On-Demand", value: "On-Demand", val: "On-Demand" },
  // ];
  businessUnitTypeData: any = [];
  defaultPlanCreation = { label: "Predefined", value: "Predefined" };
  public loginService: LoginService;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private countryManagementService: CountryManagementService,
    loginService: LoginService,
    public commondropdownService: CommondropdownService,
    public countrymgmtService: CountryManagementService
  ) {
    this.createAccess = loginService.hasPermission(MASTERS.BUSINESS_UNIT_CREATE);
    this.deleteAccess = loginService.hasPermission(MASTERS.BUSINESS_UNIT_DELETE);
    this.editAccess = loginService.hasPermission(MASTERS.BUSINESS_UNIT_EDIT);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    // this.isEdit = !this.createAccess && this.editAccess ? true : false;
    this.getAllBusinessUnitType();
  }

  ngOnInit(): void {
    this.businessUnitFormGroup = this.fb.group({
      buname: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
      bucode: ["", Validators.required],
      status: ["", Validators.required],
      investmentCodeid: [],
      planBindingType: ["", Validators.required],
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

    this.getListData("");
    this.getInvestmentList("");
  }

  addEdit(id:any) {
    this.submitted = true;
    if (this.businessUnitFormGroup.valid) {
      if (id) {
        const url = "/businessUnit/update";
        this.businessUnitData = this.businessUnitFormGroup.value;
        this.businessUnitData.id = id;
        this.countryManagementService.postMethod(url, this.businessUnitData).subscribe(
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
              this.isEdit = false;
              this.businessUnitFormGroup.reset();
              this.businessUnitFormGroup.get('status')?.setValue("");
              this.commondropdownService.clearCache("/businessUnit/all");
              this.messageService.add({
                severity: "success",
                summary: "Successfully ",
                detail: response.message,
                icon: "far fa-check-circle",
              });
              this.submitted = false;
              if (this.searchkey) {
                this.search();
              } else {
                this.getListData("");
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
        const url = "/businessUnit/save";
        this.businessUnitData = this.businessUnitFormGroup.value;
        this.countryManagementService.postMethod(url, this.businessUnitData).subscribe(
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
              this.businessUnitFormGroup.reset();
              this.businessUnitFormGroup.get ('status')?.setValue("");
              this.commondropdownService.clearCache("/businessUnit/all");
              this.messageService.add({
                severity: "success",
                summary: " ",
                detail: response.responseMessage,
                icon: "far fa-check-circle",
              });
              if (this.searchkey) {
                this.search();
              } else {
                this.getListData("");
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

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageSlab > 1) {
      this.currentPageSlab = 1;
    }
    if (!this.searchkey) {
      this.getListData(this.showItemPerPage);
    } else {
      this.search();
    }
  }

  getListData(list:any) {
    const url = "/businessUnit";
    let size;
    this.searchkey = "";
    let pageList = this.currentPageSlab;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      size = this.itemsPerPage;
    }
    let plandata = {
      page: pageList,
      pageSize: size,
    };
    this.countryManagementService.postMethod(url, plandata).subscribe(
      (response: any) => {
        this.businessUnitListData = response.dataList;
        this.totalRecords = response.totalRecords;

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

  edit(id:any) {
    if (id) {
      const url = "/businessUnit/" + id;
      this.countryManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.isEdit = true;
          this.viewListData = response.data;
          this.businessUnitFormGroup.patchValue(this.viewListData);
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

  search() {
    if (!this.searchkey || this.searchkey !== this.searchName) {
      this.currentPageSlab = 1;
    }
    this.searchkey = this.searchName;
    if (this.showItemPerPage) {
      this.itemsPerPage = this.showItemPerPage;
    }
    this.searchData.filter[0].filterValue = this.searchName.trim();

    const url = `/businessUnit/search?page=${this.currentPageSlab}&pageSize=${this.itemsPerPage}&sortBy=id&sortOrder=0`;
    this.countryManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.businessUnitListData = response.dataList;
          this.totalRecords = response.totalRecords;
        }
        if (response.responseCode == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
          this.businessUnitListData = [];
        }
      },
      (error: any) => {
        this.totalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
          this.businessUnitListData = [];
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

  clearSearch() {
    this.searchName = "";
    this.searchkey = "";
    this.getListData("");
    this.submitted = false;
    this.isEdit = false;
    this.businessUnitFormGroup.reset();
    this.businessUnitFormGroup.get('status')?.setValue("");
  }

  canExit() {
    if (!this.businessUnitFormGroup.dirty) return true;
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

  deleteConfirmon(id: number) {
    if (id) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Business Unit?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          let data: any;

          const url1 = "/businessUnit/" + id;
          this.countryManagementService.getMethod(url1).subscribe(
            (response: any) => {
              data = response.data;
              this.delete(data);
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

  delete(data:any) {
    const url = "/businessUnit/delete";
    this.countryManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        if (this.currentPageSlab != 1 && this.businessUnitListData.length == 1) {
          this.currentPageSlab = this.currentPageSlab - 1;
        }
        // this.messageService.add({
        //   severity: "success",
        //   summary: "Successfully",
        //   detail: response.message,
        //   icon: "far fa-check-circle",
        // });
        if (response.responseCode == 405 || response.responseCode == 406) {
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
            detail: response.message,
            icon: "far fa-check-circle",
          });
        }
        this.clearSearch();
        if (this.searchkey) {
          this.search();
        } else {
          this.getListData("");
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

  pageChangedList(pageNumber:any) {
    this.currentPageSlab = pageNumber;
    if (this.searchkey) {
      this.search();
    } else {
      this.getListData("");
    }
  }
  getInvestmentList(list:any) {
    const url = "/investmentCode/all";
    this.countryManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.IcListData = response.dataList;
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
  buList: any = [];
  buNameDetailsModal: boolean = false;
  closeModal() {
    this.buNameDetailsModal = false;
  }
  IcCodeOpenModel(id:any) {
    this.buNameDetailsModal = true;
    const url = "/businessUnit/BusinessUnit/" + id;
    this.countryManagementService.getMethod(url).subscribe((response: any) => {
      this.buList = response.BuById;
    });
  }
  getAllBusinessUnitType(): void {
    // let url = "";
    const url = "/commonList/generic/PLAN_BINDING_TYPE";
    this.countryManagementService.getMethodWithCache(url).subscribe(
      (response: any) => {
        // this.productListData = response.dataList;ad
        this.businessUnitTypeData = response.dataList;
        console.log("businessUnitTypeData", this.businessUnitTypeData);
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
