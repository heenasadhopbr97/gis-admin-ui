import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowAuditDetailsModalComponent } from './workflow-audit-details-modal.component';

describe('WorkflowAuditDetailsModalComponent', () => {
  let component: WorkflowAuditDetailsModalComponent;
  let fixture: ComponentFixture<WorkflowAuditDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowAuditDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowAuditDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
