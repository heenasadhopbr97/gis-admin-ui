import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandHoleComponent } from './hand-hole.component';

describe('HandHoleComponent', () => {
  let component: HandHoleComponent;
  let fixture: ComponentFixture<HandHoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandHoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandHoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
