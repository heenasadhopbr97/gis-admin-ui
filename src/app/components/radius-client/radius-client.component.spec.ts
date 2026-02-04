import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiusClientComponent } from './radius-client.component';

describe('RadiusClientComponent', () => {
  let component: RadiusClientComponent;
  let fixture: ComponentFixture<RadiusClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadiusClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiusClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
