import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomerInventorySpecificationParamsComponent } from "./customer-inventory-specification-params.component";

describe("CustomerInventorySpecificationParamsComponent", () => {
  let component: CustomerInventorySpecificationParamsComponent;
  let fixture: ComponentFixture<CustomerInventorySpecificationParamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerInventorySpecificationParamsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerInventorySpecificationParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
