// import { element } from "protractor";
// import { type } from "os";
// import { url } from "inspector";
import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { ITEMS_PER_PAGE, pageLimitOptions } from "src/app/RadiusUtils/RadiusConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { LoginService } from "src/app/service/login.service";
import { PartnerService } from "src/app/service/partner.service";
import { formatDate } from "@angular/common";
import { ExternalItemManagementService } from "src/app/service/external-item-management.service";
import { PopManagementsService } from "src/app/service/pop-managements.service";
import { Regex } from "src/app/constants/regex";
import { Observable, Observer } from "rxjs";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { LiveUserService } from "src/app/service/live-user.service";
import { INVENTORYS } from "src/app/constants/aclConstants";
import { ServiceAreaService } from "src/app/service/service-area.service";
declare var $: any;
@Component({
    selector: "app-external-item-management",
    templateUrl: "./external-item-management.component.html",
    styleUrls: ["./external-item-management.component.css"],
    standalone: false
})
export class ExternalItemManagementComponent implements OnInit {
  externalItemManagementFormGroup: FormGroup;
  // countryFormArray: FormArray;
  submitted = false;
  showSearchBar: boolean = false;
  loggedInStaffId = localStorage.getItem("userId");
  stateData: any = {};
  countryListData: any;
  currentPageProductListdata = 1;
  productListdataitemsPerPage = ITEMS_PER_PAGE;
  productListdatatotalRecords: any;
  countryPojo: any = {};
  externalItemListData: any[] = [];
  externalItemDetails: any = [];
  ifExternalItemDetails = false;
  currentPagepartnerListdata = 1;
  partnerListdataitemsPerPage = ITEMS_PER_PAGE;
  partnerListdatatotalRecords: any;
  customerListdatatotalRecords: any;
  selectServiceAreaFlag: boolean = false;
  selectOwnerTypeFlag: boolean = false;
  getOwnerFlag: boolean = false;
  ownerShow: boolean = false;
  totalPartnerDataListLength = 0;
  partnerListData: any = [];
  currentPagecustomerListdata = 1;
  customerListdataitemsPerPage = ITEMS_PER_PAGE;
  cusotmerListdatatotalRecords: any;
  newFirst = 0;
  totalCustomerDataListLength = 0;
  customerListData: any = [];
  IfPersonalExternalItemDataShow = true;
  viewCountryListData: any;
  viewStateListData: any;
  isStateEdit = false;
  searchData: any;
  searchExternalItem: any = "";
  // searchKey: string;
  AclClassConstants: any;
  AclConstants: any;
  assignExternalItemSubmitted: boolean = false;
  partnerOwnerModelFlag: boolean = false;
  customerOwnerModelFlag: boolean = false;
  MACShowModal: boolean = false;
  MACAssignModal: boolean = false;
  rejectChangeStatusModal: boolean = false;
  approveChangeStatusModal: boolean = false;
  pageLimitOptions = pageLimitOptions;
  showItemPerPage = 5;
  searchkey: string;

  public loginService: LoginService;
  editMode: boolean;

  selectWareHouseView: boolean;
  pincodeDeatils: any;

  status = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
  ];
  createView = false;
  listView = true;

  @ViewChild("closebutton") closebutton: any;
  countryList:any[] = [];
  stateList:any[] = [];
  cityList:any[] = [];
  pincodeList:any[] = [];
  selectOwner:any[] = [];
  allpincodeNumber: any = [];
  unit = "";
  products: any[] = [];
  warehouses: any[] = [];
  ownershipType = [
    { label: "Partner Owned", value: "Partner Owned" },
    { label: "Customer Owned", value: "Customer Owned" },
  ];

  pipe = new DatePipe("en-US");
  usedQty: number;
  inTransitQty: number;
  totalMacSerial: number;
  showQtyError: boolean;
  showIntransitQtyError: boolean;
  addMACaddress: boolean;
  externalItemIdForMac: number;
  externalItemMacList: any[] = [];
  serviceAreaList: any = [];
  macAdderessInput = "";
  macForm: FormGroup;
  assignExternalItemForm: FormGroup;
  hasMac: boolean;
  hasSerial: boolean;
  detailView: boolean = false;
  viewExternalItemData: any;
  ownerData: any;
  searchkey2: string;
  searchOptionSelect = this.commondropdownService.customerInventorySearchOption;
  parentFieldEnable: boolean = false;
  partnerFieldEnable: boolean = false;
  searchParentCustValue = "";
  searchPartnerValue = "";
  searchParentCustOption = "";
  searchPartnerOption = "";
  prepaidParentCustomerList: any;
  custid: any;
  custId: any;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  createAccess: boolean = false;
  showMacAddressAccess: boolean = false;
  addMacAddressAccess: boolean = false;
  constructor(
    private fb: FormBuilder,
    private customerManagementService: CustomermanagementService,
    private liveUserService: LiveUserService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private partnerService: PartnerService,
    private externalItemManagementService: ExternalItemManagementService,
    public KeyannaCommonBaseService: KeyannaCommonBaseService,
    private popService: PopManagementsService,
    loginService: LoginService,
    private serviceAreaService: ServiceAreaService,
    public commondropdownService: CommondropdownService
  ) {
    this.loginService = loginService;
    this.createAccess = loginService.hasPermission(INVENTORYS.EXT_ITEM_CREATE);
    this.deleteAccess = loginService.hasPermission(INVENTORYS.EXT_ITEM_DELETE);
    this.editAccess = loginService.hasPermission(INVENTORYS.EXT_ITEM_EDIT);
    this.showMacAddressAccess = loginService.hasPermission(INVENTORYS.EXT_ITEM_SHOW_MAC_ADDRESS);
    this.addMacAddressAccess = loginService.hasPermission(INVENTORYS.EXT_ITEM_ADD_MAC_ADDRESS);
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;

    // this.editMode = !createAccess && editAccess ? true : false;

    this.externalItemManagementService.getAllProducts().subscribe((res: any) => {
      this.products = res.dataList;
    });
    this.getServiceArea();
  }

  ngOnInit(): void {
    this.externalItemManagementFormGroup = this.fb.group({
      id: [""],
      productId: ["", Validators.required],
      qty: [""],
      // destinationId: ["", Validators.required],
      // destinationType: [""],
      status: ["", Validators.required],
      ownershipType: ["", Validators.required],
      ownerId: ["", Validators.required],
      externalItemGroupNumber: [""],
      mvnoId: [""],
      unusedQty: [""],
      usedQty: [""],
      inTransitQty: [
        "",
        [Validators.required, Validators.pattern(Regex.numeric), Validators.min(1)],
      ],
      rejectedQty: [""],
      serviceAreaId: ["", Validators.required],
      totalMacSerial: [""],
    });
    this.searchData = {
      filter: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and",
        },
      ],
    };
    this.assignExternalItemForm = this.fb.group({
      remark: ["", Validators.required],
    });
    this.getExternalItemList("");
    this.externalItemManagementFormGroup.get("qty").valueChanges.subscribe(val => {
      const total = val - this.usedQty;
      if (total < 0) {
        this.showQtyError = true;
      } else {
        this.showQtyError = false;
      }
    });
    this.externalItemManagementFormGroup.get("inTransitQty").valueChanges.subscribe(val => {
      const total = val - this.totalMacSerial;
      if (total < 0) {
        this.showIntransitQtyError = true;
      } else {
        this.showIntransitQtyError = false;
      }
    });
  }

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageProductListdata > 1) {
      this.currentPageProductListdata = 1;
    }
    if (!this.searchkey) {
      this.getExternalItemList(this.showItemPerPage);
    } else {
      this.searchExternalItemData();
    }
  }

  getExternalItemList(list:any) {
    this.externalItemListData = [];
    let size: number;
    this.searchkey = "";
    const page = this.currentPageProductListdata;
    if (list) {
      size = list;
      this.productListdataitemsPerPage = list;
    } else {
      size = this.productListdataitemsPerPage;
    }

    const plandata = {
      page,
      pageSize: this.productListdataitemsPerPage,
    };
    this.externalItemManagementService.getAll(plandata).subscribe(
      (response: any) => {
        this.externalItemListData = response.dataList;
        this.productListdatatotalRecords = response.totalRecords;
        this.searchkey = "";
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  selParentSearchOption(event:any) {
    if (event.value) {
      this.parentFieldEnable = true;
    } else {
      this.parentFieldEnable = false;
    }
  }

  searchParentCustomer() {
    const searchData = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and",
        },
      ],
      page: this.currentPagepartnerListdata,
      pageSize: this.customerListdataitemsPerPage,
      sortBy: "id",
      sortOrder: 0,
    };
    searchData.filters[0].filterColumn = this.searchParentCustOption;
    searchData.filters[0].filterValue = this.searchParentCustValue.trim();
    const serviceAreaId = this.externalItemManagementFormGroup.get("serviceAreaId").value;
    const url =
      "/externalitemmanagement/searchCustomerListServiceArea?serviceAreaId=" + serviceAreaId;
    this.externalItemManagementService.postMethod(url, searchData).subscribe(
      (response: any) => {
        this.customerListData = response.dataList;
        this.customerListdatatotalRecords = response.totalRecords;
      },
      (error: any) => {
        this.productListdatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle",
          });
        }
      }
    );
  }

  clearSearchParentCustomer() {
    this.getCustomerList("");
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
  }

  searchPartner() {
    const searchData = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "name",
          filterOperator: "equalto",
          filterCondition: "and",
        },
      ],
      page: this.currentPagepartnerListdata,
      pageSize: this.customerListdataitemsPerPage,
      sortBy: "id",
      sortOrder: 0,
    };
    searchData.filters[0].filterColumn = this.searchPartnerOption;
    searchData.filters[0].filterValue = this.searchPartnerValue.trim();
    const serviceAreaId = this.externalItemManagementFormGroup.get("serviceAreaId").value;
    const url =
      "/externalitemmanagement/searchPartnerListServiceArea?serviceAreaId=" + serviceAreaId;
    this.externalItemManagementService.postMethod(url, searchData).subscribe(
      (response: any) => {
        if (response != null) {
          this.partnerListData = response.dataList;
          this.partnerListdatatotalRecords = response.totalRecords;
        }
      },
      (error: any) => {
        this.productListdatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle",
          });
        }
      }
    );
  }

  clearSearchPartner() {
    // this.currentPageParentCustomerListdata = 1;
    this.getpartnerList("");
    this.searchPartnerValue = "";
    this.searchPartnerOption = "";
    // this.partnerFieldEnable = false;
  }

  submit() {
    this.submitted = true;
    if (
      this.externalItemManagementFormGroup.valid &&
      !this.showQtyError &&
      !this.showIntransitQtyError
    ) {
      if (this.editMode) {
        this.externalItemManagementService.update(this.mapObject()).subscribe(
          (res: any) => {
            if (res.responseCode == 406) {
              this.messageService.add({
                severity: "info",
                summary: "info",
                detail: res.responseMessage,
                icon: "far fa-times-circle",
              });
            } else {
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: res.responseMessage,
                icon: "far fa-check-circle",
              });
              this.clearSearchExternalItem();
              this.editMode = false;
              this.submitted = false;
            }
          },
          (error: any) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.ERROR,
              icon: "far fa-times-circle",
            });
          }
        );
      } else {
        this.externalItemManagementService.save(this.mapObject()).subscribe(
          (res: any) => {
            if (res.responseCode == 406) {
              this.messageService.add({
                severity: "info",
                summary: "info",
                detail: res.responseMessage,
                icon: "far fa-times-circle",
              });
            } else {
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: res.responseMessage,
                icon: "far fa-check-circle",
              });

              this.submitted = false;
              this.clearSearchExternalItem();
            }
          },
          (error: any) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.ERROR,
              icon: "far fa-times-circle",
            });
          }
        );
      }
    }
  }

  mapObject() {
    const externalItemValues = this.externalItemManagementFormGroup.value;
    const externalitem = {
      id: "",
      productId: "",
      qty: 0,
      // destinationId: "",
      // destinationType: "Warehouse",
      ownershipType: "",
      ownerId: null as number | null,
      status: "",
      externalItemGroupNumber: "",
      inTransitQty: "",
      mvnoId: "",
      usedQty: "",
      unusedQty: "",
      rejectedQty: "",
      serviceAreaId: { id: "" },
      totalMacSerial: 0,
    };
    externalitem.id = externalItemValues.id ? externalItemValues.id : null;
    externalitem.productId = externalItemValues.productId;
    externalitem.qty = externalItemValues.qty;
    externalitem.status = externalItemValues.status;
    externalitem.serviceAreaId.id = externalItemValues.serviceAreaId;
    externalitem.ownershipType = externalItemValues.ownershipType;
    externalitem.externalItemGroupNumber = externalItemValues.externalItemGroupNumber
      ? externalItemValues.externalItemGroupNumber
      : "";
    externalitem.mvnoId = null;
    externalitem.usedQty = externalItemValues.usedQty;
    externalitem.unusedQty = externalItemValues.unusedQty;
    externalitem.ownerId = externalItemValues.ownerId;
    externalitem.inTransitQty = externalItemValues.inTransitQty;
    externalitem.rejectedQty = externalItemValues.rejectedQty;
    externalitem.totalMacSerial = externalItemValues.totalMacSerial;
    // const hh =myDate.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");

    // const formattedDate = formatDate(myDate, format, locale) +' '+ hh;
    // console.log("date time",formattedDate )
    return externalitem;
  }

  editExternalItem(id:any) {
    this.editMode = true;
    this.createView = true;
    this.listView = false;
    this.detailView = false;
    const externalItemEdit = this.externalItemListData.find(element => element.id == id);

    this.externalItemManagementFormGroup.patchValue({
      id: externalItemEdit.id,
      productId: externalItemEdit.productId.id,
      qty: externalItemEdit.qty,
      status: externalItemEdit.status,
      ownershipType: externalItemEdit.ownershipType,
      externalItemGroupNumber: externalItemEdit.externalItemGroupNumber,
      mvnoId: [""],
      usedQty: externalItemEdit.usedQty,
      unusedQty: externalItemEdit.unusedQty,
      inTransitQty: externalItemEdit.inTransitQty,
      ownerId: externalItemEdit.ownerId,
      serviceAreaId: externalItemEdit.serviceAreaId.id,
      totalMacSerial: externalItemEdit.totalMacSerial,
    });
    this.ownerShow = true;
    this.usedQty = externalItemEdit.usedQty;
    this.inTransitQty = externalItemEdit.inTransitQty;
    this.totalMacSerial = externalItemEdit.totalMacSerial;
    const url = "/externalitemmanagement/" + id;
    this.externalItemManagementService.getMethod(url).subscribe((res: any) => {
      this.ownerData = res.data;
      const serviceAreaId = this.externalItemManagementFormGroup.get("serviceAreaId").value;
      if (serviceAreaId == undefined) {
        this.externalItemManagementFormGroup.patchValue({
          serviceAreaId: this.ownerData.serviceAreaId.id,
        });
      }
      this.ownerSelectList = [];
      this.ownerSelectList.push({
        id: Number(this.ownerData.ownerId),
        name: this.ownerData.ownerName,
      });
    });
  }

  searchExternalItemData() {
    if (!this.searchkey || this.searchkey !== this.searchExternalItem) {
      this.currentPageProductListdata = 1;
    }
    this.searchkey = this.searchExternalItem;
    if (this.showItemPerPage) {
      this.productListdataitemsPerPage = this.showItemPerPage;
    }
    this.searchData.filter[0].filterValue = this.searchExternalItem.trim();
    const page = {
      page: this.currentPageProductListdata,
      pageSize: this.showItemPerPage,
    };
    // const url = '/state/search'
    this.externalItemManagementService.search(page, this.searchData).subscribe(
      (response: any) => {
        if (response.responseCode == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
          this.externalItemListData = [];
          this.productListdatatotalRecords = 0;
        } else {
          this.externalItemListData = response.dataList;
          this.productListdatatotalRecords = response.totalRecords;
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  clearSearchExternalItem() {
    this.showSearchBar = true;
    this.listView = true;
    this.createView = false;
    this.detailView = false;
    this.editMode = false;
    this.submitted = false;
    this.searchExternalItem = "";
    this.searchkey = "";
    this.getOwnerFlag = false;
    this.ownerShow = false;
    this.getExternalItemList("");
    this.externalItemManagementFormGroup.reset();
    // this.getServiceArea();
  }

  deleteConfirmExternalItem(productId: number) {
    if (productId) {
      this.confirmationService.confirm({
        message: "Do you want to delete this externalItem ?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteProduct(productId);
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

  deleteProduct(productId:any) {
    //const productEditData = this.externalItemListData.find(element => element.id == productId);
    this.externalItemManagementService.delete(productId).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "info",
            summary: "info",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle",
          });
        }
        this.getExternalItemList("");
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  createWareHouse() {
    this.showSearchBar = false;
    this.getOwnerFlag = false;
    this.ownerShow = false;
    this.listView = false;
    this.detailView = false;
    this.createView = true;
    this.editMode = false;
    this.externalItemManagementFormGroup.reset();
  }
  getUnit(event:any) {
    this.unit = this.products.find(element => element.id == event.value).unit;
    this.selectServiceAreaFlag = true;
    this.selectOwnerTypeFlag = false;
  }
  getOwnerType() {
    this.selectOwnerTypeFlag = true;
    this.selectedPartner = [];
    this.selectedCustomer = [];
    this.customerListData = [];
    this.partnerListData = [];
    this.externalItemManagementFormGroup.get("ownershipType").reset();
    this.getOwnerFlag = false;
    this.ownerShow = false;
    this.externalItemManagementFormGroup.get("onwerId").reset();
  }
  pageChangedProductList(pageNumber:any) {
    this.currentPageProductListdata = pageNumber;
    if (!this.searchkey) {
      this.getExternalItemList("");
    } else {
      this.searchExternalItemData();
    }
  }

  showMac(externalItemId:any) {
    this.hasMac = this.externalItemListData.find(
      element => element.id == externalItemId
    ).productId.productCategory.hasMac;
    this.hasSerial = this.externalItemListData.find(
      element => element.id == externalItemId
    ).productId.productCategory.hasSerial;

    if (!this.hasMac && !this.hasSerial) {
      this.messageService.add({
        severity: "info",
        summary: "info",
        detail: "Product type does not allow to add Mac/Serial Number..",
        icon: "far fa-times-circle",
      });
      this.addMACaddress = false;
      return;
    } else {
      this.MACShowModal = true;

      this.externalItemIdForMac = externalItemId;
      this.macForm = this.fb.group({
        id: [""],
        externalItemId: [this.externalItemIdForMac],
        status: ["ACTIVE"],
        macAddress: this.hasMac ? ["", Validators.required] : [null],
        serialNumber: this.hasSerial ? ["", Validators.required] : [null],
      });
      this.addMACaddress = true;
      this.getExternalItemMACMapping();
    }
  }
  addMAC(externalItemId:any) {
    this.hasMac = this.externalItemListData.find(
      element => element.id == externalItemId
    ).productId.productCategory.hasMac;
    this.hasSerial = this.externalItemListData.find(
      element => element.id == externalItemId
    ).productId.productCategory.hasSerial;

    if (!this.hasMac && !this.hasSerial) {
      this.messageService.add({
        severity: "info",
        summary: "info",
        detail: "Product type does not allow to add Mac/Serial Number..",
        icon: "far fa-times-circle",
      });
      this.addMACaddress = false;
      return;
    } else {
      this.MACAssignModal = true;
      this.externalItemIdForMac = externalItemId;
      this.macForm = this.fb.group({
        id: [""],
        externalItemId: [this.externalItemIdForMac],
        status: ["ACTIVE"],
        macAddress: this.hasMac ? ["", Validators.required] : [null],
        serialNumber: this.hasSerial ? ["", Validators.required] : [null],
      });
      this.addMACaddress = true;
      this.getExternalItemMACMapping();
    }
  }

  onAddAttribute() {
    // let index;
    // if (this.hasMac) {
    //   index = this.externalItemMacList.find(
    //     element =>
    //       element.macAddress == this.macForm.controls.macAddress.value ||
    //       element.serialNumber == this.macForm.controls.serialNumber.value
    //   );
    // } else {
    //   index = this.externalItemMacList.find(
    //     element => element.serialNumber == this.macForm.controls.serialNumber.value
    //   );
    // }

    // if (index) {
    //   this.messageService.add({
    //     severity: "info",
    //     summary: "info",
    //     detail: "Mac Address Already Exists, It Should Be Unique",
    //     icon: "far fa-times-circle",
    //   });
    //   return;
    // }
    const totalQty = this.externalItemListData.find(
      element => element.id == this.externalItemIdForMac
    ).inTransitQty;
    if (this.externalItemMacList.length == totalQty) {
      this.messageService.add({
        severity: "info",
        summary: "info",
        detail: "No more inventory available.",
        icon: "far fa-times-circle",
      });
      return;
    }

    if (this.macForm.valid) {
      const macMappingValue = {
        id: null as number | null,
        externalItemId: this.externalItemIdForMac,
        macAddress: this.macForm.controls['macAddress'].value,
        serialNumber: this.macForm.controls['serialNumber'].value,
        status: "ACTIVE",
      };

      this.externalItemManagementService
        .postMethod("/externalitemmacserialmapping/save", macMappingValue)
        .subscribe(
          (res: any) => {
            if (res.responseCode == 406) {
              this.messageService.add({
                severity: "info",
                summary: "info",
                detail: res.responseMessage,
                icon: "far fa-times-circle",
              });
            } else {
              this.macForm.reset();
            }

            this.getExternalItemMACMapping();
          },
          (error: any) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.ERROR,
              icon: "far fa-times-circle",
            });
          }
        );
    }
  }

  createPolicyDetailsForm(): FormGroup {
    return this.fb.group({
      id: [""],
      externalItemId: [this.externalItemIdForMac],
      status: ["ACTIVE"],
      macAddress: ["", Validators.required],
      serialNumber: ["", Validators.required],
    });
  }

  getExternalItemMACMapping() {
    this.externalItemMacList = [];
    this.externalItemManagementService
      .getExternalItemMacMapping(this.externalItemIdForMac)
      .subscribe(
        (res: any) => {
          this.externalItemMacList = res.dataList;
        },
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle",
          });
        }
      );
  }

  deleteMACMapping(mapping:any) {
    if (mapping.outwardId != null) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "This MAC address is availabel in outward.",
        icon: "far fa-times-circle",
      });
      return;
    }

    this.externalItemManagementService.deleteMacMapping(mapping).subscribe(
      (res: any) => {
        this.getExternalItemMACMapping();
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }
  assignExternalItemID: any;
  externalItemIDStatus: any;
  approveExternalItemData:any[] = [];

  approveChangeStatus(id:any) {
    this.approveChangeStatusModal = true;
    this.assignExternalItemID = id;
  }

  rejectChangeStatus(id:any) {
    this.rejectChangeStatusModal = true;
    this.assignExternalItemID = id;
  }

  closeStatusModal() {
    this.approveChangeStatusModal = false;
    this.rejectChangeStatusModal = false;
    this.assignExternalItemForm.get("remark").reset();
  }

  approveExternalItemGroup() {
    this.assignExternalItemSubmitted = true;
    this.submitted = true;
    this.approveExternalItemData = [];
    this.approveChangeStatusModal = true;
    if (this.assignExternalItemForm.valid) {
      let url = `/externalitemmanagement/externalItemApproval`;
      let approvalExternalItemData = {
        id: this.assignExternalItemID,
        approvalStatus: "Approve",
        approvalRemark: this.assignExternalItemForm.controls['remark'].value,
      };

      this.externalItemManagementService.updateMethod(url, approvalExternalItemData).subscribe(
        (response: any) => {
          this.submitted = false;
          this.close();
          this.approveExternalItemData = response.data;
          this.assignExternalItemForm.reset();

          this.getExternalItemList("");
        },
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
        }
      );
    }
  }

  rejectExternalItemGroup() {
    this.assignExternalItemSubmitted = true;
    this.submitted = true;
    this.approveExternalItemData = [];
    this.rejectChangeStatusModal = true;
    if (this.assignExternalItemForm.valid) {
      let url = `/externalitemmanagement/externalItemApproval`;
      let approvalExternalItemData = {
        id: this.assignExternalItemID,
        approvalStatus: "Rejected",
        approvalRemark: this.assignExternalItemForm.controls['remark'].value,
      };

      this.externalItemManagementService.updateMethod(url, approvalExternalItemData).subscribe(
        (response: any) => {
          this.approveExternalItemData = response.data;
          this.close();

          this.assignExternalItemForm.reset();
          this.getExternalItemList("");
        },
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
        }
      );
    }
  }

  getExternalItemData(externalItemId: any) {
    this.externalItemDetails = [];
    this.ifExternalItemDetails = true;
    this.IfPersonalExternalItemDataShow = true;
    if (externalItemId) {
      const url = "/inwards/" + externalItemId;
      this.externalItemManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.externalItemDetails = response.data;
        },
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle",
          });
        }
      );
    }
  }
  externalItemDeatilsClear() {
    this.IfPersonalExternalItemDataShow = false;
  }
  personalExternalItemData() {
    this.IfPersonalExternalItemDataShow = true;
  }
  getServiceArea() {
    const url = "/serviceArea/getAllServiceAreaByStaff";
    this.serviceAreaService.getMethod(url).subscribe(
      (response: any) => {
        this.serviceAreaList = response.dataList;
        //
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }
  onclosed() {
    this.getExternalItemList("");
    this.MACAssignModal = false;
    this.MACShowModal = false;
  }
  close() {
    this.assignExternalItemSubmitted = false;
    this.assignExternalItemForm.reset();
    this.approveChangeStatusModal = false;
    this.rejectChangeStatusModal = false;
  }
  clearMacMapping() {
    this.getExternalItemList("");
    this.MACAssignModal = false;
  }
  isDestAStaffOrCustomer = false;
  getDestinations(ownershipType:any): void {
    this.externalItemManagementFormGroup.controls['ownerId'].setValue("");
    if (ownershipType == "Partner Owned") {
      this.isDestAStaffOrCustomer = false;
    } else if (ownershipType == "Customer Owned") {
      this.isDestAStaffOrCustomer = true;
    }
    this.getOwnerFlag = true;
    this.ownerShow = false;
  }

  canExit() {
    if (!this.externalItemManagementFormGroup.dirty) return true;
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
  getExternalItemDetails(id:any) {
    const url = "/externalitemmanagement/" + id;
    this.externalItemManagementService.getMethod(url).subscribe(
      (res: any) => {
        this.viewExternalItemData = res.data;
        this.listView = false;
        this.createView = false;
        this.detailView = true;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  externalItemList() {
    this.listView = true;
    this.createView = false;
    this.detailView = false;
  }
  quantityInValidation(event:any) {
    var num = String.fromCharCode(event.which);
    if (!/[0-9]/.test(num)) {
      event.preventDefault();
    }
  }
  // showSelectStaffModel = false;
  selectedPartner: any = [];
  selectedCustomer: any = [];
  // selectStaffType = "";
  ownerSelectList: any = [];

  modalOpenSelectOwner(type:any) {
    if (type == "Partner Owned") {
      this.getpartnerList("");
      // $("#selectPartnerOwner").modal("show");
    } else if (type == "Customer Owned") {
      this.getCustomerList("");
      // $("#selectCustomerOwner").modal("show");
    }
  }

  selectedOwnerChange(selectedData:any, selectOwnerType:any) {
    // this.showSelectStaffModel = false;
    let data = selectedData;
    if (selectOwnerType == "Partner Owned") {
      this.ownerSelectList.push({
        id: Number(data.id),
        name: data.name,
      });
      this.externalItemManagementFormGroup.patchValue({
        ownerId: data.id,
      });
    } else if (selectOwnerType == "Customer Owned") {
      this.ownerSelectList.push({
        id: Number(data.id),
        name: data.firstname,
      });
      this.externalItemManagementFormGroup.patchValue({
        ownerId: data.id,
      });
    }
  }
  removeSelectOwner() {
    this.ownerSelectList = [];
  }
  getpartnerList(list:any) {
    const serviceAreaId = this.externalItemManagementFormGroup.get("serviceAreaId").value;
    this.searchkey = "";

    if (serviceAreaId == null) {
      this.messageService.add({
        severity: "info",
        summary: "info",
        detail: "Please select service area",
        icon: "far fa-times-circle",
      });
    } else {
      const url =
        "/externalitemmanagement/getPartnerListServiceArea?serviceAreaId=" + serviceAreaId;
      let partnerdata = {
        page: this.currentPagepartnerListdata,
        pageSize: this.partnerListdataitemsPerPage,
      };
      this.partnerListData = [];
      this.externalItemManagementService.postMethod(url, partnerdata).subscribe(
        (response: any) => {
          this.partnerListData = response.dataList;
          this.partnerListdatatotalRecords = response.totalRecords;
          if (!this.editMode) {
            $("#selectPartnerOwner").modal("show");
          }
        },
        (error: any) => {
          console.log(error, "error");
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle",
          });
        }
      );
    }
  }
  getCustomerList(list:any) {
    const serviceAreaId = this.externalItemManagementFormGroup.get("serviceAreaId").value;
    this.searchkey = "";

    if (serviceAreaId == null) {
      this.messageService.add({
        severity: "info",
        summary: "info",
        detail: "Please select service area",
        icon: "far fa-times-circle",
      });
    } else {
      const url =
        "/externalitemmanagement/getCustomerListServiceArea?serviceAreaId=" + serviceAreaId;
      let customerdata = {
        page: this.currentPagecustomerListdata,
        pageSize: this.customerListdataitemsPerPage,
      };
      this.customerListData = [];
      this.externalItemManagementService.postMethod(url, customerdata).subscribe(
        (response: any) => {
          this.customerListData = response.dataList;
          this.customerListdatatotalRecords = response.totalRecords;
          if (!this.editMode) {
            $("#selectCustomerOwner").modal("show");
          }
        },
        (error: any) => {
          console.log(error, "error");
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle",
          });
        }
      );
    }
  }
  paginatePartner(event:any) {
    this.currentPagepartnerListdata = event.page + 1;
    this.getpartnerList("");
  }
  paginateCustomer(event:any) {
    this.currentPagecustomerListdata = event.page + 1;
    this.getCustomerList("");
  }
  saveSelOwner(type:any) {
    if (type == "Partner Owned") {
      this.selectedOwnerChange(this.selectedPartner, type);
      $("#selectPartnerOwner").modal("hide");
    } else if (type == "Customer Owned") {
      this.selectedOwnerChange(this.selectedCustomer, type);
      $("#selectCustomerOwner").modal("hide");
    }
  }
  modalCloseOwner(type:any) {
    if (type == "Partner Owned") {
      $("#selectPartnerOwner").modal("hide");
      this.searchPartnerValue = "";
      this.searchPartnerOption = "";
      // this.partnerFieldEnable = false;
    } else if (type == "Customer Owned") {
      $("#selectCustomerOwner").modal("hide");
      this.searchParentCustValue = "";
      this.searchParentCustOption = "";
      this.parentFieldEnable = false;
    }
  }
}
