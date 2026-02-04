import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NetConfAddCustomerComponent } from "./net-conf-add-customer.component";

describe("NetConfAddCustomerComponent", () => {
  let component: NetConfAddCustomerComponent;
  let fixture: ComponentFixture<NetConfAddCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetConfAddCustomerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetConfAddCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
