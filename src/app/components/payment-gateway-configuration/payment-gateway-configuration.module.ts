import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { PaymentGatewayConfigurationComponent } from "./payment-gateway-configuration.component";
import { DeactivateService } from "src/app/service/deactivate.service";
import { InputSwitchModule } from "primeng/inputswitch";

const routes = [
  { path: "", component: PaymentGatewayConfigurationComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [PaymentGatewayConfigurationComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, InputSwitchModule],
})
export class PaymentGatewayConfigurationModule {}
