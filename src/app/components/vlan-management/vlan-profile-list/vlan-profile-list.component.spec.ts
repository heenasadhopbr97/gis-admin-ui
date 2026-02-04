import { ComponentFixture, TestBed } from "@angular/core/testing";
import { VlanProfileListComponent } from "./vlan-profile-list.component";

describe("VlanProfileListComponent", () => {
  let component: VlanProfileListComponent;
  let fixture: ComponentFixture<VlanProfileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VlanProfileListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VlanProfileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
