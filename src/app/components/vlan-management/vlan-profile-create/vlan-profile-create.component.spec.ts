import { ComponentFixture, TestBed } from "@angular/core/testing";

import { VlanProfileCreateComponent } from "./vlan-profile-create.component";

describe("VlanProfileCreateComponent", () => {
  let component: VlanProfileCreateComponent;
  let fixture: ComponentFixture<VlanProfileCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VlanProfileCreateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VlanProfileCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
