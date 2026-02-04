import { TestBed } from '@angular/core/testing';

import { AuthResponseService } from './auth-response.service';

describe('AuthResponseService', () => {
  let service: AuthResponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthResponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
