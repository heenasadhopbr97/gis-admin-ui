import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FieldTempMappingComponent } from "./field-temp-mapping.component";

describe("FieldTempMappingComponent", () => {
  let component: FieldTempMappingComponent;
  let fixture: ComponentFixture<FieldTempMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FieldTempMappingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldTempMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
