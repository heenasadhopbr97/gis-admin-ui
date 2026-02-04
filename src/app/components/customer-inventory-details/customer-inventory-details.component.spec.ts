import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerInventoryDetailsComponent } from './customer-inventory-details.component';

describe('CustomerInventoryDetailsComponent', () => {
  let component: CustomerInventoryDetailsComponent;
  let fixture: ComponentFixture<CustomerInventoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerInventoryDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerInventoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
