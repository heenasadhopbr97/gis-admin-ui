import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicConnectionComponent } from './dynamic-connection.component';

describe('DynamicConnectionComponent', () => {
  let component: DynamicConnectionComponent;
  let fixture: ComponentFixture<DynamicConnectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicConnectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
