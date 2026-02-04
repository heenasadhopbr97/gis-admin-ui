import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
// import * as moment from "moment";
import { NavMasterService } from "../nav-master.service";
import * as RadiusConstants from "../../../RadiusUtils/RadiusConstants";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";

declare var $: any;

@Component({
    selector: "app-aggregation-report",
    templateUrl: "./aggregation-report.component.html",
    styleUrls: ["./aggregation-report.component.css"],
    standalone: false
})
export class AggregationReportComponent implements OnInit {
  title = "Aggreagtion Report";
  @Input() navMasterData: any;
  searchSubmitted: boolean = false;
  searchForm: FormGroup;

  currentPageAggregationReportListdata = 1;
  aggregationReportListDataTotalRecords: any;
  aggregationReportListData: any = [];
  aggregationReportListDataselector: any;
  pageLimitOptionsAggregationReport = RadiusConstants.pageLimitOptions;
  aggregationReportListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  aggregationReportListDatalength = 0;
  showItemPerPageAggregationReport = 1;

  masterSelected: boolean;
  checklist: any;
  checkedList: any[] = [];

  currentPageAggregationPushedReportListdata = 1;
  aggregationPushedReportListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  aggregationPushedReportListDataTotalRecords: any;
  aggregationPushedReportListData: any = [];
  aggregationPushedReportListDataselector: any;
  pageLimitOptionsAggregationPushedReport = RadiusConstants.pageLimitOptions;
  aggregationPushedReportListDatalength = 0;
  showItemPerPageAggregationPushedReport = 1;

  currentPageRawReportListData = 1;
  rawReportListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  rawReportListDataTotalRecords: any;
  rawReportListData: any = [];
  rawReportListDataselector: any;
  pageLimitOptionsRawReport = RadiusConstants.pageLimitOptions;
  rawReportListDatalength = 0;
  showItemPerPageRaw = 1;
  viewFinalData: any;
  rawDataView: boolean = false;

  isPushed: boolean = false;

  constructor(
    private fb: FormBuilder,
    private navMasterService: NavMasterService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService
  ) {
    console.log(this.navMasterData);
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
    });
  }

  fetchAggregationReport(list:any) {
    let size;
    const page = this.currentPageAggregationReportListdata;
    if (list) {
      size = list;
      this.aggregationReportListdataitemsPerPage = list;
    } else {
      size = this.aggregationReportListdataitemsPerPage;
    }

    // const url = `/dashboard/approval/getCustomerDocForApprovals`;
    const data = {
      page,
      pageSize: size,
    };
    let startDate = (this.searchForm.controls['startDate'].value)
      .format("DD/MM/YYYY")
      .toString();
    let endDate = (this.searchForm.controls['endDate'].value).format("DD/MM/YYYY").toString();
    let url = `/aggregationReport/fetchAggregationReport?startDate=${startDate}&endDate=${endDate}&navMasterId=${this.navMasterData.id}`;
    this.navMasterService.postMethod(url, data).subscribe(
      (response: any) => {
        this.aggregationReportListData = response.dataList;
        this.aggregationReportListDataselector = response.dataList;
        this.aggregationReportListDataTotalRecords = response.totalRecords;
        this.fetchAggregationPushedReport("");

        if (response.responseCode == 200) {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Records fetched successfully.",
            icon: "far fa-times-circle",
          });
        } else if (response.responseCode == 204) {
          this.messageService.add({
            severity: "info",
            summary: "Information",
            detail: "No asynchronous records found.",
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

  pageChangedForAggregationReport(pageNumber:any): void {
    this.currentPageAggregationReportListdata = pageNumber;
    // this.fetchAggregationReport("");
  }

  totalItemPerPageForAggregationReport(event:any): void {
    this.showItemPerPageAggregationReport = Number(event.value);
    this.aggregationReportListdataitemsPerPage = this.showItemPerPageAggregationReport;
    if (this.currentPageAggregationReportListdata > 1) {
      this.currentPageAggregationReportListdata = 1;
    }
    // this.fetchAggregationReport(this.showItemPerPageAggregationReport);
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll() {
    for (let i = 0; i < this.aggregationReportListData.length; i++) {
      this.aggregationReportListData[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  // Check All Checkbox Checked
  isAllSelected() {
    this.masterSelected = this.aggregationReportListData.every(function (item: any) {
      return item.isSelected == true;
    });
    this.getCheckedItemList();
  }

  // Get List of Checked Items
  getCheckedItemList() {
    this.checkedList = [];
    for (let i = 0; i < this.aggregationReportListData.length; i++) {
      if (this.aggregationReportListData[i].isSelected) {
        this.checkedList.push(this.aggregationReportListData[i]);
      }
    }
  }

  push() {
    if (this.checkedList.length > 0) {
      let url = `/aggregationReport/pushAggregationReport?navMasterId=${this.navMasterData.id}`;
      this.navMasterService.postMethod(url, this.checkedList).subscribe(
        (response: any) => {
          if (response.responseCode == 417) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle",
            });
          } else {
            this.checkedList = [];
            this.fetchAggregationReport("");
            this.fetchAggregationPushedReport("");
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: "Pushed into NAV successfully.",
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
  }

  fetchAggregationPushedReport(list:any) {
    this.aggregationPushedReportListData = [];

    let size;
    const page = this.currentPageAggregationPushedReportListdata;
    if (list) {
      size = list;
      this.aggregationPushedReportListdataitemsPerPage = list;
    } else {
      size = this.aggregationPushedReportListdataitemsPerPage;
    }

    const data = {
      page,
      pageSize: size,
    };
    let startDate = (this.searchForm.controls['startDate'].value)
      .format("DD/MM/YYYY")
      .toString();
    let endDate = (this.searchForm.controls['endDate'].value).format("DD/MM/YYYY").toString();
    // let startDate = this.searchForm.controls.startDate.value;
    // let endDate = this.searchForm.controls.endDate.value;
    let url = `/aggregationReport/fetchAggregationPushedReport?startDate=${startDate}&endDate=${endDate}&navMasterId=${this.navMasterData.id}`;
    this.navMasterService.postMethod(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.aggregationPushedReportListData = response.dataList;
          this.aggregationPushedReportListDataselector = response.dataList;
          this.aggregationPushedReportListDataTotalRecords = response.totalRecords;
          if (
            this.showItemPerPageAggregationPushedReport >
            this.aggregationPushedReportListdataitemsPerPage
          ) {
            this.aggregationPushedReportListDatalength =
              this.aggregationPushedReportListData.length %
              this.showItemPerPageAggregationPushedReport;
          } else {
            this.aggregationPushedReportListDatalength =
              this.aggregationPushedReportListData.length %
              this.aggregationPushedReportListdataitemsPerPage;
          }
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Push Records fetched successfully.",
            icon: "far fa-times-circle",
          });
        }
        if (response.responseCode == 204) {
          this.messageService.add({
            severity: "info",
            summary: "Information",
            detail: "No pushed records found.",
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

  pageChangedForAggregationPushedReport(pageNumber:any): void {
    this.currentPageAggregationPushedReportListdata = pageNumber;
    this.fetchAggregationReport("");
  }

  totalItemPerPageForAggregationPushedReport(event:any): void {
    this.showItemPerPageAggregationPushedReport = Number(event.value);
    if (this.currentPageAggregationPushedReportListdata > 1) {
      this.currentPageAggregationPushedReportListdata = 1;
    }
    this.fetchAggregationPushedReport(this.showItemPerPageAggregationPushedReport);
  }

  getRawData(finalData: any, list:any, isPushed: boolean) {
    this.isPushed = isPushed;

    let size;
    const page = this.currentPageRawReportListData;
    if (list) {
      size = list;
      this.rawReportListdataitemsPerPage = list;
    } else {
      size = this.rawReportListdataitemsPerPage;
    }
    const data = {
      paginationRequestDTO: {
        page,
        pageSize: size,
      },
      billGenFinalData: finalData,
      navMaster: this.navMasterData,
    };
    let url = `/aggregationReport/getRawDataOfFinalData?isPushed=${this.isPushed}`;
    this.navMasterService.postMethod(url, data).subscribe(
      (response: any) => {
        this.rawReportListData = response.dataList;
        this.rawReportListDataselector = response.dataList;
        this.rawReportListDataTotalRecords = response.totalRecords;
        if (this.showItemPerPageRaw > this.rawReportListdataitemsPerPage) {
          this.rawReportListDatalength = this.rawReportListData.length % this.showItemPerPageRaw;
        } else {
          this.rawReportListDatalength =
            this.rawReportListData.length % this.rawReportListdataitemsPerPage;
        }
        if (this.rawReportListData.length > 0) {
          this.rawDataView = true;
          $("#rawDataReportModal").modal("show");
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

  pageChangedForRawReport(pageNumber:any): void {
    this.currentPageRawReportListData = pageNumber;
    this.getRawData(this.viewFinalData, "", this.isPushed);
  }

  totalItemPerPageForRawReport(event:any): void {
    this.showItemPerPageRaw = Number(event.value);
    if (this.currentPageRawReportListData > 1) {
      this.currentPageRawReportListData = 1;
    }
    this.getRawData(this.viewFinalData, this.showItemPerPageRaw, this.isPushed);
  }

  openRawDataModal(finalData: any, isPushed: boolean) {
    this.viewFinalData = finalData;
    this.getRawData(finalData, "", isPushed);
  }

  closeModal() {
    $("#rawDataReportModal").modal("hide");
    this.rawDataView = false;
    this.currentPageRawReportListData = 1;
    this.showItemPerPageRaw = RadiusConstants.ITEMS_PER_PAGE;
  }
}
