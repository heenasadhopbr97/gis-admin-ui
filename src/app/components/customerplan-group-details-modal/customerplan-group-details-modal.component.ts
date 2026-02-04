import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { BillRunMasterService } from "src/app/service/bill-run-master.service";

@Component({
    selector: "app-customerplan-group-details-modal",
    templateUrl: "./customerplan-group-details-modal.component.html",
    styleUrls: ["./customerplan-group-details-modal.component.css"],
    standalone: false
})
export class CustomerplanGroupDetailsModalComponent implements OnInit {
  @Input() dialogId: string;
  @Input() planGroupcustid: Observable<any>;

  currentPageMasterSlab = 1;
  MasteritemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  MastertotalRecords: any;

  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 0;
  dataPlan: any = [];
  customerID: any = "";
  CutomerEventID: any;
  planMappingList:any[] = [];
  customerBill = "";

  constructor(
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private billRunMasterService: BillRunMasterService
  ) {}

  ngOnInit(): void {
    this.planGroupcustid.subscribe(value => {
      if (value.planGroupcustid) {
        this.customerID = value.planGroupcustid;
        this.getCustomerData(value.planGroupcustid);
      }
    });
  }

  getCustomerData(id:any) {
    let plandatalength = 0;
    this.dataPlan = [];
    const url = "/customers/" + id;
    this.billRunMasterService.getMethod(url).subscribe(
      (response: any) => {
        this.planMappingList = response.customers.planMappingList;
        if (this.planMappingList.length > 0) {
          this.customerBill = this.planMappingList[0].billTo;
        }

        this.planMappingList.forEach(element => {
          const planurl = "/postpaidplan/" + element.planId;
          this.billRunMasterService.getMethod(planurl).subscribe((response: any) => {
            this.dataPlan.push(response.postPaidPlan);
          });
        });
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

  pageChangedMasterList(pageNumber:any) {
    this.currentPageMasterSlab = pageNumber;
  }
}
