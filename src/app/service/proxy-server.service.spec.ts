import { TestBed } from '@angular/core/testing';

import { ProxyServerService } from './proxy-server.service';

describe('ProxyServerService', () => {
  let service: ProxyServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProxyServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
