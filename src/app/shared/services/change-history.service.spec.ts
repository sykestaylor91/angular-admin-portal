import {async, inject, TestBed} from '@angular/core/testing';
import {HttpBaseServiceStub} from './testing/http-base.service.stub';
import {HttpBaseService} from './http-base.service';
import {ChangeHistoryService} from './change-history.service';

describe('ChangeHistoryService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ChangeHistoryService,
        {provide: HttpBaseService, useClass: HttpBaseServiceStub}
      ]
    });
  }));

  it('should create instance of change history service', () => {
      const service = new ChangeHistoryService(<any>new HttpBaseServiceStub());
      expect(service).toBeTruthy();
  });

  it('should ...', inject([ChangeHistoryService], (service: ChangeHistoryService) => {
    expect(service).toBeTruthy();
  }));

  it('can instantiate service when inject service',
    inject([ChangeHistoryService], (service: ChangeHistoryService) => {
      expect(service instanceof ChangeHistoryService).toBe(true);
  }));

  it('can instantiate service with "new"', inject([HttpBaseService], (http: HttpBaseService) => {
    expect(http).not.toBeNull('http should be provided');
    const service = new ChangeHistoryService(http);
    expect(service instanceof ChangeHistoryService).toBe(true, 'new service should be ok');
  }));

});
