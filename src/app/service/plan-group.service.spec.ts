import { TestBed } from '@angular/core/testing';

import { PlanGroupService } from './plan-group.service';

describe('PlanGroupService', () => {
  let service: PlanGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
