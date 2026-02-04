import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DeactivateService } from "src/app/service/deactivate.service";
import { InvestmentCodeComponent } from "./investment-code.component";

const routes = [
  { path: "", component: InvestmentCodeComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [InvestmentCodeComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class InvestmentCodeModule {}
