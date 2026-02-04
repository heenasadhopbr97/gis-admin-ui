import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MigrationComonent } from "./migration.component";

describe("MigrationComonent", () => {
  let component: MigrationComonent;
  let fixture: ComponentFixture<MigrationComonent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MigrationComonent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MigrationComonent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
