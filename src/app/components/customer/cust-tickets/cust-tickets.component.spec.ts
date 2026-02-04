import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustTicketsComponent } from "./cust-tickets.component";

describe("CustTicketsComponent", () => {
  let component: CustTicketsComponent;
  let fixture: ComponentFixture<CustTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustTicketsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
