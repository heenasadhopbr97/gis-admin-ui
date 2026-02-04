import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyAreaComponent } from './survey-area.component';

describe('SurveyAreaComponent', () => {
  let component: SurveyAreaComponent;
  let fixture: ComponentFixture<SurveyAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
