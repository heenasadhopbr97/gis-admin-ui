import { TestBed } from '@angular/core/testing';

import { ConcurrentPolicyService } from './concurrent-policy.service';

describe('ConcurrentPolicyService', () => {
  let service: ConcurrentPolicyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConcurrentPolicyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

