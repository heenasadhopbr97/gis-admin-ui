import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDetalisModelComponent } from './invoice-detalis-model.component';

describe('InvoiceDetalisModelComponent', () => {
  let component: InvoiceDetalisModelComponent;
  let fixture: ComponentFixture<InvoiceDetalisModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceDetalisModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceDetalisModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
