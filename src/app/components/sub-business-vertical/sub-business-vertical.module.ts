import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { SubBusinessVerticalComponent } from "./sub-business-vertical.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: SubBusinessVerticalComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [SubBusinessVerticalComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class SubBusinessVerticalManagementModule {}
