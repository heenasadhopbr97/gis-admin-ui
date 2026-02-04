import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RadiusClientListComponent } from "./radius-client-list.component";

describe("RadiusClientListComponent", () => {
  let component: RadiusClientListComponent;
  let fixture: ComponentFixture<RadiusClientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadiusClientListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiusClientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
