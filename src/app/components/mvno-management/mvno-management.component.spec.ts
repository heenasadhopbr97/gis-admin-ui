import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MvnoManagementComponent } from './mvno-management.component';

describe('MvnoManagementComponent', () => {
  let component: MvnoManagementComponent;
  let fixture: ComponentFixture<MvnoManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MvnoManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MvnoManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
