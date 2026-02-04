import { Component, OnInit, Input } from "@angular/core";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { BillRunMasterService } from "src/app/service/bill-run-master.service";

@Component({
    selector: "app-promisetopay-details-modal",
    templateUrl: "./promisetopay-details-modal.component.html",
    styleUrls: ["./promisetopay-details-modal.component.css"],
    standalone: false
})
export class PromiseToPayDetailsModalComponent implements OnInit {
  @Input() dialogId: string;
  @Input() promiseToPayData: any;

  startDate:any;
  endDate:any;
  days:any;

  constructor(
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private billRunMasterService: BillRunMasterService
  ) {}

  ngOnInit(): void {}
}
