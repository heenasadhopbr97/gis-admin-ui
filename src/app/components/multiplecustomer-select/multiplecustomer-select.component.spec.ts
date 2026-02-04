import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MultiplecustomerSelectComponent } from "./multiplecustomer-select.component";

describe("MultiplecustomerSelectComponent", () => {
  let component: MultiplecustomerSelectComponent;
  let fixture: ComponentFixture<MultiplecustomerSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiplecustomerSelectComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiplecustomerSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
