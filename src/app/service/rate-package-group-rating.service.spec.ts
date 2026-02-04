import { TestBed } from '@angular/core/testing';

import { RatePackageGroupRatingService } from './rate-package-group-rating.service';

describe('RatePackageGroupRatingService', () => {
  let service: RatePackageGroupRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RatePackageGroupRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
