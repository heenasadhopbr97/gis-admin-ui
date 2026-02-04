import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MessageService } from "primeng/api";
import { ConfirmationService } from "primeng/api";
import { MvnoManagementService } from "src/app/service/mvno-management.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { ActivatedRoute, Router } from "@angular/router";
import { DeactivateService } from "src/app/service/deactivate.service";

@Component({
    selector: "app-mvno-management",
    templateUrl: "./mvno-management.component.html",
    styleUrls: ["./mvno-management.component.css"],
    standalone: false
})
export class MvnoManagementComponent implements OnInit {
  mvnoTitle = RadiusConstants.MVNO;
  currentPageMvno = 1;
  mvnoitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  mvnototalRecords: any;
  mvnoListData: any;
  searchMvnoName: any;
  AclClassConstants;
  AclConstants;
  searchData: any;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 0;
  searchkey: string;
  totalDataListLength = 0;
  isShowCreateView: boolean = true;
  isShowListView: boolean = true;
  isShowMenu: boolean = true;
  public loginService: LoginService;
  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private mvnoManagementService: MvnoManagementService,
    private route: ActivatedRoute,
    loginService: LoginService,
    private deactivateService: DeactivateService,
    private router: Router
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }

  ngOnInit(): void {
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
    this.getMVNOData("");

    const childUrlSegment = this.route.firstChild.snapshot.url[0].path;
    if (childUrlSegment === "list") {
      this.isShowMenu = true;
      this.isShowListView = true;
      this.isShowCreateView = false;
    } else if (childUrlSegment === "create" || childUrlSegment === "edit") {
      this.isShowMenu = true;
      this.isShowCreateView = true;
      this.isShowListView = false;
    } else {
      this.isShowMenu = false;
      this.isShowCreateView = false;
      this.isShowListView = false;
    }
  }

  getMVNOData(list:any) {
    let size;
    this.searchkey = "";
    let pageList = this.currentPageMvno;
    if (list) {
      size = list;
      this.mvnoitemsPerPage = list;
    } else {
      size = this.mvnoitemsPerPage;
    }
    const url = "/mvno";
    let mvnodata = {
      page: pageList,
      pageSize: size,
    };
    this.mvnoManagementService.postMethod(url, mvnodata).subscribe(
      (response: any) => {
        this.mvnoListData = response.dataList;
        this.mvnototalRecords = response.totalRecords;
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

  deleteConfirmonMvno(mvnoData:any) {
    if (mvnoData) {
      console.log("mvnoData", mvnoData);
      this.confirmationService.confirm({
        message: "Do you want to delete this MVNO?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteMvno(mvnoData);
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

  deleteMvno(id:any) {
    const url = "/mvno/delete/" + id;
    this.mvnoManagementService.deleteMethod(url).subscribe(
      (response: any) => {
        if (this.currentPageMvno != 1 && this.mvnoListData.length == 1) {
          this.currentPageMvno = this.currentPageMvno - 1;
        }

        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle",
        });
        this.deactivateService.setShouldCheckCanExit(false);
        this.router.navigate(["/home/mvnoManagement/list"]);
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

  createClick() {
    this.isShowMenu = true;
    this.isShowCreateView = true;
    this.isShowListView = false;
  }

  searchClick() {
    this.isShowMenu = true;
    this.isShowListView = true;
    this.isShowCreateView = false;
  }
}
