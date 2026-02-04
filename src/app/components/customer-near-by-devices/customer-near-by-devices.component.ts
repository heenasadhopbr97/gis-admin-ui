import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { CommondropdownService } from "src/app/service/commondropdown.service";

declare var $: any;

@Component({
    selector: "app-customer-near-by-devices",
    templateUrl: "./customer-near-by-devices.component.html",
    styleUrls: ["./customer-near-by-devices.component.css"],
    standalone: false
})
export class CustomerNearByDevicesComponent implements OnInit {
  @Input() custId: any;
  // @Input() type;
  @Output() closeNearLocationModal = new EventEmitter();
  newFirst = 0;

  nearDeviceLocationData:any;
  customerIdINLocationDevice: any;
  nearLocationModal: boolean = false;
  currentPagenearDeviceLocationList = 1;
  nearDeviceLocationItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  nearDeviceLocationtotalRecords = 0;

  NetworkDeviceData: any;

  constructor(
    private spinner: NgxSpinnerService,
    private customerManagementService: CustomermanagementService,
    public confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.nearLocationModal = true;
    this.newFirst = 0;
    this.nearMyLocation();
  }

  nearMyLocation() {
    const url = "/customers/" + this.custId;

    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      var viewcustomerListData = response.customers;
      this.customerIdINLocationDevice = viewcustomerListData.id;
      this.nearLocation(viewcustomerListData);
    });
  }

  nearLocation(data:any) {
    const deviceData = {
      latitude: data.latitude,
      longitude: data.longitude,
    };
    const url = "/NetworkDevice/getNearbyDevices";
    this.customerManagementService.postMethodInventory(url, deviceData).subscribe(
      (response: any) => {
        this.nearDeviceLocationData = response.locations;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.error,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  bindNetworkDevice(networkdeviceID:any) {
    const deviceData = {};

    // const url = "/NetworkDevice/bindNetworkDevice?networkDeviceId=" + networkdeviceID;
    const url =
      "/NetworkDevice/bindNetworkDevice?customerId=" +
      this.customerIdINLocationDevice +
      "&networkDeviceId=" +
      networkdeviceID;

    this.customerManagementService.updateInventoryMethod(url, deviceData).subscribe(
      (response: any) => {
        this.NetworkDeviceData = response.locations;

        // this.getcustomerList("");
        // this.closebutton.nativeElement.click();
        this.nearsearchClose();

        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.customer,
          icon: "far fa-check-circle",
        });
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

  pageChangedNearDeviceList(pageNumber:any) {
    this.currentPagenearDeviceLocationList = pageNumber;
  }

  nearsearchClose() {
    this.nearDeviceLocationData = [];
    this.closeNearLocationModal.emit();
    this.newFirst = 0;
    this.nearLocationModal = false;
  }
}
