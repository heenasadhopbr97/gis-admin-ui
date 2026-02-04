import { TestBed } from "@angular/core/testing";

import { TargetManagementService } from "./target-management.service";

describe("TargetManagementService", () => {
  let service: TargetManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TargetManagementService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
