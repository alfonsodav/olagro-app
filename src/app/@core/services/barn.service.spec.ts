import { TestBed } from '@angular/core/testing';

import { BarnService } from './barn.service';

describe('BarnService', () => {
  let service: BarnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
