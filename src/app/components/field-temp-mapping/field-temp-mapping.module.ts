import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FieldTempMappingComponent } from "./field-temp-mapping.component";
import { DeactivateService } from "src/app/service/deactivate.service";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { FormsModule } from "@angular/forms";

const routes = [
  { path: "", component: FieldTempMappingComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [FieldTempMappingComponent],
  imports: [[CommonModule, RouterModule.forChild(routes), SharedModule], FormsModule],
})
export class FieldTempMappingModule {}
