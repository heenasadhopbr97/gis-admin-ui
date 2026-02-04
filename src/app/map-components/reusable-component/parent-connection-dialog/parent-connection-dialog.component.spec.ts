import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentConnectionDialogComponent } from './parent-connection-dialog.component';

describe('ParentConnectionDialogComponent', () => {
  let component: ParentConnectionDialogComponent;
  let fixture: ComponentFixture<ParentConnectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentConnectionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentConnectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
