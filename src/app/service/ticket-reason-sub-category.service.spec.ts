import { TestBed } from '@angular/core/testing';

import { TicketReasonSubCategoryService } from './ticket-reason-sub-category.service';

describe('TicketReasonSubCategoryService', () => {
  let service: TicketReasonSubCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketReasonSubCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
