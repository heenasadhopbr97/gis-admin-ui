import {
    CommonModule,
    DatePipe,
    HashLocationStrategy,
    LocationStrategy,
} from "@angular/common";
import {
    NgModule,
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTableModule } from "@angular/material/table";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxPaginationModule } from "ngx-pagination";
import { NgxSpinnerModule } from "ngx-spinner";

import { AccordionModule } from "primeng/accordion";
import { BadgeModule } from "primeng/badge";
import { CalendarModule } from "primeng/calendar";
import { CardModule } from "primeng/card";
import { CheckboxModule } from "primeng/checkbox";
import { ChipsModule } from "primeng/chips";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { DividerModule } from "primeng/divider";
import { DropdownModule } from "primeng/dropdown";
import { FieldsetModule } from "primeng/fieldset";
import { FocusTrapModule } from "primeng/focustrap";
import { InputSwitchModule } from "primeng/inputswitch";
import { InputTextModule } from "primeng/inputtext";
import { ListboxModule } from "primeng/listbox";
import { MessagesModule } from "primeng/messages";
import { MultiSelectModule } from "primeng/multiselect";
import { PanelModule } from "primeng/panel";
import { PaginatorModule } from "primeng/paginator";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { RadioButtonModule } from "primeng/radiobutton";
import { RatingModule } from "primeng/rating";
import { RippleModule } from "primeng/ripple";
import { SelectButtonModule } from "primeng/selectbutton";
import { SplitButtonModule } from "primeng/splitbutton";
import { SplitterModule } from "primeng/splitter";
import { StepsModule } from 'primeng/steps';
import { TabViewModule } from "primeng/tabview";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { ChartModule } from "primeng/chart";
import { TagModule } from "primeng/tag";

import { AuthguardGuard } from "../authguard.guard";
import { AuthInterceptor } from "../service/auth.interceptor";
import { ClientGroupService } from "../service/client-group.service";
import { CustomerService } from "../service/customer.service";
import { FieldmappingService } from "../service/fieldmapping.service";
import { PrimeIcons } from "primeng/api";

import { OlMapComponent } from "./../map-components/ol-map/ol-map.component";
import { BuildingComponent } from "./../map-components/form-component/building/building.component";
import { CableComponent } from "./../map-components/form-component/cable/cable.component";
import { FatComponent } from "./../map-components/form-component/fat/fat.component";
import { FdcComponent } from "./../map-components/form-component/fdc/fdc.component";
import { FdpComponent } from "./../map-components/form-component/fdp/fdp.component";
import { PopComponent } from "./../map-components/form-component/pop/pop.component";
import { SplitterComponent } from "./../map-components/form-component/splitter/splitter.component";
import { CustomerPointComponent } from "../map-components/form-component/customer-point/customer-point.component";
import { JointComponent } from "../map-components/form-component/joint/joint.component";
import { PoleComponent } from "../map-components/form-component/pole/pole.component";
import { ManHoleComponent } from "../map-components/form-component/man-hole/man-hole.component";
import { HandHoleComponent } from "../map-components/form-component/hand-hole/hand-hole.component";
import { SurveyAreaComponent } from "../map-components/form-component/survey-area/survey-area.component";
import { WorkflowAuditDetailsModalComponent } from "src/app/components/workflow-audit-details-modal/workflow-audit-details-modal.component";
import { StaffSelectModelComponent } from "../components/staff-select-model/staff-select-model.component";
import { AllServiceAreaPolygon } from "../components/common/all-service-area-polygon/all-service-area-polygon.component";
import { CommonInventoryManagementComponent } from "../components/common-inventory-management/common-inventory-management.component";
import { PromiseToPayDetailsModalComponent } from "../components/promisetopay-details-modal/promisetopay-details-modal.component";
import { PlanConnectionNoComponent } from "../components/plan-connection-no/plan-connection-no.component";

import { CustomMinDirective } from "../directive/custom-min-validator.directive";
import { CustomMaxDirective } from "../directive/custom-max-validator.directive";
import { CustomDecimalDirective } from "../directive/custom-decimal-validator.directive";
import { CustomerDetailsComponent } from "../components/common/customer-details/customer-details.component";
import { CustChangeStatusComponent } from "../components/cust-change-status/cust-change-status.component";
import { QuotaDetailsModalComponent } from "../components/quota-details-modal/quota-details-modal.component";
import { CustomerSelectComponent } from "../components/customer-select/customer-select.component";
import { PaymentAmountModelComponent } from "../components/payment-amount-model/payment-amount-model.component";
import { SelectStaffComponent } from "../components/common/select-staff/select-staff.component";
import { InvoicePaymentDetailsModalComponent } from "../components/invoice-payment-details-modal/invoice-payment-details-modal.component";
import { InvoiceDetalisModelComponent } from "../components/invoice-detalis-model/invoice-detalis-model.component";
import { CustomerplanGroupDetailsModalComponent } from "../components/customerplan-group-details-modal/customerplan-group-details-modal.component";
import { CustomerWithdrawalmodalComponent } from "../components/customer-withdrawalmodal/customer-withdrawalmodal.component";
import { CustChangePlanComponent } from "../components/cust-change-plan/cust-change-plan.component";
import { TreeTableModule } from "primeng/treetable";
import { ChildCustChangePlanComponent } from "../components/child-cust-change-plan/child-cust-change-plan.component";
import { CustomerInventorySpecificationParamsComponent } from "../components/customer-inventory-specification-params/customer-inventory-specification-params.component";
import { CustomerInventoryDetailsComponent } from "../components/customer-inventory-details/customer-inventory-details.component";
import { ToastrModule } from "ngx-toastr";
import { NetworkElementFormComponent } from "../map-components/ne-form/network-element-form/network-element-form.component";
import { SurveyAssignmentDialogComponent } from "../map-components/ne-form/survey-assignment-dialog/survey-assignment-dialog.component";
import { LayerDialogComponent } from "../map-components/ne-form/layer-dialog/layer-dialog.component";
import { BuildlingTypeComponent } from "../map-components/form-component/buildling-type/buildling-type.component";
import { DrawingToolsComponent } from "../map-components/reusable-component/drawing-tools/drawing-tools.component";
import { SearchComponent } from "../map-components/ne-form/search/search.component";
import { ZoomComponent } from "../map-components/ne-form/zoom/zoom.component";
import { LayersComponent } from "../map-components/ne-form/layers/layers.component";
import { MapBackgroundSwitcherComponent } from "../map-components/reusable-component/map-background-switcher/map-background-switcher.component";
import { FdtComponent } from "../map-components/form-component/fdt/fdt.component";
import { OltComponent } from "../map-components/form-component/olt/olt.component";
import { ConnectionDialogComponent } from "../map-components/reusable-component/connection-dialog/connection-dialog.component";
import { SurveyStageComponent } from "../map-components/ne-form/survey-stage/survey-stage.component";
import { SVGDiagramComponent } from '../map-components/reusable-component/svg-diagram/svg-diagram.component';
import { NetworkVisualizerComponent } from '../map-components/reusable-component/network-visualizer/network-visualizer.component';
import { ParentConnectionDialogComponent } from '../map-components/reusable-component/parent-connection-dialog/parent-connection-dialog.component';
import { SidebarModule } from 'primeng/sidebar';
import { ConnectionBuilderComponent } from "../map-components/reusable-component/parent-connection-dialog/connection-builder/connection-builder.component";
import { DeviceDetailsComponent } from "../map-components/reusable-component/parent-connection-dialog/device-details/device-details.component";
import { AreaMappingComponent } from "../map-components/ne-form/area-mapping/area-mapping.component";


@NgModule({
  declarations: [
    // all your components and directives,
    SearchComponent,
    CustomMaxDirective,
    CustomMinDirective,
    CustomDecimalDirective,
    OlMapComponent,
    ConnectionDialogComponent,
    SurveyStageComponent,
    BuildingComponent,
    BuildlingTypeComponent,
    CableComponent,
    CustomerPointComponent,
    FatComponent,
    FdtComponent,
    OltComponent,
    FdcComponent,
    FdpComponent,
    PopComponent,
    SplitterComponent,
    JointComponent,
    PoleComponent,
    ManHoleComponent,
    HandHoleComponent,
    SurveyAreaComponent,
    NetworkElementFormComponent,
    SurveyAssignmentDialogComponent,
    LayerDialogComponent,
    DrawingToolsComponent,
    ConnectionDialogComponent,
    ParentConnectionDialogComponent,
    CustomerDetailsComponent,
    WorkflowAuditDetailsModalComponent,
    StaffSelectModelComponent,
    AllServiceAreaPolygon,
    CommonInventoryManagementComponent,
    PromiseToPayDetailsModalComponent,
    PlanConnectionNoComponent,
    CustChangeStatusComponent,
    QuotaDetailsModalComponent,
    CustomerSelectComponent,
    PaymentAmountModelComponent,
    SelectStaffComponent,
    InvoicePaymentDetailsModalComponent,
    InvoiceDetalisModelComponent,
    CustomerplanGroupDetailsModalComponent,
    CustomerWithdrawalmodalComponent,
    CustChangePlanComponent,
    ChildCustChangePlanComponent,
    CustomerInventoryDetailsComponent,
    ZoomComponent,
    LayersComponent,
    AreaMappingComponent,
    MapBackgroundSwitcherComponent,
    SurveyStageComponent,
    SVGDiagramComponent,
    NetworkVisualizerComponent,
    ConnectionBuilderComponent,
    DeviceDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgSelectModule,
    NgxPaginationModule,
    NgxSpinnerModule,

    // Material modules
    MatButtonModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTableModule,
    MatSlideToggleModule,

    // PrimeNG modules
    AccordionModule,
    BadgeModule,
    CalendarModule,
    CardModule,
    CheckboxModule,
    ChipsModule,
    ConfirmDialogModule,
    DialogModule,
    DividerModule,
    DropdownModule,
    FieldsetModule,
    FocusTrapModule,
    InputSwitchModule,
    InputTextModule,
    ListboxModule,
    MessagesModule,
    MultiSelectModule,
    PanelModule,
    PaginatorModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    RatingModule,
    RippleModule,
    SelectButtonModule,
    SplitButtonModule,
    SplitterModule,
    StepsModule ,
    TabViewModule,
    TableModule,
    ToastModule,
    TreeTableModule,
    CustomerInventorySpecificationParamsComponent,
    ToastrModule.forRoot(),
    SidebarModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgSelectModule,
    NgxPaginationModule,
    NgxSpinnerModule,

    // Export shared Material & PrimeNG modules
    MatButtonModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTableModule,
    MatSlideToggleModule,

    AccordionModule,
    BadgeModule,
    CalendarModule,
    CardModule,
    CheckboxModule,
    ChipsModule,
    ConfirmDialogModule,
    DialogModule,
    DividerModule,
    DropdownModule,
    FieldsetModule,
    FocusTrapModule,
    InputSwitchModule,
    InputTextModule,
    ListboxModule,
    MessagesModule,
    MultiSelectModule,
    PanelModule,
    PaginatorModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    RatingModule,
    RippleModule,
    SelectButtonModule,
    SplitButtonModule,
    SplitterModule,
    StepsModule ,
    TabViewModule,
    TableModule,
    ToastModule,
    TreeTableModule,
    ChartModule,
    BuildingComponent,
    BuildlingTypeComponent,
    CableComponent,
    CustomerPointComponent,
    FatComponent,
    FdtComponent,
    OltComponent,
    FdcComponent,
    FdpComponent,
    PopComponent,
    SplitterComponent,
    JointComponent,
    PoleComponent,
    ManHoleComponent,
    HandHoleComponent,
    SurveyAreaComponent,
    NetworkElementFormComponent,
    SurveyAssignmentDialogComponent,
    LayerDialogComponent,
    DrawingToolsComponent,
    ConnectionDialogComponent,
    ParentConnectionDialogComponent,
    CustomerDetailsComponent,
    WorkflowAuditDetailsModalComponent,
    StaffSelectModelComponent,
    AllServiceAreaPolygon,
    CommonInventoryManagementComponent,
    PromiseToPayDetailsModalComponent,
    PlanConnectionNoComponent,
    CustChangeStatusComponent,
    QuotaDetailsModalComponent,
    CustomerSelectComponent,
    PaymentAmountModelComponent,
    SelectStaffComponent,
    InvoicePaymentDetailsModalComponent,
    InvoiceDetalisModelComponent,
    CustomerplanGroupDetailsModalComponent,
    CustomerWithdrawalmodalComponent,
    CustChangePlanComponent,
    CustomerInventorySpecificationParamsComponent,
    CustomerInventoryDetailsComponent,
    OlMapComponent,
    ConnectionDialogComponent,
    SurveyStageComponent,
    SearchComponent,
    // Export shared directives/components
    CustomMaxDirective,
    CustomMinDirective,
    CustomDecimalDirective,
    ZoomComponent,
    LayersComponent,
    AreaMappingComponent,
    MapBackgroundSwitcherComponent,
    SurveyStageComponent,
    SVGDiagramComponent,
    NetworkVisualizerComponent,
    ConnectionBuilderComponent,
    DeviceDetailsComponent
    // All your exported components...
  ],
  providers: [
    ClientGroupService,
    CustomerService,
    FieldmappingService,
    AuthguardGuard,
    DatePipe,
    PrimeIcons,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SharedModule {}
