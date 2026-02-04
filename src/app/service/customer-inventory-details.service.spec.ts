import { TestBed } from '@angular/core/testing';

import { CustomerInventoryDetailsService } from './customer-inventory-details.service';

describe('CustomerInventoryDetailsService', () => {
  let service: CustomerInventoryDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerInventoryDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
