import { TestBed } from '@angular/core/testing';

import { SmsConfigService } from './sms-config.service';

describe('SmsConfigService', () => {
  let service: SmsConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmsConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
