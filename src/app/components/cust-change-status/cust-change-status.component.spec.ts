import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustChangeStatusComponent } from "./cust-change-status.component";

describe("CustChangeStatusComponent", () => {
  let component: CustChangeStatusComponent;
  let fixture: ComponentFixture<CustChangeStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustChangeStatusComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustChangeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
