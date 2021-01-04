import {async, inject, TestBed} from '@angular/core/testing';
import {ProviderOrgService} from './provider-org.service';
import {HttpBaseService} from './http-base.service';
import {HttpBaseServiceStub} from './testing/http-base.service.stub';

describe('ProviderOrgService', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ProviderOrgService,
        {provide: HttpBaseService, useClass: HttpBaseServiceStub}
      ]
    });
  }));

  it('should create instance of ProviderOrgService', () => {
    const service = new ProviderOrgService(<any>new HttpBaseServiceStub());
    expect(service).toBeTruthy();
  });

  it('should ...', inject([ProviderOrgService], (service: ProviderOrgService) => {
    expect(service).toBeTruthy();
  }));

  it('can instantiate service when inject service',
    inject([ProviderOrgService], (service: ProviderOrgService) => {
      expect(service instanceof ProviderOrgService).toBe(true);
    }));

  it('can instantiate service with "new"', inject([HttpBaseService], (http: HttpBaseService) => {
    expect(http).not.toBeNull('http should be provided');
    const service = new ProviderOrgService(http);
    expect(service instanceof ProviderOrgService).toBe(true, 'new service should be ok');
  }));

});
