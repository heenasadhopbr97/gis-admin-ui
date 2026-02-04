import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { ReportedProblemComponent } from "./reported-problem.component";

const routes = [{ path: "", component: ReportedProblemComponent }];
@NgModule({
  declarations: [ReportedProblemComponent],
  imports: [
    CommonModule,RouterModule.forChild(routes), SharedModule
  ]
})
export class ReportedProblemModule { }
