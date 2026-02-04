import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthguardGuard } from "src/app/authguard.guard";
import { MultiSelectModule } from "primeng/multiselect";
import { RadiusClientComponent } from "./radius-client.component";
import { RadiusClientListComponent } from "./radius-client-list/radius-client-list.component";
import { RadiusClientCreateComponent } from "./radius-client-create/radius-client-create.component";

const routes: Routes = [
  {
    path: "",
    component: RadiusClientComponent,
    canActivate: [AuthguardGuard],
    children: [
      { path: "", redirectTo: "list", pathMatch: "full" },
      { path: "list", component: RadiusClientListComponent, pathMatch: "full" },
      {
        path: "create",
        component: RadiusClientCreateComponent,
      },
      {
        path: "edit/:clientId/:mvnoId",
        component: RadiusClientCreateComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), MultiSelectModule],
  exports: [RouterModule],
})
export class RadiusClientRoutingModule {}
