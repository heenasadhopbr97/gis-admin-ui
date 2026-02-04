import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { BankmanagementComponent } from "./bankmanagement.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: BankmanagementComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [BankmanagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class BankmanagementModule {}
