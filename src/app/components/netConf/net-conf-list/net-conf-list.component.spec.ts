import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NetConfListComponent } from "./net-conf-list.component";

describe("NetConfListComponent", () => {
  let component: NetConfListComponent;
  let fixture: ComponentFixture<NetConfListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetConfListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetConfListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
