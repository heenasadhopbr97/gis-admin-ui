import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { AreaManagementComponent } from "./area-management.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: AreaManagementComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [AreaManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class AreaManagementModule {}
