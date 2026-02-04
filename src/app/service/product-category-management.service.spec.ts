import { TestBed } from '@angular/core/testing';

import { ProductCategoryManagementService } from './product-category-management.service';

describe('ProductCategoryManagementService', () => {
  let service: ProductCategoryManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductCategoryManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
