import { TestBed, inject } from '@angular/core/testing';

import { CarrierInformationService } from './carrier-information.service';

describe('ContactInformationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CarrierInformationService]
    });
  });

  it('should be created', inject([CarrierInformationService], (service: CarrierInformationService) => {
    expect(service).toBeTruthy();
  }));
});
