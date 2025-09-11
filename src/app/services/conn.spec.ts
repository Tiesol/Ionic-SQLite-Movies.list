import { TestBed } from '@angular/core/testing';

import { Conn } from './conn';

describe('Conn', () => {
  let service: Conn;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Conn);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
