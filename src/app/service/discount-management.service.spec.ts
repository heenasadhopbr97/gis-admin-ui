import { TestBed } from '@angular/core/testing';

import { DiscountManagementService } from './discount-management.service';

describe('DiscountManagementService', () => {
  let service: DiscountManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscountManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
