import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashbordComponent } from "./dashbord.component";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";

const routes = [{ path: "", component: DashbordComponent }];

@NgModule({
  declarations: [DashbordComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class DashbordModule {}
