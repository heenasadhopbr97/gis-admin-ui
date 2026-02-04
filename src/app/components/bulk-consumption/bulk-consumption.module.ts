import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { BulkConsumptionRoutingModule } from "./bulk-consumption-routing.module";
import { BulkConsumptionComponent } from "./bulk-consumption/bulk-consumption.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [BulkConsumptionComponent],
  imports: [CommonModule, BulkConsumptionRoutingModule, SharedModule, DialogModule],
})
export class BulkConsumptionModule {}
