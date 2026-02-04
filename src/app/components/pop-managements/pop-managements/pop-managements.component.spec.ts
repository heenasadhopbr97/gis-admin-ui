import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopManagementsComponent } from './pop-managements.component';

describe('PopManagementsComponent', () => {
  let component: PopManagementsComponent;
  let fixture: ComponentFixture<PopManagementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopManagementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopManagementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
