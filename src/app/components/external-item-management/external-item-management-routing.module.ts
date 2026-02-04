import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DeactivateService } from "src/app/service/deactivate.service";
import { ExternalItemManagementComponent } from "./external-item-management/external-item-management.component";

const routes: Routes = [
  {
    path: "",
    component: ExternalItemManagementComponent,
    canDeactivate: [DeactivateService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExternalItemManagementRoutingModule {}
