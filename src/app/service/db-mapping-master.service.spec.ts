import { TestBed } from '@angular/core/testing';

import { DBMappingMasterService } from './db-mapping-master.service';

describe('DBMappingMasterService', () => {
  let service: DBMappingMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DBMappingMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
