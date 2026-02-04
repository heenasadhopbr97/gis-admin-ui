import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CustSessionHistoryComponent } from "./cust-session-history.component";

describe("CustSessionHistoryComponent", () => {
  let component: CustSessionHistoryComponent;
  let fixture: ComponentFixture<CustSessionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustSessionHistoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustSessionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
