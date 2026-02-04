import { TestBed } from "@angular/core/testing";

import { DeactivateService } from "./deactivate.service";

describe("DeactivateService", () => {
  let service: DeactivateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeactivateService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
