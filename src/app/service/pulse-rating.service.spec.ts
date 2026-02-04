import { TestBed } from '@angular/core/testing';

import { PulseRatingService } from './pulse-rating.service';

describe('PulseRatingService', () => {
  let service: PulseRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PulseRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
