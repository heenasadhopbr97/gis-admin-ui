import { ComponentFixture, TestBed } from "@angular/core/testing";
import { VlanAuditComponent } from "./vlan-audit.component";

describe("VlanAuditComponent", () => {
  let component: VlanAuditComponent;
  let fixture: ComponentFixture<VlanAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VlanAuditComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VlanAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
