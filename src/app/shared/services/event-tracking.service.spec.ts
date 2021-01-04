import { TestBed, inject } from '@angular/core/testing';
import {instance, mock} from 'ts-mockito';
import { EventTrackingService } from './event-tracking.service';
import {HttpBaseService} from './http-base.service';
import {HttpBaseServiceStub} from './testing/http-base.service.stub';
import {SessionService} from './session.service';
import {SessionServiceStub} from './testing/session.service.stub';
import {NotificationsService} from 'angular2-notifications';

describe('EventTrackingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventTrackingService,
        {provide: NotificationsService, useValue: instance(mock(NotificationsService))},
        {provide: SessionService, useClass: SessionServiceStub},
        {provide: HttpBaseService, useClass: HttpBaseServiceStub}
      ]
    });
  });

  it('should be created', inject([EventTrackingService], (service: EventTrackingService) => {
    expect(service).toBeTruthy();
  }));
});
