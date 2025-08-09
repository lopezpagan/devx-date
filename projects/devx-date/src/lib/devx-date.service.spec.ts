import { TestBed } from '@angular/core/testing';

import { DevxDateService } from './devx-date.service';

describe('DevxDateService', () => {
  let service: DevxDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevxDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
