import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustChargemanagementComponent } from './cust-chargemanagement.component';

describe('CustChargemanagementComponent', () => {
  let component: CustChargemanagementComponent;
  let fixture: ComponentFixture<CustChargemanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustChargemanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustChargemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
