import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RadiusCustomerListComponent } from "./radius-customer-list.component";

describe("CustomerListComponent", () => {
  let component: RadiusCustomerListComponent;
  let fixture: ComponentFixture<RadiusCustomerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadiusCustomerListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiusCustomerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
