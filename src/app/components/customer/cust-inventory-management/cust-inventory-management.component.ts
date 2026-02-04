import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CustomerInventoryManagementService } from "src/app/service/customer-inventory-management.service";
import { BehaviorSubject, Observable, Observer } from "rxjs";
import { CustomerInventoryDetailsService } from "src/app/service/customer-inventory-details.service";
import { CustomerService } from "src/app/service/customer.service";
import { Table } from "primeng/table";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { formatDate } from "@angular/common";
import { Regex } from "src/app/constants/regex";
// import { element } from "protractor";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ServiceAreaService } from "src/app/service/service-area.service";
import { LoginService } from "src/app/service/login.service";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
import { InwardService } from "src/app/service/inward.service";
// import { saveAs as importedSaveAs } from "file-saver";
import { DomSanitizer } from "@angular/platform-browser";
import { DropdownChangeEvent } from 'primeng/dropdown';
import { PaginatorState } from 'primeng/paginator';


declare var $: any;

export interface Country {
  name?: string;
  code?: string;
}

export interface Representative {
  name?: string;
  image?: string;
}

export interface Customer {
  id?: number;
  name?: string;
  country?: Country;
  company?: string;
  date?: string;
  status?: string;
  representative?: Representative;
  activity?: any;
  itemAssemblyName?: any;
  itemAssemblyId?: any;
  custInventoryListId?: any;
}

@Component({
    selector: "app-cust-inventory-management",
    templateUrl: "./cust-inventory-management.component.html",
    styleUrls: ["./cust-inventory-management.component.css"],
    standalone: false
})
export class CustInventoryManagementComponent implements OnInit {
  custData: any = {};
  customerId: number = 0;
  custType: String = "";
  // @Output() backButton = new EventEmitter();
  customerInventoryListItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerInventoryListDataCurrentPage = 1;
  customerInventoryListDataTotalRecords: number;
  assignedInventoryList: any = [];
  staffUserId: any;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  pageOptions = [5, 10, 20, 50, 100];
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  inventoryData = new BehaviorSubject({
    inventoryData: ""
  });
  macAddressList: any = [];
  macAddressList1: any = [];
  macAddressList2: any = [];
  macAddressListSTB: any = [];
  macAddressListCard: any = [];
  replaceProducts: any = [];
  selectedCardOption: any;
  selectedStbOption: any;
  replaceInventoryForm: FormGroup;
  removeRemarkForm: FormGroup;
  replaceSumitted: boolean = false;
  displaySelectParentCustomer: boolean = false;
  replacementType = [
    { label: "Permanant Replacement", value: "Permanant Replacement" },
    { label: "Temporary Replacement", value: "Temporary Replacement" }
  ];

  replacementReasonType = [
    { label: "Defective", value: "Defective" },
    { label: "Upgrade", value: "Upgrade" },
    { label: "Surrender", value: "Surrender" },
    { label: "Others", value: "Others" }
  ];
  productPlanMappingId: any;
  selPlanId: any;
  selReplacePlanId: any;
  selOtherItemId: any;
  selectedMACAddress: any = "";
  selectedPlanMACAddress: any = "";
  selectedSTBPlanMACAddress: any = "";
  selectedCardPlanMACAddress: any = "";
  selectedExternalMACAddress: any = "";
  selectedReplaceMACAddress: any = "";
  selectedReplaceMACAddress2: any = "";
  // selectedMACAddress1: any ="";
  selectedMACAddress2: any = "";
  replaceOldMappingId: any = "";
  @ViewChild("btnClose") btnClose: { nativeElement: { click: () => void; }; };
  inventoryApproveProgressPerPage = RadiusConstants.ITEMS_PER_PAGE;
  inventoryApproveProgresstotalRecords: any;
  currentPageInventoryApproveProgress = 1;
  inventoryApproveProgressDetail: any;
  inventoryWorkflowAuditData: any;
  iscustomerEdit: boolean = false;
  editInventory: boolean = false;
  editSTBCradInventory: boolean = false;
  removeRemarkSubmitted: boolean = false;
  inOutMacMapping = {
    oldId: "",
    oldMac: "",
    oldSerial: "",
    newMac: "",
    newSerial: "",
    newId: "",
    oldStatus: "",
    newStatus: ""
  };
  inventoryAssignForm: FormGroup;
  refundAmountForm: FormGroup;
  inventoryAssignSumitted: boolean = false;
  macPlanListFlag: boolean = false;
  macReplaceListFlag: boolean = false;
  macExternalListFlag: boolean = false;
  serviceList: any[] = [];
  planList: any = [];
  billToPlanName: any = "";
  billToPlan: any;
  billToPlanFlag: boolean = false;
  isInvoiceDataFlag: boolean = false;
  isInvoiceDataSingleFlag: boolean = false;
  isInvoiceDataSingleReplaceFlag: boolean = false;
  isInvoiceDataPairFlag: boolean = false;
  requiredApprovalSingleFlag: boolean = false;
  requiredApprovalPairFlag: boolean = false;
  requiredApprovalNonSerialFlag: boolean = false;
  requiredApprovalPlanFlag: boolean = false;
  connectionNoList: any = [];
  connectionDetailData: any = [];
  custPlanCategory: any = "";
  custDiscount: any = "";
  custDiscountType: any = "";
  selectedCustDiscount: any = "";
  selectedPairDiscount: any = "";
  planGroupName: any = "";
  planGroupId: any = "";
  planGroupPlanMappingFlag: boolean = false;
  individualPlanMappingFlag: boolean = false;
  getPlanSingleSplitterFlag: boolean = false;
  getPlanPairSplitterFlag: boolean = false;
  allActiveProducts: any = [];
  custServiceMappingData: any = [];
  getAllCustomerInvetoryDetailshistoryData: any = [];
  allSTBProducts: any = [];
  allCardProducts: any = [];
  allActiveNonTrackableProducts: any = [];
  externalInventoryAssignForm: FormGroup;
  externalInventoryAssignSumitted: boolean = false;
  planInventoryAssignForm: FormGroup;
  approveAssignInventoryForm: FormGroup;
  rejectAssignInventoryForm: FormGroup;
  approveRemoveInventoryForm: FormGroup;
  rejectRemoveInventoryForm: FormGroup;
  itemDetailData: any;
  actualProductPrice: Number;
  newProductPrice: Number;
  ownershipForm: FormGroup;
  approved = false;
  approveRemove = false;
  macMappingId: any;
  custInventoryId: any;
  selectAssignInventoryApproveStaff: any;
  selectAssignInventoryRejectStaff: any;
  selectRemoveInventoryApproveStaff: any;
  selectRemoveInventoryRejectStaff: any;
  approveAssignInventoryData: any[] = [];
  rejectAssignInventoryData: any[] = [];
  approveRemoveInventoryData: any[] = [];
  rejectRemoveInventoryData: any[] = [];
  reject = false;
  ownershipFlag: any = "";
  rejectRemove = false;
  assignInventoryId: any;
  customerInventoryId: any;
  assignInventoryName: any;
  assignRemoveInventoryId: any;
  nextApproverId: any;
  assignAssignInventorysubmitted: boolean = false;
  rejectAssignInventorySubmitted: boolean = false;
  assignRemoveInventorysubmitted: boolean = false;
  rejectRemoveInventorySubmitted: boolean = false;
  assignReplaceInventorySubmitted: boolean = false;
  planInventoryAssignSumitted: boolean = false;
  inventoryStatus = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" }
  ];
  isInvoiceData = [
    { label: "YES", value: true },
    { label: "NO", value: false }
  ];
  isRequiredApprovalData = [
    { label: "YES", value: true },
    { label: "NO", value: false }
  ];
  isInventoryFreeData = [
    { label: "YES", value: true },
    { label: "NO", value: false }
  ];
  billToData = [
    { label: "ORGANIZATION", value: "ORGANIZATION" },
    { label: "CUSTOMER", value: "CUSTOMER" }
  ];
  itemConditionData = [
    { label: "New", value: "New" },
    { label: "Refurbished", value: "Refurbished" }
  ];
  productByPlanList: any;
  productByPlanListReplace: any;
  getAllPlanIvnetoryIdOnPlanIdList: any;
  otherInventoryReplaceFlag: boolean = false;
  planInventoryReplaceFlag: boolean = false;
  planName: any = "";
  productCategoryName: any = "";
  productCategoryId: any = "";
  inventoryDataByProductCateId: any = [];
  mappingList: any = [];
  oldOfferPricePlan: Number;
  newPriceValue: Number;
  newOfferPricePlan: Number;
  oldOfferOtherSigle: Number;
  perUOMCharge: Number;
  newUOMAmount: Number;
  oldOfferSTB: Number;
  oldOfferCard: Number;
  newOfferSTB: Number;
  newOfferCard: Number;
  oldOfferOtherSigleReplace: Number;
  newOfferSingleFlag: boolean = false;
  newOfferSTBFlag: boolean = false;
  newOfferCardFlag: boolean = false;
  newOfferOtherSigle: Number;
  newOfferOtherSigleReplace: Number;
  oldOfferPricePlanFlag: boolean = false;
  newOfferPriceFlag: boolean = false;
  invoiceDataReadOnly: boolean = false;
  oldOfferBasedDiscountSingleFlag: boolean = false;
  oldOfferBasedDiscountSingleReplaceFlag: boolean = false;
  oldOfferBasedDiscountSTBPairFlag: boolean = false;
  oldOfferBasedDiscountCardPairFlag: boolean = false;
  discountPairFlag: boolean = false;
  oldOfferPriceSingleReplaceFlag: boolean = false;
  oldOfferPriceSingleFlag: boolean = false;
  oldOfferPriceSTBFlag: boolean = false;
  oldOfferBasedDiscountPairFlag: boolean = false;
  oldOfferPriceCardFlag: boolean = false;
  oldOfferBasedDiscountNonSerialFlag: boolean = false;
  oldOfferPriceNonSerialFlag: boolean = false;
  isInvoiceDataNonSerialFlag: boolean = false;
  newOfferNonSerialFlag: boolean = false;
  approveRemoveFlag: boolean = false;
  rejectRemoveFlag: boolean = false;
  billableCusList: any;
  newFirst = 0;
  parentCustomerDialogType: any = "";
  selectedParentCust: any = [];
  currentPageParentCustomerListdata = 1;
  showItemPerPage = 5;
  parentCustomerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  prepaidParentCustomerList: any;
  editCustomerId: any;
  customerListData: any = [];
  parentCustomerListdatatotalRecords: any;
  oldOfferBasedDiscountPlanFlag: boolean = false;
  selItemCondition: any = "";
  selItemConditionReplace: any = "";
  selPlanItemCondition: any = "";
  customers: Customer[] = [];
  rowGroupMetadata: any = {};
  searchOptionSelect = this.commondropdownService.customerInventorySearchOption;
  productSelectionType = [
    { label: "Single Item", value: false },
    { label: "Pair Item", value: true }
    // { label: "Non Serialized Item", value: "Non Serialized Item" },
  ];
  ItemSelectionType = [
    { label: "Serialized Item", value: "Serialized Item" },
    { label: "Non Serialized Item", value: "Non Serialized Item" }
  ];
  externalItemList: any = [];
  getNonTrackableProductQtyList: any = [];
  getAllSerializedProductFlag: boolean = false;
  itemConditionSingleFlag: boolean = false;
  itemConditionPlanSeriFlag = false;
  itemConditionPlanPairFlag = false;
  selAssemblyTypePlanFlag = false;
  selAssemblyTypePlanGroupFlag = false;
  getAssemblyNameflag: boolean = false;
  itemConditionPairFlag: boolean = false;
  itemConditionSingleReplaceFlag: boolean = false;
  getAllAssemblyTypeFlag: boolean = false;
  getAllAssemblyNameFlag: boolean = false;
  getAllPairProductFlag: boolean = false;
  getSplitterFlag: boolean = false;
  getAllSingleItemMacFlag: boolean = false;
  getAllPairItemMacFlag: boolean = false;
  getAllPairItemMacReplaceFlag: boolean = false;
  billToSigleFlag: boolean = false;
  billToSigleReplaceFlag: boolean = false;
  billToPairFlag: boolean = false;
  parentCustList: any;
  searchParentCustValue = "";
  searchParentCustOption = "";
  parentFieldEnable = false;
  getAllConnectionNumberFlag: boolean = false;
  getExternalProductFlag: boolean = false;
  getExternalItemListFlag: boolean = false;
  getAllPlanFlag: boolean = false;
  getPlanInventoryIdFlag: boolean = false;
  getProductCategoryFlag: boolean = false;
  getProductForPlanInventoryAssignFlag: boolean = false;
  getAllPairPlanProductSTBFlag: boolean = false;
  getAllPairProductCardFlag: boolean = false;
  getAllNonSerializedProductFlag: boolean = false;
  serializedItemAssignFlag: boolean = false;
  nonSerializedItemAssignFlag: boolean = false;
  availableQty = 0;
  showQtyError: boolean;
  priceErrorMsg = "";
  submitted: boolean = false;
  showError: boolean = false;
  negativeAssignQtyError: boolean;
  availableQtyFlag: boolean = false;
  UOM: any = "";
  filterProductData: any = [];
  hasMac: boolean;
  hasSerial: boolean;
  enterMacSerial: any = "";
  editMacSerialBtn: any = "";
  enterSTBSerial: any = "";
  editSTBSerialBtn: any = "";
  enterCardSerial: any = "";
  editCardSerialBtn: any = "";
  enterPlanLevelMacSerial: any = "";
  editPlanLevelMacSerialBtn: any = "";
  editReplacementLevelMacSerialBtn: any = "";
  enterReplacementLevelMacSerial: any = "";
  removeId: any = "";
  removeCustinventoryid: any = "";
  removeItemId: any = "";
  fileterGlobalSingleItem: any = "";
  stbFileterGlobal: any = "";
  cardFileterGlobal: any = "";
  filterGlobalReplaceSingle: any = "";
  fileterGlobalPlanlevel: any = "";
  stbFileterGlobalReplace: any = "";
  cardFileterGlobalReplace: any = "";
  externalItemsFilterGlobal: any = "";
  getAllInventoryofCust: any = [];
  getAllInventoryofCustFilterGlobal: any = "";
  planInventoryId: any = [];
  removeRemark: any = "";
  selectedReplacementType: any = "";
  replaceAssignForm: FormGroup;
  isApproveRequest: boolean;
  replaceInventoryIdInOutMacMapping: string;
  currentDate = new Date();
  refundAmountSubmitted: boolean = false;
  serviceCustomerId: any;
  replaceInventoryCustId: any;
  isShowConnection = true;
  serviceSerialNumbers: { serialNumber: any; custPlanMapppingId: any; connectionNo: any; }[] = [];
  showSelectStaffModel: boolean = false;
  displayAssignPlanInventoryModal: boolean = false;
  displayDialogAssignOtherInventory: boolean = false;
  displayAssignInventoryWithExternalItemGroup: boolean = false;
  displayCustomerInventoryHistory: boolean = false;
  displayDTVHistory: boolean = false;
  displaySwapInventoryPlan: boolean = false;
  replaceInventoryModal: boolean = false;
  DTVHistoryAccess: boolean = false;
  replaceAccess: boolean = false;
  editAccess: boolean = false;
  removeAccess: boolean = false;
  otherInventoryAccess: boolean = false;
  planInventoryAccess: boolean = false;
  externalInventoryAccess: boolean = false;
  InventoryHistoryAccess: boolean = false;
  swapInventoryAccess: boolean = false;
  productData: any;
  inventorySpecificationParamModal: boolean = false;
  inventorySpecificationDetailModal: boolean = false;
  inventorySpecificationDetails: any[] = [];
  specDetailsShow: boolean = false;
  editedRowIndex: number = -1;
  selectedService: any;
  selectedSerialNumber: any;
  inventoryId: any;
  isEditEnable: boolean = false;
  inventoryIdData: any;
  uploadDocForm: FormGroup;
  selectedFileUploadPreview: any[];
  uploadDocumentId: boolean;
  selectedFile: any;
  inventoryFileData: any = "";
  downloadDocumentId: boolean;
  multiFiles: FileList;
  filenameList: any;
  previewUrl: any;
  loading!:boolean;
  documentPreview: boolean = false;
isassemblyStaffMac: any;
productPageChargeDeatilList: string|number;
productDeatiltotalRecords: string|number;
  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private customerInventoryManagementService: CustomerInventoryManagementService,
    public commondropdownService: CommondropdownService,
    public serviceAreaService: ServiceAreaService,
    public CustomerInventoryDetailsService: CustomerInventoryDetailsService,
    private customerManagementService: CustomermanagementService,
    private customerService: CustomerService,
    loginService: LoginService,
    private inwardService: InwardService,
    private sanitizer: DomSanitizer
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.otherInventoryAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_INVEN_OTHER
        : POST_CUST_CONSTANTS.POST_CUST_INVEN_OTHER
    );
    this.planInventoryAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_INVEN_PLAN
        : POST_CUST_CONSTANTS.POST_CUST_INVEN_PLAN
    );
    this.externalInventoryAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_INVEN_EXTERNAL
        : POST_CUST_CONSTANTS.POST_CUST_INVEN_EXTERNAL
    );
    this.InventoryHistoryAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_INVEN_HISTORY
        : POST_CUST_CONSTANTS.POST_CUST_CAF_INVEN_HISTORY
    );
    this.swapInventoryAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_INVEN_SWAP
        : POST_CUST_CONSTANTS.POST_CUST_INVEN_SWAP
    );
    this.removeAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_INVEN_REMOVE
        : POST_CUST_CONSTANTS.POST_CUST_INVEN_REMOVE
    );
    this.editAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_INVEN_EDIT
        : POST_CUST_CONSTANTS.POST_CUST_INVEN_EDIT
    );
    this.replaceAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_INVEN_REPLACE
        : POST_CUST_CONSTANTS.POST_CUST_INVEN_REPLACE
    );
    this.DTVHistoryAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_INVEN_DTV
        : POST_CUST_CONSTANTS.POST_CUST_INVEN_DTV
    );
  }

  ngOnInit(): void {
    this.staffUserId = localStorage.getItem("userId");
    console.log("custData", this.custData);
    this.getCustomersDetail(this.customerId);
    this.getService("");
    // this.getCustomerAssignedList();

    //this.getAllProduct();
    this.replaceInventoryForm = this.fb.group({
      productId: ["", Validators.required],
      customerId: [this.custData.id],
      inventoryType: [""],
      assignedDateTime: ["", Validators.required],
      replacementReason: ["", Validators.required],
      remark: ["", Validators.required],
      isInvoiceToOrg: [false],
      billTo: ["CUSTOMER"],
      discount: [""],
      offerPrice: [""],
      newAmount: [""],
      chargeId: [""],
      isRequiredApproval: [false],
      isFree: [false],
      itemType: [""],
      billabecustId: [""],
      parentCustomerId: [""]
    });
    this.removeRemarkForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.refundAmountForm = this.fb.group({
      actualRefundPrice: ["", Validators.required],
      newRefundAmount: ["", Validators.required]
    });
    this.inventoryAssignForm = this.fb.group({
      id: [""],
      qty: ["1"],
      productId: ["", Validators.required],
      customerId: [this.custData.id],
      serviceId: ["", Validators.required],
      inventoryType: [""],
      staffId: [""],
      inwardId: [""],
      assignedDateTime: ["", Validators.required],
      status: [""],
      paymentOwnerId: ["", Validators.required],
      mvnoId: [""],
      externalItemId: [""],
      itemId: [""],
      itemAssemblyId: [""],
      itemAssemblyName: ["", Validators.required],
      itemAssemblyflag: ["", Validators.required],
      itemTypeFlag: ["", Validators.required],
      nonSerializedQty: [""],
      nonSerializedItemRemark: [
        "",
        [Validators.pattern(Regex.characterlength255), Validators.required]
      ],
      connectionNo: ["", Validators.required],
      isInvoiceToOrg: [false],
      billTo: ["CUSTOMER"],
      discount: [""],
      offerPrice: [""],
      newAmount: [""],
      chargeId: [""],
      isRequiredApproval: [false],
      isFree: [false],
      itemType: ["", Validators.required],
      billabecustId: [""],
      parentCustomerId: [""]
    });
    console.log("inventoryAssignForm", this.inventoryAssignForm);
    this.externalInventoryAssignForm = this.fb.group({
      id: [""],
      qty: ["1"],
      productId: ["", Validators.required],
      customerId: [this.custData.id],
      serviceId: ["", Validators.required],
      inventoryType: [""],
      staffId: [""],
      inwardId: [""],
      assignedDateTime: ["", Validators.required],
      status: [""],
      mvnoId: [""],
      externalItemId: ["", Validators.required],
      itemId: [""],
      connectionNo: ["", Validators.required]
    });

    this.planInventoryAssignForm = this.fb.group({
      productPlanMappingId: [""],
      qty: [""],
      productId: [[], Validators.required],
      customerId: [this.custData.id],
      serviceId: ["", Validators.required],
      inventoryType: [""],
      staffId: [""],
      inwardId: [""],
      assignedDateTime: ["", Validators.required],
      paymentOwnerId: ["", Validators.required],
      status: [""],
      mvnoId: [""],
      externalItemId: [""],
      itemId: [""],
      itemType: [""],
      itemAssemblyId: [""],
      itemAssemblyName: ["", Validators.required],
      itemAssemblyflag: ["", Validators.required],
      // itemAssemblyId: [""],
      // itemAssemblyName: [""],
      // itemAssemblyflag: [""],
      connectionNo: ["", Validators.required],
      planId: ["", Validators.required],
      isInvoiceToOrg: [false],
      billTo: [""],
      discount: [""],
      offerPrice: [""],
      newAmount: [""],
      chargeId: [""],
      planGroupId: [""],
      planGroupName: [""],
      isRequiredApproval: [false],
      isFree: [false],
      billabecustId: [""],
      parentCustomerId: [""]
    });
    this.approveAssignInventoryForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.rejectAssignInventoryForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.approveRemoveInventoryForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.rejectRemoveInventoryForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.ownershipForm = this.fb.group({
      ownership: [""]
    });
    this.inventoryAssignForm.controls['itemAssemblyName'].disable();
    this.inventoryAssignForm.controls['itemAssemblyflag'].disable();
    // this.planInventoryAssignForm.controls.itemAssemblyName.disable();
    setTimeout(() => {
      this.updateRowGroupMetaData();
    }, 1000);
    this.inventoryAssignForm.get("nonSerializedQty").valueChanges.subscribe(val => {
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
    this.replaceAssignForm = this.fb.group({
      remark: ["", Validators.required]
    });

    this.inventoryAssignForm.get("newAmount").valueChanges.subscribe(val => {
      const newPriceValue = val;
      this.showError = false;
      this.priceErrorMsg = "";
      if (newPriceValue > this.oldOfferOtherSigle) {
        this.showError = true;
        this.priceErrorMsg =
          "Please enter a new offer price less than or equal to the old offerprice.";
      }
      if (newPriceValue > this.perUOMCharge) {
        this.showError = true;
        this.priceErrorMsg =
          "Please enter a new uom price less than or equal to the per uom price.";
      }
      if (newPriceValue > this.oldOfferSTB) {
        this.showError = true;
        this.priceErrorMsg =
          "Please enter a new offer price less than or equal to the old offerprice.";
      }
    });
    this.planInventoryAssignForm.get("newAmount").valueChanges.subscribe(val => {
      const newPriceValue = val;
      this.showError = false;
      this.priceErrorMsg = "";
      if (Number(newPriceValue) > Number(this.oldOfferPricePlan)) {
        this.showError = true;
        this.priceErrorMsg =
          "Please enter a new offer price less than or equal to the old offerprice.";
      }
    });
    this.uploadDocForm = this.fb.group({
      file: ["", Validators.required]
    });
  }

  getCustomersDetail(custId: string | number) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.custData = response.customers;
      this.getStaffDetailById(this.custData.serviceareaid);
    });
  }
  customerDetailOpen() {
    this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
  }
  canSubmit(): boolean {
    console.log("check boyh.... ", this.selectedCardOption, this.selectedStbOption);
    return this.selectedCardOption && this.selectedStbOption;
  }
  // Update Row Group Meta Data
  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};

    if (this.assignedInventoryList) {
      for (let i = 0; i < this.assignedInventoryList.length; i++) {
        let rowData = this.assignedInventoryList[i];
        let representativeName = rowData.custInventoryListId ? rowData.custInventoryListId : null;

        if (i == 0) {
          this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
        } else {
          let previousRowData = this.assignedInventoryList[i - 1];
          let previousRowGroup = previousRowData.custInventoryListId
            ? previousRowData.custInventoryListId
            : null;
          if (representativeName === previousRowGroup) {
            this.rowGroupMetadata[representativeName].size++;
          } else {
            this.rowGroupMetadata[representativeName] = { index: i, size: 1 };
          }
        }
      }
    }
  }

  // customer assigned inventory list
  getCustomerAssignedList(): void {
    // const data = {
    //   filters: [
    //     {
    //       filterValue: this.custData.id,
    //       filterColumn: "customerId",
    //     },
    //   ],
    //   page: this.customerInventoryListDataCurrentPage,
    //   pageSize: this.customerInventoryListItemsPerPage,
    //   sortBy: "createdate",
    //   sortOrder: 0,
    // };

    // const url = "/inwards/getByCustomerId";
    const url = "/inwards/getAllCustomerInventoryList?custId=" + this.customerId;
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (res: any) => {
        this.assignedInventoryList = res.dataList;
        //this.customerInventoryListDataTotalRecords = res.totalRecords;
        setTimeout(() => {
          this.updateRowGroupMetaData();
        }, 1000);
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

  pageChangedEventCustomerAssignInventory(pageNumber: number): void {
    this.customerInventoryListDataCurrentPage = pageNumber;
    this.getCustomerAssignedList();
  }

  totalItemsEventCustomerAssignInventory(event: { value: any; }): void {
    this.customerInventoryListDataCurrentPage = 1;
    this.customerInventoryListItemsPerPage = Number(event.value);
    this.getCustomerAssignedList();
  }

  openInventoryDetailModal(modalId: string, data: any) {
    this.CustomerInventoryDetailsService.show(modalId);
    this.inventoryData.next({
      inventoryData: data
    });
  }

  replaceInventoryModalOpen(inventory: { itemAssemblyId: any; customerId: any; inOutWardMACMapping: {
    id: any; itemId: any; 
}[]; planId: null; }): void {
    console.log("itemA :::: ", inventory);
    if (inventory.itemAssemblyId == undefined) {
      this.replaceInventoryCustId = inventory.customerId;
      let id = inventory.inOutWardMACMapping[0].id;
      this.replaceInventoryModal = true;
      this.replaceInventoryForm.reset();
      if (inventory.planId != null) {
        this.replaceOldMappingId = id;
        this.itemConditionSingleReplaceFlag = false;
        this.getAllPlanIvnetoryIdAtReplace(inventory.planId);
      }
      if (inventory.planId == null) {
        this.replaceOldMappingId = id;
        this.itemConditionSingleReplaceFlag = true;
        this.getProductsToReplace(id);
      }
    } else {
      this.getAllPairItemMacReplaceFlag = false;
      let id = inventory.inOutWardMACMapping[0].id;
      this.getProductsByAssemblyId(inventory.itemAssemblyId);
      $("#replaceAssemblyInventoryModal").modal("show");
      // this.replaceInventoryForm.reset();
      // this.replaceOldMappingId = id;
      //this.getProductsToReplace(id);
    }
    this.selOtherItemId = inventory.inOutWardMACMapping[0].itemId;
  }
  // STB and Card Replace Individually
  replaceInventorySTBCARDModalOpen(inventory: { itemAssemblyId: any; customerId: any; inOutWardMACMapping: {
    id: any; itemId: any; 
}[]; planId: null; }): void {
    console.log("1 itemA :::::: ", inventory);
    if (inventory.itemAssemblyId != undefined) {
      this.replaceInventoryCustId = inventory.customerId;
      let id = inventory.inOutWardMACMapping[0].id;
      this.replaceInventoryModal = true;
      this.replaceInventoryForm.reset();
      if (inventory.planId != null) {
        this.replaceOldMappingId = id;
        this.itemConditionSingleReplaceFlag = false;
        this.getAllPlanIvnetoryIdAtReplace(inventory.planId);
      }
      if (inventory.planId == null) {
        this.replaceOldMappingId = id;
        this.itemConditionSingleReplaceFlag = true;
        this.getProductsToReplace(id);
      }
    }
    this.selOtherItemId = inventory.inOutWardMACMapping[0].itemId;
  }

  replaceInventoryModalClose(): void {
    this.filterGlobalReplaceSingle = "";
    this.otherInventoryReplaceFlag = false;
    this.planInventoryReplaceFlag = false;
    this.macReplaceListFlag = false;
    this.replaceSumitted = false;
    this.selectedReplaceMACAddress = "";
    this.replaceInventoryForm.reset();
    this.macAddressList = [];
    this.billToSigleFlag = false;
    this.billToPairFlag = false;
    this.discountPairFlag = false;
    this.itemConditionPairFlag = false;
    this.isInvoiceDataSingleFlag = false;
    this.getPlanSingleSplitterFlag = false;
    this.getPlanPairSplitterFlag = false;
    this.getAllPairPlanProductSTBFlag = false;
    this.getAssemblyNameflag = false;
    this.getAllPairProductCardFlag = false;
    this.itemConditionSingleFlag = false;
    this.itemConditionPlanSeriFlag = false;
    this.itemConditionPlanPairFlag = false;
    this.selAssemblyTypePlanFlag = false;
    this.selAssemblyTypePlanGroupFlag = false;
    this.oldOfferPriceSingleFlag = false;
    this.newOfferSingleFlag = false;
    this.newOfferSTBFlag = false;
    this.newOfferCardFlag = false;
    this.oldOfferBasedDiscountSingleFlag = false;
    this.oldOfferBasedDiscountCardPairFlag = false;
    this.oldOfferBasedDiscountNonSerialFlag = false;
    this.oldOfferBasedDiscountPlanFlag = false;
    this.oldOfferBasedDiscountSTBPairFlag = false;
    this.oldOfferBasedDiscountSingleFlag = false;
    this.oldOfferBasedDiscountSingleReplaceFlag = false;
    this.oldOfferPriceCardFlag = false;
    this.oldOfferPriceNonSerialFlag = false;
    this.oldOfferPricePlanFlag = false;
    this.oldOfferPriceSTBFlag = false;
    this.oldOfferPriceSingleReplaceFlag = false;
    this.newOfferNonSerialFlag = false;
    this.replaceInventoryModal = false;
  }

  replaceAssemblyInventoryModalClose(): void {
    this.replaceSumitted = false;
    this.selectedReplaceMACAddress = "";
    this.selectedReplaceMACAddress2 = "";
    this.cardFileterGlobalReplace = "";
    this.stbFileterGlobalReplace = "";
    this.replaceInventoryForm.reset();
    this.itemConditionPairFlag = false;
    this.macAddressList1 = [];
    this.macAddressList2 = [];
    this.billToSigleFlag = false;
    this.billToPairFlag = false;
    this.discountPairFlag = false;
    this.isInvoiceDataSingleFlag = false;
    this.itemConditionSingleFlag = false;
    this.itemConditionPlanSeriFlag = false;
    this.itemConditionPlanPairFlag = false;
    this.getAssemblyNameflag = false;
    this.selAssemblyTypePlanFlag = false;
    this.selAssemblyTypePlanGroupFlag = false;
    this.oldOfferPriceSingleFlag = false;
    this.newOfferSingleFlag = false;
    this.newOfferSTBFlag = false;
    this.newOfferCardFlag = false;
    this.oldOfferBasedDiscountSingleFlag = false;
    this.oldOfferBasedDiscountCardPairFlag = false;
    this.oldOfferBasedDiscountNonSerialFlag = false;
    this.oldOfferBasedDiscountPlanFlag = false;
    this.oldOfferBasedDiscountSTBPairFlag = false;
    this.oldOfferBasedDiscountSingleFlag = false;
    this.oldOfferBasedDiscountSingleReplaceFlag = false;
    this.oldOfferPriceCardFlag = false;
    this.getAllPairItemMacReplaceFlag = false;
    this.oldOfferPriceNonSerialFlag = false;
    this.oldOfferPricePlanFlag = false;
    this.oldOfferPriceSTBFlag = false;
    this.oldOfferPriceSingleReplaceFlag = false;
    this.newOfferNonSerialFlag = false;
    $("#replaceAssemblyInventoryModal").modal("hide");
  }

  getProductsToReplace(id: any) {
    const url = `/product/getAllProductsByMacSerial?macMappingId=${id}`;

    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.replaceProducts = response.dataList;
        this.otherInventoryReplaceFlag = true;
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

  stbProductsOld: any = [];
  cardProductsOld: any = [];
  stbProductsToReplace: any = [];
  cardProductsToReplace: any = [];

  getAssemlyProductsToReplace(data: { inOutWardMACMapping: { id: any; }[]; dtvCategory: string; }) {
    const url = `/product/getAllProductsByMacSerial?macMappingId=${data.inOutWardMACMapping[0].id}`;
    console.log("URL:", url);

    this.getAllPairItemMacReplaceFlag = false;
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        console.log("response", response.dataList);
        if (data.dtvCategory == "STB") {
          this.stbProductsOld = data;
          this.stbProductsToReplace = response.dataList;
          console.log("stb:", this.stbProductsToReplace);
        } else if (data.dtvCategory == "Card") {
          this.cardProductsOld = data;
          this.cardProductsToReplace = response.dataList;
          console.log("Card", this.cardProductsToReplace);
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

  getProductsByAssemblyId(id: any) {
    const url = `/inoutWardMacMapping/getAllAssemblyInventory?assemblyId=${id}`;

    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        console.log("Old Inventory", response.dataList);
        response.dataList.forEach((data: any) => {
          this.getAssemlyProductsToReplace(data);
        });
        // this.pairedProductsToReplace=response.dataList;
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
  // Get Mac Address List for Single Item
  getMacAddressList(event: { value: any; }) {
    this.macAddressList = [];

    const staffId = localStorage.getItem("userId");
    const productId = event.value;
    let product = this.allActiveProducts.find((element: { id: any; }) => element.id == productId);
    this.hasMac = product.productCategory.hasMac;
    this.hasSerial = product.productCategory.hasSerial;
    const url =
      "/outwards/getItemHistoryByProduct?productId=" +
      productId +
      "&ownerId=" +
      staffId +
      "&ownerType=Staff";
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (res: any) => {
        this.getAllPairItemMacFlag = false;
        this.macAddressList = res.dataList.filter(
          (          element: { condition: any; }) => element.condition == this.selItemCondition
        );

        if (this.macAddressList.length == 0 || this.macAddressList == null) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "Assignee does not have a product",
            icon: "far fa-times-circle"
          });
          this.billToSigleFlag = false;
          this.billToPairFlag = false;
          this.discountPairFlag = false;
          this.isInvoiceDataSingleFlag = false;
          this.oldOfferPriceSingleFlag = false;
          this.oldOfferBasedDiscountSingleFlag = false;
        } else {
          this.getAllSingleItemMacFlag = true;
          this.billToSigleFlag = true;
          this.inventoryAssignForm.controls['billTo'].setValue("CUSTOMER");
          this.isInvoiceDataSingleFlag = false;
          this.oldOfferPriceSingleFlag = false;
          this.oldOfferBasedDiscountSingleFlag = true;
          console.log("this.macAddressList", this.macAddressList);
          this.getProductDetails(product);
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
  // Single Item Plan Level Macc Serial Address List
  getPlanLevelMacAddressList(event: { value: any; }) {
    this.macAddressList = [];

    const staffId = localStorage.getItem("userId");
    const productId = event.value;
    let product = this.productByPlanList.find((element: { id: any; }) => element.id == productId);
    this.hasMac = product.productCategory.hasMac;
    this.hasSerial = product.productCategory.hasSerial;
    let planId = this.selPlanId;
    const url =
      "/outwards/getItemBasedOnProductType?ownerType=Staff" +
      "&ownerid=" +
      staffId +
      "&planId=" +
      planId +
      "&productId=" +
      productId +
      "&planGroupId=" +
      this.planGroupId +
      "&productCategoryId=" +
      this.productCategoryId;
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (res: any) => {
        // this.macAddressList = res.dataList;
        this.macAddressList = res.dataList.filter(
          (          element: { condition: any; }) => element.condition == this.selPlanItemCondition
        );
        console.log("this.macAddressList", this.macAddressList);

        if (this.macAddressList.length == 0 || this.macAddressList == null) {
          this.macPlanListFlag = false;
          this.billToPlanFlag = false;
          this.oldOfferBasedDiscountPlanFlag = false;
          this.oldOfferPricePlanFlag = false;
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "Assignee does not have a product",
            icon: "far fa-times-circle"
          });
        } else {
          this.macPlanListFlag = true;
          this.billToPlanFlag = true;
          this.oldOfferBasedDiscountPlanFlag = false;
          this.oldOfferPricePlanFlag = false;
          if (this.billToPlanName == "ORGANIZATION") {
            this.isInvoiceDataFlag = true;
            this.oldOfferPricePlanFlag = true;
            this.oldOfferBasedDiscountPlanFlag = false;
          } else {
            this.isInvoiceDataFlag = false;
            this.oldOfferPricePlanFlag = false;
            this.oldOfferBasedDiscountPlanFlag = true;
          }
          this.getMappingDetails(
            this.planGroupId,
            planId,
            this.productCategoryId,
            productId,
            this.billToPlanName
          );
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
  // Pair Item STB Plan Level Mac Address List
  getPlanLevelSTBMacAddressList(event: { value: any; }) {
    this.macAddressList = [];

    const staffId = localStorage.getItem("userId");
    const productId = event.value;
    let product = this.productByPlanList.find((element: { id: any; }) => element.id == productId);
    this.hasMac = product.productCategory.hasMac;
    this.hasSerial = product.productCategory.hasSerial;
    let planId = this.selPlanId;
    const url =
      "/outwards/getItemBasedOnProductType?ownerType=Staff" +
      "&ownerid=" +
      staffId +
      "&planId=" +
      planId +
      "&productId=" +
      productId +
      "&planGroupId=" +
      this.planGroupId +
      "&productCategoryId=" +
      this.productCategoryId;
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (res: any) => {
        // this.macAddressList = res.dataList;
        this.macAddressListSTB = res.dataList.filter(
          (          element: { condition: any; }) => element.condition == this.selPlanItemCondition
        );
        console.log("this.macAddressList", this.macAddressListSTB);

        if (this.macAddressListSTB.length == 0 || this.macAddressListSTB == null) {
          this.macPlanListFlag = false;
          this.billToPlanFlag = false;
          this.oldOfferBasedDiscountPlanFlag = false;
          this.oldOfferPricePlanFlag = false;
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "Assignee does not have a product",
            icon: "far fa-times-circle"
          });
        } else {
          this.macPlanListFlag = true;
          this.billToPlanFlag = true;
          this.oldOfferBasedDiscountPlanFlag = false;
          this.oldOfferPricePlanFlag = false;
          if (this.billToPlanName == "ORGANIZATION") {
            this.isInvoiceDataFlag = true;
            this.oldOfferPricePlanFlag = true;
            this.oldOfferBasedDiscountPlanFlag = false;
          } else {
            this.isInvoiceDataFlag = false;
            this.oldOfferPricePlanFlag = false;
            this.oldOfferBasedDiscountPlanFlag = true;
          }
          this.getMappingDetails(
            this.planGroupId,
            planId,
            this.productCategoryId,
            productId,
            this.billToPlanName
          );
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

  // Pair Item Card Plan Level Mac Address List
  getPlanLevelCardMacAddressList(event: { value: any; }) {
    const staffId = localStorage.getItem("userId");
    const productId = event.value;
    let product = this.allActiveProducts.find((element: { id: any; }) => element.id == productId);
    const url =
      "/outwards/getItemHistoryByProduct?productId=" +
      productId +
      "&ownerId=" +
      staffId +
      "&ownerType=Staff";
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (res: any) => {
        this.macAddressListCard = res.dataList.filter(
          (          element: { condition: any; }) => element.condition == this.selPlanItemCondition
        );
        // this.macAddressList2 = res.dataList;
        if (this.macAddressListCard.length == 0 || this.macAddressListCard == null) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "Assignee does not have a product",
            icon: "far fa-times-circle"
          });
          this.oldOfferBasedDiscountSTBPairFlag = false;
          this.oldOfferBasedDiscountCardPairFlag = false;
        } else {
          this.inventoryAssignForm.controls['billTo'].setValue("CUSTOMER");
          this.isInvoiceDataPairFlag = false;
          this.oldOfferPriceSTBFlag = false;
          this.oldOfferPriceCardFlag = false;
          this.oldOfferBasedDiscountCardPairFlag = true;
          // this.oldOfferBasedDiscountSTBPairFlag = false;
          this.getCardProductDetails(product);
          // this.billToPairFlag = true;
          console.log("this.macAddressList", this.macAddressList2);

          this.getAllSingleItemMacFlag = false;
          this.getAllPairItemMacFlag = true;
          this.getAllPairItemMacReplaceFlag = false;
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

  selReplacementType(event: { value: any; }) {
    this.selectedReplacementType = event.value;
  }

  getReplaceLevelMacAddressList(event: { value: any; }) {
    this.macAddressList = [];

    const staffId = localStorage.getItem("userId");
    const productId = event.value;
    let product = this.replaceProducts.find((element: { id: any; }) => element.id == productId);
    this.hasMac = product.productCategory.hasMac;
    this.hasSerial = product.productCategory.hasSerial;
    // const url =
    //   "/outwards/getItemHistoryByProduct?productId=" +
    //   productId +
    //   "&ownerId=" +
    //   staffId +
    //   "&ownerType=Staff";
    const url =
      "/outwards/getItemBasedOnCondtion?productId=" +
      productId +
      "&itemId=" +
      this.selOtherItemId +
      "&ownerId=" +
      staffId +
      "&ownerShipType=Staff" +
      "&replacementReason=" +
      this.selectedReplacementType;
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (res: any) => {
        // this.macAddressList = res.dataList.filter(
        //   element => element.condition == this.selItemConditionReplace
        // );
        this.macAddressList = res.dataList;
        // this.billToSigleReplaceFlag = true;
        // this.getProductDetailsReplace(product);
        console.log("this.macAddressList", this.macAddressList);

        if (this.macAddressList.length == 0 || this.macAddressList == null) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "Assignee does not have a product",
            icon: "far fa-times-circle"
          });
        } else {
          this.macReplaceListFlag = true;
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

  getReplacePlanLevelMacAddressList(event: { value: any; }) {
    this.macAddressList = [];

    const staffId = localStorage.getItem("userId");
    const productId = event.value;
    let product = this.productByPlanListReplace.find((element: { id: any; }) => element.id == productId);
    this.hasMac = product.productCategory.hasMac;
    this.hasSerial = product.productCategory.hasSerial;
    let planId = this.selReplacePlanId;
    // const url =
    //   "/outwards/getItemBasedOnProductType?ownerType=Staff" +
    //   "&ownerid=" +
    //   staffId +
    //   "&planId=" +
    //   planId +
    //   "&productId=" +
    //   productId;
    const url =
      "/outwards/getItemBasedOnProductType?ownerType=Staff" +
      "&ownerid=" +
      staffId +
      "&planId=" +
      planId +
      "&productId=" +
      productId +
      "&planGroupId=" +
      this.planGroupId +
      "&productCategoryId=" +
      this.productCategoryId;
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (res: any) => {
        this.macAddressList = res.dataList;
        console.log("this.macAddressList", this.macAddressList);

        if (this.macAddressList.length == 0 || this.macAddressList == null) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "Assignee does not have a product",
            icon: "far fa-times-circle"
          });
        } else {
          this.macReplaceListFlag = true;
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

  getMultipleMacAddressList(event: { value: any; }) {
    const staffId = localStorage.getItem("userId");
    const productId = event.value;
    console.log("productId", productId);
    const url = "/product/getAllItemBasedOnProduct";
    this.customerInventoryManagementService.postMethod(url, productId).subscribe(
      (res: any) => {
        this.macAddressList = res;
        console.log("this.macAddressList", this.macAddressList);

        if (this.macAddressList.length == 0 || this.macAddressList == null) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "Assignee does not have a product",
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
  //Get All Mac Address List for Pair STB At Inventory Assign
  getMacAddressList1(event: { value: any; }) {
    const staffId = localStorage.getItem("userId");
    const productId = event.value;
    let product = this.allActiveProducts.find((element: { id: any; }) => element.id == productId);
    const url =
      "/outwards/getItemHistoryByProduct?productId=" +
      productId +
      "&ownerId=" +
      staffId +
      "&ownerType=Staff";
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (res: any) => {
        this.getAllSingleItemMacFlag = false;
        this.getAllPairItemMacFlag = true;
        this.getAllPairItemMacReplaceFlag = false;
        this.macAddressList1 = res.dataList.filter(
          (          element: { condition: any; }) => element.condition == this.selItemCondition
        );
        // this.macAddressList1 = res.dataList;
        if (this.macAddressList1.length == 0 || this.macAddressList1 == null) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "Assignee does not have a product",
            icon: "far fa-times-circle"
          });
          this.oldOfferBasedDiscountSTBPairFlag = false;
          this.oldOfferBasedDiscountCardPairFlag = false;
        } else {
          this.inventoryAssignForm.controls['billTo'].setValue("CUSTOMER");
          this.isInvoiceDataPairFlag = false;
          this.oldOfferPriceSTBFlag = false;
          this.oldOfferPriceCardFlag = false;
          // this.oldOfferBasedDiscountCardPairFlag = false;
          this.oldOfferBasedDiscountSTBPairFlag = true;
          this.getSTBProductDetails(product);
          this.billToPairFlag = true;
          console.log("this.macAddressList", this.macAddressList1);
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

  //Get All Mac Address List for Pair STB At Inventory Replace
  getMacAddressList1Replace(event: { value: any; }) {
    const staffId = localStorage.getItem("userId");
    const productId = event.value;
    let product = this.allActiveProducts.find((element: { id: any; }) => element.id == productId);
    const url =
      "/outwards/getItemHistoryByProduct?productId=" +
      productId +
      "&ownerId=" +
      staffId +
      "&ownerType=Staff";
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (res: any) => {
        this.getAllSingleItemMacFlag = false;
        this.getAllPairItemMacFlag = false;
        this.getAllPairItemMacReplaceFlag = true;
        // this.macAddressList1 = res.dataList.filter(
        //   element => element.condition == this.selItemCondition
        // );
        this.macAddressList1 = res.dataList;
        if (this.macAddressList1.length == 0 || this.macAddressList1 == null) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "Assignee does not have a product",
            icon: "far fa-times-circle"
          });
          this.oldOfferBasedDiscountSTBPairFlag = false;
          this.oldOfferBasedDiscountCardPairFlag = false;
        } else {
          this.inventoryAssignForm.controls['billTo'].setValue("CUSTOMER");
          this.isInvoiceDataPairFlag = false;
          this.oldOfferPriceSTBFlag = false;
          this.oldOfferPriceCardFlag = false;
          // this.oldOfferBasedDiscountCardPairFlag = false;
          this.oldOfferBasedDiscountSTBPairFlag = true;
          this.getSTBProductDetails(product);
          this.billToPairFlag = true;
          console.log("this.macAddressList", this.macAddressList1);
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

  // Get All Mac Address List for Pair Card Inventory Assign
  getMacAddressList2(event: { value: any; }) {
    const staffId = localStorage.getItem("userId");
    const productId = event.value;
    let product = this.allActiveProducts.find((element: { id: any; }) => element.id == productId);
    const url =
      "/outwards/getItemHistoryByProduct?productId=" +
      productId +
      "&ownerId=" +
      staffId +
      "&ownerType=Staff";
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (res: any) => {
        this.macAddressList2 = res.dataList.filter(
          (          element: { condition: any; }) => element.condition == this.selItemCondition
        );
        // this.macAddressList2 = res.dataList;
        if (this.macAddressList2.length == 0 || this.macAddressList2 == null) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "Assignee does not have a product",
            icon: "far fa-times-circle"
          });
          this.oldOfferBasedDiscountSTBPairFlag = false;
          this.oldOfferBasedDiscountCardPairFlag = false;
        } else {
          this.inventoryAssignForm.controls['billTo'].setValue("CUSTOMER");
          this.isInvoiceDataPairFlag = false;
          this.oldOfferPriceSTBFlag = false;
          this.oldOfferPriceCardFlag = false;
          this.oldOfferBasedDiscountCardPairFlag = true;
          // this.oldOfferBasedDiscountSTBPairFlag = false;
          this.getCardProductDetails(product);
          // this.billToPairFlag = true;
          console.log("this.macAddressList", this.macAddressList2);

          this.getAllSingleItemMacFlag = false;
          this.getAllPairItemMacFlag = true;
          this.getAllPairItemMacReplaceFlag = false;
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
  // Get All Mac Address List for Pair Card Inventory Replace
  getMacAddressList2Replace(event: { value: any; }) {
    const staffId = localStorage.getItem("userId");
    const productId = event.value;
    let product = this.allActiveProducts.find((element: { id: any; }) => element.id == productId);
    const url =
      "/outwards/getItemHistoryByProduct?productId=" +
      productId +
      "&ownerId=" +
      staffId +
      "&ownerType=Staff";
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (res: any) => {
        // this.macAddressList2 = res.dataList.filter(
        //   element => element.condition == this.selItemCondition
        // );
        this.macAddressList2 = res.dataList;
        if (this.macAddressList2.length == 0 || this.macAddressList2 == null) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "Assignee does not have a product",
            icon: "far fa-times-circle"
          });
          this.oldOfferBasedDiscountSTBPairFlag = false;
          this.oldOfferBasedDiscountCardPairFlag = false;
        } else {
          this.inventoryAssignForm.controls['billTo'].setValue("CUSTOMER");
          this.isInvoiceDataPairFlag = false;
          this.oldOfferPriceSTBFlag = false;
          this.oldOfferPriceCardFlag = false;
          this.oldOfferBasedDiscountCardPairFlag = true;
          // this.oldOfferBasedDiscountSTBPairFlag = false;
          this.getCardProductDetails(product);
          // this.billToPairFlag = true;
          console.log("this.macAddressList", this.macAddressList2);

          this.getAllSingleItemMacFlag = false;
          this.getAllPairItemMacFlag = false;
          this.getAllPairItemMacReplaceFlag = true;
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
  replaceInventorySubmit(): void {
    this.replaceSumitted = true;
    var reason: any = this.replaceInventoryForm.value.replacementReason;
    const remark: any = this.replaceInventoryForm.value.remark;
    //console.log("selectedReplaceMACAddress", this.selectedReplaceMACAddress);
    var payload = [
      {
        oldMacMappingId: this.replaceOldMappingId,
        newMacMappingId: this.selectedReplaceMACAddress.id
      }
    ];

    if (this.replaceInventoryForm.valid) {
      if (this.selectedReplaceMACAddress != "") {
        // const url = `/inwards/replaceInventory?oldMacMappingId=${this.replaceOldMappingId}&newMacMappingId=${this.selectedReplaceMACAddress.id}&customerId=${this.custData.id}&inventoryType=${this.replaceInventoryForm.value.inventoryType}&replacementReason=${reason}&approvalRemark=${remark}`;
        const url = `/inwards/replaceInventory?customerId=${this.replaceInventoryCustId}&inventoryType=${this.replaceInventoryForm.value.inventoryType}&replacementReason=${reason}&approvalRemark=${remark}`;
        this.customerInventoryManagementService.postMethod(url, payload).subscribe(
          (res: any) => {
            if (res.responseCode == 200) {
              this.replaceInventoryModalClose();
              this.getCustomerAssignedList();

              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: "Assigned inventory successfully.",
                icon: "far fa-check-circle"
              });
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: res.responseMessage,
                icon: "far fa-times-circle"
              });
            }
          },
          (error: any) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.responseMessage,
              icon: "far fa-check-circle"
            });
          }
        );
      } else {
        this.messageService.add({
          severity: "info",
          summary: "Information",
          detail: "Please select a product to replace",
          icon: "far fa-check-circle"
        });
      }
    }
  }

  replaceAssemblyInventorySubmit(): void {
    console.log("theckmeskldf : ", this.selectedCardOption, this.selectedStbOption);
    this.replaceSumitted = true;
    var reason: any = this.replaceInventoryForm.value.replacementReason;
    const remark: any = this.replaceInventoryForm.value.remark;
    //console.log("selectedReplaceMACAddress", this.selectedReplaceMACAddress);
    var payload = [
      {
        oldMacMappingId: this.stbProductsOld.inOutWardMACMapping[0].id,
        newMacMappingId: this.selectedReplaceMACAddress.id
      },
      {
        oldMacMappingId: this.cardProductsOld.inOutWardMACMapping[0].id,
        newMacMappingId: this.selectedReplaceMACAddress2.id
      }
    ];

    // var payload=[{
    //  oldMacMappingId:this.stbProductsOld,
    //   newMacMappingId:this.selectedReplaceMACAddress.id
    // }];

    if (this.replaceInventoryForm.valid) {
      if (this.selectedReplaceMACAddress != "") {
        // const url = `/inwards/replaceInventory?oldMacMappingId=${this.replaceOldMappingId}&newMacMappingId=${this.selectedReplaceMACAddress.id}&customerId=${this.custData.id}&inventoryType=${this.replaceInventoryForm.value.inventoryType}&replacementReason=${reason}&approvalRemark=${remark}`;
        const url = `/inwards/replaceInventory?customerId=${this.custData.id}&inventoryType=${this.replaceInventoryForm.value.inventoryType}&replacementReason=${reason}&approvalRemark=${remark}`;
        this.customerInventoryManagementService.postMethod(url, payload).subscribe(
          (res: any) => {
            if (res.responseCode == 200) {
              this.replaceAssemblyInventoryModalClose();
              this.getCustomerAssignedList();

              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: "Assigned inventory successfully.",
                icon: "far fa-check-circle"
              });
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: res.responseMessage,
                icon: "far fa-times-circle"
              });
            }
          },
          (error: any) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.responseMessage,
              icon: "far fa-check-circle"
            });
          }
        );
      } else {
        this.messageService.add({
          severity: "info",
          summary: "Information",
          detail: "Please select a product to replace",
          icon: "far fa-check-circle"
        });
      }
    }
  }

  // removeInvantryFunction(id, custinventoryid, ItemId, refundAmount) {
  //   const url = `/item/` + ItemId;
  //
  //   this.customerInventoryManagementService.getMethod(url).subscribe(
  //     (respose: any) => {
  //       if (
  //         respose.data.ownershipType == "Customer Owned" ||
  //         respose.data.ownershipType == "Partner Owned"
  //       ) {
  //         this.closeApproveInventoryModal();
  //         this.removeInventory(id, custinventoryid, "false", refundAmount);
  //       }
  //       // else {
  //       //   this.closeApproveInventoryModal();
  //       //   this.removeConfirmationInventory(id, custinventoryid);
  //       // }
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

  removeInventory(id: number, custinventoryid: any, ownershipFlag: string, refundAmount: string): void {
    // const remark = removeRemark;
    const url = `/inoutWardMacMapping/generateRemoveInventoryRequest?&macMappingId=${id}&customerInventoryId=${custinventoryid}&customerId=${this.custData.id}&isflag=${ownershipFlag}&revisedcharge=${refundAmount}`;
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (res: any) => {
        if (res.responseCode == 200) {
          this.approveRemoveFlag = true;
          this.rejectRemoveFlag = true;
          this.getCustomerAssignedList();

          this.messageService.add({
            severity: "success",
            summary: "success",
            detail: res.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.approveRemoveFlag = false;
          this.rejectRemoveFlag = false;

          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: res.responseMessage,
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

  removeConfirmationInventory(assignedInventoryId: number, cusiINventoryID: any, refundAmount: any) {
    if (assignedInventoryId) {
      this.confirmationService.confirm({
        message: "Do you want to change Ownership From Sold to Organization Owned " + "?",
        header: "Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.removeInventory(assignedInventoryId, cusiINventoryID, "true", refundAmount);
        },
        reject: () => {
          this.removeInventory(assignedInventoryId, cusiINventoryID, "false", refundAmount);
        }
      });
    }
    // this.confirmationService.confirm({
    //   message: "Do you want to change Ownership From Sold to Organization Owned " + "?",
    //   header: "Confirmation",
    //   icon: "pi pi-info-circle",
    //   accept: () => {
    //
    //     this.removeInventory(assignedInventoryId, cusiINventoryID, "true");
    //     // this.ownershipForm.controls.ownership.setValue("true");
    //   },
    //   reject: () => {
    //     this.removeInventory(assignedInventoryId, cusiINventoryID, "false");
    //     // this.ownershipForm.controls.ownership.setValue("false");
    //     // this.messageService.add({
    //     //   severity: "info",
    //     //   summary: "Rejected",
    //     //   detail: "You have rejected",
    //     // });
    //   },
    // });
  }

  //  inventory Workflow list

  inventoryWorkFlowList(id: string): void {
    this.inventoryId = id;
    $("#workflowInventoryModal").modal("show");
    const url = `/teamHierarchy/getApprovalProgress?entityId=${id}&eventName=CUSTOMER_INVENTORY_ASSIGN`;

    this.customerInventoryManagementService.getMethod(url).subscribe(
      (res: any) => {
        this.inventoryApproveProgressDetail = res.dataList;
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
    let page = this.currentPageInventoryApproveProgress;
    let page_list;

    this.inventoryWorkflowAuditData = [];

    let data = {
      page: page,
      pageSize: this.inventoryApproveProgressPerPage
    };

    let url1 = "/workflowaudit/list?entityId=" + id + "&eventName=" + "CUSTOMER_INVENTORY_ASSIGN";

    this.customerInventoryManagementService.postMethod(url1, data).subscribe(
      (response: any) => {
        this.inventoryWorkflowAuditData = response.dataList;
        this.inventoryApproveProgresstotalRecords = response.totalRecords;
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

  pageChangedInventoryProgress(pageNumber: number) {
    this.currentPageInventoryApproveProgress = pageNumber;
    this.inventoryWorkFlowList(this.inventoryId);
  }

  approveInventory(): void {
    let itemAssemblyId = this.assignInventoryId;
    const approveId: any[] = [];
    this.assignAssignInventorysubmitted = true;
    const selInventory = this.assignedInventoryList.filter(
      (      inventory: { custInventoryListId: any; }) => inventory.custInventoryListId === itemAssemblyId
    );
    selInventory.forEach((inOutWardMACMapping: { id: any; }) => approveId.push(inOutWardMACMapping.id));
    const remarkAssign = this.approveAssignInventoryForm.value;
    let staffId = localStorage.getItem("userId");
    // const url = `/inwards/approveInventory?isApproveRequest=true&customerInventoryMappingId=${id}`;
    const url =
      "/inwards/approveInventory?isApproveRequest=true&nextstaff=" +
      staffId +
      "&remark=" +
      remarkAssign.remark;

    this.customerInventoryManagementService.postMethod(url, approveId).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.assignAssignInventorysubmitted = false;
          this.approveAssignInventoryForm.reset();
          if (response.dataList != null) {
            this.approveAssignInventoryData = response.dataList;
            this.approved = true;
          } else {
            $("#assignApproveOtherInventoryOpen").modal("hide");
            this.getCustomerAssignedList();
          }
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
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

  rejectInventory(): void {
    const rejectId: any[] = [];
    let itemAssemblyId = this.assignInventoryId;
    const selInventory = this.assignedInventoryList.filter(
      (      inventory: { custInventoryListId: any; }) => inventory.custInventoryListId === itemAssemblyId
    );
    selInventory.forEach((inOutWardMACMapping: { id: any; }) => rejectId.push(inOutWardMACMapping.id));
    const remarkReject = this.rejectAssignInventoryForm.value;
    let staffId = localStorage.getItem("userId");
    //const url = `/inwards/approveInventory?isApproveRequest=false&customerInventoryMappingId=${id}`;
    const url =
      "/inwards/approveInventory?isApproveRequest=false&nextstaff=" +
      staffId +
      "&remark=" +
      remarkReject.remark;

    this.customerInventoryManagementService.postMethod(url, rejectId).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.rejectAssignInventorySubmitted = false;
          this.rejectAssignInventoryForm.reset();
          if (response.dataList != null) {
            this.rejectAssignInventoryData = response.dataList;
            this.reject = true;
          } else {
            $("#assignRejectOtherInventoryOpen").modal("hide");
            this.getCustomerAssignedList();
          }
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
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

  reactivateBoxResponse(custInventoryListId: any): void {
    const custInventoryId: any[] = [];
    const selInventory = this.assignedInventoryList.filter(
      (      inventory: { custInventoryListId: any; }) => inventory.custInventoryListId === custInventoryListId
    );
    selInventory.forEach((inOutWardMACMapping: { id: any; }) => custInventoryId.push(inOutWardMACMapping.id));
    const url = "/inwards/reactivateBoxResponse";

    this.customerInventoryManagementService.postMethod(url, custInventoryId).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.messageService.add({
            severity: "success",
            summary: "success",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          this.getCustomerAssignedList();
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
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

  pairBox(custInventoryListId: any): void {
    const custInventoryId: any[] = [];
    const selInventory = this.assignedInventoryList.filter(
      (      inventory: { custInventoryListId: any; }) => inventory.custInventoryListId === custInventoryListId
    );
    selInventory.forEach((inOutWardMACMapping: { id: any; }) => custInventoryId.push(inOutWardMACMapping.id));
    const url = "/inwards/pairBox";

    this.customerInventoryManagementService.postMethod(url, custInventoryId).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.messageService.add({
            severity: "success",
            summary: "success",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          this.getCustomerAssignedList();
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
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

  unpairBox(custInventoryListId: any): void {
    const custInventoryId: any[] = [];
    const selInventory = this.assignedInventoryList.filter(
      (      inventory: { custInventoryListId: any; }) => inventory.custInventoryListId === custInventoryListId
    );
    selInventory.forEach((inOutWardMACMapping: { id: any; }) => custInventoryId.push(inOutWardMACMapping.id));
    const url = "/inwards/unPairBox";

    this.customerInventoryManagementService.postMethod(url, custInventoryId).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.messageService.add({
            severity: "success",
            summary: "success",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          this.getCustomerAssignedList();
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
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

  // edit inventory
  invenoryDetails: {
    oldId: string;
    oldSerialNumber: string;
    oldMacAddress: string;
    newId: string;
    newSerialNumber: string;
    newMacAddress: string;
    currentApproveId: string;
  }[] = [];

  editInventoryold: boolean = false;

  editCustomerInventory(item: { custInventoryListId: any; }): void {
    this.invenoryDetails = [];
    const mappingitemAssemblyName = item.custInventoryListId;
    // console.log("mappingid",mappingId)

    var invenoryDetailsMappings: any = this.assignedInventoryList.filter(
      (      inventory: { custInventoryListId: any; }) => inventory.custInventoryListId === mappingitemAssemblyName
    );
    const invenoryDetailsMapping = invenoryDetailsMappings[0].inOutWardMACMapping;

    invenoryDetailsMappings.forEach((invenoryDetail: { inOutWardMACMapping: {
      macAddress: any;
      serialNumber: any;
      id: any; currentApproveId: any; 
}[]; }) => {
      // console.log("invenoryDetail",invenoryDetail);
      const oldId1 = invenoryDetail.inOutWardMACMapping[0].id;
      const oldSerialNumber1 = invenoryDetail.inOutWardMACMapping[0].serialNumber;
      const oldMac1 = invenoryDetail.inOutWardMACMapping[0].macAddress;
      const newid1 = invenoryDetail.inOutWardMACMapping[1]
        ? invenoryDetail.inOutWardMACMapping[1].id
        : "";
      const newSerialNumber1 = invenoryDetail.inOutWardMACMapping[1]
        ? invenoryDetail.inOutWardMACMapping[1].serialNumber
        : "";
      const newMac1 = invenoryDetail.inOutWardMACMapping[1]
        ? invenoryDetail.inOutWardMACMapping[1].macAddress
        : "";
      const currentApprovalId1 = invenoryDetail.inOutWardMACMapping[1].currentApproveId
        ? invenoryDetail.inOutWardMACMapping[1].currentApproveId
        : "";
      this.invenoryDetails.push({
        oldId: oldId1,
        oldSerialNumber: oldSerialNumber1,
        oldMacAddress: oldMac1,
        newId: newid1,
        newSerialNumber: newSerialNumber1,
        newMacAddress: newMac1,
        currentApproveId: currentApprovalId1
      });
    });
    console.log("invenoryDetails", this.invenoryDetails);

    this.editInventory = true;
    this.editSTBCradInventory = false;
  }
  // STB Card Individually Replacement Edit
  editSTBCARDCustomerInventory(item: { id: any; }): void {
    this.invenoryDetails = [];
    //const mappingitemAssemblyName = item.itemAssemblyName;
    // console.log("mappingid",mappingId)

    var invenoryDetailsMappings: any = this.assignedInventoryList.filter(
      (      inventory: { id: any; }) => inventory.id === item.id
    );
    const invenoryDetailsMapping = invenoryDetailsMappings[0].inOutWardMACMapping;

    invenoryDetailsMappings.forEach((invenoryDetail: { inOutWardMACMapping: any[] }) => {
      // console.log("invenoryDetail",invenoryDetail);
      const oldId1 = invenoryDetail.inOutWardMACMapping[0].id;
      const oldSerialNumber1 = invenoryDetail.inOutWardMACMapping[0].serialNumber;
      const oldMac1 = invenoryDetail.inOutWardMACMapping[0].macAddress;
      const newid1 = invenoryDetail.inOutWardMACMapping[1]
        ? invenoryDetail.inOutWardMACMapping[1].id
        : "";
      const newSerialNumber1 = invenoryDetail.inOutWardMACMapping[1]
        ? invenoryDetail.inOutWardMACMapping[1].serialNumber
        : "";
      const newMac1 = invenoryDetail.inOutWardMACMapping[1]
        ? invenoryDetail.inOutWardMACMapping[1].macAddress
        : "";
      const currentApprovalId1 = invenoryDetail.inOutWardMACMapping[1]
        ? invenoryDetail.inOutWardMACMapping[1].currentApproveId
        : "";
      this.invenoryDetails.push({
        oldId: oldId1,
        oldSerialNumber: oldSerialNumber1,
        oldMacAddress: oldMac1,
        newId: newid1,
        newSerialNumber: newSerialNumber1,
        newMacAddress: newMac1,
        currentApproveId: currentApprovalId1
      });
    });
    console.log("invenoryDetails", this.invenoryDetails);
    this.editInventory = false;
    this.editSTBCradInventory = true;
  }

  approveReplaceInventoryInventory(isApproveRequest: boolean, isPairToSingle: boolean): void {
    let bool: boolean = false;
    if (isApproveRequest) {
      bool = true;
    }
    let payload: { oldMacMappingId: string; newMacMappingId: string; }[] = [];
    this.assignReplaceInventorySubmitted = true;
    this.invenoryDetails.forEach(invenoryDetail => {
      this.replaceInventoryIdInOutMacMapping = invenoryDetail.newId;
      payload.push({
        oldMacMappingId: invenoryDetail.oldId,
        newMacMappingId: invenoryDetail.newId
      });
    });

    const url = `/inwards/approveReplaceInventory?isApproveRequest=${isApproveRequest}&billAble=${bool}`;

    this.customerInventoryManagementService.postMethod(url, payload).subscribe(
      (response: any) => {
        if (response.dataList != null) {
          this.assignReplaceInventorySubmitted = false;
          if (response.dataList[0].dataList) {
            if (response.dataList[0].dataList.length > 0) {
              this.isApproveRequest = isApproveRequest;
              this.rejectPlanData = response.dataList[0].dataList;

              $("#approvalReplaceInventory").modal("show");
            }
          } else if (response.responseCode == 200) {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: "Approve replace inventory.",
              icon: "far fa-check-circle"
            });
            this.getCustomerAssignedList();
            this.editInventory = false;
            this.editSTBCradInventory = false;
          } else {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          }
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
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

  checkStatusForRepalce(id: any): void {
    $("#EditinventoryStatusView").modal("show");
    // const url = `/teamHierarchy/getApprovalProgress?entityId=${id}&eventName=CUSTOMER_INVENTORY_ASSIGN`;
    //
    // this.customerInventoryManagementService.getMethod(url).subscribe(
    //   (res: any) => {
    //     if (res.responseCode == 200) {
    //       $("#EditinventoryStatusView").modal("show");
    //       this.inventoryApproveProgressDetail = res.dataList;
    //
    //     } else {
    //
    //       this.messageService.add({
    //         severity: "error",
    //         summary: "Error",
    //         detail: res.responseMessage,
    //         icon: "far fa-times-circle",
    //       });
    //     }
    //   },
    //   (error: any) => {
    //     this.messageService.add({
    //       severity: "error",
    //       summary: "Error",
    //       detail: error.error.msg,
    //       icon: "far fa-times-circle",
    //     });
    //
    //   }
    // );
  }

  assignOtherInventoryModalOpen() {
    this.staffSelectList = [];
    this.displayDialogAssignOtherInventory = true;
    this.inventoryAssignForm.get("assignedDateTime").setValue(this.currentDate);
  }

  assignOtherInventoryModalClose() {
    this.inventoryAssignSumitted = false;
    this.getAllSerializedProductFlag = false;
    this.getAllConnectionNumberFlag = false;
    this.getAllAssemblyNameFlag = false;
    this.getAllAssemblyTypeFlag = false;
    this.getAllPairProductFlag = false;
    this.getSplitterFlag = false;
    this.getAllSingleItemMacFlag = false;
    this.getAllPairItemMacReplaceFlag = false;
    this.itemConditionPairFlag = false;
    this.getAllPairItemMacFlag = false;
    this.getAllNonSerializedProductFlag = false;
    this.serializedItemAssignFlag = false;
    this.nonSerializedItemAssignFlag = false;
    this.showQtyError = false;
    this.negativeAssignQtyError = false;
    this.availableQtyFlag = false;
    this.showError = false;
    this.inventoryAssignForm.reset();
    this.selectedMACAddress = "";
    this.cardFileterGlobal = "";
    this.stbFileterGlobal = "";
    this.fileterGlobalSingleItem = "";
    this.macAddressList = [];
    this.macAddressList1 = [];
    this.macAddressList2 = [];
    this.inventoryAssignForm.controls['itemAssemblyName'].disable();
    this.inventoryAssignForm.controls['itemAssemblyflag'].disable();
    this.billToSigleFlag = false;
    this.billToPairFlag = false;
    this.discountPairFlag = false;
    this.isInvoiceDataSingleFlag = false;
    this.itemConditionSingleFlag = false;
    this.itemConditionPlanSeriFlag = false;
    this.itemConditionPlanPairFlag = false;
    this.selAssemblyTypePlanFlag = false;
    this.selAssemblyTypePlanGroupFlag = false;
    this.getAssemblyNameflag = false;
    this.oldOfferPriceSingleFlag = false;
    this.newOfferSingleFlag = false;
    this.newOfferSTBFlag = false;
    this.newOfferCardFlag = false;
    this.inventoryAssignForm.controls['billTo'].setValue("CUSTOMER");
    this.inventoryAssignForm.controls['isInvoiceToOrg'].setValue(false);
    this.inventoryAssignForm.controls['isRequiredApproval'].setValue(false);
    this.oldOfferBasedDiscountSingleFlag = false;
    this.oldOfferBasedDiscountCardPairFlag = false;
    this.oldOfferBasedDiscountNonSerialFlag = false;
    this.oldOfferBasedDiscountPlanFlag = false;
    this.oldOfferBasedDiscountSTBPairFlag = false;
    this.oldOfferBasedDiscountSingleFlag = false;
    this.oldOfferBasedDiscountSingleReplaceFlag = false;
    this.oldOfferPriceCardFlag = false;
    this.oldOfferPriceNonSerialFlag = false;
    this.oldOfferPricePlanFlag = false;
    this.oldOfferPriceSTBFlag = false;
    this.oldOfferPriceSingleReplaceFlag = false;
    this.newOfferNonSerialFlag = false;
    this.displayDialogAssignOtherInventory = false;
  }

  assigneOtherInventory(): void {
    this.inventoryAssignSumitted = true;
    let data: any = "";
    data = this.inventoryAssignForm.value;
    console.log("inventoryAssignForm", this.inventoryAssignForm.value);
    data.inOutWardMACMapping = [];
    if (data.itemAssemblyflag == false) {
      if (this.selectedMACAddress != "" && this.selectedMACAddress != null) {
        data.inOutWardMACMapping.push(this.selectedMACAddress);
      }
    } else {
      // data.productId = "";
      if (this.selectedMACAddress != "" && this.selectedMACAddress != null) {
        //data.inOutWardMACMapping = this.selectedMACAddress;
        data.inOutWardMACMapping.push(this.selectedMACAddress);
        data.inOutWardMACMapping.push(this.selectedMACAddress2);
      }
    }
    data.productId = this.selectedMACAddress.productId;
    data.itemId = this.selectedMACAddress?.itemId;
    data.customerId = this.serviceCustomerId;
    data.staffId = this.staffUserId;
    data.itemAssemblyStatus = "Pending";
    data.itemType = this.selectedMACAddress?.condition;
    if (this.selectedMACAddress?.macAddress == "") {
      this.messageService.add({
        severity: "info",
        summary: "Information",
        detail: "Please Enter at mac address in selected item",
        icon: "far fa-check-circle"
      });
    } else if (this.selectedMACAddress?.serialNumber == "") {
      this.messageService.add({
        severity: "info",
        summary: "Information",
        detail: "Please Enter at serial number in selected item",
        icon: "far fa-check-circle"
      });
    } else {
      if (this.inventoryAssignForm.valid) {
        if (data.inOutWardMACMapping.length > 0) {
          data.qty = data.inOutWardMACMapping.length;

          let custInvParams = this.inventorySpecificationDetails.map(item => ({
            paramName: item.paramName,
            paramValue: item.paramValue
          }));
          custInvParams.push({
            paramName: "ONT SN",
            paramValue: this.selectedSerialNumber
          });

          data.custInvParams = custInvParams;
          data.custServiceMapId = this.selectedService.customerServiceMappingId;

          const url = "/inwards/assignToCustomer";
          this.customerInventoryManagementService.postMethod(url, data).subscribe(
            (res: any) => {
              if (res.responseCode == 200) {
                this.assignOtherInventoryModalClose();
                this.getCustomerAssignedList();
                this.messageService.add({
                  severity: "success",
                  summary: "Successfully",
                  detail: "Assigned inventory successfully.",
                  icon: "far fa-check-circle"
                });
              } else if (res.responseCode == 406) {
                this.messageService.add({
                  severity: "info",
                  summary: "info",
                  detail: res.responseMessage,
                  icon: "far fa-times-circle"
                });
              } else {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: res.responseMessage,
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
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Information",
            detail: "Please Select at least one item",
            icon: "far fa-check-circle"
          });
        }
      }
    }
    // console.log("assigneOtherInventory ::::: ", data);
  }
  uniqueServices: any[];

  getService(event: string) {
    const url =
      "/subscriber/getPlanByCustService/" +
      this.customerId +
      "?isAllRequired=true&isNotChangePlan=true";
    this.customerService.getMethod(url).subscribe(
      (response: any) => {
        this.serviceList = response.dataList;
        this.uniqueServices = this.serviceList.filter(obj => {
          if (obj.custPlanStatus == "ACTIVE" || obj.custPlanStatus == "Active") {
            return (
              this.serviceList.findIndex(o => o.serviceId === obj.serviceId) ===
              this.serviceList.indexOf(obj)
            );
          }
          return false; // Ensure a return value for all code paths
        });
        let selServiceId = event.valueOf;
        this.connectionNoList = response.dataList.filter((stb: { serviceId: any; }) => stb.serviceId == selServiceId);
        this.custPlanCategory = this.serviceList[0].custPlanCategory;
        this.custDiscount = this.serviceList[0].discount;
        this.custDiscountType = this.serviceList[0].discountType;
        if (this.serviceList[0].plangroupid != null) {
          this.planGroupName = this.serviceList[0].planGroupName;
          this.planGroupId = this.serviceList[0].plangroupid;
          this.planInventoryAssignForm.controls['planGroupName'].setValue(
            this.serviceList[0].planGroupName
          );
          this.planInventoryAssignForm.controls['planGroupId'].setValue(
            this.serviceList[0].plangroupid
          );
          this.planGroupPlanMappingFlag = true;
          this.individualPlanMappingFlag = false;
        } else {
          this.planGroupPlanMappingFlag = false;
          this.individualPlanMappingFlag = true;
        }
        this.getCustomerAssignedList();
        var keepGping = false;
        this.serviceList.forEach(item => {
          if (!keepGping) {
            var filteredItem = item.customerInventorySerialnumberDtos.filter((item: { primary: any; }) => item.primary);
            if (filteredItem.length > 0) {
              this.isShowConnection = false;
              this.serviceSerialNumbers.push({
                serialNumber: filteredItem[0].serialNumber,
                custPlanMapppingId: item.custPlanMapppingId,
                connectionNo: item.connection_no
              });
            } else {
              this.isShowConnection = true;
              this.serviceSerialNumbers = [];
              keepGping = true;
            }
          }
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
  

  getSerialNumber(inventory: { connectionNo: any; }) {
    return this.serviceSerialNumbers.filter(item => item.connectionNo === inventory.connectionNo)
      .length > 0
      ? this.serviceSerialNumbers.filter(item => item.connectionNo === inventory.connectionNo)[0]
          .serialNumber
      : "";
  }

  getConnectionNoDetails(event: { value: any; }) {
    this.connectionDetailData = this.connectionNoList.filter(
      (      element: { connection_no: any; }) => element.connection_no == event.value
    );
    this.serviceCustomerId = this.connectionDetailData[0].custId;
  }
  onChangeConnection(event: { value: any; }) {
    this.serviceCustomerId = this.connectionNoList.filter(
      (      element: { connection_no: any; }) => element.connection_no == event.value
    )[0].custId;
  }

  getAllProduct(event: { value: string; }) {
    const url = "/product/getAllProductByServiceId?serviceId=" + event.value;
    //this.getService(event);
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        //this.getAllConnectionNumberFlag = true;
        this.allActiveProducts = response.dataList;
        this.allSTBProducts = response.dataList.filter(
          (          stb: { productCategory: { dtvCategory: string; }; }) => stb.productCategory.dtvCategory == "STB"
        );
        this.allCardProducts = response.dataList.filter(
          (          stb: { productCategory: { dtvCategory: string; }; }) => stb.productCategory.dtvCategory == "Card"
        );
        //this.pincodeListData = response.dataList.filter(pincode => pincode.status == "Active");
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

  getAllProductExternalItems() {
    const url = "/product/getAllProductsByCustomerOwned?custId=" + this.custData.id;
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.allActiveProducts = response.dataList;
        } else {
          this.messageService.add({
            severity: "info",
            summary: "info",
            detail: response.responseMessage,
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

  swapInventoryPlanModalOpen() {
    this.getChildAndParentInventoryDetails();
  }
  swapInventoryPlanModalClose() {
    this.displaySwapInventoryPlan = false;
    this.childAndParentInventoryDetailsForm.reset();
    this.uniqueparentService = [{ serviceId: "", serviceName: "" }];
    this.childAndParentInventoryDetails = {
      childcustomerServiceMappings: [
        {
          connectionNo: "",
          serviceId: "",
          serviceName: ""
        }
      ],
      parentcustomerServiceMappings: [
        {
          connectionNo: "",
          serviceId: "",
          serviceName: ""
        }
      ]
    };
  }

  childAndParentInventoryDetails = {
    childcustomerServiceMappings: [
      {
        connectionNo: "",
        serviceId: "",
        serviceName: ""
      }
    ],
    parentcustomerServiceMappings: [
      {
        connectionNo: "",
        serviceId: "",
        serviceName: ""
      }
    ]
  };
  swapOptions: any = [
    {
      label: "Parent & Child",
      value: "parent_child"
    },
    {
      label: "Child & Child",
      value: "child_child"
    }
  ];
  childAndParentInventoryDetailsForm = this.fb.group({
    serviceName: "",
    serviceId: "",
    parentConnectionNo: "",
    childConnectionNo: "",
    swapOption: "parent_child"
  });
  uniqueparentService: any = [];

  getChildAndParentInventoryDetails() {
    const url = "/inwards/getChildAndParentCustomer?customerId=" + this.custData.id;

    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.displaySwapInventoryPlan = true;
          this.childAndParentInventoryDetails = response.data;
          var parentServices: { connectionNo: string; serviceId: string; serviceName: string; }[] = [];
          this.childAndParentInventoryDetails.childcustomerServiceMappings.forEach(
            childcustomerServiceMapping => {
              parentServices.push(childcustomerServiceMapping);
            }
          );
          // this.uniqueparentService = parentServices;
          this.uniqueparentService = parentServices.filter(obj => {
            return (
              parentServices.findIndex(o => o.serviceId === obj.serviceId) ===
              parentServices.indexOf(obj)
            );
          });
        } else if (response.responseCode == 406) {
          this.messageService.add({
            severity: "info",
            summary: "info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
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
  filtteredParentConnection: { connectionNo: string; serviceId: string; serviceName: string; }[];
  masterChildConnections: any[];
  filtteredChildConnection: any;
  filtteredChildConnection1: any;
  setServiceId(event: { value: string; }) {
    var service = this.uniqueparentService.find((service: { serviceName: string; }) => {
      return (
        service.serviceName == this.childAndParentInventoryDetailsForm.controls.serviceName.value
      );
    });
    this.childAndParentInventoryDetailsForm.controls.parentConnectionNo.reset();
    this.childAndParentInventoryDetailsForm.controls.childConnectionNo.reset();
    this.childAndParentInventoryDetailsForm.controls.serviceId.setValue(service.serviceId);
    this.filtteredParentConnection =
      this.childAndParentInventoryDetails.parentcustomerServiceMappings.filter(
        item => item.serviceName == event.value
      );
    this.masterChildConnections =
      this.childAndParentInventoryDetails.childcustomerServiceMappings.filter(
        item => item.serviceName == event.value
      );
    this.filtteredChildConnection = this.masterChildConnections;
    this.filtteredChildConnection1 = this.filtteredChildConnection;
  }
  swapInventoryPlan() {
    let data: any = "";
    data = this.childAndParentInventoryDetailsForm.value;
    console.log(data);

    const url =
      "/inwards/swapServicesFromParantCustomerToChildCustomer?childconnectionNumber=" +
      data.childConnectionNo +
      "&parentconnectionNumber=" +
      data.parentConnectionNo +
      "&serviceId=" +
      data.serviceId +
      "&serviceName=" +
      data.serviceName;

    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.replaceInventoryModalClose();
          this.getCustomerAssignedList();

          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Successfully Swapped.",
            icon: "far fa-check-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
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

  assignExternalInventoryModalOpen() {
    this.displayAssignInventoryWithExternalItemGroup = true;
    this.externalInventoryAssignForm.get("assignedDateTime").setValue(this.currentDate);
    this.getAllProductExternalItems();
  }

  assignExternalInventoryModalClose() {
    this.externalInventoryAssignSumitted = false;
    this.getExternalProductFlag = false;
    this.getExternalItemListFlag = false;
    this.getAllConnectionNumberFlag = false;
    this.externalInventoryAssignForm.reset();
    this.selectedExternalMACAddress = "";
    this.externalItemsFilterGlobal = "";
    this.macAddressList = [];
    this.macExternalListFlag = false;
    this.billToSigleFlag = false;
    this.itemConditionPairFlag = false;
    this.billToPairFlag = false;
    this.getPlanSingleSplitterFlag = false;
    this.getPlanPairSplitterFlag = false;
    this.getAllPairPlanProductSTBFlag = false;
    this.getAllPairProductCardFlag = false;
    this.selAssemblyTypePlanFlag = false;
    this.selAssemblyTypePlanGroupFlag = false;
    this.getAssemblyNameflag = false;
    this.discountPairFlag = false;
    this.isInvoiceDataSingleFlag = false;
    this.itemConditionSingleFlag = false;
    this.itemConditionPlanSeriFlag = false;
    this.itemConditionPlanPairFlag = false;
    this.oldOfferPriceSingleFlag = false;
    this.newOfferSingleFlag = false;
    this.newOfferSTBFlag = false;
    this.newOfferCardFlag = false;
    this.oldOfferBasedDiscountSingleFlag = false;
    this.oldOfferBasedDiscountCardPairFlag = false;
    this.oldOfferBasedDiscountNonSerialFlag = false;
    this.oldOfferBasedDiscountPlanFlag = false;
    this.oldOfferBasedDiscountSTBPairFlag = false;
    this.oldOfferBasedDiscountSingleFlag = false;
    this.oldOfferBasedDiscountSingleReplaceFlag = false;
    this.oldOfferPriceCardFlag = false;
    this.oldOfferPriceNonSerialFlag = false;
    this.oldOfferPricePlanFlag = false;
    this.oldOfferPriceSTBFlag = false;
    this.oldOfferPriceSingleReplaceFlag = false;
    this.newOfferNonSerialFlag = false;
    this.displayAssignInventoryWithExternalItemGroup = false;
  }

  assigneExternalInventory(): void {
    this.externalInventoryAssignSumitted = true;
    let data: any = "";
    data = this.externalInventoryAssignForm.value;
    data.qty = "1";
    data.itemId = this.selectedExternalMACAddress?.itemId;
    data.customerId = this.serviceCustomerId;
    data.staffId = this.staffUserId;
    data.inOutWardMACMapping = [];
    if (this.selectedExternalMACAddress != "") {
      data.inOutWardMACMapping.push(this.selectedExternalMACAddress);
    }
    if (this.externalInventoryAssignForm.valid) {
      if (data.inOutWardMACMapping.length > 0) {
        const url = "/inwards/assignToCustomer";
        this.customerInventoryManagementService.postMethod(url, data).subscribe(
          (res: any) => {
            if (res.responseCode == 200) {
              this.assignExternalInventoryModalClose();
              this.getCustomerAssignedList();
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: "Assigned inventory successfully.",
                icon: "far fa-check-circle"
              });
            } else if (res.responseCode == 406) {
              this.messageService.add({
                severity: "info",
                summary: "info",
                detail: res.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: res.responseMessage,
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
      } else {
        this.messageService.add({
          severity: "info",
          summary: "Information",
          detail: "Please select a product to assign",
          icon: "far fa-check-circle"
        });
      }
    }
  }

  assignPlanInventoryModalOpen() {
    this.displayAssignPlanInventoryModal = true;
    this.planInventoryAssignForm.get("assignedDateTime").setValue(this.currentDate);
  }

  assignPlanInventoryModalClose() {
    this.macPlanListFlag = false;
    this.billToPlanFlag = false;
    this.oldOfferBasedDiscountPlanFlag = false;
    this.oldOfferPricePlanFlag = false;
    this.planInventoryAssignSumitted = false;
    this.planInventoryAssignForm.reset();
    this.selectedPlanMACAddress = "";
    this.macAddressList = [];
    this.getAllPlanFlag = false;
    this.planGroupPlanMappingFlag = false;
    this.individualPlanMappingFlag = false;
    this.getPlanInventoryIdFlag = false;
    this.getProductCategoryFlag = false;
    this.getProductForPlanInventoryAssignFlag = false;
    this.getAllConnectionNumberFlag = false;
    this.oldOfferPricePlanFlag = false;
    this.fileterGlobalPlanlevel = "";
    this.planInventoryAssignForm.controls['isInvoiceToOrg'].setValue(false);
    this.planInventoryAssignForm.controls['isRequiredApproval'].setValue(false);
    this.billToSigleFlag = false;
    this.billToPairFlag = false;
    this.itemConditionPairFlag = false;
    this.discountPairFlag = false;
    this.isInvoiceDataSingleFlag = false;
    this.itemConditionSingleFlag = false;
    this.itemConditionPlanSeriFlag = false;
    this.itemConditionPlanPairFlag = false;
    this.getAssemblyNameflag = false;
    this.oldOfferPriceSingleFlag = false;
    this.newOfferSingleFlag = false;
    this.newOfferSTBFlag = false;
    this.newOfferCardFlag = false;
    this.getPlanSingleSplitterFlag = false;
    this.getPlanPairSplitterFlag = false;
    this.getAllPairPlanProductSTBFlag = false;
    this.getAllPairProductCardFlag = false;
    this.selAssemblyTypePlanFlag = false;
    this.selAssemblyTypePlanGroupFlag = false;
    this.oldOfferBasedDiscountSingleFlag = false;
    this.oldOfferBasedDiscountCardPairFlag = false;
    this.oldOfferBasedDiscountNonSerialFlag = false;
    this.oldOfferBasedDiscountPlanFlag = false;
    this.oldOfferBasedDiscountSTBPairFlag = false;
    this.oldOfferBasedDiscountSingleFlag = false;
    this.oldOfferBasedDiscountSingleReplaceFlag = false;
    this.oldOfferPriceCardFlag = false;
    this.oldOfferPriceNonSerialFlag = false;
    this.oldOfferPricePlanFlag = false;
    this.oldOfferPriceSTBFlag = false;
    this.oldOfferPriceSingleReplaceFlag = false;
    this.newOfferNonSerialFlag = false;
    this.displayAssignPlanInventoryModal = false;
  }

  getPlanByCustAndService(event: { value: any; }) {
    if (event != null) {
      this.getAllPlanFlag = true;
      this.getActivePlan(event.value);
    } else {
      this.getAllPlanFlag = false;
    }
  }

getServiceAtPlanInventory(event: DropdownChangeEvent, dd: any) {
  this.selectedService = dd.selectedOption;

  // Check if the event has a value (if the user selected something)
  if (event && event.value) {
    this.getAllConnectionNumberFlag = true;
    this.getService(event.value);  // Pass the selected value from the dropdown
    this.getAllProduct(event.value);  // Pass the selected value from the dropdown
    this.getPlanByCustAndService(event.value);  // Pass the selected value from the dropdown
  } else {
    this.getAllConnectionNumberFlag = false;
  }
}

getServiceAtOtherInventory(event: DropdownChangeEvent, dd: any) {
  this.selectedService = dd.selectedOption;

  if (event && event.value) {
    this.getAllConnectionNumberFlag = true;
    this.getService(event.value);       // Pass only the selected value
    this.getAllProduct(event.value);    // Same here
  } else {
    this.getAllConnectionNumberFlag = false;
  }
}


getServiceAtExternalInventory(event: DropdownChangeEvent) {
  if (event && event.value) {
    this.getAllConnectionNumberFlag = true;
    this.getExternalProductFlag = true;
    this.getService(event.value);  // Pass the selected service ID or object
    this.getAllProductExternalItems();
  } else {
    this.getAllConnectionNumberFlag = false;
    this.getExternalProductFlag = false;
  }
}

  getProductCatAndProduct(event: { value: any; }) {
    this.macPlanListFlag = false;
    this.billToPlanFlag = false;
    this.oldOfferBasedDiscountPlanFlag = false;
    this.oldOfferPricePlanFlag = false;
    this.oldOfferPricePlanFlag = false;
    this.itemConditionPlanSeriFlag = false;
    this.itemConditionPlanPairFlag = false;
    this.selAssemblyTypePlanFlag = true;
    this.selAssemblyTypePlanGroupFlag = false;
    this.planInventoryAssignForm.controls['isInvoiceToOrg'].setValue(false);
    this.planInventoryAssignForm.controls['isRequiredApproval'].setValue(false);
    this.requiredApprovalPlanFlag = false;
    this.productPlanMappingId = event.value;
    //this.custPackageUnit = this.serviceList.find(element => element.id == event.value);
    this.getProductcategory(event.value);
    this.getProductForPlanInventoryAssign(event.value);
  }

  getProductCatAndProductByPlanGroup(event: { value: any; }) {
    this.macPlanListFlag = false;
    this.billToPlanFlag = false;
    this.oldOfferBasedDiscountPlanFlag = false;
    this.planInventoryAssignForm.get("itemAssemblyflag").reset();
    this.oldOfferPricePlanFlag = false;
    this.oldOfferPricePlanFlag = false;
    this.itemConditionPlanSeriFlag = false;
    this.itemConditionPlanPairFlag = false;
    this.selAssemblyTypePlanFlag = false;
    this.selAssemblyTypePlanGroupFlag = true;
    this.getProductcategoryPlanGroup(event.value);
    this.getProductForPlanInventoryAssignPlanGrupId(event.value);
  }

  getProductCatAndProductReplace(id: any) {
    //this.custPackageUnit = this.serviceList.find(element => element.id == event.value);
    this.getProductcategoryReplace(id);
    this.getProductForPlanInventoryAssignReplace(id);
  }

  getProductcategory(mappingId: string) {
    const url = "/product_plan_mapping/getProductCategoryByPlanId?mappingId=" + mappingId;
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.getProductCategoryFlag = true;
        let data: any;
        data = response.dataList;
        this.productCategoryName = data[0].name;
        this.productCategoryId = data[0].id;
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

  getProductcategoryPlanGroup(mappingId: string) {
    const url = "/product/getProductCategoryByProductPlanGroupMappingId?mappingId=" + mappingId;
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.getProductCategoryFlag = true;
        let data: any;
        data = response.dataList;
        this.productCategoryName = data[0].name;
        this.productCategoryId = data[0].id;
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

  getProductcategoryReplace(id: string) {
    const url = "/product_plan_mapping/getProductCategoryByPlanId?mappingId=" + id;
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.getProductCategoryFlag = true;
        let data: any;
        data = response.dataList;
        this.productCategoryName = data[0].name;
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

  getActivePlan(serviceId: string) {
    const url =
      "/subscriber/getActivePlanList/" +
      this.custData.id +
      "?serviceId=" +
      serviceId +
      "&isNotChangePlan=true";
    //----Need to confirm that we need to retrieve parent and childs all plan in single experience if yes than need to send isNotChangePlan=true in above api url
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.planList = response.dataList;
        if (this.planList.length != 0) {
          this.billToPlanName = this.planList[0].billTo;
          if (this.billToPlanName == "ORGANIZATION") {
            this.billToPlan = "ORGANIZATION";
          } else {
            this.billToPlan = this.billToPlanName;
          }
        }
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

  getAllPlanIvnetoryId(planId: { value: string; }) {
    const url = "/product/getAllPlanIvnetoryIdOnPlanId/planId?planId=" + planId.value;
    this.selPlanId = planId.value;
    this.getProductForPlanInventoryAssignFlag = false;
    this.getProductCategoryFlag = false;
    this.macPlanListFlag = false;
    this.billToPlanFlag = false;
    this.oldOfferBasedDiscountPlanFlag = false;
    this.oldOfferPricePlanFlag = false;
    this.oldOfferPricePlanFlag = false;
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.getPlanInventoryIdFlag = true;
        this.getAllPlanIvnetoryIdOnPlanIdList = response.dataList;
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

  getAllPlanGroupPlanIvnetoryId(planId: { value: string; }) {
    const url =
      "/product/getAllInventoryIdOnPlanIdAndPlanGroupId?planId=" +
      planId.value +
      "&planGroupId=" +
      this.planGroupId;
    this.selPlanId = planId.value;
    this.getProductForPlanInventoryAssignFlag = false;
    this.selAssemblyTypePlanGroupFlag = false;
    this.planInventoryAssignForm.get("itemAssemblyflag").reset();
    this.itemConditionPlanSeriFlag = false;
    this.itemConditionPlanPairFlag = false;
    this.getProductCategoryFlag = false;
    this.macPlanListFlag = false;
    this.billToPlanFlag = false;
    this.oldOfferBasedDiscountPlanFlag = false;
    this.oldOfferPricePlanFlag = false;
    this.oldOfferPricePlanFlag = false;
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.getPlanInventoryIdFlag = true;
        this.getAllPlanIvnetoryIdOnPlanIdList = response.dataList;
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

  getAllPlanIvnetoryIdAtReplace(planId: string) {
    const url = "/product/getAllPlanIvnetoryIdOnPlanId/planId?planId=" + planId;
    this.selPlanId = planId.valueOf;
    this.selReplacePlanId = planId;
    this.getProductForPlanInventoryAssignFlag = false;
    this.getProductCategoryFlag = false;
    this.macPlanListFlag = false;
    this.billToPlanFlag = false;
    this.oldOfferBasedDiscountPlanFlag = false;
    this.oldOfferPricePlanFlag = false;
    this.oldOfferPricePlanFlag = false;

    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        //this.getPlanInventoryIdFlag = true;
        //this.getAllPlanIvnetoryIdOnPlanIdList = response;
        this.planInventoryId = response.dataList;
        this.getProductCatAndProductReplace(this.planInventoryId[0].id);
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

  getProductForPlanInventoryAssign(mappingId: string) {
    const url = "/product_plan_mapping/getProductByPlanId?mappingId=" + mappingId;
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        // this.getProductForPlanInventoryAssignFlag = true;
        this.productByPlanList = response.dataList;
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

  getProductForPlanInventoryAssignPlanGrupId(mappingId: string) {
    const url = "/product/getProductByProductPlanGroupMappingId?mappingId=" + mappingId;
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        // this.getProductForPlanInventoryAssignFlag = true;
        this.productByPlanList = response.dataList;
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

  getProductForPlanInventoryAssignReplace(mappingId: string) {
    const url = "/product_plan_mapping/getProductByPlanId?mappingId=" + mappingId;
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        //this.getProductForPlanInventoryAssignFlag = true;
        this.productByPlanListReplace = response.dataList;
        this.planInventoryReplaceFlag = true;
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

  assignPlanInventory(): void {
    this.planInventoryAssignSumitted = true;
    let data: any = "";
    data = this.planInventoryAssignForm.value;
    data.inOutWardMACMapping = [];
    //data.productId = "";
    if (data.itemAssemblyflag == false) {
      if (this.selectedPlanMACAddress != "" && this.selectedPlanMACAddress != null) {
        data.inOutWardMACMapping.push(this.selectedPlanMACAddress);
      }
    } else {
      if (
        this.selectedSTBPlanMACAddress != "" &&
        this.selectedSTBPlanMACAddress != null &&
        this.selectedCardPlanMACAddress != "" &&
        this.selectedCardPlanMACAddress != null
      ) {
        data.inOutWardMACMapping.push(this.selectedSTBPlanMACAddress);
        data.inOutWardMACMapping.push(this.selectedCardPlanMACAddress);
      }
    }
    data.productPlanMappingId = this.productPlanMappingId;
    data.itemId = this.selectedPlanMACAddress?.itemId;
    data.customerId = this.serviceCustomerId;
    data.staffId = this.staffUserId;
    data.itemAssemblyStatus = "Pending";
    data.itemType = this.selectedPlanMACAddress?.condition;
    if (this.selectedPlanMACAddress?.macAddress == "") {
      this.messageService.add({
        severity: "info",
        summary: "Information",
        detail: "Please Enter at mac address in selected item",
        icon: "far fa-check-circle"
      });
    } else if (this.selectedPlanMACAddress?.serialNumber == "") {
      this.messageService.add({
        severity: "info",
        summary: "Information",
        detail: "Please Enter at serial number in selected item",
        icon: "far fa-check-circle"
      });
    } else {
      if (this.planInventoryAssignForm.valid) {
        if (data.inOutWardMACMapping.length > 0) {
          data.qty = data.inOutWardMACMapping.length;

          let custInvParams = this.inventorySpecificationDetails.map(item => ({
            paramName: item.paramName,
            paramValue: item.paramValue
          }));
          custInvParams.push({
            paramName: "ONT SN",
            paramValue: this.selectedSerialNumber
          });

          data.custInvParams = custInvParams;
          data.custServiceMapId = this.selectedService.customerServiceMappingId;

          const url = "/inwards/assignToCustomer";
          this.customerInventoryManagementService.postMethod(url, data).subscribe(
            (res: any) => {
              if (res.responseCode == 200) {
                this.assignPlanInventoryModalClose();
                this.getCustomerAssignedList();
                this.planName = "";
                this.productCategoryName = "";
                this.messageService.add({
                  severity: "success",
                  summary: "Successfully",
                  detail: "Assigned inventory successfully.",
                  icon: "far fa-check-circle"
                });
              } else if (res.responseCode == 406) {
                this.messageService.add({
                  severity: "info",
                  summary: "info",
                  detail: res.responseMessage,
                  icon: "far fa-times-circle"
                });
              } else {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: res.responseMessage,
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
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Information",
            detail: "Please Select at least one item",
            icon: "far fa-check-circle"
          });
        }
      }
    }
  }

  getSelAssemblyType(event: { value: boolean; }) {
    console.log("event", event.value);
    if (event.value == true) {
      this.inventoryAssignForm.controls['itemAssemblyName'].enable();
      this.getAllAssemblyNameFlag = true;
      this.oldOfferPriceSTBFlag = false;
      this.oldOfferBasedDiscountSTBPairFlag = false;
      // this.getSplitterFlag = true;
      // this.getAllPairProductFlag = true;
      this.getSplitterFlag = false;
      this.getAllPairProductFlag = false;
      this.getAllPairItemMacFlag = false;
      this.selectedMACAddress = [];
      //this.getAllProduct();
      this.itemConditionSingleFlag = false;
      this.itemConditionPlanSeriFlag = false;
      this.getAllSerializedProductFlag = false;
      this.getAllNonSerializedProductFlag = false;
      this.serializedItemAssignFlag = true;
      this.nonSerializedItemAssignFlag = false;
      this.itemConditionPairFlag = true;
      this.itemConditionPlanPairFlag = false;
      this.billToPairFlag = false;
      this.billToSigleFlag = false;
      this.discountPairFlag = false;
      this.oldOfferBasedDiscountSingleFlag = false;
    } else {
      this.inventoryAssignForm.controls['itemAssemblyName'].disable();
      this.getAllAssemblyNameFlag = false;
      this.getAllPairProductFlag = false;
      this.getAllPairItemMacFlag = false;
      this.getSplitterFlag = false;
      this.oldOfferPriceSTBFlag = false;
      this.oldOfferBasedDiscountSTBPairFlag = false;
      this.selectedMACAddress = "";
      this.itemConditionSingleFlag = true;
      this.itemConditionPairFlag = false;
      this.itemConditionPlanSeriFlag = false;
      this.itemConditionPlanPairFlag = false;
      this.getAllSerializedProductFlag = false;
      this.getAllNonSerializedProductFlag = false;
      this.serializedItemAssignFlag = true;
      this.nonSerializedItemAssignFlag = false;
      this.billToPairFlag = false;
      this.billToSigleFlag = false;
      this.oldOfferBasedDiscountSingleFlag = false;
      this.discountPairFlag = false;
      //this.getAllProduct();
    }

    this.macAddressList = [];
    this.inventoryAssignForm.controls['productId'].setValue("");
  }

  getSelItemType(event: { value: string; }) {
    this.inventoryAssignForm.get("itemAssemblyflag").reset();
    console.log("event", event.value);
    if (event.value == "Non Serialized Item") {
      this.inventoryAssignForm.controls['itemAssemblyflag'].disable();
      this.inventoryAssignForm.controls['itemType'].disable();
      this.inventoryAssignForm.controls['nonSerializedItemRemark'].enable();
      this.getAllAssemblyNameFlag = false;
      this.oldOfferPriceSTBFlag = false;
      this.oldOfferBasedDiscountSTBPairFlag = false;
      this.itemConditionPairFlag = false;
      this.billToPairFlag = false;
      this.discountPairFlag = false;
      this.billToSigleFlag = false;
      this.getAllAssemblyTypeFlag = false;
      this.getAllPairProductFlag = false;
      this.getAllPairItemMacFlag = false;
      this.getSplitterFlag = false;
      this.getAllNonSerializedProductFlag = true;
      this.getAllSerializedProductFlag = false;
      this.itemConditionSingleFlag = false;
      this.itemConditionPlanSeriFlag = false;
      this.itemConditionPlanPairFlag = false;
      this.serializedItemAssignFlag = false;
      this.nonSerializedItemAssignFlag = true;
      this.availableQtyFlag = false;
      this.oldOfferBasedDiscountNonSerialFlag = false;
      this.inventoryAssignForm.get("productId").reset();
      this.getProductSelection();
    } else {
      this.inventoryAssignForm.controls['itemAssemblyflag'].enable();
      this.inventoryAssignForm.controls['itemType'].enable();
      this.inventoryAssignForm.controls['nonSerializedItemRemark'].disable();
      this.getAllAssemblyNameFlag = false;
      this.itemConditionPairFlag = false;
      this.getAllAssemblyTypeFlag = true;
      this.oldOfferPriceSTBFlag = false;
      this.oldOfferBasedDiscountSTBPairFlag = false;
      this.getAllPairProductFlag = false;
      this.getAllPairItemMacFlag = false;
      this.getSplitterFlag = false;
      this.getAllNonSerializedProductFlag = false;
      this.getAllSerializedProductFlag = false;
      this.itemConditionSingleFlag = false;
      this.itemConditionPlanSeriFlag = false;
      this.itemConditionPlanPairFlag = false;
      this.serializedItemAssignFlag = false;
      this.nonSerializedItemAssignFlag = false;
      this.inventoryAssignForm.controls['itemAssemblyName'].disable();
      this.availableQtyFlag = false;
      this.oldOfferBasedDiscountNonSerialFlag = false;
    }
  }
  // Selection of Assembly Type for Plan Inventory Assign
  getSelPlanAssemblyType(event: { value: any; }) {
    console.log("event", event.value);
    if (event.value) {
      this.planInventoryAssignForm.controls['itemAssemblyName'].enable();
      this.selectedMACAddress = [];
      this.getPlanSingleSplitterFlag = false;
      this.getPlanPairSplitterFlag = true;
      this.itemConditionPlanSeriFlag = false;
      this.itemConditionPlanPairFlag = true;
      this.getAssemblyNameflag = true;
    } else {
      this.itemConditionPlanSeriFlag = true;
      this.getPlanSingleSplitterFlag = true;
      this.getPlanPairSplitterFlag = false;
      this.itemConditionPlanPairFlag = false;
      this.getAssemblyNameflag = false;
      this.planInventoryAssignForm.controls['itemAssemblyName'].disable();
      this.selectedMACAddress = "";
    }
    this.macAddressList = [];
    this.planInventoryAssignForm.controls['productId'].setValue("");
  }

  getProductSelection(): void {
    const url = "/product/getAllProductForNonTrackableProductCategory";
    this.customerInventoryManagementService.getMethod(url).subscribe((response: any) => {
      this.allActiveNonTrackableProducts = response.dataList;
    });
  }

  getExternalItemList(event: { value: string; }) {
    const ownerId = this.custData.id;
    const url =
      "/externalitemmanagement/getAllExternalItemGroupByProductAndStaff?productId=" +
      event.value +
      "&ownerId=" +
      ownerId;
    const productId = event.value;
    let product = this.allActiveProducts.find((element: { id: any; }) => element.id == productId);
    this.hasMac = product.productCategory.hasMac;
    this.hasSerial = product.productCategory.hasSerial;
    this.getExternalItemListFlag = true;
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.externalItemList = response.dataList;
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

  getAllMappingByExternal(event: { value: string; }) {
    this.macExternalListFlag = true;
    this.macAddressList = [];
    const url = "/inoutWardMacMapping/getAllMACMappingByExternalId?external_id=" + event.value;
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.macAddressList = response.dataList;
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

  assigneOtherInventoryForNonSerializedItem(): void {
    this.inventoryAssignSumitted = true;
    let data: any = "";
    data = this.inventoryAssignForm.value;
    data.itemId = data.productId;
    data.customerId = this.serviceCustomerId;
    data.staffId = this.staffUserId;
    data.itemAssemblyStatus = "Pending";
    // console.log("assigneOtherInventoryForNonSerializedItem ::::: ", data);
    // return;
    console.log("inventoryAssignForm", this.inventoryAssignForm);
    if (this.inventoryAssignForm.valid && !this.showQtyError && !this.negativeAssignQtyError) {
      data.qty = data.nonSerializedQty;
      this.submitted = true;
      if (data.qty == "" || data.qty == null) {
        this.messageService.add({
          severity: "info",
          summary: "Information",
          detail: "Please Enter Assign Quantity",
          icon: "far fa-check-circle"
        });
      } else if (data.nonSerializedItemRemark == "" || data.nonSerializedItemRemark == null) {
        this.showError = true;
      } else {
        this.showError = false;
        const url = "/inwards/assignNonSerializedItemToCustomer";
        this.customerInventoryManagementService.postMethod(url, data).subscribe(
          (res: any) => {
            if (res.responseCode == 200) {
              this.assignOtherInventoryModalClose();
              this.getCustomerAssignedList();
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: "Assigned inventory successfully.",
                icon: "far fa-check-circle"
              });
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: res.responseMessage,
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
  }

  getNonTrackableProductQty(event: { value: any; }) {
    const staffId = localStorage.getItem("userId");
    const productId = event.value;
    let product = this.allActiveNonTrackableProducts.find((element: { id: any; }) => element.id == productId);
    const url =
      "/outwards/getNonTrackableProductQty?productId=" +
      productId +
      "&ownerId=" +
      staffId +
      "&ownerType=Staff";
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (res: any) => {
        this.availableQtyFlag = true;
        this.isInvoiceDataNonSerialFlag = false;
        this.oldOfferBasedDiscountNonSerialFlag = true;
        this.getNonTrackableProductQtyList = res.dataList;
        this.UOM = this.allActiveNonTrackableProducts.find(
          (          element: { id: any; }) => element.id == productId
        ).productCategory.unit;
        if (
          this.getNonTrackableProductQtyList.length == 0 ||
          this.getNonTrackableProductQtyList == null
        ) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "Assignee does not have sufficient product quantity",
            icon: "far fa-times-circle"
          });
        } else {
          if (this.UOM == "kilometer" || this.UOM == "meter") {
            this.UOM = "meter";
          } else {
            this.UOM = this.UOM;
          }
          if (res.dataList.length == 0 || res.dataList == null) {
            this.availableQty = 0;
          } else {
            this.availableQty = res.dataList.find((element: any) => element).unusedQty;
          }
          console.log("this.getNonTrackableProductQtyList", this.getNonTrackableProductQtyList);
          this.getNonProductDetails(product);
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

  saveMacidMapping(id: any, data: { macAddress: any; serialNumber: any; }) {
    let url = `/item/updateItemMacAndSerial?itemId=${id}&macAddress=${data.macAddress}&serialNumber=${data.serialNumber}`;
    this.customerInventoryManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.enterReplacementLevelMacSerial = "";
          this.enterPlanLevelMacSerial = "";
          this.enterMacSerial = "";
          this.isEditEnable = true;
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.responseMessage,
            icon: "far fa-check-circle"
          });
        }
        if (response.responseCode == 417 || response.responseCode == 406) {
          this.messageService.add({
            severity: "info",
            summary: "info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        }

        // this.workflowAuditData1 = response.dataList;
        // this.MastertotalRecords1 = response.totalRecords;
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
  //Single Item
  editMacMapping(id: any, product: any, event: any) {
    console.log("event", event.target.ariaChecked);
    const check = event.target.ariaChecked;
    this.isEditEnable = true;
    if (check) {
      this.editMacSerialBtn = id;
    } else {
      this.editMacSerialBtn = "";
    }

    console.log(this.editMacSerialBtn, "editMacSerialBtn");
    this.selectedSerialNumber = product.serialNumber;
    this.addSpecificationParamDetails(product);
  }

  editMac(id: any) {
    this.enterMacSerial = id;
    this.isEditEnable = false;
  }
  // STB
  editSTBSerialMapping(id: any) {
    this.editSTBSerialBtn = id;
  }

  editSTBSerial(id: any) {
    this.enterSTBSerial = id;
  }

  // Card
  editCardSerialMapping(id: any) {
    this.editCardSerialBtn = id;
    this.isEditEnable = true;
  }

  editCardSerial(id: any) {
    this.enterCardSerial = id;
    this.isEditEnable = false;
  }
  // Plan STB
  editPlanSTBSerialMapping(id: any) {
    this.editSTBSerialBtn = id;
    this.isEditEnable = true;
  }

  editPlanSTBSerial(id: any) {
    this.enterSTBSerial = id;
    this.isEditEnable = false;
  }
  // Plan
  editPlanLevelMacMapping(id: any, product: { serialNumber: any; }) {
    this.editPlanLevelMacSerialBtn = id;
    this.selectedSerialNumber = product.serialNumber;
    this.isEditEnable = true;
    this.addSpecificationParamDetails(product);
  }

  editPlanLevelMac(id: any) {
    this.enterPlanLevelMacSerial = id;
    this.isEditEnable = false;
  }

  selectedCard: any;

  editReplacementLevelMacMapping(id: any) {
    console.log("click", id);
    console.log("rsdfxcverdfc...", this.selectedCardOption, this.selectedCard);
    this.editReplacementLevelMacSerialBtn = id;
    this.isEditEnable = true;
  }

  onSelectionChange() {
    console.log("Selected car:", this.selectedCard);
  }

  editReplacementLevelMac(id: any) {
    this.enterReplacementLevelMacSerial = id;
    this.isEditEnable = false;
  }

  assignQuantityValidation(event: { which: number; preventDefault: () => void; }) {
    var num = String.fromCharCode(event.which);
    if (!/[0-9]/.test(num)) {
      event.preventDefault();
    }
  }

  generateRemoveInventoryRequest(inventory: { inOutWardMACMapping: { itemId: any; }[]; }) {
    if (this.isDisableRemove({ connectionNo: inventory.inOutWardMACMapping[0]?.itemId })) {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Please terminate service, before remove inventory.",
        icon: "far fa-times-circle"
      });
    } else {
      let id = inventory.inOutWardMACMapping[0].itemId;
      let custinventoryid = (inventory.inOutWardMACMapping[0] as any)?.custInventoryMappingId || null;
      let ItemId = inventory.inOutWardMACMapping[0].itemId;
      this.editInventory = false;
      this.editSTBCradInventory = false;
      this.removeId = id;
      this.removeCustinventoryid = custinventoryid;
      this.removeItemId = ItemId;
      if (id) {
        this.confirmationService.confirm({
          message: "Do you want to remove inventory " + "?",
          header: "Confirmation",
          icon: "pi pi-info-circle",
          accept: () => {
            this.getCustomerInventoryMappingDetails(ItemId, custinventoryid);
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
  }

  acceptRemoveItem() {
    this.editInventory = false;
    this.editSTBCradInventory = false;
    this.removeRemarkSubmitted = true;
    let refundAmount = "";
    this.removeInventory(this.removeId, this.removeCustinventoryid, "false", refundAmount);
    //this.removeRemark = this.removeRemarkForm.value;
    // if (this.removeRemarkForm.valid) {
    // this.removeInvantryFunction(this.removeId, this.removeCustinventoryid, this.removeItemId);
    // }
  }
  finalRemoveWithRefund() {
    let refundAmount = this.refundAmountForm.get("newRefundAmount").value;
    this.refundAmountSubmitted = true;
    this.removeInventory(this.removeId, this.removeCustinventoryid, "false", refundAmount);
    this.closeRefundAmountModal();
  }
  closeApproveInventoryModal() {
    this.editInventory = false;
    this.editSTBCradInventory = false;
    this.removeRemarkSubmitted = false;
    this.removeRemarkForm.reset();
    // $("#approveChangeStatusModal").modal("hide");
  }

  closeRefundAmountModal() {
    this.refundAmountForm.reset();
    $("#refundAmountModal").modal("hide");
  }

  getAllCustomerInvetoryDetailshistory() {
    const url = "/item/getAllCustomerInvetoryDetailshistory?custId=" + this.custData.id;
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.getAllCustomerInvetoryDetailshistoryData = response.dataList;
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

  clearFileterGlobalSingleItem(table: Table) {
    this.fileterGlobalSingleItem = "";
    table.clear();
  }

  clearstbFileterGlobal(table: Table) {
    this.stbFileterGlobal = "";
    table.clear();
  }

  clearcardFileterGlobal(table: Table) {
    this.cardFileterGlobal = "";
    table.clear();
  }

  clearFilterGlobalReplaceSingle(table: Table) {
    this.filterGlobalReplaceSingle = "";
    table.clear();
  }

  clearfileterGlobalPlanlevel(table: Table) {
    this.fileterGlobalPlanlevel = "";
    table.clear();
  }

  clearstbFileterGlobalReplace(table: Table) {
    this.stbFileterGlobalReplace = "";
    table.clear();
  }

  clearcardFileterGlobalReplace(table: Table) {
    this.cardFileterGlobalReplace = "";
    table.clear();
  }

  clearexternalItemsFilterGlobal(table: Table) {
    this.externalItemsFilterGlobal = "";
    table.clear();
  }

  getAllInventoryHistoryModalOpen() {
    this.displayCustomerInventoryHistory = true;
    this.getAllInventoryHistory();
  }

  getAllInventoryHistoryModalClose() {
    this.displayCustomerInventoryHistory = false;
  }

  inventoryLogDetailsList: any;

  inventoryLogModalOpen() {
    const url = "/inwards/getCustomerbasedOnDtvHistory?customerId=" + this.custData.id;
    this.customerInventoryManagementService.getMethod(url).subscribe((res: any) => {
      if (res.responseCode == 200) {
        this.displayDTVHistory = true;
        this.inventoryLogDetailsList = res.dataList;
      }
      console.log("log Details", res);
    });
  }

  closeInventoryLogModal() {
    this.displayDTVHistory = false;
  }
  getAllInventoryHistory() {
    this.getAllInventoryofCust = [];

    const url = "/item/getAllCustomerInvetoryDetailshistory?custId=" + this.custData.id;
    this.customerInventoryManagementService.getMethod(url).subscribe(
      (res: any) => {
        this.getAllInventoryofCust = res.dataList;
        setTimeout(() => {
          this.btnClose.nativeElement.click();
        }, 100);
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

  cleargetAllInventoryofCustFilterGlobal(table: Table) {
    this.getAllInventoryofCustFilterGlobal = "";
    table.clear();
  }

  onclosed() {
    this.getAllInventoryofCustFilterGlobal = "";
    this.displayCustomerInventoryHistory = false;
  }

  // Bill To Plan Inventory Assign
  getMappingDetails(planGroupId: string, planId: string, productCategoryId: string, productId: string, billToPlan: string) {
    const url =
      "/product/getMappingDetails?planGroupId=" +
      planGroupId +
      "&planId=" +
      planId +
      "&productCategoryId=" +
      productCategoryId +
      "&productId=" +
      productId;

    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.mappingList = response.dataList;
        this.oldOfferPricePlan = this.mappingList[0].revisedCharge;
        this.newOfferPricePlan = this.mappingList[0].revisedCharge;
        let offerPrice = Number(this.oldOfferPricePlan);
        let newOfferPrice = Number(this.newOfferPricePlan);
        if (billToPlan == "ORGANIZATION") {
          if (offerPrice != 0) {
            this.newOfferPriceFlag = false;
            this.invoiceDataReadOnly = false;
          } else {
            this.newOfferPriceFlag = true;
            this.invoiceDataReadOnly = true;
          }
        } else {
          if (offerPrice != 0) {
            this.newOfferPriceFlag = false;
            this.invoiceDataReadOnly = false;
          } else {
            this.newOfferPriceFlag = true;
            this.invoiceDataReadOnly = false;
          }
        }
        // let discount = Number(this.connectionDetailData[0].discount);
        this.selectedCustDiscount = this.custDiscount;
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

  staffDataList: any = [];

  getStaffDetailById(serviceAreaId: string) {
    const url = "/getstaffuserbyserviceareaid/" + serviceAreaId;
    this.serviceAreaService.getMethod(url).subscribe((response: any) => {
      this.staffDataList = response.dataList;
      //console.log("staffDataList", this.data);
      this.staffDataList.forEach((element: { displayLabel: string; fullName: string; phone: string; }, i: any) => {
        element.displayLabel = element.fullName + " (Ph: " + element.phone + ")";
      });
    });
  }

  // Bill to Serialized Single Item Other Inventory
  getProductDetails(product: { newProductAmount: Number; refurburshiedProductAmount: Number; }) {
    if (this.selItemCondition == "New") {
      this.oldOfferOtherSigle = product.newProductAmount;
      this.newOfferOtherSigle = product.newProductAmount;
      if (this.oldOfferOtherSigle == null) {
        this.newOfferSingleFlag = false;
      } else {
        this.newOfferSingleFlag = true;
      }
      // let offerPrice = Number(this.oldOfferOtherSigle);
      // let newOfferPrice = Number(this.newOfferOtherSigle);
      // let discount = Number(this.connectionDetailData[0].discount);
      this.selectedCustDiscount = this.custDiscount;
      let date;
      date = this.currentDate.toISOString();
      const format = "yyyy-MM-dd";
      const locale = "en-US";
      const myDate = date;
      const formattedDate = formatDate(myDate, format, locale);
    }
    if (this.selItemCondition == "Refurbished") {
      this.oldOfferOtherSigle = product.refurburshiedProductAmount;
      this.newOfferOtherSigle = product.refurburshiedProductAmount;
      if (this.oldOfferOtherSigle == null) {
        this.newOfferSingleFlag = false;
      } else {
        this.newOfferSingleFlag = true;
      }
      // let offerPrice = Number(this.oldOfferOtherSigle);
      // let newOfferPrice = Number(this.newOfferOtherSigle);
      // let discount = Number(this.connectionDetailData[0].discount);
      this.selectedCustDiscount = this.custDiscount;
    }
  }

  // Bill to Non Serialized Product Detais
  getNonProductDetails(product: { newProductAmount: Number; }) {
    this.perUOMCharge = product.newProductAmount;
    this.newUOMAmount = product.newProductAmount;
    if (this.perUOMCharge == null) {
      this.newOfferNonSerialFlag = false;
    } else {
      this.newOfferNonSerialFlag = true;
    }
    // let offerPrice = Number(this.perUOMCharge);
    // let newOfferPrice = Number(this.newUOMAmount);
    // let discount = Number(this.connectionDetailData[0].discount);
    this.selectedCustDiscount = this.custDiscount;
  }

  getCardProductDetails(product: any) {
    if (this.selItemCondition == "New") {
      this.oldOfferCard = 0;
      this.newOfferCard = 0;
      // let offerPrice = Number(this.oldOfferCard);
      // let newOfferPrice = Number(this.newOfferCard);
      // let discount = Number(this.connectionDetailData[0].discount);
      if (this.oldOfferCard == null) {
        this.newOfferCardFlag = false;
      } else {
        this.newOfferCardFlag = true;
      }
    }
    if (this.selItemCondition == "Refurbished") {
      this.oldOfferCard = 0;
      this.newOfferCard = 0;
      // let offerPrice = Number(this.oldOfferCard);
      // let newOfferPrice = Number(this.newOfferCard);
      // let discount = Number(this.connectionDetailData[0].discount);
      if (this.oldOfferCard == null) {
        this.newOfferCardFlag = false;
      } else {
        this.newOfferCardFlag = true;
      }
    }
  }
  // Bill to STB Product Details
  getSTBProductDetails(product: { newProductAmount: Number; refurburshiedProductAmount: Number; }) {
    if (this.selItemCondition == "New") {
      this.oldOfferSTB = product.newProductAmount;
      this.newOfferSTB = product.newProductAmount;
      // let offerPrice = Number(this.oldOfferSTB);
      // let newOfferPrice = Number(this.newOfferSTB);
      // let discount = Number();
      // if (this.connectionDetailData[0].discount != 0) {
      //   discount = Number(this.connectionDetailData[0].discount);
      // } else {
      //   discount = 0;
      // }
      if (this.oldOfferSTB == null) {
        this.newOfferSTBFlag = false;
      } else {
        this.newOfferSTBFlag = true;
      }
      this.selectedPairDiscount = this.custDiscount;
    }
    if (this.selItemCondition == "Refurbished") {
      this.oldOfferSTB = product.refurburshiedProductAmount;
      this.newOfferSTB = product.refurburshiedProductAmount;
      // let offerPrice = Number(this.oldOfferSTB);
      // let newOfferPrice = Number(this.newOfferSTB);
      // let discount = Number(this.connectionDetailData[0].discount);
      this.selectedPairDiscount = this.custDiscount;
      if (this.oldOfferSTB == null) {
        this.newOfferSTBFlag = false;
      } else {
        this.newOfferSTBFlag = true;
      }
    }
  }

  selectBillToSingle(event: { value: string; }) {
    this.oldOfferBasedDiscountSingleFlag = false;
    this.oldOfferPriceSingleFlag = false;
    if (event.value == "ORGANIZATION") {
      this.isInvoiceDataSingleFlag = true;
      this.oldOfferPriceSingleFlag = true;
      this.oldOfferBasedDiscountSingleFlag = false;
      if (this.oldOfferOtherSigle == null) {
        this.newOfferSingleFlag = false;
      } else {
        this.newOfferSingleFlag = true;
      }
    } else {
      this.isInvoiceDataSingleFlag = false;
      this.oldOfferPriceSingleFlag = false;
      this.oldOfferBasedDiscountSingleFlag = true;
      if (this.oldOfferOtherSigle == null) {
        this.newOfferSingleFlag = false;
      } else {
        this.newOfferSingleFlag = true;
      }
    }
  }

  // Bill To Support For Non Serialized Item
  selectBillToNonSerialize(event: { value: string; }) {
    this.oldOfferBasedDiscountNonSerialFlag = false;
    this.oldOfferPriceNonSerialFlag = false;
    if (event.value == "ORGANIZATION") {
      this.isInvoiceDataNonSerialFlag = true;
      this.oldOfferPriceNonSerialFlag = true;
      this.oldOfferBasedDiscountNonSerialFlag = false;
      if (this.perUOMCharge == null) {
        this.newOfferNonSerialFlag = false;
      } else {
        this.newOfferNonSerialFlag = true;
      }
    } else {
      this.isInvoiceDataNonSerialFlag = false;
      this.oldOfferPriceNonSerialFlag = false;
      this.oldOfferBasedDiscountNonSerialFlag = true;
      if (this.perUOMCharge == null) {
        this.newOfferNonSerialFlag = false;
      } else {
        this.newOfferNonSerialFlag = true;
      }
    }
  }

  selectItemCondition(event: { value: string; }) {
    if (event.value == "New") {
      this.selItemCondition = event.value;
      this.inventoryAssignForm.get("productId").reset();
      this.inventoryAssignForm.controls['billTo'].setValue("CUSTOMER");
      this.getAllSerializedProductFlag = true;
      this.getAllSingleItemMacFlag = false;
      this.billToSigleFlag = false;
      this.billToPairFlag = false;
      this.discountPairFlag = false;
      this.isInvoiceDataSingleFlag = false;
      this.oldOfferPriceSingleFlag = false;
      this.oldOfferBasedDiscountSingleFlag = false;
    } else {
      this.selItemCondition = event.value;
      this.inventoryAssignForm.get("productId").reset();
      this.inventoryAssignForm.controls['billTo'].setValue("CUSTOMER");
      this.getAllSerializedProductFlag = true;
      this.getAllSingleItemMacFlag = false;
      this.billToSigleFlag = false;
      this.billToPairFlag = false;
      this.discountPairFlag = false;
      this.isInvoiceDataSingleFlag = false;
      this.oldOfferPriceSingleFlag = false;
      this.oldOfferBasedDiscountSingleFlag = false;
    }
  }
  selectItemConditionPlan(event: { value: string; }) {
    if (event.value == "New") {
      this.selPlanItemCondition = event.value;
      this.planInventoryAssignForm.get("productId").reset();
      this.inventoryAssignForm.controls['billTo'].setValue("CUSTOMER");
      // this.getAllSerializedProductFlag = true;
      this.getProductForPlanInventoryAssignFlag = true;
      this.getAllPairPlanProductSTBFlag = true;
      this.getAllPairProductCardFlag = true;
      this.getAllSingleItemMacFlag = false;
      this.billToPlanFlag = false;
      this.isInvoiceDataFlag = false;
      this.oldOfferPricePlanFlag = false;
      this.oldOfferBasedDiscountPlanFlag = false;
    } else {
      this.selPlanItemCondition = event.value;
      this.planInventoryAssignForm.get("productId").reset();
      this.inventoryAssignForm.controls['billTo'].setValue("CUSTOMER");
      // this.getAllSerializedProductFlag = true;
      this.getProductForPlanInventoryAssignFlag = true;
      this.getAllPairPlanProductSTBFlag = true;
      this.getAllPairProductCardFlag = true;
      this.getAllSingleItemMacFlag = false;
      this.billToPlanFlag = false;
      this.isInvoiceDataFlag = false;
      this.oldOfferPricePlanFlag = false;
      this.oldOfferBasedDiscountPlanFlag = false;
    }
  }
  // Bill to Serialized Pair Other
  selectBillToPair(event: { value: string; }) {
    //this.oldOfferBasedDiscountSingleFlag = false;
    this.oldOfferBasedDiscountSTBPairFlag = false;
    this.oldOfferBasedDiscountCardPairFlag = false;
    this.discountPairFlag = false;
    //this.oldOfferBasedDiscountCardFlag = false;
    //this.oldOfferPriceSingleFlag = false;
    // this.oldOfferPriceSTBFlag = false;
    // this.oldOfferPriceCardFlag = false;
    if (event.value == "ORGANIZATION") {
      this.isInvoiceDataPairFlag = true;
      this.oldOfferPriceSTBFlag = true;
      this.oldOfferPriceCardFlag = true;
      this.oldOfferBasedDiscountSTBPairFlag = false;
      this.oldOfferBasedDiscountCardPairFlag = false;
      this.discountPairFlag = false;
      if (this.oldOfferSTB == null) {
        this.newOfferSTBFlag = false;
      } else {
        this.newOfferSTBFlag = true;
      }
      if (this.oldOfferCard == null) {
        this.newOfferCardFlag = false;
      } else {
        this.newOfferCardFlag = true;
      }
    } else {
      this.isInvoiceDataPairFlag = false;
      this.oldOfferPriceSTBFlag = false;
      this.oldOfferPriceCardFlag = false;
      this.oldOfferBasedDiscountSTBPairFlag = true;
      this.oldOfferBasedDiscountCardPairFlag = true;
      this.discountPairFlag = true;
      if (this.oldOfferSTB == null) {
        this.newOfferSTBFlag = false;
      } else {
        this.newOfferSTBFlag = true;
      }
      if (this.oldOfferCard == null) {
        this.newOfferCardFlag = false;
      } else {
        this.newOfferCardFlag = true;
      }
    }
  }

  // selectBillToCardPair(event) {
  //   //this.oldOfferBasedDiscountSingleFlag = false;
  //   // this.oldOfferBasedDiscountSTBFlag = false;
  //   this.oldOfferBasedDiscountPairFlag = false;
  //   //this.oldOfferPriceSingleFlag = false;
  //   // this.oldOfferPriceSTBFlag = false;
  //   this.oldOfferPriceCardFlag = false;
  //     if (event.value == "ORGANIZATION") {
  //       this.isInvoiceDataPairFlag = true;
  //       this.oldOfferPriceSTBFlag = true;
  //       this.oldOfferPriceCardFlag = true;
  //       this.oldOfferBasedDiscountPairFlag = false;
  //       if (this.oldOfferOtherSigle == null) {
  //         this.newOfferSingleFlag = false;
  //       } else {
  //         this.newOfferSingleFlag = true;
  //       }
  //     } else {
  //       this.isInvoiceDataPairFlag = false;
  //       this.oldOfferPriceSTBFlag = false;
  //       this.oldOfferPriceCardFlag = false;
  //       this.oldOfferBasedDiscountPairFlag = true;
  //     }
  // }
  modalOpenParentCustomer(type: any) {
    this.displaySelectParentCustomer = true;
    this.showItemPerPage = 5;
    this.newFirst = 1;
    this.parentCustomerListdataitemsPerPage = 5;
    this.parentCustomerDialogType = type;
    this.getParentCustomerData("");
    this.selectedParentCust = [];
  }

  getParentCustomerData(list: string | number) {
    let size: number;

    let currentPage;
    currentPage = this.currentPageParentCustomerListdata;
    if (list) {
      size = Number(list);
      this.parentCustomerListdataitemsPerPage = Number(list);
    } else {
      size = this.parentCustomerListdataitemsPerPage;
    }
    const data = {
      page: currentPage,
      pageSize: this.parentCustomerListdataitemsPerPage
    };
    const url = "/parentCustomers/list/" + this.custType;
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.prepaidParentCustomerList = response.parentCustomerList;
        const list = this.prepaidParentCustomerList;
        const filterList = list.filter((cust: { id: any; }) => cust.id !== this.editCustomerId);

        this.prepaidParentCustomerList = filterList;
        console.log("list", filterList);

        this.parentCustomerListdatatotalRecords = response.pageDetails.totalRecords;
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

  removeSelParentCust(type: string) {
    this.selectedParentCust = [];
    if (type === "billable") {
      this.billableCusList = [];
      this.inventoryAssignForm.patchValue({
        billabecustId: null
      });
      this.planInventoryAssignForm.patchValue({
        billabecustId: null
      });
      this.replaceInventoryForm.patchValue({
        billabecustId: null
      });
    }
  }

  async saveSelCustomer() {
    if (this.parentCustomerDialogType === "billable") {
      this.billableCusList = [
        {
          id: this.selectedParentCust.id,
          name: this.selectedParentCust.name
        }
      ];
      this.inventoryAssignForm.patchValue({
        billabecustId: this.selectedParentCust.id
      });
      this.planInventoryAssignForm.patchValue({
        billabecustId: this.selectedParentCust.id
      });
      this.replaceInventoryForm.patchValue({
        billabecustId: this.selectedParentCust.id
      });
    } else {
      this.parentCustList = [
        {
          id: this.selectedParentCust.id,
          name: this.selectedParentCust.name
        }
      ];
      this.inventoryAssignForm.patchValue({
        parentCustomerId: this.selectedParentCust.id
      });
      this.planInventoryAssignForm.patchValue({
        parentCustomerId: this.selectedParentCust.id
      });
      this.replaceInventoryForm.patchValue({
        parentCustomerId: this.selectedParentCust.id
      });
      const url = "/customers/" + this.selectedParentCust.id;
      let parentCustServiceAreaId: any;

      await this.customerInventoryManagementService.getMethod(url).subscribe((response: any) => {
        parentCustServiceAreaId = response.customers.serviceareaid;
      });
    }
    this.modalCloseParentCustomer();
  }
  modalCloseParentCustomer() {
    this.displaySelectParentCustomer = false;
    this.currentPageParentCustomerListdata = 1;
    this.newFirst = 0;
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
  }

  searchParentCustomer() {
    this.newFirst = 1;
    if (this.showItemPerPage) {
      this.parentCustomerListdataitemsPerPage = this.showItemPerPage;
    }
    const searchParentData = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ],
      page: this.currentPageParentCustomerListdata,
      pageSize: this.parentCustomerListdataitemsPerPage
    };
    searchParentData.filters[0].filterValue = this.searchParentCustValue;
    searchParentData.filters[0].filterColumn = this.searchParentCustOption.trim();
    const url = "/parentCustomers/search/" + RadiusConstants.CUSTOMER_TYPE.PREPAID;
    // console.log("this.searchData", this.searchData)
    this.customerManagementService.postMethod(url, searchParentData).subscribe(
      (response: any) => {
        this.prepaidParentCustomerList = response.parentCustomerList;
        const list = this.prepaidParentCustomerList;
        const filterList = list.filter((cust: { id: any; }) => cust.id !== this.editCustomerId);
        this.prepaidParentCustomerList = filterList;
        console.log("list", filterList);
        this.parentCustomerListdatatotalRecords = response.pageDetails.totalRecords;
      },
      (error: any) => {
        this.parentCustomerListdatatotalRecords = 0;
        this.prepaidParentCustomerList = [];
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.customerListData = [];
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

  clearSearchParentCustomer() {
    this.currentPageParentCustomerListdata = 1;
    this.newFirst = 0;
    this.getParentCustomerData("");
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
  }

  selParentSearchOption(event: { value: any; }) {
    this.currentPageParentCustomerListdata = 1;
    if (event.value) {
      this.parentFieldEnable = true;
    } else {
      this.parentFieldEnable = false;
    }
  }

  // Bill to Serialized Single Item Replace Inventory
  getProductDetailsReplace(product: { newProductAmount: Number; refurburshiedProductAmount: Number; }) {
    if (this.selItemCondition == "New") {
      this.oldOfferOtherSigleReplace = product.newProductAmount;
      this.newOfferOtherSigleReplace = product.newProductAmount;
      // let offerPrice = Number(this.oldOfferOtherSigle);
      // let newOfferPrice = Number(this.newOfferOtherSigleReplace);
      // let discount = Number(this.connectionDetailData[0].discount);
      this.selectedCustDiscount = this.custDiscount;
    }
    if (this.selItemCondition == "Refurbished") {
      this.oldOfferOtherSigleReplace = product.refurburshiedProductAmount;
      this.newOfferOtherSigleReplace = product.refurburshiedProductAmount;
      // let offerPrice = Number(this.oldOfferOtherSigle);
      // let newOfferPrice = Number(this.newOfferOtherSigleReplace);
      // let discount = Number(this.connectionDetailData[0].discount);
      this.selectedCustDiscount = this.custDiscount;
    }
  }

  selectBillToSingleReplace(event: { value: string; }) {
    // this.oldOfferBasedDiscountSingleFlag = false;
    this.oldOfferBasedDiscountSingleReplaceFlag = false;
    this.oldOfferPriceSingleReplaceFlag = false;
    // this.oldOfferPriceSingleFlag = false;
    if (event.value == "ORGANIZATION") {
      this.isInvoiceDataSingleReplaceFlag = true;
      this.oldOfferPriceSingleReplaceFlag = true;
      // this.oldOfferBasedDiscountSingleFlag = false;
      this.oldOfferBasedDiscountSingleReplaceFlag = false;
      if (this.oldOfferOtherSigle == null) {
        this.newOfferSingleFlag = false;
      } else {
        this.newOfferSingleFlag = true;
      }
    } else {
      this.isInvoiceDataSingleReplaceFlag = false;
      this.oldOfferPriceSingleReplaceFlag = false;
      // this.oldOfferBasedDiscountSingleFlag = true;
      this.oldOfferBasedDiscountSingleReplaceFlag = false;
      if (this.oldOfferOtherSigle == null) {
        this.newOfferSingleFlag = false;
      } else {
        this.newOfferSingleFlag = true;
      }
    }
  }

  selectItemConditionReplace(event: { value: string; }) {
    if (event.value == "New") {
      // this.selItemCondition = event.value;
      this.selItemConditionReplace = event.value;
      this.replaceInventoryForm.get("productId").reset();
      this.getAllSerializedProductFlag = true;
      this.macReplaceListFlag = false;
      // this.billToSigleFlag = false;
      // this.isInvoiceDataSingleFlag = false;
      // this.oldOfferPriceSingleFlag = false;
      // this.oldOfferBasedDiscountSingleFlag = false;
      this.billToSigleReplaceFlag = false;
      this.isInvoiceDataSingleReplaceFlag = false;
      this.oldOfferPriceSingleReplaceFlag = false;
      this.oldOfferBasedDiscountSingleReplaceFlag = false;
    } else {
      this.selItemConditionReplace = event.value;
      this.replaceInventoryForm.get("productId").reset();
      this.getAllSerializedProductFlag = true;
      this.macReplaceListFlag = false;
      // this.billToSigleFlag = false;
      // this.isInvoiceDataSingleFlag = false;
      // this.oldOfferPriceSingleFlag = false;
      // this.oldOfferBasedDiscountSingleFlag = false;
      this.billToSigleReplaceFlag = false;
      this.isInvoiceDataSingleReplaceFlag = false;
      this.oldOfferPriceSingleReplaceFlag = false;
      this.oldOfferBasedDiscountSingleReplaceFlag = false;
    }
  }

  selectItemConditionPair(event: { value: string; }) {
    this.getSplitterFlag = true;
    this.billToPairFlag = false;
    this.discountPairFlag = true;
    if (event.value == "New") {
      this.selItemCondition = event.value;
      this.inventoryAssignForm.get("productId").reset();
      this.inventoryAssignForm.controls['billTo'].setValue("CUSTOMER");
      // this.getAllSerializedProductFlag = true;
      this.getAllPairProductFlag = true;
      this.getAllPairItemMacFlag = false;
      this.getAllSingleItemMacFlag = false;
      // this.billToPairFlag = false;
      this.isInvoiceDataPairFlag = false;
      this.oldOfferPriceSTBFlag = false;
      this.oldOfferPriceCardFlag = false;
      this.oldOfferBasedDiscountSingleFlag = false;
      this.oldOfferBasedDiscountSTBPairFlag = false;
      this.oldOfferBasedDiscountCardPairFlag = false;
    } else {
      this.selItemCondition = event.value;
      this.inventoryAssignForm.get("productId").reset();
      this.inventoryAssignForm.controls['billTo'].setValue("CUSTOMER");
      // this.getAllSerializedProductFlag = true;
      this.getAllPairProductFlag = true;
      this.getAllPairItemMacFlag = false;
      this.getAllSingleItemMacFlag = false;
      // this.billToPairFlag = false;
      this.isInvoiceDataPairFlag = false;
      this.oldOfferPriceSTBFlag = false;
      this.oldOfferPriceCardFlag = false;
      this.oldOfferBasedDiscountSingleFlag = false;
      this.oldOfferBasedDiscountSTBPairFlag = false;
      this.oldOfferBasedDiscountCardPairFlag = false;
    }
  }

  //Workflow for approve assign inventory
  approveAssignInventoryOpen(mappingId: any, nextApproverId: any, id: any) {
    this.approved = false;
    this.selectAssignInventoryApproveStaff = null;
    this.approveAssignInventoryData = [];
    $("#assignApproveOtherInventoryOpen").modal("show");
    this.approveAssignInventoryForm.reset();
    this.assignInventoryId = mappingId;
    this.customerInventoryId = id;
    this.nextApproverId = nextApproverId;
    this.rejectAssignInventoryForm.reset();
    this.rejectAssignInventorySubmitted = false;
  }

  clearapproveInventory() {
    this.approveAssignInventoryForm.reset();
  }
  clearassignToStaff() {
    this.rejectAssignInventoryForm.reset();
  }

  //Workflow for reject assign inventory
  seletedStaffReplace: any;
  rejectPlanData: any;
  rejectAssignInventoryOpen(mappingId: any, nextApproverId: any, id: any) {
    this.reject = false;
    this.selectAssignInventoryRejectStaff = null;
    this.rejectAssignInventoryData = [];
    $("#assignRejectOtherInventoryOpen").modal("show");
    this.rejectAssignInventoryForm.reset();
    this.assignInventoryId = mappingId;
    this.nextApproverId = nextApproverId;
    this.customerInventoryId = id;
    // this.rejectAssignInventoryForm.reset();
    this.rejectAssignInventorySubmitted = false;
  }

  assignToStaffReplace() {
    let url: any;

    if (this.seletedStaffReplace) {
      url = `/inwards/assignFromStaffList?entityId=${
        this.replaceInventoryIdInOutMacMapping
      }&eventName=${"CUSTOMER_INVENTORY_ASSIGN_REPLACE"}&nextAssignStaff=${
        this.seletedStaffReplace
      }&isApproveRequest=${this.isApproveRequest}&isAssignPairItem=false`;
    } else {
      url = `/teamHierarchy/assignEveryStaff?entityId=${
        this.replaceInventoryIdInOutMacMapping
      }&eventName=${"CUSTOMER_INVENTORY_ASSIGN_REPLACE"}&isApproveRequest=${this.isApproveRequest}`;
    }

    this.customerInventoryManagementService.getMethod(url).subscribe(
      response => {
        this.replaceAssignForm.get("remark").reset();
        $("#approvalReplaceInventory").modal("hide");
        // $("#assignRejectOtherInventoryOpen").modal("hide");
        this.editInventory = false;
        this.editSTBCradInventory = false;
        this.getCustomerAssignedList();
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

paginate(event: PaginatorState) {
  // You can access the necessary values from PaginatorState
  this.showItemPerPage = event.rows;  // `rows` is the number of items per page
  this.currentPageParentCustomerListdata = event.page + 1;  // `page` is zero-based index

  if (this.searchParentCustValue) {
    this.searchParentCustomer();
  } else {
    this.getParentCustomerData(this.showItemPerPage);
  }
}

  assignToStaff(flag: boolean) {
    let url: any;
    if (flag == true) {
      if (this.selectAssignInventoryApproveStaff) {
        if (this.assignInventoryId != this.customerInventoryId) {
          url = `/inwards/assignFromStaffList?entityId=${
            this.assignInventoryId
          }&eventName=${"CUSTOMER_INVENTORY_ASSIGN"}&nextAssignStaff=${
            this.selectAssignInventoryApproveStaff
          }&isApproveRequest=${flag}&isAssignPairItem=true`;
        } else {
          url = `/inwards/assignFromStaffList?entityId=${
            this.assignInventoryId
          }&eventName=${"CUSTOMER_INVENTORY_ASSIGN"}&nextAssignStaff=${
            this.selectAssignInventoryApproveStaff
          }&isApproveRequest=${flag}&isAssignPairItem=false`;
        }
      } else {
        url = `/teamHierarchy/assignEveryStaff?entityId=${
          this.assignInventoryId
        }&eventName=${"CUSTOMER_INVENTORY_ASSIGN"}&isApproveRequest=${flag}`;
      }
    } else {
      if (this.selectAssignInventoryRejectStaff) {
        if (this.assignInventoryId != this.customerInventoryId) {
          url = `/inwards/assignFromStaffList?entityId=${
            this.assignInventoryId
          }&eventName=${"CUSTOMER_INVENTORY_ASSIGN"}&nextAssignStaff=${
            this.selectAssignInventoryRejectStaff
          }&isApproveRequest=${flag}&isAssignPairItem=true`;
        } else {
          url = `/inwards/assignFromStaffList?entityId=${
            this.assignInventoryId
          }&eventName=${"CUSTOMER_INVENTORY_ASSIGN"}&nextAssignStaff=${
            this.selectAssignInventoryRejectStaff
          }&isApproveRequest=${flag}&isAssignPairItem=false`;
        }
      } else {
        url = `/teamHierarchy/assignEveryStaff?entityId=${
          this.assignInventoryId
        }&eventName=${"CUSTOMER_INVENTORY_ASSIGN"}&isApproveRequest=${flag}`;
      }
    }

    this.customerInventoryManagementService.getMethod(url).subscribe(
      response => {
        $("#assignApproveOtherInventoryOpen").modal("hide");
        $("#assignRejectOtherInventoryOpen").modal("hide");
        this.getCustomerAssignedList();
        console.log(response);
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
  // offerprice validation
  newOfferPriceValidation(input: { which: number; preventDefault: () => void; }) {
    var num = String.fromCharCode(input.which);
    if (!/[0-9]/.test(num)) {
      input.preventDefault();
    }
  }
  //Disable Required Approval for Single Item
  selInvoiceToOrgSingle(event: { value: boolean; }) {
    if (event.value == true) {
      this.requiredApprovalSingleFlag = true;
    } else {
      this.requiredApprovalSingleFlag = false;
    }
  }
  //Disable Required Approval for Pair Item
  selInvoiceToPair(event: { value: boolean; }) {
    if (event.value == true) {
      this.requiredApprovalPairFlag = true;
    } else {
      this.requiredApprovalPairFlag = false;
    }
  }
  //Disable Required Approval for Non Serial Item
  selInvoiceToOrgNonSerial(event: { value: boolean; }) {
    if (event.value == true) {
      this.requiredApprovalNonSerialFlag = true;
    } else {
      this.requiredApprovalNonSerialFlag = false;
    }
  }
  //Disable Required Approval for Plan Item
  selInvoiceToOrgPlan(event: { value: boolean; }) {
    if (event.value == true) {
      this.requiredApprovalPlanFlag = true;
    } else {
      this.requiredApprovalPlanFlag = false;
    }
  }

  //Workflow Function for Approve Remove Inventory
  approveRemoveInventoryOpen(inventory: { id: any; inOutWardMACMapping: { id: any; }[]; }, nextApproverId: any) {
    this.approveRemove = false;
    this.selectRemoveInventoryApproveStaff = null;
    this.approveRemoveInventoryData = [];
    $("#approveRemoveInventoryOpenModel").modal("show");
    this.approveRemoveInventoryForm.reset();
    this.assignRemoveInventoryId = inventory.id;
    this.macMappingId = inventory.inOutWardMACMapping[0].id;
    this.custInventoryId = inventory.id;
    this.nextApproverId = nextApproverId;
    this.rejectRemoveInventoryForm.reset();
    this.rejectRemoveInventorySubmitted = false;
  }

  clearapproveremoveInventory() {
    this.approveRemoveInventoryForm.reset();
  }

  approveRemoveInventory(): void {
    this.assignRemoveInventorysubmitted = true;
    let mappingId = this.macMappingId;
    let custInventoryId = this.custInventoryId;
    // const ownershipFlag = this.ownershipForm.value;
    const removeRemark = this.approveRemoveInventoryForm.value;
    let staffId = localStorage.getItem("userId");
    // const url = `/inwards/approveInventory?isApproveRequest=true&customerInventoryMappingId=${id}`;
    const url = `/inoutWardMacMapping/removeInventory?&macMappingId=${mappingId}&customerInventoryId=${custInventoryId}&customerId=${this.custData.id}&isApprove=true&nextstaff=${staffId}&remark=${removeRemark.remark}`;

    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 200 || response.responseCode == 0) {
          this.assignRemoveInventorysubmitted = false;
          this.approveRemoveInventoryForm.reset();
          if (response.dataList != null) {
            this.approveRemoveInventoryData = response.dataList;
            this.approveRemove = true;
          } else {
            $("#approveRemoveInventoryOpenModel").modal("hide");
          }

          this.messageService.add({
            severity: "success",
            summary: "success",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          this.getCustomerAssignedList();
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
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

  //Workflow Function for Reject Remove Inventory
  rejectRemoveInventoryOpen(inventory: { id: any; inOutWardMACMapping: { id: any; }[]; }, nextApproverId: any) {
    this.rejectRemove = false;
    this.selectRemoveInventoryRejectStaff = null;
    this.rejectRemoveInventoryData = [];
    $("#rejectRemoveInventoryOpenModel").modal("show");
    this.rejectRemoveInventoryForm.reset();
    // this.assignRemoveInventoryId = mappingId;
    this.assignRemoveInventoryId = inventory.id;
    this.macMappingId = inventory.inOutWardMACMapping[0].id;
    this.custInventoryId = inventory.id;
    this.nextApproverId = nextApproverId;
    // this.rejectAssignInventoryForm.reset();
    this.rejectRemoveInventorySubmitted = false;
  }
  clearassignRemoveToStaff() {
    this.rejectRemoveInventoryForm.reset();
  }

  // Get Customer Inventory Mapping Details
  getCustomerInventoryMappingDetails(itemId: any, custinventoryid: any) {
    const url = `/item/getItemDetails?&itemId=${itemId}&custinventoryid=${custinventoryid}`;

    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.itemDetailData = response.data;
          if (this.itemDetailData.refundFlag == true) {
            if (
              this.itemDetailData.warranty == "InWarranty" ||
              this.itemDetailData.warranty == "Expired"
            ) {
              this.actualProductPrice = this.itemDetailData.productRefundAmount;
              this.newProductPrice = this.itemDetailData.productRefundAmount;
              $("#refundAmountModal").modal("show");
            } else {
              this.acceptRemoveItem();
            }
          } else {
            this.acceptRemoveItem();
          }
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

  rejectRemoveInventory(): void {
    this.rejectRemoveInventorySubmitted = true;
    let mappingId = this.macMappingId;
    let custInventoryId = this.custInventoryId;
    // const ownershipFlag = this.ownershipForm.value;
    const removeRemark = this.rejectRemoveInventoryForm.value;
    let staffId = localStorage.getItem("userId");
    // const url = `/inwards/approveInventory?isApproveRequest=true&customerInventoryMappingId=${id}`;
    const url = `/inoutWardMacMapping/removeInventory?&macMappingId=${mappingId}&customerInventoryId=${custInventoryId}&customerId=${this.custData.id}&isApprove=false&nextstaff=${staffId}&remark=${removeRemark.remark}`;

    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 200 || response.responseCode == 0) {
          this.rejectRemoveInventorySubmitted = false;
          this.rejectRemoveInventoryForm.reset();
          if (response.dataList != null) {
            this.rejectRemoveInventoryData = response.dataList;
            this.rejectRemove = true;
          } else {
            $("#rejectRemoveInventoryOpenModel").modal("hide");
          }

          this.messageService.add({
            severity: "success",
            summary: "success",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          this.getCustomerAssignedList();
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
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

  // rejectRemoveInventory(): void {
  //   let mappingId = this.macMappingId;
  //   let custInventoryId = this.custInventoryId;
  //   // let ownershipFlag = this.ownershipFlag;
  //   const removeRemark = this.rejectRemoveInventoryForm.value;
  //   let staffId = localStorage.getItem("userId");
  //   //const url = `/inwards/approveInventory?isApproveRequest=false&customerInventoryMappingId=${id}`;
  //   const url = `/inoutWardMacMapping/removeInventory?&macMappingId=${mappingId}&customerInventoryId=${custInventoryId}&customerId=${this.custData.id}&isApprove=false&nextstaff=${staffId}&remark=${removeRemark.remark}`;
  //
  //   this.customerInventoryManagementService.getMethod(url).subscribe(
  //     (response: any) => {
  //       if (response.responseCode == 200 || response.responseCode == 0) {
  //         this.rejectRemoveInventorySubmitted = false;
  //         this.rejectRemoveInventoryForm.reset();
  //         if (response.dataList != null) {
  //           this.rejectRemoveInventoryData = response.dataList;
  //           this.rejectRemove = true;
  //         } else {
  //           $("#rejectRemoveInventoryOpenModel").modal("hide");
  //           this.getCustomerAssignedList();
  //         }
  //         this.messageService.add({
  //           severity: "success",
  //           summary: "success",
  //           detail: response.responseMessage,
  //           icon: "far fa-times-circle",
  //         });
  //
  //       } else {
  //
  //         this.messageService.add({
  //           severity: "error",
  //           summary: "Error",
  //           detail: response.responseMessage,
  //           icon: "far fa-times-circle",
  //         });
  //       }
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

  assignRemoveInventoryToStaff(flag: boolean) {
    let url: any;
    if (flag == true) {
      if (this.selectRemoveInventoryApproveStaff) {
        url = `/inwards/assignFromStaffList?entityId=${
          this.assignRemoveInventoryId
        }&eventName=${"CUSTOMER_INVENTORY_ASSIGN"}&nextAssignStaff=${
          this.selectRemoveInventoryApproveStaff
        }&isApproveRequest=${flag}&isAssignPairItem=false`;
      } else {
        url = `/teamHierarchy/assignEveryStaff?entityId=${
          this.assignRemoveInventoryId
        }&eventName=${"CUSTOMER_INVENTORY_ASSIGN"}&isApproveRequest=${flag}`;
      }
    } else {
      if (this.selectRemoveInventoryRejectStaff) {
        url = `/inwards/assignFromStaffList?entityId=${
          this.assignRemoveInventoryId
        }&eventName=${"CUSTOMER_INVENTORY_ASSIGN"}&nextAssignStaff=${
          this.selectRemoveInventoryRejectStaff
        }&isApproveRequest=${flag}&isAssignPairItem=false`;
      } else {
        url = `/teamHierarchy/assignEveryStaff?entityId=${
          this.assignRemoveInventoryId
        }&eventName=${"CUSTOMER_INVENTORY_ASSIGN"}&isApproveRequest=${flag}`;
      }
    }

    this.customerInventoryManagementService.getMethod(url).subscribe(
      response => {
        $("#approveRemoveInventoryOpenModel").modal("hide");
        $("#rejectRemoveInventoryOpenModel").modal("hide");
        this.getCustomerAssignedList();
        console.log(response);
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

  isDisableRemove(inventory: { connectionNo: any; }) {
    var service = this.serviceList.find(item => item.connection_no == inventory.connectionNo);
    if (
      service != null &&
      (service.custPlanStatus.toLowerCase() === "inactive" ||
        service.custPlanStatus.toLowerCase() === "disable" ||
        service.custPlanStatus.toLowerCase() === "suspend" ||
        service.custPlanStatus.toLowerCase() === "stop" ||
        service.custPlanStatus.toLowerCase() === "terminate")
    ) {
      return false;
    } else return true;
  }

  isDisableReplace(inventory: { connectionNo: any; }) {
    var service = this.serviceList.find(item => item.connection_no == inventory.connectionNo);
    if (
      service != null &&
      (service.custPlanStatus.toLowerCase() === "active" ||
        service.custPlanStatus.toLowerCase() === "ingrace")
    ) {
      return false;
    } else return true;
  }

  isDisableReactiveBox(inventory: { connectionNo: any; }) {
    var service = this.serviceList.find(item => item.connection_no == inventory.connectionNo);
    if (
      service != null &&
      (service.custPlanStatus.toLowerCase() === "active" ||
        service.custPlanStatus.toLowerCase() === "ingrace")
    ) {
      return false;
    } else return true;
  }
  onChildSerChange(value: any) {
    this.filtteredChildConnection1 = this.masterChildConnections.filter(
      (      item: { connectionNo: any; }) => item.connectionNo != value
    );
  }

  onChildSerChange1(value: any) {
    this.filtteredChildConnection = this.masterChildConnections.filter(
      (      item: { connectionNo: any; }) => item.connectionNo != value
    );
  }

  selectedStaff: any = [];
  selectStaffType = "";
  staffSelectList: any = [];

  modalOpenSelectStaff(type: string) {
    this.showSelectStaffModel = true;
    this.parentCustomerDialogType = type;
    this.selectedStaff = [];
    this.selectStaffType = type;
  }

  closeSelectStaff() {
    this.showSelectStaffModel = false;
  }

  selectedStaffChange(event: any) {
    this.showSelectStaffModel = false;
    let data = event;
    this.staffSelectList.push({
      id: Number(data.id),
      name: data.firstname
    });

    if (this.selectStaffType == "inventoryAssign") {
      this.inventoryAssignForm.patchValue({
        paymentOwnerId: data.id
      });
    } else if (this.selectStaffType == "planInventoryAssign") {
      this.planInventoryAssignForm.patchValue({
        paymentOwnerId: data.id
      });
    }
  }

  removePlanSelectStaff() {
    this.staffSelectList = [];
    this.planInventoryAssignForm.get("paymentOwnerId").reset();
  }
  removeOtherSelectStaff() {
    this.staffSelectList = [];
    this.inventoryAssignForm.get("paymentOwnerId").reset();
  }

  editProductParams(inventory: any) {
    this.inventorySpecificationParamModal = true;
    this.productData = inventory;
  }

  closeInventorySpecModel() {
    this.inventorySpecificationParamModal = false;
  }

  reActivate(inventory: { customerId: any; custServiceMapId: any; }) {
    const url = `/reactivateService?custId=${inventory.customerId}&custServiceId=${inventory.custServiceMapId}`;
    let data = {};
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          if (response.data) {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: "Re-activate Sucessfully",
              icon: "far fa-check-circle"
            });
          } else {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Something went wrong!!!",
              icon: "far fa-times-circle"
            });
          }
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
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

  viewSpecificationParameters(id: any, data: any) {
    this.inventorySpecificationDetailModal = true;
  }

  closeInventorySpecificationDetailModal() {
    this.inventorySpecificationDetailModal = false;
  }

  isEditing(rowIndex: number): boolean {
    return rowIndex === this.editedRowIndex;
  }

  editValue(rowIndex: number) {
    this.editedRowIndex = rowIndex;
  }

  addOrEditValue(rowIndex: number, id: any, newValue: string, param: any) {
    if (this.editedRowIndex !== -1) {
      this.editedRowIndex = -1;
    } else {
      this.inventorySpecificationDetails.push({
        paramName: "",
        isMandatory: false,
        paramValue: newValue,
        isMultiValueParam: param.isMultiValueParam,
        multiValue: param.multiValue
      });
    }
  }

  addSpecificationParamDetails(product: any) {
    this.inventorySpecificationDetails = [];
    this.inwardService.getByItemId(product.itemId).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.specDetailsShow = true;
          this.inventorySpecificationDetails = response.dataList;

          this.inventorySpecificationDetails.map(item => {
            if (item.isMultiValueParam) {
              item.multiValue = item.paramMultiValues.map((value: any) => ({
                label: value,
                value: value
              }));
            }
            return item;
          });
        }
        this.spinner.hide();
      },
      (error: any) => {
        this.spinner.hide();
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
    let maxValue: number = Number(this.actualProductPrice);

    const inputElement = event.target as HTMLInputElement;
    if (
      event.keyCode === 8 ||
      (event.key >= "0" && event.key <= "9") ||
      (event.key === "." && inputElement.value.indexOf(".") === -1) // Allow only one decimal point
    ) {
      if (parseFloat(inputElement.value + event.key) <= maxValue) {
        return true; // Allow the input
      } else {
        return false; // Prevent the input
      }
    } else {
      return false; // Prevent the input for other keys
    }
  }

  closeInventoryWorkflowModel() {
    $("#workflowInventoryModal").modal("hide");
    this.inventoryId = "";
    this.currentPageInventoryApproveProgress = 1;
  }

  uploadDocument(inventory: { id: any; }) {
    this.inventoryIdData = inventory.id;
    this.inventoryFileData = inventory;
    this.uploadDocForm.patchValue({
      file: ""
    });
    this.selectedFileUploadPreview = [];
    this.uploadDocumentId = true;
  }
  onFileChangeUpload(event: any): void {
    this.selectedFileUploadPreview = [];
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const files: FileList = inputElement.files;

      // Validate all files
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (
          file &&
          (file.type === "image/png" ||
            file.type === "image/jpg" ||
            file.type === "image/jpeg" ||
            file.type === "application/pdf")
        ) {
          this.selectedFileUploadPreview.push(file);
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: `Invalid file type: ${file?.name}. Must be png, jpg, jpeg, or pdf.`,
            icon: "far fa-check-circle"
          });
        }
      }

      if (this.selectedFileUploadPreview.length > 0) {
        // If valid files exist, patch the first file to the form
        this.multiFiles = this.createFileList(this.selectedFileUploadPreview);
        this.selectedFile = this.selectedFileUploadPreview[0];
        this.uploadDocForm.patchValue({
          file: this.multiFiles[0]
        });
      } else {
        // Reset form control and input if no valid files
        this.uploadDocForm.controls['file'].reset();
        inputElement.value = "";
      }
    }
  }

  deletUploadedFile(event: any) {
    var temp: File[] = this.selectedFileUploadPreview?.filter((item: File) => item?.name != event);
    this.selectedFileUploadPreview = temp;
    this.uploadDocForm.patchValue({
      file: temp
    });
  }

  closeUploadDocumentId() {
    this.uploadDocumentId = false;
    this.uploadDocForm.patchValue({
      file: ""
    });
    this.selectedFileUploadPreview = [];
  }

  uploadDocuments() {
    this.submitted = true;
    if (this.uploadDocForm.valid) {
      const formData = new FormData();
      let fileArray: FileList;
      if (this.uploadDocForm.controls['file']) {
        if (
          this.selectedFile.type != "image/png" &&
          this.selectedFile.type != "image/jpg" &&
          this.selectedFile.type != "image/jpeg" &&
          this.selectedFile.type != "application/pdf"
        ) {
          this.uploadDocForm.controls['file'].reset();
          // alert("File type must be png, jpg, jpeg or pdf");
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "File type must be png, jpg, jpeg or pdf",
            icon: "far fa-check-circle"
          });
        } else {
          fileArray = this.multiFiles;
          Array.from(fileArray).forEach(file => {
            formData.append("file", file);
          });
          // const file = this.uploadDocForm.controls.file;
          // this.uploadDocForm.patchValue({
          //     file: file
          // });
        }
      }
      let newFormData = Object.assign({}, this.inventoryFileData);
      formData.append("customerInventoryMappingList", JSON.stringify(newFormData));
      const url = `/inwards/inventory/document/upload/`;
      this.customerInventoryManagementService.postMethod(url, formData).subscribe(
        (response: any) => {
          if (response.responseCode === 406) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else if (response.responseCode === 417) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            // this.openTicketDetail(this.uploadDataTicketId);
            this.getCustomerAssignedList();
            this.submitted = false;
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            this.uploadDocumentId = false;
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

  downloadDocument(inventory: { id: any; }) {
    this.inventoryIdData = inventory.id;
    this.inventoryFileData = inventory;
    this.inventoryFileData.filenameList = this.inventoryFileData.filename.split(",");
    this.inventoryFileData.uniqueNamesList = this.inventoryFileData.uniquename.split(",");
    if (
      this.inventoryFileData.filenameList.length !== this.inventoryFileData.uniqueNamesList.length
    ) {
      console.error("The number of filenames and unique names do not match!");
      return;
    }
    this.inventoryFileData.fileDetails = [];

    this.inventoryFileData.filenameList.forEach((filename: string, index: string | number) => {
      const fileDetail = {
        filename: filename.trim(),
        uniquename: this.inventoryFileData.uniqueNamesList[index].trim()
      };

      this.inventoryFileData.fileDetails.push(fileDetail);
    });
    this.downloadDocumentId = true;
  }

  closeDownloadDocumentId() {
    this.downloadDocumentId = false;
    this.getCustomerAssignedList();
  }

  downloadDoc(fileName: string, inventoryId: any, uniquename: any) {
    this.customerInventoryManagementService.downloadFile(inventoryId, uniquename).subscribe(
      blob => {
        if (blob.status == 200) {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Download Successfully",
            icon: "far fa-check-circle"
          });
          // importedSaveAs(blob.body, fileName);
        } else if (blob.status == 404) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "File Not Found",
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Something went wrong!",
            icon: "far fa-times-circle"
          });
        }
        this.getCustomerAssignedList();
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

  deleteDoc(fileName: string, inventoryId: string, uniquename: string) {
    let urldoc =
      "/inwards/inventory/document/delete/" + inventoryId + "/" + fileName + "/" + uniquename;
    this.customerInventoryManagementService.deleteMethod(urldoc).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.responseMessage,
            icon: "far fa-check-circle"
          });
          this.closeDownloadDocumentId();
        } else if (response.responseCode == 404) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        }
        this.getCustomerAssignedList();
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

  showticketDocData(fileName: string, inventoryId: any, uniquename: any) {
    // console.log("data ", data?.filename.split(".")[data?.filename.split(".")?.length - 1]);
    // const url = `/case/document/download/${data.ticketId}/${data.docId}`;
    const fileType = fileName.split(".");
    this.customerInventoryManagementService.downloadFile(inventoryId, uniquename).subscribe(
      data => {
        if (data.status == 200) {
          // let type = "application/octet-stream"; // default type
          // const uint = new Uint8Array(data.body);
          // this.closeDownloadDocumentId();
          // const magic = uint.subarray(0, 4);
          // if (magic.every(b => b === 0xff)) {
          //     type = "image/jpeg";
          // } else if (magic[0] === 0x89 && magic[1] === 0x50 && magic[2] === 0x4e && magic[3] === 0x47) {
          //     type = "image/png";
          // } else if (magic[0] === 0x47 && magic[1] === 0x49 && magic[2] === 0x46 && magic[3] === 0x38) {
          //     type = "image/gif";
          // } else if (magic[0] === 0xd0 && magic[1] === 0xcf && magic[2] === 0x11 && magic[3] === 0xe0) {
          //     type = "application/vnd.ms-excel";
          // } else if (magic[0] === 0x25 && magic[1] === 0x50 && magic[2] === 0x44 && magic[3] === 0x46) {
          //     type = "application/pdf";
          // } else if (magic[0] === 0xd0 && magic[1] === 0xcf && magic[2] === 0x11 && magic[3] === 0xe0) {
          //     type = "application/msword";
          // }

          // if (fileType[fileType?.length - 1] == "pdf") {
          //     const blob = new Blob([data], { type: "application/pdf" });
          //     const blobUrl = URL.createObjectURL(blob);
          //     window.open(blobUrl, "_blank");
          // } else {
          //     const blob = new Blob([data], { type });
          //     const blobUrl = URL.createObjectURL(blob);
          //     this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
          //     this.documentPreview = true;
          // }
          let type = "application/octet-stream"; // Default type
          const uint = new Uint8Array(data.body);
          this.closeDownloadDocumentId(); // Close any previous downloads (if any)

          const magic = uint.subarray(0, 4); // Check the magic bytes to identify the file type

          if (magic.every(b => b === 0xff)) {
            type = "image/jpeg";
          } else if (
            magic[0] === 0x89 &&
            magic[1] === 0x50 &&
            magic[2] === 0x4e &&
            magic[3] === 0x47
          ) {
            type = "image/png";
          } else if (
            magic[0] === 0x47 &&
            magic[1] === 0x49 &&
            magic[2] === 0x46 &&
            magic[3] === 0x38
          ) {
            type = "image/gif";
          } else if (
            magic[0] === 0xd0 &&
            magic[1] === 0xcf &&
            magic[2] === 0x11 &&
            magic[3] === 0xe0
          ) {
            type = "application/vnd.ms-excel";
          } else if (
            magic[0] === 0x25 &&
            magic[1] === 0x50 &&
            magic[2] === 0x44 &&
            magic[3] === 0x46
          ) {
            type = "application/pdf";
          } else if (
            magic[0] === 0xd0 &&
            magic[1] === 0xcf &&
            magic[2] === 0x11 &&
            magic[3] === 0xe0
          ) {
            type = "application/msword";
          }

          if (fileType[fileType?.length - 1] === "pdf") {
            // If it's a PDF file, create a blob and open it in a new tab
            const blob = new Blob([data.body], { type: "application/pdf" });
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, "_blank"); // Open PDF in a new tab
          } else if (fileType[fileType?.length - 1] === "png") {
            // If it's a PNG image, create a blob URL and display it in an <img> tag
            const blob = new Blob([data.body], { type: "image/png" });
            const blobUrl = URL.createObjectURL(blob);
            this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl); // Trust the blob URL
            this.documentPreview = true; // Set flag to show the image preview
          } else {
            // For other types (e.g., JPEG, GIF), display as image preview
            const blob = new Blob([data.body], { type });
            const blobUrl = URL.createObjectURL(blob);
            this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl); // Trust the blob URL
            this.documentPreview = true; // Set flag to show the image preview
          }
        } else if (data.status == 404) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "File Not Found",
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Something went wrong!",
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

  closeDocumentPreview() {
    this.documentPreview = false;
  }
  createFileList(files: File[]): FileList {
    const dataTransfer = new DataTransfer();
    files.forEach(file => dataTransfer.items.add(file));
    return dataTransfer.files;
  }
}
