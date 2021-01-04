import {async, inject, TestBed} from '@angular/core/testing';
import {MediaService} from './media.service';
import {HttpBaseServiceStub} from './testing/http-base.service.stub';
import {HttpBaseService} from './http-base.service';

describe('Media Service', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        MediaService,
        {provide: HttpBaseService, useClass: HttpBaseServiceStub}
      ]
    });
  }));

  it('should create instance of MediaService', () => {
    const service = new MediaService(<any>new HttpBaseServiceStub());
    expect(service).toBeTruthy();
  });

  it('should ...', inject([MediaService], (service: MediaService) => {
    expect(service).toBeTruthy();
  }));

  it('can instantiate service when inject service',
    inject([MediaService], (service: MediaService) => {
      expect(service instanceof MediaService).toBe(true);
    }));

  it('can instantiate service with "new"', inject([HttpBaseService], (http: HttpBaseService) => {
    expect(http).not.toBeNull('http should be provided');
    const service = new MediaService(http);
    expect(service instanceof MediaService).toBe(true, 'new service should be ok');
  }));

});
