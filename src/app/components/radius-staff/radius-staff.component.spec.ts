import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiusStaffComponent } from './radius-staff.component';

describe('RadiusStaffComponent', () => {
  let component: RadiusStaffComponent;
  let fixture: ComponentFixture<RadiusStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadiusStaffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiusStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
