import * as RadiusConstants from 'src/app/RadiusUtils/RadiusConstants';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { StaffService } from 'src/app/service/staff.service';
import { RoleService } from 'src/app/service/role.service';
import { RadiusUtility } from 'src/app/RadiusUtils/RadiusUtility';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { IStaff } from 'src/app/components/model/staff';
import { countries } from 'src/app/components/model/country';
import { CommondropdownService } from 'src/app/service/commondropdown.service';
import { LoginService } from 'src/app/service/login.service';
import { AclClassConstants } from 'src/app/constants/aclClassConstants';
import { AclConstants } from 'src/app/constants/aclOperationConstants';
import { BranchManagementService } from '../branch-management/branch-management.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { isEqual } from 'lodash';
import { TacacsDeviceGroupService } from 'src/app/service/tacacs-device-group.service';
import { KeyannaCommonBaseService } from 'src/app/service/keyanna-common-base.service';
import { SETTINGS, TACACS } from 'src/app/constants/aclConstants';
import { CustomermanagementService } from 'src/app/service/customermanagement.service';
import { StatusCheckService } from 'src/app/service/status-check-service.service';
import { WhiteeSpaceValidator } from '../shared/custom-validators';
import { HttpClient } from '@angular/common/http';
import { FlowService } from './project.service';
import { forkJoin, debounceTime, Observable, Observer } from 'rxjs';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-project-management',
  templateUrl: './project-management.component.html',
  styleUrl: './project-management.component.css',
  standalone: false,
})
export class ProjectManagementComponent implements OnInit {
  profile_picture: any;
  fileToUpload: any;
  imageUrl: any;
  createAccess: boolean = false;
  changePassAccess: boolean = false;
  createReceiptAccess: boolean = false;
  tacacsAccess: boolean = false;
  editAccess: boolean = false;
  showTypeError: boolean = false;
  profileImg: any;
  currentUserIdentityKey: any;
  staffUserList: any;
  profileChange: any = [];
  selectedProject: any;
  selectedUser: any;
  selectedStatus: any;
  createForm: FormGroup;
  typeOptions = [
    { label: 'Survey Area', value: 'survey_area_controller' },
    { label: 'OLT', value: 'olt_controller' },
  ];

  disabledTypeOption = [
    { label: 'Please select a Status first', disabled: true },
  ];

  statusOptions = [
    { label: 'Pending', value: 'Pending', badgeClass: 'badge-warning' },
    { label: 'Completed', value: 'Completed', badgeClass: 'badge-success' },
    { label: 'In Progress', value: 'in_progress', badgeClass: 'badge-info' },
    { label: 'On Hold', value: 'on_hold', badgeClass: 'badge-secondary' },
    { label: 'Done', value: 'Done', badgeClass: 'badge-primary' },
    { label: 'Planned', value: 'Planned', badgeClass: 'badge-dark' },
    { label: 'Initiated', value: 'Initiated', badgeClass: 'badge-dark' },
  ];

  getStatusLabel(status: string) {
    return this.statusOptions.find((s) => s.value === status)?.label || status;
  }

  getStatusClass(status: string) {
    return (
      this.statusOptions.find((s) => s.value === status)?.badgeClass ||
      'badge-light'
    );
  }

  constructor(
    private staffService: StaffService,
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
    private http: HttpClient,
    loginService: LoginService,
    public projectService: FlowService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.createAccess = loginService.hasPermission(SETTINGS.STAFF_CREATE);
    this.changePassAccess = loginService.hasPermission(
      SETTINGS.STAFF_CHANGE_PASSWORD
    );
    this.editAccess = loginService.hasPermission(SETTINGS.STAFF_EDIT);
    this.createReceiptAccess = loginService.hasPermission(
      SETTINGS.STAFF_CREATE_RECEIPT
    );
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
  statusMsg = '';
  roles: any[];
  selectedRoles: any[];
  loggedInUser = '';
  currentPageMvno = 1;
  mvnoitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  mvnototalRecords: any;
  parentStaffView = false;
  parentStaffList: any = [];
  searchData: any = [];
  searchDeatil: any = '';
  UserData: any;
  userName: '';
  AclClassConstants: any;
  AclConstants: any;

  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 1;
  searchkey: string;
  totalDataListLength = 0;

  public loginService: LoginService;
  staffListDatalength = 0;

  showPassword = false;
  _passwordType = 'password';
  showNewPassword = false;
  showOLDPassword = false;
  _passwordOLDType = 'password';
  _passwordNewType = 'password';
  businessUnitIdsList: any = [];
  selServiceAreaId: any;

  satffUserData: any = [];
  isStaffPersonalData = false;
  isStaffReceiptData = false;

  currentReceiptPage = 1;
  itemsReceiptPerPage: number = RadiusConstants.ITEMS_PER_PAGE;
  totalReceiptRecords: number;

  inputMobile: string;
  enteredMobilelength: string;
  ifgenerateOtpField = true;
  userNameForPasswordUpdate = '';
  mvnoIdForPwdChange = '';
  staffPhoneNumber = '';
  staffCountryCode = '';
  staffOTPValue = '';
  branchData: any;
  TacacsDeviceList: any[];

  uploadDocForm: FormGroup;

  isShowProjectMenu = false;
  isStaffList = true;
  isStaffCreateOrEdit = false;
  ifWalletStaffShow = false;

  isPasswordShow = false;

  userForm: FormGroup;
  statusList: any[] = [
    { value_field: 'ACTIVE', display_field: 'Active' },
    // { value_field: "BLOCKED", display_field: "Blocked" },
    { value_field: 'INACTIVE', display_field: 'In Active' },
    // { value_field: "REGISTERED", display_field: "Registered" },
    { value_field: 'TERMINATED', display_field: 'Terminated' },
  ];
  teams: any[] = [];
  roleList: any[] = [{ id: '', rolename: '' }];
  loggedInUserRoleList: any[] = [{ id: '', rolename: '' }];

  staffreciptMappingList: any = [];
  openStaffID = '';

  getWallatData: any;
  WalletAmount: any;

  prefikx = '';

  branchList: any = [];

  passwordData = {
    username: '',
    newPassword: '',
    confirmNewPassword: '',
  };
  businessData: any;

  staffRecepetId = '';

  searchReceptNumber = '';

  bankDataList: any = [];

  itemsLegderPerPage = RadiusConstants.ITEMS_PER_PAGE;
  currentLegderPage = 1;
  totalLegderRecords: string;
  staffLegderData: any = [];
  staffEmail = '';
  userId = localStorage.getItem('userId');
  usernamee: string = '';
  treeData: any[] = [];
  selectedNodes: any[] = [];
  status = 'Completed';

  cols: any;
  parentOption: any;
  ngOnInit(): void {
    // this.treeData = [
    //   {
    //     data: { name: 'CduDemo1Newww', id: 22, type: 'CDU' },
    //     leaf: false,
    //     children: [
    //       {
    //         data: { name: 'SurveyArea1', id: 101, type: 'Survey-Area' },
    //         leaf: false,
    //         children: [
    //           {
    //             data: { name: 'PoleA', id: 201, type: 'POLE' },
    //             leaf: false,
    //             children: [
    //               {
    //                 data: { name: 'Fat001', id: 301, type: 'FAT' },
    //                 leaf: true,
    //               },
    //               {
    //                 data: { name: 'Fat002', id: 302, type: 'FAT' },
    //                 leaf: true,
    //               },
    //             ],
    //           },
    //           {
    //             data: { name: 'PoleB', id: 202, type: 'POLE' },
    //             leaf: false,
    //             children: [
    //               {
    //                 data: { name: 'Fat003', id: 303, type: 'FAT' },
    //                 leaf: true,
    //               },
    //             ],
    //           },
    //         ],
    //       },
    //     ],
    //   },
    //   {
    //     data: { name: 'OLT-Demo', id: 45, type: 'OLT' },
    //     leaf: false,
    //     children: [
    //       {
    //         data: { name: 'POLE-X', id: 401, type: 'POLE' },
    //         leaf: false,
    //         children: [
    //           {
    //             data: { name: 'FAT-X1', id: 501, type: 'FAT' },
    //             leaf: false,
    //             children: [
    //               { data: { name: 'DP-01', id: 601, type: 'DP' }, leaf: true },
    //               { data: { name: 'DP-02', id: 602, type: 'DP' }, leaf: true },
    //             ],
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // ];

    this.createForm = this.fb.group(
      {
        name: ['', Validators.required],
        description: [''],
        expectedStartDate: ['', Validators.required],
        expectedEndDate: ['', Validators.required],
        type: ['', Validators.required],
        status: ['', Validators.required],
        parent: ['', Validators.required],
      },
      { validators: this.dateRangeValidator() }
    );
    this.createForm.get('name').valueChanges.pipe(debounceTime(300));
    this.createForm.get('description').valueChanges.pipe(debounceTime(300));
    this.createForm
      .get('expectedStartDate')
      ?.valueChanges.subscribe((startDate: Date | null) => {
        this.minStartDate = startDate;
        // Update maxEndDate or any UI constraints here if needed
        this.createForm.get('expectedEndDate')?.updateValueAndValidity();
      });

    this.createForm
      .get('expectedEndDate')
      ?.valueChanges.subscribe((endDate: Date | null) => {
        this.maxEndDate = endDate;
        // Update minStartDate or any UI constraints here if needed
        this.createForm.get('expectedStartDate')?.updateValueAndValidity();
      });
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'type', header: 'Type' },
    ];
    this.commondropdownService.getsystemconfigList();
    this.usernamee = '@' + localStorage.getItem('mvnoName');

    this.getAllRole();
    this.staffUserData(this.userId);
    if (this.statusCheckService.isActiveTacacs) {
      this.gettacacsALGData();
    }
    this.getAllProjects();
    this.getStaffData();
    // this.getALlBUData();
    this.getAllBranch();
    this.getBankDetail();
    this.staffService.getAllRoleData().subscribe((result) => {
      this.roleList = result.dataList;
    });
    this.staffService.getAllRoleDataForLoggedInUser().subscribe((result) => {
      this.loggedInUserRoleList = result.dataList;
    });
    this.staffService.getTeamsData().subscribe((result) => {
      this.teams = result.dataList;
    });
    const serviceArea = localStorage.getItem('serviceArea');
    const serviceAreaArray = JSON.parse(serviceArea);
    if (serviceAreaArray.length !== 0) {
      this.commondropdownService.getserviceAreaListForCafCustomer();
      this.commondropdownService.filterPartnerAll();
    } else {
      this.commondropdownService.getserviceAreaListForCafCustomer();
      this.commondropdownService.getpartnerAll();
    }
    this.searchStaffForm = this.fb.group({
      username: [''],
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
      prefix: ['', Validators.required],
      receiptFrom: ['', Validators.required],
      receiptTo: ['', Validators.required],
    });

    this.staffGroupForm = this.fb.group({
      username: ['', Validators.required],
      password: [
        '',
        [Validators.required, WhiteeSpaceValidator.cannotContainSpace],
      ],
      email: ['', [Validators.required, Validators.email]],
      roleIds: ['', Validators.required],
      // serviceAreaId: [''],
      serviceAreaIdsList: [],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      teamIds: [''],
      status: ['', Validators.required],
      parentStaffId: [''],
      partnerid: ['', Validators.required],
      phone: ['', Validators.required],
      businessUnitIdsList: [''],
      mvnoid: [''],
      countryCode: [''],
      branchId: [''],
      staffUserServiceMappingList: [],
      file: [''],
      hrmsId: [''],
      tacacsAccessLevelGroup: [''],
    });

    this.radiusWalletGroupForm = this.fb.group({
      date: ['', Validators.required],
      amount: ['', Validators.required],
      bankId: ['', Validators.required],
      remarks: ['', Validators.required],
    });

    this.loggedInUser = localStorage.getItem('loggedInUser');

    this.changePasswordForm = this.fb.group({
      userName: [''],
      // oldPassword: ["", Validators.required],
      newPassword: ['', [Validators.required]],
    });
    this.searchData = {
      filters: [
        {
          filterColumn: 'any',
          filterCondition: 'and',
          filterDataType: '',
          filterOperator: 'equalto',
          filterValue: '',
          port: '',
          salesRepresentative: '',
          serviceArea: '',
          serviceNetwork: '',
          slot: '',
        },
      ],
      page: this.currentPage,
      pageSize: this.itemsPerPage,
    };

    this.createForm.get('status')?.valueChanges.subscribe((value) => {
      this.showTypeError = false;
    });
  }
  projects: any = [];
  loading: boolean = false;
  dateRangeValidator(): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const start = group.get('expectedStartDate')?.value;
      const end = group.get('expectedEndDate')?.value;
      if (start && end) {
        // Compare dates including time
        return new Date(start) < new Date(end)
          ? null
          : { dateRangeInvalid: true };
      }
      return null; // valid if one or both are null (required handled separately)
    };
  }
  formatDateForDisplay(val: Date | string): string {
    if (!val) return '';
    let d = new Date(val);
    if (isNaN(d.getTime())) return '';
    let pad = (n: number) => String(n).padStart(2, '0');
    return (
      d.getFullYear() +
      '-' +
      pad(d.getMonth() + 1) +
      '-' +
      pad(d.getDate()) +
      ' ' +
      pad(d.getHours()) +
      ':' +
      pad(d.getMinutes()) +
      ':' +
      pad(d.getSeconds())
    );
  }
  getStaffData() {
    this.projectService.getAllStaff().subscribe({
      next: (res: any) => {
        this.userOptions = res;
        // this.messageService.add({
        //   severity: 'success',
        //   summary: 'Success',
        //   detail: 'Project created successfully',
        // });
      },
      error: (err: any) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create Project',
        });
      },
    });
  }
  getAllProjects(): void {
    this.loading = true;

    this.projectService.getFlows().subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.projects = res.data || [];
        } else {
          this.projects = [];
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: res.message || 'Failed to load projects',
          });
        }
        this.loading = false;
      },
      error: () => {
        this.projects = [];
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'API Failed',
        });
        this.loading = false;
      },
    });
  }
  openStaffListMenu() {
    this.isStaffCreateOrEdit = false;
    this.isStaffList = true;

    this.parentStaffView = false;
    this.isPasswordShow = false;
    this.isStaffPersonalData = false;
    this.isStaffReceiptData = false;
    this.isShowProjectMenu = false;
    this.ifWalletStaffShow = false;
    this.createForm.reset();

    // this.getAll("");
  }

  openStaffCreateMenu() {
    this.parentStaffList = [];
    this.staffGroupForm.controls['password'].enable();
    this.createForm.reset();
    this.treeData = []; // This will hide the <p-treeTable>
    this.selectedNodes = [];
    this.parentOption = '';

    this.editMode = false;
    this.isStaffList = false;
    this.isStaffCreateOrEdit = true;
    this.parentStaffView = false;
    this.isPasswordShow = false;
    this.isStaffPersonalData = false;
    this.isStaffReceiptData = false;
    this.isShowProjectMenu = false;
    this.ifWalletStaffShow = false;

    this.imageUrl = '';
    this.clearFormData();
    this.staffGroupForm.patchValue({
      countryCode: this.commondropdownService.commonCountryCode,
    });
    this.staffGroupForm.controls['roleIds'].setValue(
      this.loggedInUserRoleList[0]?.id
    );
    this.staffGroupForm.patchValue({
      roleIds: this.loggedInUserRoleList[0].id,
    });
    this.businessData.forEach((element: any) => {
      element.flag = false;
    });
    this.staffGroupForm.controls['firstname'].enable();
    this.staffGroupForm.controls['lastname'].enable();
    this.staffGroupForm.controls['username'].enable();
    this.staffGroupForm.controls['parentStaffId'].disable();
  }

  onKeymobilelength(event: any) {
    const str = this.staffGroupForm.value.phone.toLocaleString();
    const withoutCommas = str.replace(/,/g, '');
    const strrr = withoutCommas.trim();
    const mobilenumberlength = this.commondropdownService.commonMoNumberLength;
    if (Number.isNaN(mobilenumberlength)) {
      this.mobileError = false;
    } else if (strrr.length > Number(mobilenumberlength)) {
      this.inputMobile = `${mobilenumberlength}`;
      this.enteredMobilelength = strrr.length;
      this.mobileError = false;
    } else if (strrr.length == Number(mobilenumberlength)) {
      this.inputMobile = '';
      this.enteredMobilelength = '';
      this.mobileError = false;
    } else {
      this.inputMobile = `${mobilenumberlength}`;
      this.enteredMobilelength = strrr.length;
      this.mobileError = false;
    }
  }
  staffDetialsOpen(id: any) {
    this.isStaffCreateOrEdit = false;
    this.isStaffList = false;
    this.isStaffPersonalData = true;

    this.parentStaffView = false;
    this.isPasswordShow = false;
    this.isStaffReceiptData = false;
    this.isShowProjectMenu = true;
    this.ifWalletStaffShow = false;

    this.openStaffID = id;
    this.staffService.getStaffUserData(id).subscribe((response: any) => {
      this.satffUserData = response.Staff;
      this.staffreciptMappingList =
        this.satffUserData.staffUserServiceMappingList;

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
    this.isShowProjectMenu = true;
    this.ifWalletStaffShow = false;
  }
  openStaffWallet() {
    this.isStaffCreateOrEdit = false;
    this.isStaffList = false;
    this.isStaffPersonalData = false;
    this.isStaffReceiptData = false;

    this.parentStaffView = false;
    this.isPasswordShow = false;
    this.isShowProjectMenu = true;
    this.ifWalletStaffShow = true;

    const url = '/staff_ledger_details/walletAmount/' + this.openStaffID;
    this.staffService.getFromCMS(url).subscribe((response: any) => {
      this.getWallatData = response;
      this.WalletAmount = response.availableAmount;
    });

    this.getstaffLegderData();
  }

  serviceAreaEvent(event: any) {
    this.parentStaffList = [];
    this.staffGroupForm.value.parentStaffId = '';
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

      serviceArea_ID.forEach((element: any) => {
        staffData.forEach((data: any) => {
          data.serviceAreaIdsList.forEach((serviceAreaID: any) => {
            if (element == serviceAreaID) {
              seviceAreaData.push(data);
              this.parentStaffList = seviceAreaData.filter(
                (staf: any) =>
                  staf.username !== this.staffGroupForm.value.username
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
        const found = uniqueNames.some((value) => isEqual(value, item));
        if (!found) {
          uniqueNames.push(item);
        }
      }
      this.parentStaffList = uniqueNames;
    });

    this.getbranchByServiceAreaID(serviceArea_ID);
  }

  staffAutofieldValue(data: any) {
    this.parentStaffList = [];
    this.staffGroupForm.value.parentStaffId = '';
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
      serviceArea_ID.forEach((element: any) => {
        staffData.forEach((data: any) => {
          data.serviceAreaIdsList.forEach((serviceAreaID: any) => {
            if (element == serviceAreaID) {
              seviceAreaData.push(data);
              this.parentStaffList = seviceAreaData.filter(
                (staf: any) =>
                  staf.username !== this.staffGroupForm.value.username
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
        const found = uniqueNames.some((value) => isEqual(value, item));
        if (!found && item.id != this.editStaffId) {
          uniqueNames.push(item);
        }
      }
      this.parentStaffList = uniqueNames;
      // console.log("ParentStaff :::: ", this.parentStaffList);
    });
  }
  getbranchByServiceAreaID(ids: any) {
    let data = [];
    data = ids;
    const url = '/branchManagement/getAllBranchesByServiceAreaId';
    this.KeyannaCommonBaseService.post(url, data).subscribe((response: any) => {
      this.branchData = response.dataList;
    });
  }
  searchStaffData() {}
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
            severity: 'info',
            summary: 'Info',
            detail: error.error.msg,
            icon: 'far fa-times-circle',
          });
          this.staffData = [];
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.ERROR,
            icon: 'far fa-times-circle',
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
    const prefix = this.prefikx ? this.prefikx.trim() : '';
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
            severity: 'info',
            summary: 'Info',
            detail: error.error.msg,
            icon: 'far fa-times-circle',
          });
          this.staffData = [];
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.ERROR,
            icon: 'far fa-times-circle',
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
      console.log('invalida');
    }
  }

  private addNewStaff() {
    this.staffGroupForm.controls['password'].enable();
    if (this.staffGroupForm.valid) {
      if (
        this.staffGroupForm.value.countryCode == '' ||
        this.staffGroupForm.value.countryCode == null
      ) {
        this.staffGroupForm.value.countryCode =
          this.commondropdownService.commonCountryCode;
      }
      const data = this.staffGroupForm.value;
      data.roleIds = [];
      data.roleIds.push(this.staffGroupForm.controls['roleIds'].value);
      data.username =
        this.staffGroupForm.controls['username'].value + this.usernamee;
      this.staffService.add(data).subscribe(
        (response: any) => {
          this.uploadDocuments(response.staffuser.id);
          if (this.searchkey) {
            this.searchStaffData();
          } else {
            this.getAll('');
          }

          this.imageUrl = '';
          this.clearFormData();
          this.parentStaffList = [];

          this.messageService.add({
            severity: 'success',
            summary: 'Successfully',
            detail: response.message,
            icon: 'far fa-check-circle',
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
            severity: 'error',
            summary: 'Error',
            detail: error.error.ERROR,
            icon: 'far fa-times-circle',
          });
        }
      );
    }
  }

  private updateStaff() {
    this.staffGroupForm.controls['password'].disable();
    if (this.staffGroupForm.valid) {
      if (
        this.staffGroupForm.value.countryCode == '' ||
        this.staffGroupForm.value.countryCode == null
      ) {
        this.staffGroupForm.value.countryCode =
          this.commondropdownService.commonCountryCode;
      }
      this.editData = this.staffGroupForm.getRawValue();
      this.editData.staffId = this.editStaffId;
      this.editData.roleIds = [];
      this.editData.roleIds.push(this.staffGroupForm.controls['roleIds'].value);
      this.staffService.update(this.editData, this.editData.staffId).subscribe(
        (response: any) => {
          this.uploadDocuments(this.editStaffId);

          this.imageUrl = '';
          this.openStaffListMenu();
          if (this.searchkey) {
            this.searchStaffData();
          } else {
            this.getAll('');
          }
          this.loginService.refreshToken();
          this.loginService.getAclEntry();
          this.parentStaffList = [];
          this.messageService.add({
            severity: 'success',
            summary: 'Successfully',
            detail: response.message,
            icon: 'far fa-check-circle',
          });
          this.clearFormData();
          this.parentStaffView = false;
          this.isPasswordShow = false;
          this.editMode = false;

          this.businessData.forEach((element: any) => {
            this.editData.businessUnitIdsList.forEach((id) => {
              if (element.id == id) {
                element.flag = false;
              }
            });
          });
          this.submitted = false;
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.ERROR,
            icon: 'far fa-times-circle',
          });
        }
      );
    }
  }

  editStaffById(staff: any, i: any) {
    this.parentStaffList = [];
    this.imageUrl = '';
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
      staff.serviceAreaNameList.forEach((element: any) => {
        staff.serviceAreaIdsList.push(element.id);
      });
    }
    if (staff.parentStaffId) {
      this.staffGroupForm.patchValue({
        parentStaffId: staff.parentStaffId,
        partnerid: staff.partnerid,
        file: staff.profileImage ? [{}] : '',
      });
      this.parentStaffView = true;
      this.staffAutofieldValue(staff.serviceAreaIdsList);
    } else {
      staff.parentStaffId = '';
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
    staff.password = '';
    this.editData = staff;
    this.staffGroupForm.patchValue(this.editData);
    staff.password = '';
    if (this.editData.businessUnitIdsList == null) {
      if (staff.businessUnitNameList != null) {
        staff.businessUnitIdsList = [];
        staff.businessUnitNameList.forEach((element: any) => {
          staff.businessUnitIdsList.push(element.id);
        });
      }
    }
    this.editData = staff;
    this.staffGroupForm.patchValue(this.editData);
    this.staffGroupForm.controls['roleIds'].patchValue(
      this.editData.roleIds[0]
    );
    this.staffGroupForm.patchValue({ serviceAreaIdsList: servicAreaId });
    this.getbranchByServiceAreaID(servicAreaId);
    this.staffGroupForm.controls['firstname'].enable();
    this.staffGroupForm.controls['lastname'].enable();
    this.staffGroupForm.controls['username'].disable();
    this.businessData.forEach((element: any) => {
      if (this.editData.businessUnitIdsList != null) {
        this.editData.businessUnitIdsList.forEach((id) => {
          if (element.id == id) {
            element.flag = true;
          }
        });
      } else {
        element.flag = false;
      }
    });
  }

  deleteConfirm(staffId: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this Staff member?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteStaffById(staffId);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  }
  deleteStaffById(staffId: any) {
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
          this.getAll('');
        }
        this.openStaffListMenu();
        this.messageService.add({
          severity: 'success',
          summary: 'Successfully',
          detail: response.message,
          icon: 'far fa-check-circle',
        });

        this.clearFormData();
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.ERROR,
          icon: 'far fa-times-circle',
        });
      }
    );
  }

  clearSearchForm() {
    this.getAll('');
    this.searchDeatil = '';
    this.prefikx = '';

    this.openStaffListMenu();
  }

  clearFormData() {
    this.staffGroupForm.reset();
  }

  TotalItemPerPage(event: any) {
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

  getAll(list: any) {
    let size;
    this.searchkey = '';
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
      pageSize: this.itemsPerPage,
    };
    // this.staffService.getAllStaff().subscribe(
    this.staffService.getAllStaffList(data).subscribe(
      (response: any) => {
        var mvnoId = Number(localStorage.getItem('mvnoId'));
        this.staffData = response.staffUserlist;
        this.totalRecords = response.pageDetails.totalRecords;
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.errorMessage,
          icon: 'far fa-times-circle',
        });
      }
    );
  }
  getAllBranch() {
    this.commondropdownService
      .getMethodWithCache('/branchManagement/all')
      .subscribe(
        (response: any) => {
          this.branchList = response.dataList;
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.errorMessage,
            icon: 'far fa-times-circle',
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
          severity: 'error',
          summary: 'Error',
          detail: error.error.errorMessage,
          icon: 'far fa-times-circle',
        });
      }
    );
  }

  pageChanged(pageNumber: any) {
    this.clearFormData();
    this.currentPage = pageNumber;
    if (this.searchkey) {
      this.searchStaffData();
    } else {
      this.getAll('');
    }
  }

  getCustomerDataForPasswordChange(staff: any) {
    this.ifgenerateOtpField = true;
    this.staffOTPValue = '';
    this.mvnoIdForPwdChange = staff.mvnoId;
    this.userNameForPasswordUpdate = staff.username;
    this.staffPhoneNumber = staff.phone;
    this.staffCountryCode = staff.countryCode;
    this.staffEmail = staff.email;
    this.changePasswordForm.patchValue({
      userName: this.userNameForPasswordUpdate,
    });
  }

  mapChangePasswordFormDataWithObject() {
    this.passwordData.newPassword = this.changePasswordForm.value.newPassword;
    this.passwordData.confirmNewPassword =
      this.changePasswordForm.value.confirmNewPassword;
    this.passwordData.username = this.userNameForPasswordUpdate;
  }

  changePassword() {
    this.changePasswordForm.value.userName = this.userNameForPasswordUpdate;
    this.staffService.changePassword(this.changePasswordForm.value).subscribe(
      (response: any) => {
        $('#changePasswordModal').modal('hide');
        this.clearChangePasswordForm();
        this.messageService.add({
          severity: 'success',
          summary: 'Successfully',
          detail: response.message,
          icon: 'far fa-check-circle',
        });
      },
      (error: any) => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: error.error.msg,
          icon: 'far fa-times-circle',
        });
      }
    );
  }

  clearChangePasswordForm() {
    this.ifgenerateOtpField = true;
    this.staffOTPValue = '';
    this.changePasswordForm.controls['otp'].reset();
    //this.changePasswordForm.reset();
  }
  staffUserData(id: any) {
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
    const url = '/tacacs-access-level-group/get-access-level-groups';
    let plandata = {
      page: 0,
      pageSize: 100,
    };
    this.tacacsService
      .getMethod(url, { params: plandata })
      .subscribe((res: any) => {
        this.TacacsDeviceList = res.data.accessLevelGroup.content;
      });
  }

  getALlBUData() {
    const businessDataList: any = [];
    const userID = localStorage.getItem('userId');
    this.staffService.getBUFromStaff().subscribe(
      (response: any) => {
        this.businessData = response.dataList;
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.ERROR,
          icon: 'far fa-times-circle',
        });
      }
    );
  }
  addNewReceipt(data: any) {
    this.staffRecepetId = data.id;
    this.staffGroupForm.patchValue(data);
  }

  clearpaymentReciptForm() {
    this.staffRecepetId == '';
    this.paymentReciptForm.reset();
  }

  saveNewRecipt() {
    const staffUserServiceMappingList = {
      fromreceiptnumber: this.paymentReciptForm.value.receiptFrom,
      id: '',
      identityKey: '',
      isActive: true,
      isDeleted: true,
      mvnoId: '',
      prefix: this.paymentReciptForm.value.prefix,
      stfmappingId: this.staffRecepetId,
      toreceiptnumber: this.paymentReciptForm.value.receiptTo,
    };

    this.customerManagementService
      .addNewReceipt(staffUserServiceMappingList)
      .subscribe(
        (response: any) => {
          if (this.searchkey) {
            this.searchStaffData();
          } else {
            this.getAll('');
          }
          $('#paymentReciptModal').modal('hide');
          this.clearFormData();
          this.parentStaffList = [];
          this.clearpaymentReciptForm();
          this.messageService.add({
            severity: 'success',
            summary: 'Successfully',
            detail: response.message,
            icon: 'far fa-check-circle',
          });
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.ERROR,
            icon: 'far fa-times-circle',
          });
        }
      );
  }

  pageReceiptChanged(pageNumber: any) {
    this.currentReceiptPage = pageNumber;
  }
  clearReceiptForm() {
    this.searchReceptNumber = '';
    this.staffreciptMappingList =
      this.satffUserData.staffUserServiceMappingList;
  }
  getBankDetail() {
    const url = '/bankManagement/searchByStatus';
    this.KeyannaCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.bankDataList = response.dataList;
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.ERROR,
          icon: 'far fa-times-circle',
        });
      }
    );
  }

  showWithdrawalAmountModel() {
    $('#staffWalletModal').modal('show');
  }

  clearWalletStaffForm() {
    this.radiusWalletGroupForm.reset();
  }
  saveManageBalance() {
    let data: any = [];
    const data1 = this.radiusWalletGroupForm.value;

    data = {
      action: '',
      amount: this.radiusWalletGroupForm.value.amount,
      bankId: this.radiusWalletGroupForm.value.bankId,
      date: this.radiusWalletGroupForm.value.date,
      remarks: this.radiusWalletGroupForm.value.remarks,
      // transactionType: "DR",
      buId: '',
      creditDocId: '',
      custId: '',
      id: this.openStaffID,
      identityKey: '',
      mvnoId: '',
      paymentMode: '',
      // staffUser: {
      //   id: this.openStaffID,
      // },
    };

    const url = '/staff_ledger_details/transferredToBank';
    this.staffService.postApiMethod(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.responseMessage,
            icon: 'far fa-times-circle',
          });
        } else if (response.responseCode == 405) {
          this.radiusWalletGroupForm.reset();
          $('#staffWalletModal').modal('hide');

          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: response.responseMessage,
            icon: 'far fa-times-circle',
          });
        } else {
          this.radiusWalletGroupForm.reset();
          $('#staffWalletModal').modal('hide');

          this.openStaffWallet();

          this.messageService.add({
            severity: 'success',
            summary: 'Successfully',
            detail: response.message,
            icon: 'far fa-check-circle',
          });
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.ERROR,
          icon: 'far fa-times-circle',
        });
      }
    );
  }

  pageLegderChanged(e: any) {
    this.currentLegderPage = e;
  }
  getstaffLegderData() {
    const url =
      '/staff_ledger_details/getStaffLedgerDetailsbyStaffId/' +
      this.openStaffID;
    this.staffService.getFromCMS(url).subscribe(
      (response: any) => {
        this.staffLegderData = response.dataList;
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.ERROR,
          icon: 'far fa-times-circle',
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
          header: 'Alert',
          message:
            'The filled data will be lost. Do you want to continue? (Yes/No)',
          icon: 'pi pi-info-circle',
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

  // generate OTP
  genrateOtp() {
    this.staffOTPValue = '';
    const data = {
      countryCode: this.staffCountryCode,
      mobileNumber: this.staffPhoneNumber,
      emailId: this.staffEmail,
      profile: 'OTP',
    };

    const url = '/otp/generate';

    this.staffService.postApiFromCMS(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.responseMessage,
            icon: 'far fa-times-circle',
          });
        } else if (response.responseCode == 405) {
          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: response.responseMessage,
            icon: 'far fa-times-circle',
          });
        } else {
          this.messageService.add({
            severity: 'success',
            summary: 'Successfully',
            detail: response.otp,
            icon: 'far fa-check-circle',
          });
        }
      },
      (error: any) => {
        if (error.status == 200) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.ERROR,
            icon: 'far fa-times-circle',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.ERROR,
            icon: 'far fa-times-circle',
          });
        }
        console.log(error, 'error');
      }
    );
  }

  // Validate OTP
  ValidOtp() {
    const data = {
      mobileNumber: this.staffPhoneNumber,
      emailId: this.staffEmail,
      otp: this.staffOTPValue,
    };

    const url = '/otp/validate';

    this.staffService.postApiFromCMS(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.ifgenerateOtpField = true;

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.responseMessage,
            icon: 'far fa-times-circle',
          });
        } else {
          this.ifgenerateOtpField = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Successfully',
            detail: response.message,
            icon: 'far fa-check-circle',
          });
        }
      },
      (error: any) => {
        if (error.status == 200) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.ERROR,
            icon: 'far fa-times-circle',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.msg,
            icon: 'far fa-times-circle',
          });
        }
        console.log(error, 'error');
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
        'this.staffGroupForm.controls.file.value :::: ',
        this.staffGroupForm.controls['file'].value
      );

      fileArray = this.staffGroupForm.controls['file'].value;
      formData.append('file', fileArray[0]);
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
            this.getAll('');
          }
          $('#uploadDocumentId').modal('hide');
          this.staffService
            .getStaffUserProfile(this.userId)
            .subscribe((response: any) => {
              this.profileImg = response.data;
              this.staffService.staffImg =
                this.sanitizer.bypassSecurityTrustResourceUrl(
                  `data:image/png;base64, ${response.data}`
                );
            });
        },
        (error: any) => {
          console.log(error, 'error');
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.ERROR,
            icon: 'far fa-times-circle',
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
    console.log('files :::: ', files);

    const selectedFile = files.item(0);
    if (!selectedFile) {
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert('Only JPEG and PNG files are allowed.');
      return;
    }

    const maxSize = 2097152; // 2MB
    if (selectedFile.size > maxSize) {
      alert('File size cannot exceed 2MB.');
      return;
    }

    this.staffGroupForm.patchValue({
      file: files,
    });

    this.fileToUpload = selectedFile;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imageUrl = e.target.result;
    };
    reader.readAsDataURL(selectedFile);
  }

  setBranchInEditStaff(ids: any, staffBranch: any) {
    let data = [];
    data = ids;
    const url = '/branchManagement/getAllBranchesByServiceAreaId';
    this.staffService.postcallMethod(url, data).subscribe((response: any) => {
      this.branchData = response.dataList;
      this.branchData.forEach((element1: any, i: any) => {
        if (staffBranch.branchName.length > 0) {
          if (staffBranch.branchName === element1.name) {
            this.staffGroupForm.patchValue({
              branchId: element1.id,
            });
          }
        }
      });
    });
  }
  allSelectedMode = false;
  selectMode: 'all' | 'manual' = 'manual';
  hierarchyJson: any;

  minStartDate: Date | null = null;
  maxEndDate: Date | null = null;
  getTree() {
    const selectedType = this.createForm.value?.type?.value;
    console.log(selectedType);
    const selectedStatus = this.createForm.value?.status?.value;

    if (!selectedType || !selectedStatus) return;

    this.loading = true;
    let type = selectedType == 'survey_area_controller' ? 'survey-area' : 'olt';
    this.projectService.getTree(selectedStatus, type).subscribe({
      next: (response: any) => {
        const merged = response;

        // Prepare parent options for multiSelect, don't render tree yet
        this.parentOption = merged.map((item: any) => ({
          ...item,
          label: `${item.name} (${item.type})`,
        }));

        // Clear existing tree data
        this.treeData = [];

        this.cdr.detectChanges();
        this.loading = false;
      },
      error: () => {
        this.treeData = [];
        this.parentOption = [];
        this.loading = false;
      },
    });
  }

  onNodeExpand(event: any) {
    const node = event.node;
    const { type, id } = node.data;
    this.loading = true;
    const isFirstLevel = node.parent === null;
    const apiCall = this.projectService.getChildHierarchy({
      type,
      id,
      status: this.status,
    });
    apiCall.subscribe({
      next: (res: any[]) => {
        if (!res || res.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'No Data',
            detail: 'No child nodes found.',
          });
        }
        node.children = res.map((child: any) => ({
          data: child,
          leaf: false,
        }));
        const cloned = [...this.treeData];
        this.treeData = cloned;
        node.expanded = true;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        node.children = [];
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
  onParentSelect(event: any) {
    const selectedParents = event.value; // array of selected parent nodes
    this.treeData = [];
    const selectedStatus = this.createForm.value?.status?.value;
    if (!selectedParents || selectedParents.length === 0) return;

    this.loading = true;

    // Prepare API calls for each selected parent
    const apiCalls = selectedParents.map((parent: any) =>
      this.projectService.getParentHierarchy({
        type: parent.type,
        ids: [parent.id],
        status: selectedStatus,
      })
    );

    forkJoin(apiCalls).subscribe({
      next: (results: any) => {
        // Flatten the array of results
        const combinedChildren = results.flat();

        // Map children as root nodes in tree
        this.treeData = combinedChildren.map((child: any) => ({
          data: child,
          leaf: false,
        }));

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.treeData = [];
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onSelectionChange(selected: any) {
    this.selectedNodes = selected;

    const totalNodes = this.getAllNodes(this.treeData);
    this.allSelectedMode = selected.length === totalNodes.length;
    this.hierarchyJson = this.buildHierarchyJson();
  }

  onCheckboxClick(event: MouseEvent, node: any) {
    event.stopPropagation();

    const isParent = node.children && node.children.length > 0;
    const alreadySelected = this.selectedNodes.includes(node);

    if (isParent) {
      return;
    }

    if (alreadySelected) {
      this.selectedNodes = this.selectedNodes.filter((n) => n !== node);
    } else {
      this.selectedNodes = [...this.selectedNodes, node];
    }
    this.hierarchyJson = this.buildHierarchyJson();
  }

  isSelected(rowNode: any): boolean {
    return this.selectedNodes.includes(rowNode);
  }
  onManualCheckboxChange(ev: any, rowNode: any) {
    this.toggleNodeSelection(ev, rowNode); // your existing logic
    this.hierarchyJson = this.buildHierarchyJson(); // recompute output
    const total = this.getAllNodes(this.treeData).length;
    this.allSelectedMode = this.selectedNodes.length === total;
  }
  toggleNodeSelection(event: any, rowNode: any) {
    if (event.checked) {
      this.selectedNodes = [...this.selectedNodes, rowNode];
    } else {
      this.selectedNodes = this.selectedNodes.filter((n) => n !== rowNode);
    }

    this.hierarchyJson = this.buildHierarchyJson();

    const total = this.getAllNodes(this.treeData).length;
    this.allSelectedMode = this.selectedNodes.length === total;
  }

  getAllNodes(nodes: any[]): any[] {
    let result: any[] = [];
    for (let node of nodes) {
      result.push(node);
      if (node.children && node.children.length > 0) {
        result = result.concat(this.getAllNodes(node.children));
      }
    }
    return result;
  }

  buildHierarchyJson(): any {
    const totalNodes = this.getAllNodes(this.treeData);
    if (
      this.selectedNodes.length === totalNodes.length &&
      totalNodes.length > 0
    ) {
      return 'All';
    }

    const isSelected = (node: any) => this.selectedNodes.includes(node);

    const pick = (data: any) => {
      // keep only required fields; expand if you need more
      const { name, id, type } = data || {};
      return { name, id, type };
    };

    const buildFromNode = (node: any): any | any[] | null => {
      const selfSelected = isSelected(node);

      if (selfSelected) {
        const out: any = pick(node.data);
        if (node.children?.length) {
          const selectedChildren = node.children
            .map((child: any) => buildFromNode(child))
            .flat()
            .filter(Boolean);
          if (selectedChildren.length > 0) {
            out.children = selectedChildren;
          }
        }
        return out;
      } else {
        // not selected, but children might be
        if (node.children?.length) {
          const childBuilt = node.children
            .map((child: any) => buildFromNode(child))
            .flat()
            .filter(Boolean);
          return childBuilt.length > 0 ? childBuilt : null;
        }
        return null;
      }
    };

    const result: any[] = [];
    for (const root of this.treeData) {
      const built = buildFromNode(root);
      if (Array.isArray(built)) result.push(...built);
      else if (built) result.push(built);
    }

    return result;
  }
  createProject() {
    const rawData = this.createForm.value;
    function formatDate(dateString: string): string {
      const date = new Date(dateString);
      const pad = (n: number) => (n < 10 ? '0' + n : n);

      return (
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
          date.getDate()
        )} ` +
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
          date.getSeconds()
        )}`
      );
    }

    const isAllSelected = this.hierarchyJson === 'All';
    let mvnoId = localStorage.getItem('mvnoId');
    let mappedPojo: any = {
      expectedStartDate: formatDate(rawData.expectedStartDate),
      expectedEndDate: formatDate(rawData.expectedEndDate),
      hicheryJson: isAllSelected ? 'All' : JSON.stringify(this.hierarchyJson),
      name: rawData.name,
      description: rawData.description,
      mvnoId: mvnoId,
      ownerId: 1,
      userId: this.userId,
    };
    if (isAllSelected) {
      mappedPojo.type = rawData.type.label.replace(/\s/g, '');
      (mappedPojo.jsonStatus = this.status),
        (mappedPojo.ids = rawData.parent.map((p: any) => p.id));
    }

    this.projectService.createFlow(mappedPojo).subscribe({
      next: () => {
        this.openStaffListMenu();
        this.createForm.reset();
        this.getAllProjects();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Project created successfully',
        });
      },
      error: (err: any) => {
        // this.openStaffListMenu();
        // this.createForm.reset();
        // this.getAllProjects();
        // this.messageService.add({
        //   severity: 'success',
        //   summary: 'Success',
        //   detail: 'Project created successfully',
        // });
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create Project',
        });
      },
    });
  }

  private onProjectCreateSuccess(): void {
    this.openStaffListMenu();
    this.createForm.reset();
    this.getAllProjects();
    this.showMessage('success', 'Success', 'Project created successfully');
  }

  private showMessage(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }
  deleteConfirmon(countryId: number) {
    if (countryId) {
      this.confirmationService.confirm({
        message: 'Do you want to delete this ' + 'Project' + '?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.deleteCountry(countryId);
        },
        reject: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Rejected',
            detail: 'You have rejected',
          });
        },
      });
    }
  }
  deleteCountry(id: any) {
    this.projectService.deleteFlow(id).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successfully',
          detail: response.msg,
          icon: 'far fa-check-circle',
        });
        this.getAllProjects();
      },
      (error: any) => {
        if (
          error.error.status == 417 ||
          error.error.status == 405 ||
          error.error.status == 406
        ) {
          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: error.error.ERROR,
            icon: 'far fa-times-circle',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.ERROR,
            icon: 'far fa-times-circle',
          });
        }
      }
    );
  }
  assignDialogVisible = false;
  statusDialogVisible = false;

  userOptions: any = [];

  // Open Assign Dialog
  openAssignDialog(project: any) {
    this.selectedProject = project;
    this.selectedUser = null;
    this.assignDialogVisible = true;
  }

  // Open Status Dialog
  openStatusDialog(project: any) {
    this.selectedProject = project;
    this.selectedStatus = null;
    this.statusDialogVisible = true;
  }

  // Confirm Assign
  assignProject() {
    const data = {
      projectId: this.selectedProject.id,
      assignId: this.selectedUser,
    };

    this.projectService.assignProject(data).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Project Assigned',
            detail: 'Project Assigned Successfully',
          });
          this.getAllProjects();
          this.assignDialogVisible = false;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Assignment Failed',
            detail: res.message || 'Failed to assign project.',
          });
        }
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Update Failed',
          detail: 'Error Assign Project Failed',
        });
      },
    });
  }

  // console.log(
  //   'Assigning project',
  //   this.selectedProject.projectId,
  //   'to user',
  //   this.selectedUser
  // );
  // Call API here if needed

  // Confirm Status Change
  changeStatus() {
    const projectId = this.selectedProject.id;
    this.projectService.statusChange(projectId, this.selectedStatus).subscribe({
      next: () => {
        this.statusDialogVisible = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Status Updated',
          detail: `Project ${this.selectedProject.name} marked as ${this.selectedStatus}`,
        });
        this.getAllProjects();
      },
      error: (err: any) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Update Failed',
          detail: `Could not update project status`,
        });
      },
    });
  }

  get isStatusSelected(): boolean {
    return !!this.createForm.get('status')?.value;
  }

  onStatusChange(): void {
    this.createForm.get('type')?.reset();
    this.createForm.get('parent')?.reset();
  }

  onTypeChange(): void {
    this.createForm.get('parent')?.reset();
    this.parentOption = [];
    this.getTree();
    this.cdr.detectChanges();
  }

  viewAssignTask(projectId: any) {
    this.router.navigate(['/home/task-management', projectId]);
  }
}
