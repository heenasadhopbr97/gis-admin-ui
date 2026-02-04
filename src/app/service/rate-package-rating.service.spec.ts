import { TestBed } from '@angular/core/testing';

import { RatePackageRatingService } from './rate-package-rating.service';

describe('RatePackageRatingService', () => {
  let service: RatePackageRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RatePackageRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
