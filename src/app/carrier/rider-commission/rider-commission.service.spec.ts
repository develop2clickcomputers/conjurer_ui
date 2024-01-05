import { TestBed, inject } from '@angular/core/testing';

import { RiderCommissionService } from './rider-commission.service';

describe('RiderCommissionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RiderCommissionService]
    });
  });

  it('should be created', inject([RiderCommissionService], (service: RiderCommissionService) => {
    expect(service).toBeTruthy();
  }));
});
