import { TestBed } from '@angular/core/testing';

import { AccountsRatingService } from './accounts-rating.service';

describe('AccountsRatingService', () => {
  let service: AccountsRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountsRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
