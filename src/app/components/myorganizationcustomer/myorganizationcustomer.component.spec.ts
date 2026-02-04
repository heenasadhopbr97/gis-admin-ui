import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyorganizationcustomerComponent } from './myorganizationcustomer.component';

describe('MyorganizationcustomerComponent', () => {
  let component: MyorganizationcustomerComponent;
  let fixture: ComponentFixture<MyorganizationcustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyorganizationcustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyorganizationcustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
