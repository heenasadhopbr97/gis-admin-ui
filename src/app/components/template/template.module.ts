import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { TemplateComponent } from "./template.component";

const routes = [{ path: "", component: TemplateComponent }];

@NgModule({
  declarations: [TemplateComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class TemplateModule {}
