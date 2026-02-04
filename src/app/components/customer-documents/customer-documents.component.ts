import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { CustomerDocumentService } from "./customer-document.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { ActivatedRoute, Router } from "@angular/router";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
// import { saveAs as importedSaveAs } from "file-saver";
import { BehaviorSubject } from "rxjs";
import { PaymentamountService } from "../../service/paymentamount.service";
import { Location } from "@angular/common";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { LoginService } from "src/app/service/login.service";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
import { TableRadioButton } from "primeng/table";

declare var $: any;

@Component({
    selector: "app-customer-documents",
    templateUrl: "./customer-documents.component.html",
    styleUrls: ["./customer-documents.component.css"],
    standalone: false
})
export class CustomerDocumentsComponent implements OnInit {
  currentPage: number = 1;
  itemsPerPage: number = RadiusConstants.ITEMS_PER_PAGE;
  totalRecords: number;

  custmerDocList: any = [];
  custmerDoc: any = {};
  isCustmerDocList: boolean = true;
  isCustmerDocCreateOrEdit: boolean = false;
  assignCustomerDocumentForApproval: boolean = false;
  ApproveRejectModal: boolean = false;

  submitted = false;
  editMode: boolean = false;

  insertCustomerDocumentForm: FormGroup;
  custDocId: any;
  custId: any;
  BASE_API_URL: any;
  currentDate = new Date();
  maxDate = "2090-04-14";
  minDate: any = "2023-08-28";
  public docTypeForCustomerList: any[] = [
    {
      text: "",
      id: ""
    }
  ];

  public docSubTypeList: any = [];

  documentStatusList: any[];

  VerificationModeValue: any = [];

  documentverifyData: any = [];

  ifModeInput = false;
  ifDocumentNumber = false;
  labelname: any;
  isEnableStatus: boolean = false;
  ifModelIsShow: boolean = false;
  editAccess: boolean = false;
  deleteAccess: boolean = false;
  createAccess: boolean = false;
  downloadDocAccess: boolean = false;
  isstatus = false;
  docTypeList: any[] = [];
  custmerType: string;
  staffID: number;
  assignDocForm: FormGroup;
  assignPlansubmitted:any;

  assignStaffListData:any[] = [];

  assignedStaff: any;
  assignPlanForm:any;
  assignDocSubmitted = false;

  auditcustid = new BehaviorSubject({
    auditcustid: "",
    checkHierachy: "",
    planId: ""
  });
  customer: any;
  custType: string;
  approved: boolean;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private customerDocumentService: CustomerDocumentService,
    private route: ActivatedRoute,
    private radiusUtility: RadiusUtility,
    public router: Router,
    public PaymentamountService: PaymentamountService,
    private _location: Location,
    public commondropdownService: CommondropdownService,
    loginService: LoginService
  ) {
    this.custType = this.route.snapshot.paramMap.get("custType")!;
    this.editAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.DOCS_PRE_CUST_EDIT
        : POST_CUST_CONSTANTS.DOCS_POST_CUST_EDIT
    );
    this.downloadDocAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_DOC_DOWNLOAD
        : POST_CUST_CONSTANTS.DOCS_POST_CUST_DOC_DOWNLOAD
    );
    this.deleteAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.DOCS_PRE_CUST_DELETE
        : POST_CUST_CONSTANTS.DOCS_POST_CUST_DELETE
    );
    this.minDate = this.currentDate;
  }

  ngOnInit(): void {
    let staffID = localStorage.getItem("userId");
    this.staffID = Number(staffID);

    this.insertCustomerDocumentForm = new FormGroup({
      docId: new FormControl(""),
      docType: new FormControl("", [Validators.required]),
      docSubType: new FormControl("", [Validators.required]),
      docStatus: new FormControl("", [Validators.required]),
      remark: new FormControl(""),
      file: new FormControl(""),
      fileSource: new FormControl(""),
      documentNumber: new FormControl(""),
      mode: new FormControl("", [Validators.required]),
      startDate: new FormControl(""),
      endDate: new FormControl("")
    });
    this.insertCustomerDocumentForm.get("startDate").valueChanges.subscribe(startDateValue => {
      const endDateControl = this.insertCustomerDocumentForm.get("endDate");

      if (startDateValue) {
        endDateControl.setValidators([Validators.required]);
      } else {
        endDateControl.clearValidators();
      }
      endDateControl.updateValueAndValidity();
    });
    this.assignDocForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.BASE_API_URL = this.customerDocumentService.getUrl();
    let id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.custId = id;
      this.getAll();
      this.getSingleCustomerData();
    }

    this.getDocStatusList();
    this.getDocTypeForCustomerList();
    this.verification_Mode();
  }

  verification_Mode() {
    this.VerificationModeValue = [];

    let url = `/commonList/custdocverificationmode`;
    this.commondropdownService.getMethodWithCache(url).subscribe((response: any) => {
      this.VerificationModeValue = response.dataList;
    });
  }

  docTypevalue = "";

  documentType(value:any) {
    this.docTypevalue = value;
    this.docTypeList = [];
    let url = `/commonList/custdocverificationmodes?mode=` + value.toLowerCase();
    //TODO need to below api in cache
    this.commondropdownService.getMethod(url).subscribe((response: any) => {
      this.docTypeList = response.dataList;
    });

    if (value == "Online") {
      this.insertCustomerDocumentForm.patchValue({
        docStatus: "padding"
      });
      this.insertCustomerDocumentForm.controls['docType'].setValue(null);
      this.insertCustomerDocumentForm.controls['docSubType'].setValue(null);
      this.ifModeInput = true;
      this.isEnableStatus = false;
      this.isstatus = true;
      this.ifModeInput = true;
      this.insertCustomerDocumentForm.get("documentNumber").setValidators([Validators.required]);
      this.insertCustomerDocumentForm.get("documentNumber").updateValueAndValidity();

      this.insertCustomerDocumentForm.get("file").clearValidators();
      this.insertCustomerDocumentForm.get("file").updateValueAndValidity();

      this.insertCustomerDocumentForm.get("fileSource").clearValidators();
      this.insertCustomerDocumentForm.get("fileSource").updateValueAndValidity();
    } else {
      this.ifModeInput = false;
      this.docTypeList = this.docTypeForCustomerList;
      this.insertCustomerDocumentForm.patchValue({
        docStatus: "padding"
      });
      this.insertCustomerDocumentForm.controls['docType'].setValue(null);
      this.insertCustomerDocumentForm.controls['docSubType'].setValue(null);
      this.isEnableStatus = true;

      this.insertCustomerDocumentForm.get("file").setValidators([Validators.required]);
      this.insertCustomerDocumentForm.get("file").updateValueAndValidity();
      this.insertCustomerDocumentForm.get("fileSource").setValidators([Validators.required]);
      this.insertCustomerDocumentForm.get("fileSource").updateValueAndValidity();

      this.insertCustomerDocumentForm.get("documentNumber").clearValidators();
      this.insertCustomerDocumentForm.get("documentNumber").updateValueAndValidity();
    }
  }

  documentSubType(value:any) {
    this.docSubTypeList = [];
    let docSubType: string = value;
    let url =
      `/commonList/custdocsubtype?custdocsubtype=` +
      value.toLowerCase() +
      `&mode=` +
      this.docTypevalue.toLowerCase();
    //TODO need to below api in cache
    this.commondropdownService.getMethod(url).subscribe((response: any) => {
      this.docSubTypeList = response.dataList;
    });
  }

  getSingleCustomerData() {
    let url = "customers/" + this.custId;

    this.customerDocumentService.CustomergetMethod(url).subscribe((response: any) => {
      this.custmerType = response.customers.custtype;
      this.customer = response.customers;
    });
  }

  openCustmerDocListMenu() {
    this.clearFormData();
    this.submitted = false;
    this.isCustmerDocCreateOrEdit = false;
    this.isCustmerDocList = true;
  }

  openCustmerDocCreateMenu() {
    this.clearFormData();
    this.submitted = false;
    this.editMode = false;
    this.isCustmerDocList = false;
    this.isCustmerDocCreateOrEdit = true;
  }

  downloadDoc(filename:any, docId:any, custId:any) {
    this.customerDocumentService.downloadFile(docId, custId).subscribe(blob => {
      // importedSaveAs(blob, filename);
    });
  }

  getAll() {
    this.submitted = false;

    this.customerDocumentService.getCustomerDocumentByCustId(this.custId).subscribe(
      (response: any) => {
        this.custmerDocList = response.dataList;
        this.totalRecords = this.custmerDocList.length;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  editCustDocById(custDocId:any, index:any) {
    this.getDocTypeForCustomerList();
    this.editMode = true;
    this.isCustmerDocList = false;
    this.isCustmerDocCreateOrEdit = true;

    this.custDocId = custDocId;
    // index = this.radiusUtility.getIndexOfSelectedRecord(
    //   index,
    //   this.currentPage,
    //   this.itemsPerPage,
    // )
    // this.custmerDoc = this.custmerDocList[index]
    let status;
    // if (this.custmerDocList[index].docStatus == 'pending') {
    //   status = 'Verification Pending'
    // } else if (this.custmerDocList[index].docStatus == 'verified') {
    //   status = 'Verified'
    // } else {
    //   status = this.custmerDocList[index].docStatus
    // }

    let custDoc = this.custmerDocList.find((doc:any) => doc.docId == custDocId);
    console.log("custdoc;  ", custDoc);
    this.custmerDoc = {
      custId: custDoc.custId,
      docType: custDoc.docType,
      docSubType: custDoc.docSubType,
      docStatus: custDoc.docStatus,
      remark: custDoc.remark,
      file: custDoc.filename,
      fileSource: custDoc.filename,
      documentNumber: custDoc.documentNumber,
      mode: custDoc.mode,
      docId: custDoc.docId,
      startDate: custDoc.startDate,
      endDate: custDoc.endDate
    };
    this.documentType(custDoc.mode);
    this.docTypevalue = custDoc.mode;
    this.documentSubType(custDoc.docType);

    if (custDoc.mode == "Online") {
      this.labelname = custDoc.docSubType;
      this.ifModeInput = true;
      this.ifDocumentNumber = true;
      this.docTypeList = this.docTypeForCustomerList.filter(
        subtype => subtype.text === "Proof Of Address" || subtype.text === "Proof of Identity"
      );
      this.insertCustomerDocumentForm.get("documentNumber").setValidators([Validators.required]);
      this.insertCustomerDocumentForm.get("documentNumber").updateValueAndValidity();
    }
    this.insertCustomerDocumentForm.patchValue(this.custmerDoc);
    if (this.custmerDocList[index].mode == "Online") {
      this.insertCustomerDocumentForm.get("file").clearValidators();
      this.insertCustomerDocumentForm.get("file").updateValueAndValidity();
      this.insertCustomerDocumentForm.get("fileSource").clearValidators();
      this.insertCustomerDocumentForm.get("fileSource").updateValueAndValidity();
    }
    console.log(".......", this.custmerDoc);
  }

  deleteConfirm(custDoc:any) {
    this.confirmationService.confirm({
      message: "Do you want to delete this customer document?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.deleteCustomerDocument(custDoc);
      },
      reject: () => {
        this.messageService.add({
          severity: "info",
          summary: "Rejected",
          detail: "You have rejected"
        });
      }
    });
  }

  deleteCustomerDocument(custDoc:any) {
    this.customerDocumentService.deleteCustomerDocument(custDoc).subscribe(
      (response: any) => {
        if (response.responseCode == 500) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Permission Denied. Unable to update/delete this record",
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
        }

        this.getAll();
        this.clearFormData();
        this.openCustmerDocListMenu();
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  clearFormData() {
    this.insertCustomerDocumentForm.reset();
    this.editMode = false;
    this.submitted = false;
    this.ifModeInput = false;
    this.ifDocumentNumber = false;
    this.isEnableStatus = true;
    this.insertCustomerDocumentForm.value.docStatus = "";

    this.custmerDoc.filename = "";
    this.insertCustomerDocumentForm.get("documentNumber").clearValidators();
    this.insertCustomerDocumentForm.get("documentNumber").updateValueAndValidity();

    this.insertCustomerDocumentForm.get("file").clearValidators();
    this.insertCustomerDocumentForm.get("file").updateValueAndValidity();

    this.insertCustomerDocumentForm.get("fileSource").clearValidators();
    this.insertCustomerDocumentForm.get("fileSource").updateValueAndValidity();
  }

  getDocStatusList() {
    this.customerDocumentService.getDocStatusList().subscribe(result => {
      this.documentStatusList = result.dataList;
    });
  }

  closeParentCustt() {
    this.ifModelIsShow = false;
  }

  getDocTypeForCustomerList() {
    this.customerDocumentService.getDocTypeForCustomerList().subscribe(result => {
      this.docTypeForCustomerList = result.dataList;
    });
  }

  onChangeDocTypeForCustomerList(doc_type_for_customer_data:any) {
    this.insertCustomerDocumentForm.get("docSubType").reset();
    if (doc_type_for_customer_data) {
      this.docTypeForCustomerList.forEach(element => {
        if (element.id === doc_type_for_customer_data.id) {
          if (
            this.insertCustomerDocumentForm.value.mode === "Online" &&
            this.insertCustomerDocumentForm.value.docType === "Proof Of Address"
          ) {
            this.docSubTypeList = element.subTypeList.filter(
              (subtype:any) => subtype.text === "GST Number"
            );
          } else if (
            this.insertCustomerDocumentForm.value.mode === "Online" &&
            this.insertCustomerDocumentForm.value.docType === "Proof of Identity"
          ) {
            this.docSubTypeList = element.subTypeList.filter(
              (subtype:any) => subtype.text === "PAN Card" || subtype.text === "Aadhar Card"
            );
          } else {
            this.docSubTypeList = element.subTypeList;
          }
        }
      });
    } else {
      this.docSubTypeList = [];
    }
  }

  onFileChange(event:any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.insertCustomerDocumentForm.patchValue({
        fileSource: file
      });
      this.custmerDoc.filename = "";
      this.custmerDoc.file = "";
    }
  }

  addDocument() {
    console.log(this.insertCustomerDocumentForm);
    this.submitted = true;
    // this.insertCustomerDocumentForm.value.docStatus = "pending";
    if (this.insertCustomerDocumentForm.valid) {
      if (this.editMode) {
        this.updateCustomerDocumentOnDb();
      } else {
        this.saveCustomerDocumentOnDb();
      }
    }
  }

  saveCustomerDocumentOnDb() {
    let formData: any = new FormData();
    // if (this.insertCustomerDocumentForm.value.mode !== "Online") {

    let newFormData = Object.assign({}, this.insertCustomerDocumentForm.value);
    let docData: any = [
      {
        custId: this.custId,
        docType: newFormData.docType,
        docSubType: newFormData.docSubType,
        docStatus: newFormData.docStatus,
        remark: newFormData.remark,
        startDate: newFormData.startDate,
        mode: newFormData.mode,
        documentNumber: newFormData.documentNumber,
        endDate: newFormData.endDate,
        filename: newFormData.file?.split("\\").pop()
      }
    ];
    formData.append("file", newFormData.fileSource);
    formData.append("docDetailsList", JSON.stringify(docData));
    this.customerDocumentService.saveCustomerDocument(formData).subscribe(
      res => {
        if (res.responseCode == 406) {
          this.messageService.add({
            severity: "info",
            summary: "info",
            detail: res.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.getAll();
          this.clearFormData();
          this.openCustmerDocListMenu();

          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: res.message,
            icon: "far fa-check-circle"
          });
        }
      },
      err => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: err.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
    // }
    // else {
    //
    //   let newFormData = Object.assign({}, this.insertCustomerDocumentForm.value);
    //   let data = {
    //     custId: this.custId,
    //     docStatus: this.insertCustomerDocumentForm.value.docStatus,
    //     docSubType: this.insertCustomerDocumentForm.value.docSubType,
    //     docType: this.insertCustomerDocumentForm.value.docType,
    //     documentNumber: this.insertCustomerDocumentForm.value.documentNumber,
    //     mode: this.insertCustomerDocumentForm.value.mode,
    //     startDate: this.insertCustomerDocumentForm.value.startDate,
    //     endDate: this.insertCustomerDocumentForm.value.endDate,
    //     remark: this.insertCustomerDocumentForm.value.remark,
    //   };
    //   this.customerDocumentService.saveCustomerOnlineDocument(formData).subscribe(
    //     (res: any) => {
    //       if (res.responseCode == 406) {
    //         this.messageService.add({
    //           severity: "info",
    //           summary: "info",
    //           detail: res.responseMessage,
    //           icon: "far fa-times-circle",
    //         });
    //
    //       } else {
    //         this.getAll();
    //         this.clearFormData();
    //         this.openCustmerDocListMenu();

    //
    //         this.messageService.add({
    //           severity: "success",
    //           summary: "Successfully",
    //           detail: res.responseMessage,
    //           icon: "far fa-check-circle",
    //         });
    //       }
    //     },
    //     err => {
    //       this.messageService.add({
    //         severity: "error",
    //         summary: "Error",
    //         detail: err.error.errorMessage,
    //         icon: "far fa-times-circle",
    //       });
    //
    //     }
    //   );
    // }
  }

  updateCustomerDocumentOnDb() {
    let docData: any = [];
    let formData: any = new FormData();
    let newFormData = Object.assign({}, this.insertCustomerDocumentForm.value);
    if (newFormData.mode === "Online") {
      if (newFormData.fileSource == null || newFormData.fileSource == "") {
        newFormData.file = newFormData.file;
      } else {
        newFormData.file = newFormData.fileSource.name;
      }
      docData = {
        custId: this.custId,
        docId: this.custDocId,
        docType: newFormData.docType,
        docSubType: newFormData.docSubType,
        docStatus: newFormData.docStatus,
        remark: newFormData.remark,
        filename: newFormData.file,
        uniquename: newFormData.uniquename,
        mode: newFormData.mode,
        startDate: newFormData.startDate,
        endDate: newFormData.endDate,
        documentNumber: newFormData.documentNumber
      };
      this.customerDocumentService.updateCustomerOnlineDocument(docData).subscribe(
        (res: any) => {
          if (res.responseCode == 406) {
            this.messageService.add({
              severity: "info",
              summary: "info",
              detail: res.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            this.getAll();
            this.clearFormData();
            this.openCustmerDocListMenu();
            this.isEnableStatus = false;
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: res.message,
              icon: "far fa-check-circle"
            });
          }
        },
        err => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: err.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      );
    } else {
      docData = {
        custId: this.custId,
        docId: this.custDocId,
        docType: newFormData.docType,
        docSubType: newFormData.docSubType,
        docStatus: newFormData.docStatus,
        remark: newFormData.remark,
        filename: newFormData.fileSource.name ? newFormData.fileSource.name : newFormData.file,
        uniquename: newFormData.uniquename,
        startDate: newFormData.startDate,
        endDate: newFormData.endDate,
        mode: newFormData.mode,
        staffId: localStorage.getItem("userId")
      };
      newFormData.file = newFormData.fileSource.name;
      if (newFormData.file) {
        docData.filename = newFormData.file.split("\\").pop();
      }
      formData.append("file", newFormData.fileSource);
      formData.append("docDetailsList", JSON.stringify(docData));
      this.customerDocumentService.updateCustomerDocument(formData).subscribe(
        res => {
          if (res.responseCode == 406) {
            this.messageService.add({
              severity: "info",
              summary: "info",
              detail: res.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            this.getAll();
            this.clearFormData();
            this.openCustmerDocListMenu();
            this.isEnableStatus = false;
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: res.message,
              icon: "far fa-check-circle"
            });
          }
        },
        err => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: err.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }

  listCustomer() {
    this._location.back();
    // if (this.custmerType == "Prepaid") {
    //   if (this.customer.status === "NewActivation") {
    //     this.router.navigate(["/home/prepaid-customer-caf"]);
    //   } else {
    //     this.router.navigate(["/home/prepaid-customer"]);
    //   }
    // } else {
    //   if (this.customer.status === "NewActivation") {
    //     this.router.navigate(["/home/customer-caf"]);
    //   } else {
    //     this.router.navigate(["/home/customer"]);
    //   }
    // }
  }

  remark: string;
  remarksubmit = false;
  approveDataobj: any;

  addRemark(data: any) {
    this.approveDataobj = data;
    $("#remarkModal").modal("show");
  }

  approvedCustDoc(doc:any) {
    this.customerDocumentService.approvedCustDoc(doc.docId, "verified").subscribe(
      (response: any) => {
        console.log(response);
        $("#remarkModal").modal("hide");
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: "Document approved successfully.",
          icon: "far fa-check-circle"
        });
        this.getAll();
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  // DocumentVerify(data) {
  //   this.spinner.show()
  //   const url = 'customers/' + data.custId

  //   let documentNumber: ''
  //   this.customerDocumentService.CustomergetMethod(url).subscribe(
  //     (response: any) => {
  //       if (data.docSubType == 'Pan Card') {
  //         documentNumber = response.customers.pan
  //       }
  //       if (data.docSubType == 'GST Number') {
  //         documentNumber = response.customers.gst
  //       }
  //       if (data.docSubType == 'Aadhaar Card') {
  //         documentNumber = response.customers.aadhar
  //       }

  //       this.documentverifyData = {
  //         docId: data.docId,
  //         documentNumber: documentNumber,
  //         documentType: data.docSubType,
  //       }
  //       this.verifyDocument(this.documentverifyData)
  //     },
  //     (error: any) => {
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: error.error.ERROR,
  //         icon: 'far fa-times-circle',
  //       })
  //       this.spinner.hide()
  //     },
  //   )
  // }

  pageChanged(pagenumber:any) {
    this.currentPage = pagenumber;
  }

  verifyDocument(data:any) {
    let documentverifyData = {
      docId: data.docId,
      documentNumber: data.documentNumber,
      documentType: data.docSubType
    };
    this.customerDocumentService.DocumentVerify(documentverifyData).subscribe(
      (response: any) => {
        this.documentverifyData = [];
        this.getAll();
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
      },
      (error: any) => {
        if (error.error.status === 500) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.message,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }

  OnVerificationMode(event:any) {
    if (event.value == "Online") {
      this.insertCustomerDocumentForm.patchValue({
        docStatus: "padding"
      });

      this.docTypeList = this.docTypeForCustomerList.filter(
        subtype => subtype.text === "Proof Of Address" || subtype.text === "Proof of Identity"
      );

      this.insertCustomerDocumentForm.controls['docType'].setValue(null);
      this.insertCustomerDocumentForm.controls['docSubType'].setValue(null);
      this.ifModeInput = true;
      this.isEnableStatus = false;
      this.isstatus = true;

      this.insertCustomerDocumentForm.get("documentNumber").setValidators([Validators.required]);
      this.insertCustomerDocumentForm.get("documentNumber").updateValueAndValidity();

      this.insertCustomerDocumentForm.get("file").clearValidators();
      this.insertCustomerDocumentForm.get("file").updateValueAndValidity();

      this.insertCustomerDocumentForm.get("fileSource").clearValidators();
      this.insertCustomerDocumentForm.get("fileSource").updateValueAndValidity();
    } else {
      this.ifModeInput = false;
      this.docTypeList = this.docTypeForCustomerList;
      this.insertCustomerDocumentForm.patchValue({
        docStatus: "padding"
      });
      this.insertCustomerDocumentForm.controls['docType'].setValue(null);
      this.insertCustomerDocumentForm.controls['docSubType'].setValue(null);
      this.isEnableStatus = true;

      this.insertCustomerDocumentForm.get("file").setValidators([Validators.required]);
      this.insertCustomerDocumentForm.get("file").updateValueAndValidity();
      this.insertCustomerDocumentForm.get("fileSource").setValidators([Validators.required]);
      this.insertCustomerDocumentForm.get("fileSource").updateValueAndValidity();

      this.insertCustomerDocumentForm.get("documentNumber").clearValidators();
      this.insertCustomerDocumentForm.get("documentNumber").updateValueAndValidity();
    }
  }

  OnDocumentType(event:any) {
    this.labelname = event.value;
    this.ifDocumentNumber = true;
    this.insertCustomerDocumentForm.controls['documentNumber'].setValue("");
  }

  onKeyAdhar(event:any) {
    let adharnum = this.insertCustomerDocumentForm.value.documentNumber.replace(/\s/g, "");

    let v = adharnum.match(/(\d{1,4})?(\d{1,4})?(\d{1,4})?/);
    if (v) {
      v = v[1] ? v[1] + (v[2] ? " " + v[2] + (v[3] ? " " + v[3] : "") : "") : "";
      adharnum = v;
    }

    // if(this.insertCustomerDocumentForm.value.documentNumber.length == 14){
    //   let prefix = adharnum.substr(0, adharnum.length - 6);
    //   let suffix = adharnum.substr(-6);
    //   let masked = prefix.replace(/[A-Z\d]/g, '*');
    //   let a = masked + suffix;
    //   this.insertCustomerDocumentForm.patchValue({
    //     documentNumber: a,
    //   })
    // } else{
    this.insertCustomerDocumentForm.patchValue({
      documentNumber: adharnum
    });
    // }
  }

  onKeyPan(e:any) {
    let panNum = this.insertCustomerDocumentForm.value.documentNumber.replace(/\s/g, "");
    let v = panNum.match(/([A-Z]{1,5})?([0-9]{1,4})?([A-Z]{1,1})?/);
    if (v) {
      v = v[1] ? v[1] + (v[2] ? " " + v[2] + (v[3] ? v[3] : "") : "") : "";
      panNum = v;
    }

    // if(this.customerGroupForm.value.pan.length == 11){
    //     let prefix = panNum.substr(0, panNum.length - 4);
    //     let suffix = panNum.substr(-4);
    //     let masked = prefix.replace(/[A-Z\d]/g, '*');
    //     let a = masked + suffix;
    //     this.customerGroupForm.patchValue({
    //       pan: a,
    //     })
    // }
    // else{
    this.insertCustomerDocumentForm.patchValue({
      documentNumber: panNum
    });
    // }
  }

  onKeyGST(e:any) {
    let gstNum = this.insertCustomerDocumentForm.value.documentNumber.replace(/\s/g, "");
    let v = gstNum.match(
      /(\d{1,2})?([A-Z]{1,3})?([A-Z]{1,2})?(\d{1,3})?(\d{1,1})?([A-Z]{1,1})?([A-Z\d]{1,1})?([Z]{1,1})?([A-Z\d]{1,1})?/
    );
    if (v) {
      v = v[1]
        ? v[1] +
          (v[2]
            ? v[2] +
              (v[3]
                ? " " +
                  v[3] +
                  (v[4]
                    ? v[4] +
                      (v[5]
                        ? " " +
                          v[5] +
                          (v[6]
                            ? v[6] + (v[7] ? v[7] + (v[8] ? v[8] + (v[9] ? v[9] : "") : "") : "")
                            : "")
                        : "")
                    : "")
                : "")
            : "")
        : "";
      gstNum = v;
    }

    // if(this.insertCustomerDocumentForm.value.documentNumber.length == 17){
    //   let prefix = gstNum.substr(0, gstNum.length - 6);
    //   let suffix = gstNum.substr(-6);
    //   let masked = prefix.replace(/[A-Z\d]/g, '*');
    //   let a = masked + suffix;
    //   this.insertCustomerDocumentForm.patchValue({
    //     documentNumber: a,
    //   })
    // }
    // else
    // {
    this.insertCustomerDocumentForm.patchValue({
      documentNumber: gstNum
    });
    // }
  }

  downloadAll() {
    this.custmerDocList.forEach((element:any) => {
      this.customerDocumentService.downloadFile(element.docId, element.custId).subscribe(blob => {
        // importedSaveAs(blob, element.filename);
      });
    });
  }

  ifApproveStatus = false;
  approveRejectRemark = "";
  apprRejectCustData: any = [];

  approvestatusModalOpen(data:any) {
    console.log("1");
    this.ifApproveStatus = true;
    this.ApproveRejectModal = true;
    this.apprRejectCustData = data;
    this.approveRejectRemark = "";
  }

  rejectstatusModalOpen(data:any) {
    this.ifApproveStatus = false;
    this.apprRejectCustData = data;
    this.approveRejectRemark = "";
    this.ApproveRejectModal = true;
  }

  closeStatusApporevedRejected() {
    this.ApproveRejectModal = false;
  }

  closeAssignCustomerDocumentForApproval() {
    this.assignCustomerDocumentForApproval = false;
  }

  statusApporevedRejected() {
    this.assignDocSubmitted = true;
    let custDocData: any;

    custDocData = {
      partnerPaymentId: this.custDocId,
      nextStaffId: "",
      flag: "approved",
      remark: this.assignDocForm.controls['remark'].value,
      staffId: localStorage.getItem("userId")
    };
    const url = `/custDoc/approveUploadCustomerDoc?docId=${this.apprRejectCustData.docId}&remarks=${this.approveRejectRemark}&isApproveRequest=${this.ifApproveStatus}`;
    this.customerDocumentService.updateMethod(url, custDocData).subscribe(
      (response: any) => {
        console.log("sadf", response);
        if (response.dataList != null && response.dataList.length > 0) {
          this.assignStaffListData = response.dataList;
          this.ApproveRejectModal = false;

          this.assignCustomerDocumentForApproval = true;
        } else {
          this.ApproveRejectModal = false;
          this.getAll();
        }
        if (response.responseCode == 200) {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Success",
            icon: "far fa-times-circle"
          });
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
    // $("#assignCustomerDocumentForApproval").modal("show");
  }

  assignToStaff() {
    // this.assignedStaff;
    // this.ifApproveStatus;
    // this.assignDocForm.controls.remark.value;

    // Integer nextAssignStaff, String eventName, Integer entityId, boolean isApproveRequest

    let url = "";
    console.log("adsf ::::: ", this.assignedStaff);
    if (this.assignedStaff) {
      console.log("adsf", this.assignedStaff);
      url = `/teamHierarchy/assignFromStaffList?entityId=${this.apprRejectCustData.docId}&eventName=DOCUMENT_VERIFICATION&nextAssignStaff=${this.assignedStaff}&isApproveRequest=${this.ifApproveStatus}`;
    } else {
      url = `/teamHierarchy/assignEveryStaff?entityId=${
        this.apprRejectCustData.docId
      }&eventName=${"DOCUMENT_VERIFICATION"}&isApproveRequest=${this.ifApproveStatus}`;
    }
    this.customerDocumentService.getMethod(url).subscribe(
      response => {
        this.assignCustomerDocumentForApproval = false;
        if (this.ifApproveStatus) {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Approved Successfully.",
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Rejected Successfully.",
            icon: "far fa-times-circle"
          });
        }
        this.getAll();
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  pickModalOpen(data:any) {
    console.log("Inside Pick Model");
    let url = "/workflow/pickupworkflow?eventName=DOCUMENT_VERIFICATION&entityId=" + data.docId;
    this.customerDocumentService.getMethod(url).subscribe(
      (response: any) => {
        this.getAll();

        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        }
      },
      (error: any) => {
        // console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  openWorkFlowAudit(id:any, auditcustid:any) {
    this.ifModelIsShow = true;
    this.PaymentamountService.show(id);
    this.auditcustid.next({
      auditcustid: auditcustid,
      checkHierachy: "DOCUMENT_VERIFICATION",
      planId: ""
    });
  }

  approvableStaff: any = [];
  assignedCustDocid: any;
  StaffReasignList(data:any) {
    let url = `/teamHierarchy/reassignWorkflowGetStaffList?entityId=${data.docId}&eventName=DOCUMENT_VERIFICATION`;
    this.customerDocumentService.getMethod(url).subscribe(
      (response: any) => {
        this.assignedCustDocid = data.docId;
        this.approvableStaff = [];
        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          //   $("#reAssignPLANModal").modal("show");
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        }
        if (response.dataList != null) {
          this.approved = true;
          console.log("Data List :::::", response.dataList);
          this.approvableStaff = response.dataList;
          $("#reAssignPLANModal").modal("show");
        } else {
          $("#reAssignPLANModal").modal("hide");
        }
      },
      (error: any) => {
        // console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  selectStaff: any;
  reassignWorkflow() {
    this.assignDocSubmitted = false;
    if (this.assignDocForm.invalid) {
      this.assignDocSubmitted = true;
      return;
    }
    this.remark = this.assignDocForm.value.remark;
    let url: any;
    url = `/teamHierarchy/reassignWorkflow?entityId=${this.assignedCustDocid}&eventName=DOCUMENT_VERIFICATION&assignToStaffId=${this.selectStaff}&remark=${this.remark}`;

    this.customerDocumentService.getMethod(url).subscribe(
      (response: any) => {
        $("#reAssignPLANModal").modal("hide");
        this.getAll();
        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Assigned to the next staff successfully.",
            icon: "far fa-times-circle"
          });
        }
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }
}
