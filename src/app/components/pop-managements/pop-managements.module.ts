import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PopManagementsRoutingModule } from "./pop-managements-routing.module";
import { PopManagementsComponent } from "./pop-managements/pop-managements.component";
import { SharedModule } from "src/app/shared/shared.module";
import { DialogModule } from "primeng/dialog";

@NgModule({
  declarations: [PopManagementsComponent],
  imports: [CommonModule, PopManagementsRoutingModule, SharedModule, DialogModule],
})
export class PopManagementsModule {}
