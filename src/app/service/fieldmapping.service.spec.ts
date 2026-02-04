import { TestBed } from "@angular/core/testing";

import { FieldmappingService } from "./fieldmapping.service";

describe("FieldmappingService", () => {
  let service: FieldmappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FieldmappingService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
