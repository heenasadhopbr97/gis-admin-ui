import { ComponentFixture, TestBed } from "@angular/core/testing";

import { InvestmentCodeComponent } from "./investment-code.component";

describe("InvestmentCodeComponent", () => {
  let component: InvestmentCodeComponent;
  let fixture: ComponentFixture<InvestmentCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvestmentCodeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
