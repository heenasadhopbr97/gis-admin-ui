import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxyServerComponent } from './proxy-server.component';

describe('ProxyServerComponent', () => {
  let component: ProxyServerComponent;
  let fixture: ComponentFixture<ProxyServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProxyServerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProxyServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
