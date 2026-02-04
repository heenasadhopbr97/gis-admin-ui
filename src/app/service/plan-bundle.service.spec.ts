import { TestBed } from '@angular/core/testing';

import { PlanBundleService } from './plan-bundle.service';

describe('PlanBundleService', () => {
  let service: PlanBundleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanBundleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
