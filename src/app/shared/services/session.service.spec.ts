import {async, inject, TestBed} from '@angular/core/testing';
import {User} from '../models/user';
import {SessionService} from './session.service';
import {HttpClient, HttpClientModule, HttpXhrBackend} from '@angular/common/http';
import {HttpTestingController} from '@angular/common/http/testing';

const mockUser: User = new User({
  email: 'test@user.com'
});

describe('Service: SessionService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        SessionService,
        {provide: HttpXhrBackend, useClass: HttpTestingController}
      ]
    });
  }));

  it('should ...', inject([SessionService], (service: SessionService) => {
    expect(service).toBeTruthy();
  }));

  it('can instantiate service when inject service',
    inject([SessionService], (service: SessionService) => {
      expect(service instanceof SessionService).toBe(true);
    }));

  it('can instantiate service with "new"', inject([HttpClient], (http: HttpClient) => {
    expect(http).not.toBeNull('http should be provided');
    const service = new SessionService(http);
    expect(service instanceof SessionService).toBe(true, 'new service should be ok');
  }));

  it('can provide the mockBackend as HttpXhrBackend',
    inject([HttpXhrBackend], (backend: HttpTestingController) => {
      expect(backend).not.toBeNull('backend should be provided');
    }));


  describe('SessionService: loggedInUser ', () => {
    let service: SessionService;
    let backend: HttpTestingController;

    beforeEach(inject([HttpClient, HttpXhrBackend], (http: HttpClient, be: HttpTestingController) => {
      backend = be;
      service = new SessionService(http);

    }));

    it('should not have a logged in user ', inject([HttpClient], (http: HttpClient) => {
      expect(service.loggedInUser).not.toBeDefined('loggedInUser should be undefined ');
    }));
  });

  describe('SessionService: containsAnyRole ', () => {
    let service: SessionService;
    let backend: HttpTestingController;

    beforeEach(inject([HttpClient, HttpXhrBackend], (http: HttpClient, be: HttpTestingController) => {
      backend = be;
      service = new SessionService(http);
    }));

    it('should return true for a match', () => {
      const array1 = ['role1', 'role2', 'role3', 'role4'];
      const array2 = ['role0', 'role2', 'role5', 'role6'];
      const array3 = ['role0', 'role2'];

      expect(service.containsAnyRole(array1, array2)).toBe(true);
      // the array sizes don't matter
      expect(service.containsAnyRole(array2, array3)).toBe(true);
    });

    it('should return false for no match', () => {
      const array1 = ['role1', 'role2', 'role3', 'role4'];
      const array2 = ['role5', 'role6'];
      const array3 = [];

      expect(service.containsAnyRole(array1, array2)).toBe(false);
      expect(service.containsAnyRole(array1, array3)).toBe(false);
    });

    it('should return false for empty arrays', () => {
      const array = [];
      expect(service.containsAnyRole(array, array)).toBe(false);
    });

  });

});
