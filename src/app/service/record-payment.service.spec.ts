import { TestBed } from '@angular/core/testing';

import { RecordPaymentService } from './record-payment.service';

describe('RecordPaymentService', () => {
  let service: RecordPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
