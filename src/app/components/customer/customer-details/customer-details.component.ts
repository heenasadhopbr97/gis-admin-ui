// import { url } from "inspector";
import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { ActivatedRoute, Router } from "@angular/router";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";
import { StatusCheckService } from "src/app/service/status-check-service.service";

@Component({
    selector: "app-customer-details",
    templateUrl: "./customer-details.component.html",
    styleUrls: ["./customer-details.component.scss"],
    standalone: false
})
export class CustomerDetailsComponent implements OnInit {
  custType: any;
  loggedInStaffId = localStorage.getItem("userId");
  partnerId = Number(localStorage.getItem("partnerId"));

  customerLedgerDetailData: any;
  customerNetworkLocationDetailData: any;
  customerId: number;
  customerBill: "";
  serviceAreaDATA: any;
  presentAdressDATA: any = [];
  customerPopName: any = "";
  customerAddress: any;
  macList: string = "";
  locationList: string = "";
  isParentLocation: string = "NO";

  constructor(
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private customerManagementService: CustomermanagementService,
    public KeyannaCommonBaseService: KeyannaCommonBaseService,
    private route: ActivatedRoute,
    public statusCheckService: StatusCheckService,
    private router: Router
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  async ngOnInit() {
    this.getCustomersDetail(this.customerId);
    this.getCustomerNetworkLocationDetail(this.customerId);
  }

  listCustomer() {
    this.router.navigate(["/home/customer/list/" + this.custType]);
  }

  getCustomersDetail(custId:any) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.customerLedgerDetailData = response.customers;
        this.customerAddress = this.customerLedgerDetailData.addressList.find(
          (address:any) => address.version.toLowerCase() === "new"
        );

        var macArray:any[] = [];
        this.customerLedgerDetailData.customerLocations.forEach((element:any) => {
          if (macArray.indexOf(element.mac) === -1) {
            macArray.push(element.mac);
          }
        });
        this.macList = macArray.join(", ");

        var locationArray:any[] = [];
        this.customerLedgerDetailData.customerLocations.forEach((element:any) => {
          if (locationArray.indexOf(element.locationName) === -1) {
            locationArray.push(element.locationName);
          }
        });
        this.locationList = locationArray.join(", ");

        if (this.customerLedgerDetailData.customerLocations.length > 0) {
          var custLocation = this.customerLedgerDetailData.customerLocations.some(
            (location:any) => location.isParentLocation == true
          );

          this.isParentLocation = custLocation ? "YES" : "NO";
        }

        // //pop Name
        // if (this.customerLedgerDetailData.popid) {
        //   let partnerurl = "/popmanagement/" + this.customerLedgerDetailData.popid;
        //   this.customerManagementService.getMethod(partnerurl).subscribe((response: any) => {
        //     this.customerPopName = response.data.name;
        //   });
        // }

        // serviceArea Name
        if (this.customerLedgerDetailData.serviceareaid) {
          const serviceareaurl = "/serviceArea/" + this.customerLedgerDetailData.serviceareaid;
          this.KeyannaCommonBaseService.get(serviceareaurl).subscribe((response: any) => {
            this.serviceAreaDATA = response.data.name;
          });
        }

        // Address
        if (this.customerLedgerDetailData.addressList[0].addressType) {
          const areaurl = "/area/" + this.customerLedgerDetailData.addressList[0].areaId;

          this.KeyannaCommonBaseService.get(areaurl).subscribe((response: any) => {
            this.presentAdressDATA = response.data;
          });
        }
        if (this.customerLedgerDetailData.planMappingList.length > 0) {
          this.customerBill = this.customerLedgerDetailData.planMappingList[0].billTo;
        }
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

  getCustomerNetworkLocationDetail(custId:any) {
    if (this.statusCheckService.isActiveInventoryService) {
      const url = `/customer/getCustNetworkDetail?customerId=${custId}`;
      this.customerManagementService.getCustNetworkLocDetail(url).subscribe(
        (response: any) => {
          this.customerNetworkLocationDetailData = response.data;
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
}
