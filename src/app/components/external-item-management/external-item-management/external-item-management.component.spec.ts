import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ExternalItemManagementComponent } from "./external-item-management.component";

describe("ExternalItemManagementComponent", () => {
  let component: ExternalItemManagementComponent;
  let fixture: ComponentFixture<ExternalItemManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExternalItemManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalItemManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
