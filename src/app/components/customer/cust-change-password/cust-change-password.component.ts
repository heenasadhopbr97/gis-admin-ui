import { DatePipe } from "@angular/common";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { InvoicePaymentListService } from "src/app/service/invoice-payment-list.service";
import { LiveUserService } from "src/app/service/live-user.service";
import { LoginService } from "src/app/service/login.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

declare var $: any;

@Component({
    selector: "app-cust-change-password",
    templateUrl: "./cust-change-password.component.html",
    styleUrls: ["./cust-change-password.component.scss"],
    standalone: false
})
export class CustChangePasswordComponent implements OnInit {
  @Input() custId: any;
  @Output() closePassChange = new EventEmitter();
  changePasswordForm: FormGroup;

  _passwordOLDType = "password";
  _passwordNewType = "password";

  showNewPassword = false;
  showOLDPassword = false;
  displayChangePassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private customerManagementService: CustomermanagementService,
    public commondropdownService: CommondropdownService,
    public datepipe: DatePipe,
    public loginService: LoginService,
    public invoicePaymentListService: InvoicePaymentListService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private liveUserService: LiveUserService
  ) {}

  async ngOnInit() {
    this.changePasswordForm = this.fb.group({
      custId: [""],
      newpassword: ["", Validators.required],
      password: [""],
      remarks: [""],
      selfcarepwd: [""],
    });
    this.displayChangePassword = true;
  }

  changePasswordWithpopup() {
    if (this.changePasswordForm.dirty) {
      this.confirmationService.confirm({
        message: "Do you want to change password for this customer?",
        header: "Change Password Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.changePassword();
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

  // change Password
  changePassword() {
    const url = "/updatePassword";

    if (this.changePasswordForm.valid) {
      this.changePasswordForm.value.custId = this.custId;
      this.changePasswordForm.value.remarks = "";
      this.changePasswordForm.value.selfcarepwd = this.changePasswordForm.value.newpassword;
      let changePasswordvalue = this.changePasswordForm.value;

      this.customerManagementService.PostSubMethod(url, changePasswordvalue).subscribe(
        (response: any) => {
          if (response.responseCode == 417) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.responseMessage,
              icon: "far fa-times-circle",
            });
          } else {
            this.clearChangePasswordForm();

            this.close();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: "Password Update Successfully",
              icon: "far fa-check-circle",
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
      // }
    }
  }

  clearChangePasswordForm() {
    this.changePasswordForm.reset();
  }

  close() {
    this.closePassChange.emit();
    this.displayChangePassword = false;
  }
}
