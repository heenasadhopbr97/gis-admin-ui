import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomerService } from "src/app/service/customer.service";
import { StaffService } from "src/app/service/staff.service";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";
import { NetworkdeviceService } from "src/app/service/networkdevice.service";

declare var $: any;

@Component({
    selector: "app-select-device",
    templateUrl: "./select-device.component.html",
    styleUrls: ["./select-device.component.css"],
    standalone: false
})
export class SelectDeviceComponent implements OnInit {
  @Input() selectedDevice: any = [];
  @Input() selectedDeviceId: any = [];
  @Output() selectedDeviceChange = new EventEmitter();
  @Output() modalCloseParentDevice = new EventEmitter();
  @Input() deviceType: any;
  newFirst = 0;

  networkDeviceListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  parentstaffListdatatotalRecords: any;
  currentPagenetworkDeviceListdata = 1;

  searchDeatil = "";
  staffData: any[] = [];
  isparentChildDeviceModelOpen: boolean = false;
  searchDeviceType: any = "";
  networkDeviceData: any = [];
  networkDeviceListData: any = [];
  networkDeviceListDataselector: any;
  networkDeviceListdatatotalRecords: any;

  constructor(
    public confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    private messageService: MessageService,
    public keyannaCommonBaseService: KeyannaCommonBaseService,
    private networkdeviceService: NetworkdeviceService
  ) {}

  ngOnInit(): void {
    this.newFirst = 0;
    this.getnetworkDeviceList("");
    this.commonGenericData();
    this.isparentChildDeviceModelOpen = true;
  }

  getnetworkDeviceList(list:any) {
    let size;
    let page_list = this.currentPagenetworkDeviceListdata;
    if (list) {
      size = list;
      this.networkDeviceListdataitemsPerPage = list;
    } else {
      size = this.networkDeviceListdataitemsPerPage;
    }

    const url = "/NetworkDevice/list";
    let networkdevicedata = {
      page: page_list,
      pageSize: size,
    };
    this.networkdeviceService.postMethod(url, networkdevicedata).subscribe(
      (response: any) => {
        this.networkDeviceListData = response.dataList;
        this.networkDeviceListDataselector = response.dataList;
        this.networkDeviceListdatatotalRecords = response.totalRecords;
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

  paginateStaff(event:any) {
    this.currentPagenetworkDeviceListdata = event.page + 1;
    this.newFirst = event.first;
    this.networkDeviceListdataitemsPerPage = event.rows;
    if (!this.searchDeviceType) {
      this.getnetworkDeviceList("");
    } else {
      this.searchnetworkDevice();
    }
  }

  clearSearchnetworkDevice() {
    this.searchDeatil = "";
    this.currentPagenetworkDeviceListdata = 1;
    this.newFirst = 1;
    this.searchDeviceType = "";
    this.networkDeviceListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
    this.getnetworkDeviceList("");
  }

  saveSelstaff() {
    this.selectedDeviceChange.emit(this.selectedDevice);
    this.modalCloseStaff();
  }

  modalCloseStaff() {
    this.isparentChildDeviceModelOpen = false;
    this.modalCloseParentDevice.emit();
    this.currentPagenetworkDeviceListdata = 1;
    this.newFirst = 1;
    this.searchDeatil = "";
    this.staffData = [];
  }

  commonGenericData() {
    const url = "/commonList/generic/networkDeviceType";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.networkDeviceData = response.dataList;
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

  searchnetworkDevice() {
    const searchOwnerData = {
      filter: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and",
        },
      ],
      page: this.currentPagenetworkDeviceListdata,
      pageSize: this.networkDeviceListdataitemsPerPage,
      sortBy: "createdate",
      sortOrder: 0,
    };
    searchOwnerData.filter[0].filterValue = this.searchDeviceType;
    const url =
      "/NetworkDevice/search?page=" +
      searchOwnerData.page +
      "&pageSize=" +
      searchOwnerData.pageSize +
      "&sortBy=" +
      searchOwnerData.sortBy +
      "&sortOrder=" +
      searchOwnerData.sortOrder;
    this.networkdeviceService.postMethod(url, searchOwnerData).subscribe(
      (response: any) => {
        this.networkDeviceListData = response.dataList;
        this.networkDeviceListDataselector = response.dataList;
        this.networkDeviceListdatatotalRecords = response.totalRecords;
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

  pageChangednetworkDeviceList(pageNumber:any) {
    this.currentPagenetworkDeviceListdata = pageNumber;
    if (!this.searchDeviceType) {
      this.getnetworkDeviceList("");
    } else {
      this.searchnetworkDevice();
    }
  }
}
