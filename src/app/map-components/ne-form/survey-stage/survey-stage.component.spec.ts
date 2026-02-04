import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyStageComponent } from './survey-stage.component';

describe('SurveyStageComponent', () => {
  let component: SurveyStageComponent;
  let fixture: ComponentFixture<SurveyStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyStageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
