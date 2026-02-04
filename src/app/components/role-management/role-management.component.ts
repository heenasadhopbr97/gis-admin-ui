import { Component, NgZone, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService, TreeNode } from "primeng/api";
import { Observable, Observer } from "rxjs";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { LoginService } from "src/app/service/login.service";
import { RoleService } from "src/app/service/role.service";
import { Acl } from "../generic-component/acl/acl-gerneric-component/model/acl";
import { AclOperationsList } from "../generic-component/acl/acl-gerneric-component/model/acl-operations-list";
import { AclSave } from "../generic-component/acl/acl-gerneric-component/model/acl-save";
import { Aclsaveoperationlist } from "../generic-component/acl/acl-gerneric-component/model/aclsaveoperationlist";
import { SETTINGS } from "src/app/constants/aclConstants";

@Component({
    selector: "app-role-management",
    templateUrl: "./role-management.component.html",
    styleUrls: ["./role-management.component.css"],
    standalone: false
})
export class RoleManagementComponent implements OnInit {
  AclClassConstants:any;
  AclConstants:any;

  searchRoleForm: FormGroup;

  currentPage: number = 1;
  itemsPerPage: number = RadiusConstants.ITEMS_PER_PAGE;
  totalRecords: number;
  pageLimitOptions = RadiusConstants.pageLimitOptions;

  searchSubmitted = false;
  isRoleList: boolean = true;
  isRoleCreateOrEdit: boolean = false;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  roleList: any = [];
  currentPageSize:any;
  public selectedRoleData: any = null;

  searchData = {
    filters: [
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

  constructor(
    private roleService: RoleService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private radiusUtility: RadiusUtility,
    private ngZone: NgZone,
    public loginService: LoginService
  ) {
    this.createAccess = loginService.hasPermission(SETTINGS.ROLE_CREATE);
    this.deleteAccess = loginService.hasPermission(SETTINGS.ROLE_DELETE);
    this.editAccess = loginService.hasPermission(SETTINGS.ROLE_EDIT);
  }

  ngOnInit(): void {
    this.searchRoleForm = this.fb.group({
      name: ["", Validators.required],
    });
    this.getAll("");
  }

  openRoleCreateMenu() {
    this.isRoleList = false;
    this.isRoleCreateOrEdit = true;
    this.selectedRoleData = null;
  }

  openRoleListMenu() {
    this.isRoleCreateOrEdit = false;
    this.isRoleList = true;
    this.selectedRoleData = null;
  }

  roleSaveorUpdated() {
    this.isRoleCreateOrEdit = false;
    this.isRoleList = true;
    this.selectedRoleData = null;
    this.searchRoleForm.reset();
    this.getAll("");
  }

  roleData = null as string | null;
  roleId = null as number | null;

  editRoleById(roleId:any, index:any) {
    // this.isUpdateComponent = true;

    // this.editMode = true;
    // this.isRoleList = false;
    // this.isRoleCreateOrEdit = true;
    // this.editRoleId = roleId;
    this.roleService.getRoleById(roleId).subscribe(
      (response: any) => {
        console.log("get Role response ::::: ", response);

        // this.roleData = response.data;
        this.selectedRoleData = response.data;

        if (this.selectedRoleData) {
          this.isRoleList = false;
          this.isRoleCreateOrEdit = true;
        }

        // this.setAccessData();
        // this.editData.aclEntryPojoList.forEach(access => {
        //   this.dataListAccess.forEach(element => {
        //     element.submenu.forEach(menu => {
        //       menu.aclOperationsList.forEach(data => {
        //         if (access.classid == data.classid && access.permit == data.id)
        //           data.accessible = true;
        //       });
        //     });
        //   });
        // });

        // this.setData(this.editData);
        // this.roleGroupForm.patchValue(this.editData);
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

  getAll(list:any) {
    let size;
    let pageList = this.currentPage;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      size = this.itemsPerPage;
    }

    let rolData = {
      page: pageList,
      pageSize: size,
    };
    // this.roleService.getAll().subscribe(
    this.roleService.getDataPostAPIWithFlag(rolData, true).subscribe(
      (response: any) => {
        this.roleList = response.dataList;
        this.totalRecords = response.totalRecords;
        if (response.currentPageNumber > response.totalPages) {
          this.currentPage = 1;
          this.getAll("");
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

  searchRoleByName() {
    // this.currentPage = 1
    this.searchSubmitted = true;
    if (this.searchRoleForm.valid && this.searchRoleForm.value.name != "") {
      // if (this.searchRoleForm.value.name == null) {
      //   this.searchRoleForm.value.name = "";
      // }

      console.log("this.searchData :::: ", this.searchData);

      if (
        !this.searchData.filters[0].filterValue ||
        this.searchData.filters[0].filterValue !== this.searchRoleForm.value.name
      ) {
        this.currentPage = 1;
        this.searchData.page = "1";
        this.searchData.pageSize = RadiusConstants.ITEMS_PER_PAGE.toString();
        this.currentPageSize = RadiusConstants.ITEMS_PER_PAGE.toString();
      } else {
        this.searchData.page = this.currentPage.toString();
        this.searchData.pageSize = this.itemsPerPage.toString();
        this.currentPageSize = this.itemsPerPage;
      }
      this.searchData.filters[0].filterValue = this.searchRoleForm.value.name.trim();
      this.roleService.getByName(this.searchData).subscribe(
        (response: any) => {
          if (response.responseCode == 404) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.responseMessage,
              icon: "far fa-times-circle",
            });
            this.roleList = [];
            this.totalRecords = 0;
          } else {
            this.roleList = response.dataList;
            this.totalRecords = response.totalRecords;
            if (response.currentPageNumber > response.totalPages) {
              this.currentPage = 1;
              this.searchRoleByName();
            }
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

  deleteConfirm(role:any) {
    this.confirmationService.confirm({
      message: "Do you want to delete this Role?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.deleteRoleById(role);
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

  deleteRoleById(role:any) {
    this.roleService.delete(role.id).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          if (this.searchData.filters[0].filterValue) {
            this.searchRoleByName();
          } else {
            this.getAll("");
          }
          this.loginService.refreshToken();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.responseMessage,
            icon: "far fa-check-circle",
          });
        } else {
          this.messageService.add({
            severity: "info",
            summary: "info",
            detail: response.responseMessage,
            icon: "far fa-check-circle",
          });
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

  pageChanged(pageNumber:any) {
    this.currentPage = pageNumber;
    if (this.searchRoleForm.value.name) {
      this.searchRoleByName();
    } else {
      this.getAll("");
    }
  }

  TotalItemPerPage(event:any) {
    this.itemsPerPage = Number(event.value);
    this.currentPageSize = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchRoleForm.value.name) {
      this.getAll(this.itemsPerPage);
    } else {
      this.searchRoleByName();
    }
  }

  clearSearchForm() {
    this.searchRoleForm.value.name = "";
    this.searchRoleForm.reset();
    this.searchSubmitted = false;
    this.searchData = {
      filters: [
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

    this.currentPage = 1;
    this.currentPageSize = RadiusConstants.pageLimitOptions[0];
    this.getAll("");
  }
  canExit() {
    return true;
  }
}
