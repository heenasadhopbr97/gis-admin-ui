import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapBackgroundSwitcherComponent } from './map-background-switcher.component';

describe('MapBackgroundSwitcherComponent', () => {
  let component: MapBackgroundSwitcherComponent;
  let fixture: ComponentFixture<MapBackgroundSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapBackgroundSwitcherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapBackgroundSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
