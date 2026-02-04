import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { MvnoManagementComponent } from "./mvno-management.component";
import { MvnoListComponent } from "./mvno-list/mvno-list.component";
import { MvnoCreateComponent } from "./mvno-create/mvno-create.component";
import { MvnoDetailsComponent } from "./mvno-details/mvno-details.component";
import { MvnoRoutingModule } from "./mvno-management-routing.module";
import { AddDaysPipe } from "src/app/shared/add-days.pipe";

const routes = [{ path: "", component: MvnoManagementComponent }];

@NgModule({
  declarations: [
    MvnoManagementComponent,
    MvnoListComponent,
    MvnoCreateComponent,
    MvnoDetailsComponent,
    AddDaysPipe,
  ],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, MvnoRoutingModule],
})
export class MvnoManagementModule {}
