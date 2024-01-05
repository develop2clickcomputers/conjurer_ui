import { TestBed, inject } from '@angular/core/testing';

import { XmlfileService } from './xmlfile.service';

describe('XmlfileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [XmlfileService]
    });
  });

  it('should be created', inject([XmlfileService], (service: XmlfileService) => {
    expect(service).toBeTruthy();
  }));
});
