import {async, inject, TestBed} from '@angular/core/testing';
import {HelpService} from './help.service';
import {HttpBaseService} from './http-base.service';
import {HttpBaseServiceStub} from './testing/http-base.service.stub';

describe('HelpService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        HelpService,
        {provide: HttpBaseService, useClass: HttpBaseServiceStub}
      ]
    });
  }));

  it('should create instance of HelpService', () => {
    const service = new HelpService(<any>new HttpBaseServiceStub());
    expect(service).toBeTruthy();
  });

  it('should ...', inject([HelpService], (service: HelpService) => {
    expect(service).toBeTruthy();
  }));

  it('can instantiate service when inject service',
    inject([HelpService], (service: HelpService) => {
      expect(service instanceof HelpService).toBe(true);
    }));

  it('can instantiate service with "new"', inject([HttpBaseService], (http: HttpBaseService) => {
    expect(http).not.toBeNull('http should be provided');
    const service = new HelpService(http);
    expect(service instanceof HelpService).toBe(true, 'new service should be ok');
  }));

});
