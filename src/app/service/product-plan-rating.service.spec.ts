import { TestBed } from '@angular/core/testing';

import { ProductPlanRatingService } from './product-plan-rating.service';

describe('ProductPlanRatingService', () => {
  let service: ProductPlanRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductPlanRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
