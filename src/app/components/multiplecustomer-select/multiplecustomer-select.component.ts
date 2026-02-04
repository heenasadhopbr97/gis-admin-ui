import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from "@angular/core";
import { Observable } from "rxjs";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { Table } from "primeng/table";

declare var $: any;
@Component({
    selector: "app-multiplecustomer-select",
    templateUrl: "./multiplecustomer-select.component.html",
    styleUrls: ["./multiplecustomer-select.component.css"],
    standalone: false
})
export class MultiplecustomerSelectComponent implements OnInit {
  @Input() dialogId: string;
  @Input() custdata: Observable<any>;
  @Output() selectCustomerID = new EventEmitter();
  @ViewChild("dt") table: Table;

  searchCustOption = "";
  searchCustValue = "";

  currentPageCustomerListdata = 1;
  CustomerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  CustomerListdatatotalRecords: number;

  selectedCust: any = [];
  selectedCustId: any;
  CustList: any;

  fieldEnable = false;
  FieldEnable = false;
  newFirst: number;
  AllCustomerList: any = [];
  customerListData: any = [];
  customerList: any = [];
  editCustomerId: any;

  searchOptionSelect = [
    { label: "Firstname", value: "name" },
    { label: "Username", value: "username" },
    { label: "Email", value: "email" },
    { label: "Phone", value: "mobile" },
    { label: "Service Area", value: "serviceareaName" },
    { label: "MAC-based", value: "macaddress" },
    { label: "Status", value: "status" },
  ];

  constructor(
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private customerManagementService: CustomermanagementService,
    public commondropdownService: CommondropdownService
  ) {}
  ngOnInit(): void {
    this.custdata.subscribe(value => {
      this.customerList = value.custdata;
      this.AllCustomerList = value.custdata;
      this.CustomerListdatatotalRecords = this.AllCustomerList.length;
      this.newFirst = 1;
      console.log(this.AllCustomerList, this.AllCustomerList);
    });

    this.commondropdownService.getCustomer();
    const serviceArea = localStorage.getItem("serviceArea");

    let serviceAreaArray = JSON.parse(serviceArea);
    if (serviceAreaArray.length !== 0) {
      this.commondropdownService.filterserviceAreaList();
    } else {
      this.commondropdownService.getserviceAreaList();
    }
  }

  // modalOpenCustomer() {
  //   $("#selectIDCustomer").modal("show");
  //   this.newFirst = 0;
  //   this.getCustomerData();
  //   this.selectedCust = [];
  // }

  selSearchOption(event:any) {
    // console.log("value", event.value);
    if (event.value) {
      this.FieldEnable = true;
    } else {
      this.FieldEnable = false;
    }
  }
  getCustomerData() {
    //
    // let currentPage;
    // currentPage = this.currentPageCustomerListdata;
    // const data = {
    //   page: currentPage,
    //   pageSize: this.CustomerListdataitemsPerPage,
    // };
    // const url = "/customers/list";
    // this.customerManagementService.postMethod(url, data).subscribe(
    //   (response: any) => {
    //     this.AllCustomerList = response.customerList;
    //     this.CustomerListdatatotalRecords = response.pageDetails.totalRecords;
    //     this.newFirst = 1;
    //
    //   },
    //   (error: any) => {
    //     console.log(error, "error");
    //     this.messageService.add({
    //       severity: "error",
    //       summary: "Error",
    //       detail: error.error.ERROR,
    //       icon: "far fa-times-circle",
    //     });
    //
    //   }
    // );
  }
  searchCustomer() {
    //

    // const searchData = {
    //   filters: [
    //     {
    //       filterDataType: "",
    //       filterValue: "",
    //       filterColumn: "any",
    //       filterOperator: "equalto",
    //       filterCondition: "and",
    //     },
    //   ],
    //   page: this.currentPageCustomerListdata,
    //   pageSize: this.CustomerListdataitemsPerPage,
    // };

    // searchData.filters[0].filterValue = this.searchCustValue ? this.searchCustValue.trim() : "";
    // searchData.filters[0].filterColumn = this.searchCustOption.trim();

    // const url = "/subscriber/getByInvoiceType/search/Group";
    // this.customerManagementService.postMethod(url, searchData).subscribe(
    //   (response: any) => {
    //     this.AllCustomerList = response.customerList;
    //     this.CustomerListdatatotalRecords = response.pageDetails.totalRecords;
    //
    //   },
    //   (error: any) => {
    //     if (error.status == 400) {
    //       this.messageService.add({
    //         severity: "info",
    //         summary: "Info",
    //         detail: error.msg,
    //         icon: "far fa-times-circle",
    //       });
    //     } else {
    //       this.messageService.add({
    //         severity: "error",
    //         summary: "Error",
    //         detail: error.error.ERROR,
    //         icon: "far fa-times-circle",
    //       });
    //     }
    //
    //   }
    // );

    let colum = this.searchCustOption.trim();
    let value = this.searchCustValue ? this.searchCustValue.trim() : "";
    if ("name" == colum) {
      this.AllCustomerList = this.customerList.filter((e:any) => e.name == value);
      this.CustomerListdatatotalRecords = this.AllCustomerList.length;
    } else if ("username" == colum) {
      this.AllCustomerList = this.customerList.filter((e:any) => e.username == value);
      this.CustomerListdatatotalRecords = this.AllCustomerList.length;
    } else if ("email" == colum) {
      this.AllCustomerList = this.customerList.filter((e:any) => e.email == value);
      this.CustomerListdatatotalRecords = this.AllCustomerList.length;
    } else if ("serviceareaName" == colum) {
      this.AllCustomerList = this.customerList.filter((e:any) => e.serviceareaName == value);
      this.CustomerListdatatotalRecords = this.AllCustomerList.length;
    } else if ("macaddress" == colum) {
      this.AllCustomerList = this.customerList.filter((e:any) => e.macaddress == value);
      this.CustomerListdatatotalRecords = this.AllCustomerList.length;
    } else if ("mobile" == colum) {
      this.AllCustomerList = this.customerList.filter((e:any) => e.mobile == value);
      this.CustomerListdatatotalRecords = this.AllCustomerList.length;
    } else if ("status" == colum) {
      this.AllCustomerList = this.customerList.filter((e:any) => e.status == value);
      this.CustomerListdatatotalRecords = this.AllCustomerList.length;
    }
    $(`#${this.dialogId}`).modal("show");
  }

  clearSearchCustomer() {
    this.currentPageCustomerListdata = 1;
    // this.getCustomerData();
    this.AllCustomerList = this.customerList;
    this.searchCustValue = "";
    this.searchCustOption = "";
    this.FieldEnable = false;
  }

  paginate(event:any) {
    console.log("page event", this.selectedCust);
    this.currentPageCustomerListdata = event.page + 1;
    // this.first = event.first;
    if (this.searchCustValue) {
      this.searchCustomer();
    } else {
      // this.getCustomerData();
      this.AllCustomerList = this.customerList;
    }
  }

  async saveSelCustomer() {
    console.log("selectCustomerData", this.selectedCust);
    let data:any[] = [];
    this.selectedCust.forEach((element:any, n:any) => {
      let j = n + 1;
      data.push(element.id);

      if (this.selectedCust.length == j) {
        this.selectCustomerID.emit(data);
        $(`#${this.dialogId}`).modal("hide");
      }
    });

    this.modalCloseCustomer();
  }

  modalCloseCustomer() {
    this.currentPageCustomerListdata = 1;
    this.newFirst = 0;
    this.searchCustValue = "";
    this.searchCustOption = "";
    this.FieldEnable = false;
  }
}
