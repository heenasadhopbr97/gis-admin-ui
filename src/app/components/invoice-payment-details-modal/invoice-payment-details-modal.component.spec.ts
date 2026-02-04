import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePaymentDetailsModalComponent } from './invoice-payment-details-modal.component';

describe('InvoicePaymentDetailsModalComponent', () => {
  let component: InvoicePaymentDetailsModalComponent;
  let fixture: ComponentFixture<InvoicePaymentDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicePaymentDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePaymentDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
