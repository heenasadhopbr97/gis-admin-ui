import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OltComponent } from './olt.component';

describe('OltComponent', () => {
  let component: OltComponent;
  let fixture: ComponentFixture<OltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OltComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
