import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RadiusCustomerCreateComponent } from "./radius-customer-create.component";

describe("RadiusCustomerCreateComponent", () => {
  let component: RadiusCustomerCreateComponent;
  let fixture: ComponentFixture<RadiusCustomerCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadiusCustomerCreateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiusCustomerCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
