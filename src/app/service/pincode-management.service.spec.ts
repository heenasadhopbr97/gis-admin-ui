import { TestBed } from '@angular/core/testing';

import { PincodeManagementService } from './pincode-management.service';

describe('PincodeManagementService', () => {
  let service: PincodeManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PincodeManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
