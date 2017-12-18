import { TestBed, inject } from '@angular/core/testing';

import { PuppeterService } from './puppeter.service';

describe('PuppeterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PuppeterService]
    });
  });

  it('should be created', inject([PuppeterService], (service: PuppeterService) => {
    expect(service).toBeTruthy();
  }));
});
