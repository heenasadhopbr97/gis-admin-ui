import { TestBed } from '@angular/core/testing';

import { NearbyElementsService } from './nearby-elements.service';

describe('NearbyElementsService', () => {
  let service: NearbyElementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NearbyElementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
