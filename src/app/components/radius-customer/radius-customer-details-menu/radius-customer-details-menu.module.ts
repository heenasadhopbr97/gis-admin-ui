import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { TabViewModule } from "primeng/tabview";
import { CardModule } from "primeng/card";
import { RadiusCustomerDetailsMenuRoutingModule } from "./radius-customer-details-menu-routing.module";
import { RadiusCustomerDetailsComponent } from "../radius-customer-details/radius-customer-details.component";
import { RadiusCustomerPlansComponent } from "../radius-customer-plans/radius-customer-plans.component";
import { RadiusCustomerCDRSessionsComponent } from "../radius-customer-cdr-sessions/radius-customer-cdr-sessions.component";
import { RadiusCustomerDetailsMenuComponent } from "./radius-customer-details-menu.component";
import { SplitterModule } from "primeng/splitter";
import { AccordionModule } from "primeng/accordion";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";
import { DropdownModule } from "primeng/dropdown";
import { ButtonModule } from "primeng/button";

@NgModule({
  imports: [
    DialogModule,
    CommonModule,
    RadiusCustomerDetailsMenuRoutingModule,
    SharedModule,
    TabViewModule,
    CardModule,
    SplitterModule,
    AccordionModule,
    TableModule,
    DropdownModule,
    ButtonModule,
  ],
  declarations: [
    RadiusCustomerDetailsMenuComponent,
    RadiusCustomerDetailsComponent,
    RadiusCustomerPlansComponent,
    RadiusCustomerCDRSessionsComponent,
  ],
})
export class RadiusCustomerDetailsMenuModule {}
