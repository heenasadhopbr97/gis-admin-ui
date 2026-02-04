import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RadiusCustomerDetailsComponent } from "./radius-customer-details.component";

describe("RadiusCustomerDetailsComponent", () => {
  let component: RadiusCustomerDetailsComponent;
  let fixture: ComponentFixture<RadiusCustomerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadiusCustomerDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiusCustomerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
