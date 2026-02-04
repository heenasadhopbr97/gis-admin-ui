import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { VlanProfileComponent } from "./vlan-profile.component";
import { VlanManagementRoutingModule } from "./vlan-profile-routing.module";
import { VlanProfileListComponent } from "./vlan-profile-list/vlan-profile-list.component";
import { VlanProfileCreateComponent } from "./vlan-profile-create/vlan-profile-create.component";
import { VlanProfileBulkAddComponent } from "./vlan-profile-bulk-add/vlan-profile-bulk-add.component";
import { VlanAuditComponent } from "./vlan-audit/vlan-audit.component";

const routes = [{ path: "", component: VlanProfileComponent }];

@NgModule({
  declarations: [
    VlanProfileComponent,
    VlanProfileListComponent,
    VlanProfileCreateComponent,
    VlanProfileBulkAddComponent,
    VlanAuditComponent
  ],
  imports:  [CommonModule, RouterModule.forChild(routes), SharedModule, VlanManagementRoutingModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class VlanProfileModule {}
