import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DepartmentManagementComponent } from "./department-management.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: DepartmentManagementComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [DepartmentManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class DepartmentManagementModule {}
