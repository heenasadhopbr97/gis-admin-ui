import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RadiusTemplateComponent } from "./radius-template.component";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";

const routes = [{ path: "", component: RadiusTemplateComponent }];

@NgModule({
  declarations: [RadiusTemplateComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class RadiusTemplateModule {}
