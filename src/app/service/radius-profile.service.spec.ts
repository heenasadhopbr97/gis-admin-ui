import { TestBed } from '@angular/core/testing';

import { AcctProfileService } from './radius-profile.service';

describe('AcctProfileService', () => {
  let service: AcctProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcctProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
