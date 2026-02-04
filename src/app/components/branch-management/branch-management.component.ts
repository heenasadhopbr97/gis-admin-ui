import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray, AbstractControl } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import * as RadiusConstants from "../../RadiusUtils/RadiusConstants";
import { LoginService } from "../../service/login.service";
import { AclClassConstants } from "../../constants/aclClassConstants";
import { AclConstants } from "../../constants/aclOperationConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { BranchManagementService } from "./branch-management.service";
import { Observable, Observer } from "rxjs";
import { CustomerService } from "src/app/service/customer.service";
import { MASTERS } from "src/app/constants/aclConstants";
import { WhiteeSpaceValidator } from "../shared/custom-validators";

@Component({
    selector: "app-branch-management",
    templateUrl: "./branch-management.component.html",
    styleUrls: ["./branch-management.component.css"],
    standalone: false
})
export class BranchManagementComponent implements OnInit {
  branchFormGroup!: FormGroup;
  submitted: boolean = false;
  branchData: any = [];
  branchDataDetailsShow: boolean = false;
  branchListData: any;
  isEdit: boolean = false;
  viewListData: any;
  editServiceAreaList: any = [];
  currentPageSlab = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  totalRecords: any;
  serviceData: any;
  searchName: any = "";
  searchData: any;
  AclClassConstants;
  AclConstants;
  serviceCommonFromGroup!: FormGroup;
  serviceCommisionSubmitted: boolean = false;
  serviceCommonListFromArray!: FormArray;
  serviceSelectList: any = [];
  planserviceData: any = [];
  planserviceCopyData: any = [];

  serviceitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  servicetotalRecords!: any;
  currentPageservice = 1;
  serviListName: any = [];
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  statusOptions = RadiusConstants.status;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey!: string;
  viewBranchListData: any = [];
  branchDataDetails: any;
  serviceArea:any[] = [];
  serviceAreaDropdownList: any = [];
  revenueSharingData = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];
  public loginService: LoginService;
  dunningData: any;
  serviceAreaModal: boolean = false;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private branchManagementService: BranchManagementService,
    private customerServiceManagement: CustomerService,
    public commondropdownService: CommondropdownService,
    loginService: LoginService
  ) {
    this.createAccess = loginService.hasPermission(MASTERS.BRANCH_CREATE);
    this.deleteAccess = loginService.hasPermission(MASTERS.BRANCH_DELETE);
    this.editAccess = loginService.hasPermission(MASTERS.BRANCH_EDIT);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    // this.isEdit = !this.createAccess && this.editAccess ? true : false;
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
    this.branchFormGroup = this.fb.group({
      name: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
      serviceAreaIdsList: ["", Validators.required],
      status: ["", Validators.required],
      branch_code: [""],
      revenue_sharing: ["", Validators.required],
      dunningDays: [""],
      branchServiceMappingEntityList: (this.serviceCommonListFromArray = this.fb.array([])),
    });

    this.serviceCommonFromGroup = this.fb.group({
      branchId: [""],
      serviceId: ["", Validators.required],
      revenueShareper: ["", [Validators.required, Validators.min(0), Validators.max(100)]],
    });

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
    const serviceArea = localStorage.getItem("serviceArea");
    let serviceAreaArray = serviceArea ? JSON.parse(serviceArea) : [];

    // if (serviceAreaArray.length !== 0) {
    //   this.commondropdownService.filterserviceAreaList();
    // } else {
    this.commondropdownService.getserviceAreaList();
    // }
    this.getListData("");
    this.getDunningDays();
    this.branchDataDetailsShow = false;
    this.getserviceArea();
    this.commondropdownService.getplanservice();
    this.getplanservice();
  }

  branchAllDetails(branch:any) {
    this.branchDataDetails = branch;
    this.branchDataDetails.branchServiceMappingEntityList.forEach((element:any, index:any) => {
      this.commondropdownService.planserviceData.forEach((data:any, index:any) => {
        if (element.serviceId == data.id) {
          this.serviListName.push(data.name);
        }
      });
    });
    this.branchDataDetailsShow = true;
  }
  openModel() {
    this.serviceAreaModal = true;
  }
  closeModal() {
    this.serviceAreaModal = false;
  }
  revenueSharingEvent(e:any) {
    if (e.value == true) {
      this.branchFormGroup
        .get("branchServiceMappingEntityList")!
        .setValidators([Validators.required]);
      this.branchFormGroup.get("branchServiceMappingEntityList")?.updateValueAndValidity();
    } else {
      this.serviceCommonFromGroup.reset();
      // this.serviceCommonListFromArray.controls = [];
      this.branchFormGroup.get("branchServiceMappingEntityList")?.clearValidators();
      this.branchFormGroup.get("branchServiceMappingEntityList")?.updateValueAndValidity();
    }
  }

  getserviceArea() {
    let data = [];
    const url = "/serviceArea/serviceAreaListWhereBranchIsNotBind";
    this.serviceAreaDropdownList = [];
    this.branchManagementService.getMethod(url).subscribe((response: any) => {
      // if (!this.isEdit) {
      //   this.serviceAreaDropdownList = response.dataList;
      //   //this.branchFormGroup.reset()
      //   console.log(this.serviceAreaDropdownList);
      // } else {
      //   data = response.dataList;
      //   this.serviceAreaDropdownList = data.concat(this.editServiceAreaList);
      // }
     if (response.dataList) {
       const processedData = response.dataList.map((item: any) => ({
        id: item.id,
        name: item.name,
        isUnderDevelopment: item.status === "UnderDevelopment",
      }));
      this.serviceAreaDropdownList.push(...processedData);
    }
    });
  }
  addEdit(id:any) {
    this.submitted = true;
    let allowSubmit = false;
    if (this.branchFormGroup.value.revenue_sharing) {
      if (this.serviceCommonListFromArray.value.length > 0) {
        this.branchFormGroup.patchValue({
          branchServiceMappingEntityList: this.serviceCommonListFromArray.value,
        });
        allowSubmit = true;
      } else {
        this.messageService.add({
          severity: "error",
          summary: "Required ",
          detail: "Atlease one service should be added",
          icon: "far fa-times-circle",
        });
      }
    } else {
      this.branchFormGroup.patchValue({
        branchServiceMappingEntityList: null,
      });
      allowSubmit = true;
    }
    if (this.branchFormGroup.valid && allowSubmit === true) {
      if (id) {
        const url = "/branchManagement/update";
        this.branchData = this.branchFormGroup.value;
        this.branchData.id = id;
        this.branchManagementService.postMethod(url, this.branchData).subscribe(
          (response: any) => {
            if (response.responseCode == 406 || response.responseCode == 405) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.responseMessage,
                icon: "far fa-times-circle",
              });
            } else {
              this.submitted = false;
              this.isEdit = false;
              this.commondropdownService.clearCache("/branchManagement/all");
              this.getserviceArea();
              this.branchFormGroup.reset();
              this.serviceCommonFromGroup.reset();
              this.serviceCommisionSubmitted = false;
              this.serviceCommonListFromArray.controls = [];
              this.branchFormGroup.controls['status'].setValue("");
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle",
              });
              this.submitted = false;
              //   this.getserviceArea();
              if (this.searchkey) {
                this.search();
              } else {
                this.getListData("");
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
      } else {
        const url = "/branchManagement/save";
        this.branchData = this.branchFormGroup.value;
        this.branchManagementService.postMethod(url, this.branchData).subscribe(
          (response: any) => {
            if (
              response.responseCode == 406 ||
              response.responseCode == 405 ||
              response.responseCode == 417
            ) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.responseMessage,
                icon: "far fa-times-circle",
              });
            } else {
              this.submitted = false;
              this.commondropdownService.clearCache("/branchManagement/all");
              this.getserviceArea();
              this.branchFormGroup.reset();
              this.serviceCommonFromGroup.reset();
              this.serviceCommisionSubmitted = false;
              this.serviceCommonListFromArray.controls = [];
              this.branchFormGroup.controls['status'].setValue("");
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle",
              });
              if (this.searchkey) {
                this.search();
              } else {
                this.getListData("");
              }
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
  }

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageSlab > 1) {
      this.currentPageSlab = 1;
    }
    if (!this.searchkey) {
      this.getListData(this.showItemPerPage);
    } else {
      this.search();
    }
  }

  getListData(list:any) {
    const url = "/branchManagement";
    let size;
    this.searchkey = "";
    let pageList = this.currentPageSlab;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      size = this.itemsPerPage;
    }
    let plandata = {
      page: pageList,
      pageSize: size,
    };
    this.branchManagementService.postMethod(url, plandata).subscribe(
      (response: any) => {
        this.branchListData = response.dataList;
        this.totalRecords = response.totalRecords;

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

  edit(id:any) {
    let date1;
    let date2;
    var list = "";
    let editServiceAreaId: any = [];
    let editServiceAreaNameList: any = [];
    this.editServiceAreaList = [];
    this.serviceArea = [];
    this.serviceAreaDropdownList = [];
    this.serviceCommonFromGroup.reset();
    this.serviceCommisionSubmitted = false;
    this.serviceCommonListFromArray.controls = [];
    this.getserviceArea();
    if (id) {
      this.viewBranchListData = [];
      const url = "/branchManagement/" + id;
      this.branchManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.isEdit = true;
          this.viewListData = response.data;
          let servicAreaId:any = [];
          editServiceAreaId = this.viewListData.serviceAreaIdsList;
          editServiceAreaNameList = this.viewListData.serviceAreaNameList;
          this.viewListData.serviceAreaIdsList.forEach((id:any, i:any) => {
            this.viewListData.serviceAreaNameList.forEach((name:any, j:any) => {
              if (i == j) {
                servicAreaId.push({ name: name, id: id });
              }
            });
          });
          //   const selectedServiceAreas = this.commondropdownService.serviceAreaList.filter(item =>
          //     editServiceAreaId.includes(item.id)
          //   );
          this.serviceAreaDropdownList.push(...servicAreaId);

          this.branchFormGroup.patchValue(this.viewListData);

          this.viewListData.branchServiceMappingEntityList.forEach((element:any) => {
            this.serviceCommonListFromArray.push(
              this.fb.group({
                serviceId: [element.serviceId],
                revenueShareper: [element.revenueShareper],
                id: [element.id],
                branchId: [element.branchId],
              })
            );

            this.serviceSelectList.push(element.serviceId);
            this.planserviceData.forEach((ele:any, index:any) => {
              if (ele.id == element.serviceId) {
                this.planserviceData.splice(index, 1);
              }
            });
          });
          //this.branchFormGroup.patchValue({serviceAreaIdsList: this.viewListData.serviceAreaIdsList});
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

  search() {
    this.branchDataDetailsShow = false;

    if (!this.searchkey || this.searchkey !== this.searchName) {
      this.currentPageSlab = 1;
    }
    this.searchkey = this.searchName;
    if (this.showItemPerPage) {
      this.itemsPerPage = this.showItemPerPage;
    }
    this.searchData.filter[0].filterValue = this.searchName.trim();

    const url = `/branchManagement/search?page=${this.currentPageSlab}&pageSize=${this.itemsPerPage}&sortBy=id&sortOrder=0`;
    this.branchManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        if (response.responseCode == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
          this.branchListData = [];
          this.totalRecords = response.totalRecords;
        } else {
          this.branchListData = response.dataList;
          this.totalRecords = response.totalRecords;
        }
      },
      (error: any) => {
        this.totalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
          this.branchListData = [];
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

  clearSearch() {
    this.branchDataDetailsShow = false;
    this.searchName = "";
    this.searchkey = "";
    this.getListData("");
    this.submitted = false;
    this.isEdit = false;
    this.branchFormGroup.reset();
    this.serviceCommonFromGroup.reset();
    this.serviceCommisionSubmitted = false;
    this.serviceCommonListFromArray.controls = [];
    this.branchFormGroup.controls['status'].setValue("");
    this.getserviceArea();
  }

  canExit() {
    if (!this.branchFormGroup.dirty) return true;
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
  deleteConfirmon(id: number) {
    if (id) {
      this.confirmationService.confirm({
        message: "Do you want to delete this branch?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          let data: any;

          const url1 = "/branchManagement/" + id;
          this.branchManagementService.getMethod(url1).subscribe(
            (response: any) => {
              data = response.data;
              this.delete(data);
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

  delete(data:any) {
    const url = "/branchManagement/delete";
    this.branchManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        if (this.currentPageSlab != 1 && this.branchListData.length == 1) {
          this.currentPageSlab = this.currentPageSlab - 1;
        }
        this.clearSearch();
        if (
          response.responseCode == 405 ||
          response.responseCode == 406 ||
          response.responseCode == 417
        ) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        } else {
          this.getserviceArea();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle",
          });
        }
        if (this.searchkey) {
          this.search();
        } else {
          this.getListData("");
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

  pageChangedList(pageNumber:any) {
    this.currentPageSlab = pageNumber;
    if (this.searchkey) {
      this.search();
    } else {
      this.getListData("");
    }
  }

  getServiceAreaNameFromId(serviceAreaId:any) {
    var filterData = this.commondropdownService.serviceAreaList.filter(
      (serviceArea:any) => serviceArea.id == serviceAreaId
    );
    if (filterData != null && filterData.length > 0) return filterData[0].name;
    else return "";
  }

  getDunningDays() {
    const url = "/commonList/dunningDays";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.dunningData = response.dataList;

        this.searchkey = "";
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
  sharingPercentageValidation(event:any) {
    var num = String.fromCharCode(event.which);
    if (!/[0-9]/.test(num)) {
      event.preventDefault();
    }
  }

  createServiceCommissionFormGroup(): FormGroup {
    return this.fb.group({
      id: [""],
      serviceId: [this.serviceCommonFromGroup.value.serviceId],
      revenueShareper: [this.serviceCommonFromGroup.value.revenueShareper],
    });
  }

  onAddServiceCommissionField() {
    this.serviceCommisionSubmitted = true;
    if (this.serviceCommonFromGroup.valid) {
      this.serviceSelectList.push(this.serviceCommonFromGroup.value.serviceId);
      this.serviceCommonListFromArray.push(this.createServiceCommissionFormGroup());
      this.planserviceData.forEach((element:any, index:any) => {
        if (element.id == this.serviceCommonFromGroup.value.serviceId) {
          this.planserviceData.splice(index, 1);
        }
      });
      this.serviceCommonFromGroup.reset();
      this.serviceCommisionSubmitted = false;
    }
  }

  deleteConfirmonServiceCommisiionField(index: number, idService: any) {
    this.serviceCommonListFromArray.removeAt(index);
    this.serviceSelectList.splice(index, 1);
    this.commondropdownService.planserviceData.forEach((element:any, index:any) => {
      if (element.id == idService.value.serviceId) {
        this.planserviceData.push(element);
      }
    });
  }

  getplanservice() {
    const url = "/planservice/all";
    this.customerServiceManagement.getMethod(url).subscribe(
      (response: any) => {
        this.planserviceData = response.serviceList;
        this.planserviceCopyData = response.serviceList;
      },
      (error: any) => {}
    );
  }

  pageChangedServiceCommission(pageNumber:any) {
    this.currentPageservice = pageNumber;
  }
}
