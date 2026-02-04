import { TestBed } from '@angular/core/testing';

import { BillRunMasterService } from './bill-run-master.service';

describe('BillRunMasterService', () => {
  let service: BillRunMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillRunMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
