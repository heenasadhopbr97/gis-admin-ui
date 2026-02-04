import { TestBed } from '@angular/core/testing';

import { RadiusBaseServiceService } from './radius-base-service.service';

describe('RadiusBaseServiceService', () => {
  let service: RadiusBaseServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RadiusBaseServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
