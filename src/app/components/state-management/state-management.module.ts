import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { StateManagementComponent } from "./state-management.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: StateManagementComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [StateManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class StateManagementModule {}
