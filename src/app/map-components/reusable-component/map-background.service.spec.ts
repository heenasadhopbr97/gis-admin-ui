import { TestBed } from '@angular/core/testing';

import { MapBackgroundService } from './map-background.service';

describe('MapBackgroundService', () => {
  let service: MapBackgroundService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapBackgroundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
