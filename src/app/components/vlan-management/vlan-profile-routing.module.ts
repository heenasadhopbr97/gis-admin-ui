import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { VlanProfileListComponent } from "./vlan-profile-list/vlan-profile-list.component";
import { AuthguardGuard } from "src/app/authguard.guard";
import { VlanProfileCreateComponent } from "./vlan-profile-create/vlan-profile-create.component";
import { VlanProfileComponent } from "./vlan-profile.component";
import { DeactivateService } from "src/app/service/deactivate.service";
import { MultiSelectModule } from "primeng/multiselect";
import { VlanProfileBulkAddComponent } from "./vlan-profile-bulk-add/vlan-profile-bulk-add.component";
import { VlanAuditComponent } from "./vlan-audit/vlan-audit.component";

const routes: Routes = [
  {
    path: "",
    component: VlanProfileComponent,
    canActivate: [AuthguardGuard],
    children: [
      { path: "", redirectTo: "list", pathMatch: "full" },
      { path: "list", component: VlanProfileListComponent, pathMatch: "full" },
      {
        path: "create",
        component: VlanProfileCreateComponent
      },
      {
        path: "edit/:profileIdId/:mvnoId",
        component: VlanProfileCreateComponent
      },
      {
        path: "bulkAdd",
        component: VlanProfileBulkAddComponent
      },
      {
        path: "audit",
        component: VlanAuditComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), MultiSelectModule],
  exports: [RouterModule]
})
export class VlanManagementRoutingModule {}
