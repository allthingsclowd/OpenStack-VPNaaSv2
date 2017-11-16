import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadbalancerComponent } from './loadbalancer.component';

describe('LoadbalancerComponent', () => {
  let component: LoadbalancerComponent;
  let fixture: ComponentFixture<LoadbalancerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadbalancerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadbalancerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
