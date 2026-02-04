import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CommonInventoryManagementComponent } from "./common-inventory-management.component";

describe("CommonInventoryManagementComponent", () => {
  let component: CommonInventoryManagementComponent;
  let fixture: ComponentFixture<CommonInventoryManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonInventoryManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonInventoryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
