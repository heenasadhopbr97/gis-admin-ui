import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustAuditDetailsComponent } from "./cust-audit-details.component";

describe("CustAuditDetailsComponent", () => {
  let component: CustAuditDetailsComponent;
  let fixture: ComponentFixture<CustAuditDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustAuditDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustAuditDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
