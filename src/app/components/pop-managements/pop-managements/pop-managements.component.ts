import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { PopManagementsService } from "src/app/service/pop-managements.service";
// import { Regex } from "src/app/constants/regex";
import { PopManagements } from "src/app/components/model/pop-managements";
import { ServiceAreaService } from "src/app/service/service-area.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import * as _ from "lodash";
// import { CommondropdownService } from "src/app/service/commondropdown.service";
// import { Data } from "@angular/router";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { InwardService } from "src/app/service/inward.service";
import { ProuctManagementService } from "src/app/service/prouct-management.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
declare var $: any;
import { COUNTRY, CITY, STATE, PINCODE, AREA, REGEX } from "src/app/RadiusUtils/RadiusConstants";
import { CustomerInventoryMappingService } from "src/app/service/customer-inventory-mapping.service";
// import { element } from "protractor";
import { Observable, Observer } from "rxjs";
import { CommondropdownService } from "src/app/service/commondropdown.service";
// import { log } from "console";
// import { DialogModule } from "primeng/dialog";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";
import { INVENTORYS } from "src/app/constants/aclConstants";

@Component({
    selector: "app-pop-managements",
    templateUrl: "./pop-managements.component.html",
    styleUrls: ["./pop-managements.component.css"],
    standalone: false
})
export class PopManagementsComponent implements OnInit {
close() {
throw new Error('Method not implemented.');
}
getAvailableQty(arg0: any) {
throw new Error('Method not implemented.');
}
getUnit($event: any) {
throw new Error('Method not implemented.');
}
  regex = REGEX;
  countryTitle = COUNTRY;
  cityTitle = CITY;
  stateTitle = STATE;
  pincodeTitle = PINCODE;
  areaTitle = AREA;
  @ViewChild("closebutton") closebutton:any;
  serviceAreaGroupForm: FormGroup;
  inventoryAssignForm: FormGroup;
  serviceAreaCategoryList: any;
  submitted: boolean = false;
  taxListData: any;
  createserviceAreaData: PopManagements;
  currentPageserviceAreaListdata = 1;
  serviceAreaListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  serviceAreaListdatatotalRecords: any;
  serviceAreaListData: any = [];
  assignedInventoryList:any[] = [];
  assignInventoryWithSerial: boolean;
  assignInventory: boolean;
  customerInventoryListDataTotalRecords: number;
  viewserviceAreaListData: any = [];
  serviceAreaList: any = [];
  isserviceAreaEdit: boolean = false;
  serviceAreatype = "";
  serviceAreacategory = "";
  searchserviceAreaUrl: any;
  assignInwardID: any;
  showSearchBar: boolean = true;
  assignInwardForm: FormGroup;
  rejectInwardForm: FormGroup;
  assignInwardSubmitted: boolean = false;
  rejectInwardSubmitted: boolean = false;
  MACAssignModalOutward: boolean = false;
  serviceData: any;
  qosPolicyData: any;
  quotaData: any;
  quotaTypeData: any;
  areaNameCategoryList: any;
  isPlanEdit: boolean = false;
  viewPlanListData: any;
  listView: boolean = true;
  detailView: boolean = false;
  createView: boolean = false;
  customerrMyInventoryView: boolean = false;
  areaIdFromArray: FormArray;
  areaNameitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  areaNametotalRecords: String;
  currentPageareaName = 1;
  selectvalue = "";
  unit: any;
  products:any[] = [];
  replaceProducts:any[] = [];
  temp:any[] = [];
  serviceAreaListData1: any;
  serviceAreaListDataselector: any;
  serviceAreaRulelength = 0;
  inwardId: any;
  searchData: any;
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
  userId: number = +localStorage.getItem("userId");
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any = 5;
  searchkey: string;
  totalAreaListLength = 0;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  assignInventoryModal: boolean;
  serviceAreaId: any;
  popId: any;
  macList: any[] = [];
  showQtySelectionError: boolean;
  showQtyError: boolean;
  customerInventoryListDataCurrentPage = 1;
  customerInventoryListItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
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
  selectedMACAddress:any[] = [];
  inwardList: any[];
  approveId: any;
  approved = false;
  reject = false;
  showReplacementForm = false;
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
  status = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
  ];
  statusOptions = RadiusConstants.status;
  AclClassConstants;
  AclConstants;
  areaListData: any;
  public loginService: LoginService;
  viewPopDetails: any;
  pincodeListData: any;
  inventoryPopData: any = "";
  inventoryType: any = "pop";
  ifServiceAreaListShow: boolean;
  ifPersonalPerentDeviceShow: boolean;
  IfPersonalNetworkDataShow: boolean;
  wareHouseFormGroup: FormGroup;
  searchWarehouseName: any = "";
  editMode: boolean;
  editAccess: boolean = false;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  openInventoryAccess: boolean = false;
  assignInventoryAccess: boolean = false;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    // public commondropdownService: CommondropdownService,
    private messageService: MessageService,
    private PopManagementsService: PopManagementsService,
    public KeyannaCommonBaseService: KeyannaCommonBaseService,
    private customerInventoryMappingService: CustomerInventoryMappingService,
    loginService: LoginService,
    private serviceAreaService: ServiceAreaService,
    private commondropdownService: CommondropdownService,

    private inwardService: InwardService,
    private productService: ProuctManagementService,
    private customerManagementService: CustomermanagementService
  ) {
    this.createAccess = loginService.hasPermission(INVENTORYS.POP_CREATE);
    this.deleteAccess = loginService.hasPermission(INVENTORYS.POP_DELETE);
    this.editAccess = loginService.hasPermission(INVENTORYS.POP_EDIT);
    this.openInventoryAccess = loginService.hasPermission(INVENTORYS.POP_INVEN_LIST);
    this.assignInventoryAccess = loginService.hasPermission(
      INVENTORYS.POP_INVEN_LIST_ASSIGN_INVENTORY
    );
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    // this.isserviceAreaEdit = !this.createAccess && this.editAccess ? true : false;

    this.getServiceArea();
    this.availableQty = 0;
    this.inventoryAssignForm = this.fb.group({
      id: [""],
      qty: ["", Validators.required],
      productId: ["", Validators.required],
      ownerId: [this.popId],
      ownerType: ["Pop"],
      // customerId: [this.customerId],
      staffId: [""],
      inwardId: ["", Validators.required],
      assignedDateTime: [new Date(), Validators.required],
      status: ["", Validators.required],
      mvnoId: [""],
    });

    //this.availableQty = 0;
  }

  ngOnInit(): void {
    this.serviceAreaGroupForm = this.fb.group({
      id: [""],
      name: ["", Validators.required],
      createdById: [""],
      lastModifiedById: [""],
      serviceAreaIdsList: ["", Validators.required],
      status: ["", Validators.required],
      isDeleted: [0],
      latitude: ["", Validators.required],
      longitude: ["", Validators.required],
      popCode: [""],
    });
    // this.PopManagementsService.getAllNBAndNAProducts().subscribe((res: any) => {
    //   this.products = res.dataList;
    // });
    this.assignInwardForm = this.fb.group({
      remark: ["", Validators.required],
    });
    this.rejectInwardForm = this.fb.group({
      remark: ["", Validators.required],
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
    this.serviceAreaList.forEach((element:any) => {
      if (element.id) {
        element.flag = false;
      }
    });
    // this.searchData = {
    //   currentPageNumber: this.currentPageserviceAreaListdata,
    //   dataList: [{}],
    // }
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
      //page: '',
      // pageSize: '',
    };
    this.getAreaList();
    this.getserviceAreaList("");
    // this.getServiceList();

    // const serviceArea = localStorage.getItem("serviceArea");
    // let serviceAreaArray =JSON.parse(serviceArea);
    // if (serviceAreaArray.length !== 0) {
    //   this.commondropdownService.filterserviceAreaList();
    // } else {
    //   this.commondropdownService.getserviceAreaList();
    // }

    this.searchLocationForm = this.fb.group({
      searchLocationname: ["", Validators.required],
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
  }

  selectActionChange(_event: any) {
    // this.commonservice.addLoader();

    this.selectvalue = _event.value;
    console.log(this.selectvalue);
  }

  createPop() {
    this.showSearchBar = false;
    this.editMode = false;
    this.listView = false;
    this.detailView = false;
    this.createView = true;
    this.customerrMyInventoryView = false;
    this.serviceAreaGroupForm.reset();
    this.isserviceAreaEdit = false;
    this.viewserviceAreaListData = [];
    this.getserviceAreaList("");
    this.searchName = "";
    this.submitted = false;
    this.serviceAreaList.forEach((element:any) => {
      if (element.id) {
        element.flag = false;
      }
    });
  }

  clearPop() {
    this.showSearchBar = true;
    this.listView = true;
    this.detailView = false;
    this.createView = false;
    this.customerrMyInventoryView = false;
    this.searchWarehouseName = "";
    this.searchkey = "";
    // this.getWareHouseList("");
    // this.getAllParantServiceArea();
    // this.wareHouseFormGroup.reset();
    // this.serviceAreaList.forEach(element => {
    //   if (element.id) {
    //     element.flag = false;
    //   }
    // });
  }

  getAreaList() {
    const url = "/popmanagement/all";
    this.PopManagementsService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.areaListData = response.dataList;
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
  // getServiceList() {
  //   const url = "/serviceArea/all";
  //   this.ServiceAreaService.getMethod(url).subscribe(
  //     (response: any) => {
  //       this.pincodeListData = response.dataList;
  //       console.log(this.pincodeListData);

  //
  //     },
  //     (error: any) => {
  //       console.log(error, "error");
  //       this.messageService.add({
  //         severity: "error",
  //         summary: "Error",
  //         detail: error.error.ERROR,
  //         icon: "far fa-times-circle",
  //       });
  //
  //     }
  //   );
  // }

  getPopDetails(id:any) {
    const url = "/popmanagement/" + id;
    this.PopManagementsService.getMethod(url).subscribe(
      (res: any) => {
        this.viewPopDetails = res.data;
        this.listView = false;
        this.createView = false;
        this.detailView = true;
        console.log(" this.viewPopDetails", this.viewPopDetails);
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

  popList() {
    this.listView = true;
    this.createView = false;
    this.detailView = false;
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
      size = this.serviceAreaListdataitemsPerPage;
    }
    const url = "/popmanagement";
    let servicearedata = {
      page: page_list,
      pageSize: size,
    };
    this.PopManagementsService.postMethod(url, servicearedata).subscribe(
      (response: any) => {
        this.serviceAreaListData = response.dataList;
        this.serviceAreaListDataselector = response.dataList;
        this.serviceAreaListdatatotalRecords = response.totalRecords;
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

  NetworkDeatilsClear() {
    this.ifPersonalPerentDeviceShow = false;
    this.IfPersonalNetworkDataShow = false;
    this.ifServiceAreaListShow = false;
  }

  serviceareListShow() {
    this.MACAssignModalOutward = true;
    this.ifServiceAreaListShow = true;
  }
  closeMACAssignModalOutward() {
    this.MACAssignModalOutward = false;
  }

  personalNetworkData() {
    this.ifPersonalPerentDeviceShow = false;
    this.IfPersonalNetworkDataShow = true;
    this.ifServiceAreaListShow = false;
  }
  addEditserviceArea(id:any) {
    this.serviceAreaList.forEach((element:any) => {
      if (element.id) {
        element.flag = false;
      }
    });
    this.submitted = true;
    this.editMode = false;
    this.createView = false;
    this.listView = true;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    if (this.serviceAreaGroupForm.valid) {
      if (id) {
        const url = "/popmanagement/update";

        this.createserviceAreaData = this.serviceAreaGroupForm.value;
        this.createserviceAreaData.isDeleted = false;
        console.log("this.createserviceAreaData", this.createserviceAreaData);
        this.PopManagementsService.postMethod(url, this.createserviceAreaData).subscribe(
          (response: any) => {
            if (response.responseCode == 406) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: response.responseMessage,
                icon: "far fa-times-circle",
              });
            } else {
              this.serviceAreaGroupForm.reset();
              this.isserviceAreaEdit = false;
              this.viewserviceAreaListData = [];
              this.PopManagementsService.clearCache("/popmanagement/all");
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle",
              });
              this.getserviceAreaList("");
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
      } else {
        const url = "/popmanagement/save";

        this.createserviceAreaData = this.serviceAreaGroupForm.value;
        this.createserviceAreaData.isDeleted = false;
        this.createserviceAreaData.mvnoId = JSON.parse(localStorage.getItem("mvnoId"));
        console.log("this.createserviceAreaData", this.createserviceAreaData);
        this.PopManagementsService.postMethod(url, this.createserviceAreaData).subscribe(
          (response: any) => {
            if (response.responseCode == 406) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: response.responseMessage,
                icon: "far fa-times-circle",
              });
            } else {
              this.submitted = false;
              this.serviceAreaGroupForm.reset();
              this.PopManagementsService.clearCache("/popmanagement/all");
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle",
              });
              this.getserviceAreaList("");
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
    this.showSearchBar = true;
  }

  editPop(id: any) {
    this.editMode = true;
    this.listView = false;
    this.detailView = false;
    this.createView = true;
    this.submitted = false;

    if (id) {
      this.customerrMyInventoryView = false;
      this.assignInventoryWithSerial = false;
      const url = "/popmanagement/" + id;
      this.popId = id;
      this.PopManagementsService.getMethod(url).subscribe(
        (response: any) => {
          this.isserviceAreaEdit = true;
          this.viewserviceAreaListData = response.data;
          this.serviceAreaGroupForm.patchValue(this.viewserviceAreaListData);

          let serviceAreaId = this.viewserviceAreaListData.serviceAreaIdsList;
          // for (let k = 0; k < this.viewserviceAreaListData.serviceAreaNameList.length; k++) {
          //   serviceAreaId.push(this.viewserviceAreaListData.serviceAreaNameList[k].id);
          // }
          this.serviceAreaList.forEach((element:any) => {
            this.viewserviceAreaListData.serviceAreaIdsList.forEach((e:any) => {
              if (e.id) {
                if (element.id == e.id) {
                  element.flag = true;
                }
              } else {
                if (element.id == e) {
                  element.flag = true;
                }
              }
            });
          });
          this.serviceAreaGroupForm.patchValue({
            serviceAreaIdsList: serviceAreaId,
          });
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

  deleteConfirmPop(id: number) {
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
    if (id) {
      this.confirmationService.confirm({
        message: "Do you want to delete this POP?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteserviceArea(id);
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

  deleteserviceArea(data:any) {
    let popdata = {
      id: data.id,
      createdById: data.createdById,
      createdByName: data.createdByName,
      createdate: data.createdate,
      lastModifiedById: data.lastModifiedById,
      lastModifiedByName: data.lastModifiedByName,
      updatedate: data.updatedate,
      latitude: data.latitude,
      popCode: data.popCode,
      longitude: data.longitude,
      name: data.name,
      status: data.status,
      mvnoId: data.mvnoId,
    };

    const url = "/popmanagement/delete";
    this.PopManagementsService.postMethod(url, popdata).subscribe(
      (response: any) => {
        if (this.currentPageserviceAreaListdata != 1 && this.totalAreaListLength == 1) {
          this.currentPageserviceAreaListdata = this.currentPageserviceAreaListdata - 1;
        }
        if (response.responseCode == 405) {
          this.messageService.add({
            severity: "info",
            summary: "info",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        } else if (response.responseCode == 406) {
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
        this.submitted = false;
        this.serviceAreaGroupForm.reset();
        this.isserviceAreaEdit = false;
        this.viewserviceAreaListData = [];
        this.getserviceAreaList("");
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

  pageChangedserviceAreaList(pageNumber:any): void {
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
    this.customerrMyInventoryView = false;
    this.listView = true;
    this.createView = false;

    if (!this.searchkey || this.searchkey !== this.searchName) {
      this.currentPageserviceAreaListdata = 1;
    }
    this.searchkey = this.searchName;
    if (this.showItemPerPage) {
      this.serviceAreaListdataitemsPerPage = this.showItemPerPage;
    }
    this.searchData.filter[0].filterValue = this.searchName.trim();
    const page = {
      page: this.currentPageserviceAreaListdata,
      pageSize: this.serviceAreaListdataitemsPerPage,
    };
    this.PopManagementsService.searchPop(page, this.searchData).subscribe(
      (response: any) => {
        if (response.responseCode == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
          this.serviceAreaListData = [];
          this.serviceAreaListdatatotalRecords = 0;
        } else {
          this.serviceAreaListData = response.dataList;
          this.serviceAreaListdatatotalRecords = response.totalRecords;
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
    this.listView = true;
    this.detailView = false;
    this.createView = false;
    this.customerrMyInventoryView = false;
    this.serviceAreaGroupForm.reset();
    this.isserviceAreaEdit = false;
    this.viewserviceAreaListData = [];
    this.getserviceAreaList("");
    this.searchName = "";
    this.submitted = false;
    this.serviceAreaList.forEach((element:any) => {
      if (element.id) {
        element.flag = false;
      }
    });
  }

  getSAData() {
    this.listView = true;
    this.detailView = false;
    this.createView = false;
    this.customerrMyInventoryView = false;
    this.assignInventoryWithSerial = false;
  }

  customerDetailOpen() {
    this.listView = true;
    this.detailView = false;
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
            longitude: position.coords.longitude,
          });
          this.iflocationFill = true;
        }
      });
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Geolocation is not supported by this browser.",
        icon: "far fa-times-circle",
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
      this.KeyannaCommonBaseService.get(url).subscribe(
        (response: any) => {
          this.searchLocationData = response.locations;
        },
        (error: any) => {
          if (error.error.code == 422) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.error,
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
    this.KeyannaCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.ifsearchLocationModal = false;
        this.serviceAreaGroupForm.patchValue({
          latitude: response.location.latitude,
          longitude: response.location.longitude,
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
          icon: "far fa-times-circle",
        });
      }
    );
  }

  clearsearchLocationData() {
    this.searchLocationData = [];
    this.ifsearchLocationModal = false;
    this.searchLocationForm.reset();
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

  pageChangedMasterListI(pageNumber:any) {
    this.currentPageMasterSlabI = pageNumber;
  }

  getMacMappingsByInwardId(id:any): void {
    this.macList = [];
    this.inwardService.getAllMACMappingByInwardId(id).subscribe((res: any) => {
      this.macList = res.dataList;
      this.availableQty = res.dataList.length;
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

  saveMACMappingWithCustomer(mappingId:any) {
    if (this.selectedMACAddress.length > 0) {
      const mappingList = this.macList.filter(val => this.selectedMACAddress.includes(val));
      mappingList.forEach(element => {
        element.customerId = this.customerId;
        element.custInventoryMappingId = mappingId;
      });

      this.inwardService.updateMACMappingList(mappingList).subscribe(
        (res: any) => {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Assigend inventory successfully.",
            icon: "far fa-check-circle",
          });
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

  openMyInventory(data:any): void {
    this.inventoryPopData = data;
    this.popId = data.id;
    this.listView = false;
    this.detailView = false;
    this.createView = false;
    this.customerrMyInventoryView = true;
    //this.getCustomerAssignedList(data.id);
    this.assignInventoryCustomerId = data.id;
    this.assignInventoryWithSerial = false;
  }

  statusApporevedRejected(status:any, statusid:any) {
    this.approveId = statusid;
    if (status == "Approve") {
      this.approved = false;
      this.approveInventoryData = [];
      this.selectStaff = null;
    } else {
      this.reject = false;
      this.selectStaffReject = null;
      this.rejectInventoryData = [];
    }
    const data = {
      id: statusid,
      status,
    };

    const url = "/changeStatusCustomerApprove/" + statusid + "?status=" + status;
    this.PopManagementsService.updateMethod(url, data).subscribe(
      (response: any) => {
        if (status == "Approve") {
          if (response.result) {
            this.approved = true;
            this.approveInventoryData = response.result;
            $("#assignCustomerInventoryModal").modal("show");
          } else {
            this.getapproveStatusList("");
          }
        } else {
          if (response.result) {
            this.reject = true;
            this.rejectInventoryData = response.result;
            $("#rejectCustomerInventoryModal").modal("show");
          } else {
            this.getapproveStatusList("");
          }
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

  pageChangedEventCustomerAssignInventoryDetails(pageNumber:any): void {
    this.customerInventoryDetailsListDataCurrentPage = pageNumber;
    this.getCustomerAssignedList(this.assignInventoryCustomerId);
  }

  totalItemsEventCustomerAssignInventoryDetails(event:any): void {
    this.customerInventoryDetailsListItemsPerPage = Number(event.value);
    this.getCustomerAssignedList(this.assignInventoryCustomerId);
  }

  replaceInventorySubmit(): void {
    const mappingList: any[] = this.macList.filter(val => this.selectedMACAddress.includes(val));
    if (mappingList.length < 1) {
      this.messageService.add({
        severity: "info",
        summary: "Information",
        detail: "Please select at least/only one product for replacement.",
        icon: "far fa-check-circle",
      });
      return;
    } else {
      const url = `/inwards/replaceInventoryFromEndOwner?oldMacMappingId=${this.oldMacMappingId}&newMacMappingId=${mappingList[0].id}`;
      this.PopManagementsService.getMethod(url).subscribe(
        (res: any) => {
          this.assignedInventoryListWithSerial = [];
          this.getCustomerAssignedList(this.assignInventoryCustomerId);
          this.assignInventoryWithSerial = false;

          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Assigned inventory successfully.",
            icon: "far fa-check-circle",
          });
        },
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Error",
            icon: "far fa-check-circle",
          });
        }
      );
    }
  }

  deleteOldMACMapping(id:any): void {
    const url = `/inoutWardMacMapping/removeMappingWithCustomerInventory?mappingId=${id}`;
    this.PopManagementsService.getMethod(url).subscribe(
      (res: any) => {
        this.assignInventoryWithSerial = false;

        this.messageService.add({
          severity: "success",
          summary: "success",
          detail: "Replaced Successfully.",
          icon: "far fa-times-circle",
        });
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

  getCustomerAssignedList(id:any): void {
    const data = {
      filters: [
        {
          filterValue: this.popId,
          // filterValue: id,
          filterColumn: "pop",
        },
      ],
      page: 1,
      pageSize: 5,
      sortBy: "createdate",
      sortOrder: 0,
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
          icon: "far fa-times-circle",
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

    this.PopManagementsService.getMethod(url).subscribe(
      (response: any) => {
        this.replaceProducts = response.dataList;
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

    this.PopManagementsService.getMethod(url).subscribe(
      response => {
        if (flag) {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Approved Successfully.",
            icon: "far fa-times-circle",
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Rejected Successfully.",
            icon: "far fa-times-circle",
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
          icon: "far fa-times-circle",
        });
      }
    );
  }

  MastertotalRecordsI: any;
  checkStatus(id:any, status:any): void {
    if (status === "Pending") {
      this.messageService.add({
        severity: "info",
        summary: "info",
        detail: "Assigned product is not eligible for replace.",
        icon: "far fa-times-circle",
      });
      return;
    }
    const url = `/teamHierarchy/getApprovalProgress?entityId=${id}&eventName=CUSTOMER_INVENTORY_ASSIGN`;

    this.PopManagementsService.getMethod(url).subscribe(
      (res: any) => {
        this.inventoryStatusDetails = res.dataList;
        // this.inventoryStatusView = true;
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
      pageSize: this.MasteritemsPerPageI,
    };

    let url1 = "/workflowaudit/list?entityId=" + id + "&eventName=" + "CUSTOMER_INVENTORY_ASSIGN";

    this.PopManagementsService.postMethod(url1, data).subscribe(
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

    this.PopManagementsService.getMethod(url).subscribe(
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
          icon: "far fa-times-circle",
        });
      }
    );
  }

  checkStatusForRepalce(id:any): void {
    const url = `/teamHierarchy/getApprovalProgress?entityId=${id}&eventName=CUSTOMER_INVENTORY_ASSIGN`;

    this.PopManagementsService.getMethod(url).subscribe(
      (res: any) => {
        this.inventoryStatusDetailsForReplace = res.dataList;
        // this.inventoryStatusView = true;
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
  rejectInventoryReplaceInventory(id:any): void {
    this.approveId = id;
    this.reject = false;
    this.selectStaffReject = null;
    this.rejectInventoryData = [];
    let bool: boolean;
    if (status !== "PENDING") {
      bool = true;
    }
    const url = `/inwards/approveReplaceInventory?isApproveRequest='false'&macMappingId=${id}&billAble=${bool}`;

    this.PopManagementsService.getMethod(url).subscribe(
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
          icon: "far fa-times-circle",
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
    this.PopManagementsService.getMethod(url).subscribe(
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
          icon: "far fa-times-circle",
        });
      }
    );
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
          },
        });
        return false;
      });
    }
  }
}
