import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { ClientGroupService } from "src/app/service/client-group.service";
import { RadiusTemplateService } from "src/app/service/radius-template.service";

@Component({
    selector: "app-radius-template",
    templateUrl: "./radius-template.component.html",
    styleUrls: ["./radius-template.component.css"],
    standalone: false
})
export class RadiusTemplateComponent implements OnInit {
  changeStatusData: any = [];
  groupData: any = [];

  updateTemplateData: any = [];
  createGroupForm: FormGroup;
  saveTemplateForm: FormGroup;
  searchGroupByNameForm: FormGroup;
  submitted = false;
  searchSubmitted = false;
  //Used and required for pagination
  totalRecords: String;
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  smsTemplateData: string;
  emailTemplateData: string;
  attribute: FormArray;
  editFormValues: any;

  editClientGroupId: number;
  editMode: boolean = false;
  smsChecked: boolean = false;
  emailChecked: boolean = false;
  status = [{ label: "Active" }, { label: "Inactive" }];
  accessData: any = JSON.parse(localStorage.getItem("accessData"));
  temeplatedata: any;
  loggedInUser: string;
  Wifitemeplatedata: any;

  groupID: any;
  groupEmailID: any;
  groupAppednURL: any;
  searchName = "";

  constructor(
    private messageService: MessageService,
    private clientGroupService: ClientGroupService,
    private templateManagementService: RadiusTemplateService,
    private radiusUtility: RadiusUtility,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService
  ) {
    this.findAll();
    this.findAllData();
  }

  ngOnInit(): void {
    this.saveTemplateForm = this.fb.group({
      eventId: [""],
      appendUrl: [""],
      smsEventConfigured: [""],
      smsTemplateData: [""],
      emailEventConfigured: [""],
      emailTemplateData: [""],
      templateName: [""],
    });
    this.createGroupForm = this.fb.group({
      smsTemplate: ["", Validators.required],
      emailTemplate: ["", Validators.required],
    });
    this.searchGroupByNameForm = this.fb.group({
      name: [""],
    });
  }

  popoverTitle: string = RadiusConstants.CONFIRM_DIALOG_TITLE;
  popoverMessage: string = RadiusConstants.DELETE_GROUP_CONFIRM_MESSAGE;
  confirmedClicked: boolean = false;
  cancelClicked: boolean = false;
  closeOnOutsideClick: boolean = true;
  addEmailTemp(event: any) {
    if (event.checked) {
      this.emailChecked = true;
    } else {
      this.emailChecked = false;
    }
  }

  async searchGroupByName() {
    this.currentPage = 1;
    this.searchSubmitted = true;
    if (this.searchGroupByNameForm.valid) {
      let eventname = this.searchName.trim() ? this.searchName.trim() : "";
      this.templateManagementService.getEventByName(eventname).subscribe(
        (response: any) => {
          this.groupData = response;
          // this.totalRecords = this.groupData.eventList.length;
          for (let index = 0; index < this.groupData.eventList.length; index++) {
            this.groupData.eventList[index].template.eventId =
              this.groupData.eventList[index].eventId;
          }
        },
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle",
          });
        }
      );
    }
  }

  async findAll() {
    this.attribute = this.fb.array([]);
    this.templateManagementService.getEventAll().subscribe(
      (response: any) => {
        this.groupData = response;
        this.temeplatedata = response.eventList;
        let attributeList = this.groupData.eventList;
        attributeList.forEach((element:any) => {
          this.attribute.push(this.fb.group(element));
        });

        for (let index = 0; index < this.groupData.eventList.length; index++) {
          if (this.groupData.eventList[index].template == null) {
            let template = {
              eventId: this.groupData.eventList[index].eventId,
              templateName: this.groupData.eventList[index].eventName,
              appendUrl: "",
              smsEventConfigured: false,
              smsTemplateData: "",
              emailEventConfigured: false,
              emailTemplateData: "",
              lastModifiedBy: this.loggedInUser,
            };
            this.groupData.eventList[index].template = template;
          } else {
            // this.saveTemplateForm.patchValue({
            //   eventId: this.groupData.eventList[index].eventId,
            //   templateName: this.groupData.eventList[index].eventName,
            //   smsEventConfigured:
            //     this.groupData.eventList[index].template.smsEventConfigured,
            //   smsTemplateData:
            //     this.groupData.eventList[index].template.smsTemplateData,
            //   emailEventConfigured:
            //     this.groupData.eventList[index].template.emailEventConfigured,
            //   emailTemplateData:
            //     this.groupData.eventList[index].template.emailTemplateData,
            // });
          }

          this.groupData.eventList[index].template.eventId =
            this.groupData.eventList[index].eventId;
        }
        this.allIDs = [];
        this.allIEmailDs = [];
        this.totalRecords = this.groupData.eventList.length;

        for (let i = 0; i < this.temeplatedata.length; i++) {
          if (this.temeplatedata[i].template.smsEventConfigured == true) {
            this.allIDs.push(this.temeplatedata[i].eventId);

            if (this.temeplatedata.length == this.allIDs.length) {
              this.issmsChecked = true;
              this.allIsChecked = true;
            }
          }
          if (this.temeplatedata[i].template.emailEventConfigured == true) {
            this.allIEmailDs.push(this.temeplatedata[i].eventId);
            if (this.temeplatedata.length === this.allIEmailDs.length) {
              this.isEmailChecked = true;
              this.allEmailChecked = true;
            }
          }
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  async findAllData() {
    this.attribute = this.fb.array([]);
    this.templateManagementService.getEventAll().subscribe((response: any) => {
      this.Wifitemeplatedata = response.eventList;
    });
  }
  async updateTemplate() {
    let addTemplateData = [];
    for (let index = 0; index < this.groupData.eventList.length; index++) {
      // if ((this.groupData.eventList[index].template.appendUrl !== this.Wifitemeplatedata[index].template.appendUrl)
      //   || (this.groupData.eventList[index].template.emailEventConfigured !== this.Wifitemeplatedata[index].template.emailEventConfigured)
      //   || (this.groupData.eventList[index].template.emailTemplateData !== this.Wifitemeplatedata[index].template.emailTemplateData)
      //   || (this.groupData.eventList[index].template.smsEventConfigured !== this.Wifitemeplatedata[index].template.smsEventConfigured)
      //   || (this.groupData.eventList[index].template.smsTemplateData !== this.Wifitemeplatedata[index].template.smsTemplateData)
      // ) {

      this.groupData.eventList[index].template.lastModifiedBy = this.loggedInUser;
      // }
      addTemplateData.push(this.groupData.eventList[index].template);
    }
    if (addTemplateData.length != 0) {
      this.templateManagementService.updateTemplate(addTemplateData).subscribe(
        (response: any) => {
          this.findAll();
          this.findAllData();

          this.groupAppednURL = "";
          this.groupID = "";
          this.groupEmailID = "";
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle",
          });
        },
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: error.error.errorMessage,
            detail: error.error.errorMessage,
            icon: "far fa-times-circle",
          });
        }
      );
    }
  }

  clearSearchForm() {
    this.searchSubmitted = false;
    this.currentPage = 1;
    this.searchName = "";
    this.findAll();
  }

  pageChanged(pageNumber:any) {
    this.currentPage = pageNumber;
  }

  allIDs:any[] = [];
  issmsChecked: boolean = false;
  allIsChecked: boolean = false;

  checkSMSAll(event:any) {
    if (event.checked == true) {
      this.allIDs = [];
      let smsDetail = this.temeplatedata;
      for (let i = 0; i < smsDetail.length; i++) {
        this.allIDs.push(this.temeplatedata[i].eventId);
      }
      this.allIDs.forEach((value, index) => {
        smsDetail.forEach((element:any) => {
          if (element.eventId == value) {
            element.template.smsEventConfigured = true;
          }
        });
      });
      this.allIsChecked = true;
      // console.log(this.allIDs);
    }
    if (event.checked == false) {
      let smsDetail = this.temeplatedata;
      this.allIDs.forEach((value, index) => {
        smsDetail.forEach((element:any) => {
          if (element.eventId == value) {
            element.template.smsEventConfigured = false;
          }
        });
      });
      this.allIDs = [];
      // console.log(this.allIDs);
      this.allIsChecked = false;
      this.issmsChecked = false;
    }
  }
  addsmsChecked(id:any, event: any) {
    if (event.checked) {
      this.allIDs.push(id);
      if (this.temeplatedata.length === this.allIDs.length) {
        this.issmsChecked = true;
        this.allIsChecked = true;
      }
    } else {
      let smsDetails = this.temeplatedata;
      smsDetails.forEach((element:any) => {
        if (element.eventId == id) {
          element.template.smsEventConfigured = false;
        }
      });
      if (this.allIsChecked == true) {
        this.allIDs.forEach((value, index) => {
          if (value == id) {
            this.allIDs.splice(index, 1);
          }
        });
      }

      if (this.allIDs.length == 0 || this.allIDs.length !== this.temeplatedata.length) {
        this.issmsChecked = false;
      }
    }
  }

  allIEmailDs:any[] = [];
  isEmailChecked: boolean = false;
  allEmailChecked: boolean = false;

  checkAllEmail(event:any) {
    if (event.checked == true) {
      this.allIEmailDs = [];
      let emailDetail = this.temeplatedata;
      for (let i = 0; i < emailDetail.length; i++) {
        this.allIEmailDs.push(this.temeplatedata[i].eventId);
      }
      this.allIEmailDs.forEach((value, index) => {
        emailDetail.forEach((element:any) => {
          if (element.eventId == value) {
            element.template.emailEventConfigured = true;
          }
        });
      });
      this.allEmailChecked = true;
      // console.log(this.allIEmailDs);
    }
    if (event.checked == false) {
      let emailDetail = this.temeplatedata;
      this.allIEmailDs.forEach((value, index) => {
        emailDetail.forEach((element:any) => {
          if (element.eventId == value) {
            element.template.emailEventConfigured = false;
          }
        });
      });
      this.allIEmailDs = [];
      // console.log(this.allIEmailDs);
      this.allEmailChecked = false;
      this.isEmailChecked = false;
    }
  }

  addEmailChecked(id:any, event: any) {
    if (event.checked) {
      this.allIEmailDs.push(id);
      if (this.temeplatedata.length === this.allIEmailDs.length) {
        this.isEmailChecked = true;
        this.allEmailChecked = true;
      }
      // console.log(this.allIEmailDs);
    } else {
      let emailDetail = this.temeplatedata;
      emailDetail.forEach((element:any) => {
        if (element.eventId == id) {
          element.template.emailEventConfigured = false;
        }
      });
      if (this.allEmailChecked == true) {
        this.allIEmailDs.forEach((value, index) => {
          if (value == id) {
            this.allIEmailDs.splice(index, 1);
            // console.log(this.allIEmailDs);
          }
        });
      }

      if (this.allIEmailDs.length == 0 || this.allIEmailDs.length !== this.temeplatedata.length) {
        this.isEmailChecked = false;
      }
    }
  }

  smsTemplateDataEdit(id:any) {
    this.groupID = id;
    this.groupEmailID = "";
    this.groupAppednURL = "";
  }
  EmailTemplateDataEdit(id:any) {
    this.groupEmailID = id;
    this.groupAppednURL = "";
    this.groupID = "";
  }
  appendUrlTemplateDataEdit(id:any) {
    this.groupAppednURL = id;
    this.groupEmailID = "";
    this.groupID = "";
  }
}
