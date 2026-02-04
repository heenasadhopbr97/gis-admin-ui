import { TestBed } from '@angular/core/testing';

import { InvoiceMasterService } from './invoice-master.service';

describe('InvoiceMasterService', () => {
  let service: InvoiceMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
