import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdcComponent } from './fdc.component';

describe('FdcComponent', () => {
  let component: FdcComponent;
  let fixture: ComponentFixture<FdcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FdcComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FdcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
