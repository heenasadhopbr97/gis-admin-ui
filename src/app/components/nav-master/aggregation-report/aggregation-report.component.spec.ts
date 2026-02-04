import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AggregationReportComponent } from "./aggregation-report.component";

describe("AggregationReportComponent", () => {
  let component: AggregationReportComponent;
  let fixture: ComponentFixture<AggregationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AggregationReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
