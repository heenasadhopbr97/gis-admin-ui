import { TestBed } from '@angular/core/testing';

import { GenerateBillRunService } from './generate-bill-run.service';

describe('GenerateBillRunService', () => {
  let service: GenerateBillRunService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateBillRunService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
