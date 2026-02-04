import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CommonChargeComponent } from "./common-charge.component";

describe("CommonChargeComponent", () => {
  let component: CommonChargeComponent;
  let fixture: ComponentFixture<CommonChargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonChargeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
