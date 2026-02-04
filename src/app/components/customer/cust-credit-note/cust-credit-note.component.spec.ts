import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustCreditNoteComponent } from './cust-credit-note.component';

describe('CustCreditNoteComponent', () => {
  let component: CustCreditNoteComponent;
  let fixture: ComponentFixture<CustCreditNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustCreditNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustCreditNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
