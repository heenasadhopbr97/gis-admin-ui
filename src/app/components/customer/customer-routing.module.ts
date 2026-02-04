import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthguardGuard } from "src/app/authguard.guard";
import { CustomerComponent } from "./customer.component";
import { DeactivateService } from "src/app/service/deactivate.service";
import { MultiSelectModule } from "primeng/multiselect";

const routes: Routes = [
  {
    path: "",
    component: CustomerComponent,
    canActivate: [AuthguardGuard],
    children: [
      { path: "", redirectTo: "list/:custType", pathMatch: "full" },
      {
        path: "details/:custType",
        loadChildren: () =>
          import("../customer/cust-details-menu/cust-details-menu.module").then(
            m => m.CustDetailsMenuModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), MultiSelectModule],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
