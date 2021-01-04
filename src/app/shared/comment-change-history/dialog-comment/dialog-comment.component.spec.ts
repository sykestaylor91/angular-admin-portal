import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCommentComponent } from './dialog-comment.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SessionService} from '../../services/session.service';
import {SessionServiceStub} from '../../services/testing/session.service.stub';
import {PermissionService} from '../../services/permission.service';
import {anything, instance, mock, when} from 'ts-mockito';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ContentPermissions} from '../../models/action-permissions';

describe('DialogCommentComponent', () => {
  let component: DialogCommentComponent;
  let fixture: ComponentFixture<DialogCommentComponent>;
  const permissionMock = mock(PermissionService);

  beforeEach(async(() => {
    when(permissionMock.markCommentsForUserPermissions(anything(), anything(), anything())).thenReturn(Promise.resolve([]));
    TestBed.configureTestingModule({
      declarations: [ DialogCommentComponent ],
      providers: [
        {provide: SessionService, useClass: SessionServiceStub},
        {provide: PermissionService, useValue: instance(permissionMock)},
        {provide: MatDialogRef, useValue: instance(mock(MatDialogRef))},
        {provide: MAT_DIALOG_DATA, useValue: {
            permissions: {
              add: ContentPermissions.all,
              view: ContentPermissions.all,
              viewBlind: ContentPermissions.all,
              edit: ContentPermissions.all
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
