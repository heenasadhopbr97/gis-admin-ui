import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustServiceManagementComponent } from './cust-service-management.component';

describe('CustServiceManagementComponent', () => {
  let component: CustServiceManagementComponent;
  let fixture: ComponentFixture<CustServiceManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustServiceManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustServiceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
