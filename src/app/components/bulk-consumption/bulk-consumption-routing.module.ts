import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DeactivateService } from "src/app/service/deactivate.service";
import { BulkConsumptionComponent } from "./bulk-consumption/bulk-consumption.component";

const routes: Routes = [
  {
    path: "",
    component: BulkConsumptionComponent,
    canDeactivate: [DeactivateService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BulkConsumptionRoutingModule {}
