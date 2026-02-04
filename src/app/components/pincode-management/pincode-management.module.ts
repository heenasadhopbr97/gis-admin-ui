import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { PincodeManagementComponent } from "./pincode-management.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: PincodeManagementComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [PincodeManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class PincodeManagementModule {}
