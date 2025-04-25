import { TestBed } from '@angular/core/testing';

import { MysteryService } from './mystery.service';

describe('MysteryService', () => {
  let service: MysteryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MysteryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
