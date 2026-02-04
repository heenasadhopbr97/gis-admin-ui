import { TestBed } from '@angular/core/testing';

import { DbrService } from './dbr.service';

describe('DbrService', () => {
  let service: DbrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
