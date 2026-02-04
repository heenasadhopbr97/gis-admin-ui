import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkElementFormComponent } from './network-element-form.component';

describe('NetworkElementFormComponent', () => {
  let component: NetworkElementFormComponent;
  let fixture: ComponentFixture<NetworkElementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkElementFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkElementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
