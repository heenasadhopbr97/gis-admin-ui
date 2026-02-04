import { TestBed } from '@angular/core/testing';

import { IpManagementService } from './ip-management.service';

describe('IpManagementService', () => {
  let service: IpManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IpManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
