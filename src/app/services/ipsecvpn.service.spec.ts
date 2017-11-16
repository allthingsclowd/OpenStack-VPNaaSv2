import { TestBed, inject } from '@angular/core/testing';

import { IpsecvpnService } from './ipsecvpn.service';

describe('IpsecvpnService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IpsecvpnService]
    });
  });

  it('should be created', inject([IpsecvpnService], (service: IpsecvpnService) => {
    expect(service).toBeTruthy();
  }));
});
