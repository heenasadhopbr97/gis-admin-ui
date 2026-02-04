import { TestBed } from "@angular/core/testing";

import { NavMasterService } from "./nav-master.service";

describe("NavMasterService", () => {
  let service: NavMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavMasterService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
