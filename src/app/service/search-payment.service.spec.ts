import { TestBed } from '@angular/core/testing';

import { SearchPaymentService } from './search-payment.service';

describe('SearchPaymentService', () => {
  let service: SearchPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
