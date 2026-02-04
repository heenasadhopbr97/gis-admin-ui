import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { BusinessUnitComponent } from "./business-unit.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [{ path: "", component: BusinessUnitComponent, canDeactivate: [DeactivateService] }];

@NgModule({
  declarations: [BusinessUnitComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class BusinessUnitModule {}
