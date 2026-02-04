import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NearbyElementsDialogComponent } from './nearby-elements-dialog.component';

describe('NearbyElementsDialogComponent', () => {
  let component: NearbyElementsDialogComponent;
  let fixture: ComponentFixture<NearbyElementsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NearbyElementsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NearbyElementsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
