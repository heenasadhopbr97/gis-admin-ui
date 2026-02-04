import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { ServiceAreaComponent } from "./service-area.component";
import { DeactivateService } from "src/app/service/deactivate.service";
import { AgmCoreModule } from "@agm/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

const routes = [{ path: "", component: ServiceAreaComponent, canDeactivate: [DeactivateService] }];

@NgModule({
  declarations: [ServiceAreaComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    // AgmCoreModule.forRoot({
    //   apiKey: RadiusConstants.GOOGLE_MAPS_API_KEY,
    //   libraries: ["places", "drawing", "geometry"],
    // }),
    // GooglePlaceModule,
  ],
})
export class ServiceAreaModule {}
