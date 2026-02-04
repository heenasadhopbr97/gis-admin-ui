import { TestBed } from '@angular/core/testing';

import { GenerateTrialBillRunService } from './generate-trial-bill-run.service';

describe('GenerateTrialBillRunService', () => {
  let service: GenerateTrialBillRunService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateTrialBillRunService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
