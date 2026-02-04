import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { BilltemplateService } from "src/app/service/billtemplate.service";
import { Regex } from "src/app/constants/regex";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { BillTemplate } from "src/app/components/model/billTemplate";
import { Data } from "@angular/router";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Observable, Observer } from "rxjs";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import { INVOICE_SYSTEMS } from "src/app/constants/aclConstants";

@Component({
    selector: "app-billtemplate",
    templateUrl: "./billtemplate.component.html",
    styleUrls: ["./billtemplate.component.css"],
    standalone: false
})
export class BilltemplateComponent implements OnInit {
  billTemplatesGroupForm!: FormGroup;
  billTemplatesCategoryList: any;
  submitted: boolean = false;
  taxListData: any;
  createbillTemplatesData!: BillTemplate;
  currentPagebillTemplatesListdata = 1;
  billTemplatesListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  billTemplatesListdatatotalRecords: any;
  billTemplatesListData: any = [];
  viewbillTemplatesListData: any = [];
  isbillTemplatesEdit: boolean = false;
  billTemplatestype = "";
  billTemplatescategory = "";
  searchbillTemplatesUrl: any;
  chargeOptionname : any;

  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 0;
  searchkey!: string;
  totalAreaListLength = 0;
  objs: any = {};
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  statusOptions = RadiusConstants.status;
  billData: any = [];
  expoerteddata: any = [];
  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private billTemplatesService: BilltemplateService,
    loginService: LoginService,
    private revenueManagementService: RevenueManagementService,
    public commondropdownService: CommondropdownService
  ) {
    this.createAccess = loginService.hasPermission(INVOICE_SYSTEMS.CREATE_BILL_TEMPLATE);
    this.deleteAccess = loginService.hasPermission(INVOICE_SYSTEMS.DELETE_BILL_TEMPLATE);
    this.editAccess = loginService.hasPermission(INVOICE_SYSTEMS.EDIT_BILL_TEMPLATE);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    this.isbillTemplatesEdit = !this.createAccess && this.editAccess ? true : false;
  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.billTemplatesGroupForm = this.fb.group({
      id: [""],
      templatename: ["", Validators.required],
      templatetype: ["", Validators.required],
      jrxmlfile: ["", Validators.required],
      status: ["", Validators.required],
      isDelete: [0],
    });

    this.getbillTemplatesList("");
    this.getChargeType();
  }
  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPagebillTemplatesListdata > 1) {
      this.currentPagebillTemplatesListdata = 1;
    }
    if (!this.searchkey) {
      this.getbillTemplatesList(this.showItemPerPage);
    }
  }

  getbillTemplatesList(list:any) {
    let size;
    this.searchkey = "";
    let page_list = this.currentPagebillTemplatesListdata;
    if (list) {
      size = list;
      this.billTemplatesListdataitemsPerPage = list;
    } else {
      // if (this.showItemPerPage == 0) {
      //   this.billTemplatesListdataitemsPerPage = this.pageITEM
      // } else {
      //   this.billTemplatesListdataitemsPerPage = this.showItemPerPage
      // }
      size = this.billTemplatesListdataitemsPerPage;
    }

    const url = "/billTemplete/list";
    let billtemplatedata = {
      page: page_list,
      pageSize: size,
    };
    this.revenueManagementService.postMethod(url, billtemplatedata).subscribe(
      (response: any) => {
        this.billTemplatesListData = response.billRunlist;
        // console.log("billTemplatesListData", this.billTemplatesListData);
        this.billTemplatesListdatatotalRecords = response.pageDetails.totalRecords;
        // if (this.showItemPerPage > this.billTemplatesListdataitemsPerPage) {
        //   this.totalAreaListLength =
        //     this.billTemplatesListData.length % this.showItemPerPage
        // } else {
        //   this.totalAreaListLength =
        //     this.billTemplatesListData.length %
        //     this.billTemplatesListdataitemsPerPage
        // }
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

  // onFileChange(event) {

  //   if (event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     this.billTemplatesGroupForm.patchValue({
  //       jrxmlfile: file
  //     });
  //   }

  // }

  addEditbillTemplates(billTemplatesId:any) {
    this.submitted = true;

    if (this.billTemplatesGroupForm.valid) {
      if (billTemplatesId) {
        const url = "/billTemplete/" + billTemplatesId;
        this.createbillTemplatesData = this.billTemplatesGroupForm.value;
        this.createbillTemplatesData.isDelete = false;
        // console.log("this.createbillTemplatesData", this.createbillTemplatesData);
        this.revenueManagementService.updateMethod(url, this.createbillTemplatesData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.billTemplatesGroupForm.reset();
            this.isbillTemplatesEdit = false;
            this.viewbillTemplatesListData = [];
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle",
            });
            this.getbillTemplatesList("");
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
        const url = "/billTemplete";

        const formData = new FormData();
        // formData.append('jrxmlfile', this.billTemplatesGroupForm.get('jrxmlfile').value);

        this.createbillTemplatesData = this.billTemplatesGroupForm.value;
        this.createbillTemplatesData.isDelete = false;
        // this.createbillTemplatesData.jrxmlfile = this.billTemplatesGroupForm.value.jrxmlfile.name;

        // console.log("this.createbillTemplatesData", this.createbillTemplatesData);
        this.revenueManagementService.postMethod(url, this.createbillTemplatesData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.billTemplatesGroupForm.reset();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle",
            });
            this.getbillTemplatesList("");
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
  }

  editbillTemplates(billTemplatesId: any) {
    if (billTemplatesId) {
      let file;
      let file1;
      // console.log("billTemplatesId:::" + billTemplatesId);
      const url = "/billTemplete/" + billTemplatesId;
      // console.log("billTemplatesId:::" + url);
      this.revenueManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.isbillTemplatesEdit = true;
          this.viewbillTemplatesListData = response.billRunlist;
          this.billTemplatesGroupForm.patchValue(this.viewbillTemplatesListData);
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

  deleteConfirmonbillTemplates(billTemplates: number) {
    if (billTemplates) {
      this.confirmationService.confirm({
        message: "Do you want to delete this billTemplates?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deletebillTemplates(billTemplates);
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

  deletebillTemplates(id:any) {
    const url = "/billTemplete/" + id;
    this.revenueManagementService.deleteMethod(url).subscribe(
      (response: any) => {
        if (this.currentPagebillTemplatesListdata != 1 && this.totalAreaListLength == 1) {
          this.currentPagebillTemplatesListdata = this.currentPagebillTemplatesListdata - 1;
        }

        this.submitted = false;
        this.billTemplatesGroupForm.reset();
        this.isbillTemplatesEdit = false;
        this.viewbillTemplatesListData = [];
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle",
        });
        this.getbillTemplatesList("");
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

  pageChangedbillTemplatesList(pageNumber:any) {
    this.currentPagebillTemplatesListdata = pageNumber;
    if (!this.searchkey) {
      this.getbillTemplatesList("");
    } else {
      this.searchbillTemplates();
    }
  }

  searchbillTemplates() {
    // const url = "/billTemplates/all"
    // this.billTemplatesService.getMethod(url).subscribe((response: any) => {
    //   this.billTemplatesListData1 = response.dataList;
    // })
    // this.billTemplatesGroupForm = this.billTemplatesListData1;
    // this.temp = [... this.billTemplatesListData1];
    // let valueobj = {};
    // if (this.searchName) {
    //   valueobj["name"] = this.searchName;
    // }
    // let filterdata = _.filter(this.billTemplatesGroupForm, valueobj);
    // this.billTemplatesListData = filterdata;
    // this.temp = filterdata;
  }

  clearSearchbillTemplates() {
    this.getbillTemplatesList("");
    // this.searchName = "";
  }

  templatetypeData: any = [];
  getChargeType() {
    let url = "/commonList/generic/billingtemplatetype";
    this.commondropdownService.getMethodWithCache(url).subscribe((response: any) => {
      this.templatetypeData = response.dataList;
    });
  }

  canExit() {
    if (!this.billTemplatesGroupForm.dirty) return true;
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

  cancelBillTemplates() {
    this.billTemplatesGroupForm.reset();
    this.isbillTemplatesEdit = false;
    this.viewbillTemplatesListData = [];
  }
}
