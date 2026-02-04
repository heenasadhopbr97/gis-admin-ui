import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomerNearByDevicesComponent } from "./customer-near-by-devices.component";

describe("CustomerNearByDevicesComponent", () => {
  let component: CustomerNearByDevicesComponent;
  let fixture: ComponentFixture<CustomerNearByDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerNearByDevicesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerNearByDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
