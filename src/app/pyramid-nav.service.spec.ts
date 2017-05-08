import { TestBed, inject } from '@angular/core/testing';

import { PyramidNavService } from './pyramid-nav.service';

describe('PyramidNavService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PyramidNavService]
    });
  });

  it('should ...', inject([PyramidNavService], (service: PyramidNavService) => {
    expect(service).toBeTruthy();
  }));
});
