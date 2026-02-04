import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RadiusCustomerComponent } from "./radius-customer.component";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AuthguardGuard } from "src/app/authguard.guard";
import { RadiusCustomerRoutingModule } from "./radius-customer-routing.module";
import { RadiusCustomerCreateComponent } from "./radius-customer-create/radius-customer-create.component";
import { RadiusCustomerListComponent } from "./radius-customer-list/radius-customer-list.component";
// import { RadiusCustomerDetailsComponent } from "./radius-customer-details/radius-customer-details.component";

// const routes = [{ path: "", component: RadiusCustomerComponent }];

@NgModule({
  declarations: [
    RadiusCustomerComponent,
    RadiusCustomerCreateComponent,
    RadiusCustomerListComponent,
    // RadiusCustomerDetailsComponent,
  ],
  imports: [
    CommonModule,
    // RouterModule.forChild(routes),
    RadiusCustomerRoutingModule,
    SharedModule,
  ],
})
export class RadiusCustomerModule {}
