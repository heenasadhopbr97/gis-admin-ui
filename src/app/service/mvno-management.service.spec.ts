import { TestBed } from '@angular/core/testing';

import { MvnoManagementService } from './mvno-management.service';

describe('MvnoManagementService', () => {
  let service: MvnoManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MvnoManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
