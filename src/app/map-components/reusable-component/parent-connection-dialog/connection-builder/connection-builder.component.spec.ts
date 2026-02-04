import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionBuilderComponent } from './connection-builder.component';

describe('ConnectionBuilderComponent', () => {
  let component: ConnectionBuilderComponent;
  let fixture: ComponentFixture<ConnectionBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionBuilderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectionBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
