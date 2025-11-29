import { TestBed } from '@angular/core/testing';

import { Targets } from './targets';

describe('Targets', () => {
  let service: Targets;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Targets);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
