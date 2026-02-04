import { TestBed } from '@angular/core/testing';

import { MvnoService } from './mvno.service';

describe('MvnoService', () => {
  let service: MvnoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MvnoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
