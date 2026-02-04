import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { CustomerDocumentsComponent } from "./customer-documents.component";
import { RadioButtonModule } from "primeng/radiobutton";
import { DialogModule } from "primeng/dialog";
const routes = [{ path: "", component: CustomerDocumentsComponent }];

@NgModule({
  declarations: [CustomerDocumentsComponent],
  imports: [
    CommonModule,
    DialogModule,
    // RadioButtonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
})
export class CustomerDocumentsModule {}
