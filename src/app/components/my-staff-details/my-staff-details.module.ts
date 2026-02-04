import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { MyStaffDetailsComponent } from "./my-staff-details.component";
import { TableModule } from "primeng/table";

const routes = [{ path: "", component: MyStaffDetailsComponent }];

@NgModule({
  declarations: [MyStaffDetailsComponent],
  imports: [CommonModule, TableModule, RouterModule.forChild(routes), SharedModule],
})
export class MyStaffDetailsModule {}
