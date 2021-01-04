import { TestBed } from '@angular/core/testing';

import { ChosenActivityService } from './chosen-activity.service';

describe('ChosenActivityService', () => {
  let service: ChosenActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChosenActivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
