import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiusCustomerComponent } from './radius-customer.component';

describe('RadiusCustomerComponent', () => {
  let component: RadiusCustomerComponent;
  let fixture: ComponentFixture<RadiusCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadiusCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiusCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
