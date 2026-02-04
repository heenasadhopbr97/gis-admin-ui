import { TestBed } from '@angular/core/testing';

import { CustomerInventoryMappingService } from './customer-inventory-mapping.service';

describe('CustomerInventoryMappingService', () => {
  let service: CustomerInventoryMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerInventoryMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
