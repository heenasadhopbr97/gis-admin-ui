import { TestBed } from "@angular/core/testing";

import { DeviceDriverService } from "./device-driver.service";

describe("DeviceDriverService", () => {
  let service: DeviceDriverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceDriverService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
