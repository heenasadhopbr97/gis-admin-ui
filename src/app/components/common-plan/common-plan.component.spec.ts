import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonPlanComponent } from './common-plan.component';

describe('CommonPlanComponent', () => {
  let component: CommonPlanComponent;
  let fixture: ComponentFixture<CommonPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
