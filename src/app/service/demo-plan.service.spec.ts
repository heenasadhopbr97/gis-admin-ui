import { TestBed } from '@angular/core/testing';

import { DemoPlanService } from './demo-plan.service';

describe('DemoPlanService', () => {
  let service: DemoPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemoPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
