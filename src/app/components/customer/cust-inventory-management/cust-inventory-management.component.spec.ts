import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustInventoryManagementComponent } from "./cust-inventory-management.component";

describe("CustInventoryManagementComponent", () => {
  let component: CustInventoryManagementComponent;
  let fixture: ComponentFixture<CustInventoryManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustInventoryManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustInventoryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
