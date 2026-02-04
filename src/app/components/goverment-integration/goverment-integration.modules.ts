import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";

import { DeactivateService } from "src/app/service/deactivate.service";
import { GovermentIntegrationComponent } from "./goverment-integration.component";

const routes = [
  { path: "", component: GovermentIntegrationComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [GovermentIntegrationComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class GovermentIntegrationModules {}
