import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { QuestionViewComponent } from './question-view.component';
import {RouterTestingModule} from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';
import {instance, mock} from 'ts-mockito';
import {SessionService} from '../../shared/services/session.service';
import {NotificationsService} from 'angular2-notifications';
import {UserService} from '../../shared/services/user.service';
import {PermissionService} from '../../shared/services/permission.service';
import {ResponseService} from '../../shared/services/response.service';
import {UserExamService} from '../../shared/services/user-exam.service';
import {ExamService} from '../../shared/services/exam.service';
import {QuestionService} from '../../shared/services/question.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ConnectionService} from 'ng-connection-service';
import {OfflineService} from '../../shared/services/offline.service';
import {EventTrackingService} from '../../shared/services/event-tracking.service';
import {Subject} from 'rxjs';

describe('QuestionViewComponent', () => {
  let component: QuestionViewComponent;
  let fixture: ComponentFixture<QuestionViewComponent>;
  const params: Subject<Params> = new Subject();
  const data: Subject<any> = new Subject();
  const monitor = function() { return  new Subject(); };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ QuestionViewComponent ],
      providers: [
        {provide: MatDialog, useValue: instance(mock(MatDialog))},
        {provide: SessionService, useValue: instance(mock(NotificationsService))},
        {provide: NotificationsService, useValue: instance(mock(NotificationsService))},
        {provide: PermissionService, useValue: instance(mock(PermissionService))},
        {provide: UserService, useValue: instance(mock(UserService))},
        {provide: ResponseService, useValue: instance(mock(ResponseService))},
        {provide: UserExamService, useValue: instance(mock(UserExamService))},
        {provide: ExamService, useValue: instance(mock(ExamService))},
        {provide: QuestionService, useValue: instance(mock(QuestionService))},
        {provide: DeviceDetectorService, useValue: instance(mock(DeviceDetectorService))},
        {provide: ConnectionService, useValue: { monitor: monitor}},
        {provide: OfflineService, useValue: instance(mock(OfflineService))},
        {provide: EventTrackingService, useValue: instance(mock(EventTrackingService))},
        {provide: ActivatedRoute, useValue: { params: params, data: data }},
        {provide: Router, useValue: { params: params }}
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
