import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiusTemplateComponent } from './radius-template.component';

describe('RadiusTemplateComponent', () => {
  let component: RadiusTemplateComponent;
  let fixture: ComponentFixture<RadiusTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadiusTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiusTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
