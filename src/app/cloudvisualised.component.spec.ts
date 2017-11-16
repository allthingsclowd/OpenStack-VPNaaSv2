import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudvisualisedComponent } from './cloudvisualised.component';

describe('CloudvisualisedComponent', () => {
  let component: CloudvisualisedComponent;
  let fixture: ComponentFixture<CloudvisualisedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloudvisualisedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudvisualisedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
