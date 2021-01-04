import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityContributorAssociationsComponent } from './activity-contributor-associations.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {PermissionCheckDirective} from '../../../../shared/directives/permission-check.directive';
import {RouterTestingModule} from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';
import {instance, mock} from 'ts-mockito';
import {SessionServiceStub} from '../../../../shared/services/testing/session.service.stub';
import {SessionService} from '../../../../shared/services/session.service';
import {NotificationsService} from 'angular2-notifications';
import {UserService} from '../../../../shared/services/user.service';
import {PermissionService} from '../../../../shared/services/permission.service';

describe('ActivityContributorAssociationsComponent', () => {
  let component: ActivityContributorAssociationsComponent;
  let fixture: ComponentFixture<ActivityContributorAssociationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ ActivityContributorAssociationsComponent, PermissionCheckDirective ],
      providers: [
        {provide: MatDialog, useValue: instance(mock(MatDialog))},
        {provide: SessionService, useClass: SessionServiceStub},
        {provide: NotificationsService, useValue: instance(mock(NotificationsService))},
        {provide: PermissionService, useValue: instance(mock(PermissionService))},
        {provide: UserService, useValue: instance(mock(UserService))}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityContributorAssociationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
