import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PromiseToPayDetailsModalComponent } from "./promisetopay-details-modal.component";

describe("PromiseToPayDetailsModalComponent", () => {
  let component: PromiseToPayDetailsModalComponent;
  let fixture: ComponentFixture<PromiseToPayDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PromiseToPayDetailsModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromiseToPayDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
