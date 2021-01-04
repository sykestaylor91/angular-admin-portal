import {async, inject, TestBed} from '@angular/core/testing';

import {CitationService} from './citation.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HttpBaseServiceStub} from './testing/http-base.service.stub';
import {HttpBaseService} from './http-base.service';

describe('CitationService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        CitationService,
        {provide: HttpBaseService, useClass: HttpBaseServiceStub}
      ]
    });
  }));

  it('should create instance of CitationService', () => {
      const service = new CitationService(<any>new HttpBaseServiceStub());
      expect(service).toBeTruthy();
  });

  it('should ...', inject([CitationService], (service: CitationService) => {
    expect(service).toBeTruthy();
  }));

  it('can instantiate service when inject service',
    inject([CitationService], (service: CitationService) => {
      expect(service instanceof CitationService).toBe(true);
  }));

  it('can instantiate service with "new"', inject([HttpClient], (http: HttpClient) => {
    expect(http).not.toBeNull('http should be provided');
    const service = new CitationService(<any>new HttpBaseServiceStub());
    expect(service instanceof CitationService).toBe(true, 'new service should be ok');
  }));

});
