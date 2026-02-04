import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustChangePlanComponent } from './cust-change-plan.component';

describe('CustChangePlanComponent', () => {
  let component: CustChangePlanComponent;
  let fixture: ComponentFixture<CustChangePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustChangePlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustChangePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
