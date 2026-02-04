import { TestBed } from '@angular/core/testing';

import { CasManagementService } from './cas-management.service';

describe('CasManagementService', () => {
  let service: CasManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CasManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
