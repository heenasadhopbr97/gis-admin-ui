import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NetConfComponent } from "./net-conf.component";

describe("NetConfComponent", () => {
  let component: NetConfComponent;
  let fixture: ComponentFixture<NetConfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetConfComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetConfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
