import { TestBed } from '@angular/core/testing';

import { CommentsFService } from './comments-f.service';

describe('CommentsFService', () => {
  let service: CommentsFService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentsFService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
