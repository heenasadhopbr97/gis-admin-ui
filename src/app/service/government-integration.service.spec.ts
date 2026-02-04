import { TestBed } from '@angular/core/testing';

import { GovernmentIntegrationService } from './government-integration.service';

describe('GovernmentIntegrationService', () => {
  let service: GovernmentIntegrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GovernmentIntegrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
