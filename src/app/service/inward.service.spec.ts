import { TestBed } from '@angular/core/testing';

import { InwardService } from './inward.service';

describe('InwardService', () => {
  let service: InwardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InwardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
