import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { Injectable } from "@angular/core";
import { MenuItem, MessageService } from "primeng/api";
// import jwt_decode from "jwt-decode";
import { MenuItems } from "../constants/menuItems";
import { PermitACLConstants } from "../constants/PermitACLConstants";
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { HttpResponseCache } from "./http-response-cache";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
})
export class LoginService {
  permissionList:any[] = [];
  menuPermissionList:any[] = [];
  PermitAclConstants;

  private aclEntrySubject = new BehaviorSubject<any>(null);

  // Observable to watch for changes in ACL entries
  aclEntry$ = this.aclEntrySubject.asObservable();

  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private cache: HttpResponseCache,
    private router: Router
  ) {
    this.PermitAclConstants = PermitACLConstants;
  }

  // baseUrl = RadiusConstants.KEYANNA_API_GATEWAY_COMMON_MANAGEMENT;
  baseUrl = environment.KEYANNA_API_GATEWAY_COMMON_PORT;

  generateOtp(username: string, password: string): Observable<any> {
    const OTPGenerateDTO = {
      username: username,
      password: password,
      otpForStaff: true
    };
    return this.http.post(`${this.baseUrl}/otp/generate`, OTPGenerateDTO, httpOptions);
  }

  verifyOtp(username: string, otp: string): Observable<any> {
    const otpValidatData = {
      username: username,
      otp: otp,
      otpForStaff: true
    };
    return this.http.post(`${this.baseUrl}/otp/validate`, otpValidatData, httpOptions);
  }

  generateToken(data:any) {
    return this.http.post(`${this.baseUrl}/login`, data, httpOptions);
  }
  refreshToken() {
    this.http.get(`${this.baseUrl}/refreshtoken`).subscribe(
      (response: any) => {
        localStorage.setItem("token", response.accessToken);
      },
      (error: any) => {
        console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  loginUser(token:any) {
    localStorage.setItem("token", token);
    return true;
  }

  data = {
    sub: ""
  };

  isLoggedIn() {
    let token = localStorage.getItem("token");
    this.data = this.getDecodedAccessToken(token);
    if (this.data != null) {
      let mvno = this.data.sub
        .substring(this.data.sub.indexOf('mvnoId":'))
        .split(",")[0]
        .split(":")[1];
      localStorage.setItem("mvnoId", mvno);
    }
    if (token == undefined || token === "" || token == null) {
      return false;
    } else {
      return true;
    }
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("mvnoId");
    localStorage.removeItem("demographic");
    localStorage.clear();
    this.cache.clear();
    return true;
  }

  getToken() {
    return localStorage.getItem("token");
  }

  getRadiusServiceStatus() {
    return this.http.get(`${RadiusConstants.KEYANNA_RADIUS_BASE_URL}/serviceStatus`);
  }

  //   getTacacsServiceStatus() {
  //     return this.http.get(
  //       `${RadiusConstants.KEYANNA_TACACS_MANAGEMENT_SYSTEM_BASE_URL}/tacacs-service/health`
  //     );
  //   }

  getNotificationServiceStatus() {
    return this.http.get(`${RadiusConstants.KEYANNA_NOTIFICATION_BASE_URL}/serviceStatus`);
  }

  getSaleCrmServiceStatus() {
    return this.http.get(`${RadiusConstants.KEYANNA_LEAD_BASE_URL}/serviceStatus`);
  }

  getTaskMgmtServiceStatus() {
    return this.http.get(`${RadiusConstants.KEYANNA_TASK_MGMT_BASE_URL}/serviceStatus`);
  }

  getMethod(url:any) {
    return this.http.get(this.baseUrl + url);
  }
  getCurrentBUStaff(url:any) {
    return this.http.get(`${RadiusConstants.KEYANNA_API_GATEWAY_COMMON_MANAGEMENT}` + url);
  }
  setMenuPermission(data:any) {
    localStorage.setItem("menuPermission", JSON.stringify(data));
  }

  public getAclEntry() {
    const url = "/acl/getAclEntry";
    this.permissionList = [];
    this.getMethod(url).subscribe(
      (res: any) => {
        // console.log("res ACL ENTRY ::::::::: ", res);

        if (res.dataList != null) {
          localStorage.setItem("aclEntries", JSON.stringify(res.dataList));
          this.updateAclEntry(JSON.parse(localStorage.getItem("aclEntries")));
        }
      },
      err => {
        this.messageService.add({
          severity: "error",
          summary: err.error.errorMessage,
          detail: "Something was wrong. Try again",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  // Method to update ACL entries
  updateAclEntry(aclEntry: any) {
    this.aclEntrySubject.next(aclEntry);
  }

  setUserRoleOperationPermission(data:any) {
    localStorage.setItem("userRoleOperationPermission", JSON.stringify(data));
  }

  hasOperationPermission(classId:any, operationId:any, accessIdForAllOpreation:any) {
    return true;
    let RoleAdmin = localStorage.getItem("userRoles");
    this.permissionList = [];
    let permissionList = localStorage.getItem("userRoleOperationPermission");
    if (permissionList.length > 0) {
      this.permissionList = JSON.parse(localStorage.getItem("userRoleOperationPermission"));
    }
    if (RoleAdmin === "1") {
      return true;
    }
    if (this.permissionList.length > 0) {
      for (let permission of this.permissionList) {
        let isPersmissionList = permission.operations.filter(
          (item:any) =>
            (item.opid === accessIdForAllOpreation || item.opid === operationId) &&
            item.classid === classId
        );
        if (isPersmissionList.length != 0) {
          // console.log("true");
          return true;
        }
      }
      return true;
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Restriction",
        detail: "Sorry you have not privilege to any operation!",
        icon: "far fa-times-circle"
      });
    }
  }

  hasOperationPermissionOfAll(classId:any, accessIdForAllOpreation:any):any {
    let RoleAdmin = localStorage.getItem("userRoles");
    this.permissionList = [];
    let permissionList = localStorage.getItem("userRoleOperationPermission");
    if (permissionList.length > 0) {
      this.permissionList = JSON.parse(localStorage.getItem("userRoleOperationPermission"));
    }
    if (RoleAdmin === "1") {
      return true;
    }
    if (this.permissionList.length > 0) {
      for (let permission of this.permissionList) {
        let isPersmissionList = permission.operations.filter(
          (item:any) => item.opid === accessIdForAllOpreation && item.classid === classId
        );
        if (isPersmissionList.length != 0) {
          // console.log("true");
          return true;
        }
      }
      return false;
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Restriction",
        detail: "Sorry you have not privilege to any operation!",
        icon: "far fa-times-circle"
      });
    }
  }

  hideParentMenu(menuId:any):any {
    this.menuPermissionList = [];
    let RoleAdmin = localStorage.getItem("userRoles");
    //this.menuPermissionList = this.tokenStorageService.getMenuPermission();
    let menuPermissionList = localStorage.getItem("menuPermission");
    if (menuPermissionList.length > 0) {
      this.menuPermissionList = JSON.parse(localStorage.getItem("menuPermission"));
    }
    if (RoleAdmin === "1") {
      return true;
    }
    if (this.menuPermissionList) {
      if (this.menuPermissionList.length > 0) {
        let filterPersmissionList = this.menuPermissionList.filter(menu => menu.menuid === menuId);

        if (filterPersmissionList && filterPersmissionList.length > 0) {
          let submenus = filterPersmissionList[0].submenu.filter((obj: any) => obj.permits != null);
          let permitList:any[] = [];
          let list:any[] = [];
          submenus.forEach((item:any) =>
            item.permits && item.permits.length > 0 ? permitList.push(item.permits) : ""
          );
          for (let myconstant in PermitACLConstants) {
            permitList.forEach(item =>
              item.forEach((obj: any) =>
                obj === PermitACLConstants[myconstant] ? list.push(obj) : ""
              )
            );
          }
          if (list && list.length > 0) {
            return true;
          }
        }
      }
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Restriction",
        detail: "Sorry you have not privilege to access any menu!",
        icon: "far fa-times-circle"
      });
    }
  }

  hideSidebarMenu(menuId:any, subMenuId:any, constantVar:any):any {
    let RoleAdmin = localStorage.getItem("userRoles");
    if (RoleAdmin === "1") {
      return true;
    }

    this.menuPermissionList = [];
    let menuPermissionList = localStorage.getItem("menuPermission");
    if (menuPermissionList.length > 0) {
      this.menuPermissionList = JSON.parse(localStorage.getItem("menuPermission"));
    }
    //this.menuPermissionList = this.tokenStorageService.getMenuPermission();
    if (this.menuPermissionList) {
      if (this.menuPermissionList.length > 0) {
        let filterPersmissionList = this.menuPermissionList.filter(menu => menu.menuid === menuId);
        if (filterPersmissionList && filterPersmissionList.length > 0) {
          let isPersmissionList = filterPersmissionList[0].submenu.filter(
            (item:any) => item.menuid === subMenuId
          );
          if (isPersmissionList && isPersmissionList.length > 0) {
            let list:any = [];
            isPersmissionList.forEach((item:any) =>
              item.permits.includes(constantVar) ? list.push(item) : ""
            );
            if (list && list.length > 0) {
              return true;
            }
          }
        }
      } else {
        this.messageService.add({
          severity: "error",
          summary: "Restriction",
          detail: "Sorry you have not privilege to access any menu!",
          icon: "far fa-times-circle"
        });
      }
    }
  }

  hideChildSidebarMenu(menuId:any, subMenuId:any, childSubMenuId:any):any {
    let RoleAdmin = localStorage.getItem("userRoles");
    if (RoleAdmin === "1") {
      return true;
    }
    this.menuPermissionList = [];
    //this.menuPermissionList = this.tokenStorageService.getMenuPermission();
    let menuPermissionList = localStorage.getItem("menuPermission");
    if (menuPermissionList.length > 0) {
      this.menuPermissionList = JSON.parse(localStorage.getItem("menuPermission"));
    }
    if (this.menuPermissionList.length > 0) {
      let filterPersmissionList = this.menuPermissionList.filter(menu => menu.menuid === menuId);
      if (filterPersmissionList.length > 0) {
        let isPersmissionList = filterPersmissionList[0].submenu.filter(
          (item:any) => item.menuid === subMenuId
        );
        if (isPersmissionList.length != 0) {
          if (isPersmissionList[0].submenu) {
            if (isPersmissionList[0].submenu.length > 0) {
              let isPersmissionListChild = isPersmissionList[0].submenu.filter(
                (item:any) => item.menuid === childSubMenuId
              );
              if (isPersmissionListChild.length != 0) {
                return true;
              }
            }
          }
        }
      }
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Restriction",
        detail: "Sorry you have not privilege to access any menu!",
        icon: "far fa-times-circle"
      });
    }
  }

  getOTP(data:any) {
    return this.http.post(
      `${RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL}/otp/generate`,
      data
    );
  }

  validateOTP(data:any) {
    return this.http.post(
      `${RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL}/otp/validate`,
      data
    );
  }

  changePassword(data:any) {
    return this.http.put(
      `${RadiusConstants.KEYANNA_API_GATEWAY_COMMON_MANAGEMENT}/staffuser/resetpassword`,
      data
    );
  }

  SearchResellerName(name:any) {
    return this.http.get(
      `${RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL}/getStaffContactByUserName?username=` +
        encodeURIComponent(name)
    );
  }

  hasPermission(...itemCodes: string[]): boolean {
    const rolePermissions = JSON.parse(localStorage.getItem("aclEntries"));

    if (rolePermissions != null) {
      return rolePermissions.some((item: any) => {
        return itemCodes.includes(item.code);
      });
    }
    return false;
  }
}
function jwt_decode(token: string): any {
  throw new Error("Function not implemented.");
}

