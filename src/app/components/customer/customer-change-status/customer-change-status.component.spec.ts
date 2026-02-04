import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomerChangeStatusComponent } from "./customer-change-status.component";

describe("CustomerChangeStatusComponent", () => {
  let component: CustomerChangeStatusComponent;
  let fixture: ComponentFixture<CustomerChangeStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerChangeStatusComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerChangeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
