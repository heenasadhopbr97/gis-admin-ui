import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RadiusClientCreateComponent } from "./radius-client-create.component";

describe("RadiusClientCreateComponent", () => {
  let component: RadiusClientCreateComponent;
  let fixture: ComponentFixture<RadiusClientCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadiusClientCreateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiusClientCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
