import { TestBed, inject } from '@angular/core/testing';

import { LoadbalancerService } from './loadbalancer.service';

describe('LoadbalancerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadbalancerService]
    });
  });

  it('should be created', inject([LoadbalancerService], (service: LoadbalancerService) => {
    expect(service).toBeTruthy();
  }));
});
