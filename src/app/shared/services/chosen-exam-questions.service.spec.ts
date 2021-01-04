import { TestBed } from '@angular/core/testing';

import { ChosenExamQuestionsService } from './chosen-exam-questions.service';

describe('ChosenExamQuestionsService', () => {
  let service: ChosenExamQuestionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChosenExamQuestionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
