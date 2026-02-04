import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NavMasterComponent } from "./nav-master.component";

describe("NavMasterComponent", () => {
  let component: NavMasterComponent;
  let fixture: ComponentFixture<NavMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
