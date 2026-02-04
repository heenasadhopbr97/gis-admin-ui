import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BulkConsumptionComponent } from "./bulk-consumption.component";

describe("BulkConsumptionComponent", () => {
  let component: BulkConsumptionComponent;
  let fixture: ComponentFixture<BulkConsumptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BulkConsumptionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
