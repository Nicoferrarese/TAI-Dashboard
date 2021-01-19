import { TestBed } from '@angular/core/testing';

import { ServiceLine } from './service.service';

describe('ServiceService', () => {
  let service: ServiceLine;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceLine);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
