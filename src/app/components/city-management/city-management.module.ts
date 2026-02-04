import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { CityManagementComponent } from "./city-management.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: CityManagementComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [CityManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class CityManagementModule {}
