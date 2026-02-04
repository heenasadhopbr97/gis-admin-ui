import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerWithdrawalmodalComponent } from './customer-withdrawalmodal.component';

describe('CustomerWithdrawalmodalComponent', () => {
  let component: CustomerWithdrawalmodalComponent;
  let fixture: ComponentFixture<CustomerWithdrawalmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerWithdrawalmodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerWithdrawalmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
