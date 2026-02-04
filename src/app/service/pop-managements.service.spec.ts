import { TestBed } from '@angular/core/testing';

import { PopManagementsService } from './pop-managements.service';

describe('PopManagementsService', () => {
  let service: PopManagementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopManagementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
