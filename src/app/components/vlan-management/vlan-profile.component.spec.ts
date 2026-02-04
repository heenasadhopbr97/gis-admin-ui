import { ComponentFixture, TestBed } from "@angular/core/testing";

import { VlanProfileComponent } from "./vlan-profile.component";

describe("VlanProfileComponent", () => {
  let component: VlanProfileComponent;
  let fixture: ComponentFixture<VlanProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VlanProfileComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VlanProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
