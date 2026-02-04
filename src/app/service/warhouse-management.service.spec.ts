import { TestBed } from '@angular/core/testing';

import { WarhouseManagementService } from './warhouse-management.service';

describe('WarhouseManagementService', () => {
  let service: WarhouseManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WarhouseManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
