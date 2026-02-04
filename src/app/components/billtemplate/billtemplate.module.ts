import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { BilltemplateComponent } from "./billtemplate.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [{ path: "", component: BilltemplateComponent, canDeactivate: [DeactivateService] }];

@NgModule({
  declarations: [BilltemplateComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class BilltemplateModule {}
