import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RadiusCustomerPlansComponent } from "./radius-customer-plans.component";

describe("RadiusCustomerPlansComponent", () => {
  let component: RadiusCustomerPlansComponent;
  let fixture: ComponentFixture<RadiusCustomerPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadiusCustomerPlansComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiusCustomerPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
