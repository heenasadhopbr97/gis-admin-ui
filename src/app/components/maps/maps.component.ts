import { Component, OnInit } from "@angular/core";
import { NetworkdeviceService } from "src/app/service/networkdevice.service";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";

@Component({
    selector: "app-maps",
    templateUrl: "./maps.component.html",
    styleUrls: ["./maps.component.css"],
    standalone: false
})
export class MapsComponent implements OnInit {
  devices: any = [];
  devicesLocations: any = [];

  AclClassConstants;
  AclConstants;
  public loginService: LoginService;

  constructor(
    private networkdeviceService: NetworkdeviceService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    loginService: LoginService,
    private commondropdownService: CommondropdownService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }

  ngOnInit(): void {
    this.getnetworkDeviceList();
  }

  lat = 20.5937;
  lng = 78.9629;
  zoom = 5;

  getnetworkDeviceList() {
    const url = "/NetworkDevice/all";
    this.networkdeviceService.getMethod(url).subscribe(
      (response: any) => {
        this.devices = response.dataList;
        this.devices.forEach((element:any) => {
          if (element.devicetype == "Splitter") {
            this.devicesLocations.push({
              lat: element.latitude,
              lng: element.longitude,
              label: element.name,
              icon: "assets/img/All_Icons/11_Network_Management/Map/03_Splitter_Y2.png",
            });
          } else if (element.devicetype == "ONU") {
            this.devicesLocations.push({
              lat: element.latitude,
              lng: element.longitude,
              label: element.name,
              icon: "assets/img/All_Icons/11_Network_Management/Map/01_ONU_Y2.png",
            });
          } else if (element.devicetype == "OLT") {
            this.devicesLocations.push({
              lat: element.latitude,
              lng: element.longitude,
              label: element.name,
              icon: "assets/img/All_Icons/11_Network_Management/Map/02_OLT_Y2.png",
            });
          } else if (element.devicetype == "Router") {
            this.devicesLocations.push({
              lat: element.latitude,
              lng: element.longitude,
              label: element.name,
              icon: "assets/img/All_Icons/11_Network_Management/Map/04_Fiber_Y2.png",
            });
          }
          else if (element.devicetype == "Switch") {
            this.devicesLocations.push({
              lat: element.latitude,
              lng: element.longitude,
              label: element.name,
              icon: "assets/img/All_Icons/11_Network_Management/Map/04_Fiber_Y2.png",
            });
          }
          else if (element.devicetype == "Master DB/DB") {
            this.devicesLocations.push({
              lat: element.latitude,
              lng: element.longitude,
              label: element.name,
              icon: "assets/img/All_Icons/11_Network_Management/Map/04_Fiber_Y2.png",
            });
          }
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
}
