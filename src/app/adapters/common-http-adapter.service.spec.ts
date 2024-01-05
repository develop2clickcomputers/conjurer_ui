import { TestBed, inject } from '@angular/core/testing';

import { CommonHttpAdapterService } from './common-http-adapter.service';

describe('CommonHttpAdapterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommonHttpAdapterService]
    });
  });

  it('should be created', inject([CommonHttpAdapterService], (service: CommonHttpAdapterService) => {
    expect(service).toBeTruthy();
  }));
});
