import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomerInventoryManagementComponent } from "./customer-inventory-management.component";

describe("CustomerInventoryManagementComponent", () => {
  let component: CustomerInventoryManagementComponent;
  let fixture: ComponentFixture<CustomerInventoryManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerInventoryManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerInventoryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
