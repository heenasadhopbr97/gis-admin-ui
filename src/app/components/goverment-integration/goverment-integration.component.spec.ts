import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovermentIntegrationComponent } from './goverment-integration.component';

describe('GovermentIntegrationComponent', () => {
  let component: GovermentIntegrationComponent;
  let fixture: ComponentFixture<GovermentIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GovermentIntegrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GovermentIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
