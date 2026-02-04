import { TestBed } from '@angular/core/testing';

import { CustspecialPlanMappingService } from './custspecial-plan-mapping.service';

describe('CustspecialPlanMappingService', () => {
  let service: CustspecialPlanMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustspecialPlanMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
