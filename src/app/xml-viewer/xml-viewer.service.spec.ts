import { TestBed, inject } from '@angular/core/testing';

import { XMLViewerService } from './xml-viewer.service';

describe('XMLViewerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [XMLViewerService]
    });
  });

  it('should be created', inject([XMLViewerService], (service: XMLViewerService) => {
    expect(service).toBeTruthy();
  }));
});
