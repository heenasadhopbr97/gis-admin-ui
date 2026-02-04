import { TestBed } from '@angular/core/testing';

import { ControllerBaseServiceService } from './controller-base-service.service';

describe('ControllerBaseServiceService', () => {
  let service: ControllerBaseServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControllerBaseServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
