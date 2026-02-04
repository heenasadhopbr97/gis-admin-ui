import { TestBed } from '@angular/core/testing';

import { TicketManagementService } from './ticket-management.service';

describe('TicketManagementService', () => {
  let service: TicketManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
