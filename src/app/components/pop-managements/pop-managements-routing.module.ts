import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DeactivateService } from "src/app/service/deactivate.service";
import { PopManagementsComponent } from "./pop-managements/pop-managements.component";

const routes: Routes = [
  {
    path: "",
    component: PopManagementsComponent,
    canDeactivate: [DeactivateService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopManagementsRoutingModule {}
