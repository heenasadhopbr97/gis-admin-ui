import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MvnoCreateComponent } from "./mvno-create.component";

describe("MvnoCreateComponent", () => {
  let component: MvnoCreateComponent;
  let fixture: ComponentFixture<MvnoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MvnoCreateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MvnoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
