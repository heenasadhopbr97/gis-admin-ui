import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { ServiceAreaService } from "src/app/service/service-area.service";
import { Regex } from "src/app/constants/regex";
import { serviceArea, PolyGon } from "src/app/components/model/serviceArea";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import * as _ from "lodash";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { Data } from "@angular/router";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { CustomerInventoryMappingService } from "src/app/service/customer-inventory-mapping.service";
import { InwardService } from "src/app/service/inward.service";
import { ProuctManagementService } from "src/app/service/prouct-management.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
declare var $: any;
import {
  COUNTRY,
  CITY,
  STATE,
  PINCODE,
  AREA,
  REGEX,
  LOCATION
} from "src/app/RadiusUtils/RadiusConstants";
import { Observable, Observer } from "rxjs";
import { CityManagementService } from "src/app/service/city-management.service";
import { PincodeManagementService } from "src/app/service/pincode-management.service";
import { MASTERS } from "src/app/constants/aclConstants";
import { WhiteeSpaceValidator } from "../shared/custom-validators";
// import * as FileSaver from "file-saver";
import { LocationService } from "src/app/service/location.service";

declare const google: any;

interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable?: boolean;
  visible?: boolean;
  opacity?: number;
}

@Component({
    selector: "app-service-area",
    templateUrl: "./service-area.component.html",
    styleUrls: ["./service-area.component.css"],
    standalone: false
})
export class ServiceAreaComponent implements OnInit {
  regex = REGEX;
  countryTitle = COUNTRY;
  cityTitle = CITY;
  locationTitle = LOCATION;
  stateTitle = STATE;
  pincodeTitle = PINCODE;
  areaTitle = AREA;
  pincodeOptions: any[] = [];
  locationOptions: any[] = [];
  @ViewChild("closebutton") closebutton: { nativeElement: { click: () => void; }; };
  serviceAreaGroupForm: FormGroup;
  inventoryAssignForm: FormGroup;
  serviceAreaCategoryList: any;
  submitted: boolean = false;
  taxListData: any;
  createserviceAreaData: serviceArea;
  currentPageserviceAreaListdata = 1;
  serviceAreaListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  serviceAreaListdatatotalRecords: any;
  serviceAreaListData: any = [];
  viewserviceAreaListData: any = [];
  isserviceAreaEdit: boolean = false;
  serviceAreatype = "";
  serviceAreacategory = "";
  searchserviceAreaUrl: any;
  serviceData: any;
  qosPolicyData: any;
  quotaData: any;
  quotaTypeData: any;
  areaNameCategoryList: any;
  isPlanEdit: boolean = false;
  viewPlanListData: any;
  areaIdFromArray: FormArray;
  areaNameitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  areaNametotalRecords: String;
  currentPageareaName = 1;
  selectvalue = "";
  id: any;
  temp:any[] = [];
  serviceAreaListData1: any;
  serviceAreaListDataselector: any;
  serviceAreaRulelength = 0;
  searchData: any;
  searchObject: any;
  searchName: any = "";
  searchAddressType: any = "";
  searchCountryName: any = "";
  searchLocationForm: FormGroup;
  currentPagesearchLocationList = 1;
  searchLocationItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  searchLocationtotalRecords: any;
  ifsearchLocationModal = false;
  searchLocationData: any;
  iflocationFill = false;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 0;
  searchkey: string;
  totalAreaListLength = 0;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  statusOptions = [
    { label: "Active", value: "Y", val: "ACTIVE" },
    { label: "Inactive", value: "N", val: "INACTIVE" },
    { label: "UnderDevelopment", value: "U", val: "UNDERDEVELOPMENT" }
  ];
  AclClassConstants;
  AclConstants;
  areaListData: any;
  public loginService: LoginService;
  pincodeListData: any;
  loginuser: any;
  cityListData: any;
  siteNameListData: any;
  listView: boolean = true;
  createView: boolean = true;
  customerrMyInventoryView: boolean = false;
  assignInventory: boolean;
  assignInventoryModal: boolean;
  serviceAreaId: any;
  macList: any[] = [];
  showQtySelectionError: boolean;
  showQtyError: boolean;
  assignedInventoryList:any[] = [];
  customerInventoryListDataCurrentPage = 1;
  customerInventoryListItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  assignInventoryWithSerial: boolean;
  customerInventoryListDataTotalRecords: number;
  inventoryStatusDetailsForReplace:any[] = [];
  customerInventoryMappingId: any;
  customerInventoryMappingIdForReplace: any;
  inventoryStatusDetails:any[] = [];
  inventoryStatusView = false;
  private assignInventoryCustomerId: any;
  assignedInventoryListWithSerial:any[] = [];
  customerInventoryDetailsListItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerInventoryDetailsListDataCurrentPage = 1;
  customerInventoryDetailsListDataTotalRecords: number;
  rejectInventoryData:any[] = [];
  approveInventoryData:any[] = [];
  availableQty: number;
  productHasMac: boolean;
  productHasSerial: boolean;
  viewAccess: boolean = false;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  inventoryAccess: boolean = false;
  polygonCreateAccess: boolean = false;
  polygonEditAccess: boolean = false;
  polygonDeleteAccess: boolean = false;
  polygonViewAccess: boolean = false;
  selectedMACAddress:any[] = [];
  inwardList: any[];
  assignInwardID: any;
  assignInwardForm: FormGroup;
  rejectInwardForm: FormGroup;
  assignInwardSubmitted: boolean = false;
  rejectInwardSubmitted: boolean = false;
  products:any[] = [];
  replaceProducts:any[] = [];
  unit: any;
  approveId: any;
  inwardId: any;
  userId: number = +localStorage.getItem("userId");
  MastertotalRecordsI: any;
  approved = false;
  reject = false;
  selectStaffReject: any;
  selectStaff: any;
  private oldMacMappingId: any;
  currentPageMasterSlabI = 1;
  MasteritemsPerPageI = RadiusConstants.ITEMS_PER_PAGE;
  workflowAuditDataI: any = [];
  AllcustApproveList: any = [];
  custChangeStatusConfigitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  currentPagecustChangeStatusConfig = 1;
  custChangeStatusConfigtotalRecords: String;
  changeStatusShowItemPerPage = 1;
  customerId = 9616;
  showReplacementForm = false;
  pincodeDetail: any;
  locationDetail: any;
  locationDetails: any;
  areaInputview: boolean = false;
  inventoryServiceAreaData: any = "";
  status = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" }
  ];
  inventoryType: any = "Service Area";
  isMapModelEnable: boolean = false;
  isAllPolygoneModelShow: boolean = false;

  lat = 23.16774596751141;
  lng = 72.39140613721185;
  zoom = 7;
  location: string = "";

  devicesLocations: any = [];

  drawingManager: any;
  mArea: any;
  isClearShow: boolean = false;
  drawnPolygonLatLongList: any[] = [];
  map: any;
  polygonMap: google.maps.Polygon;
  markers: marker[] = [];
  uploadDocForm: FormGroup;
  selectedFileUploadPreview: File[] = [];
  selectedFile: any;
  isBuldUpload: boolean = false;
  serviceAreaType = [
    { label: "Public", value: "public" },
    { label: "Private", value: "private" }
  ];
  isSiteNameAvailable: boolean = false;
  isUploadView: boolean = false;
  loggedInUserMvnoId: number;
  ispListData: any[] = [];
  isViewServiceArea: boolean = false;
  items: any[];
  locationDataByPlan: any = [];

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    private messageService: MessageService,
    private serviceAreaService: ServiceAreaService,
    loginService: LoginService,
    private customerInventoryMappingService: CustomerInventoryMappingService,
    private inwardService: InwardService,
    private productService: ProuctManagementService,
    private customerManagementService: CustomermanagementService,
    private citymanagementService: CityManagementService,
    private pincodemanagementService: PincodeManagementService,
    private locationService: LocationService
  ) {
    this.viewAccess = loginService.hasPermission(MASTERS.SERVICE_AREA);
    this.createAccess = loginService.hasPermission(MASTERS.SERVICE_AREA_CREATE);
    this.deleteAccess = loginService.hasPermission(MASTERS.SERVICE_AREA_DELETE);
    this.editAccess = loginService.hasPermission(MASTERS.SERVICE_AREA_EDIT);
    this.inventoryAccess = loginService.hasPermission(MASTERS.SERVICE_AREA_INVENTORY);
    this.polygonViewAccess = loginService.hasPermission(MASTERS.POLYGON);
    this.polygonCreateAccess = loginService.hasPermission(MASTERS.POLYGON_CREATE);
    this.polygonEditAccess = loginService.hasPermission(MASTERS.POLYGON_EDIT);
    this.polygonDeleteAccess = loginService.hasPermission(MASTERS.POLYGON_DELETE);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    // this.isserviceAreaEdit = !this.createAccess && this.editAccess ? true : false;
    this.availableQty = 0;
    this.inventoryAssignForm = this.fb.group({
      id: [""],
      qty: ["", [Validators.required, Validators.pattern(Regex.numeric), Validators.min(0)]],
      productId: ["", Validators.required],
      ownerId: [this.id],
      ownertype: ["Service Area"],
      // customerId: [this.serviceAreaId],
      staffId: [""],
      inwardId: ["", Validators.required],
      assignedDateTime: [new Date(), Validators.required],
      status: ["", Validators.required],
      mvnoId: [""]
    });

    this.serviceAreaGroupForm = this.fb.group(
      {
        id: [""],
        selectedPincodes: [null],
        name: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
        pincodes: ["", Validators.required],
        createdById: [""],
        siteName: ["", Validators.required],
        lastModifiedById: [""],
        status: ["", Validators.required],
        isDeleted: [0],
        latitude: [""],
        longitude: [""],
        radius: [""],
        areaid: [""],
        cityid: ["", Validators.required],
        serviceAreaType: [""],
        blockNo: [""],
        mvnoIds: [[]],
        locationIds: [[]]
      },
      { validator: this.customValidator }
    );

    this.items = [
      {
        label: "CSV",
        command: () => {
          this.downloadCsv();
        }
      },
      {
        label: "KML",
        command: () => {
          this.downloadKML();
        }
      }
    ];
  }

  customValidator(formGroup: FormGroup) {
    const latitude = formGroup.get("latitude");
    const longitude = formGroup.get("longitude");
    const radius = formGroup.get("radius");

    if (latitude.value || longitude.value || radius.value) {
      if (!latitude.value) {
        latitude.setErrors({ required: true });
      }
      if (!longitude.value) {
        longitude.setErrors({ required: true });
      }
    } else {
      latitude.setErrors(null);
      longitude.setErrors(null);
    }
  }

  ngOnInit(): void {
    // this.serviceAreaGroupForm = this.fb.group({
    //   id: [""],
    //   selectedPincodes: [null],
    //   name: ["", Validators.required],
    //   pincodes: ["", Validators.required],
    //   createdById: [""],
    //   lastModifiedById: [""],
    //   status: ["", Validators.required],
    //   isDeleted: [0],
    //   latitude: [""],
    //   longitude: [""],
    //   radius: [""],
    //   areaid: [""],
    //   cityid: ["", Validators.required],
    // });
    this.loggedInUserMvnoId = parseInt(localStorage.getItem("mvnoId"));
    this.productService.getAllNBAndNAProducts().subscribe((res: any) => {
      this.products = res.dataList;
    });
    this.assignInwardForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.rejectInwardForm = this.fb.group({
      remark: ["", Validators.required]
    });

    this.inventoryAssignForm.get("qty").valueChanges.subscribe(val => {
      const total = this.availableQty - val;
      if (total < 0) {
        this.showQtyError = true;
      } else {
        this.showQtyError = false;
      }

      if (this.productHasMac == true && this.selectedMACAddress.length > val) {
        this.showQtySelectionError = true;
      } else {
        this.showQtySelectionError = false;
      }
    });
    this.searchData = {
      filter: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ]
    };

    this.searchObject = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ]
    };
    this.getAreaList();
    this.getserviceAreaList("");
    this.getPincodeList();
    this.getCityList();
    this.getSiteNameList();

    this.searchLocationForm = this.fb.group({
      searchLocationname: ["", Validators.required]
    });
    this.uploadDocForm = this.fb.group({
      file: ["", Validators.required]
    });
    // this.inventoryAssignForm.get("qty").valueChanges.subscribe(val => {
    //   const total = this.availableQty - val;
    //   if (total < 0) {
    //     this.showQtyError = true;
    //   } else {
    //     this.showQtyError = false;
    //   }

    //   if (this.productHasMac == true && this.selectedMACAddress.length > val) {
    //     this.showQtySelectionError = true;
    //   } else {
    //     this.showQtySelectionError = false;
    //   }
    // });
    if (this.loggedInUserMvnoId === 1) {
      this.getISPList();
    }
    this.getAllLocation();
  }

  selectActionChange(_event: any) {
    // this.commonservice.addLoader();

    this.selectvalue = _event.value;
    console.log(this.selectvalue);
  }

  getAreaList() {
    const url = "/area/all";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.areaListData = response.dataList;
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

  getCityList() {
    const url = "/city/all";
    this.citymanagementService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.cityListData = response.cityList;
        console.log(this.cityListData);
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
  getSiteNameList() {
    const url = "/serviceArea/site/all";
    this.pincodemanagementService.getMethod(url).subscribe(
      (Response: any) => {
        this.siteNameListData = Response.SiteName.map((name:any) => ({ name: name }));
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

  getPincodeList() {
    const url = "/pincode/all";
    this.pincodemanagementService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.pincodeListData = response.dataList;
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

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageserviceAreaListdata > 1) {
      this.currentPageserviceAreaListdata = 1;
    }
    if (!this.searchkey) {
      this.getserviceAreaList(this.showItemPerPage);
    } else {
      this.searchserviceArea();
    }
  }

  getserviceAreaList(list:any) {
    let size;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;

    let page_list = this.currentPageserviceAreaListdata;
    if (list) {
      size = list;
      this.serviceAreaListdataitemsPerPage = list;
    } else {
      // if (this.showItemPerPage == 0) {
      //   this.serviceAreaListdataitemsPerPage = this.pageITEM
      // } else {
      //   this.serviceAreaListdataitemsPerPage = this.showItemPerPage
      // }
      size = this.serviceAreaListdataitemsPerPage;
    }
    const url = "/serviceArea/all";
    let servicearedata = {
      page: this.currentPageserviceAreaListdata,
      pageSize: size
    };
    this.serviceAreaService.postMethod(url, servicearedata).subscribe(
      (response: any) => {
        this.serviceAreaListData = response.dataList;
        this.serviceAreaListDataselector = response.dataList;
        this.serviceAreaListdatatotalRecords = response.totalRecords;
        //console.log('serviceAreaListData', this.serviceAreaListData)
        // if (this.showItemPerPage > this.serviceAreaListdataitemsPerPage) {
        //   this.totalAreaListLength =
        //     this.serviceAreaListData.length % this.showItemPerPage
        // } else {
        //   this.totalAreaListLength =
        //     this.serviceAreaListData.length %
        //     this.serviceAreaListdataitemsPerPage
        // }
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

  addEditserviceArea(serviceAreaId:any): void {
    this.submitted = true;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    if (this.serviceAreaGroupForm.valid) {
      if (serviceAreaId) {
        const url = "/serviceArea/update";
        this.createserviceAreaData = this.serviceAreaGroupForm.value;
        this.createserviceAreaData.polyGoneList = this.drawnPolygonLatLongList;
        this.createserviceAreaData.isDeleted = false;
        const selectedPincodes = this.serviceAreaGroupForm.value.pincodes || [];
        this.pincodeOptions = this.pincodeDetail.map((pincode:any) => ({
          pincode: pincode.pincode,
          id: pincode.id,
          selected: selectedPincodes.includes(pincode.id)
        }));
        console.log("update data....", this.createserviceAreaData);
        this.serviceAreaService.postMethod(url, this.createserviceAreaData).subscribe(
          (response: any) => {
            if (response.responseCode == 406 || response.responseCode == 417) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.submitted = false;
              this.isserviceAreaEdit = false;
              this.areaInputview = false;
              this.viewserviceAreaListData = [];
              this.loginService.refreshToken();
              this.clearDrawnData();
              this.getSiteNameList();
              this.commondropdownService.clearCache("/serviceArea/all");
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.msg,
                icon: "far fa-check-circle"
              });
              this.serviceAreaGroupForm.reset();
              this.getserviceAreaList("");
            }
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
      } else {
        const url = "/serviceArea/save";
        const selectedPincodes = this.serviceAreaGroupForm.value.pincodes || [];
        this.pincodeOptions = this.pincodeDetail.map((pincode:any) => ({
          pincode: pincode.pincode,
          id: pincode.id,
          selected: selectedPincodes.includes(pincode.id)
        }));
        this.createserviceAreaData = this.serviceAreaGroupForm.value;
        console.log("////////////////", this.createserviceAreaData);
        this.createserviceAreaData.polyGoneList = this.drawnPolygonLatLongList;
        this.createserviceAreaData.isDeleted = false;
        this.createserviceAreaData.createdById = this.loginuser;
        this.createserviceAreaData.mvnoId = JSON.parse(localStorage.getItem("mvnoId"));
        console.log("data...", this.createserviceAreaData);
        this.serviceAreaService.postMethod(url, this.createserviceAreaData).subscribe(
          (response: any) => {
            if (response.responseCode == 406 || response.responseCode == 417) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.submitted = false;
              this.areaInputview = false;
              this.serviceAreaGroupForm.reset();
              this.clearDrawnData();
              this.commondropdownService.clearCache("/serviceArea/all");
              this.getSiteNameList();
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.responseMessage,
                icon: "far fa-check-circle"
              });
              this.loginService.refreshToken();
              const serviceArea: any = localStorage.getItem("serviceArea");
              let serviceAreaArray = JSON.parse(serviceArea);
              console.log(JSON.stringify(serviceAreaArray));
              serviceAreaArray.push(response.data.id);
              localStorage.setItem("serviceArea", JSON.stringify(serviceAreaArray));
              this.getserviceAreaList("");

              this.pincodeDetail = "";
            }
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
    }
    this.pincodeListData = "";
  }

  editserviceArea(serviceAreaId: any): void {
    if (serviceAreaId) {
      this.areaInputview = true;
      this.customerrMyInventoryView = false;
      this.assignInventoryWithSerial = false;
      this.siteNameListData = [];
      this.clearDrawnData();
      const url = "/serviceArea/" + serviceAreaId;
      this.serviceAreaService.getMethod(url).subscribe(
        (response: any) => {
          if (this.isViewServiceArea) {
            this.isserviceAreaEdit = false;
          } else {
            this.isserviceAreaEdit = true;
          }
          this.viewserviceAreaListData = response.data;
          if (this.viewserviceAreaListData.siteName?.length > 0) {
            this.siteNameListData.push({ name: this.viewserviceAreaListData.siteName });
          }
          if (
            this.viewserviceAreaListData.polyGoneList &&
            this.viewserviceAreaListData.polyGoneList.length > 0
          ) {
            this.drawnPolygonLatLongList = this.viewserviceAreaListData.polyGoneList.map((poly:any) => ({
              lat: poly.lat,
              lng: poly.lng,
              polyOrder: poly.polyOrder
            }));
            this.drawingManager.setDrawingMode(null);
            this.drawPolygon(this.map, this.viewserviceAreaListData.polyGoneList);
            this.isClearShow = true;
          } else {
            this.drawingManager.setDrawingMode(null);
            if (this.viewserviceAreaListData.siteName) {
              this.getPolygonListBySiteName(this.viewserviceAreaListData.siteName);
            }
          }
          this.serviceAreaGroupForm.patchValue(this.viewserviceAreaListData);
          let mvnoids = this.viewserviceAreaListData.mvnoIds
            ? this.viewserviceAreaListData.mvnoIds
            : [];
          this.serviceAreaGroupForm.patchValue({
            mvnoIds: mvnoids
          });

          const selectedPincodes = this.viewserviceAreaListData.selectedPincodes || [];

          if (Array.isArray(this.pincodeDetail)) {
            this.pincodeOptions = this.pincodeDetail.map(pincode => ({
              pincode: pincode.pincode,
              id: pincode.id,
              selected: selectedPincodes ? selectedPincodes.includes(pincode.id) : false
            }));
          } else {
            // Handle the case when this.pincodeDetail is not an array
          }

          this.getSelCity({ value: this.serviceAreaGroupForm.value.cityid });
          this.getLocationDetailByServiceArea(serviceAreaId);
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
  }

  canExit() {
    if (!this.serviceAreaGroupForm.dirty) return true;
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

  deleteConfirmonserviceArea(serviceArea: number) {
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    if (serviceArea) {
      this.confirmationService.confirm({
        message: "Do you want to delete this serviceArea?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteserviceArea(serviceArea);
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
  }

  deleteserviceArea(data:any) {
    let servicedata = {
      createdById: data.createdById,
      createdByName: data.createdByName,
      createdate: data.createdate,
      id: data.id,
      isDeleted: data.isDeleted,
      lastModifiedById: data.lastModifiedById,
      lastModifiedByName: data.lastModifiedByName,
      name: data.name,
      status: data.status,
      updatedate: data.updatedate,
      latitude: data.latitude,
      longitude: data.longitude,
      radius: data.radius,
      areaid: data.areaid,
      mvnoId: data.mvnoId
    };

    const url = "/serviceArea/delete";
    this.serviceAreaService.postMethod(url, servicedata).subscribe(
      (response: any) => {
        if (this.currentPageserviceAreaListdata != 1 && this.totalAreaListLength == 1) {
          this.currentPageserviceAreaListdata = this.currentPageserviceAreaListdata - 1;
        }
        if (
          response.responseCode == 405 ||
          response.responseCode == 406 ||
          response.responseCode == 417
        ) {
          this.messageService.add({
            severity: "info",
            summary: "info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          this.loginService.refreshToken();
        }
        this.clearSearchserviceArea();
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

  pageChangedserviceAreaList(pageNumber:any) {
    this.currentPageserviceAreaListdata = pageNumber;
    if (!this.searchkey) {
      this.getserviceAreaList("");
    } else {
      this.searchserviceArea();
    }
  }

  pageChangedareaName(pageNumber:any) {
    this.currentPageareaName = pageNumber;
  }

  searchserviceArea() {
    if (!this.searchkey || this.searchkey !== this.searchName) {
      this.currentPageserviceAreaListdata = 1;
    }
    this.searchkey = this.searchName;
    if (this.showItemPerPage) {
      this.pageITEM = this.showItemPerPage;
      this.serviceAreaListdataitemsPerPage = this.showItemPerPage;
    }

    this.searchObject.filters[0].filterValue = this.searchName.trim();
    console.log(this.showItemPerPage);

    this.searchObject.page = this.currentPageserviceAreaListdata;
    this.searchObject.pageSize = this.pageITEM;
    // const url = '/serviceArea/search'

    // const url =
    //   "/serviceArea/search?page=" +
    //   this.currentPageserviceAreaListdata +
    //   "&pageSize=" +
    //   this.pageITEM +
    //   "&sortBy=createdate&sortOrder=0";
    //console.log("this.searchData", this.searchData)

    const url = "/serviceArea/all";
    this.serviceAreaService.postMethod(url, this.searchObject).subscribe(
      (response: any) => {
        if (response.responseCode == 404 || response.responseCode == 204) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          this.serviceAreaListData = [];
          this.serviceAreaListdatatotalRecords = 0;
        } else {
          this.serviceAreaListData = response.dataList;
          this.serviceAreaListDataselector = response.dataList;
          this.serviceAreaListdatatotalRecords = response.totalRecords;
        }
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

    // const url = '/serviceArea/all'
    // this.serviceAreaService.getMethod(url).subscribe((response: any) => {
    //   this.serviceAreaListData1 = response.dataList
    // })

    // this.serviceAreaGroupForm = this.serviceAreaListData1
    // this.temp = [...this.serviceAreaListData1]
    // let valueobj = {}

    // if (this.searchName) {
    //   valueobj['name'] = this.searchName
    // }

    // let filterdata = _.filter(this.serviceAreaGroupForm, valueobj)
    // this.serviceAreaListData = filterdata
    // this.temp = filterdata
  }

  clearSearchserviceArea() {
    this.pincodeDetail = "";
    this.listView = true;
    this.createView = true;
    this.customerrMyInventoryView = false;
    this.searchName = "";
    this.submitted = false;
    this.serviceAreaGroupForm.reset();
    this.isserviceAreaEdit = false;
    this.areaInputview = false;
    this.viewserviceAreaListData = [];
    this.isViewServiceArea = false;
    this.getserviceAreaList("");
    this.clearDrawnData();
    this.getSiteNameList();
  }
  getSAData() {
    this.listView = true;
    this.createView = true;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
  }
  customerDetailOpen() {
    this.listView = true;
    this.createView = true;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
  }

  mylocation() {
    // this.spinner.show()
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        if (position) {
          // console.log(
          //   'Latitude: ' +
          //     position.coords.latitude +
          //     'Longitude: ' +
          //     position.coords.longitude,
          // )
          this.serviceAreaGroupForm.patchValue({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          this.iflocationFill = true;
        }
      });
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Geolocation is not supported by this browser.",
        icon: "far fa-times-circle"
      });
    }
  }
  openSearchModel() {
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    this.ifsearchLocationModal = true;
    this.currentPagesearchLocationList = 1;
  }
  searchLocation() {
    if (this.searchLocationForm.valid) {
      const url =
        "/serviceArea/getPlaceId?query=" + this.searchLocationForm.value.searchLocationname;
      this.serviceAreaService.getMethod(url).subscribe(
        (response: any) => {
          this.searchLocationData = response.locations;
        },
        (error: any) => {
          if (error.error.code == 422) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.error,
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
        }
      );
    }
  }

  clearLocationForm() {
    this.searchLocationForm.reset();
    this.searchLocationData = [];
  }

  pageChangedSearchLocationList(currentPage:any) {
    this.currentPagesearchLocationList = currentPage;
  }

  filedLocation(placeId:any) {
    const url = "/serviceArea/getLatitudeAndLongitude?placeId=" + placeId;
    this.serviceAreaService.getMethod(url).subscribe(
      (response: any) => {
        this.ifsearchLocationModal = false;
        this.serviceAreaGroupForm.patchValue({
          latitude: response.location.latitude,
          longitude: response.location.longitude
        });

        this.iflocationFill = true;
        this.closebutton.nativeElement.click();
        this.searchLocationData = [];
        this.searchLocationForm.reset();
      },
      (error: any) => {
        // console.log(error, 'error')
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  clearsearchLocationData() {
    this.searchLocationData = [];
    this.ifsearchLocationModal = false;
    this.searchLocationForm.reset();
  }

  // openMyInventory(id): void {
  //   this.listView = false;
  //   this.createView = false;
  //   this.customerrMyInventoryView = true;
  //   // this.getCustomerAssignedList(id);
  //   // this.assignInventoryCustomerId = id;
  // }

  // assignInventoryToCustomer(id): void {
  //   this.assignInventory = true;
  //   this.serviceAreaId = id;
  //   this.macList = [];
  //   this.inventoryAssignForm.reset();
  //   this.showQtySelectionError = false;
  //   this.showQtyError = false;
  // }

  // getCustomerAssignedList(id): void {
  //
  //   const data = {
  //     filters: [
  //       {
  //         filterValue: id,
  //         filterColumn: "customerId",
  //       },
  //     ],
  //     page: 1,
  //     pageSize: 5,
  //     sortBy: "createdate",
  //     sortOrder: 0,
  //   };
  //   data.page = this.customerInventoryListDataCurrentPage;
  //   data.pageSize = this.customerInventoryListItemsPerPage;

  //   this.customerInventoryMappingService.getByCustomerId(data).subscribe(
  //     (res: any) => {
  //       this.assignInventoryWithSerial = false;
  //       this.assignedInventoryList = res.dataList;
  //       this.customerInventoryListDataTotalRecords = res.totalRecords;
  //
  //     },
  //     (error: any) => {
  //       this.messageService.add({
  //         severity: "error",
  //         summary: "Error",
  //         detail: error.error.msg,
  //         icon: "far fa-times-circle",
  //       });
  //
  //     }
  //   );
  // }
  pageChangedMasterListI(pageNumber:any) {
    this.currentPageMasterSlabI = pageNumber;
  }

  getOutWardList(productID:any) {
    const staffId = localStorage.getItem("userId");
    this.inwardList = [];
    this.inwardService
      .getAllInwardByProductAndStaffforpopandserivearea(productID, staffId)
      .subscribe(
        (res: any) => {
          this.inwardList = res.dataList;
          this.productHasMac = this.products.find(element => element.id == productID).hasMac;
          this.productHasSerial = this.products.find(element => element.id == productID).hasSerial;
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

  openMyInventory(data:any): void {
    this.inventoryServiceAreaData = data;
    this.id = data.id;
    this.listView = false;
    this.createView = false;
    this.customerrMyInventoryView = true;
    this.assignInventoryCustomerId = data.id;
    this.assignInventoryWithSerial = false;
  }

  replaceInventorySubmit(): void {
    const mappingList: any[] = this.macList.filter(val => this.selectedMACAddress.includes(val));
    if (mappingList.length < 1) {
      this.messageService.add({
        severity: "info",
        summary: "Information",
        detail: "Please select at least/only one product for replacement.",
        icon: "far fa-check-circle"
      });
      return;
    } else {
      const url = `/inwards/replaceInventoryFromEndOwner?oldMacMappingId=${this.oldMacMappingId}&newMacMappingId=${mappingList[0].id}`;
      this.customerInventoryMappingService.getMethod(url).subscribe(
        (res: any) => {
          this.assignedInventoryListWithSerial = [];
          this.getCustomerAssignedList(this.assignInventoryCustomerId);
          this.assignInventoryWithSerial = false;

          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Assigned inventory successfully.",
            icon: "far fa-check-circle"
          });
        },
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Error",
            icon: "far fa-check-circle"
          });
        }
      );
    }
  }

  deleteOldMACMapping(id:any): void {
    const url = `/inoutWardMacMapping/removeMappingWithCustomerInventory?mappingId=${id}`;
    this.customerInventoryMappingService.getMethod(url).subscribe(
      (res: any) => {
        this.assignInventoryWithSerial = false;

        this.messageService.add({
          severity: "success",
          summary: "success",
          detail: "Replaced Successfully.",
          icon: "far fa-times-circle"
        });
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
  // removeInvantryFunction(id, ItemID) {
  //   const url = `/item/` + ItemID;
  //
  //   this.customerManagementService.getMethod(url).subscribe(
  //     (respose: any) => {
  //       if (respose.data.ownershipType == "Organization Owned") {
  //         this.removeInventory(id, "false");

  //         // $("#IdgraceDays").modal("hide");
  //         // this.graceNumberDays = "";
  //       } else {
  //         this.removeConfirmationInventory(id);
  //       }
  //
  //     },
  //     (error: any) => {
  //       this.messageService.add({
  //         severity: "error",
  //         summary: "Error",
  //         detail: error.error.msg,
  //         icon: "far fa-times-circle",
  //       });
  //
  //     }
  //   );
  // }

  getCustomerAssignedList(id:any): void {
    const data = {
      filters: [
        {
          filterValue: this.id,
          // filterValue: id,
          filterColumn: "Service Area"
        }
      ],
      page: 1,
      pageSize: 5,
      sortBy: "createdate",
      sortOrder: 0
    };
    data.page = this.customerInventoryListDataCurrentPage;
    data.pageSize = this.customerInventoryListItemsPerPage;

    this.inwardService.getByOwnerId(data).subscribe(
      (res: any) => {
        this.assignInventoryWithSerial = false;
        this.assignedInventoryList = res.dataList;
        this.customerInventoryListDataTotalRecords = res.totalRecords;
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

  replaceInventory(id:any): void {
    this.macList = [];
    this.inventoryAssignForm.reset();
    this.showReplacementForm = true;
    this.oldMacMappingId = id;
    this.customerId = this.assignInventoryCustomerId;
    this.getProductsToReplace(id);
  }

  getProductsToReplace(id:any) {
    const url = `/product/getAllProductsByMacSerial?macMappingId=${id}`;

    this.productService.getMethod(url).subscribe(
      (response: any) => {
        this.replaceProducts = response.dataList;
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

  assignToStaff(flag:any) {
    let url: any;
    let name: string;
    // if (this.isStatusChangeSubMenu) name = "TERMINATION";
    // else if (this.customerUpdateDiscount) name = "CUSTOMER_DISCOUNT";
    // else
    name = "CUSTOMER_INVENTORY_ASSIGN";

    if (flag) {
      url = `/teamHierarchy/assignFromStaffList?entityId=${this.approveId}&eventName=${name}&nextAssignStaff=${this.selectStaff}&isApproveRequest=${flag}`;
    } else {
      url = `/teamHierarchy/assignFromStaffList?entityId=${this.approveId}&eventName=${name}&nextAssignStaff=${this.selectStaffReject}&isApproveRequest=${flag}`;
    }

    this.customerInventoryMappingService.getMethod(url).subscribe(
      response => {
        if (flag) {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Approved Successfully.",
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Rejected Successfully.",
            icon: "far fa-times-circle"
          });
        }
        $("#assignCustomerInventoryModal").modal("hide");
        $("#rejectCustomerInventoryModal").modal("hide");
        // if (this.isStatusChangeSubMenu) this.getapproveStatusList("");
        // else if (this.customerUpdateDiscount)
        //   this.openCustorUpdateDiscount(this.customerLedgerDetailData.id);
        // else
        this.getCustomerAssignedList(this.assignInventoryCustomerId);
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  checkStatus(id:any, status:any): void {
    if (status === "Pending") {
      this.messageService.add({
        severity: "info",
        summary: "info",
        detail: "Assigned product is not eligible for replace.",
        icon: "far fa-times-circle"
      });
      return;
    }
    const url = `/teamHierarchy/getApprovalProgress?entityId=${id}&eventName=CUSTOMER_INVENTORY_ASSIGN`;

    this.customerInventoryMappingService.getMethod(url).subscribe(
      (res: any) => {
        this.inventoryStatusDetails = res.dataList;
        // this.inventoryStatusView = true;
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
    let page = this.currentPageMasterSlabI;
    let page_list;

    if (this.showItemPerPage == 0) {
      this.MasteritemsPerPageI = 5;
    } else {
      this.MasteritemsPerPageI = 5;
    }

    this.workflowAuditDataI = [];

    let data = {
      page: page,
      pageSize: this.MasteritemsPerPageI
    };

    let url1 = "/workflowaudit/list?entityId=" + id + "&eventName=" + "CUSTOMER_INVENTORY_ASSIGN";

    this.customerManagementService.postMethod(url1, data).subscribe(
      (response: any) => {
        this.workflowAuditDataI = response.dataList;
        this.MastertotalRecordsI = response.totalRecords;
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

  approveReplaceInventoryInventory(id:any, status:any): void {
    this.approveId = id;
    this.approved = false;
    this.approveInventoryData = [];
    this.selectStaff = null;
    let bool: boolean;
    if (status !== "PENDING") {
      bool = true;
    }
    const url = `/inwards/approveReplaceInventory?isApproveRequest=true&macMappingId=${id}&billAble=${bool}`;

    this.customerInventoryMappingService.getMethod(url).subscribe(
      (response: any) => {
        this.assignedInventoryListWithSerial = [];
        this.getCustomerAssignedList(this.assignInventoryCustomerId);
        this.assignInventoryWithSerial = false;
        if (response.dataList) {
          this.approved = true;
          this.approveInventoryData = response.dataList;
          $("#assignCustomerInventoryModal").modal("show");
        } else {
          this.getCustomerAssignedList(this.assignInventoryCustomerId);
        }

        this.getCustomerAssignedList(this.assignInventoryCustomerId);
        // this.customerInventoryListDataTotalRecords = res.totalRecords;
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

  checkStatusForRepalce(id:any): void {
    const url = `/teamHierarchy/getApprovalProgress?entityId=${id}&eventName=CUSTOMER_INVENTORY_ASSIGN`;

    this.customerInventoryMappingService.getMethod(url).subscribe(
      (res: any) => {
        this.inventoryStatusDetailsForReplace = res.dataList;
        // this.inventoryStatusView = true;
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

  rejectInventoryReplaceInventory(id:any): void {
    this.approveId = id;
    this.reject = false;
    this.selectStaffReject = null;
    this.rejectInventoryData = [];
    let bool: boolean;
    if (status !== "PENDING") {
      bool = true;
    }
    const url = `/inwards/approveReplaceInventory?isApproveRequest=false&macMappingId=${id}&billAble=${bool}`;

    this.customerInventoryMappingService.getMethod(url).subscribe(
      (response: any) => {
        this.assignedInventoryListWithSerial = [];
        this.getCustomerAssignedList(this.assignInventoryCustomerId);
        this.assignInventoryWithSerial = false;
        if (response.dataList) {
          this.reject = true;
          this.rejectInventoryData = response.dataList;
          $("#rejectCustomerInventoryModal").modal("show");
        } else {
          this.getCustomerAssignedList(this.assignInventoryCustomerId);
        }

        // this.customerInventoryListDataTotalRecords = res.totalRecords;
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

  getapproveStatusList(size:any) {
    let page_list;
    if (size) {
      page_list = size;
      this.custChangeStatusConfigitemsPerPage = size;
    } else {
      if (this.changeStatusShowItemPerPage == 1) {
        this.custChangeStatusConfigitemsPerPage = this.pageITEM;
      } else {
        this.custChangeStatusConfigitemsPerPage = this.changeStatusShowItemPerPage;
      }
    }
    this.AllcustApproveList = [];
    const url = `/allCustApprove/${this.customerId}`;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        const list = response.customer;
        // this.AllcustApproveList.push(list);
        for (let i = list.length; i > 0; i--) {
          this.AllcustApproveList.push(list[i - 1]);
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

  getSelCity(event:any) {
    const selCityId = event.value;
    this.getPincodeDetailbyId(selCityId);
  }

  getPincodeDetailbyId(selCityId:any) {
    this.pincodeDetail = "";

    const url = "/serviceArea/getPincodefromCity?id=" + selCityId;
    this.serviceAreaService.getMethod(url).subscribe(
      (response: any) => {
        this.pincodeDetail = response.dataList;
        if (this.pincodeDetail.length > 0) {
          const selectedPincodes = this.serviceAreaGroupForm.value.pincodes || [];
          this.pincodeOptions = this.pincodeDetail.map((pincode:any) => ({
            pincode: pincode.pincode,
            id: pincode.id,
            selected: selectedPincodes.includes(pincode.id)
          }));
          this.areaInputview = true;
        } else {
          this.pincodeOptions = [];
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "No " + this.pincodeTitle + " found.",
            icon: "far fa-times-circle"
          });
        }
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
  // Assuming you have a service called `serviceAreaService` with a method `getMethod` for making GET requests

  getLocationDetailByServiceArea(selServiceAreaId: number) {
    this.locationDetail = "";

    const url = `/serviceArea/getLocationFromServiceArea?id=${selServiceAreaId}`;
    this.serviceAreaService.getMethod(url).subscribe(
      (response: any) => {
        this.locationDetail = response.dataList;
        const selectedLocations = this.locationDetail.map((item: any) => item.locationId);
        console.log("selectedLocations before :::", this.locationDataByPlan);
        if (this.locationDetail.length > 0) {
          this.locationDataByPlan = this.locationDataByPlan.map((location:any) => ({
            name: location.name,
            locationMasterId: location.locationMasterId,
            selected: selectedLocations.includes(location.locationMasterId)
          }));
          this.serviceAreaGroupForm.patchValue({
            locationIds: selectedLocations
          });

          console.log("selectedLocations", this.locationDataByPlan);
          const selectedPincodes = this.serviceAreaGroupForm.value.pincodes || [];
          console.log("selectedPincodes", selectedPincodes);
          this.areaInputview = true;
        } else {
          this.locationOptions = [];
          this.serviceAreaGroupForm.patchValue({
            locationIds: []
          });
          //   this.messageService.add({
          //     severity: "info",
          //     summary: "Info",
          //     detail: "No locations found.",
          //     icon: "far fa-times-circle"
          //   });
        }
      },
      (error: any) => {
        console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.message || "An error occurred while fetching location details.",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getAllLocation() {
    console.log("getalllocation call...");
    console.log(
      " this.locationService.getAllActiveLocation()",
      this.locationService.getAllActiveLocation()
    );
    this.locationService.getAllActiveLocation().subscribe((response: any) => {
      this.locationDataByPlan = response.locationMasterList.map((location:any) => ({
        name: location.name,
        locationMasterId: location.locationMasterId
      }));
      console.log("location", location);
    });
  }

  approveChangeStatus(id:any) {
    $("#approveChangeStatusModal").modal("show");
    this.assignInwardID = id;
  }

  rejectChangeStatus(id:any) {
    $("#rejectChangeStatusModal").modal("show");
    this.assignInwardID = id;
  }

  closeApproveInventoryModal() {
    this.assignInwardSubmitted = false;
    this.assignInwardForm.reset();
    $("#approveChangeStatusModal").modal("hide");
  }

  closeRejectInventoryModal() {
    this.rejectInwardSubmitted = false;
    this.rejectInwardForm.reset();
    $("#rejectChangeStatusModal").modal("hide");
  }

  radiusKeyPress(input:any) {
    var num = String.fromCharCode(input.which);
    const charStr = String.fromCharCode(input.which);

    if (
      !/^\d$/.test(charStr) &&
      charStr !== "0" &&
      charStr !== "1" &&
      charStr !== "2" &&
      charStr !== "3" &&
      charStr !== "4" &&
      charStr !== "5" &&
      charStr !== "6" &&
      charStr !== "7" &&
      charStr !== "8" &&
      charStr !== "9" &&
      charStr !== "."
    ) {
      event.preventDefault();
    } else {
    }
  }

  DrawPolygon() {
    this.isMapModelEnable = true;
    if (this.drawnPolygonLatLongList.length > 0) {
      this.isUploadView = false;
    } else {
      this.isUploadView = true;
    }
  }

  hideMapModel() {
    this.isMapModelEnable = false;
    this.location = "";
  }

  savePolygon() {
    console.log("save polygon");
    this.isMapModelEnable = false;
  }

  onMapReady(map:any) {
    this.map = map;
    this.initDrawingManager(map);
  }

  initDrawingManager(map: any) {
    this.drawingManager = "";
    let drawingControl: boolean = false;
    if (this.polygonCreateAccess) {
      drawingControl = true;
    } else {
      drawingControl = false;
    }

    const options = {
      drawingControl: drawingControl,
      drawingControlOptions: {
        drawingModes: ["polygon"]
      },

      polygonOptions: {
        draggable: false,
        editable: false,
        fillColor: "#FF0000", // Set fill color to red
        strokeColor: "#FF0000", // Set stroke color to red
        strokeOpacity: 0.8,
        strokeWeight: 2
      },

      drawingMode: google.maps.drawing.OverlayType.POLYGON
    };

    this.drawingManager = new google.maps.drawing.DrawingManager(options);
    this.drawingManager.setMap(map);

    if (!this.polygonCreateAccess) {
      this.drawingManager.setDrawingMode(null);
    }

    google.maps.event.addListener(this.drawingManager, "overlaycomplete", (event:any) => {
      if (event.type === google.maps.drawing.OverlayType.POLYGON) {
        this.drawnPolygonLatLongList = [];

        const len = event.overlay.getPath().getLength();

        for (let i = 0; i < len; i++) {
          const vertex = event.overlay.getPath().getAt(i);
          const vertexLatLng = { lat: vertex.lat(), lng: vertex.lng(), polyOrder: i + 1 };
          this.drawnPolygonLatLongList.push(vertexLatLng);
        }

        this.drawingManager.setDrawingMode(null);
        this.mArea = event.overlay;
        // To hide:
        this.drawingManager.setOptions({
          drawingControl: false
        });
        this.isClearShow = true;
      }
    });
  }

  drawPolygon(map:any, polygonList:any) {
    let polygonArrays:any[] = [];
    let polys = [];
    var currentZoom = map.getZoom();
    map.setZoom(18);

    polys = polygonList.map((poly:any) => ({
      lat: Number(poly.lat),
      lng: Number(poly.lng)
    }));

    this.lat = polys[0].lat;
    this.lng = polys[0].lng;
    this.drawingManager.setOptions({
      drawingControl: false
    });
    this.polygonMap = new google.maps.Polygon({
      map: map,
      paths: polys,
      strokeColor: "#FF8C00",
      fillColor: "#FF8C00",
      strokeOpacity: 0.8,
      strokeWeight: 2
    });

    this.polygonMap.setMap(map);


    google.maps.event.addListener(this.polygonMap, "click", (event: any) => {
      for (let i in polygonArrays) {
        polygonArrays[i].setOptions({ fillColor: "#FF8C00" });
        polygonArrays[i].setOptions({ strokeColor: "#FF8C00" });
      }
      this.polygonMap.setOptions({ fillColor: "#000" });
      this.polygonMap.setOptions({ strokeColor: "#000" });
    });
    

    polygonArrays.push(this.polygonMap);

    // this.checkPoint(polygonArrays);
  }

  //   checkPoint(polygonArray): void {
  //     const clickedPoint = new google.maps.LatLng("23.167627603897987", "72.37964733289056");

  //     let insidePolygon = false;

  //     polygonArray.forEach(polygon => {
  //       if (google.maps.geometry.poly.containsLocation(clickedPoint, polygon)) {
  //         insidePolygon = true;
  //       }
  //     });

  //     if (insidePolygon) {
  //       console.log("The entered point is inside a polygon.");
  //     } else {
  //       console.log("The entered point is outside all polygons.");
  //     }
  //   }

  clearDrawnData() {
    if (this.mArea) {
      this.mArea.setMap(null);
    }

    if (this.polygonMap) {
      this.polygonMap.setMap(null);
    }
    if (!this.polygonCreateAccess) {
      this.drawingManager.setOptions({
        drawingControl: false
      });
      this.drawingManager.setDrawingMode(null);
    } else {
      this.drawingManager.setOptions({
        drawingControl: true
      });
    }
    this.isClearShow = false;

    this.drawnPolygonLatLongList = [];
    this.isUploadView = true;
  }

  handleAddressChange(address: any) {
    this.lat = address.geometry.location.lat();
    this.lng = address.geometry.location.lng();
    this.zoom = 20;
    this.markers = [];
    this.markers.push({
      lat: address.geometry.location.lat(),
      lng: address.geometry.location.lng(),
      draggable: false
    });
  }

  onKeyName(event:any) {
    if (!this.isserviceAreaEdit) {
      this.serviceAreaGroupForm.patchValue({
        siteName: this.serviceAreaGroupForm.value.name
      });
      this.checkSiteNameExistOrNot(this.serviceAreaGroupForm.value.siteName);
    }
  }

  downloadCsv() {
    let siteName = this.serviceAreaGroupForm.value.siteName;
    const url = "/serviceArea/getCsvFromPolygon/" + siteName;
    this.serviceAreaService.getMethod(url).subscribe(
      (response: any) => {
        const csvData = this.convertToCSV(response.data);
        this.downloadFile(csvData, siteName + ".csv");
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

  convertToCSV(data: string): string {
    const rows = data.split("\n");
    let csv = "";
    for (const row of rows) {
      csv += row + "\n";
    }
    return csv;
  }

  downloadFile(data: string, filename: string) {
    const file = new Blob([data], { type: "text/csv" });
    const fileURL = URL.createObjectURL(file);
    // FileSaver.saveAs(file, filename);
  }

  uploadPolygonDocument() {
    this.uploadDocForm.patchValue({
      file: ""
    });
    this.selectedFileUploadPreview = [];
    this.isBuldUpload = true;
  }

  uploadPolygonFile() {
    this.drawPolygon(this.map, this.drawnPolygonLatLongList);
    this.isClearShow = true;
    this.isBuldUpload = false;
    this.uploadDocForm.patchValue({
      file: ""
    });
    this.selectedFileUploadPreview = [];
    this.isUploadView = false;
    this.drawingManager.setDrawingMode(null);
  }

  deletUploadedFile(event: any) {
    var temp: File[] = this.selectedFileUploadPreview?.filter((item: File) => item?.name != event);
    this.selectedFileUploadPreview = temp;
    this.uploadDocForm.patchValue({
      file: temp
    });
    this.drawnPolygonLatLongList = [];
  }

  closeUploadDocumentId() {
    this.isBuldUpload = false;
    this.uploadDocForm.patchValue({
      file: ""
    });
    this.selectedFileUploadPreview = [];
    this.drawnPolygonLatLongList = [];
  }

  onSiteNameChange(event:any) {
    let siteName = this.serviceAreaGroupForm.value.siteName;
    if (!this.isserviceAreaEdit) {
      this.checkSiteNameExistOrNot(siteName);
    }
  }

  checkSiteNameExistOrNot(siteName:any) {
    if (siteName) {
      let url = `/serviceArea/isSiteNameExists/${siteName}`;
      this.serviceAreaService.getMethod(url).subscribe(
        (response: any) => {
          if (response.data) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: "Site Name is not available",
              icon: "far fa-times-circle"
            });
            this.isSiteNameAvailable = false;
          } else {
            this.isSiteNameAvailable = true;
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

  getPolygonListBySiteName(siteName:any) {
    if (siteName) {
      let url = `/serviceArea/getPolygonFromServiceArea/${siteName}`;
      this.serviceAreaService.getMethod(url).subscribe(
        (response: any) => {
          if (response.dataList && response.dataList.length > 0) {
            this.drawnPolygonLatLongList = response.dataList.map((poly:any) => ({
              lat: poly.lat,
              lng: poly.lng,
              polyOrder: poly.polyOrder
            }));
            this.drawPolygon(this.map, response.dataList);
          }
        },
        (error: any) => {}
      );
    }
  }

  sieNameChange(event:any) {
    let siteName = this.serviceAreaGroupForm.value.siteName;
    if (!this.isserviceAreaEdit) {
      this.getPolygonListBySiteName(siteName);
    }
  }

  showAllPolygons() {
    this.isAllPolygoneModelShow = true;
  }

  hideAllPolygonModel() {
    this.isAllPolygoneModelShow = false;
  }

  serviceAreaTypeChange(event: any) {
    let selectedType = event.value;
    if (selectedType === "private") {
      this.serviceAreaGroupForm.get("blockNo").setValidators([Validators.required]);
      this.serviceAreaGroupForm.get("blockNo").updateValueAndValidity();
    } else {
      this.serviceAreaGroupForm.get("blockNo").clearValidators();
      this.serviceAreaGroupForm.get("blockNo").updateValueAndValidity();
    }
  }

  getISPList() {
    let url = `/mvno/getMvnoNameAndIds`;
    this.serviceAreaService.getMethod(url).subscribe(
      (response: any) => {
        this.ispListData = response.dataList.filter((isp:any) => isp.name != "superadmin");
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

  handleKeyDown(event: KeyboardEvent) {
    if (
      event.keyCode === 8 ||
      (event.key >= "0" && event.key <= "9") // Allow only one decimal point
    ) {
      return true; // Allow the input
    } else {
      return false; // Prevent the input for other keys
    }
  }

  viewEditServiceArea(serviceAreaId:any, isServiceAreaView:any) {
    this.isViewServiceArea = isServiceAreaView;
    this.editserviceArea(serviceAreaId);
  }

  onFileChangeUpload(event: any) {
    this.selectedFileUploadPreview = [];
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      const files: FileList = event.target.files;

      for (let i = 0; i < files.length; i++) {
        this.selectedFileUploadPreview.push(files.item(i));
      }

      if (this.selectedFile) {
        const file = this.selectedFile;

        if (this.isValidCSVFile(file)) {
          this.readCSVFile(file);
        } else if (this.isValidKMLFile(file)) {
          this.readKMLFile(file);
        } else {
          this.uploadDocForm.controls['file'].reset();
          this.selectedFileUploadPreview = [];
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "Please upload a valid .csv or .kml file",
            icon: "far fa-times-circle"
          });
        }
      }
    }
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  isValidKMLFile(file: any) {
    return file.name.endsWith(".kml");
  }

  readCSVFile(file: File) {
    const reader: FileReader = new FileReader();
    reader.readAsText(file);

    reader.onload = e => {
      const csv = reader.result as string;
      this.drawnPolygonLatLongList = this.parseCsvToJson(csv);
    };

    reader.onerror = e => {
      console.error("Error reading CSV file");
    };
  }

  readKMLFile(file: File) {
    const reader: FileReader = new FileReader();
    reader.readAsText(file);

    reader.onload = e => {
      const kmlText = reader.result as string;
      this.drawnPolygonLatLongList = this.parseKmlToJson(kmlText);
    };

    reader.onerror = e => {
      console.error("Error reading KML file");
    };
  }

  parseCsvToJson(csv: string): any[] {
    const lines: string[] = csv.trim().split("\n");
    const jsonData: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const data: string[] = lines[i].split(",");
      const entry: any = {
        lat: parseFloat(data[0].trim()),
        lng: parseFloat(data[1].trim()),
        polyOrder: i
      };
      jsonData.push(entry);
    }

    return jsonData;
  }

  parseKmlToJson(kmlText: string): any[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(kmlText, "application/xml");
    const coordinatesElements = xmlDoc.getElementsByTagName("coordinates");
    const coordinates:any[] = [];

    for (let i = 0; i < coordinatesElements.length; i++) {
      const coordText = coordinatesElements[i].textContent;
      if (coordText) {
        const coordArray = coordText.trim().split(/\s+/);
        coordArray.forEach((coord, index) => {
          const [lng, lat] = coord.split(",").map(Number);
          coordinates.push({ lat, lng, polyOrder: index + 1 });
        });
      }
    }

    return coordinates;
  }

  downloadKML(): void {
    let siteName = this.serviceAreaGroupForm.value.siteName;
    const kmlContent = this.generateKMLContent(this.drawnPolygonLatLongList);
    const blob = new Blob([kmlContent], { type: "application/vnd.google-earth.kml+xml" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = siteName + ".kml";
    a.click();

    window.URL.revokeObjectURL(url);
  }

  generateKMLContent(coordinates: any[]): string {
    let kml = '<?xml version="1.0" encoding="UTF-8"?>';
    kml += '<kml xmlns="http://www.opengis.net/kml/2.2">';
    kml += "<Document>";
    kml += "<Placemark>";
    kml += "<Polygon>";
    kml += "<outerBoundaryIs>";
    kml += "<LinearRing>";
    kml += "<coordinates>";

    coordinates.forEach(coord => {
      kml += `${coord.lng},${coord.lat},0 `;
    });

    kml += "</coordinates>";
    kml += "</LinearRing>";
    kml += "</outerBoundaryIs>";
    kml += "</Polygon>";
    kml += "</Placemark>";
    kml += "</Document>";
    kml += "</kml>";

    return kml;
  }
}
