import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChildCustChangePlanComponent } from "./child-cust-change-plan.component";

describe("ChildCustChangePlanComponent", () => {
  let component: ChildCustChangePlanComponent;
  let fixture: ComponentFixture<ChildCustChangePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChildCustChangePlanComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildCustChangePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
