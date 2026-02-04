import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable, Observer } from "rxjs";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { RoleService } from "src/app/service/role.service";
import { MvnoManagementService } from "src/app/service/mvno-management.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DeactivateService } from "src/app/service/deactivate.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";

declare var $: any;

@Component({
    selector: "app-mvno-create",
    templateUrl: "./mvno-create.component.html",
    styleUrls: ["./mvno-create.component.scss"],
    standalone: false
})
export class MvnoCreateComponent implements OnInit {
  mvnoTitle = RadiusConstants.MVNO;
  fileToUpload: any;
  mvnoFormGroup: FormGroup;
  existingBooleanValue: boolean;
  isMvnoEdit: boolean = false;
  submitted: boolean = false;
  mvnoData: any;
  viewMvnoData: any;
  mvnoImg: any;
  searchData: any;
  roleList: any[] = [{ id: "", rolename: "" }];
  statusOptions = RadiusConstants.status;
  twofaOptions = RadiusConstants.isTwoFactorEnabled;
  twofaType: any;
  days:any[] = [];
  editMvnoId: any;
  public loginService: LoginService;
  profileImage: any;
editMode: any;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private mvnoManagementService: MvnoManagementService,
    private route: ActivatedRoute,
    loginService: LoginService,
    private deactivateService: DeactivateService,
    private router: Router,
    private revenueService: RevenueManagementService,
    private commonService: KeyannaCommonBaseService
  ) {
    this.loginService = loginService;
    this.editMvnoId = this.route.snapshot.paramMap.get("mvnoId")!;
  }

  async ngOnInit() {
    if (this.editMvnoId != null) {
      this.isMvnoEdit = true;
      this.getMvnoById(this.editMvnoId);
    }
    this.getAutType();
    this.existingBooleanValue; // or false, or fetched from a service

    this.mvnoFormGroup = this.fb.group({
      name: ["", Validators.required],
      // isTwoFactorEnabled: [this.existingBooleanValue],
      username: [""],
      password: ["", Validators.required],
      phone: ["", Validators.required],
      status: ["", Validators.required],
      roleId: ["", Validators.required],
      suffix: [""],
      description: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      logfile: [""],
      mvnoFooter: [""],
      mvnoHeader: [""],
      custInvoiceRefId: [""],
      profileImage: [""],
      logo_file_name: [""],
      mvnoPaymentDueDays: [""],
      address: [""],
      isTwoFactorEnabled: ["", Validators.required],
      authEventName: [""],
      fullName: ["", Validators.required],
      ispCommissionPercentage: ["", Validators.required],
      ispBillDay: ["", Validators.required],
      clientId: [""]
    });
    this.searchData = {
      filter: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ]
    };
    this.getAllRole();
    this.daySequence();
  }

  getAllRole() {
    this.roleService.getAll().subscribe(
      (response: any) => {
        this.roleList = response.dataList.filter((role:any) => role.product === "BSS");
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

  addEditMvno(id:any) {
    this.submitted = true;
    if (this.mvnoFormGroup.valid) {
      if (id) {
        const url = "/mvno/update";
        this.mvnoData = this.mvnoFormGroup.value;
        this.mvnoImg = "";
        this.mvnoData.id = id;
        this.mvnoManagementService.postMethod(url, this.mvnoData).subscribe(
          (response: any) => {
            if (response.responseCode === 200) {
              this.submitted = false;
              this.isMvnoEdit = false;
              this.mvnoFormGroup.reset();
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.responseMessage,
                icon: "far fa-check-circle"
              });
              this.submitted = false;
              //   if (this.searchkey) {
              //     this.searchMvno();
              //   } else {
              //     this.getMVNOData("");
              //   }
              this.deactivateService.setShouldCheckCanExit(false);
              this.router.navigate(["/home/mvnoManagement/list"]);
            } else {
              this.messageService.add({
                severity: "info",
                summary: "info",
                detail: response.responseMessage,
                icon: "far fa-check-circle"
              });
            }
          },
          (error: any) => {
            // console.log(error, "error")

            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.ERROR,
              icon: "far fa-times-circle"
            });
          }
        );
      } else {
        const url = "/mvno/save";
        this.mvnoData = this.mvnoFormGroup.value;
        this.mvnoData.passwordPolicyId = 1; //Remove this line after bss and iwf ui merge done
        this.mvnoManagementService.postMethod(url, this.mvnoData).subscribe(
          (response: any) => {
            if (response.responseCode === 200) {
              this.submitted = false;
              this.mvnoFormGroup.reset();
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.responseMessage,
                icon: "far fa-check-circle"
              });
              //   if (this.searchkey) {
              //     this.searchMvno();
              //   } else {
              //     this.getMVNOData("");
              //   }
              this.deactivateService.setShouldCheckCanExit(false);
              this.router.navigate(["/home/mvnoManagement/list"]);
            } else {
              this.messageService.add({
                severity: "info",
                summary: "info",
                detail: response.responseMessage,
                icon: "far fa-check-circle"
              });
            }
          },
          (error: any) => {
            // console.log(error, "error")

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
  }

  getMvnoById(id:any) {
    if (id) {
      const url = "/mvno/" + id;
      this.mvnoManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.isMvnoEdit = true;
          this.viewMvnoData = response.data;
          console.log("Mvno Data ", response.data);
          if (this.viewMvnoData.profileImage) {
            this.profileImage = `data:image/jpeg;base64,${this.viewMvnoData.profileImage}`;
          }
          this.mvnoFormGroup.patchValue(this.viewMvnoData);
          this.mvnoFormGroup.patchValue({
            isTwoFactorEnabled: this.translateBooleanToLabel(this.viewMvnoData.isTwoFactorEnabled)
          });
          console.log("this.mvnoFormGroup :::: ", this.mvnoFormGroup.value);
          this.getAddressForMvno(this.viewMvnoData.custInvoiceRefId);
        },
        (error: any) => {
          // console.log(error, "error")
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

  generateUserName() {
    if (!this.isMvnoEdit) {
      let name = this.mvnoFormGroup.value.name;
      this.mvnoFormGroup.patchValue({
        username: "admin@" + name
      });
    }
  }

  canExit() {
    if (!this.mvnoFormGroup.dirty) return true;
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
          }
        });
        return false;
      });
    }
  }

  onFileChangeUpload(event: Event) {
    const inputElement = event.target as HTMLInputElement; // Type assertion
    if (!inputElement.files || inputElement.files.length === 0) {
      return;
    }
  
    const files: FileList = inputElement.files;
    console.log("files :::: ", files.item(0));
  
    let fileArray: FileList;
    const formData = new FormData();
  
    const selectedFile = files.item(0);
    if (!selectedFile) {
      return;
    }
  
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Only JPEG and PNG files are allowed.");
      return;
    }
  
    const maxSize = 2097152; // 2MB
    if (selectedFile.size > maxSize) {
      alert("File size cannot exceed 2MB.");
      return;
    }
  
    this.mvnoFormGroup.patchValue({
      file: files
    });
  
    fileArray = files;
    formData.append("file", fileArray[0]);
    console.log(fileArray);
  
    this.mvnoFormGroup.patchValue({
      logo_file_name: selectedFile.name
    });
  
    let request = this.mvnoFormGroup.value;
    request.profileImage = fileArray[0];
  
    this.fileToUpload = selectedFile;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(",")[1];
      console.log("file ::::", reader.result);
      this.profileImage = e.target.result;
      this.mvnoFormGroup.patchValue({
        profileImage: base64Data != null ? base64Data : null
      });
    };
    reader.readAsDataURL(selectedFile);
  }
  

  getAddressForMvno(custId:any) {
    const url = "/getAddresses/" + custId;
    this.revenueService.getMethod(url).subscribe((response: any) => {
      if (response.data.length > 0)
        this.mvnoFormGroup.patchValue({
          address: response.data[0].landmark
        });
    });
  }
  translateBooleanToLabel(isEnabled: boolean): string {
    console.log("from translateBooleanToLabel :::::", isEnabled);
    return isEnabled ? "true" : "false";
  }

  getAutType() {
    const url = "/commonList/OtpAuthType";
    this.commonService.get(url).subscribe((response: any) => {
      this.twofaType = response.dataList;
    });
  }

  changeAuthType($event:any, ddlAuthType:any) {
    if (ddlAuthType.selectedOption.value == "false") {
      console.log("in ");
      this.mvnoFormGroup.controls['authEventName'].setValue("");
      this.mvnoFormGroup.get("authEventName").clearValidators();
      this.mvnoFormGroup.get("authEventName").updateValueAndValidity();
    } else {
      this.mvnoFormGroup.get("authEventName").setValidators([Validators.required]);
      this.mvnoFormGroup.get("authEventName").updateValueAndValidity();
    }
  }

  daySequence() {
    for (let i = 0; i < 31; i++) {
      this.days.push({ label: i + 1 });
    }
  }
}
