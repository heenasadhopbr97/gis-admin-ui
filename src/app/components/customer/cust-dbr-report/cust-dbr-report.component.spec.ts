import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustDBRReportComponent } from "./cust-dbr-report.component";

describe("CustDBRReportComponent", () => {
  let component: CustDBRReportComponent;
  let fixture: ComponentFixture<CustDBRReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustDBRReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustDBRReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
