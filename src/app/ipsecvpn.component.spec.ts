import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpsecvpnComponent } from './ipsecvpn.component';

describe('IpsecvpnComponent', () => {
  let component: IpsecvpnComponent;
  let fixture: ComponentFixture<IpsecvpnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpsecvpnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpsecvpnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
