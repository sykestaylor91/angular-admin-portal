import {async, inject, TestBed} from '@angular/core/testing';
import {QuestionService} from './question.service';
import {HttpClientModule, HttpXhrBackend} from '@angular/common/http';
import {HttpTestingController} from '@angular/common/http/testing';
import {HttpBaseServiceStub} from './testing/http-base.service.stub';
import {HttpBaseService} from './http-base.service';

describe('Service: QuestionService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        QuestionService,
        {provide: HttpXhrBackend, useClass: HttpTestingController},
        {provide: HttpBaseService, useClass: HttpBaseServiceStub}
      ]
    });
  }));

  it('should ...', inject([QuestionService], (service: QuestionService) => {
    expect(service).toBeTruthy();
  }));

  it('can instantiate service when inject service',
    inject([QuestionService], (service: QuestionService) => {
      expect(service instanceof QuestionService).toBe(true);
    })
  );

});
