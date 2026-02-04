import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomerChangeDiscountComponent } from "./customer-change-discount.component";

describe("CustomerChangeDiscountComponent", () => {
  let component: CustomerChangeDiscountComponent;
  let fixture: ComponentFixture<CustomerChangeDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerChangeDiscountComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerChangeDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
