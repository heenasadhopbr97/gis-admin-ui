import { Component, NgZone, OnInit, Output, EventEmitter, Input, OnDestroy } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService, TreeNode } from "primeng/api";
import { Observable, Observer } from "rxjs";
import { AclEntry, Role } from "src/app/models/RoleManagement";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { LoginService } from "src/app/service/login.service";
import { RoleService } from "src/app/service/role.service";

@Component({
    selector: "app-create-role",
    templateUrl: "./create-role.component.html",
    styleUrls: ["./create-role.component.css"],
    standalone: false
})
export class CreateRoleComponent implements OnInit, OnDestroy {
  @Output() roleSaveorUpdated = new EventEmitter();
  @Input() roleData: { [x: string]: any; aclMenus?: any; id?: any; } = null;
  data: TreeNode[] = [];
  selectedNodes!: TreeNode[];

  rolePermissionList: any = [];

  isSelectAll: boolean = false;
  editMode: boolean = false;
  submitted: boolean = false;

  commonStatusList: any = [];

  roleGroupForm: FormGroup;

  constructor(
    private roleService: RoleService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.roleGroupForm = new FormGroup({
      rolename: new FormControl("", [Validators.required]),
      status: new FormControl("", [Validators.required]),
      product: new FormControl("BSS", [Validators.required]),
      //   aclEntryPojoList: new FormControl(this.saveSelectedPermission.aclEntryPojoList),
    });

    if (this.roleData) {
      this.editMode = true;
      this.roleGroupForm.patchValue(this.roleData);
      this.data = this.roleData.aclMenus;
    } else {
      this.getAclData();
    }

    this.roleService.getCommonList().subscribe(res => {
      this.commonStatusList = res.dataList;
    });
  }

  ngOnDestroy(): void {
    this.roleGroupForm = null;
    this.roleData = null;
    this.data = [];
    this.commonStatusList = [];
  }

  getAclData() {
    this.roleService.getAllACLMenu().subscribe(
      (response: any) => {
        this.data = response.datalist;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onNodeExpand(event:any) {
    this.collapseAllNodes(this.data); // Collapse all nodes first
    this.expandNodeAndParents(event.node); // Expand the selected node and its parents
  }

  collapseAllNodes(nodes:any) {
    nodes.forEach((node:any) => {
      node.expanded = false;
      if (node.children) {
        this.collapseAllNodes(node.children);
      }
    });
  }

  expandNodeAndParents(node:any) {
    node.expanded = true;
    let parent = node.parent;
    while (parent) {
      parent.expanded = true;
      parent = parent.parent;
    }
  }

  //Click event on checkbox
  onNodeSelect(event: any, rowNode: any) {
    if (rowNode) {
      this.checkAllChildNode(event.checked, rowNode.node);
      this.checkParentNodes(event.checked, rowNode.node);
    } else this.selectAllNodes(event.checked, this.data);
  }
  selectAllNodes(checked:any, nodes:any) {
    nodes.forEach((node:any) => {
      node.expanded = false;
      node.data.isSelected = checked;
      if (node.children) {
        this.selectAllNodes(checked, node.children);
      }
    });
  }
  // Method used to set checked all children items of the selected item for role
  checkAllChildNode(checked: boolean, node: any) {
    var childs = node.children;
    if (childs != null && childs.length > 0) {
      childs.map((child: any) => {
        child.data.isSelected = checked;
        if (child.children != null && child.children.length > 0) {
          this.checkAllChildNode(checked, child);
        }
      });
    }
  }
  // Method used to set checked all parent items of the selected item for role
  checkParentNodes(checked: boolean, node: any) {
    var parent = node.parent;
    if (checked && parent != null) {
      parent.data.isSelected = checked;
      this.checkParentNodes(checked, parent);
    }
  }

  addUpdateRole() {
    this.submitted = true;
    if (!this.roleGroupForm.valid) {
      return;
    }
    this.saveRolePermissions();
    if (this.rolePermissionList.length == 0) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please select atleast one operation permission.",
        icon: "far fa-times-circle",
      });
      return;
    }

    const role = new Role();
    role.rolename = this.roleGroupForm.value.rolename;
    role.status = this.roleGroupForm.value.status;
    role.product = this.roleGroupForm.value.product;
    role.aclMenu = this.rolePermissionList;
    let url = "/saveRole";
    if (this.editMode) {
      role.id = this.roleData.id;
      url = "/updateRole";
    } else {
      url = "/saveRole";
    }
    this.roleService.addUpdateRole(url, role, this.editMode).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.roleGroupForm.reset();
          this.rolePermissionList = [];
          this.submitted = false;
          this.loginService.refreshToken();
          this.loginService.getAclEntry();
          this.roleSaveorUpdated.emit();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.responseMessage,
            icon: "far fa-check-circle",
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
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  // Use for store all selected permissions into regarding array list
  saveRolePermissions() {
    this.rolePermissionList = [];
    this.data.forEach((permission: any) => {
      //Save permission
      this.createRolePermissionList(permission);
      if (permission.children?.length! > 0) {
        this.saveRolePermissionsChildren(permission.children);
      }
    });
  }

  // Use for store all selected child permissions into regarding array list and it will recursively calling until there is no any child item.
  saveRolePermissionsChildren(childItem: any) {
    childItem.map((permission: any) => {
      this.createRolePermissionList(permission);
      if (permission.children?.length! > 0) {
        this.saveRolePermissionsChildren(permission.children);
      }
    });
  }

  // Use for store all selected permissions into role permission array list.
  createRolePermissionList(object: any) {
    if (object.data.isSelected) {
      const aclEntry = new AclEntry();
      aclEntry.menuid = object.data.id;
      aclEntry.code = object.data.code;
      this.rolePermissionList.push(aclEntry);
    }
  }

  canExit() {
    if (!this.roleGroupForm.dirty) return true;
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
