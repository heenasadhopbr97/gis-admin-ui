import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAmountModelComponent } from './payment-amount-model.component';

describe('PaymentAmountModelComponent', () => {
  let component: PaymentAmountModelComponent;
  let fixture: ComponentFixture<PaymentAmountModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentAmountModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentAmountModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
