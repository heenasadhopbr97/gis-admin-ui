import { TestBed } from '@angular/core/testing';

import { EmailConfigService } from './email-config.service';

describe('EmailConfigService', () => {
  let service: EmailConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
