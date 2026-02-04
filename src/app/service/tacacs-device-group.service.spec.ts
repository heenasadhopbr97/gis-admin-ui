import { TestBed } from '@angular/core/testing';

import { TacacsDeviceGroupService } from './tacacs-device-group.service';

describe('TacacsDeviceGroupService', () => {
  let service: TacacsDeviceGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TacacsDeviceGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
