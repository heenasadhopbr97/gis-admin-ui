import { TestBed } from '@angular/core/testing';

import { LeasedLineCustomerService } from './leased-line-customer.service';

describe('LeasedLineCustomerService', () => {
  let service: LeasedLineCustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeasedLineCustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
