import { TestBed } from '@angular/core/testing';

import { CityManagementService } from './city-management.service';

describe('CityManagementService', () => {
  let service: CityManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CityManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
