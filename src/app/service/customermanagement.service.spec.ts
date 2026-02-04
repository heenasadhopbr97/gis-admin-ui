import { TestBed } from '@angular/core/testing';

import { CustomermanagementService } from './customermanagement.service';

describe('CustomermanagementService', () => {
  let service: CustomermanagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomermanagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
