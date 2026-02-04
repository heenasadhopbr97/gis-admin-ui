import { TestBed } from "@angular/core/testing";

import { SectorManagementService } from "./sector-management.service";

describe("SectorManagementService", () => {
  let service: SectorManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SectorManagementService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
