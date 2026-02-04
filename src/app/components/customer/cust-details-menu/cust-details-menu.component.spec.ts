import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustDetailsMenuComponent } from "./cust-details-menu.component";

describe("CustDetailsMenuComponent", () => {
  let component: CustDetailsMenuComponent;
  let fixture: ComponentFixture<CustDetailsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustDetailsMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustDetailsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
