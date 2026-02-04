import { TestBed } from '@angular/core/testing';

import { AreaManagementService } from './area-management.service';

describe('AreaManagementService', () => {
  let service: AreaManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AreaManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
