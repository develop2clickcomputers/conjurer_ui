import { TestBed, inject } from '@angular/core/testing';

import { CustomOutputService } from './custom-output.service';

describe('CustomOutputService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomOutputService]
    });
  });

  it('should be created', inject([CustomOutputService], (service: CustomOutputService) => {
    expect(service).toBeTruthy();
  }));
});
