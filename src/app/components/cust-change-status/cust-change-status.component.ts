import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { CommondropdownService } from "src/app/service/commondropdown.service";

declare var $: any;

@Component({
    selector: "app-cust-change-status",
    templateUrl: "./cust-change-status.component.html",
    styleUrls: ["./cust-change-status.component.css"],
    standalone: false
})
export class CustChangeStatusComponent implements OnInit {
  @Input() custId: string;
  @Input() custStatus: any;
  @Input() moduleType: string;
  @Output() closeChangeStatusEvent = new EventEmitter();
  updatedStatus: any;
  remark: any;
  changeStatusModal: boolean = false;
  constructor(
    private spinner: NgxSpinnerService,
    private customerManagementService: CustomermanagementService,
    public confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.commondropdownService.getCustomerStatus();
    this.changeStatusModal = true;
  }

  async changeStatus(updatedStatus:any, remark:any) {
    const data = {
      id: this.custId,
      rf: "bss",
      status: updatedStatus,
      remark: remark,
    };

    if (this.moduleType == "radius") {
      const url = "/updateStatus/" + this.custId + "?remark=" + remark + "&status=" + updatedStatus;
      this.customerManagementService.updateRadiusMethod(url, data).subscribe(
        (response: any) => {
          this.messageService.add({
            severity: "success",
            summary: response.message,
            detail: response.customer,
            icon: "far fa-check-circle",
          });
          // this.getcustomerList("");
          this.updatedStatus = "";
          this.closeChangeStatus(true);
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
    } else if (this.moduleType == "netConf") {
      const url =
        "/customer/updateStatus/" + this.custId + "?remark=" + remark + "&status=" + updatedStatus;
      this.customerManagementService.updateNetConf(url, data).subscribe(
        (response: any) => {
          this.messageService.add({
            severity: "success",
            summary: response.message,
            detail: response.customer,
            icon: "far fa-check-circle",
          });
          // this.getcustomerList("");
          this.updatedStatus = "";
          this.closeChangeStatus(true);
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
    } else {
      const url = "/changeStatus/" + this.custId + "?remark=" + remark + "&status=" + updatedStatus;
      this.customerManagementService.updateMethod(url, data).subscribe(
        (response: any) => {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.customer,
            icon: "far fa-check-circle",
          });
          // this.getcustomerList("");
          this.updatedStatus = "";
          this.closeChangeStatus(true);
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

  closeChangeStatus(isStatusChanged:any) {
    this.updatedStatus = "";
    this.remark = "";
    this.closeChangeStatusEvent.emit(isStatusChanged);
    this.changeStatusModal = false;
  }
}
