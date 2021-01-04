import { TestBed } from '@angular/core/testing';

import { ChosenUserIdService } from './chosen-user-id.service';

describe('ChosenUserIdService', () => {
  let service: ChosenUserIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChosenUserIdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
