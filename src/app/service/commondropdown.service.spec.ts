import { TestBed } from '@angular/core/testing';

import { CommondropdownService } from './commondropdown.service';

describe('CommondropdownService', () => {
  let service: CommondropdownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommondropdownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
