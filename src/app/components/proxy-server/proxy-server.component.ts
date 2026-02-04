import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { IProxy } from "src/app/components/model/proxy-server";
import { ProxyServerService } from "src/app/service/proxy-server.service";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Observable, Observer } from "rxjs";
import { RADIUS_CONSTANTS } from "src/app/constants/aclConstants";
@Component({
    selector: "app-proxy-server",
    templateUrl: "./proxy-server.component.html",
    styleUrls: ["./proxy-server.component.css"],
    standalone: false
})
export class ProxyServerComponent implements OnInit {
  proxyServers: any[] = [];
  proxyDetail: IProxy;
  //Used and required for pagination
  totalRecords: number;
  currentPage: number = 1;
  itemsPerPage: number = RadiusConstants.ITEMS_PER_PAGE;
  name: String;
  detailGroupForm: FormGroup;
  searchForm: FormGroup;
  editId: any;
  submitted: boolean = false;
  searchSubmitted = false;
  status = [{ label: "Active" }, { label: "Inactive" }];
  override = [
    { label: "True", value: true },
    { label: "False", value: false },
  ];
  mvnoData: any;
  loggedInUser: any;
  myModal: boolean = false;
  mvnoId: any;
  modalToggle: boolean = true;
  editMode: boolean = false;
  accessData: any = JSON.parse(localStorage.getItem("accessData"));

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  searchkey: string;
  showItemPerPage: any;

  createProxyFlag = false;
  proxyGridFlag = true;
  _passwordNewType = "password";

  showNewPassword = false;

  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  createAccess: any;
  editAccess: any;
  deleteAccess: any;

  constructor(
    private proxyServerService: ProxyServerService,
    private radiusUtility: RadiusUtility,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;

    this.createAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_PROXY_CONFIG_CREATE);
    this.deleteAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_PROXY_CONFIG_DELETE);
    this.editAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_PROXY_CONFIG_EDIT);
  }

  ngOnInit(): void {
    this.getAll("");
    this.detailGroupForm = this.fb.group({
      name: ["", Validators.required],
      ip: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)"
          ),
        ],
      ],
      secretkey: ["", Validators.required],
      acctport: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      authport: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      status: ["", Validators.required],
      mvnoName: [""],
      createdBy: [""],
      lastModifiedBy: [""],
      dynaAuthPort: ["", [Validators.pattern("^[0-9]*$")]],
      overrideNAS: [false],
      nasip: [""],
      timeout: ["", Validators.required],
    });
    this.searchForm = this.fb.group({
      name: ["", Validators.required],
    });

    this.mvnoData = JSON.parse(localStorage.getItem("mvnoData"));
    this.loggedInUser = localStorage.getItem("loggedInUser");
    this.mvnoId = localStorage.getItem("mvnoId");

    this.createProxyFlag = false;
    this.proxyGridFlag = true;
  }

  createnewProxy() {
    if (this.accessData.proxy.createUpdateAccess) {
      this.createProxyFlag = true;
      this.proxyGridFlag = false;
      this.editMode = false;
      this.searchName = "";
      this.clearFormData();
    }
  }

  ProxyListData() {
    this.createProxyFlag = false;
    this.proxyGridFlag = true;
    this.editMode = false;
    this.currentPage = 1;
    this.getAll("");
    this.searchName = "";
  }

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.getAll(this.showItemPerPage);
    } else {
      this.search();
    }
  }

  async getAll(list:any) {
    let size;
    this.searchkey = "";
    let page = this.currentPage;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      size = this.itemsPerPage;
    }
    this.proxyServerService.getAll(page, size, "").subscribe(
      (response: any) => {
        this.proxyServers = response.proxyServerList;
        this.totalRecords = this.proxyServers.length;
      },
      (error: any) => {
        if (error.error.status == 404) {
          this.totalRecords = 0;
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle",
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle",
          });
        }
        this.totalRecords = 0;
        this.proxyServers = [];
      }
    );
  }

  // async search() {
  //   this.currentPage = 1;
  //   this.searchSubmitted = true;
  //   if (this.searchForm.valid) {
  //
  //     this.proxyServerService
  //       .getByName(this.searchForm.value.name, this.mvnoId)
  //       .subscribe(
  //         (response: any) => {
  //           this.proxyServers = response;
  //           this.totalRecords = this.proxyServers.proxyServerList.length;
  //
  //         },
  //         (error: any) => {
  //           this.messageService.add({
  //             severity: 'error',
  //             summary: 'Error',
  //             detail: error.error.errorMessage,
  //             icon: 'far fa-times-circle',
  //           });
  //           this.proxyServers = [];
  //           this.totalRecords = 0;
  //
  //         }
  //       );
  //   }
  // }
  searchName = "";
  search() {
    if (!this.searchkey || this.searchkey !== this.searchName.trim()) {
      this.currentPage = 1;
    }
    this.searchSubmitted = true;
    this.createProxyFlag = false;
    this.proxyGridFlag = true;
    this.searchForm.controls['name'].setValue(this.searchName);
    if (this.searchForm.valid) {
      this.proxyServers = [];
      let name = this.searchName.trim() ? this.searchName.trim() : "";

      this.searchkey = name;
      if (this.showItemPerPage) {
        this.itemsPerPage = this.showItemPerPage;
      }

      this.proxyServerService.getAll(this.currentPage, this.itemsPerPage, name).subscribe(
        (response: any) => {
          this.proxyServers = response.proxyServerList;
          this.totalRecords = this.proxyServers.length;
        },
        (error: any) => {
          if (error.error.status == 404) {
            this.totalRecords = 0;
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: error.error.errorMessage,
              icon: "far fa-times-circle",
            });
          } else {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.errorMessage,
              icon: "far fa-times-circle",
            });
          }
          this.totalRecords = 0;
          this.proxyServers = [];
        }
      );
    }
  }
  clearSearchForm() {
    this.clearFormData();
    this.searchSubmitted = false;
    this.searchForm.reset();
    this.currentPage = 1;
    this.searchName = "";
    this.getAll("");
    this.createProxyFlag = false;
    this.proxyGridFlag = true;
  }

  deleteConfirm(serverId:any, selectedMvnoId:any, index:any) {
    if (this.validateUserToPerformOperations(selectedMvnoId)) {
      this.confirmationService.confirm({
        message: "Do you want to delete this record?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.delete(serverId, selectedMvnoId, index);
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

  async delete(serverId:any, selectedMvnoId:any, index:any) {
    this.proxyServerService.delete(serverId, selectedMvnoId).subscribe(
      (response: any) => {
        if (this.currentPage != 1 && index == 0 && this.proxyServers.length == 1) {
          this.currentPage = this.currentPage - 1;
        }
        if (!this.searchkey) {
          this.getAll("");
        } else {
          this.search();
        }
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle",
        });
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  edit(configId:any, index:any) {
    // index = this.radiusUtility.getIndexOfSelectedRecord(
    //   index,
    //   this.currentPage,
    //   this.itemsPerPage
    // );
    if (this.validateUserToPerformOperations(this.proxyServers[index].mvnoId)) {
      this.editId = configId;

      this.overrideNASEvent(this.proxyServers[index].nasip);
      this.createProxyFlag = true;
      this.proxyGridFlag = false;
      this.detailGroupForm.patchValue({
        name: this.proxyServers[index].name,
        ip: this.proxyServers[index].ip,
        secretkey: this.proxyServers[index].secretkey,
        acctport: this.proxyServers[index].acctport,
        authport: this.proxyServers[index].authport,
        status: this.proxyServers[index].status,
        mvnoName: this.proxyServers[index].mvnoId,
        createdBy: this.proxyServers[index].createdBy,
        lastModifiedBy: this.proxyServers[index].lastModifiedBy,
        dynaAuthPort: this.proxyServers[index].dynaAuthPort,
        overrideNAS: this.proxyServers[index].overrideNAS,
        nasip: this.proxyServers[index].nasip,
        timeout: this.proxyServers[index].timeout,
      });
    }
  }

  addOrUpdate() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loggedInUser == "superadmin") {
      this.detailGroupForm.get("mvnoName").setValidators([Validators.required]);
      this.detailGroupForm.get("mvnoName").updateValueAndValidity();
    }
    if (this.detailGroupForm.invalid) {
      return;
    }
    const data = {
      name: this.detailGroupForm.value.name,
      ip: this.detailGroupForm.value.ip,
      secretkey: this.detailGroupForm.value.secretkey,
      acctport: this.detailGroupForm.value.acctport,
      authport: this.detailGroupForm.value.authport,
      status: this.detailGroupForm.value.status,
      mvnoId: this.detailGroupForm.value.mvnoName,
      createdBy: "",
      lastModifiedBy: "",
      dynaAuthPort: this.detailGroupForm.value.dynaAuthPort,
      overrideNAS: this.detailGroupForm.value.overrideNAS,
      nasip: this.detailGroupForm.value.nasip,
      timeout: this.detailGroupForm.value.timeout,
    };

    if (this.editId) {
      data.createdBy = this.detailGroupForm.value.createdBy;
      data.lastModifiedBy = this.loggedInUser;
      this.update(data);
    } else {
      data.createdBy = this.loggedInUser;
      data.lastModifiedBy = "";
      this.add(data);
    }

    this.detailGroupForm.get("mvnoName").clearValidators();
    this.detailGroupForm.get("mvnoName").updateValueAndValidity();
  }

  get f() {
    return this.detailGroupForm.controls;
  }

  private async add(data:any) {
    this.proxyServerService.add(data).subscribe(
      (response: any) => {
        this.getAll("");
        this.createProxyFlag = false;
        this.proxyGridFlag = true;
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle",
        });
        this.clearFormData();
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  private async update(data: any) {
    this.proxyServerService.update(this.editId, data).subscribe(
      (response: any) => {
        if (!this.searchkey) {
          this.getAll("");
        } else {
          this.search();
        }

        this.createProxyFlag = false;
        this.proxyGridFlag = true;
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle",
        });
        this.clearFormData();
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  clearFormData() {
    this.editId = null;
    this.submitted = false;
    this.detailGroupForm.reset();
  }

  async changeStatus(configId:any, status:any, selectedMvnoId:any, event:any) {
    event.preventDefault();
    this.modalToggle = true;
    if (this.validateUserToPerformOperations(selectedMvnoId)) {
      this.proxyServerService
        .changeSatus(
          configId,
          status == "Active" ? RadiusConstants.IN_ACTIVE : RadiusConstants.ACTIVE,
          selectedMvnoId
        )
        .subscribe(
          (response: any) => {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle",
            });
            if (!this.searchkey) {
              this.getAll("");
            } else {
              this.search();
            }
          },
          (error: any) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.errorMessage,
              icon: "far fa-times-circle",
            });
          }
        );
    }
  }

  pageChanged(pageNumber:any) {
    this.clearFormData();
    this.currentPage = pageNumber;
    if (!this.searchkey) {
      this.getAll("");
    } else {
      this.search();
    }
  }
  OneClientData: any = [];
  config = {
    name: "",
    ip: "",
    authport: "",
    acctport: "",
    secretKey: "",
    status: "",
    dynaAuthPort: "",
    overrideNAS: "",
    nasip: "",
    timeout: "",
  };
  showConfigDetail(clientId:any, mvnoId:any) {
    this.myModal = true;
    this.modalToggle = true;

    this.proxyServerService.getById(clientId, mvnoId).subscribe(
      (response: any) => {
        this.OneClientData = response;
        this.config = this.OneClientData.proxyServer;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  validateUserToPerformOperations(selectedMvnoId:any) {
    let loggedInUserMvnoId = localStorage.getItem("mvnoId");
    if (this.loggedInUser != "superadmin superadmin" && selectedMvnoId != loggedInUserMvnoId) {
      //  this.reset();
      this.messageService.add({
        severity: "info",
        summary: "Rejected",
        detail: "You are not authorized to do this operation. Please contact to the administrator",
        icon: "far fa-check-circle",
      });
      //   this.modalToggle = false;
      return false;
    }
    return true;
  }

  overrideNASEvent(ip:any) {
    if (ip) {
      this.detailGroupForm.controls['nasip'].enable();
      this.detailGroupForm.controls['nasip'].setValue("");
      this.detailGroupForm.controls['nasip'].setValidators(Validators.required);
      this.detailGroupForm.controls['nasip'].updateValueAndValidity();
    } else {
      this.detailGroupForm.controls['nasip'].disable();
      this.detailGroupForm.controls['nasip'].setValue("");
      this.detailGroupForm.controls['nasip'].clearValidators();
      this.detailGroupForm.controls['nasip'].updateValueAndValidity();
    }
  }

  canExit() {
    if (!this.detailGroupForm.dirty && !this.searchForm.dirty) return true;
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
