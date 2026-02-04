import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffSelectModelComponent } from './staff-select-model.component';

describe('StaffSelectModelComponent', () => {
  let component: StaffSelectModelComponent;
  let fixture: ComponentFixture<StaffSelectModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffSelectModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffSelectModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
