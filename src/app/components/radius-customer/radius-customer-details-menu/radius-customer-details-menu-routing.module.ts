import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthguardGuard } from "src/app/authguard.guard";
// import { CustomerCreateComponent } from "../customer-create/customer-create.component";
import { RadiusCustomerDetailsComponent } from "../radius-customer-details/radius-customer-details.component";
import { RadiusCustomerCDRSessionsComponent } from "../radius-customer-cdr-sessions/radius-customer-cdr-sessions.component";
// import { CustomerLedgerComponent } from "../customer-ledger/customer-ledger.component";
import { RadiusCustomerPlansComponent } from "../radius-customer-plans/radius-customer-plans.component";
// import { CustomerInvoiceComponent } from "../customer-invoice/customer-invoice.component";
import { RadiusCustomerDetailsMenuComponent } from "./radius-customer-details-menu.component";
// import { CustomerPaymentComponent } from "../customer-payment/customer-payment.component";
// import { CustomerChangeDiscountComponent } from "../customer-change-discount/customer-change-discount.component";
// import { CustChangePlanComponent } from "../cust-change_plan/cust-change_plan.component";
// import { CustomerChangeStatusComponent } from "../customer-change-status/customer-change-status.component";
// import { CustInventoryManagementComponent } from "../cust-inventory-management/cust-inventory-management.component";
// import { CustServiceManagementComponent } from "../cust-service-management/cust-service-management.component";
// import { AddServiceComponent } from "../add-service/add-service.component";
// import { CustSessionHistoryComponent } from "../cust-session-history/cust-session-history.component";
// import { CustTicketsComponent } from "../cust-tickets/cust-tickets.component";
// import { CustChargeManagementComponent } from "../cust-charge-management/cust-charge-management.component";
// import { CustCreditNoteComponent } from "../cust-credit-note/cust-credit-note.component";
// import { CustDBRReportComponent } from "../cust-dbr-report/cust-dbr-report.component";
// import { CustWorkflowAuditComponent } from "../cust-workflow-audit/cust-workflow-audit.component";
// import { CustAuditDetailsComponent } from "../cust-audit-details/cust-audit-details.component";
// import { CustDunningManagementComponent } from "../cust-dunning-management/cust-dunning-management.component";
// import { CustNotificationManagementComponent } from "../cust-notification-management/cust-notification-management.component";
// import { ChildCustComponent } from "../child-cust/child-cust.component";
// import { CustShiftLocationComponent } from "../cust-shift-location/cust-shift-location.component";
// import { CustipManagementComponent } from "../cust-ip-management/cust-ip-management.component";
// import { CustmacManagementComponent } from "../cust-mac-management/cust-mac-management.component";
const routes: Routes = [
  {
    path: "",
    component: RadiusCustomerDetailsMenuComponent,
    canActivate: [AuthguardGuard],
    children: [
      { path: "", redirectTo: "x/:custId", pathMatch: "full" },
      {
        path: "x/:custId",
        canActivate: [AuthguardGuard],
        component: RadiusCustomerDetailsComponent,
      },
      {
        path: "plans/:custId",
        canActivate: [AuthguardGuard],
        component: RadiusCustomerPlansComponent,
      },
      {
        path: "cdr/:custId",
        canActivate: [AuthguardGuard],
        component: RadiusCustomerCDRSessionsComponent,
      },
      //   {
      //     path: "ledger/:customerId",
      //     canActivate: [AuthguardGuard],
      //     component: CustomerLedgerComponent,
      //   },
      //   {
      //     path: "invoice/:customerId",
      //     canActivate: [AuthguardGuard],
      //     component: CustomerInvoiceComponent,
      //   },
      //   {
      //     path: "payment/:customerId",
      //     canActivate: [AuthguardGuard],
      //     component: CustomerPaymentComponent,
      //   },
      //   {
      //     path: "changeDiscount/:customerId",
      //     canActivate: [AuthguardGuard],
      //     component: CustomerChangeDiscountComponent,
      //   },
      //   {
      //     path: "changePlan/:customerId",
      //     canActivate: [AuthguardGuard],
      //     component: CustChangePlanComponent,
      //   },
      //   {
      //     path: "changeStatus/:customerId",
      //     canActivate: [AuthguardGuard],
      //     component: CustomerChangeStatusComponent,
      //   },
      //   {
      //     path: "inventoryManagement/:customerId",
      //     canActivate: [AuthguardGuard],
      //     component: CustInventoryManagementComponent,
      //   },
      //   {
      //     path: "serviceManagement/:customerId",
      //     canActivate: [AuthguardGuard],
      //     component: CustServiceManagementComponent,
      //   },
      //   {
      //     path: "serviceManagement/add-service/:customerId",
      //     canActivate: [AuthguardGuard],
      //     component: AddServiceComponent,
      //   },
      //   {
      //     path: "sessionHistory/:customerId",
      //     canActivate: [AuthguardGuard],
      //     component: CustSessionHistoryComponent,
      //   },
      //   {
      //     path: "tickets/:customerId",
      //     canActivate: [AuthguardGuard],
      //     component: CustTicketsComponent,
      //   },
      //   {
      //     path: "chargeManagement/:customerId",
      //     canActivate: [AuthguardGuard],
      //     component: CustChargeManagementComponent,
      //   },
      //   {
      //     path: "creditNote/:customerId",
      //     canActivate: [AuthguardGuard],
      //     component: CustCreditNoteComponent,
      //   },
      //   {
      //     path: "revenueReport/:customerId",
      //     canActivate: [AuthguardGuard],
      //     component: CustDBRReportComponent,
      //   },
      //   {
      //     path: "workflowAudit/:customerId",
      //     canActivate: [AuthguardGuard],
      //     component: CustWorkflowAuditComponent,
      //   },
      //   {
      //     path: "auditDetails/:customerId",
      //     canActivate: [AuthguardGuard],
      //     component: CustAuditDetailsComponent,
      //   },
      //   {
      //     path: "dunningManagement/:customerId",
      //     canActivate: [AuthguardGuard],
      //     component: CustDunningManagementComponent,
      //   },
      //   {
      //     path: "notification/:customerId",
      //     canActivate: [AuthguardGuard],
      //     component: CustNotificationManagementComponent,
      //   },
      //   {
      //     path: "ipManagement/:customerId",
      //     canActivate: [AuthguardGuard],
      //     component: CustipManagementComponent,
      //   },
      //   {
      //     path: "macManagement/:customerId",
      //     canActivate: [AuthguardGuard],
      //     component: CustmacManagementComponent,
      //   },
      //   {
      //     path: "childCustomers/:customerId",
      //     canActivate: [AuthguardGuard],
      //     component: ChildCustComponent,
      //   },
      //   {
      //     path: "shiftLocation/:customerId",
      //     canActivate: [AuthguardGuard],
      //     component: CustShiftLocationComponent,
      //   },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RadiusCustomerDetailsMenuRoutingModule {}
