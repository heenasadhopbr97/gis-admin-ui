import { TestBed } from '@angular/core/testing';

import { TaxManagementService } from './tax-management.service';

describe('TaxManagementService', () => {
  let service: TaxManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaxManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
