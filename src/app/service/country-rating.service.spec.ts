import { TestBed } from '@angular/core/testing';

import { CountryRatingService } from './country-rating.service';

describe('CountryRatingService', () => {
  let service: CountryRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountryRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
