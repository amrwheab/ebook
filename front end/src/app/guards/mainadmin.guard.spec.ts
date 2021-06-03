import { TestBed } from '@angular/core/testing';

import { MainadminGuard } from './mainadmin.guard';

describe('MainadminGuard', () => {
  let guard: MainadminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MainadminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
