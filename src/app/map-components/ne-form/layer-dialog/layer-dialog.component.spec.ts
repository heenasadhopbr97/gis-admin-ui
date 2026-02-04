import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerDialogComponent } from './layer-dialog.component';

describe('LayerDialogComponent', () => {
  let component: LayerDialogComponent;
  let fixture: ComponentFixture<LayerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
