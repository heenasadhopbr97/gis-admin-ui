import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PincodeManagementComponent } from './pincode-management.component';

describe('PincodeManagementComponent', () => {
  let component: PincodeManagementComponent;
  let fixture: ComponentFixture<PincodeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PincodeManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PincodeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
