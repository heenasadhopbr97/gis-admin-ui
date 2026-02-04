import { ComponentFixture, TestBed } from "@angular/core/testing";

import { VlanProfileBulkAddComponent } from "./vlan-profile-bulk-add.component";

describe("VlanProfileBulkAddComponent", () => {
  let component: VlanProfileBulkAddComponent;
  let fixture: ComponentFixture<VlanProfileBulkAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VlanProfileBulkAddComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VlanProfileBulkAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
