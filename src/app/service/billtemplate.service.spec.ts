import { TestBed } from '@angular/core/testing';

import { BilltemplateService } from './billtemplate.service';

describe('BilltemplateService', () => {
  let service: BilltemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BilltemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
