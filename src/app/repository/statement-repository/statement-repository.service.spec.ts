import { TestBed, inject } from '@angular/core/testing';

import { StatementRepositoryService } from './statement-repository.service';

describe('StatementRepositoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatementRepositoryService]
    });
  });

  it('should be created', inject([StatementRepositoryService], (service: StatementRepositoryService) => {
    expect(service).toBeTruthy();
  }));
});
