import { TestBed } from '@angular/core/testing';

import { QosPolicyService } from './qos-policy.service';

describe('QosPolicyService', () => {
  let service: QosPolicyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QosPolicyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
