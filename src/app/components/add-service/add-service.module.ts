import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
// import { AddServiceComponent } from './add-service.component';
import { DeactivateService } from "src/app/service/deactivate.service";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { AccordionModule } from "primeng/accordion";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonPlanComponent } from "../common-plan/common-plan.component";


const routes: Routes = [
  // { path: "", component: AddServiceComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [
    CommonPlanComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    AccordionModule,
    FormsModule,
    ReactiveFormsModule,
   
  ],
})
export class AddServiceModule {}
