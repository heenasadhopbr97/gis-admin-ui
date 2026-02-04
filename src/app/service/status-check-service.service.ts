import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// import { KEYANNA_COMMON_BASE_URL } from '../RadiusUtils/RadiusConstants';
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
@Injectable({
  providedIn: "root",
})
export class StatusCheckService {
  isActiveSalesCrm = false;
  isActiveCMS = false;
  isActivePMS = false;
  isActiveTicketService = false;
  isActiveInventoryService = false;
  isActiveRevenueService = false;
  isActiveRadiusService = false;
  isActiveNotificationService = false;
  isActiveTaskManagementService = false;
  isActiveKPIService = false;
  isActiveIntegrationService = false;
  isActiveNetConfService = false;
  isActiveTacacs = false;
  constructor(private http: HttpClient) {}

  getSaleCrmServiceStatus() {
    // this.http.get(`${RadiusConstants.KEYANNA_LEAD_BASE_URL}/serviceStatus`).subscribe(
    //   (response: any) => {
    //     this.isActiveSalesCrm = true;
    //   },
    //   (error: any) => {
    //     this.isActiveSalesCrm = false;
    //   }
    // );
  }

  getCMSServiceStatus() {
    // this.http.get(`${RadiusConstants.KEYANNA_PRODUCT_MANAGEMENT_BASE_URL}/serviceStatus`).subscribe(
    //   (response: any) => {
    //     this.isActiveCMS = true;
    //   },
    //   (error: any) => {
    //     this.isActiveCMS = false;
    //   }
    // );
  }

  getPMSServiceStatus() {
    // this.http.get(`${RadiusConstants.PMS_URL}/serviceStatus`).subscribe(
    //   (response: any) => {
    //     this.isActivePMS = true;
    //   },
    //   (error: any) => {
    //     this.isActivePMS = false;
    //   }
    // );
  }

  getTicketServiceStatus() {
    // this.http.get(`${RadiusConstants.KEYANNA_TICKET_MANAGEMENT}/serviceStatus`).subscribe(
    //   (response: any) => {
    //     this.isActiveTicketService = true;
    //   },
    //   (error: any) => {
    //     this.isActiveTicketService = false;
    //   }
    // );
  }

  getInventoryServiceStatus() {
    // this.http.get(`${RadiusConstants.KEYANNA_INVENTORY_MANAGEMENT_BASE_URL}/serviceStatus`).subscribe(
    //   (response: any) => {
    //     this.isActiveInventoryService = true;
    //   },
    //   (error: any) => {
    //     this.isActiveInventoryService = false;
    //   }
    // );
  }

  getRevenueServiceStatus() {
    // this.http.get(`${RadiusConstants.KEYANNA_REVENUE_MANAGEMENT_BASE_URL}/serviceStatus`).subscribe(
    //   (response: any) => {
    //     this.isActiveRevenueService = true;
    //   },
    //   (error: any) => {
    //     this.isActiveRevenueService = false;
    //   }
    // );
  }

  getRadiusServiceStatus() {
    // this.http.get(`${RadiusConstants.KEYANNA_RADIUS_BASE_URL}/serviceStatus`).subscribe(
    //   (response: any) => {
    //     this.isActiveRadiusService = true;
    //   },
    //   (error: any) => {
    //     this.isActiveRadiusService = false;
    //   }
    // );
  }

  getNotificationServiceStatus() {
    // this.http.get(`${RadiusConstants.KEYANNA_NOTIFICATION_BASE_URL}/serviceStatus`).subscribe(
    //   (response: any) => {
    //     this.isActiveNotificationService = true;
    //   },
    //   (error: any) => {
    //     this.isActiveNotificationService = false;
    //   }
    // );
  }

  getTaskManagementServiceStatus() {
    // this.http.get(`${RadiusConstants.KEYANNA_TASK_MGMT_BASE_URL}/serviceStatus`).subscribe(
    //   (response: any) => {
    //     this.isActiveTaskManagementService = true;
    //   },
    //   (error: any) => {
    //     this.isActiveTaskManagementService = false;
    //   }
    // );
  }

  getKPIServiceStatus() {
    // this.http.get(`${RadiusConstants.KEYANNA_KPI_BASE_URL}/serviceStatus`).subscribe(
    //   (response: any) => {
    //     this.isActiveKPIService = true;
    //   },
    //   (error: any) => {
    //     this.isActiveKPIService = false;
    //   }
    // );
  }

  getIntegrationServiceStatus() {
    // this.http.get(`${RadiusConstants.KEYANNA_INTEGRATION_SYSTEM_BASE_URL}/serviceStatus`).subscribe(
    //   (response: any) => {
    //     this.isActiveIntegrationService = true;
    //   },
    //   (error: any) => {
    //     this.isActiveIntegrationService = false;
    //   }
    // );
  }

  getTacacsStatus() {
    // this.http
    //   .get(`${RadiusConstants.KEYANNA_TACACS_MANAGEMENT_SYSTEM_BASE_URL}/tacacs-service/health`)
    //   .subscribe(
    //     (response: any) => {
    //       this.isActiveTacacs = true;
    //     },
    //     (error: any) => {
    //       this.isActiveTacacs = false;
    //     }
    //   );
    // this.isActiveTacacs = false;
  }

  getNetConfServiceStatus() {
    // this.http.get(`${RadiusConstants.KEYANNA_API_GATEWAY_NETCONF_CUSTOMER}/serviceStatus`).subscribe(
    //   (response: any) => {
    //     this.isActiveNetConfService = true;
    //   },
    //   (error: any) => {
    //     this.isActiveNetConfService = false;
    //   }
    // );
  }
}
