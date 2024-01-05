import { TestBed, inject } from '@angular/core/testing';

import { PolicyInformationService } from './policy-information.service';

describe('PolicyInformationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PolicyInformationService]
    });
  });

  it('should be created', inject([PolicyInformationService], (service: PolicyInformationService) => {
    expect(service).toBeTruthy();
  }));
});
