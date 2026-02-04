import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MvnoListComponent } from "./mvno-list/mvno-list.component";
import { AuthguardGuard } from "src/app/authguard.guard";
import { MvnoCreateComponent } from "./mvno-create/mvno-create.component";
import { MvnoManagementComponent } from "./mvno-management.component";
import { DeactivateService } from "src/app/service/deactivate.service";
import { MultiSelectModule } from "primeng/multiselect";
import { MvnoDetailsComponent } from "./mvno-details/mvno-details.component";

const routes: Routes = [
  {
    path: "",
    component: MvnoManagementComponent,
    canActivate: [AuthguardGuard],
    children: [
      { path: "", redirectTo: "list", pathMatch: "full" },
      { path: "list", component: MvnoListComponent, pathMatch: "full" },
      {
        path: "create",
        canDeactivate: [DeactivateService],
        component: MvnoCreateComponent,
      },
      {
        path: "edit/:mvnoId",
        canActivate: [AuthguardGuard],
        component: MvnoCreateComponent,
      },
      {
        path: "details/:mvnoId",
        component: MvnoDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), MultiSelectModule],
  exports: [RouterModule],
})
export class MvnoRoutingModule {}
