import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CustomerComponent } from "./customer.component";

describe("CustomerComponent", () => {
  let component: CustomerComponent;
  let fixture: ComponentFixture<CustDetailsMenuComponent>;
  CustomerComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
