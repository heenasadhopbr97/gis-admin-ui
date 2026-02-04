import { TestBed } from '@angular/core/testing';

import { RateDetailsRatingService } from './rate-details-rating.service';

describe('RateDetailsRatingService', () => {
  let service: RateDetailsRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RateDetailsRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
