import { TestBed } from '@angular/core/testing';

import { InvoicePaymentListService } from './invoice-payment-list.service';

describe('InvoicePaymentListService', () => {
  let service: InvoicePaymentListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoicePaymentListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
