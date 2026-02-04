import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { IntegrationAuditService } from "src/app/service/integration-audit.service";
import { IntegrationConfigurationService } from "src/app/service/integration-configuration.service";
import { MessageService } from "primeng/api";
// import * as FileSaver from "file-saver";

@Component({
    selector: "app-migration",
    templateUrl: "./migration.component.html",
    styleUrls: ["./migration.component.css"],
    standalone: false
})
export class MigrationComonent implements OnInit {
  customerMigration: FormGroup;
  selectedFile: any;
  submitted: boolean = false;
  createCustomers: boolean = true;
  updateCustomers: boolean = false;
  editMode: boolean = false;
  formSubmit: boolean = false;
  fileName: any;
  isFIleNameDialog: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private customerManagementService: CustomermanagementService,
    public integrationAuditService: IntegrationAuditService,
    public integrationConfiservice: IntegrationConfigurationService,
    private messageService: MessageService
  ) {
    this.customerMigration = this.formBuilder.group({
      file: [""],
      migrationType: [""]
    });
  }

  migrationTypeList = [
    { label: "Customer", value: "Customer" },
    { label: "Plan", value: "Plan" },
    { label: "Service Area", value: "Service Area" }
  ];

  ngOnInit(): void {
    // customerMigration: FormGroup;
  }

  onFileChangeUpload(event:any) {
    let fileArray: FileList;
    this.customerMigration.controls['file'];
    fileArray = this.customerMigration.controls['file'].value;
    console.log(fileArray);
    if (fileArray.length > 0) {
      this.selectedFile = event.target.files[0];
      if (this.customerMigration.controls['file']) {
        if (!this.isValidXLSFile(this.selectedFile)) {
          this.customerMigration.controls['file'].reset();
          alert("Please upload valid .XLSX file");
        } else {
          this.formSubmit = true;
        }
      }
    } else {
      alert("Please upload .XLSX file");
    }
  }
  uploadDocument() {
    this.submitted = true;
    if (this.customerMigration.valid) {
      const formData = new FormData();
      if (this.customerMigration.controls['file']) {
        if (!this.isValidXLSFile(this.selectedFile)) {
          this.customerMigration.controls['file'].reset();
          alert("Please upload a valid .xls file");
        } else {
          formData.append("file", this.selectedFile);
        }
      }
      console.log(this.customerMigration.controls['migrationType'].value);
      if (this.customerMigration.controls['migrationType'].value === "Plan") {
        const url = `/migration/uploadPlanXl`;
        this.integrationAuditService.postMethod(url, formData).subscribe(
          (response: any) => {
            console.log(response);
          },
          error => {
            console.error(error);
          }
        );
      }
      if (this.customerMigration.controls['migrationType'].value === "Customer") {
        const url = `/migration/uploadCusromerXl`;
        this.integrationAuditService.postMethod(url, formData).subscribe(
          (response: any) => {
            console.log(response);
          },
          error => {
            console.error(error);
          }
        );
      }
      if (this.customerMigration.controls['migrationType'].value === "Service Area") {
        const url = `/bulkDownload/upload`;
        this.integrationAuditService
          .postMethodforCommon(url, formData, { responseType: "text" })
          .subscribe(
            (response: any) => {
              console.log("API Response:", response);
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: "Uploaded Successfully",
                icon: "far fa-check-circle"
              });

              this.customerMigration.reset();
            },
            (error: any) => {
              console.error("Error:", error);
              if ((error.status = 417)) {
                this.messageService.add({
                  severity: "info",
                  summary: "Info",
                  detail: error.error || "Unknown error occurred",
                  icon: "far fa-times-circle"
                });
              } else {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: error.error || "Unknown error occurred",
                  icon: "far fa-times-circle"
                });
              }
              this.customerMigration.reset();
            }
          );
      }
    }
  }
  isValidXLSFile(file: any) {
    return file.name.endsWith(".xlsx");
  }

  openUpdateTab() {
    this.updateCustomers = true;
    this.createCustomers = false;
    this.formSubmit = false;
    this.customerMigration.reset();
  }
  openCreateTab() {
    this.createCustomers = true;
    this.updateCustomers = false;
    this.formSubmit = false;
    this.customerMigration.reset();
  }

  downloadSampleFile() {
    if (this.customerMigration.controls['migrationType'].value === "Service Area") {
      const url = `/bulkDownload/download`;
      this.customerManagementService.getDownloadServiceArea(url).subscribe(
        (response: any) => {
          console.log(response);
          const file = new Blob([response], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          });
          // FileSaver.saveAs(file, "ServiceAreaReport");
        },
        error => {
          console.error(error);
        }
      );
    } else {
      let url = `/download/${this.fileName}`;
      this.customerManagementService.getDownloadMethod(url).subscribe(
        (response: any) => {
          console.log("response", response);
          const file = new Blob([response], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          });
          // FileSaver.saveAs(file, "Sheet");
        },
        () => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Something went wrong!!!!",
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }

  downloadClick() {
    this.isFIleNameDialog = true;
  }

  closeFileNameDialog() {
    this.isFIleNameDialog = false;
  }

  migrationTypeChange(event: any) {
    this.fileName = "";
    this.fileName = event.value + ".xlsx";
  }
}
