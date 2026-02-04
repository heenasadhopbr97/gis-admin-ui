import { TestBed } from "@angular/core/testing";

import { NMSService } from "./nms.service";

describe("NMSService", () => {
  let service: NMSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NMSService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
