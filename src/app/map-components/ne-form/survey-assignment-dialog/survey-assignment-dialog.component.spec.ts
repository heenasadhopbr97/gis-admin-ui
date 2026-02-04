import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyAssignmentDialogComponent } from './survey-assignment-dialog.component';

describe('SurveyAssignmentDialogComponent', () => {
  let component: SurveyAssignmentDialogComponent;
  let fixture: ComponentFixture<SurveyAssignmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyAssignmentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyAssignmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
