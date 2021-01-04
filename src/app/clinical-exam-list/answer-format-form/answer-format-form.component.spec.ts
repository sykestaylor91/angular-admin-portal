import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {instance, mock} from 'ts-mockito';
import { InjectionToken } from '@angular/core';
import { AnswerFormatFormComponent } from './answer-format-form.component';
import {PermissionService} from '../../shared/services/permission.service';
import {AnswerFormatService} from '../../shared/services/answer-format.service';
import {ActivatedRoute, Params} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import {NotificationsService} from 'angular2-notifications';
import {Subject} from 'rxjs';

describe('AnswerFormatFormComponent', () => {
  let component: AnswerFormatFormComponent;
  let fixture: ComponentFixture<AnswerFormatFormComponent>;
  let params: Subject<Params>;

  beforeEach(async(() => {
    params = new Subject<Params>();
    TestBed.configureTestingModule({
      declarations: [ AnswerFormatFormComponent ],
      providers: [
        {provide: ActivatedRoute, useValue: { params: params }},
        {provide: FormBuilder, useValue: instance(mock(FormBuilder))},
        {provide: PermissionService, useValue: instance(mock(PermissionService))},
        {provide: AnswerFormatService, useValue: instance(mock(AnswerFormatService))},
        {provide: MatDialogRef, useValue: instance(mock(MatDialogRef))},
        {provide: MatDialog, useValue: instance(mock(MatDialog))},
        {provide: ActivatedRoute, useValue: { params: params }},
        {provide: MAT_DIALOG_DATA, useValue: instance(mock(InjectionToken))},
        {provide: NotificationsService, useValue: instance(mock(NotificationsService))}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerFormatFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
