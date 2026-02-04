import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MyStaffDetailsComponent } from "./my-staff-details.component";

describe("MyStaffDetailsComponent", () => {
  let component: MyStaffDetailsComponent;
  let fixture: ComponentFixture<MyStaffDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyStaffDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyStaffDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
