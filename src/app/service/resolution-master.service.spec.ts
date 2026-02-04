import { TestBed } from '@angular/core/testing';

import { ResolutionMasterService } from './resolution-master.service';

describe('ResolutionMasterService', () => {
  let service: ResolutionMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResolutionMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
