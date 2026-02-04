import { TestBed } from "@angular/core/testing";

import { IntegrationConfigurationService } from "./integration-configuration.service";

describe("IntegrationConfigurationService", () => {
  let service: IntegrationConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntegrationConfigurationService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
