import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { CountryManagementComponent } from "./country-management.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes: Routes = [
  { path: "", component: CountryManagementComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [CountryManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class CountryManagementModule {}
