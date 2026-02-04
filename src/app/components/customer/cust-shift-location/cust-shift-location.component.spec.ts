import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustShiftLocationComponent } from "./CustShiftLocationComponent";

describe("CustShiftLocationComponent", () => {
  let component: CustShiftLocationComponent;
  let fixture: ComponentFixture<CustShiftLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustShiftLocationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustShiftLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
