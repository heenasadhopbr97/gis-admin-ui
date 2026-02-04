import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { BranchManagementComponent } from "./branch-management.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: BranchManagementComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [BranchManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class BranchManagementModule {}
