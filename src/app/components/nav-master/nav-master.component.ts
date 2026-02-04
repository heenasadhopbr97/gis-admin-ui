import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable, Observer } from "rxjs";
import * as RadiusConstants from "../../RadiusUtils/RadiusConstants";
import { NavMasterService } from "./nav-master.service";
// import { element } from "protractor";
import { CommondropdownService } from "src/app/service/commondropdown.service";

@Component({
    selector: "app-nav-master",
    templateUrl: "./nav-master.component.html",
    styleUrls: ["./nav-master.component.css"],
    standalone: false
})
export class NavMasterComponent implements OnInit {
  title = "NAV Master";
  createForm: FormGroup;

  listView: boolean = true;
  createView: boolean = false;

  searchNAVMasterCasName: string = "";

  searchkey: string;

  currentPageNAVMatserListdata = 1;
  navMasterListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  navMasterListdatatotalRecords: any;
  navMasterListData: any = [];
  navMasterListDataselector: any;
  pageLimitOptionsNAVMaster = RadiusConstants.pageLimitOptions;
  pageITEMNAVMaster = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPageNAVMaster = RadiusConstants.ITEMS_PER_PAGE;
  navMasterListDatalength = 0;

  searchData: any;

  submitted: boolean = false;
  isCasEdit: boolean = false;

  navMasterAggregationParamMappingFormgroup: FormGroup;
  navMasterAggregationParamMappingList: FormArray;
  navAggregationParamSubmit: boolean;
  currentPageparameter: any;
  parameterItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  parametertotalRecords: number;
  casData: any;

  viewData: any;

  statusOptions = RadiusConstants.status;
  batchNameList = RadiusConstants.status;
  aggregationFreOption = RadiusConstants.status;
  aggregationOption = RadiusConstants.status;

  reportView = false;
createAccess: any;
editAccess: any;
deleteAccess: any;

  constructor(
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private navMasterService: NavMasterService,
    private messageService: MessageService,
    public commondropdownService: CommondropdownService
  ) {
    this.commondropdownService
      .getMethodWithCache("/commonList/generic/AGGREGATION_FREQUENCY")
      .subscribe((response: any) => {
        this.aggregationFreOption = response.dataList;
      });
    this.commondropdownService
      .getMethodWithCache("/commonList/generic/BATCH_NAME_NAV")
      .subscribe((response: any) => {
        this.batchNameList = response.dataList;
      });
    this.commondropdownService
      .getMethodWithCache("/commonList/generic/AGGREGATION_PARAM")
      .subscribe((response: any) => {
        this.aggregationOption = response.dataList;
      });
  }

  getControl(row: AbstractControl, controlName: string): FormControl {
    if (row instanceof FormGroup) {
      const ctrl = row.get(controlName);
      if (ctrl instanceof FormControl) {
        return ctrl;
      }
    }
    return new FormControl('');
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
      page: "",
      pageSize: "",
    };
    this.createForm = this.fb.group({
      userName: ["", Validators.required],
      serviceName: ["", Validators.required],
      pwd: ["", Validators.required],
      url: ["", Validators.required],
      status: ["", Validators.required],
      id: [""],
      aggregationFrequency: ["", Validators.required],
      batchName: ["", Validators.required],
      navMasterAggregationParamMappingList: (this.navMasterAggregationParamMappingList =
        this.fb.array([])),
    });
    this.navMasterAggregationParamMappingFormgroup = this.fb.group({
      id: [""],
      navMasterId: [""],
      paramName: ["", Validators.required],
    });
    this.getNavMasterList("");
  }

  canExit() {
    if (!this.createForm.dirty) {
      return true;
    }
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

  search() {
    if (!this.searchkey || this.searchkey !== this.searchNAVMasterCasName) {
      this.currentPageNAVMatserListdata = 1;
    }
    this.searchkey = this.searchNAVMasterCasName;
    if (this.showItemPerPageNAVMaster) {
      this.showItemPerPageNAVMaster = this.showItemPerPageNAVMaster;
    }
    this.searchData.filter[0].filterValue = this.searchNAVMasterCasName.trim();
    this.searchData.page = this.currentPageNAVMatserListdata;
    this.searchData.pageSize = this.showItemPerPageNAVMaster;
    const url =
      "/navMaster/search?page=" +
      this.currentPageNAVMatserListdata +
      "&pageSize=" +
      this.showItemPerPageNAVMaster +
      "&sortBy=createdate&sortOrder=0";
    this.navMasterService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.navMasterListData = response.dataList;
      },
      (error: any) => {
        this.navMasterListdatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
          this.navMasterListData = [];
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

  clear() {
    this.searchNAVMasterCasName = "";
    this.searchkey = "";
    this.getNavMasterList("");
    this.submitted = false;
    this.isCasEdit = false;
    this.createForm.reset();
  }

  getNavMasterList(list:any) {
    const url = "/navMaster";
    let size;
    this.searchkey = "";
    let pageList = this.currentPageNAVMatserListdata;
    if (list) {
      size = list;
      this.showItemPerPageNAVMaster = list;
    } else {
      size = this.showItemPerPageNAVMaster;
    }
    let plandata = {
      page: pageList,
      pageSize: size,
    };
    this.navMasterService.postMethod(url, plandata).subscribe(
      (response: any) => {
        this.navMasterListData = response.dataList;
        // this.casMapping = this.casListData[0].navMasterMappings;
        this.navMasterListdatatotalRecords = response.totalRecords;

        this.searchkey = "";
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

  create() {
    this.listView = false;
    this.reportView = false;
    this.createView = true;
    this.submitted = false;
    this.isCasEdit = false;
    this.createForm.reset();
    this.navMasterAggregationParamMappingList = this.fb.array([]);
    // this.casFormGroup.controls.status.setValue("");
    // this.casParameterMappingsFromArray = this.fb.array([]);
    // this.casParameterMappingsfromgroup.reset();
  }

  refreshList() {
    this.listView = true;
    this.createView = false;
    this.reportView = false;
    this.getNavMasterList("");
    this.navMasterAggregationParamMappingList = this.fb.array([]);
  }

  pageChangedNAVMasterList(pageNumber:any) {
    this.currentPageNAVMatserListdata = pageNumber;
    if (this.searchkey) {
      this.search();
    } else {
      this.getNavMasterList("");
    }
  }

  TotalItemPerPage(event:any) {
    this.showItemPerPageNAVMaster = Number(event.value);
    if (this.currentPageNAVMatserListdata > 1) {
      this.currentPageNAVMatserListdata = 1;
    }
    if (!this.searchkey) {
      this.getNavMasterList(this.showItemPerPageNAVMaster);
    } else {
      this.search();
    }
  }

  createParameterMappingFormGroup(): FormGroup {
    return this.fb.group({
      id: [
        this.navMasterAggregationParamMappingFormgroup.value.id
          ? this.navMasterAggregationParamMappingFormgroup.value.id
          : "",
      ],
      navMasterId: [
        this.navMasterAggregationParamMappingFormgroup.value.navMasterId
          ? this.navMasterAggregationParamMappingFormgroup.value.navMasterId
          : "",
      ],
      paramName: [this.navMasterAggregationParamMappingFormgroup.value.paramName],
    });
  }

  onAddParameterMappingList(): void {
    this.navAggregationParamSubmit = true;
    if (this.navMasterAggregationParamMappingFormgroup.valid) {
      console.log(this.navMasterAggregationParamMappingList.value);
      let index = this.navMasterAggregationParamMappingList.value.findIndex(
        (element:any) =>
          element.paramName ==
          this.navMasterAggregationParamMappingFormgroup.controls['paramName'].value
      );
      if (index >= 0) {
        this.messageService.add({
          severity: "info",
          summary: "Information",
          detail: "Parameter already added.",
        });
        return;
      } else {
        this.navMasterAggregationParamMappingList.push(this.createParameterMappingFormGroup());
        this.navMasterAggregationParamMappingFormgroup.reset();

        this.navAggregationParamSubmit = false;
      }
    }
  }

  pageChangedParameterMappingList(pageNumber:any) {
    this.currentPageparameter = pageNumber;
  }

  deleteConfirmonParameterMappingList(index:any) {
    this.confirmationService.confirm({
      message: "Do you want to delete this Paramater?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.onRemoveparameter(index);
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

  async onRemoveparameter(chargeFieldIndex: number) {
    this.navMasterAggregationParamMappingList.removeAt(chargeFieldIndex);
  }

  addEditCas(id:any) {
    this.submitted = true;
    if (this.createForm.valid) {
      if (id) {
        const url = "/navMaster/update";
        this.createForm.value.navMasterAggregationParamMappingList =
          this.navMasterAggregationParamMappingList.value;
        this.casData = this.createForm.value;
        this.casData.id = id;
        this.navMasterService.postMethod(url, this.casData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.isCasEdit = false;
            this.createForm.reset();
            this.navMasterAggregationParamMappingList = this.fb.array([]);
            this.navMasterAggregationParamMappingFormgroup.reset();
            this.listView = true;
            this.createView = false;
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle",
            });
            this.submitted = false;
            if (this.searchkey) {
              this.search();
            } else {
              this.getNavMasterList("");
            }
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
      } else {
        const url = "/navMaster/save";
        this.createForm.value.navMasterAggregationParamMappingList =
          this.navMasterAggregationParamMappingList.value;
        this.casData = this.createForm.value;
        this.casData.delete = false;
        this.casData.isDelete = false;
        this.navMasterService.postMethod(url, this.casData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.createForm.reset();
            this.navMasterAggregationParamMappingList = this.fb.array([]);
            this.navMasterAggregationParamMappingFormgroup.reset();
            this.listView = true;
            this.createView = false;
            if (this.searchkey) {
              this.search();
            } else {
              this.getNavMasterList("");
            }

            if (response.responseCode !== 200) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
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
    }
  }

  edit(id:any, editCondtion: boolean) {
    this.listView = false;
    this.createView = true;
    this.navMasterAggregationParamMappingList = this.fb.array([]);
    this.navMasterAggregationParamMappingFormgroup.reset();
    this.createForm.reset();
    if (id) {
      //this.spinner.show();
      const url = "/navMaster/" + id;
      this.navMasterService.getMethod(url).subscribe(
        (response: any) => {
          this.viewData = response.data;
          if (editCondtion) {
            this.isCasEdit = true;
            this.createForm.patchValue(this.viewData);
            if (this.viewData.navMasterAggregationParamMappingList.length > 0) {
              this.viewData.navMasterAggregationParamMappingList.forEach((element:any) => {
                this.navMasterAggregationParamMappingList.push(
                  this.fb.group({
                    id: [element.id],
                    navMasterId: [element.navMasterId],
                    paramName: [element.paramName],
                  })
                );
              });
            }
          } else {
            if (this.viewData) {
              this.reportView = true;
              this.listView = false;
              this.createView = false;
            }
          }
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
  }

  TotalItemPerPageAggreagtion(event:any) {
    this.parameterItemPerPage = Number(event.value);
    this.currentPageparameter = 1;
  }
}
