import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogActionsComponent} from './dialog-actions.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SafeHtmlPipe} from '../../pipes/safe-html.pipe';
import {instance, mock} from 'ts-mockito';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('DialogActionsComponent', () => {
  let component: DialogActionsComponent;
  let fixture: ComponentFixture<DialogActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogActionsComponent, SafeHtmlPipe],
      providers: [
        {provide: MatDialogRef, useValue: instance(mock(MatDialogRef))},
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
