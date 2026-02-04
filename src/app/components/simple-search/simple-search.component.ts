import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
// import * as FileSaver from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService, SortEvent } from "primeng/api";
import { RADIUS_CONSTANTS } from "src/app/constants/aclConstants";
import { LiveUserService } from "src/app/service/live-user.service";
import { LoginService } from "src/app/service/login.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Component({
    selector: "app-simple-search",
    templateUrl: "./simple-search.component.html",
    styleUrls: ["./simple-search.component.css"],
    standalone: false
})
export class SimpleSearchComponent implements OnInit {
  @Input() instanceData!: any;
  @Input() function: any = "";
  @Input() cols: any = [];
  @Input() selectedCols: any = [];
  @Input() backUpCalls!: any;
  @Input() value!: any;
  @Input() exportColumns!: any;
  @Input() hideTable!: any;
  @Output() getRootInstanceData = new EventEmitter<any>();
  @Output() reloadTable = new EventEmitter<any>();
  @Output() viewData = new EventEmitter<any>();
  @Output() viewDataa = new EventEmitter<any>();
  @Output() disconnect = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() manageHideTable = new EventEmitter<any>();
  @Output() showModalDetails = new EventEmitter<any>();
  isTableSearch = false;
  exportCSVAccess: boolean = false;
  exportXLSAccess: boolean = false;
  exportPDFAccess: boolean = false;
  deleteLiveUserAccess: boolean = false;
  disconnectLiveUserAccess: boolean = false;
  @Input() showbtn: boolean = false;
  @Input() showCheckbox: boolean = false;
  selectedInstances: any;
  isAllSelected: boolean;
  instances: any;
  mvnoId: string = localStorage.getItem("mvnoId");
  liveUsers: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = RadiusConstants.ITEMS_PER_PAGE;
  totalRecords: number;
  rootInstanceData: any = null;
  searchkey: string;

  constructor(
    private liveUser: LiveUserService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    public loginService: LoginService,
    public liveUserService: LiveUserService
  ) {}

  ngOnInit(): void {
    switch (this.function) {
      case "acct-cdr":
        this.exportCSVAccess = this.loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_CDR_CSV);
        this.exportXLSAccess = this.loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_CDR_XLS);
        this.exportPDFAccess = this.loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_CDR_PDF);
        break;
      case "live_user":
        this.exportCSVAccess = this.loginService.hasPermission(
          RADIUS_CONSTANTS.RADIUS_LIVE_USERS_CSV
        );
        this.exportXLSAccess = this.loginService.hasPermission(
          RADIUS_CONSTANTS.RADIUS_LIVE_USERS_XLS
        );
        this.exportPDFAccess = this.loginService.hasPermission(
          RADIUS_CONSTANTS.RADIUS_LIVE_USERS_PDF
        );
        this.deleteLiveUserAccess = this.loginService.hasPermission(
          RADIUS_CONSTANTS.RADIUS_LIVE_USERS_DELETE
        );
        this.disconnectLiveUserAccess = this.loginService.hasPermission(
          RADIUS_CONSTANTS.RADIUS_LIVE_USERS_DISCONNECT
        );
        console.log(this.deleteLiveUserAccess);
        console.log(this.disconnectLiveUserAccess);
        break;
      default:
        this.exportCSVAccess = true;
        this.exportXLSAccess = true;
        this.exportPDFAccess = true;
        break;
    }
    this.getAll("");
  }

  exportPdf(e: any) {
    let z = this.instanceData.map((ele: any) => {
      let x = {};
      this.cols.forEach((d: any) => {
        x = { ...x, [d.field]: ele?.[d.field] };
      });
      return x;
    });

    const doc = new jsPDF("l", "mm", "a4");
    let newData = z.map((ele: any) => Object.values(ele));
    autoTable(doc, {
      head: [this.cols.map((e: any) => e.header)],
      body: newData
    });
    doc.save("cdrs");
  }
  exportExcel() {
    import("xlsx").then(xlsx => {
      let z = this.instanceData.map((ele: any) => {
        let x = {};
        this.cols.forEach((d: any) => {
          x = { ...x, [d.field]: ele?.[d.field] };
        });
        return x;
      });
      const worksheet = xlsx.utils.json_to_sheet(z);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array"
      });
      this.saveAsExcelFile(excelBuffer, "products");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    let EXCEL_EXTENSION = ".xlsx";
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    // FileSaver.saveAs(data, fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION);
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      const value1 = data1[event.field];
      const value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null) {
        result = -1;
      } else if (value1 != null && value2 == null) {
        result = 1;
      } else if (value1 == null && value2 == null) {
        result = 0;
      } else if (typeof value1 === "string" && typeof value2 === "string") {
        result = value1.localeCompare(value2);
      } else {
        result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
      }

      return event.order * result;
    });
  }

  goBackToTable() {
    this.manageHideTable.emit(false);
    this.instanceData = [];
    this.reloadTable.emit();
  }

  removeData(e: any, d: any) {
    this.liveUser.delete(d.cdrID).subscribe(
      (res: any) => {
        this.goBackToTable();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  resetHandleData() {
    this.cols = this.backUpCalls;
  }

  getColData(e: any, d: any) {
    this.isTableSearch = d.requestId;

    if (this.value === "Advance Search") {
      // this.instance.getAdvanceHistoryById(d.requestId).subscribe(
      //     (res: any) => {
      //
      //         if (res.message === 'Pending') {
      //             this.isTableSearch = false;
      //             this.messageService.add({
      //                 severity: 'warn',
      //                 summary: 'Request is pending ',
      //                 icon: 'far fa-times-circle',
      //             });
      //         } else {
      //
      //             // this.hideTable = true;
      //             this.manageHideTable.emit(true);
      //             this.getRootInstanceData.emit({
      //                 instanceData: res.payload,
      //             });
      //             this.isTableSearch = false;
      //         }
      //     },
      //     (err) => {
      //         this.isTableSearch = false;
      //         console.log(err);
      //
      //         this.messageService.add({
      //             severity: 'error',
      //             summary: err.message,
      //             detail: 'Something went wrong',
      //             icon: 'far fa-times-circle',
      //         });
      //     }
      // );
    } else {
      // this.instance.getCorrelateHistoryById(d.requestId).subscribe(
      //     (res: any) => {
      //
      //         if (res.message === 'Pending') {
      //             this.isTableSearch = false;
      //             this.messageService.add({
      //                 severity: 'warn',
      //                 summary: 'Request is pending ',
      //                 icon: 'far fa-times-circle',
      //             });
      //         } else {
      //
      //             // this.hideTable = true;
      //             this.manageHideTable.emit(true);
      //             this.getRootInstanceData.emit({
      //                 instanceData: res.payload,
      //             });
      //             this.isTableSearch = false;
      //         }
      //     },
      //     (err) => {
      //         this.isTableSearch = false;
      //         console.log(err);
      //
      //         this.messageService.add({
      //             severity: 'error',
      //             summary: err.message,
      //             detail: 'Something went wrong',
      //             icon: 'far fa-times-circle',
      //         });
      //     }
      // );
    }
  }

  viewDataModal(e: any, d: any) {
    this.viewData.emit(d);
  }
  addDataModal(e: any, d: any) {
    this.viewDataa.emit(d);
  }
  disconnectEvent(e: any, d: any) {
    this.disconnect.emit(d);
    this.goBackToTable();
  }
  deleteEvent(e: any, d: any) {
    this.delete.emit(d);
    this.goBackToTable();
  }

  openDataModal(e: any, d: any) {
    console.log("custId d :::::::: ", d);
    this.showModalDetails.emit(Number(d.custid));
  }

  deleteSelectedUsers() {
    if (!this.selectedInstances || this.selectedInstances.length === 0) {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "No users selected for deletion.",
        icon: "far fa-exclamation-circle"
      });
      return;
    }

    const userIds = this.selectedInstances.map((instance:any) => instance.cdrID);
    this.liveUserService.deleteMultipleUsers(this.mvnoId, userIds).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });

        this.instanceData = this.instanceData.filter((instance:any) => !userIds.includes(instance.cdrID));
        this.selectedInstances = [];
        this.getAll("");
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error?.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  disconnectSelectedUsers() {
    if (!this.selectedInstances || this.selectedInstances.length === 0) {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "No users selected for deletion.",
        icon: "far fa-exclamation-circle"
      });
      return;
    }
    const userIds = this.selectedInstances.map((instance:any) => instance.cdrID);
    this.liveUserService.disconnectMultipleUsers(this.mvnoId, userIds).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
        this.instanceData = this.instanceData.filter((instance:any) => !userIds.includes(instance.cdrID));
        this.selectedInstances = [];
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error?.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getAll(list:any) {
    this.liveUsers = [];
    let size;
    this.searchkey = "";
    let page = this.currentPage;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      size = this.itemsPerPage;
    }
    this.liveUserService.getAll(page, size).subscribe(
      (response: any) => {
        console.log(response);
        this.liveUsers = response.liveUser.content;
        this.liveUsers.forEach(element => {
          const dateObj = new Date(element.acctSessionTime * 1000);
          const hours = dateObj.getUTCHours();
          const minutes = dateObj.getUTCMinutes();
          const seconds = dateObj.getSeconds();

          const timeString =
            hours.toString().padStart(2, "0") +
            ":" +
            minutes.toString().padStart(2, "0") +
            ":" +
            seconds.toString().padStart(2, "0");

          element.acctSessionTime = timeString;
          element.isDeleted = true;
          element.isView = true;
          element.isDisconnect = true;
        });
        // this.saveShiftLocation(this.custId);
        this.totalRecords = response.liveUser.totalElements;
        this.getRootInstance(this.liveUsers);
      },
      (error: any) => {
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }
  getRootInstance(data: any) {
    if (data) {
      this.manageLocalData(data);
    }
  }
  manageLocalData(data: any) {
    this.cols = [];
    this.selectedCols = [];
    this.rootInstanceData = data;
    if (data?.[0]) {
      this.cols = Object.keys(data?.[0]).map(ele => ({
        field: ele,
        header: ele,
        customExportHeader: ele
      }));
      this.cols.push({
        field: "Actions",
        header: "Actions"
      });

      Object.keys(data?.[0]).forEach(element => {
        if (
          element === "userName" ||
          element === "framedIpAddress" ||
          element === "acctInputOctets" ||
          element === "acctOutputOctets" ||
          element === "callingStationId" ||
          element === "framedIPv6Prefix" ||
          element === "createDate" ||
          element === "acctSessionTime" ||
          element === "nasIpAddress"
        ) {
          this.selectedCols.push({
            field: element,
            header: element,
            customExportHeader: element
          });
        }
      });
      this.selectedCols.push({
        field: "Actions",
        header: "Actions"
      });
    }
    this.exportColumns = Object.keys(data?.[0]).map(col => ({
      title: col,
      dataKey: col
    }));
  }
}
