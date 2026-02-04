import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustDunningManagementComponent } from "./cust-dunning-management.component";

describe("CustDunningManagementComponent", () => {
  let component: CustDunningManagementComponent;
  let fixture: ComponentFixture<CustDunningManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustDunningManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustDunningManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
