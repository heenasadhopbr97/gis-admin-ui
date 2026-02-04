import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { CommondropdownService } from "src/app/service/commondropdown.service";

declare var $: any;

@Component({
    selector: "app-plan-connection-no",
    templateUrl: "./plan-connection-no.component.html",
    styleUrls: ["./plan-connection-no.component.css"],
    standalone: false
})
export class PlanConnectionNoComponent implements OnInit {
  @Input() planForConnection :any;
  @Output() closeDialog = new EventEmitter();
  planNameOpen: boolean = false;
  constructor(
    private spinner: NgxSpinnerService,
    private customerManagementService: CustomermanagementService,
    public confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void { 
    this.planNameOpen=true;
    }

  closeModal() {
    this.closeDialog.emit();
    this.planNameOpen=false;
  }
}
