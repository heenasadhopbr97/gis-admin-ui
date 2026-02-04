import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotaDetailsModalComponent } from './quota-details-modal.component';

describe('QuotaDetailsModalComponent', () => {
  let component: QuotaDetailsModalComponent;
  let fixture: ComponentFixture<QuotaDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotaDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotaDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
