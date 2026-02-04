import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NetConfDetailsComponent } from "./net-conf-details.component";

describe("NetConfDetailsComponent", () => {
  let component: NetConfDetailsComponent;
  let fixture: ComponentFixture<NetConfDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetConfDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetConfDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
