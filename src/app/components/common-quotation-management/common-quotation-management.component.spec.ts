import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CommonQuotationManagementComponent } from "./common-quotation-management.component";

describe("CommonQuotationManagementComponent", () => {
  let component: CommonQuotationManagementComponent;
  let fixture: ComponentFixture<CommonQuotationManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonQuotationManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonQuotationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
