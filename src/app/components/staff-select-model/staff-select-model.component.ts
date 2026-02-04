import { DatePipe, formatDate } from "@angular/common";
import { Component, ElementRef, Input, Output, OnInit, EventEmitter } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { BehaviorSubject, Observable, Observer } from "rxjs";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

import { CommondropdownService } from "src/app/service/commondropdown.service";
import { InvoicePaymentListService } from "src/app/service/invoice-payment-list.service";
import { StaffService } from "src/app/service/staff.service";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { CustomerService } from "src/app/service/customer.service";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";

declare var $: any;
@Component({
    selector: "app-staff-select-model",
    templateUrl: "./staff-select-model.component.html",
    styleUrls: ["./staff-select-model.component.css"],
    standalone: false
})
export class StaffSelectModelComponent implements OnInit {
  @Output() selectedStaffChange = new EventEmitter();
  @Output() closeSelectStaff = new EventEmitter();

  staffDataList: any = [];
  requestedByList: any = [];
  serviceAreaId: any;
  data: any = [];
  staffData: any = [];
  newFirst = 0;
  searchParentCustOption = "";
  searchParentCustValue = "";
  serviceAreaDisable = false;
  parentFieldEnable = false;
  parentStaffListdataitemsPerPageForStaff = RadiusConstants.ITEMS_PER_PAGE;
  parentstaffListdatatotalRecords: any;
  currentPageParentStaffListdata = 1;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPage = 1;
  searchkey: string;
  selectedStaffCust: any = [];
  staffCustList: any = [];
  staffid: any = "";
  searchData: any;
  searchOption = "";
  searchDeatil = "";
  selectStaff: boolean = false;

  constructor(
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    public PaymentamountService: PaymentamountService,
    public commondropdownService: CommondropdownService,
    private staffService: StaffService,
    public datepipe: DatePipe,
    public invoicePaymentListService: InvoicePaymentListService,
    public KeyannaCommonBaseService: KeyannaCommonBaseService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.selectStaff = true;
    this.getStaffDetailById();
    this.newFirst = 1;
    this.selectedStaffCust = [];
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;

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
      page: this.currentPageParentStaffListdata,
      pageSize: this.parentStaffListdataitemsPerPageForStaff,
    };
  }

  getStaffDetailById() {
    let currentPageForStaff;
    currentPageForStaff = this.currentPageParentStaffListdata;
    const data = {
      page: currentPageForStaff,
      pageSize: this.parentStaffListdataitemsPerPageForStaff,
    };
    const url = "/staffuser/list?product=BSS";
    this.staffService.getAllStaffList(data).subscribe((response: any) => {
      this.staffData = response.staffUserlist;
      this.parentstaffListdatatotalRecords = response.pageDetails.totalRecords;
      this.staffDataList.forEach((element:any, i:any) => {
        element.displayLabel = element.fullName + " (Ph: " + element.phone + ")";
        this.data.push(element.id);
      });
    });
  }

  modalCloseStaff() {
    this.closeSelectStaff.emit(this.selectedStaffCust);
    this.selectStaff = false;
    this.currentPageParentStaffListdata = 1;
    this.newFirst = 1;
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
  }
  removeSelStaff() {
    this.staffCustList = [];
    this.staffid = null;
  }

  paginateStaff(event:any) {
    this.currentPageParentStaffListdata = event.page + 1;
    this.parentStaffListdataitemsPerPageForStaff = event.rows;
    if (this.searchParentCustValue) {
      this.searchStaffByName();
    } else {
      this.getStaffDetailById();
    }
  }

  searchStaffByName() {
    this.newFirst = 0;

    const searchData = {
      filters: [
        {
          filterDataType: "",
          filterValue: this.searchDeatil.trim(),
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and",
        },
      ],
      page: this.currentPageParentStaffListdata,
      pageSize: this.parentStaffListdataitemsPerPageForStaff.toString(),
    };
    this.staffService.staffSearch(searchData).subscribe(
      (response: any) => {
        console.log(response);

        this.staffData = response.dataList;
        this.parentstaffListdatatotalRecords = response.totalRecords;
      },
      (error: any) => {
        this.parentstaffListdatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
          this.staffData = [];
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

  clearSearchForm() {
    this.searchDeatil = "";

    this.currentPageParentStaffListdata = 1;
    this.getStaffDetailById();
  }

  saveSelstaff() {
    this.selectedStaffChange.emit(this.selectedStaffCust);
    this.selectStaff = false;
    this.staffCustList = [
      {
        id: this.selectedStaffCust.id,
        name: this.selectedStaffCust.name,
      },
    ];
    this.searchDeatil = this.selectedStaffCust.id;
    this.modalCloseStaff();
  }

  paginate(event: any, dt: any) {
    const pageSize = event.rows; // Get the page size from the event
    const currentPageIndex = event.first / pageSize; // Calculate the current page index
    const currentPage = Math.floor(currentPageIndex) + 1;
    this.parentStaffListdataitemsPerPageForStaff = event.rows;
    if (this.searchDeatil) {
      this.searchStaffByName();
    } else {
      this.getStaffDetailById();
    }
  }
}
