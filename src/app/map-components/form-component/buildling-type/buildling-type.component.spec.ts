import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildlingTypeComponent } from './buildling-type.component';

describe('BuildlingTypeComponent', () => {
  let component: BuildlingTypeComponent;
  let fixture: ComponentFixture<BuildlingTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildlingTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildlingTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
