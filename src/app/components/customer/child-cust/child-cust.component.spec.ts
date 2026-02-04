import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChildCustComponent } from "./child-cust.component";

describe("CustNotificationManagementComponent", () => {
  let component: ChildCustComponent;
  let fixture: ComponentFixture<ChildCustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChildCustComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildCustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
