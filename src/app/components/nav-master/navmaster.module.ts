import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
// import { SectorManagementComponent } from "../sector-management/sector-management.component";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { NavMasterComponent } from "./nav-master.component";
import { DeactivateService } from "../../service/deactivate.service";
import { AggregationReportComponent } from "./aggregation-report/aggregation-report.component";

const routes = [{ path: "", component: NavMasterComponent, canDeactivate: [DeactivateService] }];

@NgModule({
  declarations: [NavMasterComponent, AggregationReportComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class NavmasterModule {}
