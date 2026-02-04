import { TestBed } from '@angular/core/testing';

import { PartnerRatingService } from './partner-rating.service';

describe('PartnerRatingService', () => {
  let service: PartnerRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartnerRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
