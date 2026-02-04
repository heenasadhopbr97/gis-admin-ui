import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { Regex } from "src/app/constants/regex";
import { SystemConfig } from "src/app/components/model/systemcofig";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import * as _ from "lodash";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { Data } from "@angular/router";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Observable, Observer } from "rxjs";
import { SETTINGS } from "src/app/constants/aclConstants";
@Component({
    selector: "app-systemconfig",
    templateUrl: "./systemconfig.component.html",
    styleUrls: ["./systemconfig.component.css"],
    standalone: false
})
export class SystemconfigComponent implements OnInit {
  @Input() systemname: string;
  systemconfigGroupForm: FormGroup;
  systemconfigCategoryList: any;
  submitted: boolean = false;
  taxListData: any;
  createsystemconfigData: SystemConfig;
  currentPagesystemconfigListdata = 1;
  systemconfigListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  systemconfigListdatatotalRecords: any;
  systemconfigListData: any = [];
  viewsystemconfigListData: any = [];
  issystemconfigEdit: boolean = false;
  editAccess: boolean = false;
  createAccess: boolean = false;
  searchSysConfigName: any = "";
  AclClassConstants;
  AclConstants;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 1;
  searchkey: string;
  totalDataListLength = 0;
  public loginService: LoginService;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    private messageService: MessageService,
    private systemconfigService: SystemconfigService,
    loginService: LoginService
  ) {
    this.createAccess = loginService.hasPermission(SETTINGS.SYSTEM_CONFIGURATION_CREATE);
    this.editAccess = loginService.hasPermission(SETTINGS.SYSTEM_CONFIGURATION_EDIT);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    this.issystemconfigEdit = !this.createAccess && this.editAccess ? true : false;
  }

  ngOnInit(): void {
    this.systemconfigGroupForm = this.fb.group({
      id: [""],
      name: ["", Validators.required],
      value: ["", Validators.required],
    });

    this.getsystemconfigList("");
  }

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPagesystemconfigListdata > 1) {
      this.currentPagesystemconfigListdata = 1;
    }
    if (!this.searchkey) {
      this.getsystemconfigList(this.showItemPerPage);
    } else {
      this.searchSysConfig();
    }
  }

  getsystemconfigList(size:any) {
    let page_list;
    this.searchkey = "";
    if (size) {
      page_list = size;
      this.systemconfigListdataitemsPerPage = size;
    } else {
      if (this.showItemPerPage == 1) {
        this.systemconfigListdataitemsPerPage = this.pageITEM;
      } else {
        this.systemconfigListdataitemsPerPage = this.showItemPerPage;
      }
    }

    const url = "/system/configuration/";
    this.systemconfigService.getMethod(url).subscribe(
      (response: any) => {
        let paytmlinksms_Data = response.clientlist.filter(
          (data:any) => data.name === "paytmlinksms_enable"
        );
        this.systemconfigListData = response.clientlist;

        if (paytmlinksms_Data[0].value === "false" || paytmlinksms_Data[0].value === false) {
          this.commondropdownService.ifPaytmLinkSendBtn = false;
        } else {
          this.commondropdownService.ifPaytmLinkSendBtn = true;
        }

        if (this.showItemPerPage > this.systemconfigListdataitemsPerPage) {
          this.totalDataListLength = this.systemconfigListData.length % this.showItemPerPage;
        } else {
          this.totalDataListLength =
            this.systemconfigListData.length % this.systemconfigListdataitemsPerPage;
        }
        // console.log("systemconfigListData", this.systemconfigListData);
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

  addEditsystemconfig(systemconfigId:any) {
    this.submitted = true;

    if (this.systemconfigGroupForm.valid) {
      if (systemconfigId) {
        const url = "/system/configuration/" + systemconfigId;
        this.createsystemconfigData = this.systemconfigGroupForm.value;
        // console.log("this.createsystemconfigData", this.createsystemconfigData);
        this.systemconfigService.updateMethod(url, this.createsystemconfigData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.systemconfigGroupForm.reset();
            this.issystemconfigEdit = false;
            this.viewsystemconfigListData = [];
            this.systemconfigGroupForm.controls['name'].enable();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle",
            });
            if (!this.searchkey) {
              this.getsystemconfigList("");
            } else {
              this.searchSysConfig();
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
        const url = "/system/configuration/";
        this.createsystemconfigData = this.systemconfigGroupForm.value;

        // console.log("this.createsystemconfigData", this.createsystemconfigData);
        this.systemconfigService.postMethod(url, this.createsystemconfigData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.systemconfigGroupForm.reset();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle",
            });
            if (!this.searchkey) {
              this.getsystemconfigList("");
            } else {
              this.searchSysConfig();
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

  editsystemconfig(systemconfigData: any) {
    if (systemconfigData) {
      this.viewsystemconfigListData = systemconfigData;
      this.issystemconfigEdit = true;
      this.systemconfigGroupForm.patchValue(systemconfigData);
      this.systemconfigGroupForm.controls['name'].disable();
    }
  }

  searchSysConfig() {
    let searchSystemconfigListData = [];
    if (!this.searchkey || this.searchkey !== this.searchSysConfigName) {
      this.currentPagesystemconfigListdata = 1;
    }
    this.searchkey = this.searchSysConfigName;

    if (this.showItemPerPage == 1) {
      this.systemconfigListdataitemsPerPage = this.pageITEM;
    } else {
      this.systemconfigListdataitemsPerPage = this.showItemPerPage;
    }

    let url;
    if (!this.searchkey) {
      url = "/system/configuration/";
    } else {
      url = `/system/configuration/searchConfigurationByName?name=${this.searchkey}`;
    }
    this.systemconfigService.getMethod(url).subscribe(
      (response: any) => {
        let paytmlinksms_Data = response.clientlist.filter(
          (data:any) => data.name === "paytmlinksms_enable"
        );
        console.log("data", paytmlinksms_Data);
        searchSystemconfigListData = response.clientlist.filter((data:any) =>
          data.name.toLowerCase().includes(this.searchSysConfigName.trim().toLowerCase())
        );
        this.systemconfigListData = searchSystemconfigListData;
        if (paytmlinksms_Data.size > 0) {
          if (paytmlinksms_Data[0].value === "false" || paytmlinksms_Data[0].value === false) {
            this.commondropdownService.ifPaytmLinkSendBtn = false;
          } else {
            this.commondropdownService.ifPaytmLinkSendBtn = true;
          }
        }

        if (this.showItemPerPage > this.systemconfigListdataitemsPerPage) {
          this.totalDataListLength = this.systemconfigListData.length % this.showItemPerPage;
        } else {
          this.totalDataListLength =
            this.systemconfigListData.length % this.systemconfigListdataitemsPerPage;
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

  clearSysConfig() {
    this.searchSysConfigName = "";
    this.getsystemconfigList("");
    this.submitted = false;
    this.systemconfigGroupForm.reset();
    this.issystemconfigEdit = false;
    this.systemconfigGroupForm.controls['name'].setValue("");
    this.systemconfigGroupForm.controls['value'].setValue("");
  }

  pageChangedsystemconfigList(pageNumber:any) {
    this.currentPagesystemconfigListdata = pageNumber;
    if (!this.searchkey) {
      this.getsystemconfigList("");
    } else {
      this.searchSysConfig();
    }
  }

  canExit() {
    if (!this.systemconfigGroupForm.dirty) return true;
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
