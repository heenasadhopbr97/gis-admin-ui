import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustWorkflowAuditComponent } from "./cust-workflow-audit.component";

describe("CustWorkflowAuditComponent", () => {
  let component: CustWorkflowAuditComponent;
  let fixture: ComponentFixture<CustWorkflowAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustWorkflowAuditComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustWorkflowAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
