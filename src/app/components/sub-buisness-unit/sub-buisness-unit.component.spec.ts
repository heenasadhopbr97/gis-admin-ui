import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SubBuisnessUnitComponent } from "./sub-buisness-unit.component";

describe("SubBuisnessUnitComponent", () => {
  let component: SubBuisnessUnitComponent;
  let fixture: ComponentFixture<SubBuisnessUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubBuisnessUnitComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubBuisnessUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
