import { TestBed } from "@angular/core/testing";

import { PaymentGatewayConfigurationService } from "./payment-gateway-configuration.service";

describe("PaymentGatewayConfigurationService", () => {
  let service: PaymentGatewayConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentGatewayConfigurationService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
