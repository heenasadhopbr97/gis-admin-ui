import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdpComponent } from './fdp.component';

describe('FdpComponent', () => {
  let component: FdpComponent;
  let fixture: ComponentFixture<FdpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FdpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FdpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
