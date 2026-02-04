import { TestBed } from '@angular/core/testing';

import { CountryManagementService } from './country-management.service';

describe('CountryManagementService', () => {
  let service: CountryManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountryManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
