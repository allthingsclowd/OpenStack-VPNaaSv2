import { TestBed, inject } from '@angular/core/testing';

import { UserMaintenanceService } from './user-maintenance.service';

describe('UserMaintenanceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserMaintenanceService]
    });
  });

  it('should be created', inject([UserMaintenanceService], (service: UserMaintenanceService) => {
    expect(service).toBeTruthy();
  }));
});
