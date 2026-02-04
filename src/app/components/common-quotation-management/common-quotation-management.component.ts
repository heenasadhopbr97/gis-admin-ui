import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { LeadManagementService } from "src/app/service/lead-management-service";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
// import * as FileSaver from "file-saver";
import { fileExtensionValidator } from "src/app/directive/custom-validation.directive";
import { RejectedReasonService } from "src/app/service/rejected-reason.service";
import { LoginService } from "src/app/service/login.service";
import { SALES_CRMS } from "src/app/constants/aclConstants";
declare var $: any;

@Component({
    selector: "app-common-quotation-management",
    templateUrl: "./common-quotation-management.component.html",
    styleUrls: ["./common-quotation-management.component.css"],
    standalone: false
})
export class CommonQuotationManagementComponent implements OnInit {
  @Input() LeadCustData: any;
  @Output() backLeadData = new EventEmitter();
  serviceList: any;
  quotatationFormGroup: FormGroup;
  sendToCustomerForm: FormGroup;
  poForm: FormGroup;
  submitted = false;
  poSubmitted: boolean = false;
  validityUnit = [{ label: "Hours" }, { label: "Days" }, { label: "Months" }, { label: "Years" }];
  currentPageQuotationCircuit = 1;
  CircuititemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  CircuittotalRecords: any;

  currentPageQuotationSlab = 1;
  dataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  datatotalRecords: any;

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;

  serviceCircuitData: any = [];
  quotationList: any = [];
  selectCircuitId: any = [];
  serviceNameList: any = [];
  leadDetailData: any = {};
  serviceQuotationName: any = "";
  sendTocustomerSubmitted: boolean = false;
  generateQuotationAccess: boolean = false;
  downloadPdfAccess: boolean = false;
  sendMailAccess: boolean = false;
  assignPOAccess: boolean = false;
  showQuotationAccess: boolean = false;
  downloadPOAccess: boolean = false;
  subjectTxt: any = "";
  messageTxt: any = "";
  fileName: any = "";
  sendTocustomerData: any = [];
  selQuotationData: any;

  mvnoid: any;
  staffid: any;

  leadApproveRejectQuationForm: FormGroup;
  leadApproveRejectQuationFormsubmitted: boolean = false;
  labelFlag: any;
  leadObj: any;

  approved = false;
  approveLeadList:[] = [];
  selectStaff: any;
  selectStaffReject: any;

  rejectedReasons: any = [];
  leadApproveRejectQuationDto: any = {
    quotationId: "",
    leadMasterId: "",
    firstName: "",
    status: "",
    mvnoId: "",
    buId: "",
    nextApproveStaffId: "",
    nextTeamMappingId: "",
    flag: "",
    remark: "",
    currentLoggedInStaffId: "",
    teamName: "",
    finalApproved: "",
    approveRequest: "",
    rejectedReasonMasterId: "",
    remarkType: "",
  };
  assignPoData: any;
showQtyError: any;
  constructor(
    private fb: FormBuilder,
    private commondropdownService: CommondropdownService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private customerManagementService: CustomermanagementService,
    public confirmationService: ConfirmationService,
    private leadManagementService: LeadManagementService,
    private rejectedReasonService: RejectedReasonService,
    loginService: LoginService
  ) {
    this.generateQuotationAccess = loginService.hasPermission(SALES_CRMS.QM_GENERATE);
    this.downloadPdfAccess = loginService.hasPermission(SALES_CRMS.QM_DOWNLOAD_PDF);
    this.showQuotationAccess = loginService.hasPermission(SALES_CRMS.QM_SHOW);
    this.sendMailAccess = loginService.hasPermission(SALES_CRMS.QM_SEND_MAIL);
    this.assignPOAccess = loginService.hasPermission(SALES_CRMS.QM_ASSIGN_PO);
    this.downloadPOAccess = loginService.hasPermission(SALES_CRMS.QM_DOWNLOAD_PO);
  }

  ngOnInit(): void {
    console.log("LeadCustData", this.LeadCustData);
    this.getLeadServiceList();
    this.getQuotationList();
    this.quotatationFormGroup = this.fb.group({
      leadServiceMappingIdList: ["", Validators.required],
      validity: ["", Validators.required],
      validityUnit: ["Days", Validators.required],
      installationValidity: [""],
      installationUnit: ["Days"],
    });

    this.sendToCustomerForm = this.fb.group(
      {
        custMailAddresses: [[], Validators.required],
        subject: ["", Validators.required],
        body: ["", Validators.required],
        // file: ["", Validators.required],
      }
      // {
      //   validator: fileExtensionValidator("file", ["pdf"]),
      // }
    );

    this.poForm = this.fb.group(
      {
        poNumber: [[], Validators.required],
        file: ["", Validators.required],
      },
      {
        validator: fileExtensionValidator("file", ["pdf"]),
      }
    );

    this.leadApproveRejectQuationForm = this.fb.group({
      remark: ["", Validators.required],
      rejectedReasonMasterId: [""],
    });
    this.mvnoid = Number(localStorage.getItem("mvnoId"));
    this.staffid = Number(localStorage.getItem("userId"));
    this.quotatationFormGroup.controls['validityUnit'].setValue("Days");
    this.quotatationFormGroup.controls['installationUnit'].setValue("Days");
  }
  backdetalisView() {
    this.backLeadData.emit(this.LeadCustData.id);
  }
  getLeadServiceList() {
    const url =
      "/KeyannaSalesCrmsBss/leadMaster/findCircuitDetailsByLeadId?leadId=" + this.LeadCustData.id;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.status == 200) {
          this.serviceList = response.leadServiceMappingList;
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
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

  generateQuoation() {
    this.submitted = true;
    if (this.quotatationFormGroup.valid) {
      let data = this.quotatationFormGroup.value;
      const url = "/leadQuotation/save";
      this.leadManagementService.postleadMethod(url, data).subscribe(
        (response: any) => {
          if (response.status == 200) {
            this.getQuotationList();
            this.submitted = false;
            this.quotatationFormGroup.reset();
            this.quotatationFormGroup.controls['validityUnit'].setValue("Days");
            this.quotatationFormGroup.controls['installationUnit'].setValue("Days");
          } else {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle",
            });
          }
        },
        (error: any) => {}
      );
    }
  }

  cancelSearchQuotation() {
    this.selectCircuitId = [];
    this.quotatationFormGroup.reset();
    this.quotatationFormGroup.controls['status'].setValue("");
  }

  TotalItemPerPage(event:any) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageQuotationSlab > 1) {
      this.currentPageQuotationSlab = 1;
    }
    this.getQuotationList();
  }

  getQuotationList() {
    const url = "/leadQuotation/findListOfQuotationDetailsByLeadId?leadId=" + this.LeadCustData.id;
    this.leadManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.quotationList = response.leadQuotationList;
        this.datatotalRecords = this.quotationList.length;
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

  downloadPDF(quotationId:any) {
    const downloadUrl = "/leadQuotation/generateQuotationReport/" + quotationId;
    this.leadManagementService.downloadLeadPDF(downloadUrl).subscribe(
      (response: any) => {
        const file = new Blob([response], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        // FileSaver.saveAs(file);
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

  viewPDF(quotationId:any) {
    const downloadUrl = "/leadQuotation/generateQuotationReport/" + quotationId;
    this.leadManagementService.downloadLeadPDF(downloadUrl).subscribe(
      (response: any) => {
        const file = new Blob([response], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, "_blank");
        //FileSaver.saveAs(file);
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

  particularALLDatashow(particularData:any) {
    this.serviceCircuitData = particularData;

    const url = "/leadMaster/findById?leadId=" + Number(particularData.leadId);
    this.leadManagementService.getMethod(url).subscribe((response: any) => {
      this.leadDetailData = response.leadMaster;
    });
    $("#showCircuitDetailsID").modal("show");
  }

  particularServiceData(name:any, services:any) {
    this.serviceQuotationName = name;
    this.serviceNameList = services;
  }
  pageChangeddataList(pageNumber:any) {
    this.currentPageQuotationSlab = pageNumber;
  }
  pageChangedCircuitList(pageNumber:any) {
    this.currentPageQuotationCircuit = pageNumber;
  }

  openSendToCustomerModal(quotationData:any) {
    $("#sendToCustomerModal").modal("show");
    this.selQuotationData = quotationData;
    this.subjectTxt = "Quotation for ";
    let circuit = "";
    console.log("this.selQuotationData", this.selQuotationData);
    quotationData.services.forEach((element:any, i:any) => {
      if (Object.is(quotationData.services.length - 1, i)) {
        circuit = circuit.concat(element);
      } else {
        circuit = circuit.concat(element + " and ");
      }
    });
    this.messageTxt = "";
    this.messageTxt += "Dear " + this.LeadCustData.firstname;
    this.messageTxt += "\n";
    this.messageTxt += "\n";
    this.messageTxt += "Please find attached, the quotation for " + circuit + ".";
    this.messageTxt += "\n";
    this.messageTxt += "\n";
    this.messageTxt += "Thank You";

    this.subjectTxt = this.subjectTxt.concat(circuit);
    this.sendToCustomerForm.controls['subject'].setValue(this.subjectTxt);
    this.sendToCustomerForm.controls['body'].setValue(this.messageTxt);
  }

  closeSendToCustomerModal() {
    $("#sendToCustomerModal").modal("hide");
    this.sendTocustomerSubmitted = false;
    this.sendToCustomerForm.reset();
    this.subjectTxt = "";
    this.messageTxt = "";
  }

  sendToCustomer() {
    this.sendTocustomerSubmitted = true;
    if (this.sendToCustomerForm.valid) {
      this.sendTocustomerData = this.sendToCustomerForm.value;
      this.sendTocustomerData.staffId = localStorage.getItem("userId");
      this.sendTocustomerData.mvnoId = localStorage.getItem("mvnoId");
      this.sendTocustomerData.quotationId = this.selQuotationData.quotationDetailId;
      this.sendTocustomerData.leadId = this.LeadCustData.id;
      // const formData = new FormData();
      //formData.append("file", this.fileName);
      // formData.append("emailData", JSON.stringify(this.sendTocustomerData));
      const url = "/leadQuotation/sendEmailWithQuotationDetails";
      this.leadManagementService.sendTOcustomer(url, this.sendTocustomerData).subscribe(
        (response: any) => {
          if (response.status == 200) {
            this.closeSendToCustomerModal();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle",
            });
          } else {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.errorMessage,
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

  onFileChange(event:any) {
    if (event.target.files.length > 0) {
      const fileName = event.target.files[0].name;
      const file = event.target.files[0];
      this.fileName = event.target.files[0];
    }
  }

  //approve reject
  getAllRejectedReasonsList() {
    this.rejectedReasonService.getAllRejectedReasonsList().subscribe((res: any) => {
      this.rejectedReasons = res.rejectReasonList;
    });
  }

  quotationAssignWorkflow(id: any) {
    const url = "/leadQuotation/assignworkflowForQuotation/" + id;

    this.leadManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.status === 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.errorMessage,
            icon: "far fa-times-circle",
          });
        }
        if (response.status === 404) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.message,
            icon: "far fa-times-circle",
          });
        }
        if (response.status === 200) {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-times-circle",
          });
          setTimeout(() => {
            this.getQuotationList();
          }, 3000);
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Page Not Found",
          icon: "far fa-times-circle",
        });
      }
    );
  }

  assignToStaff(flag:any) {
    let url: any;

    if (!this.selectStaff && !this.selectStaffReject) {
      url = `/teamHierarchy/assignEveryStaff?entityId=${
        this.leadApproveRejectQuationDto.quotationId
      }&eventName=${"QUOTATION"}&isApproveRequest=${flag == "Approve"}`;
    } else {
      if (flag == "Approve") {
        if (this.selectStaff) {
          this.leadApproveRejectQuationDto.nextApproveStaffId = this.selectStaff;
        }
        url = `/teamHierarchy/assignFromStaffListForLeadQuotation?eventName=${"LEAD_QUOTATION"}&nextAssignStaff=${this.selectStaff}`;
      } else {
        if (this.selectStaffReject) {
          this.leadApproveRejectQuationDto.nextApproveStaffId = this.selectStaffReject;
        }

        url = `/teamHierarchy/assignFromStaffListForLeadQuotation?eventName=${"LEAD_QUOTATION"}&nextAssignStaff=${this.selectStaffReject}`;
      }
    }

    //

    if (!this.selectStaff && !this.selectStaffReject) {
      console.log("Every Assign Staff ::: ", url);

      this.customerManagementService.getMethod(url).subscribe(
        async (response: any) => {
          console.log(await response);
          $("#approveOrRejectLeadQuotationPopup").modal("hide");
          await this.getQuotationList();
          if (response.responseCode == 417) {
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
              detail: "Assigned to the next staff successfully.",
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
          $("#approveOrRejectLeadQuotationPopup").modal("hide");
          this.getQuotationList();
        }
      );
    } else {
      // if (flag == "Approve") {
      console.log("Approve Assign Staff ::: ", url);
      console.log(
        "Approve Assign leadApproveRejectQuationDto ::: ",
        this.leadApproveRejectQuationDto
      );
      this.customerManagementService.postMethod(url, this.leadApproveRejectQuationDto).subscribe(
        async (response: any) => {
          console.log(await response);
          $("#approveOrRejectLeadQuotationPopup").modal("hide");
          await this.getQuotationList();
          if (response.responseCode == 417) {
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
              detail: "Assigned to the next staff successfully.",
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
          $("#approveOrRejectLeadQuotationPopup").modal("hide");
          this.getQuotationList();
        }
      );
    }
  }

  approveOrRejectLeadQuotationPopup(lead:any, flag:any) {
    if (lead.finalApproved) {
      if (flag === "Reject") {
        setTimeout(() => {
          this.getQuotationList();
        }, 1000);

        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: "Assigned to the next staff",
          icon: "far fa-check-circle",
        });
      } else {
        this.getQuotationList();
      }
    } else {
      this.approved = false;

      this.labelFlag = flag;
      this.leadObj = lead;
      if (flag === "Approve") {
        this.leadApproveRejectQuationDto.approveRequest = true;
      }
      if (flag === "Reject") {
        this.leadApproveRejectQuationDto.approveRequest = false;
      }

      if (this.staffid) {
        this.leadApproveRejectQuationDto.currentLoggedInStaffId = Number(this.staffid);
      }
      this.leadApproveRejectQuationDto.firstname = lead.quotationName;
      this.leadApproveRejectQuationDto.leadMasterId = lead.leadId;
      this.leadApproveRejectQuationDto.flag = flag;
      this.leadApproveRejectQuationDto.status = lead.status;
      if (this.mvnoid) {
        this.leadApproveRejectQuationDto.mvnoId = Number(this.mvnoid);
      }
      // if (lead.serviceareaid) {
      //   this.leadApproveRejectQuationDto.serviceareaid = Number(lead.serviceareaid);
      // }
      if (lead.quotationDetailId) {
        this.leadApproveRejectQuationDto.quotationId = Number(lead.quotationDetailId);
      }
      if (lead.buId) {
        this.leadApproveRejectQuationDto.buId = Number(lead.buId);
      }
      this.leadApproveRejectQuationDto.nextTeamMappingId = lead.nextTeamMappingId
        ? Number(lead.nextTeamMappingId)
        : null;

      if (lead.nextApproveStaffId) {
        this.leadApproveRejectQuationDto.currentLoggedInStaffId = lead.nextApproveStaffId;
        this.leadApproveRejectQuationDto.nextApproveStaffId = lead.nextApproveStaffId;
      }
      this.leadApproveRejectQuationFormsubmitted = false;
      $("#approveOrRejectLeadQuotationPopup").modal("show");
      this.getAllRejectedReasonsList();
    }
  }

  closeApproveOrRejectLeadQuotationPopup() {
    this.leadApproveRejectQuationForm.reset();
    this.leadApproveRejectQuationFormsubmitted = false;
    $("#approveOrRejectLeadQuotationPopup").modal("hide");
  }

  isFinalApproved: boolean = false;

  approveOrRejectLeadQuotation(leadObject: any) {
    if (leadObject?.finalApproved) {
      this.isFinalApproved = true;
    }

    this.leadApproveRejectQuationFormsubmitted = true;
    let url = "/teamHierarchy/approveLeadQuotation";

    if (this.leadApproveRejectQuationForm.valid) {
      this.leadApproveRejectQuationDto.remark =
        this.leadApproveRejectQuationForm.controls['remark'].value;
      this.leadApproveRejectQuationDto.rejectedReasonMasterId =
        this.leadApproveRejectQuationForm.controls['rejectedReasonMasterId'].value;

      this.customerManagementService.updateMethod(url, this.leadApproveRejectQuationDto).subscribe(
        async (response: any) => {
          this.leadApproveRejectQuationFormsubmitted = false;
          this.leadApproveRejectQuationForm.reset();
          if ((await response.dataList) && (await response.dataList.length) > 0) {
            this.approveLeadList = await response.dataList;
            this.approved = true;
          } else {
            $("#approveOrRejectLeadQuotationPopup").modal("hide");

            if (this.leadApproveRejectQuationDto.approveRequest) {
              if (response.data === "FINAL_APPROVED") {
                setTimeout(() => {
                  this.getQuotationList();
                }, 3000);
              } else {
                if (response.responseMessage === "Assigned to next staff") {
                  setTimeout(() => {
                    this.getQuotationList();
                  }, 3000);
                  this.messageService.add({
                    severity: "success",
                    summary: "Successfully",
                    detail: response.message,
                    icon: "far fa-check-circle",
                  });
                }
              }
            } else {
              setTimeout(() => {
                this.getQuotationList();
              }, 3000);
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: "Rejected Successfully",
                icon: "far fa-check-circle",
              });
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

  openPOModal(data:any) {
    $("#poModal").modal("show");
    this.assignPoData = data;
    console.log("this.assignPoData", this.assignPoData);
  }

  closePOModal() {
    this.poSubmitted = false;
    this.poForm.reset();
    $("#poModal").modal("hide");
    this.fileName = "";
  }

  assignPo() {
    this.poSubmitted = true;
    if (this.poForm.valid) {
      const url =
        "/leadQuotation/uploadQuotationPODoc?poNumber=" +
        this.poForm.controls['poNumber'].value +
        "&quotationId=" +
        this.assignPoData;
      const formData = new FormData();
      formData.append("file", this.fileName);
      this.leadManagementService.assignPO(url, formData).subscribe(
        (response: any) => {
          if (response.status == 200) {
            this.closePOModal();
            this.getQuotationList();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle",
            });
          } else {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.errorMessage,
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

  downloadPO(quotationId:any, quotationPoDocId:any) {
    const downloadUrl = "/leadQuotation/po/download/" + quotationId + "/" + quotationPoDocId;
    this.leadManagementService.downloadLeadPDF(downloadUrl).subscribe(
      (response: any) => {
        const file = new Blob([response], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        // FileSaver.saveAs(file);
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

  pickModalOpen(data:any) {
    console.log("Inside Pick Model");
    let url =
      "/workflow/pickupworkflow?eventName=LEAD_QUOTATION&entityId=" + data.quotationDetailId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        setTimeout(() => {
          this.getQuotationList();
        }, 3000);

        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        }
      },
      (error: any) => {
        // console.log(error, "error");
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
