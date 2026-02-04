import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { RadiusClientService } from "src/app/service/radius-client.service";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { MessageService } from "primeng/api";
import { IClient } from "src/app/components/model/radius-client";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { RADIUS_CONSTANTS } from "src/app/constants/aclConstants";

@Component({
    selector: "app-radius-client",
    templateUrl: "./radius-client.component.html",
    styleUrls: ["./radius-client.component.css"],
    standalone: false
})
export class RadiusClientComponent implements OnInit {
  clientForm: FormGroup;
  searchClientForm: FormGroup;
  submitted = false;
  searchSubmitted = false;
  editClientId: number;
  clientDataList: any[] = [];
  //Client Group data
  clientGroupData: any = [];
  clientData: any = [];
  OneClientData: any = [];
  //Used and required for pagination
  clientIpAddress: string;
  totalRecords: number;
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: string;

  editClientData: IClient;
  editMode: boolean = false;
  ipType = [{ label: "IPv4" }, { label: "IPv6" }, { label: "Subnet" }];
  mvnoData: any;
  loggedInUser: any;
  mvnoId: any;
  filteredGroupList: Array<any> = [];
  accessData: any = JSON.parse(localStorage.getItem("accessData"));

  @ViewChild("ipFocus") usernameRef: ElementRef;

  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  createAccess: any;
  editAccess: any;
  deleteAccess: any;

  constructor(
    private radiusClientService: RadiusClientService,
    private fb: FormBuilder,
    private messageService: MessageService,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;

    this.createAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_CLIENT_CREATE);
    this.deleteAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_CLIENT_DELETE);
    this.editAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_CLIENT_EDIT);
    this.findAllClient("");
    // this.getAllClientGroups();
  }

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      clientIpAddress: ["", Validators.required],
      ipType: ["", Validators.required],
      sharedKey: ["", Validators.required],
      timeOut: ["", Validators.required],
      clientGroupId: ["", Validators.required],
      mvnoName: [""],
    });
    this.searchClientForm = this.fb.group({
      clientIpAddress: [""],
    });

    this.mvnoData = JSON.parse(localStorage.getItem("mvnoData"));
    this.loggedInUser = localStorage.getItem("loggedInUser");
    this.mvnoId = localStorage.getItem("mvnoId");
  }
  //   createnewClient() {
  //     this.editMode = false;
  //     this.submitted = false;
  //     this.clientForm.reset();
  //     this.usernameRef.nativeElement.focus();
  //   }
  //   async searchClientByIp() {
  //     this.searchSubmitted = true;
  //     if (this.searchClientForm.value.clientIpAddress == null) {
  //       this.searchClientForm.value.clientIpAddress = "";
  //     }

  //     if (this.searchClientForm.valid) {
  //       // this.currentPage = 1;

  //       if (
  //         !this.searchkey ||
  //         this.searchkey !== this.searchClientForm.value.clientIpAddress.trim()
  //       ) {
  //         this.currentPage = 1;
  //       }
  //       if (this.showItemPerPage) {
  //         this.itemsPerPage = this.showItemPerPage;
  //       }

  //       this.clientDataList = [];
  //       let clientIpAddress = this.searchClientForm.value.clientIpAddress.trim()
  //         ? this.searchClientForm.value.clientIpAddress.trim()
  //         : "";

  //       this.searchkey = clientIpAddress;
  //       this.clientData = [];
  //       this.radiusClientService.getClientDataByIp(clientIpAddress).subscribe(
  //         (response: any) => {
  //           this.clientData = response.clientList;
  //           //this.totalRecords = response.clientList.totalRecords;
  //           this.clientDataList = this.clientData;
  //         },
  //         (error: any) => {
  //           if (error.error.status == 404) {
  //             this.totalRecords = 0;
  //             this.messageService.add({
  //               severity: "info",
  //               summary: "Info",
  //               detail: error.error.errorMessage,
  //               icon: "far fa-times-circle",
  //             });
  //           } else {
  //             this.totalRecords = 0;
  //             this.messageService.add({
  //               severity: "error",
  //               summary: "Error",
  //               detail: error.error.errorMessage,
  //               icon: "far fa-times-circle",
  //             });
  //           }
  //         }
  //       );
  //     }
  //   }

  //   TotalItemPerPage(event) {
  //     this.showItemPerPage = Number(event.value);
  //     if (this.currentPage > 1) {
  //       this.currentPage = 1;
  //     }
  //     if (!this.searchkey) {
  //       this.findAllClient(this.showItemPerPage);
  //     } else {
  //       this.searchClientByIp();
  //     }
  //   }

  async findAllClient(list:any) {
    let size;
    this.searchkey = "";
    let page = this.currentPage;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      size = this.itemsPerPage;
    }
    this.radiusClientService.findAllClientData(page, size, (this.clientIpAddress = "")).subscribe(
      (response: any) => {
        this.clientData = response.clientList;
        // this.totalRecords = response.clientList.totalRecords;
        this.clientDataList = this.clientData;
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
  //   async getAllClientGroups() {
  //     this.radiusClientService.getAllValidClientGroups().subscribe(
  //       (response: any) => {
  //         this.clientGroupData = response;
  //         this.getDetailsByMVNO(JSON.parse(localStorage.getItem("mvnoId")));
  //         // console.log(JSON.parse(localStorage.getItem('mvnoId')));
  //       },
  //       (error: any) => {
  //         this.messageService.add({
  //           severity: "error",
  //           summary: "Error",
  //           detail: error.error.errorMessage,
  //           icon: "far fa-times-circle",
  //         });
  //       }
  //     );
  //   }

  //   async editClientById(clientId, index) {
  //     if (
  //       this.validateUserToPerformOperations(
  //         this.clientDataList[index].mvnoId
  //         // this.clientData.mvnoId
  //       )
  //     ) {
  //       this.editMode = true;
  //       this.editClientId = clientId;
  //       this.radiusClientService.getClientDataById(clientId).subscribe(
  //         (response: any) => {
  //           let data = response.client;
  //           this.clientForm.patchValue({
  //             clientIpAddress: data.clientIpAddress,
  //             ipType: data.ipType,
  //             sharedKey: data.sharedKey,
  //             timeOut: data.timeOut,
  //             clientGroupId: data.clientGroupId,
  //             mvnoName: data.mvnoId,
  //           });
  //         },
  //         (error: any) => {
  //           this.messageService.add({
  //             severity: "error",
  //             summary: "Error",
  //             detail: error.error.errorMessage,
  //             icon: "far fa-times-circle",
  //           });
  //         }
  //       );

  //       //this.hideField();
  //       //  index = this.radiusUtility.getIndexOfSelectedRecord(
  //       //    index,
  //       //    this.currentPage,
  //       //    this.itemsPerPage
  //       //  );
  //       // this.clientForm.patchValue({
  //       //   clientIpAddress: this.clientDataList[index].clientIpAddress,
  //       //   ipType: this.clientDataList[index].ipType,
  //       //   sharedKey: this.clientDataList[index].sharedKey,
  //       //   timeOut: this.clientDataList[index].timeOut,
  //       //   clientGroupId: this.clientDataList[index].clientGroupId,
  //       //   mvnoName: this.clientDataList[index].mvnoId,
  //       // })
  //       // this.clientDataList=this.clientData;
  //       // this.spinner.hide()
  //     }
  //   }

  //   async addClient() {
  //     this.submitted = true;
  //     if (this.clientForm.valid) {
  //       if (this.editMode) {
  //         this.editClientData = this.clientForm.value;
  //         this.editClientData.clientId = this.editClientId;
  //         this.editClientData.mvnoId = this.clientForm.value.mvnoName;
  //         this.radiusClientService.updateClient(this.editClientData).subscribe(
  //           (response: any) => {
  //             this.editMode = false;
  //             this.submitted = false;
  //             if (!this.searchkey) {
  //               this.findAllClient("");
  //             } else {
  //               this.searchClientByIp();
  //             }
  //             this.clientForm.reset();
  //             this.messageService.add({
  //               severity: "success",
  //               summary: "Successfully",
  //               detail: response.message,
  //               icon: "far fa-check-circle",
  //             });
  //           },
  //           error => {
  //             this.messageService.add({
  //               severity: "error",
  //               summary: "Error",
  //               detail: error.error.errorMessage,
  //               icon: "far fa-times-circle",
  //             });
  //           }
  //         );
  //       } else {
  //         if (this.validateUserToPerformOperations(this.mvnoId)) {
  //           this.radiusClientService
  //             .addNewClient(this.clientForm.value, this.clientForm.value.mvnoName)
  //             .subscribe(
  //               (response: any) => {
  //                 this.submitted = false;
  //                 this.findAllClient("");
  //                 this.clientForm.reset();
  //                 this.messageService.add({
  //                   severity: "success",
  //                   summary: "Successfully",
  //                   detail: response.message,
  //                   icon: "far fa-check-circle",
  //                 });
  //               },
  //               (error: any) => {
  //                 this.messageService.add({
  //                   severity: "error",
  //                   summary: "Error",
  //                   detail: error.error.errorMessage,
  //                   icon: "far fa-times-circle",
  //                 });
  //               }
  //             );
  //         }
  //       }
  //     }
  //   }
  //   deleteConfirm(clientId, mvnoId, index) {
  //     if (this.validateUserToPerformOperations(mvnoId)) {
  //       this.confirmationService.confirm({
  //         message: "Do you want to delete this record?",
  //         header: "Delete Confirmation",
  //         icon: "pi pi-info-circle",
  //         accept: () => {
  //           this.deleteClientById(clientId, mvnoId, index);
  //         },
  //         reject: () => {
  //           this.messageService.add({
  //             severity: "info",
  //             summary: "Rejected",
  //             detail: "You have rejected",
  //           });
  //         },
  //       });
  //     }
  //   }
  //   async deleteClientById(clientId, selectedMvnoId, index) {
  //     this.radiusClientService.deleteClientById(clientId, selectedMvnoId).subscribe(
  //       (response: any) => {
  //         if (this.currentPage != 1 && index == 0) {
  //           this.currentPage = this.currentPage - 1;
  //         }
  //         if (!this.searchkey) {
  //           this.findAllClient("");
  //         } else {
  //           this.searchClientByIp();
  //         }
  //         this.messageService.add({
  //           severity: "success",
  //           summary: "Successfully",
  //           detail: response.message,
  //           icon: "far fa-check-circle",
  //         });
  //       },
  //       (error: any) => {
  //         this.messageService.add({
  //           severity: "error",
  //           summary: "Error",
  //           detail: error.error.errorMessage,
  //           icon: "far fa-times-circle",
  //         });
  //       }
  //     );
  //   }
  client = {
    clientId: 0,
    clientIp: "",
    sharedKey: "",
    timeOut: "",
    ipType: "",
    mvnoId: "",
  };
  modalToggle: boolean = true;

  //   showClientDetail(clientId) {
  //     this.modalToggle = true;

  //     this.radiusClientService.getClientDataById(clientId).subscribe(
  //       (response: any) => {
  //         this.OneClientData = response;
  //         this.client = this.OneClientData.client;
  //       },
  //       (error: any) => {
  //         this.messageService.add({
  //           severity: "error",
  //           summary: "Error",
  //           detail: error.error.errorMessage,
  //           icon: "far fa-times-circle",
  //         });
  //       }
  //     );
  //   }
  //   clearSearchForm() {
  //     this.clearFormData();
  //     this.editMode = false;
  //     // this.ngOnInit();
  //     this.searchSubmitted = false;
  //     this.searchClientForm.reset();
  //     this.currentPage = 1;
  //     this.findAllClient("");
  //   }

  //   clearFormData() {
  //     this.submitted = false;
  //     this.clientForm.setValue({
  //       clientIpAddress: "",
  //       ipType: "",
  //       sharedKey: "",
  //       timeOut: "",
  //       clientGroupId: "",
  //       mvnoName: "",
  //     });
  //     this.searchClientForm = this.fb.group({
  //       clientIpAddress: [""],
  //     });
  //   }
  //   pageChanged(pageNumber) {
  //     this.currentPage = pageNumber;
  //     if (!this.searchkey) {
  //       this.findAllClient("");
  //     } else {
  //       this.searchClientByIp();
  //     }
  //   }

  //   validateUserToPerformOperations(selectedMvnoId) {
  //     let loggedInUserMvnoId = localStorage.getItem("mvnoId");
  //     if (this.loggedInUser != "superadmin superadmin" && selectedMvnoId != loggedInUserMvnoId) {
  //       //  this.reset();
  //       this.messageService.add({
  //         severity: "info",
  //         summary: "Rejected",
  //         detail: "You are not authorized to do this operation. Please contact to the administrator",
  //         icon: "far fa-check-circle",
  //       });
  //       this.modalToggle = false;
  //       return false;
  //     }
  //     return true;
  //   }
  //   getDetailsByMVNO(mvnoId) {
  //     let allGroupList: Array<any> = this.clientGroupData.clientGroupList
  //       ? this.clientGroupData.clientGroupList
  //       : [];
  //     this.filteredGroupList = [];
  //     if (mvnoId == 1) {
  //       this.filteredGroupList = allGroupList;
  //     } else {
  //       this.filteredGroupList = allGroupList.filter(
  //         element => element.mvnoId == mvnoId || element.mvnoId == 1
  //       );
  //     }
  //   }

  //   canExit() {
  //     if (!this.clientForm.dirty) return true;
  //     {
  //       return Observable.create((observer: Observer<boolean>) => {
  //         this.confirmationService.confirm({
  //           header: "Alert",
  //           message: "The filled data will be lost. Do you want to continue? (Yes/No)",
  //           icon: "pi pi-info-circle",
  //           accept: () => {
  //             observer.next(true);
  //             observer.complete();
  //           },
  //           reject: () => {
  //             observer.next(false);
  //             observer.complete();
  //           },
  //         });
  //         return false;
  //       });
  //     }
  //   }
}
