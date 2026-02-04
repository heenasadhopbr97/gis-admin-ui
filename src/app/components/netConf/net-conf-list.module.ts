import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
// import { SectorManagementComponent } from "../sector-management/sector-management.component";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { NetConfListComponent } from "./net-conf-list/net-conf-list.component";
import { DeactivateService } from "src/app/service/deactivate.service";
import { NetConfAddCustomerComponent } from "./net-conf-add-customer/net-conf-add-customer.component";
import { NetConfComponent } from "./net-conf/net-conf.component";
import { netConfCustomerRoutingModule } from "./net-conf/net-conf-module";
import { NetConfDetailsComponent } from "./net-conf-details/net-conf-details.component";
@NgModule({
  declarations: [
    NetConfListComponent,
    NetConfAddCustomerComponent,
    NetConfComponent,
    NetConfDetailsComponent,
  ],
  imports: [CommonModule, netConfCustomerRoutingModule, SharedModule],
})
export class netConfModule {}
