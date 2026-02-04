import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { MvnoDocumentsComponent } from "./mvno-documents.component";
import { RadioButtonModule } from "primeng/radiobutton";
import { DialogModule } from "primeng/dialog";
const routes = [{ path: "", component: MvnoDocumentsComponent }];

@NgModule({
  declarations: [MvnoDocumentsComponent],
  imports: [
    CommonModule,
    DialogModule,
    // RadioButtonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
})
export class MvnoDocumentsModule {}
