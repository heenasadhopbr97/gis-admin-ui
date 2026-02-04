import { TestBed } from "@angular/core/testing";

import { AcsManagementService } from "./acs-management.service";

describe("AcsManagementService", () => {
  let service: AcsManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcsManagementService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
