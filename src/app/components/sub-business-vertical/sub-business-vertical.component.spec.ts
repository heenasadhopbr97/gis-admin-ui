import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SubBusinessVerticalComponent } from "./sub-business-vertical.component";

describe("SubBusinessVerticalComponent", () => {
  let component: SubBusinessVerticalComponent;
  let fixture: ComponentFixture<SubBusinessVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubBusinessVerticalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubBusinessVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
