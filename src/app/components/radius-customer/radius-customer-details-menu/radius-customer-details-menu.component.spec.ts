import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RadiusCustomerDetailsMenuComponent } from "./radius-customer-details-menu.component";

describe("RadiusCustomerDetailsMenuComponent", () => {
  let component: RadiusCustomerDetailsMenuComponent;
  let fixture: ComponentFixture<RadiusCustomerDetailsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadiusCustomerDetailsMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiusCustomerDetailsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
