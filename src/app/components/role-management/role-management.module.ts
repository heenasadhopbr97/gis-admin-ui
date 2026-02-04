import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RoleManagementComponent } from "./role-management.component";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DeactivateService } from "src/app/service/deactivate.service";
import { TreeTableModule, TreeTableToggler } from "primeng/treetable";
import { CardModule } from "primeng/card";
import { CreateRoleComponent } from "./create-role/create-role.component";

const routes = [
  { path: "", component: RoleManagementComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [RoleManagementComponent, CreateRoleComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, TreeTableModule, CardModule],
})
export class RoleManagementModule {}
