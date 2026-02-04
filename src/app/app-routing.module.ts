import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AclClassConstants } from '../../src/app/constants/aclClassConstants';
import { AclConstants } from '../../src/app/constants/aclOperationConstants';
import { AuthguardGuard } from './authguard.guard';
import { CustomerDetailsComponent } from './components/common/customer-details/customer-details.component';
import { HomeComponent } from './components/home/home.component';
import { MapsComponent } from './components/maps/maps.component';
import { LoginComponent } from './components/login/login.component';
import { LocationComponent } from './components/location/location.component';
import { OlMapComponent } from './map-components/ol-map/ol-map.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  // { path: '**', redirectTo: 'login' },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'map',
    // canActivate: [AuthguardGuard],
    component: OlMapComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthguardGuard],
    children: [
      { path: '', redirectTo: 'dashbord', pathMatch: 'full' },
      {
        path: 'dashbord',
        loadChildren: () =>
          import('./components/dashbord/dashbord.module').then(
            (m) => m.DashbordModule
          ),
      },
      {
        path: 'businessunit',
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_BUSINESS_UNIT_VIEW,
          classId: AclClassConstants.ACL_BUSINESSUNIT,
          accessIdForAllOpreation: AclConstants.OPERATION_BUSINESS_UNIT_ALL,
          operation: 'businessunit',
        },
        loadChildren: () =>
          import('./components/business-unit/business-unit.module').then(
            (m) => m.BusinessUnitModule
          ),
      },
      {
        path: 'investmentCode',
        loadChildren: () =>
          import('./components/investment-code/investment-code.module').then(
            (m) => m.InvestmentCodeModule
          ),
      },
      {
        path: 'radiusrole',
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_ROLE_VIEW,
          classId: AclClassConstants.ACL_ROLE,
          accessIdForAllOpreation: AclConstants.OPERATION_ROLE_ALL,
          operation: 'radiusrole',
        },
        loadChildren: () =>
          import('./components/role-management/role-management.module').then(
            (m) => m.RoleManagementModule
          ),
      },
      {
        path: 'roleManagement',
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_ROLE_VIEW,
          classId: AclClassConstants.ACL_ROLE,
          accessIdForAllOpreation: AclConstants.OPERATION_ROLE_ALL,
          operation: 'radiusrole',
        },
        loadChildren: () =>
          import('./components/role-management/role-management.module').then(
            (m) => m.RoleManagementModule
          ),
      },
      {
        path: 'radiusclient',
        loadChildren: () =>
          import('./components/radius-client/radius-client.module').then(
            (m) => m.RadiusClientModule
          ),
      },
      {
        path: 'net-Conf',
        loadChildren: () =>
          import('./components/netConf/net-conf-list.module').then(
            (m) => m.netConfModule
          )
      },

      {
        path: 'radiuscustomer',
        loadChildren: () =>
          import('./components/radius-customer/radius-customer.module').then(
            (m) => m.RadiusCustomerModule
          ),
      },
      {
        path: 'radiusTemplateManagement',
        loadChildren: () =>
          import('./components/radius-template/radius-template.module').then(
            (m) => m.RadiusTemplateModule
          ),
      },
      {
        path: 'subbusinessunit',
        loadChildren: () =>
          import(
            './components/sub-buisness-unit/sub-buisness-unit.module'
          ).then((m) => m.SubBuisnessUnitModule),
      },
      // {
      //   path: "migratiommanagement",
      //   loadChildren: () =>
      //     import("./components/migration/migration.module").then(m => m.MigrationModule),
      // },

      {
        path: 'proxy-server',
        loadChildren: () =>
          import('./components/proxy-server/proxy-server.module').then(
            (m) => m.ProxyServerModule
          ),
      },
      {
        path: 'project-management',
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_COUNTRY_VIEW,
          classId: AclClassConstants.ACL_COUNTRY,
          accessIdForAllOpreation: AclConstants.OPERATION_COUNTRY_ALL,
          operation: 'projectManagement',
        },
        loadChildren: () =>
          import(
            './components/project-management/project-management.module'
          ).then((m) => m.ProjectManagementModule),
      },
      {
        path: 'task-management',
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_COUNTRY_VIEW,
          classId: AclClassConstants.ACL_COUNTRY,
          accessIdForAllOpreation: AclConstants.OPERATION_COUNTRY_ALL,
          operation: 'taskManagement',
        },
        loadChildren: () =>
          import('./components/task-management/task-management.module').then(
            (m) => m.TaskManagementModule
          ),
      },
      {
        path: 'countryManagement',
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_COUNTRY_VIEW,
          classId: AclClassConstants.ACL_COUNTRY,
          accessIdForAllOpreation: AclConstants.OPERATION_COUNTRY_ALL,
          operation: 'countryManagement',
        },
        loadChildren: () =>
          import(
            './components/country-management/country-management.module'
          ).then((m) => m.CountryManagementModule),
      },
      {
        path: 'stateManagement',
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_STATE_VIEW,
          classId: AclClassConstants.ACL_STATE,
          accessIdForAllOpreation: AclConstants.OPERATION_STATE_ALL,
          operation: 'stateManagement',
        },
        loadChildren: () =>
          import('./components/state-management/state-management.module').then(
            (m) => m.StateManagementModule
          ),
      },
      {
        path: 'cityManagement',
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_CITY_VIEW,
          classId: AclClassConstants.ACL_CITY,
          accessIdForAllOpreation: AclConstants.OPERATION_CITY_ALL,
          operation: 'cityManagement',
        },
        loadChildren: () =>
          import('./components/city-management/city-management.module').then(
            (m) => m.CityManagementModule
          ),
      },
      {
        path: 'pincodeManagement',
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_PINCODE_VIEW,
          classId: AclClassConstants.ACL_PINCODE,
          accessIdForAllOpreation: AclConstants.OPERATION_PINCODE_ALL,
          operation: 'pincodeManagement',
        },
        loadChildren: () =>
          import(
            './components/pincode-management/pincode-management.module'
          ).then((m) => m.PincodeManagementModule),
      },
      {
        path: 'areaManagement',
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_AREA_VIEW,
          classId: AclClassConstants.ACL_AREA,
          accessIdForAllOpreation: AclConstants.OPERATION_AREA_ALL,
          operation: 'areaManagement',
        },
        loadChildren: () =>
          import('./components/area-management/area-management.module').then(
            (m) => m.AreaManagementModule
          ),
      },
      // {
      //   path: "customer/:custType",
      //   canActivate: [AuthguardGuard],
      //   data: {
      //     operationId: AclConstants.OPERATION_CUSTOMER_VIEW,
      //     classId: AclClassConstants.ACL_CUSTOMER,
      //     accessIdForAllOpreation: AclConstants.OPERATION_CUSTOMER_ALL,
      //     operation: "customer",
      //   },
      //   loadChildren: () =>
      //     import("./components/customer-old/customer-old.module").then(m => m.CustomerOldModule),
      // },
      {
        path: 'customer',
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_CUSTOMER_VIEW,
          classId: AclClassConstants.ACL_CUSTOMER,
          accessIdForAllOpreation: AclConstants.OPERATION_CUSTOMER_ALL,
          operation: 'customer',
        },
        loadChildren: () =>
          import('./components/customer/customer.module').then(
            (m) => m.CustomerModule
          ),
      },
      // {
      //   path: "customer",
      //   canActivate: [AuthguardGuard],
      //   data: {
      //     operationId: AclConstants.OPERATION_CUSTOMER_VIEW,
      //     classId: AclClassConstants.ACL_CUSTOMER,
      //     accessIdForAllOpreation: AclConstants.OPERATION_CUSTOMER_ALL,
      //     operation: "customer",
      //   },
      //   loadChildren: () =>
      //     import("./componen                                                                            ts/postpaid-customer/postpaid-customer.module").then(m => m.PostpaidCustomerModule),
      // },
      // {
      //   path: "prepaid-customer",
      //   canActivate: [AuthguardGuard],
      //   data: {
      //     operationId: AclConstants.OPERATION_CUSTOMER_VIEW,
      //     classId: AclClassConstants.ACL_CUSTOMER,
      //     accessIdForAllOpreation: AclConstants.OPERATION_CUSTOMER_ALL,
      //     operation: "prepaid-customer",
      //   },
      //   loadChildren: () =>
      //     import("./components/prepaid-customer-copy/prepaid-customer.module").then(
      //       m => m.PrepaidCustomerModule
      //     ),
      // },
      // {
      //   path: "add-service",
      //   canActivate: [AuthguardGuard],
      //   // data: {
      //   //   operationId: AclConstants.OPERATION_CUSTOMER_VIEW,
      //   //   classId: AclClassConstants.ACL_CUSTOMER,
      //   //   accessIdForAllOpreation: AclConstants.OPERATION_CUSTOMER_ALL,
      //   //   operation: "customer-template",
      //   // },
      //   loadChildren: () =>
      //     import("./components/add-service/add-service.module").then(
      //       m => m.AddServiceModule
      //     ),
      // },

      {
        path: 'auditLog',
        loadChildren: () =>
          import('./components/audit-log/audit-log.module').then(
            (m) => m.AuditLogModule
          ),
      },
      {
        path: 'customerDetail',
        component: CustomerDetailsComponent,
      },
      {
        path: 'customer-documents/:custType/:id',
        loadChildren: () =>
          import(
            './components/customer-documents/customer-documents.module'
          ).then((m) => m.CustomerDocumentsModule),
      },
      {
        path: 'radiusstaff',
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_STAFF_VIEW,
          classId: AclClassConstants.ACL_STAFF,
          accessIdForAllOpreation: AclConstants.OPERATION_STAFF_ALL,
          operation: 'radiusstaff',
        },
        loadChildren: () =>
          import('./components/radius-staff/radius-staff.module').then(
            (m) => m.RadiusStaffModule
          ),
      },
      {
        path: 'mvnoManagement',
        loadChildren: () =>
          import('./components/mvno-management/mvno-management.module').then(
            (m) => m.MvnoManagementModule
          ),
      },
      // {
      //   path: "prepaid-customer-caf",
      //   loadChildren: () =>
      //     import("./components/prepaid-customer-caf/prepaid-customer-caf.module").then(
      //       m => m.PrepaidCustomerCafModule
      //     ),
      // },
      {
        path: 'Template',
        loadChildren: () =>
          import('./components/template/template.module').then(
            (m) => m.TemplateModule
          ),
      },
      {
        path: 'popManagement',
        loadChildren: () =>
          import('./components/pop-managements/pop-managements.module').then(
            (m) => m.PopManagementsModule
          ),
      },
      {
        path: 'bulkConsumption',
        loadChildren: () =>
          import('./components/bulk-consumption/bulk-consumption.module').then(
            (m) => m.BulkConsumptionModule
          ),
      },
      {
        path: 'externalItemManagement',
        loadChildren: () =>
          import(
            './components/external-item-management/external-item-management.module'
          ).then((m) => m.ExternalItemManagementModule),
      },
      {
        path: 'serviceArea',
        loadChildren: () =>
          import('./components/service-area/service-area.module').then(
            (m) => m.ServiceAreaModule
          ),
      },

      {
        path: 'maps',
        component: MapsComponent,
      },

      {
        path: 'bankManagement',
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_BANK_MANAGEMENT_VIEW,
          classId: AclClassConstants.ACL_BANK_MANAGEMENT,
          accessIdForAllOpreation: AclConstants.OPERATION_BANK_MANAGEMENT_ALL,
          operation: 'bankManagement',
        },
        loadChildren: () =>
          import('./components/bankmanagement/bankmanagement.module').then(
            (m) => m.BankmanagementModule
          ),
      },
      {
        path: 'branch-management',
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_BRANCH_VIEW,
          classId: AclClassConstants.ACL_BRANCH,
          accessIdForAllOpreation: AclConstants.OPERATION_BRANCH_ALL,
          operation: 'branch-management',
        },
        loadChildren: () =>
          import(
            './components/branch-management/branch-management.modules'
          ).then((m) => m.BranchManagementModule),
      },
      // {
      //   path: "postpaid-rejected-reason-master",
      //   loadChildren: () =>
      //     import("./components/postpaid-rejected-reason-master/postpaid-rejected-reason-master.module").then(
      //       res => res.PostpaidRejectedReasonMasterModule
      //     ),
      // },
      {
        path: 'businessVertical',
        loadChildren: () =>
          import(
            './components/business-vertical-management/business-vertical-management.module'
          ).then((m) => m.BusinessVerticalManagementModule),
      },
      {
        path: 'subbusinessVertical',
        loadChildren: () =>
          import(
            './components/sub-business-vertical/sub-business-vertical.module'
          ).then((m) => m.SubBusinessVerticalManagementModule),
      },
      {
        path: 'navMaster',
        loadChildren: () =>
          import('./components/nav-master/navmaster.module').then(
            (m) => m.NavmasterModule
          ),
      },
      {
        path: 'goverment-integration',
        loadChildren: () =>
          import(
            './components/goverment-integration/goverment-integration.modules'
          ).then((m) => m.GovermentIntegrationModules),
      },
      {
        path: 'field-temp-mapping',
        canActivate: [AuthguardGuard],
        loadChildren: () =>
          import(
            './components/field-temp-mapping/field-temp-mapping.module'
          ).then((m) => m.FieldTempMappingModule),
      },
      {
        path: 'location',
        canActivate: [AuthguardGuard],
        loadChildren: () =>
          import('./components/location/location.module').then(
            (m) => m.LocationModule
          ),
      },

      {
        path: 'departmentManagement',
        canActivate: [AuthguardGuard],
        loadChildren: () =>
          import(
            './components/department-management/department-management.module'
          ).then((m) => m.DepartmentManagementModule),
      },
      {
        path: 'migration',
        canActivate: [AuthguardGuard],
        loadChildren: () =>
          import('./components/migration/migration.module').then(
            (m) => m.MigrationModule
          ),
      },
      {
        path: 'mvno-documents/:id',
        loadChildren: () =>
          import('./components/mvno-documents/mvno-documents.module').then(
            (m) => m.MvnoDocumentsModule
          ),
      },
      {
        path: 'vlanManagement',
        loadChildren: () =>
          import('./components/vlan-management/vlan-profile.module').then(
            (m) => m.VlanProfileModule
          ),
      },
      {
        path: 'region',
        loadChildren: () =>
          import(
            './components/region-management/region-management.module'
          ).then((m) => m.RegionManagementModule),
      },
      {
        path: 'mystaff/:id',
        loadChildren: () =>
          import('./components/my-staff-details/my-staff-details.module').then(
            (m) => m.MyStaffDetailsModule
          ),
      },
      {
        path: 'SystemConfig',
        loadChildren: () =>
          import('./components/systemconfig/systemconfig.module').then(
            (m) => m.SystemconfigModule
          ),
      },
      {
        path: 'myOrganizationCustomer',
        loadChildren: () =>
          import(
            './components/myorganizationcustomer/myorganizationcustomer.module'
          ).then((m) => m.MyorganizationcustomerModule),
      },
      {
        path: 'payment-gateway-configuration',
        canActivate: [AuthguardGuard],
        loadChildren: () =>
          import(
            './components/payment-gateway-configuration/payment-gateway-configuration.module'
          ).then((m) => m.PaymentGatewayConfigurationModule),
      },
      {
        path: 'reported-problem',
        loadChildren: () =>
          import('./components/reported-problem/reported-problem.module').then(
            (m) => m.ReportedProblemModule
          ),
      },

      // , {
      //     path: "taskCalendar",
      //     loadChildren: () =>
      //         import("./components/task-calendar/task-calendar.module").then(
      //             m => m.TaskCalendarModule
      //         )
      // }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
