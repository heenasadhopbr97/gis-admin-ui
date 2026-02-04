import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { BusinessVerticalManagementComponent } from "./business-vertical-management.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: BusinessVerticalManagementComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [BusinessVerticalManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class BusinessVerticalManagementModule {}
