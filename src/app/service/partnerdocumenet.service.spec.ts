import { TestBed } from "@angular/core/testing";

import { PartnerdocumenetService } from "./partnerdocumenet.service";

describe("PartnerdocumenetService", () => {
  let service: PartnerdocumenetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartnerdocumenetService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
