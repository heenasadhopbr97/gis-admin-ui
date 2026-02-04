import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { InvoicePaymentListService } from "src/app/service/invoice-payment-list.service";
import { LoginService } from "src/app/service/login.service";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";
import { AcctProfileService } from "src/app/service/radius-profile.service";
import { RADIUS_CONSTANTS } from "src/app/constants/aclConstants";
import { FormBuilder, FormGroup } from "@angular/forms";
import { RadiusClientService } from "src/app/service/radius-client.service";

declare var $: any;

@Component({
    selector: "app-radius-client-list",
    templateUrl: "./radius-client-list.component.html",
    styleUrls: ["./radius-client-list.component.scss"],
    standalone: false
})
export class RadiusClientListComponent implements OnInit {
  searchkey: string;
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  profileData: any = [];
  totalRecords: number;
  createAccess: any;
  editAccess: any;
  deleteAccess: any;
  loggedInUser: any;
  radiusProfileDetail: any = [];
  proxyServerName: string = "-";
  coaDMProfileName: string = "-";
  mappingMasterName: string = "-";
  checkItem: string = "-";
  isProfileDetailsModelVisible: boolean = false;
  modalToggle: boolean = false;
  searchSubmitted = false;
  searchProfileForm: FormGroup;
  showItemPerPage: any;
  pageLimitOptions = RadiusConstants.pageLimitOptions;

  clientDataList: any[] = [];
  searchClientForm: FormGroup;
  clientData: any = [];
  clientIpAddress: string;
  OneClientData: any = [];

  client = {
    clientId: 0,
    clientIp: "",
    sharedKey: "",
    timeOut: "",
    ipType: "",
    mvnoId: "",
    clientGroupId: ""
  };

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public commondropdownService: CommondropdownService,
    public datepipe: DatePipe,
    public loginService: LoginService,
    public invoicePaymentListService: InvoicePaymentListService,
    public KeyannaCommonBaseService: KeyannaCommonBaseService,
    private acctProfileService: AcctProfileService,
    private fb: FormBuilder,
    private radiusClientService: RadiusClientService
  ) {
    this.createAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_PROFILES_CREATE);
    this.deleteAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_PROFILES_DELETE);
    this.editAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_PROFILES_EDIT);

    this.findAllClient("");
  }

  async ngOnInit() {
    this.searchClientForm = this.fb.group({
      clientIpAddress: [""],
    });
  }

  async searchClientByIp() {
    this.searchSubmitted = true;
    if (this.searchClientForm.value.clientIpAddress == null) {
      this.searchClientForm.value.clientIpAddress = "";
    }

    if (this.searchClientForm.valid) {
      // this.currentPage = 1;

      if (
        !this.searchkey ||
        this.searchkey !== this.searchClientForm.value.clientIpAddress.trim()
      ) {
        this.currentPage = 1;
      }
      if (this.showItemPerPage) {
        this.itemsPerPage = this.showItemPerPage;
      }

      this.clientDataList = [];
      let clientIpAddress = this.searchClientForm.value.clientIpAddress.trim()
        ? this.searchClientForm.value.clientIpAddress.trim()
        : "";

      this.searchkey = clientIpAddress;
      this.clientData = [];
      this.radiusClientService.getClientDataByIp(clientIpAddress).subscribe(
        (response: any) => {
          this.clientData = response.clientList;
          //this.totalRecords = response.clientList.totalRecords;
          this.clientDataList = this.clientData;
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
            this.totalRecords = 0;
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.errorMessage,
              icon: "far fa-times-circle",
            });
          }
        }
      );
    }
  }

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

  deleteConfirm(clientId:any, mvnoId:any, index:any) {
    if (this.validateUserToPerformOperations(mvnoId)) {
      this.confirmationService.confirm({
        message: "Do you want to delete this record?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteClientById(clientId, mvnoId, index);
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
      this.modalToggle = false;
      return false;
    }
    return true;
  }

  async deleteClientById(clientId:any, selectedMvnoId:any, index:any) {
    this.radiusClientService.deleteClientById(clientId, selectedMvnoId).subscribe(
      (response: any) => {
        if (this.currentPage != 1 && index == 0) {
          this.currentPage = this.currentPage - 1;
        }
        if (!this.searchkey) {
          this.findAllClient("");
        } else {
          this.searchClientByIp();
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

  showClientDetail(clientId:any) {
    this.modalToggle = true;

    this.radiusClientService.getClientDataById(clientId).subscribe(
      (response: any) => {
        this.OneClientData = response;
        this.client = this.OneClientData.client;
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

  closeClientDetailsModel() {
    this.modalToggle = false;
  }

  clearSearchForm() {
    this.searchSubmitted = false;
    this.searchClientForm.reset();
    this.currentPage = 1;
    this.findAllClient("");
  }

  pageChanged(pageNumber:any) {
    this.currentPage = pageNumber;
    if (!this.searchkey) {
      this.findAllClient("");
    } else {
      this.searchClientByIp();
    }
  }

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.findAllClient(this.showItemPerPage);
    } else {
      this.searchClientByIp();
    }
  }
}
