import { TestBed } from "@angular/core/testing";

import { PrepaidRejectedReasonService } from "./prepaid-rejected-reason.service";

describe("PrepaidRejectedReasonService", () => {
  let service: PrepaidRejectedReasonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrepaidRejectedReasonService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
