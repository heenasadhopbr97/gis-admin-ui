import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PlanChargeComponent } from "./plan-charge.component";

describe("PlanChargeComponent", () => {
  let component: PlanChargeComponent;
  let fixture: ComponentFixture<PlanChargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanChargeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
