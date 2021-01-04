import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChangeHistoryComponent } from './dialog-change-history.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ShowHtmlPipe} from '../../pipes/show-html.pipe';
import {anything, instance, mock, when} from 'ts-mockito';
import {ChangeHistoryService} from '../../services/change-history.service';
import {SessionServiceStub} from '../../services/testing/session.service.stub';
import {SessionService} from '../../services/session.service';
import {PermissionService} from '../../services/permission.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {of} from 'rxjs';
//
// describe('DialogChangeHistoryComponent', () => {
//  let component: DialogChangeHistoryComponent;
//  let fixture: ComponentFixture<DialogChangeHistoryComponent>;
//  const changeHistoryMock = mock(ChangeHistoryService);
//  const permissionMock = mock(PermissionService);
//
//  beforeEach(async(() => {
//    when(changeHistoryMock.findByKey(anything())).thenReturn(of([]));
//    when(permissionMock.filterChangeHistoryForUser(anything(), anything())).thenReturn(Promise.resolve([]));
//    TestBed.configureTestingModule({
//      declarations: [ DialogChangeHistoryComponent, ShowHtmlPipe ],
//      schemas: [NO_ERRORS_SCHEMA],
//      providers: [
//        {provide: ChangeHistoryService, useValue: instance(changeHistoryMock)},
//        {provide: SessionService, useClass: SessionServiceStub},
//        {provide: PermissionService, useValue: instance(permissionMock)},
//        {provide: MAT_DIALOG_DATA, useValue: {exam: {id: '123'}}}
//      ]
//    });
//  }));
//
//  beforeEach(() => {
//    fixture = TestBed.createComponent(DialogChangeHistoryComponent);
//    component = fixture.componentInstance;
//    fixture.detectChanges();
//  });
//
//  it('should create', () => {
//    expect(component).toBeTruthy();
//  });
// });
