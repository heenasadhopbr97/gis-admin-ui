import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManHoleComponent } from './man-hole.component';

describe('ManHoleComponent', () => {
  let component: ManHoleComponent;
  let fixture: ComponentFixture<ManHoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManHoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManHoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
