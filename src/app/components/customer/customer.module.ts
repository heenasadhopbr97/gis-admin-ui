import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TabViewModule } from "primeng/tabview";
import { CardModule } from "primeng/card";
import { CustomerRoutingModule } from "./customer-routing.module";
import { CustomerComponent } from "./customer.component";
import { DialogModule } from "primeng/dialog";
import { SharedModule } from "src/app/shared/shared.module";
import { CustomerInventorySpecificationParamsComponent } from "../customer-inventory-specification-params/customer-inventory-specification-params.component";

// const routes = [{ path: "", component: CustomerComponent, canDeactivate: [DeactivateService] }];

@NgModule({
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule,
    TabViewModule,
    CardModule,
    DialogModule,
    CustomerInventorySpecificationParamsComponent
  ],
  declarations: [CustomerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
  
})
export class CustomerModule {}
