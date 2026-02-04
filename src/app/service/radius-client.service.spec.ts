import { TestBed } from '@angular/core/testing';

import { RadiusClientService } from './radius-client.service';

describe('RadiusClientService', () => {
  let service: RadiusClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RadiusClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
