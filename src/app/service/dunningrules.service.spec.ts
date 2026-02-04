import { TestBed } from '@angular/core/testing';

import { DunningrulesService } from './dunningrules.service';

describe('DunningrulesService', () => {
  let service: DunningrulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DunningrulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
