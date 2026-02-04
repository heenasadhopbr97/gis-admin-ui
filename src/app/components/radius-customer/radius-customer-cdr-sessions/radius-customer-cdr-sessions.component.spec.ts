import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RadiusCustomerCDRSessionsComponent } from "./radius-customer-cdr-sessions.component";

describe("RadiusCustomerCDRSessionsComponent", () => {
  let component: RadiusCustomerCDRSessionsComponent;
  let fixture: ComponentFixture<RadiusCustomerCDRSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadiusCustomerCDRSessionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiusCustomerCDRSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
