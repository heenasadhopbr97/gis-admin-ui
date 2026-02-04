import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { SystemconfigComponent } from "./systemconfig.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [{ path: "", component: SystemconfigComponent, canDeactivate: [DeactivateService] }];

@NgModule({
  declarations: [SystemconfigComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class SystemconfigModule {}
