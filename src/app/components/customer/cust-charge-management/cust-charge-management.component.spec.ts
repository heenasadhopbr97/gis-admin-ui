import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustChargeManagementComponent } from "./cust-charge-management.component";

describe("CustChargeManagementComponent", () => {
  let component: CustChargeManagementComponent;
  let fixture: ComponentFixture<CustChargeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustChargeManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustChargeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
