import { TestBed } from '@angular/core/testing';

import { ServiceAreaService } from './service-area.service';

describe('ServiceAreaService', () => {
  let service: ServiceAreaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceAreaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
