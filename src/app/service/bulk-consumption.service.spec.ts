import { TestBed } from '@angular/core/testing';

import { BulkConsumptionService } from './bulk-consumption.service';

describe('BulkConsumptionService', () => {
  let service: BulkConsumptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BulkConsumptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
