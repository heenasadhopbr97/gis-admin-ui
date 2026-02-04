import { TestBed } from '@angular/core/testing';

import { AcctCdrService } from './acct-cdr.service';

describe('AcctCdrService', () => {
  let service: AcctCdrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcctCdrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
