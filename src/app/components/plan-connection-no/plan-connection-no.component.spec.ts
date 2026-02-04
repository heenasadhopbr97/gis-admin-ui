import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PlanConnectionNoComponent } from "./plan-connection-no.component";

describe("PlanConnectionNoComponent", () => {
  let component: PlanConnectionNoComponent;
  let fixture: ComponentFixture<PlanConnectionNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanConnectionNoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanConnectionNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
