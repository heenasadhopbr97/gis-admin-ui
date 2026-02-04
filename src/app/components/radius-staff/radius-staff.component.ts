import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StaffService } from "src/app/service/staff.service";
import { StaffService as RadiusStaffService } from "src/app/components/radius-staff/staff.service";
import { RoleService } from "src/app/service/role.service";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { IStaff } from "src/app/components/model/staff";
import { countries } from "src/app/components/model/country";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { BranchManagementService } from "../branch-management/branch-management.service";
import { Observable, Observer } from "rxjs";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { isEqual } from "lodash";
import { TacacsDeviceGroupService } from "src/app/service/tacacs-device-group.service";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";
import { SETTINGS, TACACS } from "src/app/constants/aclConstants";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { StatusCheckService } from "src/app/service/status-check-service.service";
import { WhiteeSpaceValidator } from "../shared/custom-validators";
import { ToastrService } from "ngx-toastr";

declare var $: any;

@Component({
    selector: "app-radius-staff",
    templateUrl: "./radius-staff.component.html",
    styleUrls: ["./radius-staff.component.css"],
    standalone: false
})
export class RadiusStaffComponent implements OnInit {
  profile_picture: any;
  fileToUpload: any;
  imageUrl: any;
  createAccess: boolean = false;
  changePassAccess: boolean = false;
  createReceiptAccess: boolean = false;
  tacacsAccess: boolean = false;
  editAccess: boolean = false;
  profileImg: any;
  currentUserIdentityKey: any;
  staffUserList: any;
  profileChange: any = [];
  constructor(
    private staffService: StaffService,
    private radiusStaffService: RadiusStaffService,
    private roleService: RoleService,
    private radiusUtility: RadiusUtility,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public commondropdownService: CommondropdownService,
    public KeyannaCommonBaseService: KeyannaCommonBaseService,
    public branchManagementService: BranchManagementService,
    private sanitizer: DomSanitizer,
    private tacacsService: TacacsDeviceGroupService,
    private customerManagementService: CustomermanagementService,
    public statusCheckService: StatusCheckService,
    private toastr: ToastrService,
    loginService: LoginService
  ) {
    this.createAccess = loginService.hasPermission(SETTINGS.STAFF_CREATE);
    this.changePassAccess = loginService.hasPermission(SETTINGS.STAFF_CHANGE_PASSWORD);
    this.editAccess = loginService.hasPermission(SETTINGS.STAFF_EDIT);
    this.createReceiptAccess = loginService.hasPermission(SETTINGS.STAFF_CREATE_RECEIPT);
    this.tacacsAccess = loginService.hasPermission(TACACS.TACACS);
    this.loginService = loginService;
    this.editMode = !this.createAccess && this.editAccess ? true : false;
  }

  staffImg: SafeResourceUrl;
  countries: any = countries;
  radiusWalletGroupForm: FormGroup;
  paymentReciptForm: FormGroup;
  staffGroupForm: FormGroup;
  searchStaffForm: FormGroup;
  changePasswordForm: FormGroup;
  submitted = false;
  mobileError: boolean = false;
  searchSubmitted = false;
  staffData: any = [];
  //   isUserAdmin: boolean = false;
  currentPage = 1;
  itemsPerPage: number = RadiusConstants.ITEMS_PER_PAGE;
  totalRecords: number;

  editStaffId: number = null;
  editData: IStaff;
  editMode = false;
  changeStatusData: any = [];
  statusMsg = "";
  roles: any[];
  selectedRoles: any[];
  loggedInUser = "";
  currentPageMvno = 1;
  mvnoitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  mvnototalRecords: any;
  parentStaffView = false;
  parentStaffList: any = [];
  searchData: any = [];
  searchDeatil: any = "";
  UserData: any;
  userName: "";
  AclClassConstants:any;
  AclConstants:any;

  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 1;
  searchkey: string;
  totalDataListLength = 0;

  public loginService: LoginService;
  staffListDatalength = 0;

  showPassword = false;
  _passwordType = "password";
  showNewPassword = false;
  showOLDPassword = false;
  _passwordOLDType = "password";
  _passwordNewType = "password";
  businessUnitIdsList: any = [];
  selServiceAreaId: any;

  satffUserData: any = [];
  isStaffPersonalData = false;
  isStaffReceiptData = false;

  currentReceiptPage = 1;
  itemsReceiptPerPage: number = RadiusConstants.ITEMS_PER_PAGE;
  totalReceiptRecords: number;

  searchOptionSelect = [
    { label: "Global Search Filter", value: "globalsearch" },
    { label: "Reciept No", value: "reciept" }
  ];
  inputMobile: string;
  enteredMobilelength: string;
  ifgenerateOtpField = true;
  userNameForPasswordUpdate = "";
  mvnoIdForPwdChange = "";
  staffPhoneNumber = "";
  staffCountryCode = "";
  staffOTPValue = "";
  branchData: any;
  TacacsDeviceList: any[];

  uploadDocForm: FormGroup;

  isShowStaffMenu = false;
  isStaffList = true;
  isStaffCreateOrEdit = false;
  ifWalletStaffShow = false;

  isPasswordShow = false;

  userForm: FormGroup;
  statusList: any[] = [
    { value_field: "ACTIVE", display_field: "Active" },
    // { value_field: "BLOCKED", display_field: "Blocked" },
    { value_field: "INACTIVE", display_field: "In Active" },
    // { value_field: "REGISTERED", display_field: "Registered" },
    { value_field: "TERMINATED", display_field: "Terminated" }
  ];
  teams: any[] = [];
  roleList: any[] = [{ id: "", rolename: "" }];
  loggedInUserRoleList: any[] = [{ id: "", rolename: "" }];

  staffreciptMappingList: any = [];
  openStaffID = "";

  getWallatData: any;
  WalletAmount: any;

  searchOption = "globalsearch";
  prefikx = "";

  branchList: any = [];

  passwordData = {
    username: "",
    newPassword: "",
    confirmNewPassword: ""
  };
  businessData: any;

  staffRecepetId = "";

  searchReceptNumber = "";

  bankDataList: any = [];

  itemsLegderPerPage = RadiusConstants.ITEMS_PER_PAGE;
  currentLegderPage = 1;
  totalLegderRecords: string;
  staffLegderData: any = [];
  staffEmail = "";
  userId = localStorage.getItem("userId");
  mvnoId = localStorage.getItem("mvnoId");
  usernamee: string = "";

// Area mapping fields
country: any[] = [];
states: any[] = [];
districts: any[] = [];

selectedCountry: any;
selectedState: any;
selectedDistrict: any;

showAreaMappingDialog = false;
areaMappingList: any[] = []; 

selectedLevel: 'country' | 'state' | 'district' = 'country';
showCountryDropdown = true;
showStateDropdown = false;
showDistrictDropdown = false;
pendingAreaMapping: any = null;

  ngOnInit(): void {
    this.commondropdownService.getsystemconfigList();
    this.usernamee = "@" + localStorage.getItem("mvnoName");
    this.getAll("");
    this.getAllRole();
    this.staffUserData(this.userId);
    if (this.statusCheckService.isActiveTacacs) {
      this.gettacacsALGData();
    }
    // this.getALlBUData();
    this.getAllBranch();
    this.getBankDetail();
    this.searchOption = "globalsearch";
    this.staffService.getAllRoleData().subscribe(result => {
      this.roleList = result.dataList;
    });
    this.staffService.getAllRoleDataForLoggedInUser().subscribe(result => {
      this.loggedInUserRoleList = result.dataList;
    });
    this.staffService.getTeamsData().subscribe(result => {
      this.teams = result.dataList;
    });
    const serviceArea = localStorage.getItem("serviceArea");
    const serviceAreaArray = JSON.parse(serviceArea);
    if (serviceAreaArray.length !== 0) {
      this.commondropdownService.getserviceAreaListForCafCustomer();
      this.commondropdownService.filterPartnerAll();
    } else {
      this.commondropdownService.getserviceAreaListForCafCustomer();
      this.commondropdownService.getpartnerAll();
    }
    this.searchStaffForm = this.fb.group({
      username: [""]
    });

    // this.staffGroupForm = new FormGroup({
    //   username: new FormControl('', [Validators.required]),
    //   password: new FormControl(''),
    //   email: new FormControl('', [Validators.required]),
    //   roleIds: new FormControl(null, [Validators.required]),
    //   serviceAreaId: new FormControl(null, [Validators.required]),
    //   firstname: new FormControl('', [Validators.required]),
    //   lastname: new FormControl('', [Validators.required]),
    //   teamIds: new FormControl(null, [Validators.required]),
    //   status: new FormControl(null, [Validators.required]),
    //   phone: new FormControl('', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    //   parentStaffId: new FormControl(''),
    //   partnerid: new FormControl(''),
    //   mvnoid: new FormControl('', [Validators.required]),
    // });

    this.paymentReciptForm = this.fb.group({
      prefix: ["", Validators.required],
      receiptFrom: ["", Validators.required],
      receiptTo: ["", Validators.required]
    });

    this.staffGroupForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
      email: ["", [Validators.required, Validators.email]],
      roleIds: ["", Validators.required],
      // serviceAreaId: [''],
      serviceAreaIdsList: [],
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      teamIds: [""],
      status: ["", Validators.required],
      parentStaffId: [""],
      partnerid: ["", Validators.required],
      phone: ["", Validators.required],
      businessUnitIdsList: [""],
      mvnoid: [""],
      countryCode: [""],
      branchId: [""],
      staffUserServiceMappingList: [],
      file: [""],
      hrmsId: [""],
      tacacsAccessLevelGroup: [""]
    });

    this.radiusWalletGroupForm = this.fb.group({
      date: ["", Validators.required],
      amount: ["", Validators.required],
      bankId: ["", Validators.required],
      remarks: ["", Validators.required]
    });

    this.loggedInUser = localStorage.getItem("loggedInUser");

    this.changePasswordForm = this.fb.group({
      userName: [""],
      // oldPassword: ["", Validators.required],
      newPassword: ["", [Validators.required]]
    });
    this.searchData = {
      filters: [
        {
          filterColumn: "any",
          filterCondition: "and",
          filterDataType: "",
          filterOperator: "equalto",
          filterValue: "",
          port: "",
          salesRepresentative: "",
          serviceArea: "",
          serviceNetwork: "",
          slot: ""
        }
      ],
      page: this.currentPage,
      pageSize: this.itemsPerPage
    };
  }
  openStaffListMenu() {
    this.isStaffCreateOrEdit = false;
    this.isStaffList = true;

    this.parentStaffView = false;
    this.isPasswordShow = false;
    this.isStaffPersonalData = false;
    this.isStaffReceiptData = false;
    this.isShowStaffMenu = false;
    this.ifWalletStaffShow = false;
    // this.getAll("");
  }

  openStaffCreateMenu() {
    this.parentStaffList = [];
    this.staffGroupForm.controls['password'].enable();
    this.editMode = false;
    this.isStaffList = false;
    this.isStaffCreateOrEdit = true;
    this.parentStaffView = false;
    this.isPasswordShow = false;
    this.isStaffPersonalData = false;
    this.isStaffReceiptData = false;
    this.isShowStaffMenu = false;
    this.ifWalletStaffShow = false;

      // Clear area mapping dialog data
    this.areaMappingList = [];
    this.selectedCountry = null;
    this.selectedState = null;
    this.selectedDistrict = null;
    this.selectedLevel = 'country';
    this.showCountryDropdown = true;
    this.showStateDropdown = false;
    this.showDistrictDropdown = false;
    this.pendingAreaMapping = null;

    this.imageUrl = "";
    this.clearFormData();
    this.staffGroupForm.patchValue({
      countryCode: this.commondropdownService.commonCountryCode
    });
    this.staffGroupForm.controls['roleIds'].setValue(this.loggedInUserRoleList[0]?.id);
    this.staffGroupForm.patchValue({
      roleIds: this.loggedInUserRoleList[0].id
    });
    this.businessData.forEach((element:any) => {
      element.flag = false;
    });
    this.staffGroupForm.controls['firstname'].enable();
    this.staffGroupForm.controls['lastname'].enable();
    this.staffGroupForm.controls['username'].enable();
    this.staffGroupForm.controls['parentStaffId'].disable();
  }

  onKeymobilelength(event:any) {
    const str = this.staffGroupForm.value.phone.toLocaleString();
    const withoutCommas = str.replace(/,/g, "");
    const strrr = withoutCommas.trim();
    const mobilenumberlength = this.commondropdownService.commonMoNumberLength;
    if (Number.isNaN(mobilenumberlength)) {
      this.mobileError = false;
    } else if (strrr.length > Number(mobilenumberlength)) {
      this.inputMobile = `${mobilenumberlength}`;
      this.enteredMobilelength = strrr.length;
      this.mobileError = false;
    } else if (strrr.length == Number(mobilenumberlength)) {
      this.inputMobile = "";
      this.enteredMobilelength = "";
      this.mobileError = false;
    } else {
      this.inputMobile = `${mobilenumberlength}`;
      this.enteredMobilelength = strrr.length;
      this.mobileError = false;
    }
  }
  staffDetialsOpen(id:any) {
    this.isStaffCreateOrEdit = false;
    this.isStaffList = false;
    this.isStaffPersonalData = true;

    this.parentStaffView = false;
    this.isPasswordShow = false;
    this.isStaffReceiptData = false;
    this.isShowStaffMenu = true;
    this.ifWalletStaffShow = false;

    this.openStaffID = id;
    this.staffService.getStaffUserData(id).subscribe((response: any) => {
      this.satffUserData = response.Staff;
      this.staffreciptMappingList = this.satffUserData.staffUserServiceMappingList;

      this.staffImg = this.sanitizer.bypassSecurityTrustResourceUrl(
        `data:image/png;base64, ${this.satffUserData.profileImage}`
      );
    });
  }

  openStaffStaffReceipt() {
    this.isStaffCreateOrEdit = false;
    this.isStaffList = false;
    this.isStaffPersonalData = false;
    this.isStaffReceiptData = true;

    this.parentStaffView = false;
    this.isPasswordShow = false;
    this.isShowStaffMenu = true;
    this.ifWalletStaffShow = false;
  }
  openStaffWallet() {
    this.isStaffCreateOrEdit = false;
    this.isStaffList = false;
    this.isStaffPersonalData = false;
    this.isStaffReceiptData = false;

    this.parentStaffView = false;
    this.isPasswordShow = false;
    this.isShowStaffMenu = true;
    this.ifWalletStaffShow = true;

    const url = "/staff_ledger_details/walletAmount/" + this.openStaffID;
    this.staffService.getFromCMS(url).subscribe((response: any) => {
      this.getWallatData = response;
      this.WalletAmount = response.availableAmount;
    });

    this.getstaffLegderData();
  }

  serviceAreaEvent(event:any) {
    this.parentStaffList = [];
    this.staffGroupForm.value.parentStaffId = "";
    this.parentStaffView = false;
    const serviceArea_ID = event.value;
    const seviceAreaData: any = [];
    //
    if (serviceArea_ID.length > 0) {
      this.staffGroupForm.controls['parentStaffId'].enable();
    } else {
      this.staffGroupForm.controls['parentStaffId'].disable();
    }

    this.staffService.getAllStaff().subscribe((response: any) => {
      const staffData = response.staffUserlist;

      serviceArea_ID.forEach((element:any) => {
        staffData.forEach((data:any) => {
          data.serviceAreaIdsList.forEach((serviceAreaID:any) => {
            if (element == serviceAreaID) {
              seviceAreaData.push(data);
              this.parentStaffList = seviceAreaData.filter(
                (staf:any) => staf.username !== this.staffGroupForm.value.username
              );
            }
            if (this.parentStaffList.length !== 0) {
              this.parentStaffView = true;
            }
          });
        });
      });
      //       const uniqueNames = [];
      //       for (let i = 0; i < this.parentStaffList.length; i++) {
      //         if (uniqueNames.indexOf(this.parentStaffList[i]) === -1) {
      //           uniqueNames.push(this.parentStaffList[i]);
      //         }
      //       }
      var uniqueNames = [];
      for (const item of this.parentStaffList) {
        const found = uniqueNames.some(value => isEqual(value, item));
        if (!found) {
          uniqueNames.push(item);
        }
      }
      this.parentStaffList = uniqueNames;
      console.log(this.parentStaffList, "ParentStaff");
    });

    this.getbranchByServiceAreaID(serviceArea_ID);
  }

  staffAutofieldValue(data:any) {
    this.parentStaffList = [];
    this.staffGroupForm.value.parentStaffId = "";
    this.parentStaffView = false;
    const serviceArea_ID = data;
    const seviceAreaData: any = [];
    if (serviceArea_ID.length > 0) {
      this.staffGroupForm.controls['parentStaffId'].enable();
    } else {
      this.staffGroupForm.controls['parentStaffId'].disable();
    }

    this.staffService.getAllStaff().subscribe((response: any) => {
      const staffData = response.staffUserlist;
      serviceArea_ID.forEach((element:any) => {
        staffData.forEach((data:any) => {
          data.serviceAreaIdsList.forEach((serviceAreaID:any) => {
            if (element == serviceAreaID) {
              seviceAreaData.push(data);
              this.parentStaffList = seviceAreaData.filter(
                (staf:any) => staf.username !== this.staffGroupForm.value.username
              );
            }

            if (this.parentStaffList.length !== 0) {
              this.parentStaffView = true;
            }
          });
        });
      });
      var uniqueNames = [];
      for (const item of this.parentStaffList) {
        const found = uniqueNames.some(value => isEqual(value, item));
        if (!found && item.id != this.editStaffId) {
          uniqueNames.push(item);
        }
      }
      this.parentStaffList = uniqueNames;
      // console.log("ParentStaff :::: ", this.parentStaffList);
    });
  }
  getbranchByServiceAreaID(ids:any) {
    let data = [];
    data = ids;
    const url = "/branchManagement/getAllBranchesByServiceAreaId";
    this.KeyannaCommonBaseService.post(url, data).subscribe((response: any) => {
      this.branchData = response.dataList;
    });
  }
  searchStaffData() {
    if (this.searchOption == "reciept") {
      this.searchReceiptName();
    } else {
      this.searchStaffByName();
    }
  }
  async searchStaffByName() {
    if (!this.searchkey || this.searchkey !== this.searchData) {
      this.currentPage = 1;
    }
    this.searchkey = this.searchData;
    if (this.showItemPerPage == 1) {
      this.itemsPerPage = this.pageITEM;
    } else {
      this.itemsPerPage = this.showItemPerPage;
    }

    this.searchData.filters[0].filterValue = this.searchDeatil.trim();
    this.staffService.staffSearch(this.searchData).subscribe(
      (response: any) => {
        //
        this.staffData = response.dataList;
        this.totalRecords = response.totalRecords;
      },
      (error: any) => {
        this.totalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.staffData = [];
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }

  searchReceiptName() {
    if (!this.searchkey || this.searchkey !== this.searchDeatil) {
      this.currentPage = 1;
    }
    if (this.itemsPerPage == 1) {
      this.itemsPerPage = this.pageITEM;
    }

    const receNo = this.searchDeatil;
    const prefix = this.prefikx ? this.prefikx.trim() : "";
    const data = {};
    this.staffService.staffReceiptSearch(receNo, prefix, data).subscribe(
      (response: any) => {
        this.staffData = response.dataList;
        this.totalReceiptRecords = this.staffreciptMappingList.length;
        this.searchData = [];
      },
      (error: any) => {
        this.totalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.staffData = [];
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }

  addStaff() {
    this.submitted = true;
    if (this.enteredMobilelength != this.inputMobile) {
      this.submitted = false;
      this.mobileError = true;
    }
    if (this.staffGroupForm.valid && this.submitted) {
      //   const mvno = localStorage.getItem("mvnoName");

      if (this.editMode) {
        this.updateStaff();
      } else {
        this.addNewStaff();
      }
    } else {
      console.log("invalida");
    }
  }

  private addNewStaff() {
    this.staffGroupForm.controls['password'].enable();
    if (this.staffGroupForm.valid) {
      if (
        this.staffGroupForm.value.countryCode == "" ||
        this.staffGroupForm.value.countryCode == null
      ) {
        this.staffGroupForm.value.countryCode = this.commondropdownService.commonCountryCode;
      }
      const data = this.staffGroupForm.value;
      data.roleIds = [];
      data.roleIds.push(this.staffGroupForm.controls['roleIds'].value);
      data.username = this.staffGroupForm.controls['username'].value + this.usernamee;
      this.staffService.add(data).subscribe(
        (response: any) => {
          this.uploadDocuments(response.staffuser.id);
          if (this.searchkey) {
            this.searchStaffData();
          } else {
            this.getAll("");
          }

          this.imageUrl = "";
          this.clearFormData();
          this.parentStaffList = [];

                  // Area mapping logic
        if (this.pendingAreaMapping) {
          this.pendingAreaMapping.assignedUserId = response.staffuser.id;
          this.radiusStaffService.areaMapping(this.pendingAreaMapping).subscribe({
            // next: (res) => this.toastr.success("Area mapping saved successfully"),
            // error: (err) => this.toastr.error("Error saving area mapping")
          });
          this.pendingAreaMapping = null; // Clear after use
        }

          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          this.loginService.refreshToken();
          this.loginService.getAclEntry();
          this.staffGroupForm.controls['password'].enable();
          this.isStaffCreateOrEdit = false;
          this.isStaffList = true;
          this.parentStaffView = false;
          this.isPasswordShow = false;
          this.submitted = false;
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

  private updateStaff() {
    this.staffGroupForm.controls['password'].disable();
    if (this.staffGroupForm.valid) {
      if (
        this.staffGroupForm.value.countryCode == "" ||
        this.staffGroupForm.value.countryCode == null
      ) {
        this.staffGroupForm.value.countryCode = this.commondropdownService.commonCountryCode;
      }
      this.editData = this.staffGroupForm.getRawValue();
      this.editData.staffId = this.editStaffId;
      this.editData.roleIds = [];
      this.editData.roleIds.push(this.staffGroupForm.controls['roleIds'].value);
      this.staffService.update(this.editData, this.editData.staffId).subscribe(
        (response: any) => {
          this.uploadDocuments(this.editStaffId);

          this.imageUrl = "";
          this.openStaffListMenu();
          if (this.searchkey) {
            this.searchStaffData();
          } else {
            this.getAll("");
          }
          this.loginService.refreshToken();
          this.loginService.getAclEntry();
          this.parentStaffList = [];
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          this.clearFormData();
          this.parentStaffView = false;
          this.isPasswordShow = false;
          this.editMode = false;

          this.businessData.forEach((element:any) => {
            this.editData.businessUnitIdsList.forEach(id => {
              if (element.id == id) {
                element.flag = false;
              }
            });
          });
          this.submitted = false;
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

  editStaffById(staff:any,i:any) {
    this.parentStaffList = [];
    this.imageUrl = "";
    this.editMode = true;
    this.isStaffList = false;
    this.isStaffCreateOrEdit = true;
    this.staffGroupForm.controls['password'].disable();
    this.isPasswordShow = true;

    this.editStaffId = staff.id;
    // index = this.radiusUtility.getIndexOfSelectedRecord(index, this.currentPage, this.itemsPerPage);
    if (staff) this.setBranchInEditStaff(staff.serviceAreasId, staff);
    if (staff.serviceAreaIdsList == null) {
      staff.serviceAreaIdsList = [];
      staff.serviceAreaNameList.forEach((element:any) => {
        staff.serviceAreaIdsList.push(element.id);
      });
    }
    if (staff.parentStaffId) {
      this.staffGroupForm.patchValue({
        parentStaffId: staff.parentStaffId,
        partnerid: staff.partnerid,
        file: staff.profileImage ? [{}] : ""
      });
      this.parentStaffView = true;
      this.staffAutofieldValue(staff.serviceAreaIdsList);
    } else {
      staff.parentStaffId = "";
      this.staffAutofieldValue(staff.serviceAreaIdsList);
    }

    const servicAreaId = staff.serviceAreaIdsList;
    // let staffServiceArea
    // staff.setServiceAreaIdsList as ArrayBuffer.forEach(element => {
    //   servicAreaId.push(element);
    // });
    // for (let k = 0; k < staff.serviceAreaNameList.length; k++) {
    //   servicAreaId.push(staff.serviceAreaNameList[k].id);
    // }

    if (staff.profileImage) {
      this.imageUrl = `data:image/jpeg;base64,${staff.profileImage}`;
    }
    staff.password = "";
    this.editData = staff;
    // console.log("this.editData", this.editData);
    this.staffGroupForm.patchValue(this.editData);
    staff.password = "";
    if (this.editData.businessUnitIdsList == null) {
      if (staff.businessUnitNameList != null) {
        staff.businessUnitIdsList = [];
        staff.businessUnitNameList.forEach((element:any) => {
          staff.businessUnitIdsList.push(element.id);
        });
      }
    }
    this.editData = staff;
    this.staffGroupForm.patchValue(this.editData);
    this.staffGroupForm.controls['roleIds'].patchValue(this.editData.roleIds[0]);
    this.staffGroupForm.patchValue({ serviceAreaIdsList: servicAreaId });
    this.getbranchByServiceAreaID(servicAreaId);
    this.staffGroupForm.controls['firstname'].enable();
    this.staffGroupForm.controls['lastname'].enable();
    this.staffGroupForm.controls['username'].disable();
    this.businessData.forEach((element:any) => {
      if (this.editData.businessUnitIdsList != null) {
        this.editData.businessUnitIdsList.forEach(id => {
          if (element.id == id) {
            element.flag = true;
          }
        });
      } else {
        element.flag = false;
      }
    });
  }

  deleteConfirm(staffId:any) {
    this.confirmationService.confirm({
      message: "Do you want to delete this Staff member?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.deleteStaffById(staffId);
      },
      reject: () => {
        this.messageService.add({
          severity: "info",
          summary: "Rejected",
          detail: "You have rejected"
        });
      }
    });
  }
  deleteStaffById(staffId:any) {
    this.staffService.delete(staffId).subscribe(
      (response: any) => {
        if (this.currentPage != 1 && this.staffData.length == 1) {
          this.currentPage = this.currentPage - 1;
        }

        if (this.staffData != 1 && this.staffListDatalength == 1) {
          this.staffData = this.staffData - 1;
        }

        if (this.searchkey) {
          this.searchStaffData();
        } else {
          this.getAll("");
        }
        this.openStaffListMenu();
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });

        this.clearFormData();
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

  clearSearchForm() {
    this.getAll("");
    this.searchDeatil = "";
    this.prefikx = "";
    this.searchOption = "globalsearch";

    this.openStaffListMenu();
  }

  clearFormData() {
    this.staffGroupForm.reset();
  }

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.getAll(this.showItemPerPage);
    } else {
      this.searchStaffData();
    }
  }

  getAll(list:any) {
    let size;
    this.searchkey = "";
    const pageList = this.currentPage;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      if (this.showItemPerPage == 1) {
        this.itemsPerPage = this.pageITEM;
      } else {
        this.itemsPerPage = this.showItemPerPage;
      }
    }

    const data = {
      page: this.currentPage,
      pageSize: this.itemsPerPage
    };
    // this.staffService.getAllStaff().subscribe(
    this.staffService.getAllStaffList(data).subscribe(
      (response: any) => {
        var mvnoId = Number(localStorage.getItem("mvnoId"));
        this.staffData = response.staffUserlist;
        this.totalRecords = response.pageDetails.totalRecords;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  getAllBranch() {
    this.commondropdownService.getMethodWithCache("/branchManagement/all").subscribe(
      (response: any) => {
        this.branchList = response.dataList;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getAllRole() {
    this.roleService.getAll().subscribe(
      (response: any) => {
        this.roles = response.roleList;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  pageChanged(pageNumber:any) {
    this.clearFormData();
    this.currentPage = pageNumber;
    if (this.searchkey) {
      this.searchStaffData();
    } else {
      this.getAll("");
    }
  }

  getCustomerDataForPasswordChange(staff:any) {
    this.ifgenerateOtpField = true;
    this.staffOTPValue = "";
    this.mvnoIdForPwdChange = staff.mvnoId;
    this.userNameForPasswordUpdate = staff.username;
    this.staffPhoneNumber = staff.phone;
    this.staffCountryCode = staff.countryCode;
    this.staffEmail = staff.email;
    this.changePasswordForm.patchValue({
      userName: this.userNameForPasswordUpdate
    });
  }

  mapChangePasswordFormDataWithObject() {
    this.passwordData.newPassword = this.changePasswordForm.value.newPassword;
    this.passwordData.confirmNewPassword = this.changePasswordForm.value.confirmNewPassword;
    this.passwordData.username = this.userNameForPasswordUpdate;
  }

  changePassword() {
    this.changePasswordForm.value.userName = this.userNameForPasswordUpdate;
    this.staffService.changePassword(this.changePasswordForm.value).subscribe(
      (response: any) => {
        $("#changePasswordModal").modal("hide");
        this.clearChangePasswordForm();
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
      },
      (error: any) => {
        this.messageService.add({
          severity: "info",
          summary: "Info",
          detail: error.error.msg,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  clearChangePasswordForm() {
    this.ifgenerateOtpField = true;
    this.staffOTPValue = "";
    this.changePasswordForm.controls['otp'].reset();
    //this.changePasswordForm.reset();
  }
  staffUserData(id:any) {
    if (id) {
      this.staffService.getStaffUserData(id).subscribe((response: any) => {
        this.UserData = response.Staff;
        this.userName = this.UserData.username;
        this.changePasswordForm.value.userName = this.userName;
        this.businessUnitIdsList = response.Staff.businessUnitIdsList;
        this.getALlBUData();
        // console.log("Username", this.UserData.username);
      });
    }
  }

  gettacacsALGData() {
    const url = "/tacacs-access-level-group/get-access-level-groups";
    let plandata = {
      page: 0,
      pageSize: 100
    };
    this.tacacsService.getMethod(url, { params: plandata }).subscribe((res: any) => {
      this.TacacsDeviceList = res.data.accessLevelGroup.content;
    });
  }

  getALlBUData() {
    const businessDataList: any = [];
    const userID = localStorage.getItem("userId");
    this.staffService.getBUFromStaff().subscribe(
      (response: any) => {
        this.businessData = response.dataList;
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
  addNewReceipt(data:any) {
    this.staffRecepetId = data.id;
    this.staffGroupForm.patchValue(data);
  }

  clearpaymentReciptForm() {
    this.staffRecepetId == "";
    this.paymentReciptForm.reset();
  }

  saveNewRecipt() {
    const staffUserServiceMappingList = {
      fromreceiptnumber: this.paymentReciptForm.value.receiptFrom,
      id: "",
      identityKey: "",
      isActive: true,
      isDeleted: true,
      mvnoId: "",
      prefix: this.paymentReciptForm.value.prefix,
      stfmappingId: this.staffRecepetId,
      toreceiptnumber: this.paymentReciptForm.value.receiptTo
    };

    this.customerManagementService.addNewReceipt(staffUserServiceMappingList).subscribe(
      (response: any) => {
        if (this.searchkey) {
          this.searchStaffData();
        } else {
          this.getAll("");
        }
        $("#paymentReciptModal").modal("hide");
        this.clearFormData();
        this.parentStaffList = [];
        this.clearpaymentReciptForm();
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
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

  pageReceiptChanged(pageNumber:any) {
    this.currentReceiptPage = pageNumber;
  }
  clearReceiptForm() {
    this.searchReceptNumber = "";
    this.staffreciptMappingList = this.satffUserData.staffUserServiceMappingList;
  }
  getBankDetail() {
    const url = "/bankManagement/searchByStatus";
    this.KeyannaCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.bankDataList = response.dataList;
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  showWithdrawalAmountModel() {
    $("#staffWalletModal").modal("show");
  }

  clearWalletStaffForm() {
    this.radiusWalletGroupForm.reset();
  }
  saveManageBalance() {
    let data: any = [];
    const data1 = this.radiusWalletGroupForm.value;

    data = {
      action: "",
      amount: this.radiusWalletGroupForm.value.amount,
      bankId: this.radiusWalletGroupForm.value.bankId,
      date: this.radiusWalletGroupForm.value.date,
      remarks: this.radiusWalletGroupForm.value.remarks,
      // transactionType: "DR",
      buId: "",
      creditDocId: "",
      custId: "",
      id: this.openStaffID,
      identityKey: "",
      mvnoId: "",
      paymentMode: ""
      // staffUser: {
      //   id: this.openStaffID,
      // },
    };

    const url = "/staff_ledger_details/transferredToBank";
    this.staffService.postApiMethod(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else if (response.responseCode == 405) {
          this.radiusWalletGroupForm.reset();
          $("#staffWalletModal").modal("hide");

          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.radiusWalletGroupForm.reset();
          $("#staffWalletModal").modal("hide");

          this.openStaffWallet();

          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
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

  pageLegderChanged(e:any) {
    this.currentLegderPage = e;
  }
  getstaffLegderData() {
    const url = "/staff_ledger_details/getStaffLedgerDetailsbyStaffId/" + this.openStaffID;
    this.staffService.getFromCMS(url).subscribe(
      (response: any) => {
        this.staffLegderData = response.dataList;
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  canExit() {
    if (!this.staffGroupForm.dirty) {
      return true;
    }
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
          }
        });
        return false;
      });
    }
  }

  // generate OTP
  genrateOtp() {
    this.staffOTPValue = "";
    const data = {
      countryCode: this.staffCountryCode,
      mobileNumber: this.staffPhoneNumber,
      emailId: this.staffEmail,
      profile: "OTP"
    };

    const url = "/otp/generate";

    this.staffService.postApiFromCMS(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else if (response.responseCode == 405) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.otp,
            icon: "far fa-check-circle"
          });
        }
      },
      (error: any) => {
        if (error.status == 200) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.ERROR,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
        console.log(error, "error");
      }
    );
  }

  // Validate OTP
  ValidOtp() {
    const data = {
      mobileNumber: this.staffPhoneNumber,
      emailId: this.staffEmail,
      otp: this.staffOTPValue
    };

    const url = "/otp/validate";

    this.staffService.postApiFromCMS(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.ifgenerateOtpField = true;

          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.ifgenerateOtpField = false;

          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
        }
      },
      (error: any) => {
        if (error.status == 200) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.ERROR,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
        }
        console.log(error, "error");
      }
    );
  }

  uploadDocuments(uploadDocStaffId: any) {
    this.submitted = true;
    const formData = new FormData();
    let fileArray: FileList;

    if (this.staffGroupForm.value.file) {
      // if (this.staffGroupForm.controls.file.value.length > 0) {
      console.log(
        "this.staffGroupForm.controls.file.value :::: ",
        this.staffGroupForm.controls['file'].value
      );

      fileArray = this.staffGroupForm.controls['file'].value;
      formData.append("file", fileArray[0]);
      const url = `/staff/uploadProfileImage?staffId=${uploadDocStaffId}`;
      this.staffService.postApiMethod(url, formData).subscribe(
        (response: any) => {
          this.submitted = false;
          //   this.messageService.add({
          //     severity: "success",
          //     summary: "Successfully",
          //     detail: response.message,
          //     icon: "far fa-check-circle",
          //   });
          if (this.searchkey) {
            this.searchStaffData();
          } else {
            this.getAll("");
          }
          $("#uploadDocumentId").modal("hide");
          this.staffService.getStaffUserProfile(this.userId).subscribe((response: any) => {
            this.profileImg = response.data;
            this.staffService.staffImg = this.sanitizer.bypassSecurityTrustResourceUrl(
              `data:image/png;base64, ${response.data}`
            );
          });
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
      // }
    } else {
    }
  }

  onFileChangeUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
  
    const files: FileList = input.files;
    console.log("files :::: ", files);
  
    const selectedFile = files.item(0);
    if (!selectedFile) {
      return;
    }
  
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Only JPEG and PNG files are allowed.");
      return;
    }
  
    const maxSize = 2097152; // 2MB
    if (selectedFile.size > maxSize) {
      alert("File size cannot exceed 2MB.");
      return;
    }
  
    this.staffGroupForm.patchValue({
      file: files
    });
  
    this.fileToUpload = selectedFile;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imageUrl = e.target.result;
    };
    reader.readAsDataURL(selectedFile);
  }
  

  setBranchInEditStaff(ids:any, staffBranch: any) {
    let data = [];
    data = ids;
    const url = "/branchManagement/getAllBranchesByServiceAreaId";
    this.staffService.postcallMethod(url, data).subscribe((response: any) => {
      this.branchData = response.dataList;
      this.branchData.forEach((element1:any, i:any) => {
        if (staffBranch.branchName.length > 0) {
          if (staffBranch.branchName === element1.name) {
            this.staffGroupForm.patchValue({
              branchId: element1.id
            });
          }
        }
      });
    });
  }

onShowAreaMapping() {
  this.showAreaMappingDialog = true;
  this.loadCountries();

    // If editing staff, fetch assigned location details
  if (this.editMode && this.editStaffId) {
    this.radiusStaffService.getAssignedLocationDetails(this.editStaffId, Number(this.mvnoId)).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.populateAreaMappingFromApi(res.data);
        }
      },
      error: (err) => {
        console.error('Error fetching assigned location details:', err);
      }
    });
  }
}

populateAreaMappingFromApi(data: any) {
  this.areaMappingList = [];

  if (data.countries && Array.isArray(data.countries)) {
    data.countries.forEach((country: any) => {
      this.selectedCountry = { id: country.countryId, code: country.code, name: country.name };
      this.onCountryChange(this.selectedCountry);

      if (country.states && country.states.length > 0) {
        country.states.forEach((state: any) => {
          this.selectedState = { id: state.stateId, code: state.code, name: state.name };
          this.onStateChange(this.selectedState);

          if (state.districts && state.districts.length > 0) {
            state.districts.forEach((district: any) => {
              this.selectedDistrict = { id: district.districtId, code: district.code, name: district.name };
              this.areaMappingList.push({
                id: district.id ?? null, // <-- store id for update
                country: this.selectedCountry,
                state: this.selectedState,
                district: this.selectedDistrict
              });
            });
          } else {
            this.areaMappingList.push({
              id: state.id ?? null,
              country: this.selectedCountry,
              state: this.selectedState
            });
          }
        });
      } else {
        this.areaMappingList.push({
          id: country.id ?? null,
          country: this.selectedCountry
        });
      }
    });
  }

  // auto-detect selectedLevel
  if (this.areaMappingList.some(a => a.district)) {
    this.selectedLevel = 'district';
  } else if (this.areaMappingList.some(a => a.state)) {
    this.selectedLevel = 'state';
  } else {
    this.selectedLevel = 'country';
  }

  // ensure dropdowns visible
  this.showCountryDropdown   = true;
  this.showStateDropdown     = this.selectedLevel === 'state' || this.selectedLevel === 'district';
  this.showDistrictDropdown  = this.selectedLevel === 'district';
}


closeShowAreaMappingDialog() {
  this.showAreaMappingDialog = false;
  this.selectedCountry = null;
  this.selectedState = null;
  this.selectedDistrict = null;
  this.states = [];
  this.districts = [];
}

// Load Country List
loadCountries() {
  this.radiusStaffService.getAllCountryAreaMapping().subscribe({
    next: (res) => {
      this.country = res || [];   // use country, not countries
    },
    error: (err) => {
      console.error('Error fetching countries:', err);
    }
  });
}

// Load States when country is selected
onCountryChange(selectedCountry: any) {
  const countryCode = selectedCountry?.code;
  if (!countryCode) return;

  this.radiusStaffService.getAllStateAreaMapping(countryCode).subscribe({
    next: (res) => {
      this.states = res || [];
      this.selectedState = null;
      this.districts = [];
      this.selectedDistrict = null;
    },
    error: (err) => {
      console.error('Error fetching states:', err);
    }
  });
}

// Load Districts when state is selected
onStateChange(selectedState: any) {
  const stateCode = selectedState?.code;
  if (!stateCode) return;

  this.radiusStaffService.getAllDistrictAreaMapping(stateCode).subscribe({
    next: (res) => {
      this.districts = res || [];
      this.selectedDistrict = null;
    },
    error: (err) => {
      console.error('Error fetching districts:', err);
    }
  });
}

// Add selected Country/State/District to the table
onAddAreaMapping() {
  if (this.selectedLevel === 'country') {
    if (!this.selectedCountry) {
      this.toastr.error("Please select Country", "Error");
      return;
    }

    //  Prevent duplicate country
    const exists = this.areaMappingList.some(
      a => a.country?.id === this.selectedCountry.id && !a.state && !a.district
    );
    if (exists) {
      this.toastr.warning(`${this.selectedCountry.name} already added`, "warning");
      return;
    }

    this.areaMappingList.push({ id: null, country: this.selectedCountry });
  } 
  else if (this.selectedLevel === 'state') {
    if (!this.selectedCountry || !this.selectedState) {
      this.toastr.error("Please select Country and State", "Error");
      return;
    }

    //  Prevent duplicate state
    const exists = this.areaMappingList.some(
      a => a.country?.id === this.selectedCountry.id && a.state?.id === this.selectedState.id && !a.district
    );
    if (exists) {
      this.toastr.warning(`${this.selectedState.name} already added`, "warning");
      return;
    }

    this.areaMappingList.push({
      id: null,
      country: this.selectedCountry,
      state: this.selectedState
    });
  } 
  else if (this.selectedLevel === 'district') {
    if (!this.selectedCountry || !this.selectedState || !this.selectedDistrict) {
      this.toastr.error("Please select Country, State and District", "Error");
      return;
    }

    //  Prevent duplicate district
    const exists = this.areaMappingList.some(
      a => a.country?.id === this.selectedCountry.id &&
           a.state?.id === this.selectedState.id &&
           a.district?.id === this.selectedDistrict.id
    );
    if (exists) {
      this.toastr.warning(`${this.selectedDistrict.name} already added`, "warning");
      return;
    }

    this.areaMappingList.push({
      id: null,
      country: this.selectedCountry,
      state: this.selectedState,
      district: this.selectedDistrict
    });
  }
}

// Remove row by index
removeAreaMapping(i: number) {
  this.areaMappingList.splice(i, 1);
}

onLevelChange(level: 'country' | 'state' | 'district') {
  this.selectedLevel = level;
  this.showCountryDropdown = level === 'country' || level === 'state' || level === 'district';
  this.showStateDropdown = level === 'state' || level === 'district';
  this.showDistrictDropdown = level === 'district';

  // reset selections
  this.selectedCountry = null;
  this.selectedState = null;
  this.selectedDistrict = null;
  this.areaMappingList = [];
}


// Submit API call with full table data

onSaveAreaMapping() {
    this.pendingAreaMapping = {
    userId: this.userId,
    mvnoId: this.mvnoId,
    areas: this.areaMappingList.map(item => {
      let countryId: number | null = null;
      let stateId: number | null = null;
      let districtId: number | null = null;

      if (this.selectedLevel === 'country') {
        countryId = item.country?.id ?? null;
      } else if (this.selectedLevel === 'state') {
        stateId = item.state?.id ?? null;
      } else if (this.selectedLevel === 'district') {
        districtId = item.district?.id ?? null;
      }

      return {
        id: item.id ?? null,
        countryId,
        stateId,
        districtId
      };
    }),
    assignedUserId: this.editMode ? this.editStaffId : null
  };
  if (this.editMode && this.editStaffId) {
    // Call API immediately in edit mode
    this.radiusStaffService.areaMapping(this.pendingAreaMapping).subscribe({
      next: (res) => {
        this.toastr.success("Area mapping updated.", "Success");
        this.closeShowAreaMappingDialog();
        // Optionally refresh staff details here
      },
      error: (err) => {
        this.toastr.error("Error updating area mapping", "Error");
      }
    });
  } else {
    // For create, just store for later (after staff creation)
    this.closeShowAreaMappingDialog();
  }

    // Clear data after save
  this.areaMappingList = [];
  this.selectedCountry = null;
  this.selectedState = null;
  this.selectedDistrict = null;
  this.selectedLevel = null;
  this.showCountryDropdown = false;
  this.showStateDropdown = false;
  this.showDistrictDropdown = false;

  this.closeShowAreaMappingDialog();
  console.log("Prepared area mapping data:", this.pendingAreaMapping);
}



}
