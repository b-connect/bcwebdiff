import { TestBed, inject } from '@angular/core/testing';

import { DataUrlService } from './data-url.service';

describe('DataUrlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataUrlService]
    });
  });

  it('should be created', inject([DataUrlService], (service: DataUrlService) => {
    expect(service).toBeTruthy();
  }));
});
