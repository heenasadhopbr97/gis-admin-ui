import { TestBed } from '@angular/core/testing';

import { TicketReasonCategoryService } from './ticket-reason-category.service';

describe('TicketReasonCategoryService', () => {
  let service: TicketReasonCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketReasonCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
