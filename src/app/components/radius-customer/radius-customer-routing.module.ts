import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthguardGuard } from "src/app/authguard.guard";
import { DeactivateService } from "src/app/service/deactivate.service";
import { MultiSelectModule } from "primeng/multiselect";
import { RadiusCustomerComponent } from "./radius-customer.component";
import { RadiusCustomerCreateComponent } from "./radius-customer-create/radius-customer-create.component";
import { RadiusCustomerListComponent } from "./radius-customer-list/radius-customer-list.component";
import { RadiusCustomerDetailsComponent } from "./radius-customer-details/radius-customer-details.component";
import { RadiusCustomerDetailsMenuComponent } from "./radius-customer-details-menu/radius-customer-details-menu.component";
import { RadiusCustomerDetailsMenuModule } from "./radius-customer-details-menu/radius-customer-details-menu.module";

const routes: Routes = [
  {
    path: "",
    component: RadiusCustomerComponent,
    canActivate: [AuthguardGuard],
    children: [
      { path: "", redirectTo: "list", pathMatch: "full" },
      { path: "list", component: RadiusCustomerListComponent },
      {
        path: "radiuscreatecustomer",
        canDeactivate: [DeactivateService],
        component: RadiusCustomerCreateComponent,
      },
      {
        path: "radiuscreatecustomer/edit/:custId",
        canDeactivate: [DeactivateService],
        component: RadiusCustomerCreateComponent,
      },
      //   { path: "detail/:custId", component: RadiusCustomerDetailsComponent },
      {
        path: "detail",
        loadChildren: () =>
          import(
            "../radius-customer/radius-customer-details-menu/radius-customer-details-menu.module"
          ).then(m => m.RadiusCustomerDetailsMenuModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), MultiSelectModule],
  exports: [RouterModule],
})
export class RadiusCustomerRoutingModule {}
