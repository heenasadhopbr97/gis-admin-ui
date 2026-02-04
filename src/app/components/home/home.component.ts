import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LoginService } from "src/app/service/login.service";
import { SidebarService } from "src/app/service/sidebar.service";
import { StatusCheckService } from "src/app/service/status-check-service.service";
import { Router } from '@angular/router';

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"],
    standalone: false
})
export class HomeComponent implements OnInit {
  constructor(
    private snack: MatSnackBar,
    public sidebarService: SidebarService,
    public loginService: LoginService,
    public statusCheckService: StatusCheckService,
    private router: Router
  ) {
    // console.log("Consructor clicked");
  }

  ngOnInit(): void {
    // console.log("Ng OnInit :::::::: ");
    this.loginService.getAclEntry();
    this.statusCheckService.getCMSServiceStatus();
    this.statusCheckService.getSaleCrmServiceStatus();
    this.statusCheckService.getPMSServiceStatus();
    this.statusCheckService.getTicketServiceStatus();
    this.statusCheckService.getInventoryServiceStatus();
    this.statusCheckService.getRevenueServiceStatus();
    this.statusCheckService.getRadiusServiceStatus();
    this.statusCheckService.getNotificationServiceStatus();
    this.statusCheckService.getTaskManagementServiceStatus();
    this.statusCheckService.getKPIServiceStatus();
    this.statusCheckService.getIntegrationServiceStatus();
    this.statusCheckService.getTacacsStatus();
    this.statusCheckService.getNetConfServiceStatus();
  }

  roleButtonClick() {
    console.log("Role button click");
    this.snack.open("Role button clicked", "cancel");
  }

  switchToMapPanel() {
  this.router.navigate(['/map']); 
  }
}
