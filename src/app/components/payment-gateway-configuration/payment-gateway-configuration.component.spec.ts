import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PaymentGatewayConfigurationComponent } from "./payment-gateway-configuration.component";

describe("PaymentGatewayConfigurationComponent", () => {
  let component: PaymentGatewayConfigurationComponent;
  let fixture: ComponentFixture<PaymentGatewayConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentGatewayConfigurationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentGatewayConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
