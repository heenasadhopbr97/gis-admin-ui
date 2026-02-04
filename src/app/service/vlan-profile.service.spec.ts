import { TestBed } from "@angular/core/testing";

import { VlanProfileService } from "./vlan-profile.service";

describe("VlanProfileService", () => {
  let service: VlanProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VlanProfileService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
