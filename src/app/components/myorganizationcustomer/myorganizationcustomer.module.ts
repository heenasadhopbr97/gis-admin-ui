import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { MyorganizationcustomerComponent } from "./myorganizationcustomer.component";

const routes = [{ path: "", component: MyorganizationcustomerComponent }];

@NgModule({
  declarations: [MyorganizationcustomerComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class MyorganizationcustomerModule {}
