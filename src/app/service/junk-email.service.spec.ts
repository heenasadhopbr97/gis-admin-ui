import { TestBed } from "@angular/core/testing";
import { JunkEmailService } from "./junk-email.service";

describe("JunkEmailService", () => {
  let service: JunkEmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JunkEmailService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
