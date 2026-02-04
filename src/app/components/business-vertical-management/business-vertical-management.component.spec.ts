import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BusinessVerticalManagementComponent } from "./business-vertical-management.component";

describe("BusinessVerticalManagementComponent", () => {
  let component: BusinessVerticalManagementComponent;
  let fixture: ComponentFixture<BusinessVerticalManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusinessVerticalManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessVerticalManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
