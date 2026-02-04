import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject, Observable, Observer } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { InwardService } from "src/app/service/inward.service";
import { ProuctManagementService } from "src/app/service/prouct-management.service";
import { CustomerInventoryManagementService } from "src/app/service/customer-inventory-management.service";
import { PartnerService } from "src/app/service/partner.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
// import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";

import { ITEMS_PER_PAGE, pageLimitOptions } from "src/app/RadiusUtils/RadiusConstants";
import { Regex } from "src/app/constants/regex";
import { OutwardService } from "src/app/service/outward.service";
import { CustomerInventoryMappingService } from "src/app/service/customer-inventory-mapping.service";
import { BulkConsumptionService } from "src/app/service/bulk-consumption.service";
import { LoginService } from "src/app/service/login.service";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { Table } from "primeng/table";
// import { serialize } from "v8";
// import { type } from "os";
import { INVENTORYS } from "src/app/constants/aclConstants";

declare var $: any;
@Component({
    selector: "app-bulk-consumption",
    templateUrl: "./bulk-consumption.component.html",
    styleUrls: ["./bulk-consumption.component.css"],
    standalone: false
})
export class BulkConsumptionComponent implements OnInit {
  public loginService: LoginService;
  AclClassConstants:any;
  AclConstants:any;
  bulkConsumptionFormGroup!: FormGroup;
  inventoryAssignSumitted: boolean = false;
  loggedInStaffId = localStorage.getItem("userId");
  ItemSelectionType = [
    { label: "Serialized Item", value: "Serialized Item" },
    { label: "Non Serialized Item", value: "Non Serialized Item" },
  ];
  productSelectionType = [
    { label: "Single Item", value: false },
    { label: "Pair Item", value: true },
    // { label: "Non Serialized Item", value: "Non Serialized Item" },
  ];
  itemConditionData = [
    { label: "New", value: "New" },
    { label: "Refurbished", value: "Refurbished" },
  ];
  @ViewChild("dt") table: Table | undefined;
  sourceType = [{ label: "Warehouse" }, { label: "Staff" }, { label: "Partner" }];
  macAddressList: any = [];
  products:any[] = [];
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  editMode: boolean = false;
  hideSearchBar: boolean = true;
  productHasMac!: boolean;
  productHasSerial!: boolean;
  macList: any = [];
  searchkey!: string;
  searchData: any;
  loading!:boolean ;;
  searchProductCatName: any = "";
  productListData: any[] = [];
  productListdataitemsPerPage = ITEMS_PER_PAGE;
  currentPageProductListdata = 1;
  showItemPerPage: any = 5;
  productListdatatotalRecords: any;
  inwardMacdataitemsPerPage = ITEMS_PER_PAGE;
  currentPageinwardMacdata = 1;
  inwardMacdatatotalRecords: any;
  selItemCondition: any = "";
  warehouses: any[] = [];
  staffList:any[] = [];
  allActiveProducts: any = [];
  hasMac!: boolean;
  hasSerial!: boolean;
  enterMacSerial: any = "";
  sources: any[] = [];
  sourceTypeAsStaffFlag: boolean = false;
  availableQty: any;
  inwardList:any[] = [];
  selectedMACAddress: any;
  customerId: any;
  submitted: boolean = false;
  approved = false;
  reject = false;
  assignInwardID: any;
  rejectInventoryData:any[] = [];
  approveInventoryData:any[] = [];
  selectStaff: any;
  assignInwardForm!: FormGroup;
  rejectInwardForm!: FormGroup;
  assignInwardSubmitted: boolean = false;
  rejectInwardSubmitted: boolean = false;
  approveChangeStatusModal: boolean = false;
  rejectChangeStatusModal: boolean = false;
  MACShowModal: boolean = false;
  selectStaffReject: any;
  inwardMacList: any[] = [];
  inwardIdForMac!: number;
  unit: any;
  userId: number = +(localStorage.getItem("userId") ?? 0);
  parentItemList: any = [];
  // bulkConsumptionStatus = [
  //   { label: "Active", value: "ACTIVE" },
  //   { label: "Inactive", value: "INACTIVE" },
  // ];
  createBulkData: any;
  mapping: any;
  chekedData: any;
  allActiveNonTrackableProducts: any = [];
  getNonTrackableProductQtyList: any = [];
  getSerializedProductFlag: boolean = false;
  getAllAssemblyNameFlag: boolean = false;
  itemConditionSingleFlag: boolean = false;
  getAllNonSerializedProductFlag: boolean = false;
  sourceTypeFlag: boolean = false;
  sourceFlag: boolean = false;
  availableQtyFlag: boolean = false;
  getAllSingleItemMacFlag: boolean = false;
  getAllNonSerializedItemFlag: boolean = false;
  viewBulkConsumptionDetails: any;
  UOM: any = "";
  showQtyError!: boolean;
  negativeAssignQtyError!: boolean;
  getInwardFlag: boolean = false;
  getItemListFlag: boolean = false;
  createView = false;
  listView = true;
  detailView: boolean = false;
  inOutWardMACMappings: any;
  itemId: any;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  createAccess: boolean = false;
  approveAccess: boolean = false;
  rejectAccess: boolean = false;
  showMacAddressAccess: boolean = false;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private inwardService: InwardService,
    private outwardService: OutwardService,
    private bulkConsumptionService: BulkConsumptionService,
    private productService: ProuctManagementService,
    private customerInventoryManagementService: CustomerInventoryManagementService,
    private partnerService: PartnerService,
    public customerInventoryMappingService: CustomerInventoryMappingService,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.createAccess = loginService.hasPermission(INVENTORYS.CREATE_BULK_CONSUMPTION);
    this.deleteAccess = loginService.hasPermission(INVENTORYS.DELETE_BULK_CONSUMPTION);
    this.editAccess = loginService.hasPermission(INVENTORYS.EDIT_BULK_CONSUMPTION);
    this.approveAccess = loginService.hasPermission(INVENTORYS.BULK_CONSUMPTION_APPROVE);
    this.rejectAccess = loginService.hasPermission(INVENTORYS.BULK_CONSUMPTION_REJECT);
    this.showMacAddressAccess = loginService.hasPermission(INVENTORYS.VIEW_INWARD_MAC_MAPPING);
    this.editMode = !this.createAccess && this.editAccess ? true : false;
    this.outwardService.getAllProducts().subscribe((res: any) => {
      this.products = res.dataList;
      this.loginService = loginService;
      this.AclClassConstants = AclClassConstants;
      this.AclConstants = AclConstants;

      //   this.editMode = !createAccess && editAccess ? true : false;
    });
  }

  ngOnInit(): void {
    this.bulkConsumptionFormGroup = this.fb.group({
      id: [""],
      bulkConsumptionName: ["", Validators.required],
      ownerType: ["", Validators.required],
      ownerId: ["", Validators.required],
      productId: ["", Validators.required],
      itemType: ["", Validators.required],
      itemListLongId: [""],
      qty: [""],
      nonSerializedQty: [""],
      isDeleted: [""],
      mvnoId: [""],
      inOutWardMACMappings: [""],
    });
    this.productService.getAllActiveProduct().subscribe((res: any) => {
      this.products = res.dataList;
    });
    this.inwardService.getAllWareHouse().subscribe((res: any) => {
      this.warehouses = res.dataList;
    });
    this.outwardService.getAllStaff().subscribe((res: any) => {
      const staffId = localStorage.getItem("userId");
      this.staffList = res.dataList.filter((element:any) => element.id == staffId);
    });
    this.assignInwardForm = this.fb.group({
      remark: ["", Validators.required],
    });
    this.rejectInwardForm = this.fb.group({
      remark: ["", Validators.required],
    });
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
    };

    this.getProductList("");
    this.bulkConsumptionFormGroup.get("nonSerializedQty")?.valueChanges.subscribe(val => {
      const total = val;
      if (total > this.availableQty) {
        this.showQtyError = true;
      } else {
        this.showQtyError = false;
      }
      if (total < 0 || total == 0) {
        this.negativeAssignQtyError = true;
      } else {
        this.negativeAssignQtyError = false;
      }
    });
  }
  createBulkConsumption() {
    this.listView = false;
    this.createView = true;
    this.detailView = false;
    this.editMode = false;
    this.hideSearchBar = false;
    this.bulkConsumptionFormGroup.reset();
  }
  mapData(type:any): {} {
    this.itemIds = [];
    if (type == "Serialized Item") {
      this.selectedMACAddress.forEach((e:any) => {
        // let idnum  = e.itemId;
        this.itemIds.push(e.id);
      });
    }
    // console.log(" check final : ", this.itemIds);
    const customerInventoryMapping = this.bulkConsumptionFormGroup.getRawValue();
    const mapping = {
      productId: 0,
      itemListLongId: this.itemIds,
      inOutWardMACMappings: [""],
      bulkConsumptionName: "",
      inwardId: 0,
      qty: 0,
      isDeleted: false,
      ownerId: "",
      ownerType: "",
      nonSerializedQty: 0,
      itemType: "",
    };
    if (type == "Non Serialized Item") {
      mapping.qty = customerInventoryMapping.nonSerializedQty;
      mapping.nonSerializedQty = customerInventoryMapping.nonSerializedQty;
      mapping.itemType = customerInventoryMapping.itemType;
      mapping.inOutWardMACMappings = [];
    }
    if (type == "Serialized Item") {
      mapping.qty = this.selectedMACAddress.length;
      mapping.inOutWardMACMappings = this.selectedMACAddress;
      mapping.itemType = customerInventoryMapping.itemType;
    }
    mapping.ownerId = customerInventoryMapping.ownerId;
    mapping.ownerType = customerInventoryMapping.ownerType;
    mapping.bulkConsumptionName = customerInventoryMapping.bulkConsumptionName;
    mapping.productId = customerInventoryMapping.productId;
    mapping.inwardId = customerInventoryMapping.inwardId;
    mapping.isDeleted = false;
    return mapping;
  }

  getAllProductbasedOnItemType(value:any) {
    this.macAddressList = [];

    const staffId = localStorage.getItem("userId");
    const itemType = value;
    const url = "/product/getAllProductbasedOnItemType?itemtype=" + itemType;
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.allActiveProducts = response.dataList;
        this.allActiveNonTrackableProducts = response.dataList;
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

  oneSelect() {
    if (this.chekedData.length == 0) {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Please Select Atleast One Inventory",
        icon: "far fa-times-circle",
      });
    }
  }

  getProductSelection(): void {
    const url = "/product/getAllProductForNonTrackableProductCategory";
    this.customerInventoryManagementService.getMethod(url).subscribe((response: any) => {
      this.allActiveNonTrackableProducts = response.dataList;
      this.allActiveProducts = response.dataList;
    });
  }

  getAllSerializedProductItem(productId:any, ownerId:any, ownerType:any): void {
    this.macAddressList = [];

    // this.getSources(ownerType);
    const staffId = localStorage.getItem("userId");
    let product = this.allActiveProducts.find((element:any) => element.id == productId);
    this.hasMac = product.productCategory.hasMac;
    this.hasSerial = product.productCategory.hasSerial;
    const url =
      "/product/getAllSerializedItemBaseOnProduct?productId=" +
      productId +
      "&ownerId=" +
      ownerId +
      "&ownerType=" +
      ownerType;
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.macAddressList = response.dataList;

        if (this.macAddressList.length == 0 || this.macAddressList == null) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "Product MAC address not available",
            icon: "far fa-times-circle",
          });
        } else {
          this.getAllSingleItemMacFlag = true;
          // console.log("this.macAddressList", this.macAddressList);
        }
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

  getBulkConsumptionDetails(id:any) {
    const url = "/bulk_consumption/getById?id=" + id;
    this.bulkConsumptionService.getMethod(url).subscribe(
      (res: any) => {
        this.viewBulkConsumptionDetails = res.data;
        this.listView = false;
        this.createView = false;
        this.detailView = true;
        // console.log(" this.viewBulkConsumptionDetails", this.viewBulkConsumptionDetails);
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
  WarehouseList() {
    this.listView = true;
    this.createView = false;
    this.detailView = false;
  }
  getAvailableQtyByProductAndSource(productId:any, sourceId:any, sourceType:any): void {
    // this.getSources(sourceType);
    if (productId && sourceId) {
      this.inwardList = [];
      this.outwardService.getProductAvailableQTY(productId, sourceId, sourceType).subscribe(
        (res: any) => {
          this.inwardList = res.dataList;
          this.availableQtyFlag = true;
          if (res.dataList.length == 0) {
            this.availableQty = 0;
          } else {
            this.availableQty = res.dataList.find((element:any) => element).unusedQty;
          }
          this.bulkConsumptionFormGroup.get("nonSerializedQty")?.reset();
          // this.getAvailableQty(this.inwardList);
          this.getAllNonSerializedItemFlag = true;
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
    }
  }
  getSourceType() {
    this.sourceTypeFlag = true;
    this.sourceFlag = false;
    this.getAllNonSerializedItemFlag = false;
    this.getAllSingleItemMacFlag = false;
    this.bulkConsumptionFormGroup.get("ownerType")?.reset();
    this.bulkConsumptionFormGroup.get("ownerId")?.reset();
    this.bulkConsumptionFormGroup.get("nonSerializedQty")?.reset();
  }
  getUnit(event:any) {
    this.getInwardFlag = true;
    this.bulkConsumptionFormGroup.controls["inwardId"].reset();
    this.getItemListFlag = false;
    this.selectedMACAddress = [];
    this.unit = this.products.find((element:any) => element.id == event.value)?.['unit'];
    this.getOutWardList(event.value);
  }

  getOutWardList(productID:any) {
    const staffId = localStorage.getItem("userId");
    this.inwardService
      .getAllInwardByProductAndStaffforPopandSeriveareaandCustomer(productID, staffId)
      .subscribe(
        (res: any) => {
          this.productHasMac = this.products.find((element:any) => element.id == productID)?.['hasMac'] ?? false;
          this.productHasSerial = this.products.find((element:any) => element.id == productID)?.['hasSerial'] ?? false;
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

  getMacMappingsByInwardId(id:any): void {
    this.macList = [];
    this.inwardService.getAllMACMappingByInwardId(id).subscribe((res: any) => {
      this.macList = res.dataList;
      if (this.macList.length === 0) {
        this.messageService.add({
          severity: "info",
          summary: "Information",
          detail: "No product available for this outward.",
          icon: "far fa-times-circle",
        });
      }
    });
  }

  getSelItemType(event:any) {
    this.bulkConsumptionFormGroup.get("productId")?.reset();
    this.bulkConsumptionFormGroup.get("nonSerializedQty")?.reset();
    if (event.value == "Non Serialized Item") {
      this.getAllProductbasedOnItemType(event.value);
      this.getSerializedProductFlag = false;
      this.getAllAssemblyNameFlag = false;
      this.getAllNonSerializedProductFlag = true;
      this.sourceTypeFlag = false;
      this.sourceFlag = false;
      this.getAllSingleItemMacFlag = false;
    } else {
      this.getSerializedProductFlag = true;
      this.getAllAssemblyNameFlag = false;
      this.getAllNonSerializedProductFlag = false;
      this.sourceTypeFlag = false;
      this.sourceFlag = false;
      this.getAllNonSerializedItemFlag = false;
      this.getAllProductbasedOnItemType(event.value);
    }
  }
  getSources(sourceType:any): void {
    this.getAllNonSerializedItemFlag = false;
    this.getAllSingleItemMacFlag = false;
    this.sourceFlag = true;
    this.bulkConsumptionFormGroup.get("ownerId")?.reset();
    this.bulkConsumptionFormGroup.get("nonSerializedQty")?.reset();
    if (sourceType == "Warehouse") {
      this.sources = this.warehouses;
      this.sourceTypeAsStaffFlag = false;
    } else if (sourceType == "Staff") {
      this.sources = this.staffList;
      this.sourceTypeAsStaffFlag = true;
    } else if (sourceType == "Partner") {
      this.sourceTypeAsStaffFlag = false;
      const url = "/partner/all";
      this.partnerService.getMethodNew(url).subscribe(
        (res: any) => {
          this.sources = res.partnerlist;
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
  async getAvailableQty(id:any) {
    this.selectedMACAddress = [];
    this.getItemListFlag = true;
    this.inwardService.getById(id).subscribe((res: any) => {
      let productId = res.data.productId.id;
      const url = "/product/" + productId;
      this.productService.getMethod(url).subscribe((response: any) => {
        let product = response.data;
        this.productHasMac = product.productCategory.hasMac;
        this.productHasSerial = product.productCategory.hasSerial;
        if (this.productHasMac || this.productHasSerial) {
          this.getMacMappingsByInwardId(id);
        }
      });
    });
  }

  deleteMacMappInCustomer(macMaddress:any) {
    // this.outwardService
    //   .deleteMacMapInCustomer(this.customerId, macMaddress)
    //   .subscribe((res: any) => {});
  }
  searchProduct(): void {
    const url = "/bulk_consumption/searchByNamebybulkconsumption";
    if (!this.searchkey || this.searchkey !== this.searchProductCatName) {
      this.currentPageProductListdata = 1;
    }
    this.searchkey = this.searchProductCatName;
    if (this.showItemPerPage) {
      this.productListdataitemsPerPage = this.showItemPerPage;
    }
    this.searchData.filters[0].filterValue = this.searchProductCatName.trim();
    this.searchData.page = this.currentPageProductListdata;
    this.searchData.pageSize = this.productListdataitemsPerPage;
    this.bulkConsumptionService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        if (response.responseCode === 200) {
          this.productListData = response.dataList;
          this.productListdatatotalRecords = response.totalRecords;
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
          this.productListData = [];
          this.productListdatatotalRecords = 0;
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

  clearSearchProduct(): void {
    this.searchProductCatName = "";
    this.getSerializedProductFlag = false;
    this.getItemListFlag = false;
    this.hideSearchBar = true;
    this.editMode = false;
    this.macList = [];
    this.submitted = false;
    this.searchkey = "";
    this.getProductList("");
    this.availableQtyFlag = false;
    this.sourceTypeFlag = false;
    this.sourceFlag = false;
    this.getAllNonSerializedProductFlag = false;
    this.bulkConsumptionFormGroup.reset();
    this.listView = true;
    this.createView = false;
    this.detailView = false;
    this.getSerializedProductFlag = false;
    this.sourceFlag = false;
    this.getInwardFlag = false;
    this.availableQtyFlag = false;
    this.sourceTypeAsStaffFlag = false;
    this.getAllAssemblyNameFlag = false;
    this.getAllSingleItemMacFlag = false;
    this.getAllNonSerializedItemFlag = false;
    this.itemConditionSingleFlag = false;
    this.selectedMACAddress = [];
    this.itemIds = [];
  }
  getProductList(list:any): void {
    this.productListData = [];
    let size: number;
    this.searchkey = "";
    const List = this.currentPageProductListdata;
    if (list) {
      size = list;
      this.productListdataitemsPerPage = list;
    } else {
      size = this.productListdataitemsPerPage;
    }
    const plandata = {
      page: List,
      pageSize: this.showItemPerPage,
    };
    const url = "/bulk_consumption";
    this.bulkConsumptionService.postMethod(url, plandata).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "info",
            summary: "info",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        } else if (response.responseCode == 200) {
          this.productListData = response.dataList;
          this.productListdatatotalRecords = response.totalRecords;
          this.searchkey = "";
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
  itemIds: any = [];

  saveMapping: any;
  updateMapping: any;
  submitSerialized() {
    this.submitted = true;
    const type = "Serialized Item";
    this.mapping = this.mapData(type);
    if (this.mapping.itemListLongId.length === 0) {
      this.messageService.add({
        severity: "info",
        summary: "info",
        detail: `Please select atleast one item.`,
        icon: "far fa-times-circle",
      });
      this.selectedMACAddress = [];
      this.itemIds = [];
      return;
    }
    // if (this.bulkConsumptionFormGroup.valid) {

    const url = "/bulk_consumption/save";
    this.bulkConsumptionService.postMethod(url, this.mapping).subscribe(
      (response: any) => {
        if (response.responseCode === 200) {
          this.macList = [];
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.responseMessage,
            icon: "far fa-check-circle",
          });
          this.submitted = false;
          this.clearSearchProduct();
        } else {
          this.messageService.add({
            severity: "info",
            summary: "info",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
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
  submitNonSerialized() {
    this.submitted = true;
    const type = "Non Serialized Item";
    this.mapping = this.mapData(type);
    if (this.mapping.nonSerializedQty == 0) {
      this.messageService.add({
        severity: "infor",
        summary: "info",
        detail: `Please enter quantity more than 0.`,
        icon: "far fa-times-circle",
      });
      this.selectedMACAddress = [];
      return;
    }

    const url = "/bulk_consumption/save";
    this.bulkConsumptionService.postMethod(url, this.mapping).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "info",
            summary: "info",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        } else {
          this.macList = [];
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.responseMessage,
            icon: "far fa-check-circle",
          });
          this.submitted = false;
          this.clearSearchProduct();
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

  deleteConfirmProduct(productId: number): void {
    if (productId) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Product Category?",
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

  deleteProduct(id:any): void {
    const url = "/bulk_consumption/delete";
    const productEditData = this.productListData.find(element => element.id == id);
    this.bulkConsumptionService.deleteMethod(url, productEditData).subscribe(
      (response: any) => {
        if (response.responseCode === 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
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
        this.getProductList("");
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

  pageChangedProductList(pageNumber:any): void {
    this.currentPageProductListdata = pageNumber;
    if (!this.searchkey) {
      this.getProductList("");
    } else {
      this.searchProduct();
    }
  }

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageProductListdata > 1) {
      this.currentPageProductListdata = 1;
    }
    if (!this.searchkey) {
      this.getProductList(this.showItemPerPage);
    } else {
      this.searchProduct();
    }
  }
  approveChangeStatus(id:any) {
    this.approveChangeStatusModal = true;
    this.assignInwardID = id;
  }
  rejectChangeStatus(id:any) {
    this.rejectChangeStatusModal = true;
    this.assignInwardID = id;
  }

  approveInventory(): void {
    this.assignInwardSubmitted = true;
    if (this.assignInwardForm.valid) {
      this.approved = false;
      this.approveInventoryData = [];
      this.selectStaff = null;
      let approvalInwardData = {
        id: this.assignInwardID,
        approvalStatus: "Approve",
        approvalRemark: this.assignInwardForm.get ('remark')?.value,
      };
      const url = `/bulk_consumption/approveStatus`;
      this.customerInventoryMappingService.postMethod(url, approvalInwardData).subscribe(
        (response: any) => {
          if (response.responseCode == 200) {
            this.closeApproveInventoryModal();
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: response.responseMessage,
              icon: "far fa-times-circle",
            });
            if (response.dataList) {
              this.approved = true;
              this.approveInventoryData = response.dataList;
            } else {
              this.getProductList("");
            }
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
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
        }
      );
    }
  }
  rejectInventory(): void {
    this.rejectInwardSubmitted = true;
    if (this.rejectInwardForm.valid) {
      this.reject = false;
      this.selectStaffReject = null;
      this.rejectInventoryData = [];
      let approvalInwardData = {
        id: this.assignInwardID,
        approvalStatus: "Rejected",
        approvalRemark: this.rejectInwardForm.get ('remark')?.value,
      };
      const url = `/bulk_consumption/approveStatus`;

      this.customerInventoryMappingService.postMethod(url, approvalInwardData).subscribe(
        (response: any) => {
          if (response.responseCode == 200) {
            this.closeRejectInventoryModal();
            if (response.dataList) {
              this.reject = true;
              this.rejectInventoryData = response.dataList;
            } else {
              this.getProductList("");
            }
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
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
        }
      );
    }
  }

  getInwardMACMapping(inwardId:any) {
    this.inwardMacList = [];
    this.inwardService.getInwardMacMapping(inwardId).subscribe(
      (res: any) => {
        if (res.dataList.length > 0) {
          this.inwardMacList = res.dataList;
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

  ShowMACandSerial(id:any) {
    this.inwardMacList = [];
    const url = "/bulk_consumption/getBulkConsumptionMapping?bulkconsumptionId=" + id;
    this.bulkConsumptionService.getMethod(url).subscribe(
      (res: any) => {
        if (res.responseCode == 200) {
          if (res.dataList.length > 0) {
            this.inwardMacList = res.dataList;
            this.MACShowModal = true;
          }
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: res.responseMessage,
            icon: "far fa-times-circle",
          });
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

  closeMACandSerialModal() {
    this.MACShowModal = false;
    this.inwardMacList = [];
    this.currentPageinwardMacdata = 1;
    this.getItemListFlag = false;
    this.getInwardFlag = false;
  }

  pageChangedMacSerialList(event:any) {
    this.currentPageinwardMacdata = event;
  }

  closeApproveInventoryModal() {
    this.assignInwardSubmitted = false;
    this.assignInwardForm.reset();
    this.approveChangeStatusModal = false;
  }

  closeRejectInventoryModal() {
    this.rejectInwardSubmitted = false;
    this.rejectInwardForm.reset();
    this.rejectChangeStatusModal = false;
  }

  canExit() {
    if (!this.bulkConsumptionFormGroup.dirty) return true;
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
  assignQuantityValidation(event:any) {
    var num = String.fromCharCode(event.which);
    if (!/[0-9]/.test(num)) {
      event.preventDefault();
    }
  }
}
