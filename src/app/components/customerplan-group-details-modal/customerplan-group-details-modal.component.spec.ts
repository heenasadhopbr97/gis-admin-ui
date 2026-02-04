import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerplanGroupDetailsModalComponent } from './customerplan-group-details-modal.component';

describe('CustomerplanGroupDetailsModalComponent', () => {
  let component: CustomerplanGroupDetailsModalComponent;
  let fixture: ComponentFixture<CustomerplanGroupDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerplanGroupDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerplanGroupDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
