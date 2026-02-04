import { TestBed } from '@angular/core/testing';

import { NetworkdeviceService } from './networkdevice.service';

describe('NetworkdeviceService', () => {
  let service: NetworkdeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkdeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
