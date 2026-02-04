import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { Regex } from "src/app/constants/regex";
import { ChargeManagementService } from "src/app/service/charge-management.service";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { LoginService } from "src/app/service/login.service";
import { ChargeManagement } from "../model/charge-management";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";

@Component({
    selector: "app-common-charge",
    templateUrl: "./common-charge.component.html",
    styleUrls: ["./common-charge.component.css"],
    standalone: false
})
export class CommonChargeComponent implements OnInit {
  @Output() chargeFormDTO = new EventEmitter();
  chargeGroupForm!: FormGroup;
  chargeCategoryList: any;
  submitted: boolean = false;
  taxListData: any = [];
  createChargeData!: ChargeManagement;
  currentPageChargeListdata = 1;
  ChargeListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  ChargeListdatatotalRecords: any;
  chargeListData: any = [];
  viewChargeListData: any = [];
  isChargeEdit: boolean = false;
  searchChargeUrl: any;
  detailView: boolean = false;
  listView: boolean = true;
  createView: boolean = false;
  searchdataview: boolean = false;
  chargeDetailData: any = {
    name: "",
    chargetype: "",
    chargecategory: "",
    price: "",
    taxName: "",
    taxamount: "",
    saccode: "",
    desc: "",
    ledgerId: "",
  };
  chargeType: { value: string; text: string }[] = [];
  searchOptionSelect = [
    { label: "Any", value: "name" },
    { label: "Category", value: "chargecategory" },
    { label: "Type", value: "chargetype" },
  ];

  royaltyPayableData = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];
  isChargeName = false;
  isChargeCatogorey = false;
  isChargeType = false;

  searchData: any = [];
  chargetype = "";
  chargecategory = "";
  chargename = "";
  searchOption!: "name";
  chargeOptionname!: "";

  statusOptions = RadiusConstants.status;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 1;
  searchkey: any = [];
  totalDataListLength = 0;

  chargeTaxData: any = [];
  chargeTypeGetDataData: any = [];

  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  chargeTypeText: any;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private chargeManagementService: ChargeManagementService,
    public commondropdownService: CommondropdownService,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;

    let createAccess = loginService.hasOperationPermission(
      AclClassConstants.ACL_CHARGE,
      AclConstants.OPERATION_CHARGE_ADD,
      AclConstants.OPERATION_CHARGE_ALL
    );

    let editAccess = loginService.hasOperationPermission(
      AclClassConstants.ACL_CHARGE,
      AclConstants.OPERATION_CHARGE_EDIT,
      AclConstants.OPERATION_CHARGE_ALL
    );

    this.isChargeEdit = !createAccess && editAccess ? true : false;
    this.getChargeType();
    this.getChargeCategory();
    this.getTaxDataList();
  }

  ngOnInit(): void {
    this.chargeGroupForm = this.fb.group({
      actualprice: ["", Validators.required],
      chargecategory: ["", Validators.required],
      chargetype: ["", Validators.required],
      desc: ["", [Validators.required, Validators.pattern(Regex.characterlength225)]],
      name: ["", Validators.required],
      saccode: ["", Validators.required],
      taxid: ["", Validators.required],
      serviceid: [[]],
      status: ["", Validators.required],
      ledgerId: [""],
      serviceNameList: [null],
      royalty_payable: [false],
    });

    this.chargeGroupForm.controls['serviceid'].disable();
    this.chargeGroupForm.controls['royalty_payable'].disable();
  }
  getChargeType() {
    let url = "/commonList/generic/chargetype";
    this.commondropdownService.getMethodWithCache(url).subscribe((response: any) => {
      this.chargeType = response.dataList;
    });
  }
  getChargeCategory() {
    const url = "/commonList/chargeCategory";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.chargeCategoryList = response.dataList;
        // console.log('this.chargeCategoryList', this.chargeCategoryList)
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

  chargeValueSentence = "";
  taxUpRange = "";

  taxRang(event:any) {
    let taxData: any = [];
    let slabList: any = [];
    this.taxUpRange = "";
    this.chargeValueSentence = "";
    let id = event.value;

    let url = "/taxes/" + id;
    this.chargeManagementService.getMethod(url).subscribe((response: any) => {
      taxData = response.taxData;
      if (taxData.taxtype == "SLAB") {
        slabList = taxData.slabList;
        let index = slabList.length - 1;
        this.taxUpRange = slabList[index].rangeUpTo;
        if (this.viewChargeListData.price > this.taxUpRange) {
          this.chargeValueSentence = "The charge value is not in range with added tax.";
        } else {
          this.chargeValueSentence = "";
        }
      }
    });
  }
  getTaxDataList() {
    const url = "/taxes/all";
    this.chargeManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.taxListData = response.taxlist;
        // console.log(' this.taxListData', this.taxListData)
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
  eventChargeType(e:any) {
    if (e.value == "ADVANCE" || e.value == "RECURRING") {
      this.chargeGroupForm.get("royalty_payable")?.setValidators([Validators.required]);
      this.chargeGroupForm.get("royalty_payable")?.updateValueAndValidity();
    } else {
      this.chargeGroupForm.get("royalty_payable")?.clearValidators();
      this.chargeGroupForm.get("royalty_payable")?.updateValueAndValidity();
    }
  }
  onKey(e: any) {
    if (this.taxUpRange) {
      if (this.chargeGroupForm.value.actualprice > this.taxUpRange) {
        this.chargeValueSentence = "The charge value is not in range with added tax.";
      } else {
        this.chargeValueSentence = "";
      }
    }
  }
  saveChargeDto() {
    this.submitted = true;
    if (this.chargeGroupForm.valid) {
      if (this.chargeValueSentence == "") {
        //this.spinner.show();
        const url = "/charge";
        if (
          this.chargeGroupForm.value.royalty_payable == null ||
          this.chargeGroupForm.value.royalty_payable == ""
        ) {
          this.chargeGroupForm.value.royalty_payable = false;
        }
        this.createChargeData = this.chargeGroupForm.value;
        this.createChargeData.price = this.chargeGroupForm.controls['actualprice'].value;

        this.chargeFormDTO.emit(this.createChargeData);
        console.log("chargeDto inside charge compo", this.createChargeData);
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: "Charge Saved",
          icon: "far fa-check-circle",
        });
      }
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Chargeform is invalid",
        icon: "far fa-times-circle",
      });
    }
  }
  addEditCharge(chargeId:any) {
    this.submitted = true;
    if (this.chargeGroupForm.valid) {
      if (this.chargeValueSentence == "") {
        if (chargeId) {
          const url = "/charge/" + chargeId;

          if (
            this.chargeGroupForm.value.royalty_payable == null ||
            this.chargeGroupForm.value.royalty_payable == ""
          ) {
            this.chargeGroupForm.value.royalty_payable = false;
          }
          this.createChargeData = this.chargeGroupForm.value;
          this.createChargeData.price = this.chargeGroupForm.controls['actualprice'].value;
          // console.log('this.createChargeData', this.createChargeData)
          this.chargeManagementService.updateMethod(url, this.createChargeData).subscribe(
            (response: any) => {
              this.submitted = false;
              this.chargeGroupForm.reset();
              this.isChargeEdit = false;
              this.viewChargeListData = [];
              this.listView = true;
              this.createView = false;
              if (!this.searchkey) {
                this.getChargeList("");
              } else {
                this.searchCharge();
              }
              this.messageService.add({
                severity: "success",
                summary: " ",
                detail: response.msg,
                icon: "far fa-check-circle",
              });
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
        } else {
          const url = "/charge";
          if (
            this.chargeGroupForm.value.royalty_payable == null ||
            this.chargeGroupForm.value.royalty_payable == ""
          ) {
            this.chargeGroupForm.value.royalty_payable = false;
          }
          this.createChargeData = this.chargeGroupForm.value;
          this.createChargeData.price = this.chargeGroupForm.controls['actualprice'].value;
          // console.log('this.createChargeData', this.createChargeData)
          this.chargeManagementService.postMethod(url, this.createChargeData).subscribe(
            (response: any) => {
              this.submitted = false;
              this.chargeGroupForm.reset();
              this.listView = true;
              this.createView = false;

              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle",
              });
              if (!this.searchkey) {
                this.getChargeList("");
              } else {
                this.searchCharge();
              }
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
      }
    }
  }

  searchCharge() {
    this.chargeTypeGetDataData = [];
    if (!this.searchkey || this.searchkey !== this.chargeOptionname.trim()) {
      this.currentPageChargeListdata = 1;
    }
    this.searchkey = this.chargeOptionname;
    if (this.showItemPerPage == 1) {
      this.ChargeListdataitemsPerPage = this.pageITEM;
    } else {
      this.ChargeListdataitemsPerPage = this.showItemPerPage;
    }

    this.searchData.filters[0].filterValue = this.chargeOptionname.trim();
    this.searchData.filters[0].filterColumn = "any";
    this.searchData.filters[0].filterDataType = "any";
    this.searchData.page = this.currentPageChargeListdata;
    this.searchData.pageSize = this.ChargeListdataitemsPerPage;

    const url = "/charge/search";
    this.chargeManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.chargeListData = response.chargelist;
        let chargeData = response.chargelist;
        this.ChargeListdatatotalRecords = response.pageDetails.totalRecords;

        if (this.showItemPerPage > this.ChargeListdataitemsPerPage) {
          this.totalDataListLength = chargeData.length % this.showItemPerPage;
        } else {
          this.totalDataListLength = chargeData.length % this.ChargeListdataitemsPerPage;
        }

        this.chargeListData.forEach((element:any, index:any) => {
          this.chargeType.forEach((data, j) => {
            if (element.chargetype == data.value) {
              this.chargeTypeGetDataData.push(data.text);
              console.log("chargeTypeGetDataData", this.chargeTypeGetDataData);
            }
          });
        });
      },
      (error: any) => {
        if (error.error.status == 404) {
          this.chargeListData = [];
          this.ChargeListdatatotalRecords = 0;
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
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
    // } else {
    //   this.getChargeList('')
    // }
  }
  getChargeList(list:any) {
    this.chargeTypeGetDataData = [];
    let size;
    let page_list = this.currentPageChargeListdata;
    this.searchkey = "";
    if (list) {
      size = list;
      this.ChargeListdataitemsPerPage = list;
    } else {
      // if (this.showItemPerPage == 1) {
      //   this.ChargeListdataitemsPerPage = this.pageITEM
      // } else {
      //   this.ChargeListdataitemsPerPage = this.showItemPerPage
      // }
      size = this.ChargeListdataitemsPerPage;
    }

    const url = "/charge/list";
    let chargedata = {
      page: page_list,
      pageSize: size,
    };
    this.chargeManagementService.postMethod(url, chargedata).subscribe(
      (response: any) => {
        this.chargeListData = response.chargelist;
        let chargeData = response.chargelist;
        // if (this.showItemPerPage > this.ChargeListdataitemsPerPage) {
        //   this.totalDataListLength = chargeData.length % this.showItemPerPage
        // } else {
        //   this.totalDataListLength =
        //     chargeData.length % this.ChargeListdataitemsPerPage
        // }
        this.ChargeListdatatotalRecords = response.pageDetails.totalRecords;

        this.chargeListData.forEach((element:any, index:any) => {
          this.chargeType.forEach((data, j) => {
            if (element.chargetype == data.value) {
              this.chargeTypeGetDataData.push(data.text);
            } else if (element.chargetype == "ADVANCE_RECURRING") {
              this.chargeTypeGetDataData.push("Advance Recurring");
            }
          });
        });
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
}
