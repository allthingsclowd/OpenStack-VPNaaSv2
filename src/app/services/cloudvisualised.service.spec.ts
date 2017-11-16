import { TestBed, inject } from '@angular/core/testing';

import { CloudvisualisedService } from './cloudvisualised.service';

describe('CloudvisualisedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CloudvisualisedService]
    });
  });

  it('should be created', inject([CloudvisualisedService], (service: CloudvisualisedService) => {
    expect(service).toBeTruthy();
  }));
});
