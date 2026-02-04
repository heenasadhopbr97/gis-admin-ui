import { TestBed } from '@angular/core/testing';

import { RadiusTemplateService } from './radius-template.service';

describe('RadiusTemplateService', () => {
  let service: RadiusTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RadiusTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
