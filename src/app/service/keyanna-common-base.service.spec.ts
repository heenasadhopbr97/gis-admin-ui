import { TestBed } from '@angular/core/testing';

import { KeyannaCommonBaseService } from './keyanna-common-base.service';

describe('KeyannaCommonBaseServiceService', () => {
  let service: KeyannaCommonBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyannaCommonBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
