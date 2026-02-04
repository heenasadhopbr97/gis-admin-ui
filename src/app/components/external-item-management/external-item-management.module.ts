import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ExternalItemManagementRoutingModule } from "./external-item-management-routing.module";
import { ExternalItemManagementComponent } from "./external-item-management/external-item-management.component";
import { SharedModule } from "src/app/shared/shared.module";
import { DialogModule } from "primeng/dialog";
@NgModule({
  declarations: [ExternalItemManagementComponent],
  imports: [CommonModule, ExternalItemManagementRoutingModule, SharedModule, DialogModule],
})
export class ExternalItemManagementModule {}
