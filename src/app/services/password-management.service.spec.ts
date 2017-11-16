import { TestBed, inject } from '@angular/core/testing';

import { PasswordManagementService } from './password-management.service';

describe('PasswordManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PasswordManagementService]
    });
  });

  it('should be created', inject([PasswordManagementService], (service: PasswordManagementService) => {
    expect(service).toBeTruthy();
  }));
});
