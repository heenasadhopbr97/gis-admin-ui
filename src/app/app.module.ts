// import { AgmCoreModule } from "@agm/core";
import { AgmCoreModule } from 'ng-agm-core-lib';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from '@angular/common';
import { BrowserModule, Title } from "@angular/platform-browser";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ConfirmationPopoverModule } from "angular-confirmation-popover";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BlankComponent } from "./components/blank/blank.component";
import { FooterComponent } from "./components/footer/footer.component";
import { AclGernericComponentComponent } from "./components/generic-component/acl/acl-gerneric-component/acl-gerneric-component.component";
import { HomeComponent } from "./components/home/home.component";
import { MapsComponent } from "./components/maps/maps.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { SharedModule } from "./shared/shared.module";
import { ToastModule } from "primeng/toast";
import { ConfirmationService, MessageService } from "primeng/api";
import { DeactivateService } from "./service/deactivate.service";
import { NavMasterComponent } from "./components/nav-master/nav-master.component";
// import { VendorManagementComponent } from "./components/vendor-management/vendor-management.component";
import { LoginComponent } from "./components/login/login.component";
import { CacheInterceptor, CacheInterceptorProvider } from "./service/cache-interceptor";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { InMemoryCacheProvider } from "./service/cache-in-memory";
// import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
// import { FullCalendarModule } from "@fullcalendar/angular";
// import { NgxCaptchaModule } from 'ngx-captcha';
import { NgxSpinnerModule } from "ngx-spinner";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    LoginComponent,
    AclGernericComponentComponent,
    AppComponent,
    BlankComponent,
    FooterComponent,
    HomeComponent,
    MapsComponent,
    SidebarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastModule,
    HttpClientModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    AgmCoreModule.forRoot({
      apiKey: RadiusConstants.GOOGLE_MAPS_API_KEY,
      libraries: ["places"]
    }),
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    ConfirmationService,
    MessageService,
    DeactivateService,
    InMemoryCacheProvider,
    CacheInterceptorProvider,
    Title
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule {}
