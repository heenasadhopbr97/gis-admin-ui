import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { ProxyServerComponent } from "./proxy-server.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [{ path: "", component: ProxyServerComponent, canDeactivate: [DeactivateService] }];

@NgModule({
  declarations: [ProxyServerComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class ProxyServerModule {}
