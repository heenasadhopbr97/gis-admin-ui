import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MvnoListComponent } from "./mvno-list.component";

describe("MvnoListComponent", () => {
  let component: MvnoListComponent;
  let fixture: ComponentFixture<MvnoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MvnoListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MvnoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
