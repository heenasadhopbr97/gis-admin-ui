import { TestBed } from '@angular/core/testing';

import { NotificationBaseService } from './notification-base.service';

describe('NotificationBaseService', () => {
  let service: NotificationBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
