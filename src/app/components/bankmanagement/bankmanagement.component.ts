import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { BankService } from "src/app/service/bank.service";
import { bankManagement } from "src/app/components/model/bankManagement";
import { LoginService } from "../../service/login.service";
import { AclClassConstants } from "../../constants/aclClassConstants";
import { AclConstants } from "../../constants/aclOperationConstants";
import { Regex } from "src/app/constants/regex";
import { Observable, Observer } from "rxjs";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CountryManagementService } from "src/app/service/country-management.service";
import { MASTERS } from "src/app/constants/aclConstants";
import { WhiteeSpaceValidator } from "../shared/custom-validators";

@Component({
    selector: "app-bankmanagement",
    templateUrl: "./bankmanagement.component.html",
    styleUrls: ["./bankmanagement.component.css"],
    standalone: false
})
export class BankmanagementComponent implements OnInit {
  BankFormGroup!: FormGroup;
  submitted: boolean = false;
  bankData!: bankManagement;
  BankListData: any;
  BankFormArray!: FormArray;
  isBankEdit: boolean = false;
  viewBankListData: any;
  bankTypeData: any;
  currentpage = 1;
  itemPerpageBank = RadiusConstants.ITEMS_PER_PAGE;
  BanktotalRecords!: number;
  searchBankName: any = "";
  searchData: any;
  account = "Account Number";
  AclClassConstants;
  AclConstants;

  statusOptions = RadiusConstants.status;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 0;
  searchkey!: string;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  public loginService: LoginService;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private bankService: BankService,
    loginService: LoginService,
    public commondropdownService: CommondropdownService,
    public countrymgmtSerivce: CountryManagementService
  ) {
    this.createAccess = loginService.hasPermission(MASTERS.BANK_CREATE);
    this.deleteAccess = loginService.hasPermission(MASTERS.BANK_DELETE);
    this.editAccess = loginService.hasPermission(MASTERS.BANK_EDIT);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    // this.isBankEdit = !this.createAccess && this.editAccess ? true : false;
  }

  ngOnInit(): void {
    this.BankFormGroup = this.fb.group({
      accountnum: [""],
      bankholdername: [""],
      bankname: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
      ifsccode: [""],
      mvnoId: [""],
      status: ["", Validators.required],
      bankcode: [""],
      banktype: ["", Validators.required],
    });

    this.searchData = {
      filter: [
        {
          // filterDataType: "",
          filterValue: "",
          // filterColumn: "any",
          // filterOperator: "equalto",
          // filterCondition: "and",
        },
      ],
      // page: "",
      // pageSize: "",
    };

    this.getBankListData("");
    //this.getBankData('');
    this.BankFormGroup.controls['accountnum'].enable();
    this.getBankTypeList();
  }
  selectAllbankTypeEvent(event:any) {
    if (event.value == "operator") {
      this.account = "Account Number*";
      this.BankFormGroup.get("accountnum")?.setValidators([
        Validators.required,
        Validators.pattern(Regex.alphaNUmeric),
      ]);
      this.BankFormGroup.get("accountnum")?.updateValueAndValidity();
    } else {
      this.account = "Account Number";
      this.BankFormGroup.get("accountnum")?.clearValidators();
      this.BankFormGroup.get("accountnum")?.updateValueAndValidity();
    }
  }

  addEditBank(bankId:any) {
    this.submitted = true;
    if (this.BankFormGroup.valid) {
      if (bankId) {
        const url = "/bankManagement/update";
        this.bankData = this.BankFormGroup.value;
        this.bankData.id = bankId;
        this.bankData.isDeleted = false;
        this.bankService.postMethod(url, this.bankData).subscribe(
          (response: any) => {
            if (response.responseCode == 200) {
              this.cancelEditBank();
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle",
              });
              this.submitted = false;
              if (this.searchkey) {
                this.searchBank();
              } else {
                this.getBankListData("");
              }
            } else if (response.responseCode == 406) {
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
      } else {
        const url = "/bankManagement/save";
        this.bankData = this.BankFormGroup.value;

        this.bankData.isDeleted = false;
        // console.log("this.createChargeData", this.bankData);
        this.bankService.postMethod(url, this.bankData).subscribe(
          (response: any) => {
            if (response.responseCode == 200) {
              this.submitted = false;
              this.BankFormGroup.reset();
              this.BankFormGroup.controls['status'].setValue("");
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle",
              });
              if (this.searchkey) {
                this.searchBank();
              } else {
                this.getBankListData("");
              }
            } else if (response.responseCode == 406) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.responseMessage,
                icon: "far fa-times-circle",
              });
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
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
    }
  }

  cancelEditBank(id?: string) {
    this.submitted = false;
    this.isBankEdit = false;
    this.BankFormGroup.reset();
    this.BankFormGroup.controls['status'].setValue("");
    this.BankFormGroup.controls['accountnum'].enable();
  }

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentpage > 1) {
      this.currentpage = 1;
    }
    if (!this.searchkey) {
      this.getBankListData(this.showItemPerPage);
    } else {
      this.searchBank();
    }
  }

  getBankData(list:any) {
    let size;
    this.searchkey = "";

    let pageList = this.currentpage;
    if (list) {
      size = list;
      this.itemPerpageBank = list;
    } else {
      if (this.showItemPerPage == 0) {
        this.itemPerpageBank = this.pageITEM;
      } else {
        this.itemPerpageBank = this.showItemPerPage;
      }
    }

    const url = "/bankManagement/all";
    this.bankService.getMethod(url).subscribe(
      (response: any) => {
        // let filterBankData = response.dataList.filter(
        //   (bank) => bank.isDeleted == false
        // );
        this.BankListData = response.dataList;
        this.BanktotalRecords = response.totalRecords;

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

  getBankListData(list:any) {
    const url = "/bankManagement";
    let size;
    this.searchkey = "";
    let pageList = this.currentpage;
    if (list) {
      size = list;
      this.itemPerpageBank = list;
    } else {
      size = this.itemPerpageBank;
    }
    let data = {
      page: pageList,
      pageSize: size,
      sortBy: "bankid",
      sortOrder: 0,
    };
    this.bankService.postMethod(url, data).subscribe(
      (response: any) => {
        this.BankListData = response.dataList;
        this.BanktotalRecords = response.totalRecords;

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

  editBank(bankId:any) {
    if (bankId) {
      const url = "/bankManagement/" + bankId;
      this.bankService.getMethod(url).subscribe(
        (response: any) => {
          this.isBankEdit = true;
          this.viewBankListData = response.data;
          this.BankFormGroup.patchValue(this.viewBankListData);
          // this.BankFormGroup.controls.accountnum.disable();
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

  searchBank() {
    if (this.searchBankName == "" || this.searchBankName == null) {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Please add bank name for search",
        icon: "far fa-times-circle",
      });
      return;
    }

    if (!this.searchkey || this.searchkey !== this.searchBankName) {
      this.currentpage = 1;
    }
    this.searchkey = this.searchBankName;
    if (this.showItemPerPage) {
      this.itemPerpageBank = this.showItemPerPage;
    }
    this.searchData.filter[0].filterValue = this.searchBankName.trim();
    // this.searchData.page = this.currentpage;
    // this.searchData.pageSize = this.itemPerpageBank;

    const url =
      "/bankManagement/search?page=" +
      this.currentpage +
      "&pageSize=" +
      this.itemPerpageBank +
      "&sortBy=id&sortOrder=0";
    // console.log("this.searchData", this.searchData)
    this.bankService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.BankListData = response.dataList;

          this.BanktotalRecords = response.totalRecords;
        } else if (response.responseCode == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
          this.BankListData = response.dataList;

          this.BanktotalRecords = response.totalRecords;
        }
      },
      (error: any) => {
        this.BanktotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
          this.BankListData = [];
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

  clearSearchBank() {
    this.searchBankName = "";
    this.searchkey = "";
    this.getBankListData("");
    this.submitted = false;
    this.isBankEdit = false;
    this.BankFormGroup.reset();
    this.BankFormGroup.controls['status'].setValue("");
    this.BankFormGroup.controls['accountnum'].enable();
  }

  canExit() {
    if (!this.BankFormGroup.dirty) return true;
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
  deleteConfirmonBank(bankData:any) {
    if (bankData) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Bank Details?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteBank(bankData);
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

  deleteBank(bankData:any) {
    const url = "/bankManagement/delete";
    bankData.isDeleted = true;
    this.bankService.postMethod(url, bankData).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          if (this.currentpage != 1 && this.BankListData.length == 1) {
            this.currentpage = this.currentpage - 1;
          }
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle",
          });
          this.clearSearchBank();
          if (this.searchkey) {
            this.searchBank();
          } else {
            this.getBankListData("");
          }
        } else if (response.responseCode == 406) {
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

  pageChangedBankList(pageNumber:any) {
    this.currentpage = pageNumber;
    if (this.searchkey) {
      this.searchBank();
    } else {
      this.getBankListData("");
    }
  }

  getBankTypeList() {
    const url = "/commonList/banktype";
    this.countrymgmtSerivce.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.bankTypeData = response.dataList;
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
