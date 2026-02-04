import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { SubBuisnessUnitComponent } from "./sub-buisness-unit.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: SubBuisnessUnitComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [SubBuisnessUnitComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class SubBuisnessUnitModule {}
