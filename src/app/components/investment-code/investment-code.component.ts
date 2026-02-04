import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import * as RadiusConstants from "../../RadiusUtils/RadiusConstants";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { CountryManagementService } from "src/app/service/country-management.service";
import { StateManagementService } from "src/app/service/state-management.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoginService } from "src/app/service/login.service";
import { Observable, Observer } from "rxjs";
import { AclClassConstants } from "../../constants/aclClassConstants";
import { AclConstants } from "../../constants/aclOperationConstants";
import { MASTERS } from "src/app/constants/aclConstants";
import { WhiteeSpaceValidator } from "../shared/custom-validators";
@Component({
    selector: "app-investment-code",
    templateUrl: "./investment-code.component.html",
    styleUrls: ["./investment-code.component.css"],
    standalone: false
})
export class InvestmentCodeComponent implements OnInit {
  investmentFormGroup: FormGroup;
  submitted: boolean = false;
  IcListData: any = [];
  viewIcListData: any = [];
  currentPageIcListdata = 1;
  IcListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  IcListdatatotalRecords: any;
  isIcEdit: boolean = false;
  searchData: any;
  searchIcName: any = "";
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
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private stateManagementService: StateManagementService,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    this.createAccess = loginService.hasPermission(MASTERS.INVESTMENT_CODE_CREATE);
    this.deleteAccess = loginService.hasPermission(MASTERS.INVESTMENT_CODE_DELETE);
    this.editAccess = loginService.hasPermission(MASTERS.INVESTMENT_CODE_EDIT);
  }

  ngOnInit(): void {
    this.investmentFormGroup = this.fb.group({
      icname: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
      status: ["", Validators.required],
      iccode: ["", Validators.required],
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
    this.getInvestmentList("");
  }
  searchInvestment() {
    if (!this.searchkey || this.searchkey !== this.searchIcName) {
      this.currentPageIcListdata = 1;
    }
    this.searchkey = this.searchIcName;
    if (this.showItemPerPage) {
      this.IcListdataitemsPerPage = this.showItemPerPage;
    }

    this.searchData.filter[0].filterValue = this.searchIcName.trim();

    const url =
      "/investmentCode/search?page=" +
      this.currentPageIcListdata +
      "&pageSize=" +
      this.IcListdataitemsPerPage +
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
          this.IcListData = response.dataList;
          this.IcListdatatotalRecords = response.totalRecords;
        } else {
          this.IcListData = response.dataList;
          this.IcListdatatotalRecords = response.totalRecords;
        }
      },
      (error: any) => {
        this.IcListdatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
          this.IcListData = [];
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
  clearInvestmentData() {
    this.searchIcName = "";
    this.getInvestmentList("");
    this.investmentFormGroup.reset();
    this.submitted = false;
    this.isIcEdit = false;
    // this.investmentFormGroup.controls.branchid.setValue("");
  }
  getInvestmentList(list:any) {
    let size;
    this.searchkey = "";
    let List = this.currentPageIcListdata;
    if (list) {
      size = list;
      this.IcListdataitemsPerPage = list;
    } else {
      size = this.IcListdataitemsPerPage;
    }
    let pageData = {
      page: List,
      pageSize: size,
    };
    const url = "/investmentCode";
    this.stateManagementService.postMethod(url, pageData).subscribe(
      (response: any) => {
        this.IcListData = response.dataList;
        this.IcListdatatotalRecords = response.totalRecords;
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
  editInvestment(id:any) {
    this.isIcEdit = true;
    if (id) {
      const url = "/investmentCode/" + id;
      this.stateManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.viewIcListData = response.data;
          this.investmentFormGroup.patchValue(this.viewIcListData);
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
  pageChangedRegionList(pageNumber:any) {
    this.currentPageIcListdata = pageNumber;
    if (this.searchkey) {
      this.searchInvestment();
    } else {
      this.getInvestmentList("");
    }
  }

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageIcListdata > 1) {
      this.currentPageIcListdata = 1;
    }
    if (!this.searchkey) {
      this.getInvestmentList(this.showItemPerPage);
    } else {
      this.searchInvestment();
    }
  }
  deleteConfirmon(icdata: any) {
    if (icdata) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Investment Code?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteInvestment(icdata);
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
  deleteInvestment(icdata:any) {
    let data = icdata;

    const url = "/investmentCode/delete";
    this.stateManagementService.postMethod(url, data).subscribe(
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
          if (this.currentPageIcListdata != 1 && this.IcListData.length == 1) {
            this.currentPageIcListdata = this.currentPageIcListdata - 1;
          }
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle",
          });
          if (this.searchkey) {
            this.searchInvestment();
          } else {
            this.getInvestmentList("");
          }
          this.searchIcName = "";
          this.investmentFormGroup.reset();
          this.submitted = false;
          this.isIcEdit = false;
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
  addEditInvestment(id:any) {
    this.submitted = true;
    if (this.investmentFormGroup.valid) {
      if (id) {
        // setTimeout(() => {
        const url = "/investmentCode/update";
        let IcListData = this.investmentFormGroup.value;

        this.stateManagementService.postMethod(url, IcListData).subscribe(
          (response: any) => {
            if (response.responseCode == 417 || response.responseCode == 406) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.responseMessage,
                icon: "far fa-times-circle",
              });
            } else {
              this.submitted = false;
              this.isIcEdit = false;
              this.getInvestmentList("");
              this.investmentFormGroup.reset();
              // this.investmentFormGroup.controls.branchid.setValue("");
              if (!this.searchkey) {
                this.getInvestmentList("");
              } else {
                this.searchInvestment();
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
        // }, 1000);
      } else {
        // setTimeout(() => {
        const url = "/investmentCode/save";
        let IcListData = this.investmentFormGroup.value;

        this.stateManagementService.postMethod(url, IcListData).subscribe(
          (response: any) => {
            if (response.responseCode !== 200) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.responseMessage,
                icon: "far fa-times-circle",
              });
            } else {
              this.submitted = false;
              this.investmentFormGroup.reset();
              if (!this.searchkey) {
                this.getInvestmentList("");
              } else {
                this.searchInvestment();
              }
              // this.investmentFormGroup.controls.branchid.setValue("");

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
  canExit() {
    if (!this.investmentFormGroup.dirty) return true;
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
