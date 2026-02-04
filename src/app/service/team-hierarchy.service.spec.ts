import { TestBed } from '@angular/core/testing';

import { TeamHierarchyService } from './team-hierarchy.service';

describe('TeamHierarchyService', () => {
  let service: TeamHierarchyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamHierarchyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
