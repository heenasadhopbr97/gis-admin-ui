import { TestBed } from '@angular/core/testing';

import { ExternalItemManagementService } from './external-item-management.service';

describe('ExternalItemManagementService', () => {
  let service: ExternalItemManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalItemManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
