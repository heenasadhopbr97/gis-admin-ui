import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AuditLogComponent } from "./audit-log.component";
import { DialogModule } from "primeng/dialog";

const routes = [{ path: "", component: AuditLogComponent }];

@NgModule({
  declarations: [AuditLogComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, DialogModule],
})
export class AuditLogModule {}
