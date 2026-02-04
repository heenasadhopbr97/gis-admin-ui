import { TestBed } from '@angular/core/testing';

import { PrefixRatingService } from './prefix-rating.service';

describe('PrefixRatingService', () => {
  let service: PrefixRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrefixRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
