import { TestBed } from "@angular/core/testing";

import { CustomerInventoryManagementService } from "./customer-inventory-management.service";

describe("CustomerInventoryManagementService", () => {
  let service: CustomerInventoryManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerInventoryManagementService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
