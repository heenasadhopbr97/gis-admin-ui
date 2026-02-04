import { TestBed } from "@angular/core/testing";

import { IntegrationAuditService } from "./integration-audit.service";

describe("IntegrationAuditService", () => {
  let service: IntegrationAuditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntegrationAuditService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
