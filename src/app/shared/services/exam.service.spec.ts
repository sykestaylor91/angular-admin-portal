import {async, inject, TestBed} from '@angular/core/testing';
import {ExamService} from './exam.service';
import {HttpClientModule} from '@angular/common/http';
import {HttpBaseServiceStub} from './testing/http-base.service.stub';
import {HttpBaseService} from './http-base.service';
import {SessionService} from './session.service';

describe('ExamService', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        ExamService,
        {provide: HttpBaseService, useClass: HttpBaseServiceStub},
        {provide: SessionService, useClass: SessionService}
      ]
    });
  }));

  it('should ...', inject([ExamService], (service: ExamService) => {
    expect(service).toBeTruthy();
  }));

  it('can instantiate service when inject service',
    inject([ExamService], (service: ExamService) => {
      expect(service instanceof ExamService).toBe(true);
  }));

});
