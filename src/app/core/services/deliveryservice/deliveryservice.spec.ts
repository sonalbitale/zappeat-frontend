import { TestBed } from '@angular/core/testing';

import { Deliveryservice } from './deliveryservice';

describe('Deliveryservice', () => {
  let service: Deliveryservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Deliveryservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
