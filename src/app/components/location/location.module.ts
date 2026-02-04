import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { LocationComponent } from "./location.component";
import { DialogModule } from "primeng/dialog";

const routes = [{ path: "", component: LocationComponent }];
@NgModule({
  declarations: [LocationComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, DialogModule],
})
export class LocationModule {}
