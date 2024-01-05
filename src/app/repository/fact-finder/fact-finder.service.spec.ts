import { TestBed, inject } from '@angular/core/testing';

import { FactFinderService } from './fact-finder.service';

describe('FactFinderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FactFinderService]
    });
  });

  it('should be created', inject([FactFinderService], (service: FactFinderService) => {
    expect(service).toBeTruthy();
  }));
});
