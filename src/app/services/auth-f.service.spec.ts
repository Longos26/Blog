import { TestBed } from '@angular/core/testing';

import { AuthFService } from './auth-f.service';

describe('AuthFService', () => {
  let service: AuthFService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthFService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
