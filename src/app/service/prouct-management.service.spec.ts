import { TestBed } from '@angular/core/testing';

import { ProuctManagementService } from './prouct-management.service';

describe('ProuctManagementService', () => {
  let service: ProuctManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProuctManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
