import { TestBed } from '@angular/core/testing';

import { LiveUserService } from './live-user.service';

describe('LiveUserService', () => {
  let service: LiveUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiveUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
