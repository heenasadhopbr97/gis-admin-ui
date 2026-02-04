import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPointComponent } from './customer-point.component';

describe('CustomerPointComponent', () => {
  let component: CustomerPointComponent;
  let fixture: ComponentFixture<CustomerPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerPointComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
