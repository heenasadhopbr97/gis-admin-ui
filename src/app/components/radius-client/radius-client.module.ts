import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RadiusClientComponent } from "./radius-client.component";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DeactivateService } from "src/app/service/deactivate.service";
import { RadiusClientListComponent } from "./radius-client-list/radius-client-list.component";
import { RadiusClientRoutingModule } from "./radius-client-routing.module";
import { RadiusClientCreateComponent } from "./radius-client-create/radius-client-create.component";

const routes = [{ path: "", component: RadiusClientComponent }];

@NgModule({
  declarations: [RadiusClientComponent, RadiusClientListComponent, RadiusClientCreateComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, RadiusClientRoutingModule],
})
export class RadiusClientModule {}
