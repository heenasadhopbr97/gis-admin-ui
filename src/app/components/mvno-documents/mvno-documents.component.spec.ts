import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MvnoDocumentsComponent } from "./mvno-documents.component";

describe("MvnoDocumentsComponent", () => {
  let component: MvnoDocumentsComponent;
  let fixture: ComponentFixture<MvnoDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MvnoDocumentsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MvnoDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
