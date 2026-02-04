import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs";
@Component({
    selector: "app-customer-inventory-details",
    templateUrl: "./customer-inventory-details.component.html",
    styleUrls: ["./customer-inventory-details.component.css"],
    standalone: false
})
export class CustomerInventoryDetailsComponent implements OnInit {
  @Input() inventoryData: Observable<any>;
  @Input() dialogId: string;
  inventoryDetailData: any;
  oldMAC: any = "";
  newMAC: any = "";
  oldSerial: any = "";
  newSerial: any = "";
  constructor() {}

  ngOnInit(): void {
    this.inventoryData.subscribe(value => {
      console.log("value", value);
      if (value.inventoryData != "") {
        this.inventoryDetailData = value.inventoryData;
        this.oldMAC = this.inventoryDetailData?.inOutWardMACMapping[0]?.macAddress;
        this.newMAC = this.inventoryDetailData?.inOutWardMACMapping[1]
          ? this.inventoryDetailData?.inOutWardMACMapping[1]?.macAddress
          : "";
        this.oldSerial = this.inventoryDetailData?.inOutWardMACMapping[0]?.serialNumber;
        this.newSerial = this.inventoryDetailData?.inOutWardMACMapping[1]
          ? this.inventoryDetailData?.inOutWardMACMapping[1]?.serialNumber
          : "";
      } else {
        this.inventoryDetailData = {};
      }
    });
  }
}
