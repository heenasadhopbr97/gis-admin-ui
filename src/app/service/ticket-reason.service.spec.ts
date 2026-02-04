import { TestBed } from '@angular/core/testing';

import { TicketReasonService } from './ticket-reason.service';

describe('TicketReasonService', () => {
  let service: TicketReasonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketReasonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
