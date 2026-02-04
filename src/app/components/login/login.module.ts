import { NgModule } from "@angular/core";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

import { HttpClientModule } from "@angular/common/http";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule, Routes } from "@angular/router";
import { NgxPaginationModule } from "ngx-pagination";
import { ConfirmationPopoverModule } from "angular-confirmation-popover";
import { LoginComponent } from "./login.component";
import { ToastModule } from "primeng/toast";
import { NgxSpinnerModule } from "ngx-spinner";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared/shared.module";

const routes = [{ path: "", component: LoginComponent }];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ToastModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    // SharedModule
  ],
  exports: [RouterModule],
  bootstrap: [LoginComponent],
})
export class LoginModule {}
