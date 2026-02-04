import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustNotificationManagementComponent } from "./cust-notification-management.component";

describe("CustNotificationManagementComponent", () => {
  let component: CustNotificationManagementComponent;
  let fixture: ComponentFixture<CustNotificationManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustNotificationManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustNotificationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
