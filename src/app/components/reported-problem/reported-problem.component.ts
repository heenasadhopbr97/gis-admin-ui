import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { ReportedProblemService } from "src/app/service/reported-problem.service";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";

@Component({
    selector: "app-reported-problem",
    templateUrl: "./reported-problem.component.html",
    styleUrls: ["./reported-problem.component.css"],
    standalone: false
})
export class ReportedProblemComponent implements OnInit {
  public loginService: LoginService;
  AclClassConstants;
  AclConstants;
  reportedProblemData: any;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  currentPageReportedProblem = 1;
  reportedProblemitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  reportedProblemtotalRecords: any;
  searchPhoneNo: any = "";
  searchKey: any;
  constructor(
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private reportedProblemService: ReportedProblemService,
    loginService: LoginService
  ) {
    (this.loginService = loginService),
      (this.AclClassConstants = AclClassConstants),
      (this.AclConstants = AclConstants);
  }

  ngOnInit(): void {
    this.getReportedData("");
  }

  getReportedData(list:any) {
    let size;

    let pageList = this.currentPageReportedProblem;
    if (list) {
      size = list;
      this.reportedProblemitemsPerPage = list;
    } else {
      size = this.reportedProblemitemsPerPage;
    }

    let pageData = {
      page: pageList,
      pageSize: size,
    };

    const url = "/reportproblem";
    this.reportedProblemService.postMethod(url, pageData).subscribe(
      (response: any) => {
        this.reportedProblemData = response.dataList;
        this.reportedProblemtotalRecords = response.totalRecords;
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

  searchReportedData() {
    if (!this.searchPhoneNo) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please Select Phone No.",
        icon: "far fa-times-circle",
      });
      return;
    }

    if (!this.searchKey || this.searchKey !== this.searchPhoneNo) {
      this.currentPageReportedProblem = 1;
    }
    if (this.showItemPerPage) {
      this.reportedProblemitemsPerPage = this.showItemPerPage;
    }
    this.searchKey = this.searchPhoneNo;

    let filterData = {
      filter: [
        {
          filterColumn: "phno",
          filterCondition: "",
          filterDataType: "",
          filterOperator: "",
          filterValue: this.searchPhoneNo,
        },
      ],
    };
    //const url = "/reportproblem/phno?phno="+ this.searchPhoneNo;
    const url =
      "/reportproblem/pagination?page=" +
      this.currentPageReportedProblem +
      "&pageSize=" +
      this.reportedProblemitemsPerPage +
      "&sortBy=report_id&sortOrder=0";
    this.reportedProblemService.postMethod(url, filterData).subscribe(
      (response: any) => {
        this.reportedProblemData = response.dataList;
        this.reportedProblemtotalRecords = response.totalRecords;
      },
      (error: any) => {
        this.reportedProblemtotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
          this.reportedProblemData = [];
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

  clearReportedData() {
    this.searchPhoneNo = "";
    this.searchKey = "";
    this.currentPageReportedProblem = 1;
    this.getReportedData("");
  }

  pageChangedReportedProblemList(pageNumber:any) {
    this.currentPageReportedProblem = pageNumber;
    if (!this.searchPhoneNo) {
      this.getReportedData("");
    } else {
      this.searchReportedData();
    }
  }

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageReportedProblem > 1) {
      this.currentPageReportedProblem = 1;
    }
    if (!this.searchPhoneNo) {
      this.getReportedData(this.showItemPerPage);
    } else {
      this.searchReportedData();
    }
  }
}
