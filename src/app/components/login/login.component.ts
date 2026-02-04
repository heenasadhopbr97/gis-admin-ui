import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { AuthenticationService } from "src/app/service/authentication.service";
import { LoginService } from "src/app/service/login.service";
import { MessageService } from "primeng/api";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
// import { PrimeNGConfig } from "primeng/api";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { Title } from "@angular/platform-browser";
import { TITLE, FOOTER } from "../../RadiusUtils/RadiusConstants";
import { interval, Subscription } from "rxjs";
declare var $: any;
// import {NgxCaptchaService} from  '@binssoft/ngx-captcha'
export function MustMatch(newPassword: string, confirmNewPassword: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[newPassword];
    const matchingControl = formGroup.controls[confirmNewPassword];

    if (matchingControl.errors && !matchingControl.errors["mustMatch"]) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"],
    standalone: false
})
export class LoginComponent implements OnInit {
  invalidLogin = false;
  createLoginForm: FormGroup;
  submitted = false;
  otpSubmitted: boolean = false;
  accessdata: object = {};
  menuPermissionList:any[] = [];
  permissionList:any[] = [];

  showPassword = false;
  _passwordType = "password";

  showNewPassword = false;
  showconfirmPassword = false;
  _passwordconfirmType = "password";
  _passwordNewType = "password";

  usernameOTP = RadiusConstants.USERNAME;
  searchPartnerForm: FormGroup;
  changePasswordForm: FormGroup;
  loggedInUser: string;
  partnersDetails: any = [];
  captchaStatus: any = "";
  showOtpInput: boolean = false;

  captchaConfig: any = {
    type: 1,
    length: 6,
    cssClass: "captcha",
    back: {
      stroke: "darkblue"
    },
    font: {
      color: "#000000",
      size: "35px"
    }
  };
  loginEnable: boolean = RadiusConstants.LOGIN_CAPTCHA === "false" ? false : true;
  captchaError: any;
  captchaSuccess: any;
  resendOTP: boolean = true;
  otpCountDown = 60;
  subscription: Subscription;
  obs$ = interval(1000);
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authservice: AuthenticationService,
    private loginService: LoginService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    // private primengConfig: PrimeNGConfig,
    // private captchaService: NgxCaptchaService,
    private titleService: Title
  ) {
    // this.captchaService.captchStatus.subscribe(status => {
    //   this.captchaStatus = status;
    //   if (status == false) {
    //     this.loginEnable = true;
    //     this.captchaError = "Captcha Mismatch";
    //   } else if (status == true) {
    //     this.loginEnable = false;
    //     this.captchaError = null;
    //     this.captchaSuccess = "Matched Successfully!";
    //   }
    // });
    this.loginService.logout();
  }

  ngOnInit(): void {
    this.loginEnable = RadiusConstants.LOGIN_CAPTCHA.toLowerCase() === "false" ? false : true;
    this.captchaSuccess = "";
    this.captchaError = "";
    this.titleService.setTitle(TITLE);
    localStorage.setItem("hostName", window.location.hostname);
    // this.primengConfig.ripple = true;
    this.createLoginForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
      otp: [""]
    });

    this.accessdata = {
      template: {
        screenId: 16,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "template"
      },
      isCommonServiceAccessible: true,
      wlanGroup: {
        screenId: 22,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "wlanGroup"
      },
      role: {
        screenId: 24,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "role"
      },
      voucher: {
        screenId: 2,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "voucher"
      },
      getAllConnectedUser: {
        screenId: 39,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "getAllConnectedUser"
      },
      concurrent: {
        screenId: 26,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "concurrent"
      },
      cdrs: {
        screenId: 8,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "cdrs"
      },
      isRadiusServiceAccessible: true,
      radiusTemplate: {
        screenId: 29,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "radiusTemplate"
      },
      getAverageSessionTimeByDate: {
        screenId: 38,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "getAverageSessionTimeByDate"
      },
      audit: {
        screenId: 12,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "audit"
      },
      timeBasePolicy: {
        screenId: 30,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "timeBasePolicy"
      },
      sms: {
        screenId: 20,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "sms"
      },
      coadm: {
        screenId: 13,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "coadm"
      },
      radiusGroup: {
        screenId: 5,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "radiusGroup"
      },
      getAuthFailureData: {
        screenId: 40,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "getAuthFailureData"
      },
      plan: {
        screenId: 1,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "plan"
      },
      email: {
        screenId: 19,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "email"
      },
      locationMaster: {
        screenId: 32,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "locationMaster"
      },
      wifiCustomer: {
        screenId: 4,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "wifiCustomer"
      },
      isControllerServiceAccessible: true,
      radiusDevice: {
        screenId: 15,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "radiusDevice"
      },
      dbMapping: {
        screenId: 27,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "dbMapping"
      },
      wifiTemplate: {
        screenId: 28,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "wifiTemplate"
      },
      profile: {
        screenId: 14,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "profile"
      },
      reseller: {
        screenId: 31,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "reseller"
      },
      countUser: {
        screenId: 41,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "countUser"
      },
      isWifiServiceAccessible: true,
      otp: {
        screenId: 3,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "otp"
      },
      liveUsers: {
        screenId: 9,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "liveUsers"
      },
      staff: {
        screenId: 25,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "staff"
      },
      topSubscribePlan: {
        screenId: 42,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "topSubscribePlan"
      },
      radiusClient: {
        screenId: 6,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "radiusClient"
      },
      proxy: {
        screenId: 10,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "proxy"
      },
      qosPolicy: {
        screenId: 33,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "qosPolicy"
      },
      voucherbatch: {
        screenId: 34,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "voucherbatch"
      },
      isNotificationServiceAccessible: true,
      isDashboardAccessible: true,
      dictionary: {
        screenId: 11,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "dictionary"
      },
      emailConfiguration: {
        screenId: 17,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "emailConfiguration"
      },
      getDataForDailyConsumeGraph: {
        screenId: 36,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "getDataForDailyConsumeGraph"
      },
      radiusCustomer: {
        screenId: 7,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "radiusCustomer"
      },
      wlan: {
        screenId: 21,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "wlan"
      },
      smsConfiguration: {
        screenId: 18,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "smsConfiguration"
      },
      device: {
        screenId: 23,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "device"
      },
      deviceGroup: {
        screenId: 35,
        readAccess: true,
        createUpdateAccess: true,
        deleteAccess: true,
        screenName: "deviceGroup"
      }
    };

    this.changePasswordForm = this.fb.group(
      {
        username: [""],
        newPassword: ["", [Validators.required]],
        otp: ["", [Validators.required]],
        confirmNewPassword: ["", [Validators.required]]
      },
      {
        validator: MustMatch("newPassword", "confirmNewPassword")
      }
    );

    this.searchPartnerForm = this.fb.group({
      userName: ["", [Validators.required]]
    });

    this.loginService.logout();
  }

  async login() {
    this.submitted = true;
    if (this.captchaSuccess === "" && this.loginEnable) {
      this.captchaError = "Please verify the captcha.";
      return;
    }
    let staffImg;
    if (this.createLoginForm.valid) {
      this.loginService.generateToken(this.createLoginForm.value).subscribe(
        (response: any) => {
          console.log('login resoponese', response)
          // if (response.partnerId == "1" || response.partnerId == null) {
          localStorage.setItem("loggedInUser", response.fullName);
          localStorage.setItem("userId", response.userId);
          localStorage.setItem("partnerId", response.partnerId);
          //localStorage.setItem('mvnoId', response.mvnoId);
          localStorage.setItem("mvnoId", response.mvnoId);
          localStorage.setItem("userRoles", response.userRoles);
          localStorage.setItem("serviceArea", response.serviceAreaIdList);
          // console.log("this.accessdata.access", response);
          localStorage.setItem("accessData", JSON.stringify(this.accessdata));
          //   this.loginService.loginUser(response.accessToken);
          localStorage.setItem("token", response.accessToken);
          localStorage.setItem("mvnoName", response.mvnoName);
          this.loginService.getAclEntry();
          localStorage.setItem("loginUserName", response.userName);
          localStorage.setItem("loginProfile", response.profileImage);
          this.getDemoGraphic();
          setTimeout(() => {
            this.getMenuStructure();
            //Todo need to remove below role operation method after acl done
            // this.getRoleOperations();
            this.getAllMenuData();
            this.router.navigate(["/home/dashbord"]);
          }, 1000);
          // this.checkRadiusServiceStatus()
          // this.checkNotificationServiceStatus()
          // } else {
          //
          //   localStorage.removeItem("loggedInUser");
          //   this.messageService.add({
          //     severity: "error",
          //     summary: "Error",
          //     detail: "Kindly use PWSC for Operation",
          //     icon: "far fa-times-circle",
          //   });
          // }
        },
        (error: any) => {
          localStorage.removeItem("loggedInUser");
          this.messageService.add({
            severity: "error",
            summary: error.error.errorMessage,
            detail: "Try to Login With Correct Credentials!",
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }

  async checkLogin() {
    this.submitted = true;

    if (this.captchaSuccess === "" && this.loginEnable) {
      this.captchaError = "Please verify the captcha.";
      return;
    }

    if (this.createLoginForm.valid) {
      this.captchaSuccess = "";
      // Call the OTP generation API
      this.loginService
        .generateOtp(this.createLoginForm.value.username, this.createLoginForm.value.password)
        .subscribe(
          (response: any) => {
            this.resendOTP = true;
            this.otpCountDown = 60;
            if (response.status === 200) {
              // OTP generated successfully, show the OTP input field
              if (response.IsOTPRequired) {
                this.showOtpInput = true;
                this.createLoginForm.controls['otp'].setValidators([Validators.required]); // Make OTP required now
                this.createLoginForm.controls['otp'].updateValueAndValidity();
                this.subscription = this.obs$.subscribe(d => {
                  if (this.otpCountDown > 0) {
                    this.otpCountDown = this.otpCountDown - 1;
                  }
                  if (this.otpCountDown == 0) {
                    this.resendOTP = false;
                    this.subscription.unsubscribe();
                  }
                });
                this.messageService.add({
                  severity: "success",
                  summary: "Successfully",
                  detail: response.otp,
                  icon: "far fa-times-circle"
                });
              } else {
                this.login();
              }
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Failed to generate OTP. Please try again.",
                icon: "far fa-times-circle"
              });
            }
          },
          (error: any) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.ERROR,
              icon: "far fa-times-circle"
            });
          }
        );
    }
  }

  verifyOtp() {
    this.otpSubmitted = true;

    if (this.createLoginForm.valid) {
      // Call the login API with OTP verification
      this.loginService
        .verifyOtp(this.createLoginForm.value.username, this.createLoginForm.value.otp)
        .subscribe(
          (response: any) => {
            if (response.status === 200) {
              // Login successful
              this.login();
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Failed to verify OTP. Please try again.",
                icon: "far fa-times-circle"
              });
            }
          },
          (error: any) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.msg,
              icon: "far fa-times-circle"
            });
          }
        );
    }
  }

  async getDemoGraphic() {
    const url = `/getdemographicmapping`;
    this.loginService.getMethod(url).subscribe(
      (response: any) => {
        localStorage.setItem("demographic", JSON.stringify(response.demographicmappingtable));
        RadiusConstants.masterdata(response.demographicmappingtable);
      },
      (error: any) => {
        if (error.error.status == 404) {
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }
  // async checkRadiusServiceStatus() {
  //   this.loginService.getRadiusServiceStatus().subscribe(
  //     (response: any) => {
  //       console.log(response);
  //     },
  //     (error: any) => {
  //       this.messageService.add({
  //         severity: "error",
  //         summary: error.error.errorMessage,
  //         detail: "Radius service is down please contact Administrator",
  //         icon: "far fa-times-circle",
  //       });
  //     }
  //   );
  // }

  // async checkNotificationServiceStatus() {
  //   this.loginService.getNotificationServiceStatus().subscribe(
  //     (response: any) => {
  //       console.log(response);
  //     },
  //     (error: any) => {
  //       this.messageService.add({
  //         severity: "error",
  //         summary: error.error.errorMessage,
  //         detail: "Keyanna Notification service is down please contact Administrator",
  //         icon: "far fa-times-circle",
  //       });
  //     }
  //   );
  // }

  // async checkTaskMgmtServiceStatus() {
  //   this.loginService.getTaskMgmtServiceStatus().subscribe(
  //     (response: any) => {
  //       console.log(response);
  //     },
  //     (error: any) => {
  //       this.messageService.add({
  //         severity: "error",
  //         summary: error.error.errorMessage,
  //         detail: "Keyanna Task Management service is down please contact Administrator",
  //         icon: "far fa-times-circle",
  //       });
  //     }
  //   );
  // }
  public getMenuStructure() {
    const url = "/acl/getMenuStructure";
    // this.menuPermissionList=[];
    this.loginService.getMethod(url).subscribe(
      (res: any) => {
        this.menuPermissionList = res.data.submenu;
        this.loginService.setMenuPermission(this.menuPermissionList);
        // console.log(this.menuPermissionList);
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

  public getRoleOperations() {
    const url = "/acl/getRoleOperations";
    this.permissionList = [];
    this.loginService.getMethod(url).subscribe(
      (res: any) => {
        this.permissionList = res.dataList;
        this.loginService.setUserRoleOperationPermission(this.permissionList);
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

  // OTP

  getOtp() {
    let data = {
      countryCode: this.partnersDetails.countryCode,
      emailId: this.partnersDetails.email,
      mobileNumber: this.partnersDetails.phone,
      profile: this.usernameOTP
    };

    this.loginService.getOTP(data).subscribe(
      (response: any) => {
        $("#getotp").modal("hide");
        $("#changePasswordModal").modal("show");
      },
      (error: any) => {
        if (error.error.errorMessage == "User is inactive") {
          this.messageService.add({
            severity: "error",
            summary: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: error.error.errorMessage,
            detail: "Try to Login With Correct Credentials!",
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }
  menuData:any;
  async getAllMenuData() {
    let url = `/acl/getAllMenu`;
    this.loginService.getMethod(url).subscribe(
      (response: any) => {
        this.menuData = response.data;
        localStorage.setItem("menuData", JSON.stringify(this.menuData));
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  async searchResellerByName() {
    if (this.searchPartnerForm.valid) {
      //
      let searchName = this.searchPartnerForm.controls['userName'].value;
      // this.loginService.SearchResellerName(searchName).subscribe(
      //   (response: any) => {
      //     this.partnersDetails = response.reseller;
      //     this.getOtp();
      //     this.searchPartnerForm.reset();
      //
      //   },
      //   (error: any) => {
      //     if (error.error.status == 404) {
      //       this.messageService.add({
      //         severity: "info",
      //         summary: "Info",
      //         detail: error.error.errorMessage,
      //         icon: "far fa-times-circle",
      //       });
      //
      //     } else {
      //       this.messageService.add({
      //         severity: "error",
      //         summary: "Error",
      //         detail: error.error.errorMessage,
      //         icon: "far fa-times-circle",
      //       });
      //
      //     }
      //   }
      // );
    }
  }

  //change password
  passwordData = {
    newPassword: "",
    confirmNewPassword: "",
    username: ""
  };

  mapChangePasswordFormDataWithObject() {
    this.passwordData.newPassword = this.changePasswordForm.value.newPassword;
    this.passwordData.confirmNewPassword = this.changePasswordForm.value.confirmNewPassword;
    this.passwordData.username = this.partnersDetails.username;
  }

  changePassword() {
    this.mapChangePasswordFormDataWithObject();

    this.loginService.changePassword(this.passwordData).subscribe(
      (response: any) => {
        $("#changePasswordModal").modal("hide");
        this.changePasswordForm.reset();
        this.partnersDetails = [];
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  validateOTPChangePassword() {
    let data = {
      emailId: this.partnersDetails.email,
      mobileNumber: this.partnersDetails.phone,
      otp: this.changePasswordForm.value.otp
    };

    this.loginService.validateOTP(data).subscribe(
      (response: any) => {
        this.changePassword();
        this.changePasswordForm.reset();
      },
      (error: any) => {
        if (error.error.errorMessage == "User is inactive") {
          this.messageService.add({
            severity: "error",
            summary: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: error.error.errorMessage,
            detail: "Try to Login With Correct Credentials!",
            icon: "far fa-times-circle"
          });
        }

        $("#changePasswordModal").modal("show");
      }
    );
  }

  resendotp() {
    this.createLoginForm.controls['otp'].clearValidators();
    this.createLoginForm.controls['otp'].updateValueAndValidity();
    if (this.createLoginForm.valid) {
      this.loginService
        .generateOtp(this.createLoginForm.value.username, this.createLoginForm.value.password)
        .subscribe(
          (response: any) => {
            this.resendOTP = true;
            this.otpCountDown = 60;
            if (response.status === 200) {
              // OTP generated successfully, show the OTP input field
              if (response.IsOTPRequired) {
                this.showOtpInput = true;
                this.createLoginForm.controls['otp'].setValidators([Validators.required]); // Make OTP required now
                this.createLoginForm.controls['otp'].updateValueAndValidity();
                this.subscription = this.obs$.subscribe(d => {
                  if (this.otpCountDown > 0) {
                    this.otpCountDown = this.otpCountDown - 1;
                  }
                  if (this.otpCountDown == 0) {
                    this.resendOTP = false;
                    this.subscription.unsubscribe();
                  }
                });
                this.messageService.add({
                  severity: "success",
                  summary: "Successfully",
                  detail: response.otp,
                  icon: "far fa-times-circle"
                });
              }
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Failed to generate OTP. Please try again.",
                icon: "far fa-times-circle"
              });
            }
          },
          (error: any) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Failed to generate OTP. Please try again.",
              icon: "far fa-times-circle"
            });
          }
        );
    }
  }
}
