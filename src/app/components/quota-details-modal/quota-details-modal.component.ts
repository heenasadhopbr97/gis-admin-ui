import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Observable } from "rxjs";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { PaymentamountService } from "src/app/service/paymentamount.service";

@Component({
    selector: "app-quota-details-modal",
    templateUrl: "./quota-details-modal.component.html",
    styleUrls: ["./quota-details-modal.component.css"],
    standalone: false
})
export class QuotaDetailsModalComponent implements OnInit {
  @Input() dialogId: string;
  @Input() PlanQuota: Observable<any>;
  @Output() closeDialogg = new EventEmitter();
  custQuotaListItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custQuotaListtotalRecords: any;
  currentPagecustQuotaList = 1;
  custQuotaList: any = [];
  planMappingId: any;
  planData: any;
  custid: any;
  visibleQuotaDetails: boolean = false;

  constructor(
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private customerManagementService: CustomermanagementService,
    private paymentamountService: PaymentamountService
  ) {}

  ngOnInit(): void {
    this.visibleQuotaDetails = true;
    this.PlanQuota.subscribe(value => {
      this.custid = value.custid;
      this.planData = value.PlanData;
      if (this.custid) {
        this.getCustQuotaList(this.custid);
      }
    });
  }

  getCustQuotaList(custId:any) {
    this.customerManagementService.getCustQuotaList(custId).subscribe(
      (response: any) => {
        let data = response.custQuotaList;
        this.custQuotaList = data.filter((e:any) => e.cprId == this.planData.planmapid);
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

  pageChangedCustQuotaList(pageNumber:any) {
    this.currentPagecustQuotaList = pageNumber;
  }

  closeModel() {
    this.closeDialogg.emit();
    this.visibleQuotaDetails = false;
  }
}
