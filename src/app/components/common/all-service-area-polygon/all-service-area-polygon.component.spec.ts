import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AllServiceAreaPolygon } from "./all-service-area-polygon.component";

describe("AllServiceAreaPolygon", () => {
  let component: AllServiceAreaPolygon;
  let fixture: ComponentFixture<AllServiceAreaPolygon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllServiceAreaPolygon],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllServiceAreaPolygon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
