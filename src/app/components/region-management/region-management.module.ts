import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RegionManagementComponent } from "./region-management.component";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: RegionManagementComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [RegionManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class RegionManagementModule {}
