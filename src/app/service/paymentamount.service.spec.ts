import { TestBed } from '@angular/core/testing';

import { PaymentamountService } from './paymentamount.service';

describe('PaymentamountService', () => {
  let service: PaymentamountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentamountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
