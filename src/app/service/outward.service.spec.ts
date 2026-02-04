import { TestBed } from '@angular/core/testing';

import { OutwardService } from './outward.service';

describe('OutwardService', () => {
  let service: OutwardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutwardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
