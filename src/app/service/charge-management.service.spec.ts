import { TestBed } from '@angular/core/testing';

import { ChargeManagementService } from './charge-management.service';

describe('ChargeManagementService', () => {
  let service: ChargeManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChargeManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
