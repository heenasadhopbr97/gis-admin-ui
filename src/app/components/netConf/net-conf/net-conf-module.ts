import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthguardGuard } from "src/app/authguard.guard";
import { DeactivateService } from "src/app/service/deactivate.service";
import { MultiSelectModule } from "primeng/multiselect";
import { NetConfComponent } from "./net-conf.component";
import { NetConfAddCustomerComponent } from "../net-conf-add-customer/net-conf-add-customer.component";
import { NetConfListComponent } from "../net-conf-list/net-conf-list.component";
import { NetConfDetailsComponent } from "../net-conf-details/net-conf-details.component";
const routes: Routes = [
  {
    path: "",
    component: NetConfComponent,
    children: [
      { path: "", redirectTo: "list", pathMatch: "full" },
      { path: "list", component: NetConfListComponent },
      { path: "detail/:custId", component: NetConfDetailsComponent },
      {
        path: "netConfcreatecustomer",
        canDeactivate: [DeactivateService],
        component: NetConfAddCustomerComponent,
      },
      {
        path: "netConfcreatecustomer/edit/:custId",
        canDeactivate: [DeactivateService],
        component: NetConfAddCustomerComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), MultiSelectModule],
  exports: [RouterModule],
})
export class netConfCustomerRoutingModule {}
