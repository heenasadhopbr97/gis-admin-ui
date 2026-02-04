import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaMappingComponent } from './area-mapping.component';

describe('AreaMappingComponent', () => {
  let component: AreaMappingComponent;
  let fixture: ComponentFixture<AreaMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaMappingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
