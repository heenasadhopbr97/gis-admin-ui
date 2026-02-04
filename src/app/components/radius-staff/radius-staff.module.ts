import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RadiusStaffComponent } from "./radius-staff.component";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DeactivateService } from "src/app/service/deactivate.service";
import { FormsModule } from "@angular/forms";

const routes = [{ path: "", component: RadiusStaffComponent, canDeactivate: [DeactivateService] }];

@NgModule({
  declarations: [RadiusStaffComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes), SharedModule],
})
export class RadiusStaffModule {}
